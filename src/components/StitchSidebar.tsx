import React from 'react';
import { CRMViewTab, AgencyTenant, UserProfile } from '../types';

interface Props {
  activeTab: CRMViewTab;
  onSelectTab: (tab: CRMViewTab) => void;
  tenant: AgencyTenant;
  user: UserProfile;
  urgentCount: number;
  activeCount: number;
  visitsCount: number;
  wonCount?: number;
  onOpenNewLeadModal: () => void;
}

export const StitchSidebar: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  tenant,
  user,
  urgentCount,
  activeCount,
  visitsCount,
  wonCount = 0,
  onOpenNewLeadModal,
}) => {
  return (
    <nav className="fixed left-0 top-0 h-full w-[280px] bg-[#091426] text-white flex flex-col justify-between py-4 px-3 md:block hidden z-50 shadow-xl border-r border-[#1E293B]">
      
      {/* 1. Brand Header */}
      <div className="space-y-4">
        <div className="px-3 py-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#006C49] flex items-center justify-center text-white shadow-sm">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              domain
            </span>
          </div>
          <div>
            <h1 className="text-[19px] leading-tight text-white font-bold tracking-tight">
              PropSaaS
            </h1>
            <p className="text-[11px] text-[#8590A6] font-medium">Estate Logic Admin</p>
          </div>
        </div>

        {/* 2. Tenant Agency Switcher */}
        <div className="px-1">
          <div className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-left">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-6 h-6 rounded bg-white text-[#091426] flex items-center justify-center font-bold text-xs shrink-0">
                {tenant.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white truncate block">{tenant.name}</span>
                <span className="text-[10px] text-[#6FFBBE] truncate block">{tenant.city}</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#8590A6] text-sm">unfold_more</span>
          </div>
        </div>

        {/* 3. Primary CTA: Nueva Propiedad / Cargar Consulta */}
        <div className="px-1">
          <button
            onClick={onOpenNewLeadModal}
            className="w-full bg-[#006C49] hover:bg-[#007D55] text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
            + Cargar Consulta
          </button>
        </div>

        {/* 4. Navigation Links Grouped by Stitch Sections */}
        <div className="overflow-y-auto max-h-[calc(100vh-280px)] px-1 space-y-5">
          
          {/* Section: Resumen General */}
          <div>
            <p className="px-3 mb-1.5 text-[10px] font-bold text-[#8590A6] uppercase tracking-wider">
              Resumen General
            </p>
            <button
              onClick={() => onSelectTab('nuevas_consultas')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all text-left ${
                activeTab === 'nuevas_consultas'
                  ? 'text-white font-semibold'
                  : 'text-[#8590A6] hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              <span>Dashboard &amp; KPIs</span>
            </button>
          </div>

          {/* Section: Bandeja CRM (Separated State Menus) */}
          <div>
            <p className="px-3 mb-1.5 text-[10px] font-bold text-[#8590A6] uppercase tracking-wider">
              Bandeja CRM
            </p>

            <div className="space-y-1">
              {/* 1. Nuevas Consultas */}
              <button
                onClick={() => onSelectTab('nuevas_consultas')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all text-left ${
                  activeTab === 'nuevas_consultas'
                    ? 'text-[#6FFBBE] font-bold border-r-4 border-[#6FFBBE] bg-white/10'
                    : 'text-[#8590A6] hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: activeTab === 'nuevas_consultas' ? "'FILL' 1" : "'FILL' 0" }}>
                    inbox
                  </span>
                  <span>1. Nuevas Consultas</span>
                </div>
                {urgentCount > 0 ? (
                  <span className="bg-[#BA1A1A] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                    {urgentCount} urg. &gt;24h
                  </span>
                ) : (
                  <span className="bg-white/10 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                    0
                  </span>
                )}
              </button>

              {/* 2. En Seguimiento */}
              <button
                onClick={() => onSelectTab('en_seguimiento')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all text-left ${
                  activeTab === 'en_seguimiento'
                    ? 'text-[#6FFBBE] font-bold border-r-4 border-[#6FFBBE] bg-white/10'
                    : 'text-[#8590A6] hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: activeTab === 'en_seguimiento' ? "'FILL' 1" : "'FILL' 0" }}>
                    mark_chat_read
                  </span>
                  <span>2. En Conversación</span>
                </div>
                <span className="bg-[#006C49] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {activeCount} activos
                </span>
              </button>

              {/* 3. Visitas Agendadas */}
              <button
                onClick={() => onSelectTab('visitas_agendadas')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all text-left ${
                  activeTab === 'visitas_agendadas'
                    ? 'text-[#6FFBBE] font-bold border-r-4 border-[#6FFBBE] bg-white/10'
                    : 'text-[#8590A6] hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: activeTab === 'visitas_agendadas' ? "'FILL' 1" : "'FILL' 0" }}>
                    calendar_today
                  </span>
                  <span>3. Visitas Agendadas</span>
                </div>
                <span className="bg-white/10 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {visitsCount} hoy
                </span>
              </button>

              {/* 4. Cierres Ganados */}
              <button
                onClick={() => onSelectTab('cierres_ganados')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all text-left ${
                  activeTab === 'cierres_ganados'
                    ? 'text-[#6FFBBE] font-bold border-r-4 border-[#6FFBBE] bg-white/10'
                    : 'text-[#8590A6] hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px]">handshake</span>
                  <span>4. Clientes Ganados</span>
                </div>
                {wonCount > 0 && (
                  <span className="bg-[#006C49] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {wonCount}
                  </span>
                )}
              </button>

              {/* 5. Descartados */}
              <button
                onClick={() => onSelectTab('descartados')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all text-left ${
                  activeTab === 'descartados'
                    ? 'text-[#6FFBBE] font-bold border-r-4 border-[#6FFBBE] bg-white/10'
                    : 'text-[#8590A6] hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px]">cancel</span>
                  <span>5. Descartados</span>
                </div>
              </button>
            </div>
          </div>

          {/* Section: Gestión Inmobiliaria */}
          <div>
            <p className="px-3 mb-1.5 text-[10px] font-bold text-[#8590A6] uppercase tracking-wider">
              Gestión
            </p>
            <div className="space-y-1">
              <button
                onClick={() => onSelectTab('propiedades')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all text-left ${
                  activeTab === 'propiedades'
                    ? 'text-[#6FFBBE] font-bold border-r-4 border-[#6FFBBE] bg-white/10'
                    : 'text-[#8590A6] hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">domain</span>
                <span>Propiedades</span>
              </button>

              <button
                onClick={() => onSelectTab('contratos')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all text-left ${
                  activeTab === 'contratos'
                    ? 'text-[#6FFBBE] font-bold border-r-4 border-[#6FFBBE] bg-white/10'
                    : 'text-[#8590A6] hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">description</span>
                <span>Contratos ICL/IPC</span>
              </button>

              <button
                onClick={() => onSelectTab('inquilinos')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all text-left ${
                  activeTab === 'inquilinos'
                    ? 'text-[#6FFBBE] font-bold border-r-4 border-[#6FFBBE] bg-white/10'
                    : 'text-[#8590A6] hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">group</span>
                <span>Inquilinos</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 5. User Profile Pill at Bottom */}
      <div className="pt-3 border-t border-white/10 px-2 mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border border-white/20 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-[#8590A6] truncate">{user.role}</p>
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-[#006C49] ring-2 ring-emerald-900 shrink-0"></span>
        </div>
      </div>

    </nav>
  );
};
