# Directrices de Agentes Autónomos y Subagentes (AGENTS.md)

Este documento instruye a cualquier agente o subagente de IA que diagnostique, planifique o modifique este repositorio.

---

## 🤖 1. Roles y Responsabilidades de Subagentes

1. **Lead Architect & Coordinator**:
   - Analiza los requerimientos del usuario, desglosa tareas complejas y orquesta a los subagentes especializados.
2. **Senior UI/UX & Product Designer**:
   - Asegura la coherencia visual bajo los tokens de *Estate Logic* de Stitch.
   - Supervisa accesibilidad (contraste WCAG), microinteracciones (estados hover/active) y diseño responsive en dispositivos móviles y de escritorio.
3. **Core Fullstack Engineer**:
   - Implementa componentes funcionales, validaciones TypeScript estrictas y algoritmos de negocio (cálculo de índices ICL/IPC, serializadores de recibos y conectores de mensajería).

---

## 🧩 2. Atomic Knowledge & Reglas de Flujos de Trabajo

### 2.1 Pipeline Guiado del CRM (3 Pasos)
- **Paso 1 (Nuevas Consultas)**:
  - Clasificación por urgencia temporal: consultas con más de 24h y más de 48h sin respuesta.
  - Botón de respuesta adaptativo según canal (`WhatsApp`, `Instagram`, `Facebook`).
- **Paso 2 (En Conversación)**:
  - Prospectos contactados cuyo objetivo inmediato es agendar fecha y hora de visita o solicitar requisitos de garantía.
- **Paso 3 (Visita Programada)**:
  - Prospectos con visita coordinada con martillero, con opción de enviar ubicación exacta o avanzar a reserva/contrato.

### 2.2 Motor de Cálculo de Aumentos de Alquiler
- **Índice ICL (Banco Central)**: Aplica la variación porcentual del coeficiente oficial entre fecha base y fecha de ajuste.
- **Índice IPC (INDEC)**: Aplica la tasa de inflación acumulada del período contractual.
- **Emisión de Recibos**: Todo ajuste ejecutado debe permitir descargar inmediatamente el recibo legal en formato PDF con desglose del período.

---

## ⛔ 3. Políticas de Ejecución y Cero Deuda Técnica

1. **Validación Previa**:
   - Antes de responder al usuario, el agente debe ejecutar `npm run build` en el directorio raíz y verificar salida exitosa.
2. **Registro Obligatorio de Tareas Pendientes en GitHub Issues**:
   - Ante cualquier limitación técnica o servicio externo pendiente de credenciales, el agente debe crear el issue vía GitHub CLI:
     `gh issue create --title "..." --body "..."`
3. **Verificación de Despliegue**:
   - Verificar la correcta ejecución del pipeline `.github/workflows/deploy.yml` mediante `gh run list --limit 1`.
