



// drizzle shcema
import { randomFill, randomUUID } from "crypto";
import { integer, pgTable, jsonb, serial, text,timestamp ,  varchar,pgEnum,PgTableExtraConfig ,PgTableWithColumns, uuid  } from "drizzle-orm/pg-core";


// image model

export const images = pgTable('images', {
    id: text('id').primaryKey().$default(() => randomUUID()),
    title: varchar('title', { length: 255 }).notNull(),
    transformationType: varchar('transformation_type', { length: 255 }).notNull(),
    publicId: varchar('public_id', { length: 255 }).notNull(),
    secureURL: varchar('secure_url', { length: 255 }).notNull(),
    width: integer('width').notNull(),
    height: integer('height').notNull(),
    config: jsonb('config').$type<Record<string, any>>(),
    transformationUrl: varchar('transformation_url', { length: 255 }),
    aspectRatio: varchar('aspect_ratio', { length: 255 }),
    color: varchar('color', { length: 255 }),
    prompt: varchar('prompt', { length: 255 }),
    author: text('author').notNull().references(() => users.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  });


export const users = pgTable('users', {
    id: varchar('clerk_id', { length: 255 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    username: varchar('username', { length: 255 }).notNull().unique(),
    photo: varchar('photo', { length: 255 }).notNull(),
    firstName: varchar('first_name', { length: 255 }),
    lastName: varchar('last_name', { length: 255 }),
    planId: integer('plan_id').default(1),
    creditBalance: integer('credit_balance').notNull().default(10),
  });



export const transactions = pgTable('transactions', {
    id: serial('id').primaryKey(),
    createdAt: timestamp('created_at').defaultNow(),
    stripeId: varchar('stripe_id', { length: 255 }).notNull().unique(),
    amount: integer('amount').notNull(),
    plan: varchar('plan', { length: 255 }),
    credits: integer('credits'),
    buyerId: text('buyer_id').references(()=> users.id),
  });