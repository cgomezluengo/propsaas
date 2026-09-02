import React from 'react';
import { Lead } from '../types';

interface Props {
  leads: Lead[];
  onOpenWhatsApp: (lead: Lead) => void;
  onScheduleVisit: (lead: Lead) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export const StitchEnSeguimientoView: React.FC<Props> = ({
  leads,
  onOpenWhatsApp,
  onScheduleVisit,
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-8 space-y-6">
      
      {/* KPI Ribbon (Screen 2 Stitch) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-[#E0E3E5] shadow-xs">
          <p className="text-[#45474C] text-[11px] font-bold uppercase tracking-wider mb-1">
            Diálogo Activo
          </p>
          <p className="text-3xl font-bold font-mono text-[#091426]">{leads.length}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E3E5] shadow-xs">
          <p className="text-[#45474C] text-[11px] font-bold uppercase tracking-wider mb-1">
            Garantía en Revisión
          </p>
          <p className="text-3xl font-bold font-mono text-[#091426]">8</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E3E5] shadow-xs relative overflow-hidden">
          <div className="absolute inset-0 bg-[#006C49]/5"></div>
          <p className="text-[#006C49] text-[11px] font-bold uppercase tracking-wider mb-1">
            Coordinar Visita Hoy
          </p>
          <p className="text-3xl font-bold font-mono text-[#006C49]">5</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-[#E0E3E5] shadow-xs">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#45474C] text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar por nombre, propiedad o teléfono..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F7F9FB] rounded-lg border border-[#75777D]/30 text-xs text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-[#091426]"
          />
        </div>
      </div>

      {/* Prospect Cards List */}
      <div className="space-y-4">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="bg-white rounded-xl p-5 border border-[#E0E3E5] shadow-xs hover:shadow-md transition-all flex flex-col gap-4"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#091426]/10 text-[#091426] flex items-center justify-center font-bold text-base">
                  {lead.initials}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#191C1E] flex items-center gap-2">
                    {lead.name}
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                      {lead.channel}
                    </span>
                  </h3>
                  <p className="text-xs text-[#45474C] font-semibold mt-0.5">
                    {lead.propertyTitle} ({lead.propertyPrice})
                  </p>
                </div>
              </div>
              <span className="text-xs text-[#45474C] font-mono">{lead.timeAgo}</span>
            </div>

            <div className="bg-[#F7F9FB] p-3.5 rounded-lg border border-[#E0E3E5] border-l-4 border-l-[#091426]/30 text-xs text-[#45474C] italic">
              "{lead.lastMessage}"
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E0E3E5]/60">
              <span className="text-xs text-slate-500">
                Garantía: <strong className="text-[#091426]">{lead.guaranteeStatus}</strong>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => onOpenWhatsApp(lead)}
                  className="bg-white border border-[#75777D]/30 text-[#091426] text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#F7F9FB] transition-colors"
                >
                  Abrir Chat
                </button>
                <button
                  onClick={() => onScheduleVisit(lead)}
                  className="bg-[#006C49] hover:bg-[#007D55] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-xs"
                >
                  Agendar Visita
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
