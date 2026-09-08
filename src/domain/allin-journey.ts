import { buildChecklist, type ChecklistProgress } from "./checklist";
import { ALLIN_CALL_ID, getCallResponse } from "./call-responses";
import type { PreparationStage, PreparationTask } from "./preparation-journey";
import type { FundingCall, ProjectAntecedent } from "./types";

export function buildAllInJourney({ call, antecedents, progress }: { call: FundingCall; antecedents: readonly ProjectAntecedent[]; progress: readonly ChecklistProgress[] }): PreparationStage[] {
  const stages: PreparationStage[] = [
    { id: "participation", label: "Tú y tu equipo", title: "Comprueba si pueden participar", help: "Puedes comenzar con una idea: no necesitas una aplicación terminada. El titular debe pertenecer a Duoc UC. No guardes aquí RUT ni correos de tus compañeros. Considera desde ahora que la final exige asistencia presencial en Santiago, sin traslado ni alojamiento cubiertos.", tasks: [], completed: 0, future: false },
    { id: "registration", label: "Idea e inscripción", title: "Explica tu idea y prepara la inscripción", help: "Describe con tus palabras qué quieres resolver. Estos borradores son una guía, no una copia garantizada del formulario. Inscríbete en Santander X desde la web oficial y revisa el correo de confirmación; esta aplicación no envía nada.", deadlineLabel: "Inscripción: 27 de septiembre de 2026, 23:59 · Chile continental", tasks: [], completed: 0, future: false },
    { id: "assignment", label: "Desarrolla el Encargo 1", title: "Convierte tu idea en una propuesta", help: "Puedes adelantar borradores, pero la entrega oficial requiere habilitación. Desarrolla cada respuesta sin reemplazar tu idea inicial. Alcanzar el mínimo de caracteres no valida la calidad ni la admisibilidad.", deadlineLabel: "Encargo 1: 11 de octubre de 2026, 23:59 · Chile continental", tasks: [], completed: 0, future: false },
    { id: "bootcamp", label: "Cursos y Bootcamp", title: "Aprende y mejora tu propuesta", help: "Vista previa: los cursos están disponibles para inscritos; el Bootcamp depende de la selección de hasta 100 equipos. Confirma continuidad cuando te notifiquen. No necesitas completar estas actividades para inscribirte.", deadlineLabel: "Bootcamp: 24 de octubre, 09:00–14:00", tasks: [], completed: 0, future: true, previewOnly: true },
    { id: "semifinal", label: "Prepara tu pitch", title: "Presenta tu proyecto si avanzas", help: "Vista previa para los 30 semifinalistas. Un pitch es una presentación breve y clara del problema, la solución y el equipo. La institución comunica quién avanza; el progreso aquí no determina la selección.", deadlineLabel: "Formación: 29 de octubre · Midterm: 5 de noviembre", tasks: [], completed: 0, future: true, previewOnly: true },
    { id: "final", label: "Final y siguientes pasos", title: "Comparte lo que construyeron", help: "Vista previa para los 15 finalistas. La asistencia del titular en Santiago es obligatoria. Los resultados y premios se confirman en la institución.", deadlineLabel: "Final: 13 de noviembre de 2026 · Casa Central, Santiago", tasks: [], completed: 0, future: true, previewOnly: true },
  ];
  const items = new Map(buildChecklist({ calls: [call], antecedents, progress }).flatMap(group => group.items).map(item => [item.key, item]));
  for (const requirement of call.requirements) {
    const id = `requirement:${ALLIN_CALL_ID}:${requirement.id}`;
    const response = getCallResponse(id);
    const stage = stages.find(stage => stage.id === (response?.stage ?? (requirement.id === "courses" ? "bootcamp" : requirement.id)));
    if (!stage) continue;
    const item = items.get(id);
    const task: PreparationTask = { id, label: requirement.label, help: requirement.description, requirementIds: [requirement.id], item, response, complete: !stage.previewOnly && item?.status === "user_completed_unvalidated", reused: false };
    if (response) {
      const seed = response.seed ? antecedents.find(answer => answer.key === response.seed && answer.confirmationStatus !== "stale")?.value : undefined;
      const earlier = response.seedResponse ? items.get(`requirement:${ALLIN_CALL_ID}:${response.seedResponse}`)?.note : undefined;
      task.draft = item?.note ?? earlier ?? (typeof seed === "string" ? seed : "");
      if (item?.note == null && task.draft) task.draftSource = "Borrador tomado de una respuesta anterior. Adáptalo y guárdalo para esta entrega; la respuesta original no cambia.";
    }
    stage.tasks.push(task);
  }
  return stages.map(stage => ({ ...stage, completed: stage.tasks.filter(task => task.complete).length }));
}
