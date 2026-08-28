import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { createDb } from "./db/core";
import { runMigrations } from "./db/migrate";

const database = createDb();
runMigrations(database);

export const auth = betterAuth({
  appName: "Impulsa Proyectos",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  database,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 10,
    maxPasswordLength: 128,
  },
  plugins: [nextCookies()],
  trustedOrigins: [process.env.BETTER_AUTH_URL ?? "http://localhost:3000"],
});
