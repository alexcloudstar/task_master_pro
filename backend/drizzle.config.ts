import { Config, defineConfig } from "drizzle-kit";
import { env } from "./config";


export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
    dbCredentials: {

        host: env.DB_HOST as string,
        user: env.DB_USER as string,
        password: env.DB_PASSWORD as string,
        port: +env.DB_PORT! as number,
        database: env.DB_NAME as string,
        ssl: false,
    }
}) satisfies Config;
