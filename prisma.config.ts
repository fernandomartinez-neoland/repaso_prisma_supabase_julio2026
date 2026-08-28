import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // La CLI (migrate, db push, introspect...) necesita una conexión
    // de sesión directa, no el pooler en modo transaction (pgbouncer=true).
    url: env("DIRECT_URL"),
  },
});