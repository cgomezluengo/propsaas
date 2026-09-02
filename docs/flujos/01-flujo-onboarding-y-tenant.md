# Flujo de Trabajo: Onboarding y Configuración del Tenant (Inmobiliaria)

Este flujo describe cómo una nueva agencia inmobiliaria se registra en la plataforma, creando su propio entorno aislado (Tenant).

## 1. Registro Inicial (Super Admin de la Inmobiliaria)
* **Entrada:** El dueño de la agencia ingresa a la landing page y selecciona "Prueba Gratuita" o un plan.
* **Acción:** Completa el formulario de registro base (Email, Contraseña, Nombre Completo).
* **Validación:** Se envía un correo electrónico de verificación.
* **Creación del Tenant:** Al confirmar, el backend genera un nuevo registro en la tabla `tenants` y aísla el entorno (ej. usando Row-Level Security en la base de datos).

## 2. Configuración del Espacio de Trabajo (Workspace Wizard)
* **Paso 1 - Datos de la Agencia:** Ingresa el nombre legal, CUIT, teléfono, dirección física y carga el logotipo.
* **Paso 2 - Personalización:** Define el subdominio o URL de acceso para su equipo y clientes (ej. `inmobiliariagomez.sistema.com`).
* **Paso 3 - Integraciones:** Conecta canales de entrada de prospectos (WhatsApp, Instagram, Facebook, YouTube, Twitter).

## 3. Gestión de Equipo (Roles y Permisos)
* **Acción:** El Super Admin invita a sus empleados vía email.
* **Asignación de Roles:**
  * `Vendedor/Agente`: Acceso exclusivo al CRM, prospectos y catálogo de propiedades.
  * `Administración/Cobranzas`: Acceso a contratos, carga de pagos, actualización de índices.
  * `Dueño/Admin`: Acceso total, métricas y facturación del SaaS.
* **Resultado:** El equipo acepta la invitación, establece su contraseña e ingresa al dashboard filtrado por su rol.
