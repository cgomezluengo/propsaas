import React, { useState } from 'react';
import { 
  Phone, AlertTriangle, 
  Plus, Search, Filter, Download, Sparkles, CheckCircle2, Clock, 
  Zap, Check, Send, 
  Calendar, Share2, 
  HelpCircle, ArrowRight, List, LayoutGrid, Eye
} from 'lucide-react';
import { Lead, Tenant, User } from '../types';
import { mockLeads } from '../data/mockData';
import { exportLeadsToCSV } from '../utils/calculations';

interface Props {
  currentTenant: Tenant;
  currentUser: User;
  onOpenSpecsModal: () => void;
  onSelectLeadForAI: (lead: Lead) => void;
}

type ViewMode = 'easy_flow' | 'kanban' | 'list';

export const DashboardCRMModule: React.FC<Props> = ({
  currentTenant,
  currentUser,
}) => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [viewMode, setViewMode] = useState<ViewMode>('easy_flow');
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [urgencyFilterOnly, setUrgencyFilterOnly] = useState<boolean>(false);
  
  // Modals and Drawers
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<Lead | null>(null);
  const [whatsappModalLead, setWhatsappModalLead] = useState<Lead | null>(null);
  const [customWhatsAppMessage, setCustomWhatsAppMessage] = useState<string>('');
  const [scheduleVisitLead, setScheduleVisitLead] = useState<Lead | null>(null);
  const [visitDate, setVisitDate] = useState('Mañana a las 17:30 hs');
  const [visitNotes, setVisitNotes] = useState('Visita con martillero en la propiedad');
  const [showGuideBanner, setShowGuideBanner] = useState(true);

  // New Lead Form State
  const [newLeadMode, setNewLeadMode] = useState<'simple' | 'paste'>('simple');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('+54 236 4');
  const [newProperty, setNewProperty] = useState('');
  const [newChannel, setNewChannel] = useState<'whatsapp' | 'instagram' | 'facebook' | 'web'>('whatsapp');
  const [newBudget, setNewBudget] = useState('$ 350.000');
  const [newNotes, setNewNotes] = useState('');
  const [pastedText, setPastedText] = useState('');

  // Move Lead to another status
  const handleMoveLead = (leadId: string, newStatus: Lead['status']) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          status: newStatus,
          hoursUnanswered: newStatus !== 'new' ? 0 : lead.hoursUnanswered
        };
      }
      return lead;
    }));

    if (selectedLeadForDetail && selectedLeadForDetail.id === leadId) {
      setSelectedLeadForDetail(prev => prev ? { ...prev, status: newStatus, hoursUnanswered: 0 } : null);
    }
  };

  // Open WhatsApp Smart Dialog
  const handleOpenWhatsAppModal = (lead: Lead) => {
    setWhatsappModalLead(lead);
    const suggestedText = lead.aiScore?.suggestedReply || 
      `¡Hola ${lead.name.split(' ')[0]}! Te escribo de ${currentTenant.name} por tu consulta sobre "${lead.propertyInterest}". ¿Querés que coordinemos una visita o te envíe fotos y detalles?`;
    setCustomWhatsAppMessage(suggestedText);
  };

  // Execute WhatsApp Send
  const handleSendWhatsApp = (lead: Lead) => {
    const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
    const encodedText = encodeURIComponent(customWhatsAppMessage);
    const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
    
    // Automatically advance lead status to contacted and reset unanswered counter
    handleMoveLead(lead.id, 'contacted');
    setWhatsappModalLead(null);

    // Open WhatsApp in new tab
    window.open(waUrl, '_blank');
  };

  // Schedule Visit confirm
  const handleConfirmVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleVisitLead) return;

    setLeads(prev => prev.map(l => {
      if (l.id === scheduleVisitLead.id) {
        return {
          ...l,
          status: 'visit_scheduled',
          hoursUnanswered: 0,
          notes: `${l.notes} | 📅 Visita: ${visitDate} (${visitNotes})`
        };
      }
      return l;
    }));

    setScheduleVisitLead(null);
  };

  // Auto-parse pasted WhatsApp message
  const handleParsePastedText = () => {
    if (!pastedText) return;
    
    let detectedName = 'Consulta WhatsApp';
    let detectedPhone = '+54 236 4';
    let detectedProperty = 'Inmueble en Junín';

    // Check phone pattern
    const phoneMatch = pastedText.match(/(\+?\d[\d\s-]{8,})/);
    if (phoneMatch) {
      detectedPhone = phoneMatch[0].trim();
    }

    // Check name heuristic
    const nameMatch = pastedText.match(/(?:soy|nombre es|me llamo|de parte de)\s+([A-ZÁÉÍÓÚa-záéíóú\s]{2,20})/i);
    if (nameMatch) {
      detectedName = nameMatch[1].trim();
    } else {
      const firstWords = pastedText.split(' ').slice(0, 2).join(' ');
      if (firstWords.length > 3) detectedName = firstWords;
    }

    // Check property keywords
    if (pastedText.toLowerCase().includes('depto') || pastedText.toLowerCase().includes('departamento')) {
      detectedProperty = 'Departamento 2 Amb';
    } else if (pastedText.toLowerCase().includes('casa')) {
      detectedProperty = 'Casa Familiar';
    } else if (pastedText.toLowerCase().includes('oficina') || pastedText.toLowerCase().includes('local')) {
      detectedProperty = 'Local Comercial';
    }

    setNewName(detectedName);
    setNewPhone(detectedPhone);
    setNewProperty(detectedProperty);
    setNewNotes(pastedText);
    setNewLeadMode('simple');
  };

  // Add new lead
  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    const newLeadItem: Lead = {
      id: `lead-${Date.now()}`,
      name: newName || 'Consulta Rápida',
      phone: newPhone || '+54 236 4000000',
      email: `${newName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'lead'}@consulta.com`,
      channel: newChannel,
      propertyInterest: newProperty || 'Propiedad Consultada',
      propertyAddress: 'Zona Centro - Junín',
      status: 'new',
      leadType: 'alquiler',
      budget: newBudget,
      timeframe: 'Inmediato',
      createdAt: 'Recién cargado',
      hoursUnanswered: 0,
      notes: newNotes || 'Consulta cargada mediante flujo rápido.',
      aiScore: {
        score: 88,
        category: 'alta_intencion',
        reason: 'Lead registrado con consulta activa. Respuesta sugerida generada automáticamente.',
        suggestedReply: `¡Hola ${newName.split(' ')[0]}! Gracias por consultar por ${newProperty || 'la propiedad'}. ¿Querés que coordinemos una visita esta semana?`,
        guaranteeStatus: 'En verificación',
        verifiedIncome: true
      }
    };

    setLeads([newLeadItem, ...leads]);
    setIsNewLeadModalOpen(false);
    setNewName('');
    setNewProperty('');
    setNewNotes('');
    setPastedText('');
  };

  // Filtered leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.propertyInterest.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.phone.includes(searchTerm);
    const matchesChannel = channelFilter === 'all' || lead.channel === channelFilter;
    const matchesUrgency = !urgencyFilterOnly || (lead.status === 'new' && lead.hoursUnanswered >= 24);
    return matchesSearch && matchesChannel && matchesUrgency;
  });

  const columnNew = filteredLeads.filter(l => l.status === 'new');
  const columnContacted = filteredLeads.filter(l => l.status === 'contacted');
  const columnVisit = filteredLeads.filter(l => l.status === 'visit_scheduled');
  const columnLost = filteredLeads.filter(l => l.status === 'lost');

  // Urgency Counts
  const unansweredCount = leads.filter(l => l.status === 'new' && l.hoursUnanswered >= 24).length;
  const urgent48Count = leads.filter(l => l.status === 'new' && l.hoursUnanswered >= 48).length;

  return (
    <div className="space-y-6 animate-fadeIn text-[#191C1E]">
      
      {/* 1. Header with Daily Summary & Quick Mode Switcher */}
      <div className="bg-white p-5 rounded-xl border border-[#E6E8EA] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-[#E6E8EA]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-[#191C1E]">
                Consultas & Clientes Interesados
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F2F4F6] text-[#091426] font-bold border border-[#E6E8EA]">
                {currentTenant.name}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Hola, <span className="font-semibold text-[#191C1E]">{currentUser.name}</span>. Acá tenés todas las personas que consultaron por tus propiedades ordenadas por urgencia.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => exportLeadsToCSV(leads)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#F2F4F6] active:scale-[0.98] text-[#191C1E] text-xs font-semibold rounded-xl border border-[#CBD5E1] transition-all shadow-2xs"
              title="Descargar lista de consultas en Excel"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" /> Descargar Excel
            </button>

            <button
              onClick={() => setIsNewLeadModalOpen(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-[#091426] hover:bg-[#1E293B] active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" /> + Cargar Consulta
            </button>
          </div>
        </div>

        {/* View Mode Toggle Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3">
          <div className="flex flex-wrap items-center gap-1.5 bg-[#F2F4F6] p-1 rounded-xl border border-[#E6E8EA] w-full sm:w-auto">
            <button
              onClick={() => setViewMode('easy_flow')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'easy_flow'
                  ? 'bg-white text-[#091426] shadow-xs border border-[#E6E8EA]'
                  : 'text-slate-600 hover:text-[#091426]'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#006C49]" />
              <span>⚡ Modo Paso a Paso</span>
            </button>

            <button
              onClick={() => setViewMode('kanban')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white text-[#091426] shadow-xs border border-[#E6E8EA]'
                  : 'text-slate-600 hover:text-[#091426]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Columnas</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-[#091426] shadow-xs border border-[#E6E8EA]'
                  : 'text-slate-600 hover:text-[#091426]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Lista</span>
            </button>
          </div>

          {/* Quick Urgency Toggles */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setUrgencyFilterOnly(!urgencyFilterOnly)}
              className={`w-full sm:w-auto justify-center px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border active:scale-[0.98] ${
                urgencyFilterOnly
                  ? 'bg-[#BA1A1A] text-white border-[#BA1A1A] shadow-sm'
                  : 'bg-[#F2F4F6] text-[#191C1E] border-[#E6E8EA] hover:bg-[#E6E8EA]'
              }`}
            >
              <AlertTriangle className={`w-3.5 h-3.5 ${urgencyFilterOnly ? 'text-white' : 'text-[#BA1A1A]'}`} />
              <span>Sin responder ({unansweredCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Collapsible Friendly Guide Banner */}
      {showGuideBanner && (
        <div className="bg-[#F2F4F6] border border-[#E6E8EA] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#091426] text-white flex items-center justify-center shrink-0 mt-0.5">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#091426]">
                ¿Cómo usar esta sección? (Super fácil en 3 pasos)
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                <span className="font-bold text-[#191C1E]">1. Responder:</span> Tocá <span className="font-semibold text-[#006C49]">"WhatsApp con IA"</span> para enviar un mensaje listo → <span className="font-bold text-[#191C1E]">2. Agendar:</span> Tocá <span className="font-semibold text-[#191C1E]">"Agendar Visita"</span> al coordinar el día → <span className="font-bold text-[#191C1E]">3. Contrato:</span> Marcá la seña y generá el contrato con 1 clic.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowGuideBanner(false)}
            className="text-xs text-[#091426] hover:underline font-semibold shrink-0"
          >
            Entendido ✕
          </button>
        </div>
      )}

      {/* 3. Search & Channel Filter Bar */}
      <div className="bg-white p-3 rounded-xl border border-[#E6E8EA] flex flex-col sm:flex-row gap-3 justify-between items-center shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, teléfono o inmueble..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#F7F9FB] border border-[#E6E8EA] rounded-lg text-xs text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-[#091426]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Canal:
          </span>
          {['all', 'whatsapp', 'instagram', 'facebook', 'web'].map((chn) => (
            <button
              key={chn}
              onClick={() => setChannelFilter(chn)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all capitalize whitespace-nowrap active:scale-[0.98] ${
                channelFilter === chn
                  ? 'bg-[#091426] text-white shadow-xs'
                  : 'bg-[#F2F4F6] text-slate-600 hover:bg-[#E6E8EA] hover:text-[#091426]'
              }`}
            >
              {chn === 'all' ? 'Todos los canales' : chn}
            </button>
          ))}
        </div>
      </div>

      {/* 4. VIEW MODE 1: MODO FLUJO FÁCIL (Paso a Paso Diario) */}
      {viewMode === 'easy_flow' && (
        <div className="space-y-6">
          
          {/* STEP 1: CONSULTAS URGENTES POR RESPONDER */}
          <div className="bg-white rounded-xl border border-[#E6E8EA] p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 pb-3 border-b border-[#E6E8EA]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FFDAD6]/60 text-[#BA1A1A] flex items-center justify-center font-bold text-xs border border-[#FFDAD6]">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#191C1E] flex items-center gap-2">
                    🚨 Paso 1: Responder Consultas Nuevas ({columnNew.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Respondé rápido para evitar que el interesado busque en otra inmobiliaria.
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#BA1A1A] bg-[#FFDAD6]/40 px-2.5 py-1 rounded-lg border border-[#FFDAD6]">
                {urgent48Count} con más de 48h sin respuesta
              </span>
            </div>

            {columnNew.length === 0 ? (
              <div className="py-8 text-center bg-[#F7F9FB] rounded-xl border border-dashed border-[#CBD5E1]">
                <CheckCircle2 className="w-8 h-8 text-[#006C49] mx-auto mb-2" />
                <p className="text-sm font-bold text-[#191C1E]">¡Bandeja al día!</p>
                <p className="text-xs text-slate-500">No hay consultas nuevas pendientes de respuesta.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {columnNew.map((lead) => (
                  <div
                    key={lead.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                      lead.hoursUnanswered >= 48
                        ? 'bg-red-50/40 border-[#FFDAD6] shadow-xs'
                        : 'bg-[#F7F9FB] border-[#E6E8EA] hover:border-[#CBD5E1]'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white text-[#091426] border border-[#E6E8EA]">
                            {lead.channel}
                          </span>
                          <span className="text-xs font-mono text-slate-500">
                            {lead.createdAt}
                          </span>
                        </div>
                        {lead.hoursUnanswered >= 24 && (
                          <span className="text-[10px] font-bold text-[#BA1A1A] bg-[#FFDAD6]/60 px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#FFDAD6]">
                            <Clock className="w-3 h-3" /> {lead.hoursUnanswered}h sin responder
                          </span>
                        )}
                      </div>

                      {/* Lead Info */}
                      <h4 className="font-bold text-base text-[#191C1E]">
                        {lead.name}
                      </h4>
                      <p className="text-xs font-semibold text-[#091426] mt-0.5">
                        Interesado en: {lead.propertyInterest}
                      </p>
                      <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 bg-white p-2.5 rounded-lg border border-[#E6E8EA]">
                        "{lead.notes}"
                      </p>

                      {/* AI Score Badge */}
                      {lead.aiScore && (
                        <div className="mt-2.5 flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-[#E6E8EA]">
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#006C49]" />
                            <span className="font-bold text-[#191C1E]">
                              Intención IA: {lead.aiScore.score}/100
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {lead.aiScore.guaranteeStatus}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Quick Direct Actions */}
                    <div className="mt-4 pt-3 border-t border-[#E6E8EA] flex flex-wrap items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedLeadForDetail(lead)}
                        className="text-xs font-semibold text-slate-600 hover:text-[#091426] flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-400" /> Ver Ficha
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleMoveLead(lead.id, 'contacted')}
                          className="px-3 py-1.5 bg-white hover:bg-[#E6E8EA] text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-[#CBD5E1]"
                        >
                          ✓ Respondido
                        </button>

                        <button
                          onClick={() => handleOpenWhatsAppModal(lead)}
                          className="px-3.5 py-1.5 bg-[#006C49] hover:bg-[#007D55] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>WhatsApp con IA</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* STEP 2 & STEP 3 GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* STEP 2: EN CONVERSACIÓN / COORDINAR VISITA */}
            <div className="bg-white rounded-xl border border-[#E6E8EA] p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-[#E6E8EA]">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs border border-amber-200">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#191C1E] flex items-center gap-2">
                      💬 Paso 2: En Conversación ({columnContacted.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Prospectos que ya respondieron. El objetivo es coordinar una visita.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {columnContacted.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3.5 rounded-xl border border-[#E6E8EA] bg-[#F7F9FB] hover:border-[#CBD5E1] transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-sm text-[#191C1E]">
                            {lead.name}
                          </h4>
                          <p className="text-xs text-[#091426] font-medium">
                            {lead.propertyInterest} • Presupuesto: {lead.budget}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          En Charla
                        </span>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-[#E6E8EA] flex justify-between items-center">
                        <button
                          onClick={() => handleMoveLead(lead.id, 'lost')}
                          className="text-xs text-slate-400 hover:text-[#BA1A1A] font-medium"
                        >
                          ✕ Descartar
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenWhatsAppModal(lead)}
                            className="text-xs font-semibold text-[#006C49] hover:underline flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" /> Escribir
                          </button>
                          <button
                            onClick={() => {
                              setScheduleVisitLead(lead);
                            }}
                            className="px-3 py-1.5 bg-[#091426] hover:bg-[#1E293B] text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-2xs active:scale-[0.98]"
                          >
                            <Calendar className="w-3 h-3" /> Agendar Visita
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {columnContacted.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-6">No hay prospectos en conversación actualmente.</p>
                  )}
                </div>
              </div>
            </div>

            {/* STEP 3: VISITAS PROGRAMADAS & CIERRES */}
            <div className="bg-white rounded-xl border border-[#E6E8EA] p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-[#E6E8EA]">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#006C49] flex items-center justify-center font-bold text-xs border border-emerald-200">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#191C1E] flex items-center gap-2">
                      📍 Paso 3: Visitas Programadas ({columnVisit.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Citas pactadas. Posterior a la visita, reservan y pasan a contrato.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {columnVisit.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/20"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-[#006C49] border border-emerald-200">
                              Visita Confirmada
                            </span>
                            <span className="text-xs font-bold text-[#006C49]">HOY</span>
                          </div>
                          <h4 className="font-bold text-sm text-[#191C1E] mt-1">
                            {lead.name}
                          </h4>
                          <p className="text-xs text-slate-600 font-medium">
                            📍 {lead.propertyAddress}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 p-2 bg-white rounded-lg border border-[#E6E8EA] text-xs text-slate-700 flex justify-between items-center">
                        <span>Martillero: Carlos Gómez</span>
                        <a
                          href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hola! Te comparto la ubicación exacta de la propiedad para la visita de hoy.')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-[#006C49] hover:underline flex items-center gap-1"
                        >
                          <Share2 className="w-3 h-3" /> Mandar Ubicación
                        </a>
                      </div>

                      <div className="mt-3 pt-2 border-t border-emerald-200 flex justify-between items-center">
                        <button
                          onClick={() => handleMoveLead(lead.id, 'contacted')}
                          className="text-xs text-slate-500 hover:underline"
                        >
                          ↺ Reprogramar
                        </button>
                        <button
                          onClick={() => {
                            alert(`¡Excelente! El cliente ${lead.name} reservó la propiedad. Podés generar el contrato desde el módulo de Contratos & ICL.`);
                          }}
                          className="px-3 py-1.5 bg-[#006C49] hover:bg-[#007D55] text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs active:scale-[0.98]"
                        >
                          <Check className="w-3.5 h-3.5" /> Iniciar Contrato
                        </button>
                      </div>
                    </div>
                  ))}
                  {columnVisit.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-6">No hay visitas programadas para hoy.</p>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 5. VIEW MODE 2: TABLERO KANBAN */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* COLUMN 1: NUEVOS */}
          <div className="bg-[#F7F9FB] rounded-xl p-3.5 border border-[#E6E8EA] flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#091426]"></span>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Nuevos ({columnNew.length})
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ingresos</span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {columnNew.map((lead) => (
                <div
                  key={lead.id}
                  className={`bg-white p-3.5 rounded-xl border shadow-2xs hover:border-[#CBD5E1] transition-all ${
                    lead.hoursUnanswered >= 48
                      ? 'border-l-4 border-l-[#BA1A1A] border-t-[#E6E8EA] border-r-[#E6E8EA] border-b-[#E6E8EA]'
                      : 'border-[#E6E8EA]'
                  }`}
                >
                  {lead.hoursUnanswered >= 48 && (
                    <div className="bg-[#BA1A1A] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-md mb-2 flex items-center justify-between">
                      <span>⚠️ Alerta ({lead.hoursUnanswered}h)</span>
                      <span className="font-mono">&gt;48H</span>
                    </div>
                  )}

                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#F2F4F6] text-[#091426] border border-[#E6E8EA]">
                      {lead.channel}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{lead.createdAt}</span>
                  </div>

                  <h4 className="font-bold text-sm text-[#191C1E] mt-2">
                    {lead.name}
                  </h4>
                  <p className="text-xs font-semibold text-[#091426] mt-0.5">
                    {lead.propertyInterest}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-[#E6E8EA] flex justify-between items-center">
                    <button
                      onClick={() => handleOpenWhatsAppModal(lead)}
                      className="text-xs font-bold text-[#006C49] hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" /> WhatsApp
                    </button>
                    <button
                      onClick={() => handleMoveLead(lead.id, 'contacted')}
                      className="text-xs font-semibold text-slate-700 hover:text-[#091426] flex items-center gap-1 bg-[#F2F4F6] px-2 py-1 rounded-md"
                    >
                      Avanzar <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN 2: CONTACTADOS */}
          <div className="bg-[#F7F9FB] rounded-xl p-3.5 border border-[#E6E8EA] flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Contactados ({columnContacted.length})
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">En Charla</span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {columnContacted.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-white p-3.5 rounded-xl border border-[#E6E8EA] shadow-2xs hover:border-[#CBD5E1] transition-all"
                >
                  <h4 className="font-bold text-sm text-[#191C1E]">
                    {lead.name}
                  </h4>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">
                    {lead.propertyInterest}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Presupuesto: {lead.budget}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-[#E6E8EA] flex justify-between items-center">
                    <button
                      onClick={() => handleMoveLead(lead.id, 'lost')}
                      className="text-[11px] text-[#BA1A1A] hover:underline font-medium"
                    >
                      Descartar
                    </button>
                    <button
                      onClick={() => handleMoveLead(lead.id, 'visit_scheduled')}
                      className="text-xs font-semibold text-white bg-[#091426] hover:bg-[#1E293B] px-2.5 py-1 rounded-md flex items-center gap-1 shadow-2xs active:scale-[0.98]"
                    >
                      Agendar <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN 3: VISITA COORDINADA */}
          <div className="bg-[#F7F9FB] rounded-xl p-3.5 border border-[#E6E8EA] flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#006C49]"></span>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Visita Coordinada ({columnVisit.length})
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#006C49] uppercase tracking-wider">Caliente</span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {columnVisit.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-2xs"
                >
                  <h4 className="font-bold text-sm text-[#191C1E]">
                    {lead.name}
                  </h4>
                  <p className="text-xs font-semibold text-[#006C49] mt-0.5">
                    {lead.propertyInterest}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    📍 {lead.propertyAddress}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN 4: DESCARTADOS */}
          <div className="bg-[#F7F9FB] rounded-xl p-3.5 border border-[#E6E8EA] flex flex-col opacity-80">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-600">
                  Descartados ({columnLost.length})
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cerrados</span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {columnLost.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-white p-3.5 rounded-xl border border-[#E6E8EA]"
                >
                  <h4 className="font-bold text-sm text-slate-700">
                    {lead.name}
                  </h4>
                  <button
                    onClick={() => handleMoveLead(lead.id, 'new')}
                    className="mt-2 text-[11px] font-semibold text-[#091426] hover:underline"
                  >
                    ↺ Reabrir prospecto
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 6. VIEW MODE 3: LISTA COMPACTA */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-xl border border-[#E6E8EA] overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F9FB] border-b border-[#E6E8EA] text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Prospecto</th>
                  <th className="p-3.5">Canal</th>
                  <th className="p-3.5">Inmueble Consultado</th>
                  <th className="p-3.5">Estado / Flujo</th>
                  <th className="p-3.5">Score IA</th>
                  <th className="p-3.5 text-right">Acciones Rápidas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E8EA] text-slate-700 font-medium">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#F7F9FB] transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-[#191C1E] text-sm">{lead.name}</div>
                      <div className="text-slate-400 text-[11px] font-mono">{lead.phone}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="capitalize font-semibold text-[11px] px-2 py-0.5 rounded-md bg-[#F2F4F6] text-[#091426] border border-[#E6E8EA]">
                        {lead.channel}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-[#091426]">{lead.propertyInterest}</div>
                      <div className="text-slate-400 text-[11px]">{lead.budget}</div>
                    </td>
                    <td className="p-3.5">
                      <select
                        value={lead.status}
                        onChange={(e) => handleMoveLead(lead.id, e.target.value as Lead['status'])}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1 border focus:outline-none ${
                          lead.status === 'new'
                            ? 'bg-[#F2F4F6] text-[#091426] border-[#E6E8EA]'
                            : lead.status === 'contacted'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : lead.status === 'visit_scheduled'
                            ? 'bg-emerald-50 text-[#006C49] border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        <option value="new">Nuevo (Sin responder)</option>
                        <option value="contacted">Contactado (En charla)</option>
                        <option value="visit_scheduled">Visita Coordinada</option>
                        <option value="lost">Descartado</option>
                      </select>
                    </td>
                    <td className="p-3.5">
                      {lead.aiScore ? (
                        <span className="font-bold text-[#191C1E] px-2 py-0.5 bg-[#F2F4F6] rounded-md border border-[#E6E8EA]">
                          {lead.aiScore.score}/100
                        </span>
                      ) : '-'}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenWhatsAppModal(lead)}
                          className="p-1.5 rounded-lg bg-emerald-50 text-[#006C49] hover:bg-emerald-100 transition-colors border border-emerald-200"
                          title="Enviar WhatsApp"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedLeadForDetail(lead)}
                          className="p-1.5 rounded-lg bg-[#F2F4F6] text-slate-600 hover:bg-[#E6E8EA] transition-colors border border-[#E6E8EA]"
                          title="Ver Ficha Completa"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. WHATSAPP SMART RESPONDER MODAL */}
      {whatsappModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091426]/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 border border-[#E6E8EA] shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#E6E8EA]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#006C49] text-white flex items-center justify-center shadow-2xs">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#191C1E]">
                    Responder a {whatsappModalLead.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">{whatsappModalLead.phone}</p>
                </div>
              </div>
              <button
                onClick={() => setWhatsappModalLead(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {/* Quick Template Chips */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Plantillas Rápidas con 1 Clic:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCustomWhatsAppMessage(`¡Hola ${whatsappModalLead.name.split(' ')[0]}! Sigue disponible "${whatsappModalLead.propertyInterest}". ¿Querés coordinar una visita mañana a las 17:30 hs?`)}
                    className="px-2.5 py-1 bg-[#F2F4F6] hover:bg-[#E6E8EA] text-slate-700 text-xs rounded-lg font-medium border border-[#E6E8EA] active:scale-[0.98]"
                  >
                    📅 Coordinar Visita
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomWhatsAppMessage(`¡Hola ${whatsappModalLead.name.split(' ')[0]}! Para "${whatsappModalLead.propertyInterest}" solicitamos garantía propietaria o recibos de sueldo. ¿Querés que te envíe los requisitos completos?`)}
                    className="px-2.5 py-1 bg-[#F2F4F6] hover:bg-[#E6E8EA] text-slate-700 text-xs rounded-lg font-medium border border-[#E6E8EA] active:scale-[0.98]"
                  >
                    📋 Requisitos & Garantías
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomWhatsAppMessage(`¡Hola ${whatsappModalLead.name.split(' ')[0]}! Te comparto la ficha con fotos y precio del inmueble: ${whatsappModalLead.propertyAddress}. Avisame si querés conocerlo.`)}
                    className="px-2.5 py-1 bg-[#F2F4F6] hover:bg-[#E6E8EA] text-slate-700 text-xs rounded-lg font-medium border border-[#E6E8EA] active:scale-[0.98]"
                  >
                    🏠 Fotos & Ubicación
                  </button>
                </div>
              </div>

              {/* Message Editor */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Mensaje listo para enviar:
                </label>
                <textarea
                  rows={4}
                  value={customWhatsAppMessage}
                  onChange={(e) => setCustomWhatsAppMessage(e.target.value)}
                  className="w-full p-3 bg-[#F7F9FB] border border-[#E6E8EA] rounded-xl text-xs text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-[#006C49]"
                />
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-[#006C49] flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#006C49]" />
                <span>Al enviar, el prospecto pasará automáticamente a <strong>"Contactado"</strong> y se reseteará la alerta de tiempo.</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#E6E8EA] flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setWhatsappModalLead(null)}
                className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleSendWhatsApp(whatsappModalLead)}
                className="px-4 py-2 bg-[#006C49] hover:bg-[#007D55] text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                Abrir WhatsApp y Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. SCHEDULE VISIT MODAL */}
      {scheduleVisitLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091426]/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-xl p-6 border border-[#E6E8EA] shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#E6E8EA]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#091426] text-white flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#191C1E]">
                    Agendar Visita para {scheduleVisitLead.name}
                  </h3>
                  <p className="text-xs text-[#091426] font-semibold">{scheduleVisitLead.propertyInterest}</p>
                </div>
              </div>
              <button
                onClick={() => setScheduleVisitLead(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmVisit} className="mt-4 space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Fecha y Hora
                </label>
                <input
                  type="text"
                  required
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  placeholder="Ej: Mañana a las 18:00 hs"
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#E6E8EA] rounded-xl text-xs text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-[#091426]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Martillero Asignado / Nota
                </label>
                <input
                  type="text"
                  value={visitNotes}
                  onChange={(e) => setVisitNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#E6E8EA] rounded-xl text-xs text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-[#091426]"
                />
              </div>

              <div className="pt-3 border-t border-[#E6E8EA] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setScheduleVisitLead(null)}
                  className="px-3 py-2 text-xs font-semibold text-slate-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#091426] hover:bg-[#1E293B] text-white font-bold text-xs rounded-xl shadow-sm active:scale-[0.98]"
                >
                  Confirmar Visita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. LEAD DETAIL DRAWER / FICHA RÁPIDA */}
      {selectedLeadForDetail && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#091426]/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md h-full shadow-2xl border-l border-[#E6E8EA] p-6 flex flex-col justify-between overflow-y-auto animate-slideLeft">
            <div>
              <div className="flex justify-between items-start pb-4 border-b border-[#E6E8EA]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F2F4F6] text-[#091426] border border-[#E6E8EA]">
                    {selectedLeadForDetail.channel}
                  </span>
                  <h2 className="text-lg font-bold text-[#191C1E] mt-1">
                    {selectedLeadForDetail.name}
                  </h2>
                  <p className="text-xs text-slate-500 font-mono">{selectedLeadForDetail.phone}</p>
                </div>
                <button
                  onClick={() => setSelectedLeadForDetail(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-sm p-1"
                >
                  ✕
                </button>
              </div>

              {/* Status Stepper */}
              <div className="mt-4 p-3 bg-[#F7F9FB] rounded-xl border border-[#E6E8EA]">
                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-2">Estado del Prospecto:</span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => handleMoveLead(selectedLeadForDetail.id, 'new')}
                    className={`py-1.5 text-xs font-bold rounded-lg ${selectedLeadForDetail.status === 'new' ? 'bg-[#091426] text-white' : 'bg-white text-slate-700 border border-[#E6E8EA]'}`}
                  >
                    1. Nuevo
                  </button>
                  <button
                    onClick={() => handleMoveLead(selectedLeadForDetail.id, 'contacted')}
                    className={`py-1.5 text-xs font-bold rounded-lg ${selectedLeadForDetail.status === 'contacted' ? 'bg-amber-500 text-white' : 'bg-white text-slate-700 border border-[#E6E8EA]'}`}
                  >
                    2. En Charla
                  </button>
                  <button
                    onClick={() => handleMoveLead(selectedLeadForDetail.id, 'visit_scheduled')}
                    className={`py-1.5 text-xs font-bold rounded-lg ${selectedLeadForDetail.status === 'visit_scheduled' ? 'bg-[#006C49] text-white' : 'bg-white text-slate-700 border border-[#E6E8EA]'}`}
                  >
                    3. Visita
                  </button>
                </div>
              </div>

              {/* Property Details */}
              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-slate-400">Propiedad de Interés:</span>
                  <p className="font-bold text-[#191C1E] mt-0.5">{selectedLeadForDetail.propertyInterest}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-400">Ubicación / Dirección:</span>
                  <p className="text-slate-700 mt-0.5">{selectedLeadForDetail.propertyAddress}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-400">Presupuesto Estimado:</span>
                  <p className="text-slate-700 mt-0.5">{selectedLeadForDetail.budget}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-400">Notas / Requisitos:</span>
                  <p className="text-slate-700 mt-0.5 bg-[#F7F9FB] p-2.5 rounded-xl border border-[#E6E8EA]">
                    {selectedLeadForDetail.notes}
                  </p>
                </div>

                {/* AI Score */}
                {selectedLeadForDetail.aiScore && (
                  <div className="p-3 bg-white rounded-xl border border-[#E6E8EA] shadow-2xs">
                    <div className="flex items-center gap-1.5 font-bold mb-1 text-[#006C49]">
                      <Sparkles className="w-4 h-4" />
                      <span>Análisis IA de Calificación: {selectedLeadForDetail.aiScore.score}/100</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      {selectedLeadForDetail.aiScore.reason}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E6E8EA] flex gap-2">
              <button
                onClick={() => {
                  setSelectedLeadForDetail(null);
                  handleOpenWhatsAppModal(selectedLeadForDetail);
                }}
                className="flex-1 py-2.5 bg-[#006C49] hover:bg-[#007D55] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
              >
                <Phone className="w-4 h-4" /> WhatsApp
              </button>
              <button
                onClick={() => setSelectedLeadForDetail(null)}
                className="px-4 py-2.5 bg-[#F2F4F6] text-slate-700 hover:bg-[#E6E8EA] font-semibold text-xs rounded-xl"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. FAST LEAD CAPTURE MODAL (15 SECONDS) */}
      {isNewLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091426]/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-xl p-6 border border-[#E6E8EA] shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#E6E8EA]">
              <h3 className="text-sm font-bold text-[#191C1E] flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Carga Rápida de Prospecto (15 seg)
              </h3>
              <button 
                onClick={() => setIsNewLeadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Mode Switcher inside modal: Simple Form vs Paste from WhatsApp */}
            <div className="flex gap-2 my-3 p-1 bg-[#F2F4F6] rounded-xl border border-[#E6E8EA]">
              <button
                type="button"
                onClick={() => setNewLeadMode('simple')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  newLeadMode === 'simple' ? 'bg-white text-[#091426] shadow-xs' : 'text-slate-500'
                }`}
              >
                Formulario 3 Campos
              </button>
              <button
                type="button"
                onClick={() => setNewLeadMode('paste')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  newLeadMode === 'paste' ? 'bg-white text-[#006C49] shadow-xs' : 'text-slate-500'
                }`}
              >
                📋 Pegar de WhatsApp
              </button>
            </div>

            {newLeadMode === 'paste' ? (
              <div className="space-y-3">
                <label className="block text-xs text-slate-600">
                  Pegá el texto recibido en WhatsApp (ej: <em>"Hola soy Mariano 2364551122 consulto por el depto de calle Arias"</em>):
                </label>
                <textarea
                  rows={4}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Pegar mensaje aquí..."
                  className="w-full p-3 bg-[#F7F9FB] border border-[#E6E8EA] rounded-xl text-xs text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-[#006C49]"
                />
                <button
                  type="button"
                  onClick={handleParsePastedText}
                  className="w-full py-2.5 bg-[#006C49] hover:bg-[#007D55] text-white font-bold text-xs rounded-xl shadow-sm active:scale-[0.98]"
                >
                  ⚡ Autocompletar y Revisar
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddLead} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Nombre del Cliente *
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ej: Marcelo Gómez"
                    className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#E6E8EA] rounded-xl text-xs text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-[#091426]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      WhatsApp / Tel *
                    </label>
                    <input
                      type="tel"
                      required
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#E6E8EA] rounded-xl text-xs text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-[#091426]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Canal
                    </label>
                    <select
                      value={newChannel}
                      onChange={(e: any) => setNewChannel(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#E6E8EA] rounded-xl text-xs text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-[#091426]"
                    >
                      <option value="whatsapp">WhatsApp</option>
                      <option value="instagram">Instagram</option>
                      <option value="facebook">Facebook</option>
                      <option value="web">Web</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Inmueble / Qué busca *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProperty}
                    onChange={(e) => setNewProperty(e.target.value)}
                    placeholder="Ej: Depto 2 ambientes o Casa c/ cochera"
                    className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#E6E8EA] rounded-xl text-xs text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-[#091426]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewLeadModalOpen(false)}
                    className="px-3 py-2 text-xs font-semibold text-slate-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#091426] hover:bg-[#1E293B] text-white font-bold text-xs rounded-xl shadow-sm active:scale-[0.98]"
                  >
                    Guardar y Calificar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
