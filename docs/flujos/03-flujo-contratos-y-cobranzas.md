# Flujo de Trabajo: Gestión de Contratos y Actualización de Alquileres

Describe la administración mensual de propiedades alquiladas, cálculos de inflación y cobros.

## 1. Alta de Contrato
* **Acción:** El sector de administración crea un contrato vinculando:
  * Propiedad (del inventario).
  * Inquilino (datos personales y de contacto).
  * Condiciones: Fecha de inicio, duración, monto base y periodicidad de actualización (ej. cada 3 o 6 meses).
  * Índice aplicado: ICL, IPC, etc.

## 2. Flujo de Actualización Automática (El principal dolor a resolver)
* **Alerta Previa:** 30 días antes de que corresponda el aumento, el sistema notifica al equipo de administración en el Dashboard.
* **Cálculo:** El administrador abre la "Calculadora de Índices", ingresa el porcentaje dictado por el índice oficial (ICL/IPC) del mes.
* **Aprobación:** El sistema calcula el nuevo monto. El administrador lo aprueba.
* **Notificación al Inquilino:** El sistema dispara automáticamente un email o mensaje de WhatsApp al inquilino informando el nuevo monto exacto y la fecha de vigencia.

## 3. Cobro y Emisión de Recibos
* **Recepción del Pago:** El inquilino paga y notifica vía su portal.
* **Acreditación:** El administrador marca el mes como "Pagado".
* **Comprobantes:** El sistema genera un recibo en PDF para el inquilino. Este módulo queda preparado para futuras integraciones mediante endpoints con servicios de facturación electrónica (ej. web services de ARCA/AFIP) para automatizar la carga fiscal de la agencia directamente desde el sistema.
