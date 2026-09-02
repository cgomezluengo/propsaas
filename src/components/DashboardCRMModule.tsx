import React, { useState } from 'react';
import { 
  Phone, AlertTriangle, 
  Plus, Search, Filter, Download, Sparkles, CheckCircle2, Clock, 
  Check, Calendar, Share2, 
  Eye, MessageSquare, UserCheck, CalendarCheck, Archive, FileText,
  Building, MapPin, Send, ChevronRight, CheckSquare, KeyRound, User as UserIcon,
  Timer, TrendingUp, Bed, Bath, Home, ArrowRight, UserPlus, FileCheck, Layers, Lock, ShieldCheck, Mail
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
  
  // Selected Lead for Context Drawer (Desktop split view exactly like Stitch)
  const [selectedLead, setSelectedLead] = useState<Lead>(mockLeads[0]);
  
  // Modals
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
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

    if (selectedLead.id === leadId) {
      setSelectedLead(prev => ({ ...prev, status: newStatus, hoursUnanswered: 0 }));
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
    let detectedProperty = 'Inmueble Consultado';

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
      detectedProperty = 'Departamento 2 Ambientes Belgrano';
    } else if (pastedText.toLowerCase().includes('casa')) {
      detectedProperty = 'Casa Familiar con Cochera';
    } else if (pastedText.toLowerCase().includes('local') || pastedText.toLowerCase().includes('oficina')) {
      detectedProperty = 'Local Comercial Centro';
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
      createdAt: 'Hace 5 min',
      hoursUnanswered: 0,
      notes: newNotes || 'Consulta cargada mediante flujo rápido.',
      aiScore: {
        score: 94,
        category: 'alta_intencion',
        reason: 'Lead calificado con alta intención de visita.',
        suggestedReply: `¡Hola ${newName.split(' ')[0]}! Gracias por consultar por ${newProperty}. ¿Querés que coordinemos una visita esta semana?`,
        guaranteeStatus: 'Garantía en verificación',
        verifiedIncome: true
      }
    };

    setLeads([newLeadItem, ...leads]);
    setSelectedLead(newLeadItem);
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
    <div className="flex flex-col lg:flex-row gap-6 text-[#191C1E] animate-fadeIn -mx-4 sm:-mx-6 lg:-mx-8 -my-6 sm:-my-8 min-h-[calc(100vh-4rem)]">
      
      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR: EXACT STITCH THEME (#091426 NAVY DARK CONTAINER)       */}
      {/* ========================================================================= */}
      <aside className="w-full lg:w-[280px] bg-[#091426] text-white p-4 flex flex-col justify-between shrink-0 shadow-lg z-20">
        <div className="space-y-6">
          
          {/* Brand Header */}
          <div className="px-2 py-2 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#006C49] text-white flex items-center justify-center font-bold text-base shadow-sm">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight leading-tight">PropSaaS</h1>
              <p className="text-[11px] text-[#8590A6] font-medium">Estate Logic CRM</p>
            </div>
          </div>

          {/* Tenant Switcher Button */}
          <div className="px-1">
            <div className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-left">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-6 h-6 rounded bg-white text-[#091426] flex items-center justify-center font-black text-xs shrink-0">
                  {currentTenant.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{currentTenant.name}</p>
                  <p className="text-[10px] text-[#006C49] font-medium truncate">{currentTenant.city}</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA: Nueva Propiedad / Cargar Consulta */}
          <div className="px-1">
            <button
              onClick={() => setIsNewLeadModalOpen(true)}
              className="w-full bg-[#006C49] hover:bg-[#007D55] text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" /> + Cargar Consulta
            </button>
          </div>

          {/* Nav Items Grouped by Sections */}
          <div className="space-y-5 px-1 overflow-y-auto">
            
            {/* Group: BANDEJA CRM (ESTADOS EN MENÚS SEPARADOS) */}
            <div>
              <p className="px-2 mb-2 text-[10px] font-bold text-[#8590A6] uppercase tracking-wider">
                Bandeja CRM
              </p>
              
              <div className="space-y-1">
                {/* 1. Nuevas Consultas */}
                <button
                  onClick={() => { setActiveSection('nuevas'); setUrgencyFilterOnly(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-left ${
                    activeSection === 'nuevas'
                      ? 'bg-white/15 text-[#6FFBBE] font-bold border-r-4 border-[#6FFBBE]'
                      : 'text-[#D8E3FB] opacity-80 hover:bg-white/10 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4" />
                    <span>1. Nuevas Consultas</span>
                  </div>
                  {urgent24Count > 0 ? (
                    <span className="bg-[#BA1A1A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                      {urgent24Count} urg. &gt;24h
                    </span>
                  ) : (
                    <span className="bg-white/10 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {leadsNew.length}
                    </span>
                  )}
                </button>

                {/* 2. En Conversación */}
                <button
                  onClick={() => setActiveSection('conversacion')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-left ${
                    activeSection === 'conversacion'
                      ? 'bg-white/15 text-[#6FFBBE] font-bold border-r-4 border-[#6FFBBE]'
                      : 'text-[#D8E3FB] opacity-80 hover:bg-white/10 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <UserCheck className="w-4 h-4" />
                    <span>2. En Conversación</span>
                  </div>
                  <span className="bg-[#006C49] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {leadsContacted.length} activos
                  </span>
                </button>

                {/* 3. Visitas Agendadas */}
                <button
                  onClick={() => setActiveSection('visitas')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-left ${
                    activeSection === 'visitas'
                      ? 'bg-white/15 text-[#6FFBBE] font-bold border-r-4 border-[#6FFBBE]'
                      : 'text-[#D8E3FB] opacity-80 hover:bg-white/10 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CalendarCheck className="w-4 h-4" />
                    <span>3. Visitas Agendadas</span>
                  </div>
                  <span className="bg-white/10 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {leadsVisit.length} citas
                  </span>
                </button>

                {/* 4. Clientes Ganados */}
                <button
                  onClick={() => setActiveSection('ganados')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-left ${
                    activeSection === 'ganados'
                      ? 'bg-white/15 text-[#6FFBBE] font-bold border-r-4 border-[#6FFBBE]'
                      : 'text-[#D8E3FB] opacity-80 hover:bg-white/10 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>4. Clientes Ganados</span>
                  </div>
                  <span className="bg-white/10 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {leadsWon.length}
                  </span>
                </button>

                {/* 5. Descartados */}
                <button
                  onClick={() => setActiveSection('descartados')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-left ${
                    activeSection === 'descartados'
                      ? 'bg-white/15 text-[#6FFBBE] font-bold border-r-4 border-[#6FFBBE]'
                      : 'text-[#D8E3FB] opacity-80 hover:bg-white/10 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Archive className="w-4 h-4" />
                    <span>5. Descartados</span>
                  </div>
                  <span className="bg-white/10 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {leadsLost.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Group: GESTIÓN */}
            <div>
              <p className="px-2 mb-2 text-[10px] font-bold text-[#8590A6] uppercase tracking-wider">
                Gestión
              </p>
              <div className="space-y-1 text-xs text-[#D8E3FB] opacity-80">
                <button onClick={() => exportLeadsToCSV(leads)} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 hover:text-white transition-all text-left">
                  <Download className="w-4 h-4 text-slate-400" />
                  <span>Exportar Reporte CSV</span>
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Profile Pill at bottom */}
        <div className="pt-4 border-t border-white/10 px-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center font-bold text-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-[#8590A6] capitalize">{currentUser.role} • Plan Agencia</p>
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-[#006C49] ring-2 ring-emerald-900 animate-pulse"></span>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN WORKSPACE CANVAS (SPLIT VIEW: LIST + CONTEXT DRAWER LIKE STITCH) */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col bg-[#F7F9FB] overflow-hidden">
        
        {/* Header & Stats Bento Grid */}
        <header className="p-6 bg-white border-b border-[#E6E8EA] shrink-0 space-y-5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#091426] tracking-tight">
                {activeSection === 'nuevas' && 'Bandeja de Entrada: Nuevas Consultas Inmobiliarias'}
                {activeSection === 'conversacion' && 'Prospectos en Conversación Activa'}
                {activeSection === 'visitas' && 'Agenda de Visitas Inmobiliarias'}
                {activeSection === 'ganados' && 'Operaciones y Clientes Ganados'}
                {activeSection === 'descartados' && 'Histórico de Consultas Archivadas'}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {activeSection === 'nuevas' && 'Gestiona y responde a los leads entrantes de todos los canales (WhatsApp, Instagram, Portales).'}
                {activeSection === 'conversacion' && 'Contactos iniciados en espera de agendamiento o entrega de documentación de garantía.'}
                {activeSection === 'visitas' && 'Coordinación logística con martilleros y recorridos con prospectos.'}
                {activeSection === 'ganados' && 'Operaciones cerradas y listas para emisión de contrato.'}
                {activeSection === 'descartados' && 'Archivo histórico de prospectos no calificados.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => exportLeadsToCSV(leads)}
                className="px-3.5 py-2 bg-white hover:bg-[#F2F4F6] text-[#091426] text-xs font-semibold rounded-xl border border-[#CBD5E1] transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" /> Exportar
              </button>
              <button
                onClick={() => setIsNewLeadModalOpen(true)}
                className="px-4 py-2 bg-[#091426] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                + Cargar Lead
              </button>
            </div>
          </div>

          {/* Quick Stats Bento Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Bento 1: Urgency / Unanswered */}
            <div className="bg-white border border-[#E6E8EA] rounded-xl p-4 shadow-2xs flex items-center gap-4 border-l-4 border-l-[#BA1A1A]">
              <div className="w-12 h-12 rounded-full bg-[#FFDAD6]/60 flex items-center justify-center text-[#BA1A1A] shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Sin Responder</p>
                <p className="text-2xl font-bold font-mono text-[#091426] leading-none mt-1">
                  {urgent24Count} <span className="text-[#BA1A1A] text-xs font-bold font-sans ml-1">Urgentes (&gt;24h)</span>
                </p>
              </div>
            </div>

            {/* Bento 2: Average Time */}
            <div className="bg-white border border-[#E6E8EA] rounded-xl p-4 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#D8E3FB]/50 flex items-center justify-center text-[#091426] shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Tiempo Promedio</p>
                <p className="text-2xl font-bold font-mono text-[#091426] leading-none mt-1">
                  18 <span className="text-slate-500 text-xs font-sans">minutos</span>
                </p>
              </div>
            </div>

            {/* Bento 3: SLA Compliance */}
            <div className="bg-white border border-[#E6E8EA] rounded-xl p-4 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-[#006C49] shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">SLA de Respuesta (&lt;1h)</p>
                <p className="text-2xl font-bold font-mono text-[#006C49] leading-none mt-1">
                  94% <span className="text-[#006C49] text-xs font-sans font-bold ml-1">✓ Óptimo</span>
                </p>
              </div>
            </div>

          </div>
        </header>

        {/* Split Container: Left Inbox List + Right Context Drawer */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Left List Container */}
          <div className="w-full lg:w-[60%] flex flex-col border-r border-[#E6E8EA] bg-white">
            
            {/* Toolbar: Search and Filter */}
            <div className="p-4 border-b border-[#E6E8EA] flex flex-wrap items-center gap-3 bg-white sticky top-0 z-10">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar lead, propiedad o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#F7F9FB] border border-[#E6E8EA] rounded-xl text-xs text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-[#091426]"
                />
              </div>

              <button
                onClick={() => setChannelFilter(channelFilter === 'all' ? 'whatsapp' : 'all')}
                className="flex items-center gap-1.5 px-3 py-2 border border-[#E6E8EA] rounded-xl text-xs font-semibold hover:bg-[#F2F4F6] transition-colors"
              >
                <Filter className="w-3.5 h-3.5 text-slate-500" /> Canal: <span className="capitalize font-bold">{channelFilter}</span>
              </button>

              <button
                onClick={() => setUrgencyFilterOnly(!urgencyFilterOnly)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  urgencyFilterOnly
                    ? 'bg-[#BA1A1A] text-white border border-[#BA1A1A]'
                    : 'bg-[#FFDAD6]/30 text-[#BA1A1A] border border-[#FFDAD6] hover:bg-[#FFDAD6]/50'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Solo Urgentes ({urgent24Count})
              </button>
            </div>

            {/* Scrollable Action Cards List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F7F9FB]">
              {currentList.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-xl border border-dashed border-[#CBD5E1]">
                  <CheckCircle2 className="w-10 h-10 text-[#006C49] mx-auto mb-2" />
                  <p className="text-sm font-bold text-[#091426]">¡Bandeja al día!</p>
                  <p className="text-xs text-slate-500 mt-1">No hay elementos pendientes en esta sección.</p>
                </div>
              ) : (
                currentList.map((lead) => {
                  const isSelected = selectedLead.id === lead.id;
                  const isUrgent48 = lead.hoursUnanswered >= 48;
                  const isUrgent24 = lead.hoursUnanswered >= 24;

                  return (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`bg-white rounded-xl p-5 shadow-2xs border transition-all cursor-pointer relative overflow-hidden group ${
                        isSelected 
                          ? 'ring-2 ring-[#091426] border-transparent shadow-md' 
                          : 'border-[#E6E8EA] hover:border-slate-300'
                      }`}
                    >
                      {/* Urgency Indicator Edge */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                        isUrgent48 ? 'bg-[#BA1A1A]' : isUrgent24 ? 'bg-amber-500' : 'bg-[#006C49]'
                      }`} />

                      {/* Card Top Metadata */}
                      <div className="flex justify-between items-start mb-2 pl-2">
                        <div className="flex items-center gap-2">
                          {isUrgent48 ? (
                            <span className="bg-[#FFDAD6] text-[#BA1A1A] px-2 py-0.5 rounded font-bold text-[10px] tracking-wider flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> URGENTE &gt; 48H
                            </span>
                          ) : isUrgent24 ? (
                            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold text-[10px] tracking-wider flex items-center gap-1">
                              <Clock className="w-3 h-3" /> URGENTE &gt; 24H
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-[#006C49] px-2 py-0.5 rounded font-bold text-[10px] tracking-wider">
                              NUEVO
                            </span>
                          )}

                          <span className="text-slate-500 text-xs flex items-center gap-1 font-medium capitalize">
                            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                            {lead.channel}
                          </span>
                        </div>

                        <span className="text-slate-400 text-xs font-mono">{lead.createdAt}</span>
                      </div>

                      {/* Lead Identity & Property */}
                      <div className="pl-2">
                        <h3 className="text-base font-bold text-[#091426] group-hover:text-[#006C49] transition-colors">
                          {lead.name}
                        </h3>

                        <div className="flex items-center gap-1.5 my-1.5 text-xs text-slate-600 font-medium">
                          <Home className="w-3.5 h-3.5 text-slate-400" />
                          <span>{lead.propertyInterest}</span>
                          <span className="text-slate-300">•</span>
                          <span className="font-mono text-slate-800 font-bold">{lead.budget}</span>
                        </div>

                        {/* AI Insight Box */}
                        {lead.aiScore && (
                          <div className="bg-[#F7F9FB] rounded-xl p-3 my-3 flex items-start gap-2.5 border border-[#E6E8EA]">
                            <Sparkles className="w-4 h-4 text-[#006C49] shrink-0 mt-0.5" />
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                Análisis de IA: Alta Intención ({lead.aiScore.score}%)
                              </p>
                              <p className="text-xs text-slate-700 italic mt-0.5 line-clamp-2">
                                "{lead.notes}"
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons Row */}
                        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-[#E6E8EA]">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleOpenWhatsAppModal(lead); }}
                            className="flex-1 py-2 px-3 bg-[#091426] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98] transition-all"
                          >
                            <Phone className="w-3.5 h-3.5" /> Responder WhatsApp
                          </button>

                          <button
                            onClick={(e) => { e.stopPropagation(); setScheduleVisitLead(lead); }}
                            className="py-2 px-3 bg-white hover:bg-[#F2F4F6] text-[#091426] text-xs font-bold rounded-xl border border-[#CBD5E1] flex items-center gap-1.5 shadow-2xs transition-all"
                          >
                            <Calendar className="w-3.5 h-3.5 text-slate-500" /> Agendar
                          </button>

                          <button
                            onClick={(e) => { e.stopPropagation(); handleMoveLead(lead.id, 'lost'); }}
                            className="p-2 text-slate-400 hover:text-[#BA1A1A] hover:bg-[#FFDAD6]/30 rounded-xl transition-colors"
                            title="Descartar Consulta"
                          >
                            ✕
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Context Panel (Detail & Interactive Assistant Drawer) */}
          <div className="hidden lg:flex flex-col w-[40%] bg-white border-l border-[#E6E8EA] h-full relative">
            
            {/* Header of Context Panel */}
            <div className="p-4 border-b border-[#E6E8EA] flex justify-between items-center bg-white sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#091426] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {selectedLead.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#091426] leading-tight">{selectedLead.name}</h2>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-[#006C49] inline-block"></span>
                    En línea • {selectedLead.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenWhatsAppModal(selectedLead)}
                  className="w-8 h-8 rounded-lg hover:bg-[#F2F4F6] flex items-center justify-center text-slate-600 transition-colors"
                  title="Llamar o WhatsApp"
                >
                  <Phone className="w-4 h-4 text-[#006C49]" />
                </button>
              </div>
            </div>

            {/* Scrollable Content inside Drawer */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-white">
              
              {/* Property of Interest Thumbnail Card */}
              <div className="bg-[#F7F9FB] rounded-xl p-4 border border-[#E6E8EA]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Propiedad de Interés
                </p>
                <div className="flex gap-3.5">
                  <div className="w-20 h-20 rounded-lg bg-slate-200 border border-[#CBD5E1] flex items-center justify-center text-slate-400 shrink-0 overflow-hidden">
                    <Building className="w-8 h-8 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-[#091426] truncate">{selectedLead.propertyInterest}</h4>
                    <p className="text-xs font-bold text-[#006C49] font-mono mt-0.5">{selectedLead.budget} / mes</p>
                    
                    <div className="flex items-center gap-3 text-slate-500 text-xs mt-1.5">
                      <span className="flex items-center gap-1"><Bed className="w-3 h-3" /> 2 Dorm.</span>
                      <span className="flex items-center gap-1"><Bath className="w-3 h-3" /> 1 Baño</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logistical Checklist (Lockbox and keys) */}
              <div className="bg-white rounded-xl p-4 border border-[#E6E8EA] space-y-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Logística &amp; Llaves para la Visita
                </p>
                <div className="flex items-center justify-between text-xs bg-[#F7F9FB] p-2.5 rounded-lg border border-[#E6E8EA]">
                  <span className="flex items-center gap-2 font-medium text-slate-700">
                    <KeyRound className="w-4 h-4 text-[#006C49]" /> Código Lockbox:
                  </span>
                  <span className="font-mono font-bold text-[#091426] bg-white px-2 py-0.5 rounded border border-[#CBD5E1]">
                    #4829-B
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs bg-[#F7F9FB] p-2.5 rounded-lg border border-[#E6E8EA]">
                  <span className="flex items-center gap-2 font-medium text-slate-700">
                    <ShieldCheck className="w-4 h-4 text-[#006C49]" /> Garantía Propietaria:
                  </span>
                  <span className="font-bold text-[#006C49]">En mano / Validada</span>
                </div>
              </div>

              {/* Conversation History Snippet */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center mb-3">
                  Registro de Mensajes Recientes
                </p>
                
                <div className="flex gap-2.5 mb-3">
                  <div className="w-7 h-7 rounded-full bg-[#E6E8EA] text-slate-600 flex items-center justify-center text-xs font-bold shrink-0">
                    {selectedLead.name.charAt(0)}
                  </div>
                  <div className="bg-[#F7F9FB] rounded-2xl rounded-tl-xs p-3 max-w-[85%] border border-[#E6E8EA]">
                    <p className="text-xs text-slate-800 leading-relaxed">
                      "{selectedLead.notes}"
                    </p>
                    <p className="text-[10px] text-slate-400 text-right mt-1">{selectedLead.createdAt} • Vía {selectedLead.channel}</p>
                  </div>
                </div>
              </div>

            </div>

            {/* AI Quick Reply & Direct Sender (Bottom Fixed) */}
            <div className="p-4 border-t border-[#E6E8EA] bg-white space-y-3">
              <div>
                <p className="text-[11px] font-bold text-[#006C49] flex items-center gap-1 mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Respuesta sugerida por IA:
                </p>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  <button
                    onClick={() => handleOpenWhatsAppModal(selectedLead)}
                    className="whitespace-nowrap px-3 py-1.5 bg-[#D8E3FB]/40 hover:bg-[#D8E3FB] text-[#091426] rounded-full text-xs font-semibold transition-all border border-[#091426]/10"
                  >
                    Agendar visita mañana
                  </button>
                  <button
                    onClick={() => handleOpenWhatsAppModal(selectedLead)}
                    className="whitespace-nowrap px-3 py-1.5 bg-[#F2F4F6] hover:bg-[#E6E8EA] text-slate-700 rounded-full text-xs font-semibold transition-all border border-[#CBD5E1]"
                  >
                    Pedir garantía
                  </button>
                </div>
              </div>

              {/* Direct WhatsApp trigger button */}
              <button
                onClick={() => handleOpenWhatsAppModal(selectedLead)}
                className="w-full py-2.5 bg-[#006C49] hover:bg-[#007D55] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all"
              >
                <Phone className="w-4 h-4" /> Abrir WhatsApp con Respuesta IA
              </button>
            </div>

          </div>

        </div>

      </main>

      {/* ========================================================================= */}
      {/* 3. MODALS: WHATSAPP SMART SENDER WITH AI                                  */}
      {/* ========================================================================= */}
      {whatsappModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091426]/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 border border-[#E6E8EA] shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#E6E8EA]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#006C49] flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#091426]">
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
      {/* 4. MODALS: AGENDAR VISITA                                                 */}
      {/* ========================================================================= */}
      {scheduleVisitLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091426]/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-xl p-6 border border-[#E6E8EA] shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#E6E8EA]">
              <h3 className="text-sm font-bold text-[#091426] flex items-center gap-2">
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
                  placeholder="Ej: Hoy 16:30 hs o Sábado 10:00 hs"
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
      {/* 5. MODALS: FAST LEAD CAPTURE                                              */}
      {/* ========================================================================= */}
      {isNewLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091426]/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-xl p-6 border border-[#E6E8EA] shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#E6E8EA]">
              <h3 className="text-sm font-bold text-[#091426] flex items-center gap-2">
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
