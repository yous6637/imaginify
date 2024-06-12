"use server";

import { revalidatePath } from "next/cache";
import { handleError } from "../utils";
import { redirect } from "next/navigation";
import { v2 as cloudinary } from "cloudinary";
import { db } from "@/database";
import { images, users } from "@/database/schema";
import { count, eq, getTableColumns, inArray } from "drizzle-orm";
import { AnyColumn, sql } from "drizzle-orm";
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME } from "@/constants/variables";

const customCount = (column?: AnyColumn) => {
  if (column) {
    return sql<number>`cast(count(${column}) as integer)`;
  } else {
    return sql<number>`cast(count(*) as integer)`;
  }
};

const getImagesSql = () => {
  const imagesColumns = getTableColumns(images);
  return db
    .select({ ...imagesColumns, author: users })
    .from(images)
    .leftJoin(users, eq(images.author, users.id));
};

// ADD IMAGE
export async function addImage({ image, userId, path }: AddImageParams) {
  try {
    const author = (await db.select().from(users)).find(
      (value) => value.id === userId
    );

    if (!author) {
      throw new Error("User not found");
    }

    const newImage = await db
      .insert(images)
      .values({ ...image, author: author.id })
      .returning(getTableColumns(images));

    revalidatePath(path);

    return JSON.parse(JSON.stringify(newImage));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE IMAGE
export async function updateImage({ image, userId, path }: UpdateImageParams) {
  try {
    const imageToUpdate = (await db.select().from(images)).find(
      (value) => value.id === image._id
    );

    if (!imageToUpdate || imageToUpdate.author !== userId) {
      throw new Error("Unauthorized or image not found");
    }

    const updatedImage = await db
      .update(images)
      .set(image)
      .where(eq(images.id, imageToUpdate.id));

    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedImage));
  } catch (error) {
    handleError(error);
  }
}

// DELETE IMAGE
export async function deleteImage(imageId: string) {
  try {
    await db.delete(images).where(eq(images.id, imageId));
  } catch (error) {
    handleError(error);
  } finally {
    redirect("/");
  }
}

// GET IMAGE
export async function getImageById(imageId: string) {
  try {
    const image = (await getImagesSql()).find((value) => value.id == imageId);

    if (!image) throw new Error("Image not found");

    return JSON.parse(JSON.stringify(image));
  } catch (error) {
    handleError(error);
  }
}

// GET IMAGES
export async function getAllImages({
  limit = 9,
  page = 1,
  searchQuery = "",
}: {
  limit?: number;
  page: number;
  searchQuery?: string;
}) {
  try {
    cloudinary.config({
      cloud_name: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      secure: true,
    });

    let expression = "folder=imaginify";

    if (searchQuery) {
      expression += ` AND ${searchQuery}`;
    }

    const { resources } = await cloudinary.search
      .expression(expression)
      .execute();

    const resourceIds = resources.map((resource: any) => resource.public_id);

    const sql = searchQuery
      ? db.select().from(images).where(inArray(images.publicId, resourceIds))
      : db.select().from(images);

    let query = {};

    if (searchQuery) {
      query = {
        publicId: {
          $in: resourceIds,
        },
      };
    }

    const skipAmount = (Number(page) - 1) * Number(limit);

    const Images = (await sql.limit(limit))?.sort(
      (v1, v2) => v1.updatedAt.getTime() - v2.updatedAt.getTime()
    );

    const totalImages = (await sql).length;
    const savedImages = (await db.select().from(images)).length;

    return {
      data: JSON.parse(JSON.stringify(Images)),
      totalPage: Math.ceil(totalImages / limit),
      savedImages,
    };
  } catch (error) {
    console.log({ error });
    throw new Error("something went wrong with db");
  }
}

// GET IMAGES BY USER
export async function getUserImages({
  limit = 9,
  page = 1,
  userId,
}: {
  limit?: number;
  page: number;
  userId: string;
}) {
  try {
    const UserImages = (
      await getImagesSql().where(eq(images.author, userId)).limit(limit)
    ).sort((v1, v2) => v1.updatedAt.getTime() - v2.updatedAt.getTime());

    const totalImages =
      (await db.select({ count: customCount() }).from(images)).at(0)?.count ||
      0;
    return {
      data: JSON.parse(JSON.stringify(UserImages)),
      totalPages: Math.ceil(totalImages / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
