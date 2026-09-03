# Operación en Railway

Estado verificado el 2 de septiembre de 2026.

## Configuración activa

- Aplicación: https://asistproy.up.railway.app
- Proyecto Railway: `victorious-vision` (`5ffdb6d9-1fd4-4ba6-bf0d-01a55c716df0`).
- Servicio: `asistente-proyectos-chile` (`10d9ee6c-d377-48cb-9b57-9cbb4bfa249b`).
- Entorno: `production` (`5be3d42e-23e6-4347-ba06-696503d2c0a0`).
- Volumen persistente: `asistente-proyectos-chile-volume`, montado en `/app/data`.
- `DATABASE_PATH=./data/asistente.sqlite`; el directorio de ejecución es `/app`.
- `BETTER_AUTH_URL=https://asistproy.up.railway.app`.
- `BETTER_AUTH_SECRET`: conservar el valor existente; no incluirlo en Git ni en documentación.
- `DEMO_MODE`: eliminado. Se mantiene el registro e inicio de sesión normal.
- Arranque: `npm run start`.
- Healthcheck: `/`, con timeout de 300 segundos.
- Una réplica. No aumentar réplicas sin revisar la arquitectura de SQLite y el volumen.

El volumen evita que los datos desaparezcan al reemplazar el contenedor. No protege por sí solo frente a eliminación del volumen, errores de aplicación o corrupción.

## Respaldos

Los respaldos verificados están en `data/backups/railway-20260902-*/`, fuera de Git. Cada carpeta contiene `asistente.sqlite` y `manifest.json`, con huella SHA-256, integridad y conteos por tabla. Son archivos sensibles: contienen la base de cuentas, sesiones y proyectos. No subirlos al repositorio ni compartirlos públicamente.

La copia previa a la migración conserva una cuenta y cero proyectos. También se tomaron copias después de crear el proyecto técnico de prueba.

**Pendiente:** el panel de Railway indica que los respaldos automáticos y PITR requieren el plan Pro. No se cambió el plan ni se activó una programación. Las copias locales son puntuales, no un sistema de respaldo automático. Antes de ampliar las pruebas con usuarios, acordar una frecuencia de copias manuales o habilitar una alternativa de respaldo con autorización del responsable.

Para generar una copia nueva:

1. Acceder al contenedor por la consola de Railway o por SSH autorizado.
2. Usar la API de respaldo en línea de `better-sqlite3` (`db.backup(...)`) hacia un archivo nuevo. No copiar solamente la base activa mientras utiliza WAL.
3. Descargar la copia a una ubicación privada fuera del contenedor y de Git.
4. Comparar la huella SHA-256 de origen y destino, ejecutar `PRAGMA integrity_check` sobre la copia y registrar los conteos.
5. Conservar la copia antes de cualquier cambio destructivo o migración de almacenamiento.

Para restaurar, detener primero las escrituras y confirmar el volumen y la ruta exactos. No sobrescribir una base abierta ni sustituir una base con datos nuevos. Verificar integridad y conteos antes de habilitar el tráfico.

## Prueba del despliegue

El despliegue final `7bb89b5c-94a5-48bb-bf6d-05574ac1f003` utiliza el commit `896d7f90dc64c9f24f55b36d49379b9e62253f83` y el arranque normal.

Comprobaciones realizadas:

- Portada: HTTP 200.
- `/proyectos` sin sesión: redirección a `/ingresar`.
- Intento de ingreso con credenciales ficticias y el origen correcto: HTTP 401 `INVALID_EMAIL_OR_PASSWORD`, no `INVALID_ORIGIN`.
- La sesión existente siguió funcionando después de la migración y del siguiente despliegue.
- Se creó un proyecto identificado como **PRUEBA TÉCNICA DE PERSISTENCIA 02-09-2026**, sin información sensible ni postulación real.
- Se confirmó un antecedente y se guardó el requisito Edad como En preparación.
- Después de un nuevo despliegue se conservaron el proyecto, el antecedente y el estado compartido del checklist en Sercotec y FOSIS.
- Los respaldos obtenidos antes y después del despliegue final tienen la misma huella SHA-256 y los mismos conteos: una cuenta, un proyecto y un estado de checklist guardado.
- Se revocó la llave SSH temporal y se cerró su agente. La autorización de Railway CLI se conserva; es independiente de esa llave.

Proyecto de prueba: `/proyectos/b92e5637-ac70-4027-b2fc-7caf2fedd9bf`. Se dejó disponible en la cuenta existente para inspección; no se modificaron proyectos previos.

## Próximos despliegues

- Mantener el volumen y el secreto de autenticación.
- Revisar cualquier cambio pendiente del panel antes de aplicarlo; no reactivar el modo demo.
- Si cambia el dominio, actualizar `BETTER_AUTH_URL` y comprobar nuevamente el origen de autenticación.
- Cuando se necesite desplegar la configuración vigente desde GitHub, usar el flujo desde la fuente actual. La opción de repetir un despliegue anterior puede reutilizar su configuración anterior.
- Confirmar estado exitoso, acceso protegido y conservación de datos antes de dar el despliegue por terminado.

Referencias oficiales: [volúmenes](https://docs.railway.com/volumes), [respaldos](https://docs.railway.com/volumes/backups), [SSH](https://docs.railway.com/cli/ssh).
