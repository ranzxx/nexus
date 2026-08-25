import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { schema } from "./schema";

const connectionString = process.env.DATABASE_URL!;

const globalForDrizzle = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn =
  globalForDrizzle.conn ||
  postgres(connectionString, {
    prepare: false,
    max: 1,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDrizzle.conn = conn;
}

export const db = drizzle(conn, { schema });