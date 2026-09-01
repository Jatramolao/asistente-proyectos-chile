import { expect, test } from "@playwright/test";

test("creates a project from an idea and keeps inferred facts unvalidated", async ({ page }) => {
  const email = `persona-${Date.now()}-${test.info().project.name}@example.test`;

  await page.goto("/registro");
  await page.getByLabel("Nombre").fill("Persona emprendedora");
  await page.getByLabel("Correo electrónico").fill(email);
  await page.getByLabel("Contraseña").fill("Una-clave-segura-2026");
  await page.getByRole("button", { name: "Crear cuenta" }).click();
  await expect(page).toHaveURL(/\/proyectos$/);

  await page.getByRole("link", { name: /describir mi proyecto|nueva idea/i }).first().click();
  await page.getByLabel(/cuéntanos tu idea/i).fill(
    "Una plataforma con sensores permite detectar fugas de agua en edificios antes de que causen pérdidas a las comunidades.",
  );
  await page.getByRole("button", { name: /crear proyecto y ordenar antecedentes/i }).click();

  await expect(page).toHaveURL(/\/proyectos\/[a-f0-9-]+$/);
  await expect(page.getByRole("heading", { name: "Fondos y beneficios relacionados" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Checklist de preparación" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Por convocatoria" })).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("heading", { name: /Capital Semilla Emprende Región Metropolitana/i }).first()).toBeVisible();
  await expect(page.getByText("Fuentes revisadas recientemente")).toBeVisible();
  await expect(page.getByText("Inferido, pendiente de confirmación").first()).toBeVisible();

  const technology = page.locator("article").filter({ hasText: "Componente tecnológico" });
  await technology.getByRole("button", { name: "Confirmar" }).click();
  await expect(technology.getByText("Confirmado por el usuario, no validado")).toBeVisible();

  await page.getByRole("link", { name: "Vista transversal" }).click();
  await expect(page).toHaveURL(/\?checklist=transversal#checklist$/);
  await expect(page.getByRole("link", { name: "Vista transversal" })).toHaveAttribute("aria-current", "page");
  const ageChecklistItem = page.locator("article").filter({ has: page.getByRole("heading", { name: "Edad", exact: true }) });
  await ageChecklistItem.getByLabel("Estado de Edad").selectOption("user_completed_unvalidated");
  await ageChecklistItem.getByRole("button", { name: "Guardar" }).click();
  await expect(ageChecklistItem.getByText("Completado por el usuario, no validado")).toBeVisible();
});
