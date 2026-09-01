import React, { useState } from 'react';
import { 
  Sparkles, Bot, ArrowRight, CheckCircle, Copy, Check, MessageSquare, 
  Send, ShieldCheck, Flame, Zap, RefreshCw, ThumbsUp, AlertTriangle 
} from 'lucide-react';
import { Lead, Tenant } from '../types';
import { mockLeads } from '../data/mockData';

interface Props {
  currentTenant: Tenant;
  selectedLeadProp?: Lead | null;
}

export const AILeadScoringModule: React.FC<Props> = ({ currentTenant, selectedLeadProp }) => {
  const [leads] = useState<Lead[]>(mockLeads);
  const [selectedLead, setSelectedLead] = useState<Lead>(selectedLeadProp || mockLeads[0]);
  const [copiedReply, setCopiedReply] = useState(false);

  // Live Simulation Area
  const [customPrompt, setCustomPrompt] = useState(
    'Hola buenas tardes, vi la casa en Villa Belgrano Junín, somos una familia con 2 chicos y una perrita, tenemos garantía de propiedad en Chacabuco y recibo de sueldo de la municipalidad. ¿Podemos ir a verla este jueves a las 18hs?'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [simulatedResult, setSimulatedResult] = useState<{
    score: number;
    category: string;
    urgency: string;
    guarantee: string;
    suggestedReply: string;
  } | null>({
    score: 96,
    category: 'Alta Intención de Alquiler',
    urgency: 'Inmediata (Visita solicitada para este jueves)',
    guarantee: 'Garantía Propietaria Chacabuco + Recibo Municipal Verificado',
    suggestedReply: '¡Hola! Qué gusto saludarte. Sí, la casa en Villa Belgrano acepta mascotas sin inconveniente. La garantía de Chacabuco y tu recibo municipal son perfectos para el contrato. Te agendo la visita para este jueves a las 18:00 hs con el Martillero Carlos Gómez. ¿Te parece bien?'
  });

  const handleAnalyzeLive = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      let score = 85;
      let category = 'Alta Intención';
      if (customPrompt.toLowerCase().includes('precio') && customPrompt.length < 30) {
        score = 65;
        category = 'Consulta Rápida de Precio';
      } else if (customPrompt.toLowerCase().includes('garantía') || customPrompt.toLowerCase().includes('recibo')) {
        score = 95;
        category = 'Perfil Altamente Solvente';
      }

      setSimulatedResult({
        score: score,
        category: category,
        urgency: 'Alta (24-48 horas)',
        guarantee: 'Documentación en regla mencionada',
        suggestedReply: `¡Hola! Gracias por comunicarte con ${currentTenant.name}. Hemos revisado tu consulta. Con gusto podemos coordinar una visita y pasarte los requisitos de locación detallados.`
      });
      setIsAnalyzing(false);
    }, 800);
  };

  const handleCopyReply = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedReply(true);
    setTimeout(() => setCopiedReply(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-950 text-blue-300 text-[11px] font-bold uppercase tracking-wider mb-2 border border-blue-800">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Motor Inteligente de Calificación
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Scoring IA & Respuestas Automáticas
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Filtra clientes curiosos de compradores e inquilinos reales con evaluación instantánea de garantías, capacidad de pago y urgencia de mudanza.
            </p>
          </div>

          <div className="bg-slate-800/80 px-4 py-2.5 rounded-lg border border-slate-700 text-center">
            <span className="text-xl font-bold font-mono text-blue-400">180 ms</span>
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Tiempo de Respuesta</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Lead Selector (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center justify-between">
            <span>Prospectos Calificados</span>
            <span className="text-[11px] text-slate-400 font-normal">Recientes</span>
          </h3>

          <div className="space-y-2 overflow-y-auto max-h-[600px] pr-1">
            {leads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedLead.id === lead.id
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-1 ring-blue-500'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-xs text-slate-900 dark:text-white">
                    {lead.name}
                  </span>
                  {lead.aiScore && (
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                      lead.aiScore.score >= 80 ? 'bg-green-50 text-green-700 dark:bg-emerald-950 dark:text-emerald-300 border border-green-200 dark:border-emerald-800' :
                      lead.aiScore.score >= 50 ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800' :
                      'bg-red-50 text-red-700 dark:bg-rose-950 dark:text-rose-300 border border-red-200 dark:border-rose-800'
                    }`}>
                      Score: {lead.aiScore.score}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                  {lead.propertyInterest}
                </p>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                  <span className="capitalize">{lead.channel}</span>
                  <span>•</span>
                  <span>{lead.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: AI Analysis Card & Auto Responder (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Card: Selected Lead AI Evaluation */}
          {selectedLead && selectedLead.aiScore && (
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                    Auditoría de Prospecto con IA
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                    {selectedLead.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Interés en: {selectedLead.propertyInterest} ({selectedLead.budget})
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-medium block">Puntaje IA</span>
                    <span className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
                      {selectedLead.aiScore.score}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* Badges row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Garantía Detectada:</span>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    {selectedLead.aiScore.guaranteeStatus}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Solvencia de Ingresos:</span>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    {selectedLead.aiScore.verifiedIncome ? 'Demostrable con Recibo' : 'Sin documentar'}
                  </p>
                </div>
              </div>

              {/* AI Reasoning */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Justificación del Algoritmo
                </h4>
                <div className="p-3.5 bg-blue-50/40 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900/50 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedLead.aiScore.reason}
                </div>
              </div>

              {/* Auto Reply Box */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-blue-600" /> Respuesta Óptima Sugerida (WhatsApp/Instagram)
                  </h4>
                  <button
                    onClick={() => handleCopyReply(selectedLead.aiScore!.suggestedReply)}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    {copiedReply ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedReply ? '¡Copiado!' : 'Copiar'}
                  </button>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 font-sans text-xs text-slate-800 dark:text-slate-200">
                  {selectedLead.aiScore.suggestedReply}
                </div>

                <div className="mt-3 flex justify-end gap-2">
                  <a
                    href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(selectedLead.aiScore.suggestedReply)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-sm transition-all"
                  >
                    <Send className="w-3.5 h-3.5" /> Enviar por WhatsApp Oficial
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Live Message Simulator */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                Simulador en Vivo
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                Probar Clasificador con un Mensaje Real
              </h3>
              <p className="text-xs text-slate-500">
                Pega cualquier texto recibido por Instagram DM o WhatsApp para evaluar al prospecto:
              </p>
            </div>

            <textarea
              rows={3}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Pega el mensaje del cliente aquí..."
            />

            <div className="flex justify-end">
              <button
                type="button"
                disabled={isAnalyzing}
                onClick={handleAnalyzeLive}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isAnalyzing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                {isAnalyzing ? 'Analizando con IA...' : 'Analizar Mensaje'}
              </button>
            </div>

            {simulatedResult && (
              <div className="mt-3 p-3.5 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800/40 text-xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-blue-200">
                    Resultado: {simulatedResult.category}
                  </span>
                  <span className="px-2 py-0.5 bg-blue-600 text-white rounded font-mono font-bold text-[10px]">
                    Score: {simulatedResult.score}/100
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  <strong>Respuesta Sugerida:</strong> {simulatedResult.suggestedReply}
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
