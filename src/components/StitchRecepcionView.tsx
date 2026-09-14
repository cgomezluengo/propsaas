import React, { useState } from 'react';
import { ReceptionEntry, KeyCustodyItem, PropertyItem } from '../types';

interface Props {
  receptionEntries: ReceptionEntry[];
  keyCustodyList: KeyCustodyItem[];
  properties: PropertyItem[];
  onAddReceptionEntry: (entry: ReceptionEntry) => void;
  onUpdateReceptionEntry: (entry: ReceptionEntry) => void;
  onAddKeyCustody: (item: KeyCustodyItem) => void;
  onUpdateKeyCustody: (item: KeyCustodyItem) => void;
}

export const StitchRecepcionView: React.FC<Props> = ({
  receptionEntries,
  keyCustodyList,
  properties,
  onAddReceptionEntry,
  onUpdateReceptionEntry,
  onAddKeyCustody,
  onUpdateKeyCustody,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'guardia' | 'llaves'>('guardia');
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

  // New Visitor Form State
  const [visitorName, setVisitorName] = useState('');
  const [visitorType, setVisitorType] = useState<ReceptionEntry['visitorType']>('Inquilino');
  const [reason, setReason] = useState('');
  const [assignedMartillero, setAssignedMartillero] = useState('Carlos Gómez');
  const [contactPhone, setContactPhone] = useState('+54 236 4');

  // New Key Lend Form State
  const [keyTag, setKeyTag] = useState('');
  const [propertyTitle, setPropertyTitle] = useState(properties[0]?.title || '');
  const [propertyAddress, setPropertyAddress] = useState(properties[0]?.address || '');
  const [takenBy, setTakenBy] = useState('Carlos Gómez (Martillero)');
  const [keyNotes, setKeyNotes] = useState('');

  const waitingCount = receptionEntries.filter(r => r.status === 'En Espera').length;
  const inAttentionCount = receptionEntries.filter(r => r.status === 'En Atención').length;
  const borrowedKeysCount = keyCustodyList.filter(k => k.status.includes('Prestada')).length;

  const handleCreateVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: ReceptionEntry = {
      id: `rec-entry-${Date.now()}`,
      visitorName: visitorName || 'Visitante',
      visitorType,
      reason: reason || 'Consulta general en recepción',
      assignedMartillero,
      status: 'En Espera',
      timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs',
      contactPhone
    };

    onAddReceptionEntry(entry);
    setIsVisitorModalOpen(false);
    setVisitorName('');
    setReason('');
  };

  const handleVisitorStatusChange = (entry: ReceptionEntry, newStatus: ReceptionEntry['status']) => {
    onUpdateReceptionEntry({ ...entry, status: newStatus });
  };

  const handleCreateKeyCustody = (e: React.FormEvent) => {
    e.preventDefault();
    const item: KeyCustodyItem = {
      id: `key-${Date.now()}`,
      propertyTitle: propertyTitle || 'Inmueble',
      propertyAddress: propertyAddress || 'Dirección',
      keyTag: keyTag || `LLA-${Math.floor(100 + Math.random() * 900)}`,
      takenBy: takenBy || 'Martillero Colegiado',
      takenAt: 'Hoy ' + new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs',
      status: 'Prestada / En Visita',
      notes: keyNotes
    };

    onAddKeyCustody(item);
    setIsKeyModalOpen(false);
    setKeyTag('');
    setKeyNotes('');
  };

  const handleReturnKey = (key: KeyCustodyItem) => {
    const timeNow = 'Hoy ' + new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs';
    onUpdateKeyCustody({
      ...key,
      status: 'En Inmobiliaria',
      returnedAt: timeNow
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 pb-24 md:pb-8">
      
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#E0E3E5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006C49]">concierge</span>
            <h2 className="text-lg font-bold text-[#091426] tracking-tight">
              Recepción y Control de Llaves
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">
            Atención presencial en sucursal y registro de llaves para visitas o reparaciones.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsVisitorModalOpen(true)}
            className="bg-[#091426] hover:bg-[#1E293B] text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            + Registrar Visita
          </button>
          <button
            onClick={() => setIsKeyModalOpen(true)}
            className="bg-[#006C49] hover:bg-[#007D55] text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">key</span>
            + Prestar Llave
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E0E3E5] shadow-xs border-l-4 border-l-amber-500">
          <p className="text-[#45474C] text-[11px] font-bold uppercase tracking-wider mb-1">En Sala de Espera</p>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-amber-700">
            {waitingCount} <span className="text-xs font-sans text-slate-500 font-normal">personas esperando</span>
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E0E3E5] shadow-xs border-l-4 border-l-blue-600">
          <p className="text-[#45474C] text-[11px] font-bold uppercase tracking-wider mb-1">En Atención</p>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-blue-800">
            {inAttentionCount} <span className="text-xs font-sans text-slate-500 font-normal">con martillero</span>
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E0E3E5] shadow-xs border-l-4 border-l-[#091426]">
          <p className="text-[#45474C] text-[11px] font-bold uppercase tracking-wider mb-1">Llaves Prestadas</p>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-[#091426]">
            {borrowedKeysCount} <span className="text-xs font-sans text-slate-500 font-normal">en uso fuera de la agencia</span>
          </p>
        </div>
      </div>

      {/* Subnav Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-[#E0E3E5] shadow-2xs">
        <button
          onClick={() => setActiveSubTab('guardia')}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'guardia' ? 'bg-[#091426] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">menu_book</span>
          Visitas en Recepción ({receptionEntries.length})
        </button>

        <button
          onClick={() => setActiveSubTab('llaves')}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'llaves' ? 'bg-[#091426] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">vpn_key</span>
          Llaveros y Muestras ({keyCustodyList.length})
        </button>
      </div>

      {/* Subtab 1: Libro de Guardia */}
      {activeSubTab === 'guardia' && (
        <div className="bg-white rounded-xl border border-[#E0E3E5] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#E0E3E5] flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-[#091426]">Visitas del Día</h3>
              <p className="text-[11px] text-slate-500">Personas que ingresaron a la inmobiliaria.</p>
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="block md:hidden divide-y divide-[#E0E3E5]">
            {receptionEntries.map(entry => (
              <div key={entry.id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="font-bold text-sm text-[#091426]">{entry.visitorName}</h5>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F2F4F6] text-slate-700 mt-1 inline-block">
                      {entry.visitorType}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    entry.status === 'En Espera' ? 'bg-amber-100 text-amber-800' :
                    entry.status === 'En Atención' ? 'bg-blue-100 text-blue-800' :
                    'bg-emerald-100 text-[#006C49]'
                  }`}>
                    {entry.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {entry.reason}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Martillero: <strong className="text-[#091426]">{entry.assignedMartillero}</strong></span>
                  <span className="font-mono">{entry.timestamp}</span>
                </div>

                <div className="pt-2 flex gap-2">
                  {entry.status === 'En Espera' && (
                    <button
                      onClick={() => handleVisitorStatusChange(entry, 'En Atención')}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-2xs"
                    >
                      Llamar a Sala de Atención
                    </button>
                  )}
                  {entry.status === 'En Atención' && (
                    <button
                      onClick={() => handleVisitorStatusChange(entry, 'Completado')}
                      className="w-full py-2 bg-[#006C49] hover:bg-[#007D55] text-white font-bold text-xs rounded-lg shadow-2xs"
                    >
                      Marcar Atención Finalizada ✓
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F7F9FB] border-b border-[#E0E3E5] text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                  <th className="p-4">Visitante</th>
                  <th className="p-4">Tipo</th>
                  <th className="p-4">Motivo / Trámite</th>
                  <th className="p-4">Martillero Asignado</th>
                  <th className="p-4">Hora</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E3E5] text-xs">
                {receptionEntries.map(entry => (
                  <tr key={entry.id} className="hover:bg-[#F7F9FB] transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-sm text-[#091426]">{entry.visitorName}</p>
                      {entry.contactPhone && (
                        <p className="text-[11px] text-slate-400 font-mono">Tel: {entry.contactPhone}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#F2F4F6] text-slate-700">
                        {entry.visitorType}
                      </span>
                    </td>
                    <td className="p-4 max-w-xs text-slate-700">
                      {entry.reason}
                    </td>
                    <td className="p-4 font-semibold text-slate-800">
                      {entry.assignedMartillero}
                    </td>
                    <td className="p-4 font-mono text-slate-500 text-[11px]">
                      {entry.timestamp}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        entry.status === 'En Espera'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : entry.status === 'En Atención'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-emerald-100 text-[#006C49]'
                      }`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {entry.status === 'En Espera' && (
                          <button
                            onClick={() => handleVisitorStatusChange(entry, 'En Atención')}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded shadow-2xs"
                          >
                            Llamar
                          </button>
                        )}
                        {entry.status === 'En Atención' && (
                          <button
                            onClick={() => handleVisitorStatusChange(entry, 'Completado')}
                            className="px-2.5 py-1 bg-[#006C49] hover:bg-[#007D55] text-white font-bold text-xs rounded shadow-2xs"
                          >
                            Finalizar ✓
                          </button>
                        )}
                        {entry.status === 'Completado' && (
                          <span className="text-[11px] text-emerald-700 font-bold flex items-center justify-end gap-1">
                            <span className="material-symbols-outlined text-[14px]">done_all</span> Atendido
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 2: Custodia de Llaves */}
      {activeSubTab === 'llaves' && (
        <div className="bg-white rounded-xl border border-[#E0E3E5] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#E0E3E5] flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-[#091426]">Tablero de Llaves</h3>
              <p className="text-[11px] text-slate-500">Control de llaveros prestados para muestras y arreglos.</p>
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="block md:hidden divide-y divide-[#E0E3E5]">
            {keyCustodyList.map(key => {
              const isBorrowed = key.status.includes('Prestada');
              return (
                <div key={key.id} className={`p-4 space-y-2.5 ${isBorrowed ? 'bg-amber-50/20' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-[#091426] text-white px-2 py-0.5 rounded">
                        {key.keyTag}
                      </span>
                      <h5 className="font-bold text-xs text-[#091426]">{key.propertyTitle}</h5>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      isBorrowed
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-100 text-[#006C49]'
                    }`}>
                      {key.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">{key.propertyAddress}</p>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs space-y-1">
                    <p className="text-slate-700">
                      Retirada por: <strong className="text-[#091426]">{key.takenBy}</strong>
                    </p>
                    <p className="text-slate-500 text-[11px] font-mono">
                      Horario: {key.takenAt}
                      {key.returnedAt && ` • Devuelta: ${key.returnedAt}`}
                    </p>
                    {key.notes && (
                      <p className="text-slate-500 text-[11px] italic">Nota: {key.notes}</p>
                    )}
                  </div>

                  {isBorrowed && (
                    <button
                      onClick={() => handleReturnKey(key)}
                      className="w-full py-2 bg-[#006C49] hover:bg-[#007D55] text-white font-bold text-xs rounded-lg shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">check</span>
                      Registrar Devolución en Oficina
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F7F9FB] border-b border-[#E0E3E5] text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                  <th className="p-4">Código Llavero</th>
                  <th className="p-4">Propiedad &amp; Dirección</th>
                  <th className="p-4">Retirada Por</th>
                  <th className="p-4">Horario Retiro</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4">Observaciones</th>
                  <th className="p-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E3E5] text-xs">
                {keyCustodyList.map(key => {
                  const isBorrowed = key.status.includes('Prestada');
                  return (
                    <tr key={key.id} className={`hover:bg-[#F7F9FB] transition-colors ${isBorrowed ? 'bg-amber-50/20' : ''}`}>
                      <td className="p-4">
                        <span className="font-mono font-bold text-xs bg-[#091426] text-white px-2.5 py-1 rounded">
                          {key.keyTag}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-sm text-[#091426]">{key.propertyTitle}</p>
                        <p className="text-slate-500 text-[11px]">{key.propertyAddress}</p>
                      </td>
                      <td className="p-4 font-semibold text-slate-800">
                        {key.takenBy}
                      </td>
                      <td className="p-4 text-slate-600 font-mono">
                        {key.takenAt}
                        {key.returnedAt && (
                          <span className="block text-[10px] text-emerald-700">Devuelta: {key.returnedAt}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isBorrowed
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-100 text-[#006C49]'
                        }`}>
                          {key.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 text-[11px] max-w-xs truncate">
                        {key.notes || '-'}
                      </td>
                      <td className="p-4 text-right">
                        {isBorrowed ? (
                          <button
                            onClick={() => handleReturnKey(key)}
                            className="px-3 py-1.5 bg-[#006C49] hover:bg-[#007D55] text-white font-bold text-xs rounded-lg shadow-2xs"
                          >
                            Marcar Devolución
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-bold flex items-center justify-end gap-1">
                            <span className="material-symbols-outlined text-[15px]">check_circle</span> En Tablero
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Visitor Modal */}
      {isVisitorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091426]/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-xl p-5 sm:p-6 border border-[#E0E3E5] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[#E0E3E5]">
              <h3 className="font-bold text-base text-[#091426]">+ Registrar Ingreso en Recepción</h3>
              <button onClick={() => setIsVisitorModalOpen(false)} className="text-slate-400 font-bold p-1">✕</button>
            </div>

            <form onSubmit={handleCreateVisitor} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="Ej: Marcelo Fernández"
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Tipo de Visitante</label>
                  <select
                    value={visitorType}
                    onChange={(e: any) => setVisitorType(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg font-semibold"
                  >
                    <option value="Inquilino">Inquilino</option>
                    <option value="Propietario">Propietario</option>
                    <option value="Interesado Alquiler/Venta">Interesado (Espontáneo)</option>
                    <option value="Proveedor/Gremio">Proveedor / Gremio</option>
                    <option value="Cadetería">Cadetería / Trámites</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Teléfono Contacto</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Motivo del Ingreso *</label>
                <textarea
                  required
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ej: Vino a abonar el canon locativo y consultar sobre expensas"
                  className="w-full p-2.5 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Derivado a Martillero</label>
                <input
                  type="text"
                  value={assignedMartillero}
                  onChange={(e) => setAssignedMartillero(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg font-semibold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#E0E3E5]">
                <button
                  type="button"
                  onClick={() => setIsVisitorModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#091426] hover:bg-[#1E293B] text-white font-bold text-xs rounded-lg shadow-sm"
                >
                  Registrar en Sala de Espera
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Key Custody Modal */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091426]/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-xl p-5 sm:p-6 border border-[#E0E3E5] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[#E0E3E5]">
              <h3 className="font-bold text-base text-[#091426]">+ Préstamo / Salida de Llave</h3>
              <button onClick={() => setIsKeyModalOpen(false)} className="text-slate-400 font-bold p-1">✕</button>
            </div>

            <form onSubmit={handleCreateKeyCustody} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Código de Llavero / Casillero *</label>
                <input
                  type="text"
                  required
                  value={keyTag}
                  onChange={(e) => setKeyTag(e.target.value)}
                  placeholder="Ej: LLA-142 o Casillero B-2"
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Inmueble / Propiedad *</label>
                <input
                  type="text"
                  required
                  value={propertyTitle}
                  onChange={(e) => setPropertyTitle(e.target.value)}
                  placeholder="Ej: Depto 2 Ambientes Belgrano"
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Dirección Exacta</label>
                <input
                  type="text"
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  placeholder="Ej: Av. Rivadavia 450, Junín"
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Persona que Retira la Llave *</label>
                <input
                  type="text"
                  required
                  value={takenBy}
                  onChange={(e) => setTakenBy(e.target.value)}
                  placeholder="Ej: Carlos Gómez (Martillero) / Pintor Silva"
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Motivo / Observaciones</label>
                <input
                  type="text"
                  value={keyNotes}
                  onChange={(e) => setKeyNotes(e.target.value)}
                  placeholder="Ej: Visita agendada de 17:00 a 18:00 hs"
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#E0E3E5]">
                <button
                  type="button"
                  onClick={() => setIsKeyModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#006C49] hover:bg-[#007D55] text-white font-bold text-xs rounded-lg shadow-sm"
                >
                  Registrar Salida de Llave
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
