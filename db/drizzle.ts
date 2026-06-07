// import { drizzle } from "drizzle-orm/postgres-js";
// import postgres from "postgres";
// import { schema } from "./schema";

// const client = postgres(process.env.DATABASE_URL!);
// export const db = drizzle(client, { schema });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { schema } from "./schema";

const connectionString = process.env.DATABASE_URL!;

// 1. Definisikan container global khusus agar TypeScript tidak komplain
const globalForDrizzle = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

// 2. Gunakan koneksi yang sudah ada di memori global, atau buat baru jika belum ada
// Opsi max: 1 menjaga agar pooling koneksi sangat hemat dan ramah untuk server serverless/dev mode
const conn =
  globalForDrizzle.conn ||
  postgres(connectionString, {
    prepare: false,
    max: 1,
  });

// 3. Jika berada di mode development, simpan koneksi ini ke global scope agar tidak ter-duplicate saat hot-reload
if (process.env.NODE_ENV !== "production") {
  globalForDrizzle.conn = conn;
}

// 4. Ekspor instance database tunggal yang aman digunakan berkali-kali
export const db = drizzle(conn, { schema });
