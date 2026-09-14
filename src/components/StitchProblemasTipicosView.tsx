import React, { useState } from 'react';
import { MaintenanceIncident } from '../types';

interface Props {
  incidents: MaintenanceIncident[];
  onAddIncident: (incident: MaintenanceIncident) => void;
  onUpdateIncident: (incident: MaintenanceIncident) => void;
  onDeleteIncident: (id: string) => void;
}

export const StitchProblemasTipicosView: React.FC<Props> = ({
  incidents,
  onAddIncident,
  onUpdateIncident,
  onDeleteIncident,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal Form State
  const [propertyAddress, setPropertyAddress] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [tenantPhone, setTenantPhone] = useState('+54 236 4');
  const [category, setCategory] = useState<MaintenanceIncident['category']>('Humedad y Filtraciones');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<MaintenanceIncident['urgency']>('Urgente (<24h)');
  const [responsibility, setResponsibility] = useState<MaintenanceIncident['responsibility']>('Propietario (CCN Art. 1201)');
  const [assignedTrade, setAssignedTrade] = useState('');
  const [estimatedCost, setEstimatedCost] = useState<number>(0);

  // Selected incident for detail / gremio assignment
  const [activeIncident, setActiveIncident] = useState<MaintenanceIncident | null>(null);

  // Filtering
  const filteredIncidents = incidents.filter(item => {
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchUrg = selectedUrgency === 'all' || item.urgency === selectedUrgency;
    const matchSearch = item.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchUrg && matchSearch;
  });

  const urgentCount = incidents.filter(i => i.urgency === 'Urgente (<24h)' && i.status !== 'Resuelto').length;
  const inProgressCount = incidents.filter(i => i.status === 'Técnico Coordinado' || i.status === 'En Presupuesto').length;
  const resolvedCount = incidents.filter(i => i.status === 'Resuelto').length;

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    const newInc: MaintenanceIncident = {
      id: `inc-${Date.now()}`,
      propertyAddress: propertyAddress || 'Inmueble Administrado',
      tenantName: tenantName || 'Inquilino',
      tenantPhone: tenantPhone,
      category,
      description,
      urgency,
      responsibility,
      status: 'Pendiente',
      assignedTrade: assignedTrade || undefined,
      estimatedCost: Number(estimatedCost) || 0,
      dateReported: 'Hoy ' + new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs',
      lockboxCode: '#3001-A'
    };

    onAddIncident(newInc);
    setIsModalOpen(false);
    setPropertyAddress('');
    setTenantName('');
    setDescription('');
    setAssignedTrade('');
    setEstimatedCost(0);
  };

  const handleStatusChange = (incident: MaintenanceIncident, newStatus: MaintenanceIncident['status']) => {
    const updated: MaintenanceIncident = {
      ...incident,
      status: newStatus,
      resolutionDate: newStatus === 'Resuelto' ? new Date().toLocaleDateString('es-AR') : incident.resolutionDate
    };
    onUpdateIncident(updated);
  };

  const handleWhatsAppContact = (incident: MaintenanceIncident) => {
    const cleanPhone = incident.tenantPhone.replace(/[^0-9]/g, '');
    const msg = `Hola ${incident.tenantName}, te escribimos de la inmobiliaria en relación al reclamo por "${incident.category}" en ${incident.propertyAddress}. Queremos coordinar la visita del especialista técnico.`;
    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 pb-24 md:pb-8">
      
      {/* Header Info */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#E0E3E5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#BA1A1A]">build</span>
            <h2 className="text-lg font-bold text-[#091426] tracking-tight">
              Problemas y Arreglos en Alquileres
            </h2>
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
              CCN Art. 1201
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">
            Seguimiento de roturas y reparaciones: plomería, gas matriculado, humedad, luz y cerrajería. Asignación rápida de técnicos y aviso al inquilino.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#091426] hover:bg-[#1E293B] text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-sm shrink-0 transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">add_alert</span>
          + Cargar Reclamo
        </button>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E0E3E5] shadow-xs border-l-4 border-l-[#BA1A1A]">
          <p className="text-[#45474C] text-[11px] font-bold uppercase tracking-wider mb-1">
            Reclamos Urgentes (&lt;24h)
          </p>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-[#BA1A1A]">
            {urgentCount} <span className="text-xs font-sans text-slate-500 font-normal">pendientes de resolver</span>
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E0E3E5] shadow-xs border-l-4 border-l-amber-500">
          <p className="text-[#45474C] text-[11px] font-bold uppercase tracking-wider mb-1">
            Técnico / Gremio Coordinado
          </p>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-amber-700">
            {inProgressCount} <span className="text-xs font-sans text-slate-500 font-normal">en presupuesto o visita</span>
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E0E3E5] shadow-xs border-l-4 border-l-[#006C49]">
          <p className="text-[#006C49] text-[11px] font-bold uppercase tracking-wider mb-1">
            Incidencias Resueltas
          </p>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-[#006C49]">
            {resolvedCount} <span className="text-xs font-sans text-slate-500 font-normal">completadas</span>
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-[#E0E3E5] shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-sm">search</span>
          <input
            type="text"
            placeholder="Buscar por inmueble, inquilino o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#F7F9FB] border border-[#E0E3E5] rounded-lg text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-[#F7F9FB] border border-[#E0E3E5] rounded-lg text-xs font-semibold text-slate-700 shrink-0"
          >
            <option value="all">Todas las Categorías</option>
            <option value="Humedad y Filtraciones">Humedad y Filtraciones</option>
            <option value="Gas y Calefón">Gas y Calefón (Matriculado)</option>
            <option value="Electricidad">Electricidad / Térmicas</option>
            <option value="Plomería y Caños">Plomería y Caños</option>
            <option value="Cerrajería y Accesos">Cerrajería y Accesos</option>
            <option value="Expensas y Consorcio">Expensas y Consorcio</option>
          </select>

          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="px-3 py-1.5 bg-[#F7F9FB] border border-[#E0E3E5] rounded-lg text-xs font-semibold text-slate-700 shrink-0"
          >
            <option value="all">Toda Urgencia</option>
            <option value="Urgente (<24h)">Urgente (&lt;24h)</option>
            <option value="Ordinaria (<10 días)">Ordinaria (&lt;10 días)</option>
          </select>
        </div>
      </div>

      {/* Incidents Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIncidents.length === 0 ? (
          <div className="col-span-full bg-white p-8 rounded-xl border border-[#E0E3E5] text-center text-slate-500 text-xs">
            No se encontraron reclamos con los filtros seleccionados.
          </div>
        ) : (
          filteredIncidents.map(inc => {
            const isUrgent = inc.urgency === 'Urgente (<24h)';
            const isOwnerResp = inc.responsibility.includes('Propietario');

            return (
              <div
                key={inc.id}
                className={`bg-white rounded-xl border p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-4 transition-all hover:shadow-sm ${
                  isUrgent && inc.status !== 'Resuelto' ? 'border-l-4 border-l-[#BA1A1A] border-[#E0E3E5]' : 'border-[#E0E3E5]'
                }`}
              >
                {/* Top Row: Category, Urgency & Status */}
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#091426] text-white">
                        {inc.category}
                      </span>
                      {isUrgent ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-[#BA1A1A] flex items-center gap-1 border border-red-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#BA1A1A] animate-ping"></span>
                          Urgente &lt;24h (SLA Crítico)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                          Ordinaria &lt;10d
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-[#091426] pt-1">
                      {inc.propertyAddress}
                    </h3>
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                    inc.status === 'Resuelto' 
                      ? 'bg-emerald-100 text-[#006C49]' 
                      : inc.status === 'Técnico Coordinado'
                      ? 'bg-blue-100 text-blue-800'
                      : inc.status === 'En Presupuesto'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-[#BA1A1A]'
                  }`}>
                    {inc.status}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-700 bg-[#F7F9FB] p-3 rounded-lg border border-[#E0E3E5] leading-relaxed">
                  {inc.description}
                </p>

                {/* Responsibility & Trade assignment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <p className="text-[10px] font-bold uppercase text-slate-500">Responsabilidad Legal</p>
                    <p className={`font-semibold text-[11px] ${isOwnerResp ? 'text-blue-900 font-bold' : 'text-slate-800'}`}>
                      {inc.responsibility}
                    </p>
                  </div>

                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <p className="text-[10px] font-bold uppercase text-slate-500">Gremio / Especialista</p>
                    <p className="font-semibold text-[11px] text-[#091426] truncate">
                      {inc.assignedTrade || 'Sin asignar aún'}
                    </p>
                  </div>
                </div>

                {/* Tenant Info & Actions Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#E0E3E5]">
                  <div>
                    <p className="text-xs font-bold text-[#091426]">{inc.tenantName}</p>
                    <p className="text-[11px] text-slate-500 font-mono">Tel: {inc.tenantPhone} • {inc.dateReported}</p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => handleWhatsAppContact(inc)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs"
                      title="Contactar por WhatsApp"
                    >
                      <span className="material-symbols-outlined text-[15px]">chat</span>
                      WhatsApp
                    </button>

                    <select
                      value={inc.status}
                      onChange={(e) => handleStatusChange(inc, e.target.value as any)}
                      className="px-2 py-1 bg-[#F7F9FB] border border-[#E0E3E5] rounded-lg text-xs font-bold text-[#091426]"
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="En Presupuesto">En Presupuesto</option>
                      <option value="Técnico Coordinado">Técnico Coordinado</option>
                      <option value="Resuelto">Resuelto ✓</option>
                    </select>

                    <button
                      onClick={() => {
                        if (confirm('¿Eliminar este ticket de incidencia?')) {
                          onDeleteIncident(inc.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-[#BA1A1A] hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar reclamo"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* New Incident Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091426]/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-xl p-5 sm:p-6 border border-[#E0E3E5] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[#E0E3E5]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#BA1A1A]">report_problem</span>
                <h3 className="font-bold text-base text-[#091426]">Cargar Nuevo Problema / Reclamo de Inquilino</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 font-bold p-1">✕</button>
            </div>

            <form onSubmit={handleCreateIncident} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Inmueble / Dirección *</label>
                <input
                  type="text"
                  required
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  placeholder="Ej: Depto Calle Borges 142, Piso 2 A"
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Nombre Inquilino *</label>
                  <input
                    type="text"
                    required
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    placeholder="Ej: Nicolás Balbi"
                    className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Teléfono Inquilino *</label>
                  <input
                    type="tel"
                    required
                    value={tenantPhone}
                    onChange={(e) => setTenantPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Categoría del Problema</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg font-semibold"
                  >
                    <option value="Gas y Calefón">Gas y Calefón (Matriculado)</option>
                    <option value="Humedad y Filtraciones">Humedad y Filtraciones</option>
                    <option value="Electricidad">Electricidad / Disyuntores</option>
                    <option value="Plomería y Caños">Plomería y Caños</option>
                    <option value="Cerrajería y Accesos">Cerrajería y Accesos</option>
                    <option value="Expensas y Consorcio">Expensas y Consorcio</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Urgencia / SLA</label>
                  <select
                    value={urgency}
                    onChange={(e: any) => setUrgency(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg font-semibold"
                  >
                    <option value="Urgente (<24h)">Urgente (&lt;24h) - Riesgo o Inhabitabilidad</option>
                    <option value="Ordinaria (<10 días)">Ordinaria (&lt;10 días) - Desgaste menor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Responsabilidad Legal (CCN Art. 1201)</label>
                <select
                  value={responsibility}
                  onChange={(e: any) => setResponsibility(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg font-semibold"
                >
                  <option value="Propietario (CCN Art. 1201)">Propietario (Desgaste estructural / vicio oculto / rotura de instalación)</option>
                  <option value="Inquilino (Mantenimiento menor)">Inquilino (Uso indebido / mantenimiento menor / consumibles)</option>
                  <option value="Consorcio">Consorcio de Propietarios (Cañería común o fachada)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Descripción del Problema *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describa el desperfecto, causa aparente y si corta suministros esenciales..."
                  className="w-full p-2.5 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Gremio Asignado (Opcional)</label>
                  <input
                    type="text"
                    value={assignedTrade}
                    onChange={(e) => setAssignedTrade(e.target.value)}
                    placeholder="Ej: Gasista Roberto Rossi"
                    className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Presupuesto Estimado ($)</label>
                  <input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#E0E3E5]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#091426] hover:bg-[#1E293B] text-white font-bold text-xs rounded-lg shadow-sm"
                >
                  Guardar Incidencia en SQLite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
