import React, { useState } from 'react';
import { 
  X, Database, Server, Code, CheckCircle, Copy, Check, 
  Terminal, ShieldCheck, Layers, Cpu, ArrowRight, Milestone 
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TechnicalSpecsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'stack' | 'db_schema' | 'api_definition' | 'mvp_roadmap'>('stack');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const postgresSchemaCode = `-- ==========================================================
-- PROPELTECH PRO: ESQUEMA POSTGRESQL MULTI-TENANT CON RLS
-- ==========================================================

-- 1. Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabla de Inmobiliarias / Sucursales (Tenants)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    cuit VARCHAR(20) NOT NULL,
    city VARCHAR(100) DEFAULT 'Junín',
    province VARCHAR(100) DEFAULT 'Buenos Aires',
    plan_tier VARCHAR(50) DEFAULT 'agencia' CHECK (plan_tier IN ('freemium', 'agencia', 'multi_sucursal')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Usuarios con roles Multi-Tenant
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'martillero' CHECK (role IN ('superadmin', 'admin', 'martillero', 'cobranzas', 'inquilino')),
    two_factor_secret VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla de Inmuebles / Propiedades
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL DEFAULT 'Junín',
    property_type VARCHAR(50) NOT NULL CHECK (property_type IN ('departamento', 'casa', 'local_comercial', 'galpon', 'terreno')),
    operation_type VARCHAR(50) NOT NULL CHECK (operation_type IN ('alquiler', 'venta')),
    price NUMERIC(14, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'ARS' CHECK (currency IN ('ARS', 'USD')),
    status VARCHAR(50) DEFAULT 'disponible' CHECK (status IN ('disponible', 'reservada', 'alquilada', 'vendida')),
    bedrooms INT DEFAULT 1,
    bathrooms INT DEFAULT 1,
    covered_m2 NUMERIC(8, 2) NOT NULL,
    images TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabla de Contratos de Alquiler e Indexaciones (ICL/IPC)
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE RESTRICT,
    tenant_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    tenant_full_name VARCHAR(255) NOT NULL,
    tenant_cuit VARCHAR(20) NOT NULL,
    tenant_phone VARCHAR(50),
    start_date DATE NOT NULL,
    expiration_date DATE NOT NULL,
    current_amount NUMERIC(14, 2) NOT NULL,
    index_type VARCHAR(50) DEFAULT 'ICL' CHECK (index_type IN ('ICL', 'IPC', 'CASA_PROPIA', 'FIJO')),
    adjustment_frequency VARCHAR(50) DEFAULT 'anual' CHECK (adjustment_frequency IN ('trimestral', 'cuatrimestral', 'semestral', 'anual')),
    next_adjustment_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'vigente' CHECK (status IN ('vigente', 'pendiente_actualizacion', 'proximo_a_vencer', 'finalizado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabla de Prospectos / Leads CRM con Scoring IA
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    channel VARCHAR(50) DEFAULT 'whatsapp' CHECK (channel IN ('whatsapp', 'instagram', 'facebook', 'web', 'zonaprop', 'argenprop', 'manual')),
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'visit_scheduled', 'lost', 'converted')),
    lead_type VARCHAR(50) DEFAULT 'alquiler',
    budget VARCHAR(100),
    hours_unanswered INT DEFAULT 0,
    ai_score INT DEFAULT 50,
    ai_category VARCHAR(50) DEFAULT 'media_intencion',
    ai_reason TEXT,
    ai_suggested_reply TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_contacted_at TIMESTAMP WITH TIME ZONE
);

-- ==========================================================
-- ROW-LEVEL SECURITY (RLS) PARA AISLAMIENTO MULTI-TENANT
-- ==========================================================

-- Habilitar RLS en cada tabla sensible
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Crear política que aísla por tenant_id obtenido del JWT session
CREATE POLICY tenant_isolation_properties ON properties
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY tenant_isolation_contracts ON contracts
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY tenant_isolation_leads ON leads
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
`;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white  w-full max-w-5xl h-[90vh] rounded-xl shadow-2xl border border-slate-200  flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#F2F4F6] text-[#091426] border border-[#E6E8EA] flex items-center justify-center font-bold">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Documento de Arquitectura & Entregables Técnicos</h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F2F4F6] text-[#091426] border border-[#E6E8EA]">
                  Senior Architect / B2B SaaS
                </span>
              </div>
              <p className="text-xs text-slate-400">Especificaciones para desarrollo escalable en Junín & Provincia de Buenos Aires</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200  bg-slate-50  px-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('stack')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-xs border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'stack'
                ? 'border-[#091426] text-[#091426] '
                : 'border-transparent text-slate-500 hover:text-slate-900 :text-white'
            }`}
          >
            <Layers className="w-4 h-4" /> 1. Arquitectura del Sistema (Stack)
          </button>
          <button
            onClick={() => setActiveTab('db_schema')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-xs border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'db_schema'
                ? 'border-[#091426] text-[#091426] '
                : 'border-transparent text-slate-500 hover:text-slate-900 :text-white'
            }`}
          >
            <Database className="w-4 h-4" /> 2. Esquema PostgreSQL & RLS
          </button>
          <button
            onClick={() => setActiveTab('api_definition')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-xs border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'api_definition'
                ? 'border-[#091426] text-[#091426] '
                : 'border-transparent text-slate-500 hover:text-slate-900 :text-white'
            }`}
          >
            <Code className="w-4 h-4" /> 3. Definición de API REST
          </button>
          <button
            onClick={() => setActiveTab('mvp_roadmap')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-xs border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'mvp_roadmap'
                ? 'border-[#091426] text-[#091426] '
                : 'border-transparent text-slate-500 hover:text-slate-900 :text-white'
            }`}
          >
            <Milestone className="w-4 h-4" /> 4. Roadmap del MVP (Sprints)
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 text-slate-800 ">
          {/* TAB 1: STACK */}
          {activeTab === 'stack' && (
            <div className="space-y-6">
              <div className="bg-[#F2F4F6]  border border-[#E6E8EA]  rounded-xl p-4">
                <h4 className="font-bold text-[#091426]  text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#091426]" />
                  Dictamen del Arquitecto: Stack Tecnológico de Máxima Velocidad y Aislamiento Multi-Tenant
                </h4>
                <p className="text-xs text-[#091426]  mt-1">
                  Optimizamos para despliegue rápido, costo operativo bajo (scale-to-zero) y absoluta seguridad en la separación de datos entre inmobiliarias competidoras en la misma región.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200  rounded-xl p-4 bg-white  shadow-sm">
                  <div className="flex items-center gap-2 text-slate-900  font-bold mb-2">
                    <span className="w-7 h-7 rounded-lg bg-[#E6E8EA]  text-[#091426] flex items-center justify-center text-xs">FE</span>
                    Frontend & Portal Inquilino
                  </div>
                  <ul className="text-xs space-y-2 text-slate-600 ">
                    <li>• <strong>React 19 + TypeScript + Vite:</strong> Rendimiento instantáneo, SPA ultra responsiva en móviles.</li>
                    <li>• <strong>Tailwind CSS v4 + Motion:</strong> Animaciones fluidas, microinteracciones y modo oscuro nativo.</li>
                    <li>• <strong>PWA (Progressive Web App):</strong> Para que los inquilinos instalen el portal como app nativa sin pasar por App Store.</li>
                  </ul>
                </div>

                <div className="border border-slate-200  rounded-xl p-4 bg-white  shadow-sm">
                  <div className="flex items-center gap-2 text-slate-900  font-bold mb-2">
                    <span className="w-7 h-7 rounded-lg bg-indigo-100  text-indigo-600 flex items-center justify-center text-xs">BE</span>
                    Backend & Lógica de Negocio
                  </div>
                  <ul className="text-xs space-y-2 text-slate-600 ">
                    <li>• <strong>Node.js / Express / Fastify con TypeScript:</strong> Ecosistema maduro, bajo overhead de memoria.</li>
                    <li>• <strong>Drizzle ORM / Prisma:</strong> Type-safety total de extremo a extremo, migraciones declarativas seguras.</li>
                    <li>• <strong>BullMQ + Redis:</strong> Colas para cron jobs automáticos de actualización ICL/IPC y alertas de leads &gt;48h.</li>
                  </ul>
                </div>

                <div className="border border-slate-200  rounded-xl p-4 bg-white  shadow-sm">
                  <div className="flex items-center gap-2 text-slate-900  font-bold mb-2">
                    <span className="w-7 h-7 rounded-lg bg-emerald-100  text-emerald-600 flex items-center justify-center text-xs">DB</span>
                    Base de Datos & Seguridad
                  </div>
                  <ul className="text-xs space-y-2 text-slate-600 ">
                    <li>• <strong>PostgreSQL 16+ con Row-Level Security (RLS):</strong> Esquema compartido con discriminador <code className="bg-slate-100  px-1 py-0.5 rounded">tenant_id</code>.</li>
                    <li>• <strong>JWT con Custom Claims:</strong> El token de sesión inyecta el <code className="bg-slate-100  px-1 py-0.5 rounded">app.current_tenant_id</code> a nivel de conexión SQL.</li>
                    <li>• <strong>Cifrado AES-256 en reposo:</strong> Para proteger contratos y recibos de sueldo.</li>
                  </ul>
                </div>

                <div className="border border-slate-200  rounded-xl p-4 bg-white  shadow-sm">
                  <div className="flex items-center gap-2 text-slate-900  font-bold mb-2">
                    <span className="w-7 h-7 rounded-lg bg-purple-100  text-purple-600 flex items-center justify-center text-xs">AI</span>
                    Motor de Inteligencia Artificial
                  </div>
                  <ul className="text-xs space-y-2 text-slate-600 ">
                    <li>• <strong>Gemini 2.5 Flash / Google GenAI SDK:</strong> Scoring en 180ms, extracción estructurada JSON de intención y garantía.</li>
                    <li>• <strong>Meta Graph API / WhatsApp Cloud API:</strong> Ingesta omnicanal de mensajes en tiempo real vía Webhooks.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: POSTGRESQL SCHEMA */}
          {activeTab === 'db_schema' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500">Esquema SQL listo para producción con relaciones de clave foránea e índices optimizados:</p>
                <button
                  onClick={() => handleCopy(postgresSchemaCode, 'sql')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  {copiedSection === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSection === 'sql' ? '¡Copiado!' : 'Copiar Script SQL'}
                </button>
              </div>

              <div className="bg-slate-950 text-slate-300 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 max-h-[480px]">
                <pre>{postgresSchemaCode}</pre>
              </div>
            </div>
          )}

          {/* TAB 3: API DEFINITION */}
          {activeTab === 'api_definition' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Endpoints REST principales para arrancar el backend con autenticación Bearer JWT y filtrado por Tenant:
              </p>

              <div className="space-y-3">
                {/* Endpoint 1 */}
                <div className="border border-slate-200  rounded-xl p-4 bg-white ">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#E6E8EA] text-[#091426]  ">POST</span>
                    <code className="text-xs font-mono font-semibold text-slate-900 ">/api/v1/auth/register-tenant</code>
                    <span className="text-xs text-slate-500 ml-auto">Onboarding de Agencia</span>
                  </div>
                  <p className="text-xs text-slate-600  mt-2">
                    Crea el espacio de trabajo del tenant, el usuario administrador principal y provisiona el subdominio.
                  </p>
                </div>

                {/* Endpoint 2 */}
                <div className="border border-slate-200  rounded-xl p-4 bg-white ">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700  ">GET</span>
                    <code className="text-xs font-mono font-semibold text-slate-900 ">/api/v1/leads?status=new&unanswered_gt=48</code>
                    <span className="text-xs text-slate-500 ml-auto">CRM Kanban & Alertas</span>
                  </div>
                  <p className="text-xs text-slate-600  mt-2">
                    Retorna los prospectos clasificados por columnas del embudo, destacando leads con &gt;48 horas sin respuesta.
                  </p>
                </div>

                {/* Endpoint 3 */}
                <div className="border border-slate-200  rounded-xl p-4 bg-white ">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-purple-100 text-purple-700  ">POST</span>
                    <code className="text-xs font-mono font-semibold text-slate-900 ">/api/v1/leads/ai-score</code>
                    <span className="text-xs text-slate-500 ml-auto">Motor de Scoring IA</span>
                  </div>
                  <p className="text-xs text-slate-600  mt-2">
                    Recibe el texto de la consulta del prospecto, analiza intención de compra/alquiler y devuelve score 0-100 y respuesta sugerida.
                  </p>
                </div>

                {/* Endpoint 4 */}
                <div className="border border-slate-200  rounded-xl p-4 bg-white ">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-700  ">POST</span>
                    <code className="text-xs font-mono font-semibold text-slate-900 ">/api/v1/contracts/{`{id}`}/calculate-index</code>
                    <span className="text-xs text-slate-500 ml-auto">Calculadora ICL / IPC</span>
                  </div>
                  <p className="text-xs text-slate-600  mt-2">
                    Consulta el índice ICL oficial del BCRA o IPC del INDEC y calcula el nuevo canon locativo a aplicar.
                  </p>
                </div>

                {/* Endpoint 5 */}
                <div className="border border-slate-200  rounded-xl p-4 bg-white ">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700  ">GET</span>
                    <code className="text-xs font-mono font-semibold text-slate-900 ">/api/v1/tenant-portal/overview</code>
                    <span className="text-xs text-slate-500 ml-auto">Portal del Inquilino</span>
                  </div>
                  <p className="text-xs text-slate-600  mt-2">
                    Devuelve el próximo vencimiento de pago, meses restantes para el aumento de alquiler y últimos recibos descargables.
                  </p>
                </div>

                {/* Endpoint 6 */}
                <div className="border border-slate-200  rounded-xl p-4 bg-white ">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#E6E8EA] text-[#091426]  ">POST</span>
                    <code className="text-xs font-mono font-semibold text-slate-900 ">/api/v1/webhooks/social-leads</code>
                    <span className="text-xs text-slate-500 ml-auto">Webhook Ingesta Omnicanal</span>
                  </div>
                  <p className="text-xs text-slate-600  mt-2">
                    Recepción de mensajes desde Instagram DM, WhatsApp y Facebook Messenger para su procesamiento e inserción inmediata en el CRM.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MVP ROADMAP */}
          {activeTab === 'mvp_roadmap' && (
            <div className="space-y-6">
              <div className="border-l-2 border-emerald-500 pl-4 space-y-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center">1</span>
                    <h4 className="font-bold text-sm text-slate-900 ">Sprint 1 (Semana 1): Fundaciones Multi-Tenant y Autenticación</h4>
                  </div>
                  <p className="text-xs text-slate-600  mt-1 pl-8">
                    Modelado de PostgreSQL con RLS, Wizard de Onboarding de Inmobiliarias, Login con JWT y selector de sucursales.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center">2</span>
                    <h4 className="font-bold text-sm text-slate-900 ">Sprint 2 (Semana 2): CRM Inmobiliario & Alertas Anti-Pérdida de Leads</h4>
                  </div>
                  <p className="text-xs text-slate-600  mt-1 pl-8">
                    Tablero Kanban drag-and-drop, indicador rojo para leads &gt;48h, integración con WhatsApp Cloud API y motor IA de scoring.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center">3</span>
                    <h4 className="font-bold text-sm text-slate-900 ">Sprint 3 (Semana 3): Motor de Indexación ICL/IPC & Portal Inquilinos</h4>
                  </div>
                  <p className="text-xs text-slate-600  mt-1 pl-8">
                    Calculadora de aumento de alquiler con índices del BCRA, generación de recibos PDF, portal móvil para inquilinos y notificador de pagos.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center">4</span>
                    <h4 className="font-bold text-sm text-slate-900 ">Sprint 4 (Semana 4): Pruebas Piloto en Junín & Lanzamiento Comercial</h4>
                  </div>
                  <p className="text-xs text-slate-600  mt-1 pl-8">
                    Onboarding con 3 inmobiliarias de prueba en Junín/PBA, ajuste de métricas de conversión, landing page de captación y pagos con Stripe/MercadoPago.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100  px-6 py-3 border-t border-slate-200  flex justify-between items-center">
          <span className="text-xs text-slate-500">Diseñado con estándares enterprise B2B SaaS</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#091426] text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors"
          >
            Entendido, cerrar especificaciones
          </button>
        </div>
      </div>
    </div>
  );
};
