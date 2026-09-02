import React, { useState } from 'react';
import { CRMViewTab, Lead } from './types';
import { mockTenant, mockUser, mockLeadsList } from './data/mockData';
import { StitchSidebar } from './components/StitchSidebar';
import { StitchNuevasConsultasView } from './components/StitchNuevasConsultasView';
import { StitchEnSeguimientoView } from './components/StitchEnSeguimientoView';
import { StitchVisitasAgendadasView } from './components/StitchVisitasAgendadasView';

export default function App() {
  const [activeTab, setActiveTab] = useState<CRMViewTab>('nuevas_consultas');
  const [leads, setLeads] = useState<Lead[]>(mockLeadsList);
  const [selectedLead, setSelectedLead] = useState<Lead>(mockLeadsList[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [selectedDay, setSelectedDay] = useState<'hoy' | 'manana' | 'sabado' | 'mes'>('hoy');

  // WhatsApp Smart Modal
  const [whatsappModalLead, setWhatsappModalLead] = useState<Lead | null>(null);
  const [customMsg, setCustomMsg] = useState('');

  // New Lead Modal
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('+54 236 4');
  const [newProperty, setNewProperty] = useState('');

  // Filtering leads
  const urgentCount = leads.filter(l => l.status === 'new' && l.unansweredHours >= 24).length;
  const activeCount = leads.filter(l => l.status === 'contacted').length;
  const visitsCount = leads.filter(l => l.status === 'visit_scheduled').length;

  const currentLeads = leads.filter(lead => {
    let matchTab = true;
    if (activeTab === 'nuevas_consultas') matchTab = lead.status === 'new';
    else if (activeTab === 'en_seguimiento') matchTab = lead.status === 'contacted';
    else if (activeTab === 'visitas_agendadas') matchTab = lead.status === 'visit_scheduled';
    else if (activeTab === 'cierres_ganados') matchTab = lead.status === 'won';
    else if (activeTab === 'descartados') matchTab = lead.status === 'lost';

    const matchSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        lead.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        lead.phone.includes(searchTerm);
    const matchChannel = channelFilter === 'all' || lead.channel === channelFilter;
    const matchUrgent = !urgentOnly || (lead.status === 'new' && lead.unansweredHours >= 24);

    return matchTab && matchSearch && matchChannel && matchUrgent;
  });

  const handleOpenWhatsApp = (lead: Lead) => {
    setWhatsappModalLead(lead);
    setCustomMsg(`¡Hola ${lead.name.split(' ')[0]}! Te escribo de ${mockTenant.name} por tu consulta sobre "${lead.propertyTitle}". ¿Querés que coordinemos una visita o te envíe fotos y detalles?`);
  };

  const handleSendWhatsApp = () => {
    if (!whatsappModalLead) return;
    const cleanPhone = whatsappModalLead.phone.replace(/[^0-9]/g, '');
    const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(customMsg)}`;
    
    setLeads(prev => prev.map(l => l.id === whatsappModalLead.id ? { ...l, status: 'contacted', unansweredHours: 0 } : l));
    setWhatsappModalLead(null);
    window.open(url, '_blank');
  };

  const handleScheduleVisit = (lead: Lead) => {
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: 'visit_scheduled', unansweredHours: 0 } : l));
    setActiveTab('visitas_agendadas');
  };

  const handleDiscard = (id: string) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: 'lost' } : l));
  };

  const handleConcretarReserva = (lead: Lead) => {
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: 'won' } : l));
    alert(`¡Felicitaciones! ${lead.name} reservó la propiedad con éxito.`);
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    const newL: Lead = {
      id: `lead-${Date.now()}`,
      name: newName || 'Consulta Rápida',
      initials: (newName || 'CR').split(' ').map(n => n[0]).join(''),
      phone: newPhone,
      channel: 'WhatsApp',
      channelIcon: 'forum',
      propertyTitle: newProperty || 'Departamento Céntrico',
      propertyPrice: '$350.000 / mes',
      propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600',
      propertyAddress: 'Calle Bartolomé Mitre 230',
      bedrooms: 1,
      bathrooms: 1,
      timeAgo: 'Hace 1 min',
      unansweredHours: 0,
      urgencyLevel: 'normal',
      aiScore: 90,
      aiIntentLevel: 'Alta Intención',
      lastMessage: 'Consulta cargada por agente para seguimiento inmediato.',
      status: 'new',
      lockboxCode: '#3001-A',
      martilleroName: mockUser.name,
      guaranteeStatus: 'En verificación'
    };
    setLeads([newL, ...leads]);
    setSelectedLead(newL);
    setIsNewModalOpen(false);
    setNewName('');
    setNewProperty('');
    setActiveTab('nuevas_consultas');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F7F9FB] font-sans antialiased text-[#191C1E]">
      
      {/* 1. Exact Fixed Sidebar (280px) */}
      <StitchSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        tenant={mockTenant}
        user={mockUser}
        urgentCount={urgentCount}
        activeCount={activeCount}
        visitsCount={visitsCount}
        onOpenNewLeadModal={() => setIsNewModalOpen(true)}
      />

      {/* 2. Main Content Canvas */}
      <main className="flex-1 flex flex-col h-screen md:ml-[280px] w-full overflow-hidden bg-[#F2F4F6]">
        
        {/* Header with Stats Bento Box */}
        <header className="px-8 py-6 bg-white border-b border-[#E0E3E5] shrink-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
            <div>
              <h1 className="text-2xl font-bold text-[#091426] tracking-tight">
                {activeTab === 'nuevas_consultas' && 'Bandeja de Entrada: Nuevas Consultas Inmobiliarias'}
                {activeTab === 'en_seguimiento' && 'Prospectos En Conversación Activa'}
                {activeTab === 'visitas_agendadas' && 'Agenda de Visitas Inmobiliarias'}
                {activeTab === 'cierres_ganados' && 'Operaciones y Clientes Ganados'}
                {activeTab === 'descartados' && 'Histórico de Consultas Archivadas'}
                {activeTab === 'propiedades' && 'Inventario y Catálogo de Inmuebles'}
                {activeTab === 'contratos' && 'Gestión de Contratos y Aumentos ICL/IPC'}
                {activeTab === 'inquilinos' && 'Portal de Transparencia para Inquilinos'}
              </h1>
              <p className="text-sm text-[#45474C] mt-0.5">
                Gestiona y responde a los prospectos de forma centralizada sin fricciones.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => alert('Exportando lista en CSV...')}
                className="bg-white text-[#091426] border border-[#75777D]/30 rounded-lg px-4 py-2 text-xs font-semibold hover:bg-[#F7F9FB] transition-colors flex items-center gap-2 shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Exportar CSV
              </button>
              <button 
                onClick={() => setIsNewModalOpen(true)}
                className="bg-[#091426] text-white rounded-lg px-4 py-2 text-xs font-semibold hover:bg-[#1E293B] transition-colors shadow-xs"
              >
                + Cargar Consulta
              </button>
            </div>
          </div>

          {/* Quick Stats Bento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-white border border-[#E0E3E5] rounded-xl p-4 shadow-xs flex items-center gap-4 border-l-4 border-l-[#BA1A1A]">
              <div className="w-12 h-12 rounded-full bg-[#FFDAD6]/60 flex items-center justify-center text-[#BA1A1A] shrink-0">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#45474C]">Total Sin Responder</p>
                <p className="text-2xl font-bold font-mono text-[#091426] leading-none mt-1">
                  {urgentCount} <span className="text-[#BA1A1A] text-xs font-bold font-sans ml-1">Urgentes (&gt;24h)</span>
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#E0E3E5] rounded-xl p-4 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#D8E3FB] flex items-center justify-center text-[#091426] shrink-0">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>timer</span>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#45474C]">Tiempo Promedio</p>
                <p className="text-2xl font-bold font-mono text-[#091426] leading-none mt-1">
                  18 <span className="text-[#45474C] text-xs font-sans">minutos</span>
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#E0E3E5] rounded-xl p-4 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-[#006C49] shrink-0">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#45474C]">SLA de Respuesta (&lt;1h)</p>
                <p className="text-2xl font-bold font-mono text-[#006C49] leading-none mt-1">
                  94% <span className="text-[#006C49] text-xs font-bold font-sans ml-1">✓ Óptimo</span>
                </p>
              </div>
            </div>

          </div>
        </header>

        {/* 3. Screen View Renderer */}
        {activeTab === 'nuevas_consultas' && (
          <StitchNuevasConsultasView
            leads={currentLeads}
            selectedLead={selectedLead}
            onSelectLead={setSelectedLead}
            onOpenWhatsApp={handleOpenWhatsApp}
            onScheduleVisit={handleScheduleVisit}
            onDiscardLead={handleDiscard}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            channelFilter={channelFilter}
            onChannelFilterChange={setChannelFilter}
            urgentOnly={urgentOnly}
            onToggleUrgentOnly={() => setUrgentOnly(!urgentOnly)}
            urgentCount={urgentCount}
          />
        )}

        {activeTab === 'en_seguimiento' && (
          <StitchEnSeguimientoView
            leads={currentLeads}
            onOpenWhatsApp={handleOpenWhatsApp}
            onScheduleVisit={handleScheduleVisit}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        )}

        {activeTab === 'visitas_agendadas' && (
          <StitchVisitasAgendadasView
            leads={currentLeads}
            onOpenWhatsAppGPS={(lead) => {
              const clean = lead.phone.replace(/[^0-9]/g, '');
              window.open(`https://api.whatsapp.com/send?phone=${clean}&text=${encodeURIComponent('Hola! Te paso la ubicación exacta para nuestra visita de hoy: ' + lead.propertyAddress)}`, '_blank');
            }}
            onConcretarReserva={handleConcretarReserva}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
          />
        )}

        {(activeTab === 'cierres_ganados' || activeTab === 'descartados' || activeTab === 'propiedades' || activeTab === 'contratos' || activeTab === 'inquilinos') && (
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="bg-white rounded-xl p-8 border border-[#E0E3E5] shadow-xs text-center">
              <span className="material-symbols-outlined text-4xl text-[#006C49] mb-2">folder_open</span>
              <h3 className="text-lg font-bold text-[#091426]">Módulo de {activeTab.replace('_', ' ').toUpperCase()}</h3>
              <p className="text-xs text-slate-500 mt-1">Sección sincronizada y lista para visualización.</p>
            </div>
          </div>
        )}

      </main>

      {/* WhatsApp Modal */}
      {whatsappModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091426]/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-xl p-6 border border-[#E0E3E5] shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#E0E3E5]">
              <h3 className="text-sm font-bold text-[#091426] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006C49]">forum</span>
                WhatsApp con {whatsappModalLead.name}
              </h3>
              <button onClick={() => setWhatsappModalLead(null)} className="text-slate-400 font-bold">✕</button>
            </div>
            <textarea
              rows={4}
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              className="w-full p-3 bg-[#F7F9FB] border border-[#75777D]/30 rounded-xl text-xs text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-[#006C49]"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setWhatsappModalLead(null)} className="px-3 py-2 text-xs font-semibold text-slate-500">
                Cancelar
              </button>
              <button onClick={handleSendWhatsApp} className="px-4 py-2 bg-[#006C49] text-white text-xs font-bold rounded-lg shadow-sm">
                Enviar por WhatsApp Web
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Lead Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091426]/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-xl p-6 border border-[#E0E3E5] shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#E0E3E5]">
              <h3 className="text-sm font-bold text-[#091426]">+ Cargar Nueva Consulta</h3>
              <button onClick={() => setIsNewModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleAddLead} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej: Marcelo Gómez"
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Teléfono</label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Propiedad de Interés</label>
                <input
                  type="text"
                  required
                  value={newProperty}
                  onChange={(e) => setNewProperty(e.target.value)}
                  placeholder="Ej: Depto 2 Ambientes"
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg text-xs"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsNewModalOpen(false)} className="px-3 py-2 text-xs font-semibold text-slate-500">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-[#091426] text-white text-xs font-bold rounded-lg">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
