import React, { useState, useEffect } from 'react';
import { 
  CRMViewTab, 
  Lead, 
  PropertyItem, 
  ContractItem, 
  MaintenanceIncident, 
  ReceptionEntry, 
  KeyCustodyItem, 
  AdCampaign 
} from './types';
import { 
  mockTenant, 
  mockUser, 
  mockLeadsList, 
  mockProperties, 
  mockContracts, 
  mockIncidents, 
  mockReceptionEntries, 
  mockKeyCustodyList, 
  mockAdCampaigns 
} from './data/mockData';
import { 
  getDatabase, 
  queryAllLeads, 
  queryAllProperties, 
  queryAllContracts, 
  insertOrUpdateLead, 
  deleteLeadById,
  insertOrUpdateContract,
  deleteContractById,
  queryAllIncidents,
  insertOrUpdateIncident,
  deleteIncidentById,
  queryAllReceptionEntries,
  insertOrUpdateReceptionEntry,
  queryAllKeyCustody,
  insertOrUpdateKeyCustody,
  queryAllAdCampaigns,
  insertOrUpdateAdCampaign,
  resetSqliteDatabase,
  exportSqliteBlob
} from './utils/sqliteService';

import { StitchSidebar } from './components/StitchSidebar';
import { StitchNuevasConsultasView } from './components/StitchNuevasConsultasView';
import { StitchEnSeguimientoView } from './components/StitchEnSeguimientoView';
import { StitchVisitasAgendadasView } from './components/StitchVisitasAgendadasView';
import { StitchCierresGanadosView } from './components/StitchCierresGanadosView';
import { StitchPropiedadesView } from './components/StitchPropiedadesView';
import { StitchContratosView } from './components/StitchContratosView';
import { StitchInquilinosView } from './components/StitchInquilinosView';
import { StitchProblemasTipicosView } from './components/StitchProblemasTipicosView';
import { StitchPublicidadView } from './components/StitchPublicidadView';
import { StitchRecepcionView } from './components/StitchRecepcionView';

export default function App() {
  const [activeTab, setActiveTab] = useState<CRMViewTab>('nuevas_consultas');
  const [dbReady, setDbReady] = useState(false);
  const [selectedTenantFilter, setSelectedTenantFilter] = useState<string>('');
  
  // Responsive Mobile Drawer state
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
  // State backed by SQLite
  const [leads, setLeads] = useState<Lead[]>(mockLeadsList);
  const [properties, setProperties] = useState<PropertyItem[]>(mockProperties);
  const [contracts, setContracts] = useState<ContractItem[]>(mockContracts);
  const [incidents, setIncidents] = useState<MaintenanceIncident[]>(mockIncidents);
  const [receptionEntries, setReceptionEntries] = useState<ReceptionEntry[]>(mockReceptionEntries);
  const [keyCustodyList, setKeyCustodyList] = useState<KeyCustodyItem[]>(mockKeyCustodyList);
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(mockAdCampaigns);

  const [selectedLead, setSelectedLead] = useState<Lead | null>(mockLeadsList[0]);
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

  // Flow End-to-End: Reserva to Contract Modal
  const [wonModalLead, setWonModalLead] = useState<Lead | null>(null);
  const [contractMonto, setContractMonto] = useState<number>(380000);
  const [contractIndex, setContractIndex] = useState<'ICL (Banco Central)' | 'IPC (Inflación INDEC)' | 'Casa Propia'>('IPC (Inflación INDEC)');
  const [contractPeriod, setContractPeriod] = useState<number>(4);

  // Load from SQLite on mount
  const refreshFromDb = async () => {
    try {
      await getDatabase();
      const [l, p, c, inc, rec, keys, ads] = await Promise.all([
        queryAllLeads(),
        queryAllProperties(),
        queryAllContracts(),
        queryAllIncidents(),
        queryAllReceptionEntries(),
        queryAllKeyCustody(),
        queryAllAdCampaigns()
      ]);
      setLeads(l);
      setProperties(p);
      setContracts(c);
      setIncidents(inc);
      setReceptionEntries(rec);
      setKeyCustodyList(keys);
      setCampaigns(ads);
      if (l.length > 0 && !selectedLead) {
        setSelectedLead(l[0]);
      }
      setDbReady(true);
    } catch (err) {
      console.error('Error initializing SQLite, falling back to mockData:', err);
      setDbReady(true);
    }
  };

  useEffect(() => {
    refreshFromDb();
  }, []);

  // Filtering leads
  const urgentCount = leads.filter(l => l.status === 'new' && l.unansweredHours >= 24).length;
  const activeCount = leads.filter(l => l.status === 'contacted').length;
  const visitsCount = leads.filter(l => l.status === 'visit_scheduled').length;
  const urgentIncidentsCount = incidents.filter(i => i.urgency === 'Urgente (<24h)' && i.status !== 'Resuelto').length;
  const urgentAjustesCount = contracts.filter(c => c.status === 'Ajuste Pendiente' || c.status === 'Por Vencer' || c.internalAuditStatus === 'vencido_liquidar').length;
  const waitingVisitorsCount = receptionEntries.filter(r => r.status === 'En Espera').length;

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

  const handleSendWhatsApp = async () => {
    if (!whatsappModalLead) return;
    const cleanPhone = whatsappModalLead.phone.replace(/[^0-9]/g, '');
    const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(customMsg)}`;
    
    const updatedLead: Lead = { ...whatsappModalLead, status: 'contacted', unansweredHours: 0 };
    await insertOrUpdateLead(updatedLead);
    setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
    setWhatsappModalLead(null);
    window.open(url, '_blank');
  };

  const handleScheduleVisit = async (lead: Lead) => {
    const updatedLead: Lead = { 
      ...lead, 
      status: 'visit_scheduled', 
      unansweredHours: 0,
      visitTime: 'Hoy 17:00 hs'
    };
    await insertOrUpdateLead(updatedLead);
    setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
    setActiveTab('visitas_agendadas');
  };

  const handleDiscard = async (id: string) => {
    const target = leads.find(l => l.id === id);
    if (!target) return;
    if (confirm('¿Descartar este lead y enviarlo al archivo?')) {
      const updated: Lead = { ...target, status: 'lost' };
      await insertOrUpdateLead(updated);
      setLeads(prev => prev.map(l => l.id === id ? updated : l));
    }
  };

  const handleDeleteLeadPermanent = async (id: string) => {
    if (confirm('¿Eliminar definitivamente este prospecto de SQLite?')) {
      await deleteLeadById(id);
      setLeads(prev => prev.filter(l => l.id !== id));
    }
  };

  const handleConcretarReserva = (lead: Lead) => {
    setWonModalLead(lead);
    const parsedPrice = parseInt(lead.propertyPrice.replace(/[^0-9]/g, ''), 10) || 380000;
    setContractMonto(parsedPrice);
  };

  const handleConfirmWonAndCreateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wonModalLead) return;

    // 1. Mark lead as won in SQLite
    const updatedLead: Lead = { ...wonModalLead, status: 'won' };
    await insertOrUpdateLead(updatedLead);

    // 2. Create Contract in SQLite with 4-month IPC default
    const newContract: ContractItem = {
      id: `cont-${Date.now()}`,
      tenantName: wonModalLead.name,
      tenantPhone: wonModalLead.phone,
      propertyAddress: wonModalLead.propertyAddress || wonModalLead.propertyTitle,
      currentAmount: Number(contractMonto),
      indexType: contractIndex,
      adjustmentPeriodMonths: contractPeriod,
      nextAdjustmentDate: `En ${contractPeriod} meses`,
      monthsToAdjustment: contractPeriod,
      status: 'Al Día',
      paymentStatus: 'Pagado',
      lastIncreasePercent: 0,
      ipcMonthlyRates: [4.0, 3.8, 3.5, 3.2],
      internalAuditStatus: 'al_dia',
      contractStartDate: new Date().toLocaleDateString('es-AR')
    };
    await insertOrUpdateContract(newContract);

    // Refresh state
    setLeads(prev => prev.map(l => l.id === wonModalLead.id ? updatedLead : l));
    setContracts(prev => [newContract, ...prev]);

    setWonModalLead(null);
    alert(`🎉 ¡Excelente! ${wonModalLead.name} ahora tiene Contrato de Alquiler activo con ajuste cada ${contractPeriod} meses por ${contractIndex}.`);
    setActiveTab('contratos');
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    const newL: Lead = {
      id: `lead-${Date.now()}`,
      name: newName || 'Consulta Rápida',
      initials: (newName || 'CR').split(' ').map(n => n[0]).join('').slice(0, 2),
      phone: newPhone,
      channel: 'WhatsApp',
      channelIcon: 'forum',
      propertyTitle: newProperty || 'Departamento Céntrico',
      propertyPrice: '$380.000 / mes',
      propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600',
      propertyAddress: 'Calle Bartolomé Mitre 230',
      bedrooms: 1,
      bathrooms: 1,
      timeAgo: 'Hace 1 min',
      unansweredHours: 0,
      urgencyLevel: 'normal',
      aiScore: 90,
      aiIntentLevel: 'Alta Intención',
      lastMessage: 'Consulta cargada para seguimiento inmediato.',
      status: 'new',
      lockboxCode: '#3001-A',
      martilleroName: mockUser.name,
      guaranteeStatus: 'En verificación'
    };
    await insertOrUpdateLead(newL);
    setLeads([newL, ...leads]);
    setSelectedLead(newL);
    setIsNewModalOpen(false);
    setNewName('');
    setNewProperty('');
    setActiveTab('nuevas_consultas');
  };

  // Properties handlers
  const handleAddProperty = (item: PropertyItem) => {
    setProperties([item, ...properties]);
  };
  const handleDeleteProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  // Contracts handlers
  const handleAddContract = async (item: ContractItem) => {
    await insertOrUpdateContract(item);
    setContracts([item, ...contracts]);
  };
  const handleUpdateContract = async (item: ContractItem) => {
    await insertOrUpdateContract(item);
    setContracts(prev => prev.map(c => c.id === item.id ? item : c));
  };
  const handleDeleteContract = async (id: string) => {
    await deleteContractById(id);
    setContracts(prev => prev.filter(c => c.id !== id));
  };

  // Incidents handlers
  const handleAddIncident = async (item: MaintenanceIncident) => {
    await insertOrUpdateIncident(item);
    setIncidents([item, ...incidents]);
  };
  const handleUpdateIncident = async (item: MaintenanceIncident) => {
    await insertOrUpdateIncident(item);
    setIncidents(prev => prev.map(i => i.id === item.id ? item : i));
  };
  const handleDeleteIncident = async (id: string) => {
    await deleteIncidentById(id);
    setIncidents(prev => prev.filter(i => i.id !== id));
  };

  // Reception Entries handlers
  const handleAddReceptionEntry = async (item: ReceptionEntry) => {
    await insertOrUpdateReceptionEntry(item);
    setReceptionEntries([item, ...receptionEntries]);
  };
  const handleUpdateReceptionEntry = async (item: ReceptionEntry) => {
    await insertOrUpdateReceptionEntry(item);
    setReceptionEntries(prev => prev.map(r => r.id === item.id ? item : r));
  };

  // Key Custody handlers
  const handleAddKeyCustody = async (item: KeyCustodyItem) => {
    await insertOrUpdateKeyCustody(item);
    setKeyCustodyList([item, ...keyCustodyList]);
  };
  const handleUpdateKeyCustody = async (item: KeyCustodyItem) => {
    await insertOrUpdateKeyCustody(item);
    setKeyCustodyList(prev => prev.map(k => k.id === item.id ? item : k));
  };

  // Ad Campaigns handlers
  const handleAddCampaign = async (item: AdCampaign) => {
    await insertOrUpdateAdCampaign(item);
    setCampaigns([item, ...campaigns]);
  };
  const handleUpdateCampaign = async (item: AdCampaign) => {
    await insertOrUpdateAdCampaign(item);
    setCampaigns(prev => prev.map(c => c.id === item.id ? item : c));
  };

  // Export & Reset SQLite
  const handleExportSqlite = async () => {
    const blobData = await exportSqliteBlob();
    if (!blobData) return;
    const blob = new Blob([blobData as any], { type: 'application/x-sqlite3' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `propsaas_database_${new Date().toISOString().slice(0,10)}.sqlite`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetDemoData = async () => {
    if (confirm('¿Restablecer toda la base de datos SQLite a los valores iniciales?')) {
      await resetSqliteDatabase();
      await refreshFromDb();
      alert('¡Base de datos SQLite restablecida con éxito!');
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F7F9FB] font-sans antialiased text-[#191C1E]">
      
      {/* 1. Sidebar (Desktop Fixed 290px / Mobile Slide-out Drawer) */}
      <StitchSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'inquilinos') {
            setSelectedTenantFilter('');
          }
          setActiveTab(tab);
        }}
        tenant={mockTenant}
        user={mockUser}
        urgentCount={urgentCount}
        activeCount={activeCount}
        visitsCount={visitsCount}
        wonCount={leads.filter(l => l.status === 'won').length}
        incidentCount={urgentIncidentsCount}
        onOpenNewLeadModal={() => setIsNewModalOpen(true)}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* 2. Main Content Canvas */}
      <main className="flex-1 flex flex-col h-[100dvh] md:h-screen md:ml-[290px] w-full overflow-hidden bg-[#F2F4F6] pb-16 md:pb-0">
        
        {/* Mobile Top App Bar (Visible on mobile screens) */}
        <div className="md:hidden bg-[#091426] text-white px-3.5 py-2.5 flex items-center justify-between border-b border-[#1E293B] shrink-0 z-30">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 active:scale-95"
              title="Abrir menú"
              aria-label="Abrir menú"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[#006C49] shrink-0"></span>
              <span className="font-bold text-sm tracking-tight truncate">
                {activeTab === 'nuevas_consultas' && '1. Nuevas Consultas'}
                {activeTab === 'en_seguimiento' && '2. En Conversación'}
                {activeTab === 'visitas_agendadas' && '3. Visitas Agendadas'}
                {activeTab === 'cierres_ganados' && '4. Clientes Ganados'}
                {activeTab === 'descartados' && '5. Archivados'}
                {activeTab === 'contratos' && 'Aumentos IPC (4M)'}
                {activeTab === 'problemas_tipicos' && 'Problemas y Arreglos'}
                {activeTab === 'recepcion' && 'Recepción y Llaves'}
                {activeTab === 'publicidad' && 'Publicidad y Avisos'}
                {activeTab === 'propiedades' && 'Propiedades'}
                {activeTab === 'inquilinos' && 'Inquilinos'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="bg-[#006C49] hover:bg-[#007D55] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Cargar
            </button>
          </div>
        </div>

        {/* Desktop Header */}
        <header className="hidden md:block px-6 lg:px-8 py-4 bg-white border-b border-[#E0E3E5] shrink-0">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-[#091426] tracking-tight">
                  {activeTab === 'nuevas_consultas' && 'Bandeja de Entrada: Nuevas Consultas'}
                  {activeTab === 'en_seguimiento' && 'Consultas en Conversación'}
                  {activeTab === 'visitas_agendadas' && 'Agenda de Visitas Inmobiliarias'}
                  {activeTab === 'cierres_ganados' && 'Alquileres y Ventas Concretadas'}
                  {activeTab === 'descartados' && 'Historial de Consultas Archivadas'}
                  {activeTab === 'propiedades' && 'Catálogo de Inmuebles'}
                  {activeTab === 'contratos' && 'Control de Aumentos de Alquiler (IPC cada 4 meses)'}
                  {activeTab === 'inquilinos' && 'Padrón de Inquilinos y Recibos'}
                  {activeTab === 'problemas_tipicos' && 'Reclamos, Mantenimiento y Arreglos'}
                  {activeTab === 'publicidad' && 'Publicidad, Avisos y Portales Conectados'}
                  {activeTab === 'recepcion' && 'Recepción en Sucursal y Custodia de Llaves'}
                </h1>
                <span className="bg-emerald-100 text-[#006C49] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006C49] animate-pulse"></span>
                  En línea
                </span>
              </div>
              <p className="text-xs text-[#45474C] mt-0.5">
                {activeTab === 'nuevas_consultas' && 'Primer contacto con interesados por WhatsApp e Instagram.'}
                {activeTab === 'en_seguimiento' && 'Seguimiento de prospectos calificados y verificación de garantías.'}
                {activeTab === 'visitas_agendadas' && 'Cronograma de muestras presenciales coordinadas con martilleros.'}
                {activeTab === 'cierres_ganados' && 'Reservas confirmadas y pase inmediato a contrato de locación.'}
                {activeTab === 'descartados' && 'Consultas descartadas que no cumplieron requisitos o desistieron.'}
                {activeTab === 'propiedades' && 'Fichas de propiedades en alquiler y venta con fotos y precios.'}
                {activeTab === 'contratos' && 'Monitoreo interno cuatrimestral de inflación INDEC y liquidación de aumentos.'}
                {activeTab === 'inquilinos' && 'Directorio de inquilinos activos, cobro de alquileres y emisión de recibos.'}
                {activeTab === 'problemas_tipicos' && 'Atención de roturas urgentes (<24h), gasistas matriculados y plomería.'}
                {activeTab === 'publicidad' && 'Generador de textos para publicar en redes y estado de portales.'}
                {activeTab === 'recepcion' && 'Atención de visitas en mesa de entrada y registro de llaveros prestados.'}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button 
                onClick={handleExportSqlite}
                title="Descargar base de datos SQLite .sqlite"
                className="bg-white text-slate-700 border border-[#E0E3E5] rounded-lg px-2.5 py-1.5 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1 shadow-2xs"
              >
                <span className="material-symbols-outlined text-[15px] text-[#006C49]">database</span>
                Respaldar BD
              </button>
              <button 
                onClick={handleResetDemoData}
                title="Restablecer datos originales"
                className="bg-white text-slate-500 border border-[#E0E3E5] rounded-lg px-2.5 py-1.5 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1 shadow-2xs"
              >
                <span className="material-symbols-outlined text-[15px]">restart_alt</span>
                Reiniciar
              </button>
              <button 
                onClick={() => setIsNewModalOpen(true)}
                className="bg-[#091426] text-white rounded-lg px-3.5 py-1.5 text-xs font-semibold hover:bg-[#1E293B] transition-colors shadow-xs flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">add</span>
                Cargar Consulta
              </button>
            </div>
          </div>
        </header>

        {/* 3. Screen View Renderer */}
        {!dbReady ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 border-3 border-[#006C49] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-slate-500 font-bold">Cargando base de datos SQLite en WebAssembly...</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'nuevas_consultas' && (
              <StitchNuevasConsultasView
                leads={currentLeads}
                selectedLead={selectedLead || currentLeads[0]}
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

            {activeTab === 'cierres_ganados' && (
              <StitchCierresGanadosView
                leads={leads.filter(l => l.status === 'won')}
                contracts={contracts}
                onCreateContractFromWon={(lead) => handleConcretarReserva(lead)}
                onGoToTenantPortal={(name) => {
                  setSelectedTenantFilter(name);
                  setActiveTab('inquilinos');
                }}
                onDeleteLeadPermanent={handleDeleteLeadPermanent}
              />
            )}

            {activeTab === 'contratos' && (
              <StitchContratosView
                contracts={contracts}
                onAddContract={handleAddContract}
                onUpdateContract={handleUpdateContract}
                onDeleteContract={handleDeleteContract}
              />
            )}

            {activeTab === 'problemas_tipicos' && (
              <StitchProblemasTipicosView
                incidents={incidents}
                onAddIncident={handleAddIncident}
                onUpdateIncident={handleUpdateIncident}
                onDeleteIncident={handleDeleteIncident}
              />
            )}

            {activeTab === 'recepcion' && (
              <StitchRecepcionView
                receptionEntries={receptionEntries}
                keyCustodyList={keyCustodyList}
                properties={properties}
                onAddReceptionEntry={handleAddReceptionEntry}
                onUpdateReceptionEntry={handleUpdateReceptionEntry}
                onAddKeyCustody={handleAddKeyCustody}
                onUpdateKeyCustody={handleUpdateKeyCustody}
              />
            )}

            {activeTab === 'publicidad' && (
              <StitchPublicidadView
                campaigns={campaigns}
                properties={properties}
                onAddCampaign={handleAddCampaign}
                onUpdateCampaign={handleUpdateCampaign}
              />
            )}

            {activeTab === 'propiedades' && (
              <StitchPropiedadesView
                properties={properties}
                onAddProperty={handleAddProperty}
                onDeleteProperty={handleDeleteProperty}
              />
            )}

            {activeTab === 'inquilinos' && (
              <StitchInquilinosView 
                contracts={contracts}
                tenant={mockTenant}
                initialTenantName={selectedTenantFilter}
                onUpdateContract={handleUpdateContract}
              />
            )}

            {activeTab === 'descartados' && (
              <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
                <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E0E3E5] shadow-xs text-center space-y-4">
                  <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">folder_open</span>
                  <h3 className="text-lg font-bold text-[#091426]">
                    Histórico de Consultas Descartadas
                  </h3>
                  
                  {currentLeads.length === 0 ? (
                    <p className="text-xs text-slate-500">No hay consultas archivadas actualmente.</p>
                  ) : (
                    <div className="max-w-2xl mx-auto space-y-2 text-left">
                      {currentLeads.map(l => (
                        <div key={l.id} className="p-3 bg-[#F7F9FB] rounded-lg border border-[#E0E3E5] flex justify-between items-center text-xs">
                          <div>
                            <p className="font-bold text-[#091426]">{l.name} • {l.propertyTitle}</p>
                            <p className="text-slate-500 text-[11px]">{l.phone} - {l.propertyPrice}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteLeadPermanent(l.id)}
                            className="text-[#BA1A1A] hover:underline text-xs font-bold"
                          >
                            Eliminar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* 4. Mobile Bottom Navigation Bar (Fixed at bottom on phones) */}
        <nav 
          aria-label="Navegación rápida móvil"
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#091426] border-t border-[#1E293B] flex items-center justify-around py-2 px-1 shadow-2xl safe-area-bottom"
        >
          <button
            onClick={() => setActiveTab('nuevas_consultas')}
            className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-semibold transition-all relative ${
              activeTab === 'nuevas_consultas' ? 'text-[#6FFBBE] font-bold' : 'text-[#8590A6]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">inbox</span>
            <span>Consultas</span>
            {urgentCount > 0 && (
              <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-[#BA1A1A] ring-2 ring-[#091426]"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('contratos')}
            className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-semibold transition-all relative ${
              activeTab === 'contratos' ? 'text-[#6FFBBE] font-bold' : 'text-[#8590A6]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">trending_up</span>
            <span>IPC 4M</span>
            {urgentAjustesCount > 0 && (
              <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#091426]"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('problemas_tipicos')}
            className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-semibold transition-all relative ${
              activeTab === 'problemas_tipicos' ? 'text-[#6FFBBE] font-bold' : 'text-[#8590A6]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">build</span>
            <span>Reclamos</span>
            {urgentIncidentsCount > 0 && (
              <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-[#091426]"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('recepcion')}
            className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-semibold transition-all relative ${
              activeTab === 'recepcion' ? 'text-[#6FFBBE] font-bold' : 'text-[#8590A6]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">concierge</span>
            <span>Recepción</span>
            {waitingVisitorsCount > 0 && (
              <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-blue-400 ring-2 ring-[#091426]"></span>
            )}
          </button>

          <button
            onClick={() => setIsMobileNavOpen(true)}
            className="flex flex-col items-center gap-0.5 p-1 text-[10px] font-semibold text-slate-300 hover:text-white transition-all active:scale-95"
            aria-label="Abrir menú completo"
          >
            <span className="material-symbols-outlined text-[20px]">menu</span>
            <span>Menú</span>
          </button>
        </nav>

      </main>

      {/* Modal: Concretar Reserva ➔ Crear Contrato */}
      {wonModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091426]/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl p-5 sm:p-6 border border-[#E0E3E5] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[#E0E3E5]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006C49] text-2xl">handshake</span>
                <h3 className="font-bold text-base text-[#091426]">Concretar Reserva y Dar de Alta Inquilino</h3>
              </div>
              <button onClick={() => setWonModalLead(null)} className="text-slate-400 font-bold p-1">✕</button>
            </div>

            <p className="text-xs text-slate-600">
              Esta acción marcará la operación de <strong className="text-[#091426]">{wonModalLead.name}</strong> como ganada y creará su contrato de locación con control de aumentos cuatrimestrales.
            </p>

            <form onSubmit={handleConfirmWonAndCreateContract} className="space-y-3 text-xs">
              <div className="p-3 bg-[#F7F9FB] rounded-xl border border-[#E0E3E5] space-y-1">
                <p className="font-bold text-sm text-[#091426]">{wonModalLead.name} ({wonModalLead.phone})</p>
                <p className="text-slate-500">{wonModalLead.propertyAddress || wonModalLead.propertyTitle}</p>
                <p className="text-emerald-700 font-semibold">Garantía: {wonModalLead.guaranteeStatus}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Monto de Alquiler ($)</label>
                  <input
                    type="number"
                    required
                    value={contractMonto}
                    onChange={(e) => setContractMonto(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg font-mono font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Esquema de Ajuste</label>
                  <select
                    value={contractIndex}
                    onChange={(e: any) => setContractIndex(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg text-xs font-semibold"
                  >
                    <option value="IPC (Inflación INDEC)">IPC (INDEC) - Recomendado</option>
                    <option value="ICL (Banco Central)">ICL (Banco Central)</option>
                    <option value="Casa Propia">Casa Propia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Frecuencia de Aumento</label>
                <select
                  value={contractPeriod}
                  onChange={(e) => setContractPeriod(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg text-xs font-semibold"
                >
                  <option value={4}>Cada 4 meses (Cuatrimestral - Estándar Post-DNU)</option>
                  <option value={3}>Cada 3 meses (Trimestral)</option>
                  <option value={6}>Cada 6 meses (Semestral)</option>
                  <option value={12}>Cada 12 meses (Anual)</option>
                </select>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006C49] text-base">verified</span>
                Se integrará al Panel de Control Interno de Aumentos y al Portal de Inquilinos.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setWonModalLead(null)}
                  className="px-4 py-2 font-semibold text-slate-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#006C49] hover:bg-[#007D55] text-white font-bold rounded-xl shadow-sm transition-all"
                >
                  Confirmar y Crear Contrato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WhatsApp Modal */}
      {whatsappModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091426]/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-xl p-5 sm:p-6 border border-[#E0E3E5] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[#E0E3E5]">
              <h3 className="text-sm font-bold text-[#091426] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006C49]">forum</span>
                WhatsApp con {whatsappModalLead.name}
              </h3>
              <button onClick={() => setWhatsappModalLead(null)} className="text-slate-400 font-bold p-1">✕</button>
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
          <div className="bg-white w-full max-w-md rounded-xl p-5 sm:p-6 border border-[#E0E3E5] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[#E0E3E5]">
              <h3 className="text-sm font-bold text-[#091426]">+ Cargar Nueva Consulta</h3>
              <button onClick={() => setIsNewModalOpen(false)} className="text-slate-400 font-bold p-1">✕</button>
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
                  Guardar en SQLite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
