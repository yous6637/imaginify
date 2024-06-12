import type { Config } from "drizzle-kit";

import { DATABASE_URL } from "./constants/variables";



if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable not set");
}

export default {
  dialect: "postgresql",
  schema: "./database/schema.ts",
  out: "./drizzle/",
  dbCredentials: {
    url: DATABASE_URL,
  },
} as Config;
