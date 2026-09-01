# Reglas de Trabajo del Proyecto PropSaaS (GEMINI.md)

Este documento define las directrices operativas, estándares de ingeniería, Atomic Knowledge y protocolos que rigen el desarrollo en este repositorio.

---

## 🧠 1. Atomic Knowledge & Arquitectura

- **Propósito del Producto**: SaaS de gestión inmobiliaria y CRM multicanal (WhatsApp, Instagram, Facebook) adaptado al mercado inmobiliario de Argentina.
- **Identidad Visual & Sistema de Diseño**:
  - Basado en el Design System **Estate Logic** de Stitch (ID Proyecto: `16732967349855074016`).
  - **Paleta Base**:
    - Primario (Brand & Headers): `#091426`
    - Superficie / Fondo general: `#F7F9FB`
    - Tarjetas / Contenedores: `#FFFFFF` con borde `#E6E8EA` y sombra `0 4px 6px -1px rgba(0,0,0,0.04)`.
    - Acciones / Éxito / ICL: `#006C49`
    - Alertas / Urgencias: `#BA1A1A` / Fondo `#FFDAD6`
  - **Geometría**: Bordes redondeados estandarizados a **12px** (`rounded-xl` / `0.75rem`).
  - **Modo de Visualización**: Modo claro obligatorio por defecto, limpio, sin ruido visual y descansado a la vista.
- **Tono & Copy**: Vocabulario inmobiliario claro y accesible (evitar tecnicismos innecesarios para el usuario final).

---

## 🛡️ 2. Regla de Cero Deuda Técnica & Tareas Pendientes

1. **Prohibido Dejar Tareas en el Aire**:
   - Todo cambio o refactor debe quedar completamente implementado, probado y compilando sin errores (`npm run build`).
   - Si una tarea o mejora excede el alcance inmediato o depende de servicios externos no configurados, **es obligatorio crear un Issue en GitHub** o registrar un ticket explícito con contexto, criterios de aceptación y prioridad, referenciándolo en el commit.
2. **Integridad del Código**:
   - No introducir código muerto, `TODOs` huérfanos sin issue asociado, ni parches temporales sin tipado estricto en TypeScript.
   - Mantener todas las dependencias funcionales y libres de advertencias críticas de compilación.

---

## 📐 3. Estándares de Frontend & React

- **Framework & Build**: React 18 / 19 + TypeScript + Vite + Tailwind CSS.
- **Rutas & Despliegue**: Soporte estricto de GitHub Pages con `base: '/propsaas/'` en `vite.config.ts`.
- **Componentes**: Modulares, desacoplados, con manejo robusto de estados locales y callbacks claros.
- **Multi-Tenant Ready**: Toda entidad (propiedades, leads, contratos, usuarios) debe asociarse a `tenantId`.

---

## 🚀 4. Protocolo de Commit & Entrega

- Cada bloque de trabajo debe ser validado con `npm run build` antes de realizar commit.
- Los mensajes de commit deben ser semánticos, descriptivos y claros.
- Toda actualización a la rama principal `main` debe verificar que el pipeline de GitHub Actions finalice con éxito.
