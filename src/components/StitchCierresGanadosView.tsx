import React from 'react';
import { Lead, ContractItem } from '../types';

interface Props {
  leads: Lead[];
  contracts: ContractItem[];
  onCreateContractFromWon: (lead: Lead) => void;
  onGoToTenantPortal: (tenantName: string) => void;
  onDeleteLeadPermanent: (id: string) => void;
}

export const StitchCierresGanadosView: React.FC<Props> = ({
  leads,
  contracts,
  onCreateContractFromWon,
  onGoToTenantPortal,
  onDeleteLeadPermanent,
}) => {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-8 space-y-6">
      
      {/* Header Banner & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-[#E0E3E5] shadow-xs border-l-4 border-l-[#006C49]">
          <p className="text-[#45474C] text-[11px] font-bold uppercase tracking-wider mb-1">Total Operaciones Ganadas</p>
          <p className="text-3xl font-bold font-mono text-[#006C49]">{leads.length}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#E0E3E5] shadow-xs">
          <p className="text-[#45474C] text-[11px] font-bold uppercase tracking-wider mb-1">Inquilinos con Contrato Activo</p>
          <p className="text-3xl font-bold font-mono text-[#091426]">{contracts.length}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#E0E3E5] shadow-xs">
          <p className="text-[#45474C] text-[11px] font-bold uppercase tracking-wider mb-1">Efectividad de Cierre</p>
          <p className="text-3xl font-bold font-mono text-[#006C49]">100%</p>
        </div>
      </div>

      {/* Main Table / Cards */}
      <div className="bg-white rounded-xl border border-[#E0E3E5] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E0E3E5] flex justify-between items-center bg-white">
          <div>
            <h3 className="font-bold text-base text-[#091426]">Operaciones &amp; Clientes Ganados</h3>
            <p className="text-xs text-slate-500">Prospectos que cerraron contrato de locación o venta.</p>
          </div>
        </div>

        {leads.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <span className="material-symbols-outlined text-4xl text-slate-300">handshake</span>
            <p className="text-xs">No hay operaciones ganadas aún. Avanza un prospecto desde <strong>Visitas Agendadas</strong> dando clic en <strong>Concretar Reserva</strong>.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E0E3E5]">
            {leads.map((lead) => {
              const contract = contracts.find(c => 
                c.tenantName.toLowerCase() === lead.name.toLowerCase() ||
                c.tenantPhone === lead.phone
              );

              return (
                <div key={lead.id} className="p-5 hover:bg-[#F7F9FB] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-emerald-100 text-[#006C49] flex items-center justify-center font-bold text-sm shrink-0">
                      {lead.initials || lead.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#091426]">{lead.name}</h4>
                        <span className="bg-emerald-100 text-[#006C49] text-[10px] font-bold px-2 py-0.5 rounded-full">
                          ✓ Ganado
                        </span>
                        {contract ? (
                          <span className="bg-[#D8E3FB] text-[#091426] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px] text-[#006C49]">verified</span>
                            Inquilino Activo
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Pendiente de Contrato
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{lead.propertyTitle} • {lead.propertyAddress}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{lead.phone} • {lead.propertyPrice}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    {contract ? (
                      <button
                        onClick={() => onGoToTenantPortal(lead.name)}
                        className="px-4 py-2 bg-[#091426] hover:bg-[#1E293B] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
                      >
                        <span className="material-symbols-outlined text-[16px] text-[#6FFBBE]">group</span>
                        Ver Portal Inquilino
                      </button>
                    ) : (
                      <button
                        onClick={() => onCreateContractFromWon(lead)}
                        className="px-4 py-2 bg-[#006C49] hover:bg-[#007D55] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all animate-pulse"
                      >
                        <span className="material-symbols-outlined text-[16px]">description</span>
                        Dar de Alta Contrato / Inquilino
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteLeadPermanent(lead.id)}
                      className="p-2 text-slate-400 hover:text-[#BA1A1A] hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar de SQLite"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
