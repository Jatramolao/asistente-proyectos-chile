import { expect, test } from "@playwright/test";

test("explores public evidence and carries a selected support through registration into a project", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Explorar apoyos sin cuenta" }).click();
  await expect(page.getByRole("heading", { name: "Encuentra apoyo para empezar." })).toBeVisible();
  await page.screenshot({ path: test.info().outputPath("catalogo.png"), fullPage: true });
  await page.getByLabel("Disponibilidad", { exact: true }).selectOption("all");
  await page.getByLabel("Tu región").selectOption("metropolitana");
  await page.getByRole("button", { name: "Buscar apoyos" }).click();
  await expect(page.locator('article').filter({ hasText: "Modo Empleo" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Centros de Desarrollo de Negocios" })).toBeVisible();

  await page.getByLabel("Qué buscas").selectOption("learn");
  await page.getByRole("button", { name: "Buscar apoyos" }).click();
  await expect(page.getByRole("heading", { name: "2 opciones para explorar" })).toBeVisible();
  await page.getByRole("link", { name: "Portal de Capacitación Sercotec", exact: true }).click();
  await expect(page.getByRole("heading", { name: "¿Qué tendría que aportar?" })).toBeVisible();
  await expect(page.getByText("Capacitación gratuita. No es financiamiento para el proyecto.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Portal de Capacitación Sercotec ↗", exact: true })).toHaveAttribute("href", "https://capacitacion.sercotec.cl/portal/");
  await page.screenshot({ path: test.info().outputPath("ficha-apoyo.png"), fullPage: true });
  await page.getByRole("link", { name: "Llevar este apoyo a mi proyecto" }).click();
  await expect(page).toHaveURL(/ingresar\?oportunidad=sercotec-capacitacion/);
  await page.getByRole("link", { name: "Regístrate", exact: true }).click();
  await expect(page).toHaveURL(/registro\?oportunidad=sercotec-capacitacion/);
  await page.getByLabel("Nombre", { exact: true }).fill("Principiante catálogo");
  await page.getByLabel("Correo electrónico").fill(`catalogo-${Date.now()}-${test.info().project.name}@example.test`);
  await page.getByLabel("Contraseña", { exact: true }).fill("Catalogo-prueba-segura-2026");
  await page.getByRole("button", { name: "Crear cuenta", exact: true }).click();
  await expect(page).toHaveURL(/catalogo\/sercotec-capacitacion\/preparar/);
  await page.getByRole("link", { name: /Crear un proyecto para este apoyo/ }).click();
  await page.getByLabel(/Cuéntanos tu idea de proyecto/).fill("Quiero desarrollar una plataforma para ayudar a pequeñas empresas a organizar sus ventas y detectar problemas de inventario.");
  await page.getByRole("button", { name: "Crear proyecto y ordenar antecedentes" }).click();
  await expect(page.getByText("Preparando 1 apoyo elegido", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.locator("#oportunidades article")).toHaveCount(1);
  await expect(page.locator("#checklist").getByRole("heading", { name: "Portal de Capacitación Sercotec", exact: true })).toBeVisible();

  await page.goto("/catalogo/corfo-build-programa");
  await expect(page.getByText("Sin fecha publicada", { exact: true })).toHaveCount(2);
  await page.getByRole("link", { name: "Preparar mi idea para este programa" }).click();
  await page.getByRole("button", { name: "Guardar apoyo en este proyecto" }).click();
  await expect(page.getByText("Preparando 2 apoyos elegidos", { exact: true })).toBeVisible();
  await page.locator("#oportunidades article").filter({ has: page.getByRole("heading", { name: "Build · Start-Up Chile", exact: true }) }).getByRole("button", { name: "Quitar de mi preparación" }).click();
  await expect(page.getByText("Preparando 1 apoyo elegido", { exact: true })).toBeVisible();
});

test("shows an honest empty state and exact official deadline", async ({ page }) => {
  await page.goto("/catalogo?region=arica&stage=operating&goal=validate&availability=all");
  await expect(page.getByRole("heading", { name: "No encontramos apoyos con estos filtros" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Ver todos los apoyos" })).toBeVisible();
  await page.goto("/catalogo/sercotec-modo-empleo-atacama-2026");
  await expect(page.getByText(/8 de septiembre de 2026.*15:00/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Bases Modo Empleo Atacama 2026 ↗", exact: true })).toHaveAttribute("href", /Bases-Capital-Semilla-Modo-Empleo-Atacama-2026-1.pdf/);
  await page.screenshot({ path: test.info().outputPath("ficha-financiamiento.png"), fullPage: true });
  await page.goto("/catalogo/no-existe");
  await expect(page.getByText("404", { exact: true })).toBeVisible();
});
