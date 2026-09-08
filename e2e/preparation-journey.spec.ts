import { expect, test } from "@playwright/test";

const callId = "sercotec-modo-empleo-atacama-2026";

test("prepares one stage at a time, reuses saved answers and resumes without mixing requirements", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(`/registro?oportunidad=${callId}`);
  await page.getByLabel("Nombre", { exact: true }).fill("Persona del recorrido");
  await page.getByLabel("Correo electrónico").fill(`ruta-${Date.now()}-${test.info().project.name}@example.test`);
  await page.getByLabel("Contraseña", { exact: true }).fill("Recorrido-seguro-2026");
  await page.getByRole("button", { name: "Crear cuenta", exact: true }).click();
  await page.getByRole("link", { name: /Crear un proyecto para este apoyo/ }).click();
  await page.getByLabel(/Cuéntanos tu idea de proyecto/).fill("Un taller textil circular transforma telas recuperadas en productos para hogares y comercios de Atacama.");
  await page.getByRole("button", { name: "Crear proyecto y ordenar antecedentes" }).click();
  await expect(page.getByRole("heading", { name: "Prepara tu próxima oportunidad" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Etapas de preparación" }).getByRole("button")).toHaveCount(6);
  const projectUrl = page.url();

  await page.getByRole("button", { name: /Desarrolla tu propuesta/ }).click();
  await page.getByRole("textbox", { name: "Tu respuesta" }).fill("Se desechan telas que todavía pueden aprovecharse.");
  await page.getByRole("button", { name: "Guardar y continuar" }).click();
  await expect(page.getByText("1 de 3 tareas preparadas", { exact: true })).toBeVisible();
  await expect(page.getByText("Respuesta reutilizada de tu ficha", { exact: true })).toHaveCount(1);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({ path: test.info().outputPath("recorrido-propuesta.png"), fullPage: true });
  await expect(page.getByRole("button", { name: /Describe tu solución/ })).toHaveAttribute("aria-expanded", "true");

  await page.getByRole("textbox", { name: "Tu respuesta" }).fill("Creamos productos textiles con telas recuperadas.");
  page.once("dialog", dialog => dialog.dismiss());
  await page.getByRole("button", { name: /Organiza tu presupuesto/ }).click();
  await expect(page.getByRole("textbox", { name: "Tu respuesta" })).toHaveValue("Creamos productos textiles con telas recuperadas.");
  await page.getByRole("button", { name: "Guardar y continuar" }).click();
  await expect(page.getByText("2 de 3 tareas preparadas", { exact: true })).toBeVisible();
  await page.getByRole("textbox", { name: "Tu respuesta" }).fill("Hogares y pequeños comercios de Atacama.");
  await page.getByRole("button", { name: "Guardar y continuar" }).click();
  await expect(page.getByText("3 de 3 tareas preparadas", { exact: true })).toBeVisible();
  await expect(page.getByRole("textbox")).toHaveCount(0);
  await page.getByRole("button", { name: "Continuar a la siguiente etapa" }).click();
  await expect(page.getByRole("heading", { name: "Planifica cuánto necesitas" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Planifica cuánto necesitas" })).toBeVisible();

  await page.getByRole("button", { name: /Reúne los respaldos/ }).click();
  await page.getByRole("combobox", { name: "Estado de preparación" }).selectOption("user_completed_unvalidated");
  await page.getByRole("textbox", { name: "Nota opcional" }).fill("Certificado preparado; revisar vigencia antes de presentar.");
  await page.getByRole("button", { name: "Guardar preparación" }).click();
  await expect(page.getByText("1 de 1 tareas preparadas", { exact: true })).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: /Certificado de cotizaciones/ }).click();
  await expect(page.getByRole("textbox", { name: "Nota opcional" })).toHaveValue("Certificado preparado; revisar vigencia antes de presentar.");

  await page.getByRole("button", { name: /Revisa y presenta/ }).click();
  await expect(page.getByText("0 de 1 tareas preparadas", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /Sigue el resultado/ }).click();
  await expect(page.getByText(/No necesitas completar esta etapa/)).toBeVisible();
  await page.getByRole("link", { name: "Ver todos los requisitos" }).click();
  await expect(page.getByRole("heading", { name: "Checklist de preparación" })).toBeVisible();
  await expect(page.locator("#checklist article")).toHaveCount(10);
  await page.getByRole("link", { name: "Vista transversal" }).click();
  await expect(page.getByRole("heading", { name: "Checklist de preparación" })).toBeVisible();
  await page.getByRole("link", { name: "Volver a mi recorrido" }).click();
  await page.getByRole("button", { name: /Desarrolla tu propuesta/ }).click();
  await expect(page.getByText("3 de 3 tareas preparadas", { exact: true })).toBeVisible();
  await page.goto(projectUrl);
  await expect(page.getByRole("heading", { name: "Dale forma a tu propuesta" })).toBeVisible();
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
