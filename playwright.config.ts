import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.E2E_PORT ?? "3108");
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  webServer: {
    command: `DATABASE_PATH=/private/tmp/asistente-proyectos-e2e-${port}.sqlite BETTER_AUTH_SECRET=e2e-secret-with-at-least-thirty-two-characters BETTER_AUTH_URL=${baseURL} npm run dev -- --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
  ],
});
