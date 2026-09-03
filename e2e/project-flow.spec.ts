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
  await expect(page.getByText("Actualización por oportunidad")).toBeVisible();
  await expect(page.getByText("Inferido, pendiente de confirmación").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Tus próximos tres pasos" })).toBeVisible();
  await expect(page.getByText("Aún no has elegido un apoyo", { exact: true })).toBeVisible();
  await page.screenshot({ path: test.info().outputPath("ficha-inicial.png"), fullPage: true });
  await page.getByText("2. Qué has desarrollado hasta ahora", { exact: false }).click();

  const technology = page.locator("#antecedentes article").filter({ has: page.getByRole("heading", { name: "Componente tecnológico", exact: true }) });
  await technology.getByRole("button", { name: "Confirmar" }).click();
  await expect(technology.getByText("Confirmado por el usuario, no validado")).toBeVisible();

  await page.getByText("3. Desde dónde y cómo comenzarías", { exact: false }).click();
  const sales = page.locator("#antecedentes article").filter({ has: page.getByRole("heading", { name: "Ventas formales", exact: true }) });
  await sales.getByRole("combobox").selectOption("false");
  await sales.getByRole("button", { name: "Confirmar", exact: true }).click();
  await expect(sales.getByText("Confirmado por el usuario, no validado")).toBeVisible();
  await page.reload();
  await page.getByText("3. Desde dónde y cómo comenzarías", { exact: false }).click();
  await expect(sales.getByRole("combobox")).toHaveValue("false");

  await page.getByText("Otros antecedentes, cuando los necesites", { exact: true }).click();
  const ageAnswer = page.locator("#antecedentes article").filter({ has: page.getByRole("heading", { name: "Edad", exact: true }) });
  await ageAnswer.getByRole("button", { name: "Confirmar", exact: true }).click();
  await expect(ageAnswer.getByText("Pendiente", { exact: true })).toBeVisible();
  await page.getByText("Otros antecedentes, cuando los necesites", { exact: true }).click();
  const firstOpportunity = page.locator("#oportunidades article").filter({ has: page.getByRole("heading", { name: /Capital Semilla Emprende Región Metropolitana/i }) });
  await firstOpportunity.getByText("Datos para preparar una futura revisión", { exact: true }).click();
  await firstOpportunity.getByRole("link", { name: "Edad", exact: true }).click();
  await expect(ageAnswer.getByRole("textbox")).toBeVisible();

  await page.getByRole("link", { name: "Vista transversal" }).click();
  await expect(page).toHaveURL(/\?checklist=transversal#checklist$/);
  await expect(page.getByRole("link", { name: "Vista transversal" })).toHaveAttribute("aria-current", "page");
  const ageChecklistItem = page.locator("#checklist article").filter({ has: page.getByRole("heading", { name: "Edad", exact: true }) });
  await expect(ageChecklistItem.getByText("Responsable: Persona postulante · Verifica: FOSIS", { exact: true })).toBeVisible();
  await ageChecklistItem.getByLabel("Estado de Edad").selectOption("user_completed_unvalidated");
  await ageChecklistItem.getByRole("button", { name: "Guardar estado de Edad" }).click();
  await expect(ageChecklistItem.getByText("Completado por el usuario, no validado")).toBeVisible();
});
