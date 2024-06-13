"use server";

import { revalidatePath } from "next/cache";

import { handleError } from "../utils";
import { db } from "@/database";
import { users } from "@/database/schema";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { CreateUserParams, IUser, UpdateUserParams } from "@/types";

// CREATE
export async function createUser(user: CreateUserParams) {
  try {
    const newUser = await db
      .insert(users)
      .values({ ...user, id: user.clerkId })
      .returning(getTableColumns(users));

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

// READ
export async function getUserById(userId?: string | null) {
  try {
    if (!userId) throw new Error("User ID is required");
    const user = (await db.select().from(users).where(eq(users.id, userId))).at(
      0
    );

    if (!user) throw new Error("User not found");

    return user;
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    const updatedUser = await db
      .update(users)
      .set(user)
      .where(eq(users.id, clerkId))
      .returning(getTableColumns(users));

    if (!updatedUser) throw new Error("User update failed");

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteUser(clerkId: string) {
  try {
    // Find user to delete
    const userToDelete = (
      await db.select().from(users).where(eq(users.id, clerkId))
    ).at(0);

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Delete user
    const deletedUser = await db.delete(users).where(eq(users.id, clerkId));
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
}

// USE CREDITS
export async function updateCredits(userId: string, creditFee: number) {
  try {
    const updatedUserCredits = await db
      .update(users)
      .set({ creditBalance: sql`${users.creditBalance} + ${creditFee}` })
      .where(eq(users.id, userId))
      .returning(getTableColumns(users));

    if (!updatedUserCredits) throw new Error("User credits update failed");

    return JSON.parse(JSON.stringify(updatedUserCredits));
  } catch (error) {
    handleError(error);
  }
}
