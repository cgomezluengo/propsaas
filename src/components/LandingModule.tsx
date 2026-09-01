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
        <span className="text-slate-300">Sistema inmobiliario simple y automático • Alquileres, ICL / IPC y WhatsApp</span>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-16 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 -left-24 w-80 h-80 bg-slate-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6 border border-blue-200 dark:border-blue-800">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Para Inmobiliarias y Martilleros
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            Administrá tus alquileres y clientes <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-slate-900 dark:from-blue-400 dark:via-blue-300 dark:to-slate-200">
              de forma simple y sin vueltas
            </span>
          </h1>

          <p className="mt-4 sm:mt-5 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Calculá aumentos automáticos por ICL o IPC, emití recibos con un clic y respondé consultas de WhatsApp al instante sin perder ningún cliente.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Probar Sistema Gratis
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('contracts')}
              className="w-full sm:w-auto px-6 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Ver Calculadora ICL / IPC
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600" /> Sin tarjeta de crédito</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600" /> Listo para usar en 1 minuto</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600" /> Soporte por WhatsApp</span>
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
                Avisos Automáticos
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
              Seguimiento de Consultas
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              No dejes consultas colgadas. Respondé por WhatsApp con 1 toque antes de que el interesado alquile en otro lado.
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
                Índices ICL / IPC
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
              Aumento de Alquileres
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Calculá cuánto sube cada contrato al instante, descargá el recibo listo para firmar y avisale al inquilino.
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
                Desde el Celular
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
              Portal para Inquilinos
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Tus inquilinos pueden consultar cuánto pagar, ver el alias para transferir y descargar sus recibos cuando quieran.
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
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Calculadora de Ganancia por Respuestas Rápidas</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Mirá cuánto dinero extra genera tu inmobiliaria respondiendo a tiempo las consultas</p>
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
                <span className="text-xs text-slate-600 dark:text-slate-400">Consultas convertidas en visitas/reservas:</span>
                <p className="text-base font-bold text-slate-900 dark:text-white">~{recoveredLeads} operaciones adicionales al mes</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-blue-700 dark:text-blue-400 font-semibold uppercase">Comisiones ganadas estimadas:</span>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(estimatedSavings)} / mes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">¿Por qué usar el sistema?</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Herramientas fáciles de entender pensadas para el día a día de una inmobiliaria argentina.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mb-4 border border-blue-200 dark:border-blue-800">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Panel de Consultas & WhatsApp</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Centralizá las consultas de WhatsApp, llamadas y portales en un solo lugar. Marcá con un toque quién ya visitó la propiedad o quién está por señar.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('dashboard')}
              className="mt-6 flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:gap-2 transition-all"
            >
              Ver Panel de Consultas <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature 2 */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-200 dark:border-emerald-800">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Aumentos Automáticos de Alquiler</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Sin cálculos complicados: elegí el contrato, seleccioná el índice oficial (ICL o IPC) y obtené el nuevo valor del alquiler junto al recibo oficial en PDF.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('contracts')}
              className="mt-6 flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:gap-2 transition-all"
            >
              Calcular Aumentos <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature 3 */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mb-4 border border-purple-200 dark:border-purple-800">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Portal para Inquilinos</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Tus inquilinos pueden entrar desde su celular, ver el monto a pagar, enviar el comprobante de transferencia y reportar cualquier arreglo que necesite la casa.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('tenant_portal')}
              className="mt-6 flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:gap-2 transition-all"
            >
              Ver Portal de Inquilinos <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Planes Claros y Transparentes</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Elegí la opción ideal según el tamaño de tu inmobiliaria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {/* Card 1: Inicial */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  INICIAL (GRATIS)
                </span>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">$0</span>
                  <span className="text-slate-500 text-xs">/mes</span>
                </div>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                  Para martilleros o administradores independientes que están empezando.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-600" /> 1 Usuario</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-600" /> Hasta 50 propiedades</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-600" /> Calculadora de aumentos ICL / IPC</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-600" /> Portal para inquilinos</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-600" /> Recibos de alquiler en PDF</li>
                </ul>
              </div>

              <button
                onClick={() => onNavigate('dashboard')}
                className="mt-6 w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-xs rounded-lg transition-all"
              >
                Empezar Gratis
              </button>
            </div>

            {/* Card 2: Inmobiliaria (Popular) */}
            <div className="bg-slate-900 text-white rounded-xl p-6 border-2 border-blue-600 shadow-lg flex flex-col justify-between relative transform md:-translate-y-1">
              <div className="absolute -top-3 right-6 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider py-0.5 px-2.5 rounded-full">
                Recomendado
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                  INMOBILIARIA
                </span>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">$49</span>
                  <span className="text-slate-400 text-xs">/mes</span>
                </div>
                <p className="mt-1.5 text-xs text-slate-300">
                  Para oficinas inmobiliarias con equipo de atención y ventas.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-200">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Hasta 5 Usuarios del equipo</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Propiedades y contratos ilimitados</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Seguimiento de consultas y avisos automáticos</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Respuestas de WhatsApp con 1 clic</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Portal de inquilinos con notificaciones</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Asistente inteligente para evaluar interesados</li>
                </ul>
              </div>

              <button
                onClick={() => onNavigate('dashboard')}
                className="mt-6 w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg shadow-sm transition-all"
              >
                Probar 14 Días Gratis
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
                  Para empresas inmobiliarias con varias oficinas o sucursales.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-600" /> Usuarios ilimitados</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-600" /> Manejo de múltiples sucursales</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-600" /> Reportes de cobro y contratos exportables a Excel</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-600" /> Asesor dedicado y soporte telefónico</li>
                </ul>
              </div>

              <button
                onClick={() => onNavigate('dashboard')}
                className="mt-6 w-full py-2.5 px-4 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs rounded-lg transition-all"
              >
                Consultar por Sucursales
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
