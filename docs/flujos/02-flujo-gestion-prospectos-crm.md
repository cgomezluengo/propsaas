# Flujo de Trabajo: Gestión de Prospectos y CRM (Ventas)

Describe el ciclo de vida de un lead desde que consulta por una propiedad hasta que alquila o compra.

## 1. Captura y Scoring con IA (Entrada Omnicanal)
* **Origen:** Un usuario deja un comentario en YouTube, envía un DM en Instagram o completa un formulario web preguntando por una propiedad.
* **Filtro de IA:** El sistema recibe el mensaje mediante webhooks, lo procesa y aplica un *scoring*.
  * **Etiqueta "Bueno":** Alta intención ("Quiero ir a verla mañana", "Tengo garantía"). Se asigna al tablero de "Nuevos".
  * **Etiqueta "Basura/Spam":** Consultas sin sentido o bots. Se archivan automáticamente con una nota de justificación de la IA.

## 2. Bandeja de Acción Guiada (Flujo Práctico Paso a Paso)
En lugar de un tablero Kanban tradicional (que requiere arrastrar tarjetas y satura la pantalla móvil), el sistema organiza el trabajo como una **Bandeja de Acción Priorizada**:

* **Paso 1 - Responder Consultas Urgentes:**
  - Lista inteligente ordenada por tiempo de espera.
  - Alerta visual roja para leads con más de 24h o 48h sin respuesta (SLA incumplido).
  - **1-Click Action:** Botón directo según canal (`WhatsApp`, `Instagram`, `Facebook`, etc.) con plantillas de respuesta prearmadas por IA.
* **Paso 2 - En Conversación / Agendamiento:**
  - Vista compacta de prospectos en diálogo activo.
  - Objetivo rápido: botón para agendar fecha/hora de visita o solicitar requisitos de garantía con un toque.
* **Paso 3 - Visitas y Cierres Programados:**
  - Agenda del día/semana con martillero asignado.
  - Botón para enviar ubicación por GPS al cliente o avanzar a reserva/contrato.

## 3. Agendamiento y Cierre
* **Transición a "Visita Agendada":** Se establece una fecha para mostrar la propiedad. Se envía un recordatorio automático al cliente.
* **Cierre:**
  * **Ganado:** El prospecto decide avanzar. El sistema transfiere los datos del lead para iniciar el borrador de un "Nuevo Contrato".
  * **Perdido:** El lead se descarta (se pide seleccionar un motivo para futuras métricas).
