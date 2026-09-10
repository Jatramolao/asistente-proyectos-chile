import { expect, test } from "@playwright/test";

test("All In separates registration and Encargo drafts and keeps future stages informational", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  if (test.info().project.name === "mobile-chromium") await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/registro?oportunidad=duoc-allin-chile-2026");
  await page.getByLabel("Nombre", { exact: true }).fill("Estudiante de informática");
  await page.getByLabel("Correo electrónico").fill(`allin-${Date.now()}-${test.info().project.name}@example.test`);
  await page.getByLabel("Contraseña", { exact: true }).fill("Recorrido-seguro-2026");
  await page.getByRole("button", { name: "Crear cuenta", exact: true }).click();
  await page.getByRole("link", { name: /Crear un proyecto para este apoyo/ }).click();
  await page.getByLabel(/Cuéntanos tu idea de proyecto/).fill("Queremos ayudar a estudiantes de informática a organizar equipos para sus proyectos académicos.");
  await page.getByRole("button", { name: "Crear proyecto y ordenar antecedentes" }).click();
  await expect(page.getByRole("heading", { name: "Comprueba si pueden participar" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Etapas de preparación" }).getByRole("button")).toHaveCount(6);
  await expect(page.getByText(/Indica si serás titular como estudiante regular/)).toBeVisible();
  await page.getByRole("button", { name: "Ver orientación: Confirma quién representará al equipo" }).click();
  await expect(page.getByRole("dialog", { name: "Confirma quién representará al equipo" })).toBeVisible();
  await expect(page.getByRole("dialog").getByRole("heading", { name: "Confirma quién representará al equipo", exact: true })).toBeFocused();
  for (let index = 0; index < 6; index += 1) {
    await page.keyboard.press("Tab");
    const focus = await page.getByRole("dialog").evaluate(dialog => ({
      inside: dialog.contains(document.activeElement),
      tag: document.activeElement?.tagName,
      name: document.activeElement?.getAttribute("aria-label") ?? document.activeElement?.textContent?.trim().slice(0, 80),
    }));
    expect(focus.inside, `Paso ${index + 1}: ${JSON.stringify(focus)}`).toBe(true);
  }
  await page.getByText("Requisito completo y fuentes").click();
  const officialSource = page.getByRole("link", { name: /Bases All In Chile 2026.*abre en una pestaña nueva/i });
  await expect(officialSource).toHaveAttribute("target", "_blank");
  await page.getByRole("button", { name: "Cerrar orientación" }).click();
  await page.getByRole("combobox", { name: "Tu respuesta" }).selectOption("student");
  await page.getByRole("button", { name: "Guardar y continuar" }).click();
  await expect(page.getByText("1 de 3 tareas preparadas", { exact: true })).toBeVisible();
  await page.getByRole("combobox", { name: "Tu respuesta" }).selectOption("2");
  await page.getByRole("button", { name: "Guardar y continuar" }).click();
  await expect(page.getByText("2 de 3 tareas preparadas", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /Idea e inscripción/ }).click();
  await page.getByRole("textbox", { name: "Tu respuesta" }).fill("Idea inicial independiente");
  const introTrigger = page.getByRole("button", { name: "Ver orientación: Explica el problema inicial" });
  await introTrigger.click();
  await expect(page.getByRole("dialog", { name: "Explica el problema inicial" })).toBeVisible();
  await expect(page.getByText("Quién experimenta la dificultad.")).toBeVisible();
  if (test.info().project.name === "mobile-chromium") {
    const expand = page.getByRole("button", { name: "Ampliar orientación" });
    await expand.click();
    await expect(page.getByRole("button", { name: "Restaurar orientación" })).toHaveAttribute("aria-expanded", "true");
    await page.setViewportSize({ width: 320, height: 700 });
    await expect(page.getByText("Quién experimenta la dificultad.")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  } else {
    await page.setViewportSize({ width: 760, height: 800 });
    await expect(page.getByRole("button", { name: "Ampliar orientación" })).toBeVisible();
    await expect(page.getByText("Quién experimenta la dificultad.")).toBeVisible();
    await page.setViewportSize({ width: 1280, height: 720 });
  }
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(introTrigger).toBeFocused();
  await expect(page.getByRole("textbox", { name: "Tu respuesta" })).toHaveValue("Idea inicial independiente");
  await page.getByRole("button", { name: "Guardar y continuar" }).click();
  await expect(page.getByText("1 de 5 tareas preparadas", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /Registra la recepción de tu inscripción/ }).click();
  await expect(page.getByText("La inscripción se realiza en el sitio oficial; guardar aquí no la envía.")).toBeVisible();
  await page.getByRole("button", { name: "Ver orientación: Registra la recepción de tu inscripción" }).click();
  await expect(page.getByText("Comprueba el correo de recepción antes de confirmar esta tarea.")).toBeVisible();
  await page.getByRole("button", { name: "Volver a mi respuesta" }).click();
  await page.getByRole("button", { name: /Desarrolla el Encargo 1/ }).click();
  await page.getByRole("button", { name: /Desarrolla el problema y su impacto/ }).click();
  await expect(page.getByRole("textbox", { name: "Tu respuesta" })).toHaveValue("Idea inicial independiente");
  await page.getByRole("textbox", { name: "Tu respuesta" }).fill("a".repeat(679));
  await expect(page.getByText(/679 caracteres.*Faltan 1/)).toBeVisible();
  await page.getByRole("button", { name: "Guardar borrador" }).click();
  await expect(page.getByText("Cambios guardados en tu proyecto.")).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: /Desarrolla el problema y su impacto/ }).click();
  await expect(page.getByRole("textbox", { name: "Tu respuesta" })).toHaveValue("a".repeat(679));
  await page.getByRole("textbox", { name: "Tu respuesta" }).fill("a".repeat(680));
  await page.getByRole("button", { name: "Guardar y continuar" }).click();
  await expect(page.getByText("1 de 6 tareas preparadas", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /Idea e inscripción/ }).click();
  await page.getByRole("button", { name: /Explica el problema inicial/ }).click();
  await expect(page.getByRole("textbox", { name: "Tu respuesta" })).toHaveValue("Idea inicial independiente");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({ path: test.info().outputPath("allin-inscripcion.png"), fullPage: true });
  await page.getByRole("button", { name: /Cursos y Bootcamp/ }).click();
  await expect(page.getByRole("heading", { name: "Aprende y mejora tu propuesta" })).toBeVisible();
  await expect(page.getByRole("textbox")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Guardar/ })).toHaveCount(0);
  await page.getByRole("link", { name: "Ver todos los requisitos" }).click();
  await page.getByRole("link", { name: /Editar en su etapa: Desarrolla el problema y su impacto/ }).click();
  await expect(page.getByRole("heading", { name: "Convierte tu idea en una propuesta" })).toBeVisible();
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
