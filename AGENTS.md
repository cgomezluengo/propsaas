# Directrices de Agentes Autónomos y Subagentes (AGENTS.md)

Este documento instruye a cualquier agente o subagente de IA que interactúe, diagnostique, diseñe o modifique este repositorio.

---

## 🤖 1. Roles y Responsabilidades de Agentes

1. **Lead Architect & Coordinator**:
   - Coordina tareas complejas, desglosa épicas en sub-tareas y delega en agentes especializados.
2. **Senior UI/UX & Product Designer**:
   - Custodio del Design System *Estate Logic* de Stitch.
   - Garantiza accesibilidad (contrastes WCAG), legibilidad, responsive design y microinteracciones limpias.
3. **Core Engineer & Fullstack Dev**:
   - Implementa componentes funcionales, validaciones TypeScript y lógica de negocio (ICL/IPC, parsers de mensajes, exportadores).

---

## 🧩 2. Atomic Knowledge Base

- **Gestión de Estados**: El CRM opera bajo un pipeline guiado de 3 pasos:
  - **Paso 1**: Nuevas consultas entrantes (urgencia <24h / >48h).
  - **Paso 2**: En conversación (objetivo: coordinar visita).
  - **Paso 3**: Visita programada (objetivo: pasar a firma/seña).
- **Atención Multicanal Inteligente**:
  - `WhatsApp`: Apertura directa vía API WhatsApp Web/App.
  - `Instagram`: Copia al portapapeles + redirección a Instagram Direct Inbox.
  - `Facebook`: Copia al portapapeles + redirección a Messenger.
- **Cálculo de Aumentos de Alquiler**:
  - Soporte de coeficientes ICL (BCRA), IPC (INDEC) y Casa Propia.
  - Generación de comprobantes y recibos de pago en PDF mediante `jspdf`.

---

## ⛔ 3. Políticas de Cero Deuda Técnica y Gestión de Issues

- **Validación Obligatoria**: Jamás cerrar una intervención o responder al usuario sin haber ejecutado `npm run build` con salida exitosa (`exit code 0`).
- **Gestión de Pendientes & Issues**:
  - Si un agente identifica una mejora técnica, un bug futuro o una integración pendiente que no puede completarse en la sesión actual, debe:
    1. Redactar el issue utilizando la CLI de GitHub: `gh issue create --title "..." --body "..."`
    2. Documentar la referencia `#issue_id` en el log o commit.
- **Sin Código Muerto ni Placeholders**:
  - No dejar imports sin usar, funciones incompletas con `return null` o comentarios `// TODO` sin issue vinculado.

---

## ⚙️ 4. Protocolo de Despliegue en GitHub Pages

- Toda modificación en `main` dispara automáticamente el workflow `.github/workflows/deploy.yml`.
- Antes de dar por concluida una solicitud, el agente debe verificar el estado del workflow mediante `gh run list --limit 1` y asegurar que concluya en `success`.
