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

### 1.2 Sistema de Diseño: Stitch *Estate Logic* (ID: `16732967349855074016`)
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

- **Stack**: React 19 + TypeScript + Vite + Tailwind CSS.
- **Ruta Base de Despliegue**: Soporte estricto de GitHub Pages con `base: '/propsaas/'` en `vite.config.ts`.
- **Exportaciones y Documentos**: La generación de recibos PDF se realiza en el cliente mediante `jspdf` y la exportación de tablas mediante formato CSV UTF-8 con BOM (`\uFEFF`).
