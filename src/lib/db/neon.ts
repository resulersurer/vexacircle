import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("DATABASE_URL is not defined. Database calls will fail until it is set.");
}

const sql = connectionString ? neon(connectionString) : null;
export const db = sql
  ? drizzle(sql, { schema })
  : (null as unknown as ReturnType<typeof drizzle>);
