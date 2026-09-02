# Directrices de Desarrollo y Estándares de Ingeniería (GEMINI.md)

Este documento establece las reglas operativas, arquitectura de software, Atomic Knowledge y protocolos de ingeniería aplicables a este repositorio.

---

## 🧠 1. Atomic Knowledge Base & Arquitectura del Sistema

### 1.1 Propósito y Dominio del Negocio
- **PropSaaS** es un sistema CRM y gestor administrativo inmobiliario optimizado para el mercado de la República Argentina (martilleros públicos, corredores y administraciones de alquileres).
- **Entidades Core**:
  - `Tenant`: Inmobiliaria o sucursal. Soporte multi-inquilino estricto mediante discriminador `tenantId` en toda colección de datos.
  - `Lead`: Consulta comercial proveniente de canales externos (WhatsApp, Instagram Direct, Facebook Messenger, Portales Web).
  - `Contract`: Contrato de locación con esquema de ajuste periódico basado en índices oficiales (ICL, IPC, Casa Propia).
  - `Property`: Ficha técnica de inmueble (alquiler o venta).
  - `PaymentReceipt`: Comprobante de pago emitido con folio y desglose legal.

### 1.2 Flujo Guiado Punta a Punta (End-to-End Lifecycle)
1. **Paso 1 (Nuevas Consultas)**: Clasificación de urgencia SLA (<24h, >24h, >48h) con botón directo de respuesta contextual (WhatsApp/DM).
2. **Paso 2 (En Conversación)**: Seguimiento activo enfocado en verificación de garantías y agendamiento de visitas.
3. **Paso 3 (Visitas Agendadas)**: Logística de visita con martillero asignado, envío de GPS y botón de **Concretar Reserva**.
4. **Paso 4 (Clientes Ganados ➔ Alta de Contrato)**: Al concretar reserva o desde la bandeja de ganados, el sistema permite definir canon locativo e índice oficial, creando automáticamente el registro de locación.
5. **Paso 5 (Padrón & Portal de Inquilinos)**: Directorio activo de locatarios vinculados a sus contratos, emisión/registro de cobros, y generación de comprobantes PDF oficiales con firma y sello digital.

### 1.3 Motor de Persistencia: SQLite en Cliente (WASM via sql.js)
- **Cero Dependencia de Servidor Backend para Demo y Pages**: Base de datos relacional SQLite completa corriendo en WebAssembly (`sql-wasm.wasm`, `sql-wasm-browser.wasm`).
- **Esquema Relacional**:
  - `leads`: Prospectos comerciales y scoring de IA.
  - `properties`: Inventario de inmuebles.
  - `contracts`: Contratos de locación activos y fechas de ajuste.
  - `receipts`: Historial de cobros y comprobantes emitidos.
- **Persistencia**: Sincronización transparente en `localStorage` (Base64) con soporte para **Exportar Base de Datos `.sqlite`** descargable directamente por el usuario.

### 1.4 Sistema de Diseño: Stitch *Estate Logic* (ID: `16732967349855074016`)
- **Modo de Visualización**: Modo claro estricto y descansado. Prohibido reintroducir temas oscuros o fondos negros en vistas principales.
- **Paleta de Colores Oficial**:
  - `primary` (`#091426`): Deep Corporate Navy para barras de título, encabezados y botones primarios.
  - `surface / background` (`#F7F9FB`): Lienzo base de la aplicación.
  - `surface-container-lowest` (`#FFFFFF`): Fondo de tarjetas y tablas de datos.
  - `outline / border` (`#E6E8EA`): Borde estandarizado de 1px en todos los contenedores.
  - `secondary` (`#006C49`): Verde esmeralda para estados exitosos, coeficientes ICL y aprobaciones.
  - `error / alert` (`#BA1A1A` con fondo `#FFDAD6`): Alertas de consultas sin responder y vencimientos críticos.
- **Geometría y Tipografía**:
  - Radio de curvatura: `12px` (`rounded-xl` / `0.75rem`) en tarjetas, inputs y modales.
  - Tipografía: `Inter` (pesos 400, 500, 600, 700). Familias monoespaciadas (`font-mono`) reservadas para importes monetarios, CUITs y fechas de ajuste.

---

## 🛡️ 2. Protocolo de Cero Deuda Técnica y Gestión de Issues

1. **Compilación Obligatoria**:
   - Todo cambio en el código fuente debe validar su compilación con `npm run build` con código de salida `0` antes de cerrar la tarea.
2. **Tratamiento de Tareas Pendientes**:
   - Está terminantemente prohibido dejar código con `// TODO` huérfanos o funciones stub incompletas.
   - Si una integración externa (ej: APIs de Meta, Supabase, BCRA en vivo) excede el alcance del bloque de trabajo actual, **se debe crear un issue mediante la CLI de GitHub**:
     ```bash
     gh issue create --title "[Módulo] Descripción clara de la tarea" --body "Contexto técnico, requerimientos y criterios de aceptación."
     ```
   - El commit resultante debe incluir la referencia del issue creado (ej. `Refs #12`).

---

## 📐 3. Convenciones Técnicas de Frontend

- **Stack**: React 19 + TypeScript + Vite + Tailwind CSS + SQLite WASM (`sql.js`) + jsPDF.
- **Ruta Base de Despliegue**: Soporte estricto de GitHub Pages con `base: '/propsaas/'` en `vite.config.ts`.
- **Exportaciones y Documentos**: La generación de recibos PDF se realiza en el cliente mediante `jspdf` y la exportación de base de datos completa como archivo binario `.sqlite`.
