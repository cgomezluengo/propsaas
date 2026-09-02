# Flujo de Trabajo: Portal de Transparencia para Inquilinos

Describe la experiencia del usuario final (inquilino) para mantener una relación clara y sin fricciones con la inmobiliaria.

## 1. Acceso al Portal y Padrón de Locatarios
* **Onboarding Inquilino:** Al concretar la reserva y dar de alta el contrato en el CRM (desde *Visitas Agendadas* o *Clientes Ganados*), se genera automáticamente la ficha del locatario en el Padrón.
* **Dashboard Principal:** Al ingresar al padrón de inquilinos, se puede seleccionar a cada locatario para ver su estado actual ("Al Día" o "Pendiente de Pago"), monto de alquiler vigente y datos de contacto.

## 2. Transparencia de Aumentos (ICL / IPC)
* **Visualización de Próximo Aumento:** Un bloque informativo muestra claramente la fecha estimada del próximo ajuste, el índice oficial asignado (ICL del BCRA, IPC del INDEC o Casa Propia) y el porcentaje de variación aplicado en el último ajuste.

## 3. Gestión de Pagos y Emisión de Recibos Oficiales (PDF)
* **Notificar / Registrar Pago:** Permite registrar pagos inmediatos indicando el período abonado y el monto, actualizando en tiempo real el estado en SQLite.
* **Descarga de Recibos PDF Oficiales:** El sistema genera en el cliente documentos PDF legales de comprobante de pago con folio único, desglose de canon locativo, datos de la inmobiliaria, firma y sello digital mediante `jspdf`.
* **Persistencia Relacional:** Todos los cobros y contratos se almacenan en la base de datos relacional SQLite (`sql.js`) sincronizada en el navegador con capacidad de exportación binaria `.sqlite`.
