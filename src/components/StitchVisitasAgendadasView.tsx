import React from 'react';
import { Lead } from '../types';

interface Props {
  leads: Lead[];
  onOpenWhatsAppGPS: (lead: Lead) => void;
  onConcretarReserva: (lead: Lead) => void;
  selectedDay: 'hoy' | 'manana' | 'sabado' | 'mes';
  onSelectDay: (day: 'hoy' | 'manana' | 'sabado' | 'mes') => void;
}

export const StitchVisitasAgendadasView: React.FC<Props> = ({
  leads,
  onOpenWhatsAppGPS,
  onConcretarReserva,
  selectedDay,
  onSelectDay,
}) => {
  return (
    <div className="flex-1 flex overflow-hidden">
      
      {/* Timeline List Left Area (60%) */}
      <div className="w-full lg:w-[60%] flex flex-col border-r border-[#E0E3E5] bg-white">
        
        {/* Day Chips Toolbar */}
        <div className="p-4 border-b border-[#E0E3E5] flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            {(['hoy', 'manana', 'sabado', 'mes'] as const).map((d) => (
              <button
                key={d}
                onClick={() => onSelectDay(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  selectedDay === d
                    ? 'bg-[#091426] text-white shadow-xs'
                    : 'bg-[#F2F4F6] text-[#45474C] hover:bg-[#E0E3E5]'
                }`}
              >
                {d === 'hoy' ? 'Hoy (4)' : d === 'manana' ? 'Mañana (2)' : d === 'sabado' ? 'Sábado (6)' : 'Ver Mes'}
              </button>
            ))}
          </div>

          <button className="bg-[#006C49] hover:bg-[#007D55] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs">
            <span className="material-symbols-outlined text-[16px]">add</span>
            + Agendar Visita
          </button>
        </div>

        {/* Timeline Cards */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F7F9FB]">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white rounded-xl p-5 border border-[#E0E3E5] shadow-xs hover:shadow-md transition-all relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#006C49]"></div>

              <div className="pl-2">
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-emerald-100 text-[#006C49] font-mono font-bold text-xs px-2.5 py-0.5 rounded-md">
                    ⏰ {lead.visitTime || 'Hoy 16:30 hs'}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    Martillero: {lead.martilleroName}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#091426]">
                  {lead.propertyTitle} ({lead.propertyPrice})
                </h3>
                <p className="text-xs text-[#45474C] mt-0.5">
                  Interesado: <strong className="text-[#091426]">{lead.name}</strong> • {lead.phone}
                </p>

                <div className="bg-[#F7F9FB] p-2.5 rounded-lg border border-[#E0E3E5] my-3 flex items-center justify-between text-xs">
                  <span className="text-slate-600">📍 {lead.propertyAddress}</span>
                  <span className="font-mono font-bold text-[#091426] bg-white px-2 py-0.5 rounded border border-[#CBD5E1]">
                    Lockbox: {lead.lockboxCode}
                  </span>
                </div>

                <div className="flex gap-2 pt-2 border-t border-[#E0E3E5]">
                  <button
                    onClick={() => onOpenWhatsAppGPS(lead)}
                    className="flex-1 bg-white hover:bg-[#F7F9FB] text-[#006C49] border border-[#006C49]/30 text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">near_me</span>
                    Enviar Ubicación GPS
                  </button>
                  <button
                    onClick={() => onConcretarReserva(lead)}
                    className="flex-1 bg-[#006C49] hover:bg-[#007D55] text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    Concretar Reserva
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Logistics & Property Details Right Drawer (40%) */}
      <div className="hidden lg:flex flex-col w-[40%] bg-white border-l border-[#E0E3E5] p-6 space-y-6 overflow-y-auto">
        <h3 className="font-bold text-base text-[#091426] border-b border-[#E0E3E5] pb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#006C49]">key</span>
          Logística &amp; Llaves para la Visita
        </h3>

        <div className="bg-[#F7F9FB] rounded-xl p-4 border border-[#E0E3E5] space-y-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ficha de Inmueble</p>
          <img
            src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600"
            alt="Property"
            className="w-full h-36 rounded-lg object-cover"
          />
          <h4 className="font-bold text-sm text-[#091426]">Depto 2 Ambientes Belgrano</h4>
          <p className="text-xs text-slate-600">Av. Rivadavia 450, Junín (Piso 4, Depto B)</p>
        </div>

        <div className="space-y-2 text-xs">
          <p className="font-bold text-slate-500 uppercase text-[10px]">Checklist del Martillero:</p>
          <label className="flex items-center gap-2 p-2 bg-[#F7F9FB] rounded-lg border border-[#E0E3E5]">
            <input type="checkbox" defaultChecked className="rounded text-[#006C49]" />
            <span>Ficha técnica de la propiedad impresa</span>
          </label>
          <label className="flex items-center gap-2 p-2 bg-[#F7F9FB] rounded-lg border border-[#E0E3E5]">
            <input type="checkbox" defaultChecked className="rounded text-[#006C49]" />
            <span>Formulario de seña y reserva disponible</span>
          </label>
          <label className="flex items-center gap-2 p-2 bg-[#F7F9FB] rounded-lg border border-[#E0E3E5]">
            <input type="checkbox" className="rounded text-[#006C49]" />
            <span>Llaves retiradas de lockbox o administración</span>
          </label>
        </div>
      </div>

    </div>
  );
};
