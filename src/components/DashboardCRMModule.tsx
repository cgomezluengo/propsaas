import React, { useState } from 'react';
import { 
  Phone, AlertTriangle, 
  Plus, Search, Filter, Download, Sparkles, CheckCircle2, Clock, 
  Check, Calendar, Share2, 
  Eye, MessageSquare, UserCheck, CalendarCheck, Archive, FileText,
  Building, MapPin, Send, ChevronRight, CheckSquare, KeyRound, User as UserIcon
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

type CRMSection = 'nuevas' | 'conversacion' | 'visitas' | 'ganados' | 'descartados';

export const DashboardCRMModule: React.FC<Props> = ({
  currentTenant,
  currentUser,
}) => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [activeSection, setActiveSection] = useState<CRMSection>('nuevas');
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [urgencyFilterOnly, setUrgencyFilterOnly] = useState<boolean>(false);
  
  // Modals and Selected States
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<Lead | null>(null);
  const [whatsappModalLead, setWhatsappModalLead] = useState<Lead | null>(null);
  const [customWhatsAppMessage, setCustomWhatsAppMessage] = useState<string>('');
  const [scheduleVisitLead, setScheduleVisitLead] = useState<Lead | null>(null);
  const [visitDate, setVisitDate] = useState('Hoy a las 16:30 hs');
  const [visitNotes, setVisitNotes] = useState('Visita con martillero asignado');
  const [selectedDayFilter, setSelectedDayFilter] = useState<'hoy' | 'manana' | 'semana' | 'todos'>('hoy');

  // New Lead Form State
  const [newLeadMode, setNewLeadMode] = useState<'simple' | 'paste'>('simple');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('+54 236 4');
  const [newProperty, setNewProperty] = useState('');
  const [newChannel, setNewChannel] = useState<'whatsapp' | 'instagram' | 'facebook' | 'web'>('whatsapp');
  const [newBudget, setNewBudget] = useState('$ 380.000');
  const [newNotes, setNewNotes] = useState('');
  const [pastedText, setPastedText] = useState('');

  // Move Lead Status
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

  // Open WhatsApp Dialog
  const handleOpenWhatsAppModal = (lead: Lead) => {
    setWhatsappModalLead(lead);
    const suggestedText = lead.aiScore?.suggestedReply || 
      `¡Hola ${lead.name.split(' ')[0]}! Te escribo de ${currentTenant.name} por tu consulta sobre "${lead.propertyInterest}". ¿Querés que coordinemos una visita o te envíe fotos y requisitos?`;
    setCustomWhatsAppMessage(suggestedText);
  };

  // Execute WhatsApp Send
  const handleSendWhatsApp = (lead: Lead) => {
    const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
    const encodedText = encodeURIComponent(customWhatsAppMessage);
    const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
    
    handleMoveLead(lead.id, 'contacted');
    setWhatsappModalLead(null);
    window.open(waUrl, '_blank');
  };

  // Confirm Visit Scheduling
  const handleConfirmVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleVisitLead) return;

    setLeads(prev => prev.map(l => {
      if (l.id === scheduleVisitLead.id) {
        return {
          ...l,
          status: 'visit_scheduled',
          hoursUnanswered: 0,
          notes: `${l.notes || ''} | 📅 Visita: ${visitDate} (${visitNotes})`
        };
      }
      return l;
    }));

    setScheduleVisitLead(null);
    setActiveSection('visitas');
  };

  // Parse Pasted Text
  const handleParsePastedText = () => {
    if (!pastedText) return;
    
    let detectedName = 'Consulta WhatsApp';
    let detectedPhone = '+54 236 4';
    let detectedProperty = 'Inmueble Consultada';

    const phoneMatch = pastedText.match(/(\+?\d[\d\s-]{8,})/);
    if (phoneMatch) detectedPhone = phoneMatch[0].trim();

    const nameMatch = pastedText.match(/(?:soy|nombre es|me llamo|de parte de)\s+([A-ZÁÉÍÓÚa-záéíóú\s]{2,20})/i);
    if (nameMatch) {
      detectedName = nameMatch[1].trim();
    } else {
      const firstWords = pastedText.split(' ').slice(0, 2).join(' ');
      if (firstWords.length > 3) detectedName = firstWords;
    }

    if (pastedText.toLowerCase().includes('depto') || pastedText.toLowerCase().includes('departamento')) {
      detectedProperty = 'Departamento 2 Ambientes';
    } else if (pastedText.toLowerCase().includes('casa')) {
      detectedProperty = 'Casa Familiar';
    } else if (pastedText.toLowerCase().includes('local') || pastedText.toLowerCase().includes('oficina')) {
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
      propertyAddress: 'Zona Centro',
      status: 'new',
      leadType: 'alquiler',
      budget: newBudget,
      timeframe: 'Inmediato',
      createdAt: 'Recién cargado',
      hoursUnanswered: 0,
      notes: newNotes || 'Consulta cargada mediante flujo rápido.',
      aiScore: {
        score: 92,
        category: 'alta_intencion',
        reason: 'Lead calificado con alta intención de visita.',
        suggestedReply: `¡Hola ${newName.split(' ')[0]}! Gracias por consultar por ${newProperty}. ¿Querés que coordinemos una visita esta semana?`,
        guaranteeStatus: 'Garantía disponible',
        verifiedIncome: true
      }
    };

    setLeads([newLeadItem, ...leads]);
    setIsNewLeadModalOpen(false);
    setNewName('');
    setNewProperty('');
    setNewNotes('');
    setPastedText('');
    setActiveSection('nuevas');
  };

  // Counts by status
  const leadsNew = leads.filter(l => l.status === 'new');
  const leadsContacted = leads.filter(l => l.status === 'contacted');
  const leadsVisit = leads.filter(l => l.status === 'visit_scheduled');
  const leadsWon = leads.filter(l => l.status === 'converted');
  const leadsLost = leads.filter(l => l.status === 'lost');

  const urgent24Count = leadsNew.filter(l => l.hoursUnanswered >= 24).length;
  const urgent48Count = leadsNew.filter(l => l.hoursUnanswered >= 48).length;

  // Filter current active section
  const getCurrentList = () => {
    let current: Lead[] = [];
    if (activeSection === 'nuevas') current = leadsNew;
    else if (activeSection === 'conversacion') current = leadsContacted;
    else if (activeSection === 'visitas') current = leadsVisit;
    else if (activeSection === 'ganados') current = leadsWon;
    else if (activeSection === 'descartados') current = leadsLost;

    return current.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            lead.propertyInterest.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            lead.phone.includes(searchTerm);
      const matchesChannel = channelFilter === 'all' || lead.channel === channelFilter;
      const matchesUrgency = !urgencyFilterOnly || (lead.status === 'new' && lead.hoursUnanswered >= 24);
      return matchesSearch && matchesChannel && matchesUrgency;
    });
  };

  const currentList = getCurrentList();

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-fadeIn text-[#191C1E] min-h-[750px]">
      
      {/* ========================================================================= */}
      {/* 1. LEFT FIXED SIDEBAR: ACCESOS Y MENÚS SEPARADOS POR ESTADO */}
      {/* ========================================================================= */}
      <aside className="w-full lg:w-72 bg-white rounded-xl border border-[#E6E8EA] p-4 flex flex-col justify-between shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] shrink-0">
        <div className="space-y-6">
          
          {/* Tenant Agency Brand Info */}
          <div className="p-3 bg-[#F7F9FB] rounded-xl border border-[#E6E8EA]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#091426] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {currentTenant.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <h2 className="text-xs font-bold text-[#191C1E] truncate">{currentTenant.name}</h2>
                <p className="text-[10px] text-[#006C49] font-semibold">{currentTenant.city}, {currentTenant.province}</p>
              </div>
            </div>
          </div>

          {/* SECTION: BANDEJA CRM (ESTADOS EN MENÚS SEPARADOS) */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 flex items-center justify-between">
              <span>Bandeja CRM & Prospectos</span>
              <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono font-bold">
                {leads.length}
              </span>
            </div>

            <nav className="space-y-1">
              {/* 1. Nuevas Consultas */}
              <button
                onClick={() => { setActiveSection('nuevas'); setUrgencyFilterOnly(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                  activeSection === 'nuevas'
                    ? 'bg-[#091426] text-white shadow-sm font-bold'
                    : 'text-slate-700 hover:bg-[#F2F4F6] hover:text-[#091426]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className={`w-4 h-4 ${activeSection === 'nuevas' ? 'text-white' : 'text-[#091426]'}`} />
                  <span>1. Nuevas Consultas</span>
                </div>
                {urgent24Count > 0 ? (
                  <span className="text-[10px] font-bold bg-[#BA1A1A] text-white px-2 py-0.5 rounded-full animate-pulse shadow-xs">
                    {urgent24Count} urgentes
                  </span>
                ) : (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeSection === 'nuevas' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {leadsNew.length}
                  </span>
                )}
              </button>

              {/* 2. En Conversación */}
              <button
                onClick={() => setActiveSection('conversacion')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                  activeSection === 'conversacion'
                    ? 'bg-[#091426] text-white shadow-sm font-bold'
                    : 'text-slate-700 hover:bg-[#F2F4F6] hover:text-[#091426]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className={`w-4 h-4 ${activeSection === 'conversacion' ? 'text-white' : 'text-amber-600'}`} />
                  <span>2. En Conversación</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeSection === 'conversacion' ? 'bg-[#006C49] text-white' : 'bg-amber-100 text-amber-800'
                }`}>
                  {leadsContacted.length} activos
                </span>
              </button>

              {/* 3. Visitas Agendadas */}
              <button
                onClick={() => setActiveSection('visitas')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                  activeSection === 'visitas'
                    ? 'bg-[#091426] text-white shadow-sm font-bold'
                    : 'text-slate-700 hover:bg-[#F2F4F6] hover:text-[#091426]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CalendarCheck className={`w-4 h-4 ${activeSection === 'visitas' ? 'text-white' : 'text-[#006C49]'}`} />
                  <span>3. Visitas Agendadas</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeSection === 'visitas' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-[#006C49]'
                }`}>
                  {leadsVisit.length} citas
                </span>
              </button>

              {/* 4. Clientes Ganados / Cerrados */}
              <button
                onClick={() => setActiveSection('ganados')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                  activeSection === 'ganados'
                    ? 'bg-[#091426] text-white shadow-sm font-bold'
                    : 'text-slate-700 hover:bg-[#F2F4F6] hover:text-[#091426]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className={`w-4 h-4 ${activeSection === 'ganados' ? 'text-white' : 'text-[#006C49]'}`} />
                  <span>4. Clientes Ganados</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeSection === 'ganados' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {leadsWon.length}
                </span>
              </button>

              {/* 5. Descartados */}
              <button
                onClick={() => setActiveSection('descartados')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                  activeSection === 'descartados'
                    ? 'bg-[#091426] text-white shadow-sm font-bold'
                    : 'text-slate-700 hover:bg-[#F2F4F6] hover:text-[#091426]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Archive className={`w-4 h-4 ${activeSection === 'descartados' ? 'text-white' : 'text-slate-400'}`} />
                  <span>5. Descartados / Archivo</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeSection === 'descartados' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {leadsLost.length}
                </span>
              </button>
            </nav>
          </div>

          {/* Quick Actions in Sidebar */}
          <div className="pt-3 border-t border-[#E6E8EA] space-y-2">
            <button
              onClick={() => setIsNewLeadModalOpen(true)}
              className="w-full py-2.5 px-3 bg-[#091426] hover:bg-[#1E293B] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" /> + Cargar Consulta
            </button>

            <button
              onClick={() => exportLeadsToCSV(leads)}
              className="w-full py-2 px-3 bg-white hover:bg-[#F2F4F6] text-slate-700 font-semibold text-xs rounded-xl border border-[#CBD5E1] flex items-center justify-center gap-1.5 transition-all shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" /> Exportar a Excel
            </button>
          </div>

        </div>

        {/* Bottom Profile Pill */}
        <div className="pt-4 border-t border-[#E6E8EA] mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#091426] text-white flex items-center justify-center text-xs font-bold">
              {currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#191C1E] truncate">{currentUser.name}</p>
              <span className="text-[10px] text-slate-400 capitalize">{currentUser.role}</span>
            </div>
          </div>
          <span className="text-[9px] bg-emerald-50 text-[#006C49] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
            Online
          </span>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT AREA: VISTA DIRECTA ORIENTADA A LA ACCIÓN (NO KANBAN) */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col space-y-5">
        
        {/* Top Header Card */}
        <div className="bg-white p-5 rounded-xl border border-[#E6E8EA] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-[#191C1E]">
                  {activeSection === 'nuevas' && 'Bandeja de Entrada: Nuevas Consultas'}
                  {activeSection === 'conversacion' && 'Prospectos en Conversación Activa'}
                  {activeSection === 'visitas' && 'Agenda de Visitas Inmobiliarias'}
                  {activeSection === 'ganados' && 'Operaciones y Clientes Ganados'}
                  {activeSection === 'descartados' && 'Histórico de Consultas Archivadas'}
                </h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#F2F4F6] text-[#091426] border border-[#E6E8EA]">
                  {currentList.length} items
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {activeSection === 'nuevas' && 'Consultas recientes ordenadas por tiempo de espera. Respondé con 1 clic para no perder prospectos.'}
                {activeSection === 'conversacion' && 'Personas ya contactadas. Coordiná la visita o solicitá los requisitos de garantía.'}
                {activeSection === 'visitas' && 'Visitas programadas con martillero. Enviá la ubicación exacta o avanzá a la reserva.'}
                {activeSection === 'ganados' && 'Leads que concretaron contrato o compra satisfactoriamente.'}
                {activeSection === 'descartados' && 'Consultas archivadas o sin interés.'}
              </p>
            </div>

            {/* Quick KPIs */}
            {activeSection === 'nuevas' && (
              <div className="flex items-center gap-2">
                <div className="px-3 py-2 bg-[#FFDAD6]/40 border border-[#FFDAD6] rounded-xl text-center">
                  <p className="text-[10px] font-bold uppercase text-[#BA1A1A]">Demora &gt;24h</p>
                  <p className="text-base font-bold font-mono text-[#BA1A1A]">{urgent24Count}</p>
                </div>
                <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                  <p className="text-[10px] font-bold uppercase text-[#006C49]">Atención SLA</p>
                  <p className="text-base font-bold font-mono text-[#006C49]">96%</p>
                </div>
              </div>
            )}

            {activeSection === 'visitas' && (
              <div className="flex items-center gap-1.5 bg-[#F2F4F6] p-1 rounded-xl border border-[#E6E8EA]">
                {(['hoy', 'manana', 'semana', 'todos'] as const).map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDayFilter(d)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                      selectedDayFilter === d ? 'bg-[#091426] text-white shadow-xs' : 'text-slate-600 hover:text-[#091426]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search and Filters Toolbar */}
          <div className="mt-4 pt-4 border-t border-[#E6E8EA] flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por cliente, propiedad o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#F7F9FB] border border-[#E6E8EA] rounded-lg text-xs text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-[#091426]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-slate-400" /> Canal:
              </span>
              {['all', 'whatsapp', 'instagram', 'facebook', 'web'].map((chn) => (
                <button
                  key={chn}
                  onClick={() => setChannelFilter(chn)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all capitalize whitespace-nowrap ${
                    channelFilter === chn
                      ? 'bg-[#091426] text-white shadow-xs font-bold'
                      : 'bg-[#F2F4F6] text-slate-600 hover:bg-[#E6E8EA]'
                  }`}
                >
                  {chn === 'all' ? 'Todos' : chn}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Direct Action Cards List */}
        <div className="space-y-3 flex-1">
          {currentList.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-[#CBD5E1] p-12 text-center">
              <CheckCircle2 className="w-10 h-10 text-[#006C49] mx-auto mb-2" />
              <h3 className="font-bold text-sm text-[#191C1E]">No hay elementos en esta sección</h3>
              <p className="text-xs text-slate-500 mt-1">Estás al día con tus prospectos en este estado.</p>
            </div>
          ) : (
            currentList.map((lead) => (
              <div
                key={lead.id}
                className={`bg-white rounded-xl border transition-all p-4 shadow-[0_2px_4px_-1px_rgba(0,0,0,0.03)] hover:border-[#091426]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  activeSection === 'nuevas' && lead.hoursUnanswered >= 48
                    ? 'border-[#FFDAD6] bg-red-50/20'
                    : 'border-[#E6E8EA]'
                }`}
              >
                {/* Left: Lead Context & Details */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#F2F4F6] text-[#091426] border border-[#E6E8EA]">
                      {lead.channel}
                    </span>
                    
                    <h3 className="font-bold text-sm text-[#191C1E] truncate">
                      {lead.name}
                    </h3>
                    
                    <span className="text-xs font-mono text-slate-500">
                      • {lead.phone}
                    </span>

                    {activeSection === 'nuevas' && lead.hoursUnanswered >= 24 && (
                      <span className="text-[10px] font-bold text-[#BA1A1A] bg-[#FFDAD6]/60 px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#FFDAD6]">
                        <Clock className="w-3 h-3" /> {lead.hoursUnanswered}h sin responder
                      </span>
                    )}

                    {lead.aiScore && (
                      <span className="text-[10px] font-bold text-[#006C49] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> IA Intent: {lead.aiScore.score}%
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <span className="font-semibold text-[#091426]">Interés:</span> {lead.propertyInterest}
                    <span className="text-slate-400">|</span>
                    <span className="font-semibold text-slate-500">Presupuesto:</span> <span className="font-mono">{lead.budget}</span>
                  </div>

                  {lead.notes && (
                    <p className="text-xs text-slate-600 bg-[#F7F9FB] p-2 rounded-lg border border-[#E6E8EA] line-clamp-2">
                      "{lead.notes}"
                    </p>
                  )}
                </div>

                {/* Right: Direct 1-Click Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-[#E6E8EA]">
                  
                  {/* Common button: View Lead Sheet */}
                  <button
                    onClick={() => setSelectedLeadForDetail(lead)}
                    className="px-2.5 py-1.5 bg-[#F2F4F6] hover:bg-[#E6E8EA] text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all"
                    title="Ver ficha completa y notas"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" /> Ficha
                  </button>

                  {/* Contextual Action: NUEVAS CONSULTAS */}
                  {activeSection === 'nuevas' && (
                    <>
                      <button
                        onClick={() => handleMoveLead(lead.id, 'lost')}
                        className="px-2.5 py-1.5 text-slate-400 hover:text-[#BA1A1A] text-xs font-medium"
                      >
                        ✕ Descartar
                      </button>
                      <button
                        onClick={() => handleOpenWhatsAppModal(lead)}
                        className="px-3.5 py-1.5 bg-[#006C49] hover:bg-[#007D55] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-all"
                      >
                        <Phone className="w-3.5 h-3.5" /> Responder WhatsApp
                      </button>
                    </>
                  )}

                  {/* Contextual Action: EN CONVERSACIÓN */}
                  {activeSection === 'conversacion' && (
                    <>
                      <button
                        onClick={() => handleOpenWhatsAppModal(lead)}
                        className="px-3 py-1.5 bg-white hover:bg-[#F2F4F6] text-[#006C49] text-xs font-bold rounded-xl border border-emerald-300 flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" /> Chat
                      </button>
                      <button
                        onClick={() => setScheduleVisitLead(lead)}
                        className="px-3.5 py-1.5 bg-[#091426] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-all"
                      >
                        <Calendar className="w-3.5 h-3.5" /> Agendar Visita
                      </button>
                    </>
                  )}

                  {/* Contextual Action: VISITAS AGENDADAS */}
                  {activeSection === 'visitas' && (
                    <>
                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hola! Te comparto la ubicación exacta para nuestra visita de hoy: ' + lead.propertyAddress)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-white hover:bg-[#F2F4F6] text-[#006C49] text-xs font-bold rounded-xl border border-emerald-300 flex items-center gap-1"
                      >
                        <Share2 className="w-3.5 h-3.5" /> Mandar GPS
                      </a>
                      <button
                        onClick={() => {
                          handleMoveLead(lead.id, 'converted');
                          alert(`¡Excelente! ${lead.name} reservó la propiedad. Ya podés confeccionar el contrato.`);
                        }}
                        className="px-3.5 py-1.5 bg-[#006C49] hover:bg-[#007D55] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-all"
                      >
                        <Check className="w-3.5 h-3.5" /> Concretar Reserva
                      </button>
                    </>
                  )}

                  {/* Contextual Action: GANADOS */}
                  {activeSection === 'ganados' && (
                    <span className="text-xs font-bold text-[#006C49] bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                      ✓ Operación Concretada
                    </span>
                  )}

                  {/* Contextual Action: DESCARTADOS */}
                  {activeSection === 'descartados' && (
                    <button
                      onClick={() => handleMoveLead(lead.id, 'new')}
                      className="text-xs font-semibold text-[#091426] hover:underline"
                    >
                      ↺ Recuperar Consulta
                    </button>
                  )}

                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. MODALS: WHATSAPP SMART AI SENDER */}
      {/* ========================================================================= */}
      {whatsappModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091426]/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 border border-[#E6E8EA] shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#E6E8EA]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#006C49] flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#191C1E]">
                    Enviar WhatsApp a {whatsappModalLead.name}
                  </h3>
                  <p className="text-xs font-mono text-slate-500">{whatsappModalLead.phone}</p>
                </div>
              </div>
              <button 
                onClick={() => setWhatsappModalLead(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#006C49]" /> Plantilla de Respuesta Asistida por IA:
              </label>
              <textarea
                rows={4}
                value={customWhatsAppMessage}
                onChange={(e) => setCustomWhatsAppMessage(e.target.value)}
                className="w-full p-3 bg-[#F7F9FB] border border-[#E6E8EA] rounded-xl text-xs text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-[#006C49]"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setWhatsappModalLead(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-500"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleSendWhatsApp(whatsappModalLead)}
                className="px-4 py-2 bg-[#006C49] hover:bg-[#007D55] text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm active:scale-[0.98]"
              >
                <Send className="w-3.5 h-3.5" /> Abrir WhatsApp Web
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODALS: AGENDAR VISITA */}
      {/* ========================================================================= */}
      {scheduleVisitLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091426]/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-xl p-6 border border-[#E6E8EA] shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#E6E8EA]">
              <h3 className="text-sm font-bold text-[#191C1E] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#091426]" /> Agendar Visita con Martillero
              </h3>
              <button onClick={() => setScheduleVisitLead(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleConfirmVisit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Cliente</label>
                <input
                  type="text"
                  disabled
                  value={`${scheduleVisitLead.name} (${scheduleVisitLead.propertyInterest})`}
                  className="w-full px-3 py-2 bg-[#F2F4F6] border border-[#E6E8EA] rounded-xl text-xs text-slate-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Día y Hora de la Visita *</label>
                <input
                  type="text"
                  required
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  placeholder="Ej: Mañana 17:30 hs o Sábado 10:00 hs"
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#E6E8EA] rounded-xl text-xs text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-[#091426]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Martillero / Notas</label>
                <input
                  type="text"
                  value={visitNotes}
                  onChange={(e) => setVisitNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#E6E8EA] rounded-xl text-xs text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-[#091426]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
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

      {/* ========================================================================= */}
      {/* 5. MODALS: FICHA DE LEAD / DETALLE */}
      {/* ========================================================================= */}
      {selectedLeadForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091426]/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 border border-[#E6E8EA] shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#E6E8EA]">
              <div>
                <h3 className="text-base font-bold text-[#191C1E]">{selectedLeadForDetail.name}</h3>
                <p className="text-xs text-slate-500">{selectedLeadForDetail.email} • {selectedLeadForDetail.phone}</p>
              </div>
              <button onClick={() => setSelectedLeadForDetail(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-[#F7F9FB] rounded-xl border border-[#E6E8EA]">
                <span className="font-bold text-[#091426]">Inmueble:</span> {selectedLeadForDetail.propertyInterest}
                <br />
                <span className="font-bold text-[#091426]">Presupuesto:</span> {selectedLeadForDetail.budget}
              </div>

              <div className="p-3 bg-[#F7F9FB] rounded-xl border border-[#E6E8EA]">
                <span className="font-bold text-[#091426]">Notas y Diálogo:</span>
                <p className="mt-1 text-slate-700">{selectedLeadForDetail.notes || 'Sin notas adicionales.'}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E6E8EA] flex justify-end gap-2">
              <button
                onClick={() => setSelectedLeadForDetail(null)}
                className="px-4 py-2 bg-[#F2F4F6] text-slate-700 text-xs font-semibold rounded-xl"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODALS: CARGA RÁPIDA DE CONSULTA */}
      {/* ========================================================================= */}
      {isNewLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091426]/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-xl p-6 border border-[#E6E8EA] shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#E6E8EA]">
              <h3 className="text-sm font-bold text-[#191C1E] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#091426]" /> Cargar Nueva Consulta
              </h3>
              <button onClick={() => setIsNewLeadModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="flex gap-2 p-1 bg-[#F2F4F6] rounded-xl border border-[#E6E8EA]">
              <button
                type="button"
                onClick={() => setNewLeadMode('simple')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  newLeadMode === 'simple' ? 'bg-white text-[#091426] shadow-xs' : 'text-slate-500'
                }`}
              >
                Formulario Manual
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
                  Pegá el texto recibido:
                </label>
                <textarea
                  rows={4}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Ej: 'Hola soy Lautaro 2364123123 consulto por el depto de 2 amb...'"
                  className="w-full p-3 bg-[#F7F9FB] border border-[#E6E8EA] rounded-xl text-xs text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-[#006C49]"
                />
                <button
                  type="button"
                  onClick={handleParsePastedText}
                  className="w-full py-2 bg-[#006C49] hover:bg-[#007D55] text-white font-bold text-xs rounded-xl shadow-sm active:scale-[0.98]"
                >
                  ⚡ Autocompletar Formulario
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddLead} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ej: Romina Varela"
                    className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#E6E8EA] rounded-xl text-xs text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-[#091426]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Teléfono / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#E6E8EA] rounded-xl text-xs text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-[#091426]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Canal</label>
                    <select
                      value={newChannel}
                      onChange={(e: any) => setNewChannel(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#E6E8EA] rounded-xl text-xs text-[#191C1E]"
                    >
                      <option value="whatsapp">WhatsApp</option>
                      <option value="instagram">Instagram</option>
                      <option value="facebook">Facebook</option>
                      <option value="web">Web</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Propiedad Consultada *</label>
                  <input
                    type="text"
                    required
                    value={newProperty}
                    onChange={(e) => setNewProperty(e.target.value)}
                    placeholder="Ej: Depto 2 Ambientes Belgrano"
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
                    Guardar Consulta
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
