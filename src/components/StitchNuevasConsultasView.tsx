import React from 'react';
import { Lead } from '../types';

interface Props {
  leads: Lead[];
  selectedLead: Lead;
  onSelectLead: (lead: Lead) => void;
  onOpenWhatsApp: (lead: Lead) => void;
  onScheduleVisit: (lead: Lead) => void;
  onDiscardLead: (leadId: string) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  channelFilter: string;
  onChannelFilterChange: (val: string) => void;
  urgentOnly: boolean;
  onToggleUrgentOnly: () => void;
  urgentCount: number;
}

export const StitchNuevasConsultasView: React.FC<Props> = ({
  leads,
  selectedLead,
  onSelectLead,
  onOpenWhatsApp,
  onScheduleVisit,
  onDiscardLead,
  searchTerm,
  onSearchChange,
  channelFilter,
  onChannelFilterChange,
  urgentOnly,
  onToggleUrgentOnly,
  urgentCount,
}) => {
  return (
    <div className="flex-1 flex overflow-hidden">
      
      {/* Left Column: Inbox List */}
      <div className="w-full lg:w-[60%] flex flex-col border-r border-[#E0E3E5] bg-white z-10 shadow-[4px_0_15px_-3px_rgba(0,0,0,0.02)]">
        
        {/* Filter Bar */}
        <div className="p-4 border-b border-[#E0E3E5] flex items-center gap-3 bg-white sticky top-0 z-20">
          <div className="relative flex-1 min-w-[200px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#45474C] text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar lead, propiedad o teléfono..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg text-xs text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-[#091426] transition-all"
            />
          </div>

          <button
            onClick={() => onChannelFilterChange(channelFilter === 'all' ? 'WhatsApp' : 'all')}
            className="flex items-center gap-1.5 px-3 py-2 border border-[#75777D]/30 rounded-lg text-xs font-semibold hover:bg-[#F7F9FB] transition-colors whitespace-nowrap bg-white text-[#191C1E]"
          >
            <span className="material-symbols-outlined text-[16px]">filter_list</span>
            Canal: {channelFilter === 'all' ? 'Todos' : channelFilter}
          </button>

          <button
            onClick={onToggleUrgentOnly}
            className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              urgentOnly
                ? 'bg-[#FFDAD6] text-[#BA1A1A] border-[#FFDAD6]'
                : 'border-[#FFDAD6] text-[#BA1A1A] bg-[#FFDAD6]/20 hover:bg-[#FFDAD6]/40'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">priority_high</span>
            Solo Urgentes ({urgentCount})
          </button>
        </div>

        {/* Scrollable Action Cards List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F7F9FB]">
          {leads.map((lead) => {
            const isSelected = selectedLead.id === lead.id;
            const isUrgent48 = lead.urgencyLevel === 'urgent_48h';
            const isUrgent24 = lead.urgencyLevel === 'urgent_24h';

            return (
              <div
                key={lead.id}
                onClick={() => onSelectLead(lead)}
                className={`bg-white rounded-xl p-5 shadow-xs border transition-all cursor-pointer relative overflow-hidden group ${
                  isSelected
                    ? 'ring-2 ring-[#091426] border-transparent shadow-md'
                    : 'border-[#E0E3E5] hover:shadow-md'
                }`}
              >
                {/* Left Urgency Edge Indicator */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    isUrgent48 ? 'bg-[#BA1A1A]' : isUrgent24 ? 'bg-[#BA1A1A]/70' : 'bg-[#006C49]'
                  }`}
                />

                {/* Card Top Metadata */}
                <div className="flex justify-between items-start mb-2 pl-2">
                  <div className="flex items-center gap-2">
                    {isUrgent48 ? (
                      <span className="bg-[#FFDAD6] text-[#BA1A1A] px-2 py-0.5 rounded font-bold text-[10px] tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">warning</span> URGENTE &gt; 48H
                      </span>
                    ) : isUrgent24 ? (
                      <span className="bg-[#FFDAD6]/60 text-[#BA1A1A] px-2 py-0.5 rounded font-bold text-[10px] tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">schedule</span> URGENTE &gt; 24H
                      </span>
                    ) : (
                      <span className="bg-[#006C49]/10 text-[#006C49] px-2 py-0.5 rounded font-bold text-[10px] tracking-wider">
                        NUEVO
                      </span>
                    )}

                    <span className="text-[#45474C] text-xs flex items-center gap-1 font-medium">
                      <span className="material-symbols-outlined text-[14px]">{lead.channelIcon}</span>
                      {lead.channel}
                    </span>
                  </div>
                  <span className="text-[#45474C] text-xs font-mono">{lead.timeAgo}</span>
                </div>

                {/* Lead Identity and Property */}
                <div className="pl-2">
                  <h3 className="text-lg font-bold text-[#091426] mb-1 group-hover:text-[#006C49] transition-colors">
                    {lead.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-3 text-[#45474C] text-xs">
                    <span className="material-symbols-outlined text-[16px]">home</span>
                    <span>{lead.propertyTitle} ({lead.propertyPrice})</span>
                  </div>

                  {/* AI Insight Box */}
                  <div className="bg-[#F2F4F6] rounded-lg p-3 mb-3 flex items-start gap-2.5 border border-[#E0E3E5]/60">
                    <span
                      className="material-symbols-outlined text-[#006C49] text-[20px] shrink-0 mt-0.5"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      psychology
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-[#45474C] uppercase tracking-wider mb-0.5">
                        Análisis de IA: {lead.aiIntentLevel} ({lead.aiScore}%)
                      </p>
                      <p className="text-xs text-[#191C1E] italic line-clamp-2">
                        "{lead.lastMessage}"
                      </p>
                    </div>
                  </div>

                  {/* Direct Action Buttons */}
                  <div className="flex gap-2 mt-3 pt-2 border-t border-[#E0E3E5]/60">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenWhatsApp(lead);
                      }}
                      className="flex-1 bg-[#091426] hover:bg-[#1E293B] text-white text-xs font-semibold py-2 rounded-lg transition-colors shadow-xs"
                    >
                      Responder WhatsApp
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onScheduleVisit(lead);
                      }}
                      className="bg-white text-[#091426] border border-[#75777D]/30 text-xs font-semibold px-3.5 py-2 rounded-lg hover:bg-[#F7F9FB] transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">event</span>
                      Agendar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDiscardLead(lead.id);
                      }}
                      className="text-[#45474C] hover:text-[#BA1A1A] hover:bg-[#FFDAD6]/30 p-2 rounded-lg transition-colors"
                      title="Descartar"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Right Column: Context Panel Preview (Exact Stitch Right Side) */}
      <div className="hidden lg:flex flex-col w-[40%] bg-white border-l border-[#E0E3E5] h-full relative">
        
        {/* Header of Context Panel */}
        <div className="p-4 border-b border-[#E0E3E5] flex justify-between items-center bg-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#091426] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {selectedLead.initials}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#091426] leading-tight">{selectedLead.name}</h2>
              <p className="text-xs text-[#45474C] flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#006C49] inline-block"></span>
                En línea • {selectedLead.phone}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onOpenWhatsApp(selectedLead)}
              className="w-8 h-8 rounded hover:bg-[#F7F9FB] flex items-center justify-center text-[#45474C] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">phone</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-white">
          
          {/* Property Interest Snippet Card */}
          <div className="bg-[#F7F9FB] rounded-xl p-4 border border-[#E0E3E5] shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#45474C] mb-3">
              Propiedad de Interés
            </p>
            <div className="flex gap-3.5">
              <img
                src={selectedLead.propertyImage}
                alt={selectedLead.propertyTitle}
                className="w-24 h-24 rounded-lg object-cover shadow-xs shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-[#091426] truncate">{selectedLead.propertyTitle}</h4>
                <p className="text-sm font-bold text-[#006C49] font-mono mt-0.5">{selectedLead.propertyPrice}</p>
                <div className="flex gap-3 text-[#45474C] text-xs my-2">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">bed</span> {selectedLead.bedrooms} Dorm.
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">bathtub</span> {selectedLead.bathrooms} Baño
                  </span>
                </div>
                <span className="text-[#091426] text-xs font-semibold hover:underline cursor-pointer block">
                  Ver ficha completa →
                </span>
              </div>
            </div>
          </div>

          {/* Logistics & Keys info */}
          <div className="bg-white rounded-xl p-3.5 border border-[#E0E3E5] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">📍 Ubicación:</span>
              <span className="font-bold text-[#091426]">{selectedLead.propertyAddress}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">🔑 Lockbox / Llaves:</span>
              <span className="font-mono font-bold bg-[#F2F4F6] px-2 py-0.5 rounded border border-[#CBD5E1]">
                {selectedLead.lockboxCode}
              </span>
            </div>
          </div>

          {/* Conversation History */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#45474C] text-center mb-3">
              Registro de Mensajes Recientes
            </p>
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#E0E3E5] flex items-center justify-center text-xs font-bold text-[#191C1E] shrink-0">
                {selectedLead.initials}
              </div>
              <div className="bg-[#F7F9FB] rounded-2xl rounded-tl-none p-3 max-w-[85%] border border-[#E0E3E5]">
                <p className="text-xs text-[#191C1E] leading-relaxed">
                  {selectedLead.lastMessage}
                </p>
                <p className="text-[10px] text-[#45474C] text-right mt-1 font-mono">
                  {selectedLead.timeAgo} • Vía {selectedLead.channel}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* AI Quick Reply & Sender Footer */}
        <div className="p-4 border-t border-[#E0E3E5] bg-white space-y-3">
          <div>
            <p className="text-[11px] font-bold text-[#006C49] flex items-center gap-1 mb-2">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                psychology
              </span>
              Respuestas sugeridas por IA:
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => onOpenWhatsApp(selectedLead)}
                className="whitespace-nowrap px-3 py-1.5 bg-[#D8E3FB]/40 hover:bg-[#D8E3FB] text-[#091426] rounded-full text-xs font-semibold transition-all border border-[#091426]/10"
              >
                Agendar visita mañana
              </button>
              <button
                onClick={() => onOpenWhatsApp(selectedLead)}
                className="whitespace-nowrap px-3 py-1.5 bg-[#F7F9FB] hover:bg-[#E0E3E5] text-[#191C1E] rounded-full text-xs font-semibold transition-all border border-[#75777D]/30"
              >
                Pedir foto de garantía
              </button>
            </div>
          </div>

          <button
            onClick={() => onOpenWhatsApp(selectedLead)}
            className="w-full py-2.5 bg-[#091426] hover:bg-[#1E293B] text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            Abrir WhatsApp con Respuesta IA
          </button>
        </div>

      </div>

    </div>
  );
};
