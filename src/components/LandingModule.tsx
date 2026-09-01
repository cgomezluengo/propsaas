import React, { useState } from 'react';
import { 
  Building2, ArrowRight, ShieldCheck, TrendingUp, Users, Smartphone, 
  Sparkles, Check, ChevronRight, Calculator, Bot, Flame, Star, MessageSquare 
} from 'lucide-react';
import { ModuleType } from '../types';
import { formatCurrency } from '../utils/calculations';

interface Props {
  onNavigate: (module: ModuleType) => void;
}

export const LandingModule: React.FC<Props> = ({ onNavigate }) => {
  const [calculatorLeads, setCalculatorLeads] = useState(25);
  const [avgTicket, setAvgTicket] = useState(400000);

  // ROI calculation: Recovering 20% lost leads
  const recoveredLeads = Math.round(calculatorLeads * 0.22);
  const estimatedSavings = recoveredLeads * avgTicket * 0.04; // 4% commission

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white py-2 px-4 text-center text-xs font-medium border-b border-slate-800 flex items-center justify-center gap-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
          Nuevo
        </span>
        <span className="text-slate-300">Plataforma SaaS B2B especializada en Junín y Provincia de Buenos Aires (ICL / IPC Automático)</span>
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 -left-24 w-80 h-80 bg-slate-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6 border border-blue-200 dark:border-blue-800">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            PropTech Pro B2B SaaS
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            Gestión Inmobiliaria <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-slate-900 dark:from-blue-400 dark:via-blue-300 dark:to-slate-200">
              Inteligente
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Optimiza la administración de tus propiedades, contratos e inquilinos con una plataforma SaaS B2B diseñada para la eficiencia operativa y la transparencia financiera.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('auth')}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Prueba Gratuita
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-sm rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Agendar Demo
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600" /> Sin tarjeta de crédito</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600" /> Setup en 2 minutos</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600" /> Multi-Tenant RLS</span>
          </div>
        </div>

        {/* Live System Preview Cards */}
        <div className="mt-12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            onClick={() => onNavigate('dashboard')}
            className="cursor-pointer bg-white dark:bg-slate-800/80 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-blue-400 transition-all group"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                Alerta &gt;48h
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
              CRM & Embudo Kanban
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Evita perder leads de WhatsApp e Instagram. Notificaciones inmediatas antes de que el cliente busque otra inmobiliaria.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('contracts')}
            className="cursor-pointer bg-white dark:bg-slate-800/80 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-blue-400 transition-all group"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                Índice ICL / IPC
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
              Actualización de Alquileres
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Cálculo automático de aumentos legales, emisión de recibos digitales con firma y aviso preventivo al inquilino.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('tenant_portal')}
            className="cursor-pointer bg-white dark:bg-slate-800/80 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-blue-400 transition-all group"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center border border-purple-200 dark:border-purple-800">
                <Smartphone className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                Mobile First
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
              Portal del Inquilino
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Acceso 24/7 para ver fecha de vencimiento, notificar transferencias bancarias y descargar comprobantes PDF oficiales.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive ROI Calculator for Realtors */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Calculadora de Recuperación de Leads & Rentabilidad</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Estima cuánto dinero pierde tu inmobiliaria por no responder a tiempo (&gt;48h)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-2">
                  Consultas mensuales recibidas: <span className="text-blue-600 font-bold">{calculatorLeads}</span>
                </label>
                <input 
                  type="range" 
                  min="5" 
                  max="150" 
                  value={calculatorLeads}
                  onChange={(e) => setCalculatorLeads(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-2">
                  Valor promedio del alquiler/operación: <span className="text-blue-600 font-bold">{formatCurrency(avgTicket)}</span>
                </label>
                <input 
                  type="range" 
                  min="150000" 
                  max="1500000" 
                  step="25000"
                  value={avgTicket}
                  onChange={(e) => setAvgTicket(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/40">
              <div>
                <span className="text-xs text-slate-600 dark:text-slate-400">Leads recuperados con CRM & IA:</span>
                <p className="text-base font-bold text-slate-900 dark:text-white">~{recoveredLeads} operaciones adicionales / mes</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-blue-700 dark:text-blue-400 font-semibold uppercase">Honorarios preservados:</span>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(estimatedSavings)} / mes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Características Principales</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Herramientas diseñadas para escalar tu portafolio inmobiliario y eliminar fricciones con propietarios e inquilinos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mb-4 border border-blue-200 dark:border-blue-800">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">CRM de Prospectos</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Gestiona el ciclo de vida completo de los clientes potenciales. Seguimiento automatizado, embudos de conversión y comunicación centralizada para agencias.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('dashboard')}
              className="mt-6 flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:gap-2 transition-all"
            >
              Explorar CRM <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature 2 */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-200 dark:border-emerald-800">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Actualización Automática de Alquileres</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Olvídate de los cálculos manuales. Nuestro motor aplica automáticamente los índices de actualización de contratos (IPC, ICL, etc.) y notifica a los inquilinos con antelación, garantizando precisión financiera y cumplimiento legal.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('contracts')}
              className="mt-6 flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:gap-2 transition-all"
            >
              Ver Calculadora <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature 3 */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mb-4 border border-purple-200 dark:border-purple-800">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Portal de Inquilinos</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Acceso 24/7 para que los inquilinos descarguen recibos, reporten incidencias de mantenimiento y revisen el estado de su cuenta corriente en tiempo real.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('tenant_portal')}
              className="mt-6 flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:gap-2 transition-all"
            >
              Ver Portal Móvil <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Planes y Precios</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Escala sin fricciones. Elige el plan que se adapte a tu operación inmobiliaria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {/* Card 1: Freemium */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  FREEMIUM (GRATIS)
                </span>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">$0</span>
                  <span className="text-slate-500 text-xs">/mes</span>
                </div>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                  Ideal para administradores independientes y martilleros individuales.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-600" /> 1 Usuario</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-600" /> Hasta 50 propiedades</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-600" /> Gestión de contratos básica</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-600" /> Portal de inquilinos</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-600" /> Conexión Social (1 cuenta)</li>
                </ul>
              </div>

              <button
                onClick={() => onNavigate('auth')}
                className="mt-6 w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-xs rounded-lg transition-all"
              >
                Comenzar Gratis
              </button>
            </div>

            {/* Card 2: Agencia (Popular) */}
            <div className="bg-slate-900 text-white rounded-xl p-6 border-2 border-blue-600 shadow-lg flex flex-col justify-between relative transform md:-translate-y-1">
              <div className="absolute -top-3 right-6 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider py-0.5 px-2.5 rounded-full">
                Popular
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                  AGENCIA
                </span>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">$49</span>
                  <span className="text-slate-400 text-xs">/mes</span>
                </div>
                <p className="mt-1.5 text-xs text-slate-300">
                  Para equipos y agencias en crecimiento en Junín y la provincia.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-200">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Hasta 5 Usuarios (Roles Admin/Ventas)</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Propiedades ilimitadas</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> CRM de Prospectos con alertas &gt;48h</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Portal de inquilinos con notificaciones</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Conexión Social Ilimitada</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Automatización de Leads con IA</li>
                </ul>
              </div>

              <button
                onClick={() => onNavigate('auth')}
                className="mt-6 w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg shadow-sm transition-all"
              >
                Prueba Gratuita 14 Días
              </button>
            </div>

            {/* Card 3: Multi-Sucursal */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  MULTI-SUCURSAL
                </span>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">$99</span>
                  <span className="text-slate-500 text-xs">/mes</span>
                </div>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                  Control total para grandes operaciones con múltiples sucursales.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-600" /> Usuarios Ilimitados</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-600" /> Multi-Tenant con selector de sucursal</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-600" /> API Access & Integraciones Webhook</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-600" /> Reportes financieros avanzados y CSV/PDF</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-600" /> Soporte prioritario 24/7</li>
                </ul>
              </div>

              <button
                onClick={() => onNavigate('auth')}
                className="mt-6 w-full py-2.5 px-4 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs rounded-lg transition-all"
              >
                Contactar Ventas
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <span className="font-bold text-lg tracking-tight">PropTech Pro</span>
            <p className="text-xs text-slate-400 mt-1">© 2026 PropTech Pro SaaS B2B. Todos los derechos reservados.</p>
          </div>
          <div className="flex gap-6 text-xs text-slate-400">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Términos</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Contacto</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Precios</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
