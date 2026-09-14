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
  incidentCount?: number;
  onOpenNewLeadModal: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
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
  incidentCount = 0,
  onOpenNewLeadModal,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const handleNavClick = (tab: CRMViewTab) => {
    onSelectTab(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-[#091426]/80 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => {
            if (onCloseMobile) onCloseMobile();
          }}
          aria-label="Cerrar menú"
        />
      )}

      {/* Navigation Drawer / Fixed Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-[100dvh] w-[290px] bg-[#091426] text-white flex flex-col justify-between py-4 px-3 z-50 shadow-2xl border-r border-[#1E293B] transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Section: Brand + Switcher + Primary CTA */}
        <div className="shrink-0 space-y-3">
          <div className="px-2 py-1 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#006C49] flex items-center justify-center text-white shadow-sm">
                <span className="material-symbols-outlined text-lg">domain</span>
              </div>
              <div>
                <h1 className="text-[17px] leading-tight text-white font-bold tracking-tight">
                  PropSaaS
                </h1>
                <p className="text-[10px] text-[#8590A6] font-medium">Gestión Inmobiliaria</p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 active:scale-95"
              title="Cerrar menú"
              aria-label="Cerrar menú"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          {/* Tenant Agency Switcher */}
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

          {/* Primary CTA: + Cargar Consulta */}
          <div className="px-1">
            <button
              onClick={() => {
                onOpenNewLeadModal();
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full bg-[#006C49] hover:bg-[#007D55] text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              + Cargar Consulta
            </button>
          </div>
        </div>

        {/* Navigation Links (Scrollable with touch momentum) */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-1 space-y-4 my-2 pr-1">
          {/* Section: Comercial */}
          <div>
            <p className="px-3 mb-1 text-[10px] font-bold text-[#8590A6] uppercase tracking-wider">
              Bandeja de Consultas
            </p>

            <div className="space-y-0.5">
              <button
                onClick={() => handleNavClick('nuevas_consultas')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all text-left ${
                  activeTab === 'nuevas_consultas'
                    ? 'text-[#6FFBBE] font-bold border-r-4 border-[#6FFBBE] bg-white/10'
                    : 'text-[#8590A6] hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px]">inbox</span>
                  <span>1. Nuevas Consultas</span>
                </div>
                {urgentCount > 0 && (
                  <span className="bg-[#BA1A1A] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                    {urgentCount} urgentes
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('en_seguimiento')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all text-left ${
                  activeTab === 'en_seguimiento'
                    ? 'text-[#6FFBBE] font-bold border-r-4 border-[#6FFBBE] bg-white/10'
                    : 'text-[#8590A6] hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px]">mark_chat_read</span>
                  <span>2. En Conversación</span>
                </div>
                <span className="bg-[#006C49] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {activeCount}
                </span>
              </button>

              <button
                onClick={() => handleNavClick('visitas_agendadas')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all text-left ${
                  activeTab === 'visitas_agendadas'
                    ? 'text-[#6FFBBE] font-bold border-r-4 border-[#6FFBBE] bg-white/10'
                    : 'text-[#8590A6] hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  <span>3. Visitas Agendadas</span>
                </div>
                <span className="bg-white/10 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {visitsCount}
                </span>
              </button>

              <button
                onClick={() => handleNavClick('cierres_ganados')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all text-left ${
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
                  <span className="bg-[#006C49] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {wonCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('descartados')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all text-left ${
                  activeTab === 'descartados'
                    ? 'text-[#6FFBBE] font-bold border-r-4 border-[#6FFBBE] bg-white/10'
                    : 'text-[#8590A6] hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px]">archive</span>
                  <span>5. Archivados</span>
                </div>
              </button>
            </div>
          </div>

          {/* Section: Administración y Sucursal */}
          <div>
            <p className="px-3 mb-1 text-[10px] font-bold text-[#8590A6] uppercase tracking-wider">
              Administración de Alquileres
            </p>

            <div className="space-y-0.5">
              {/* Contratos e IPC 4M */}
              <button
                onClick={() => handleNavClick('contratos')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all text-left ${
                  activeTab === 'contratos'
                    ? 'text-[#6FFBBE] font-bold border-r-4 border-[#6FFBBE] bg-white/10'
                    : 'text-[#8590A6] hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px]">trending_up</span>
                  <span>Aumentos IPC (4 meses)</span>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded font-bold">
                  Control
                </span>
              </button>

              {/* Problemas Típicos e Incidencias */}
              <button
                onClick={() => handleNavClick('problemas_tipicos')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all text-left ${
                  activeTab === 'problemas_tipicos'
                    ? 'text-[#6FFBBE] font-bold border-r-4 border-[#6FFBBE] bg-white/10'
                    : 'text-[#8590A6] hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px]">build</span>
                  <span>Problemas y Arreglos</span>
                </div>
                {incidentCount > 0 && (
                  <span className="bg-red-500/30 text-red-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {incidentCount}
                  </span>
                )}
              </button>

              {/* Recepción & Llaves */}
              <button
                onClick={() => handleNavClick('recepcion')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all text-left ${
                  activeTab === 'recepcion'
                    ? 'text-[#6FFBBE] font-bold border-r-4 border-[#6FFBBE] bg-white/10'
                    : 'text-[#8590A6] hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px]">concierge</span>
                  <span>Recepción y Llaves</span>
                </div>
                <span className="bg-blue-500/20 text-blue-300 text-[10px] px-1.5 py-0.5 rounded font-bold">
                  Guardia
                </span>
              </button>

              {/* Publicidad & Portales */}
              <button
                onClick={() => handleNavClick('publicidad')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all text-left ${
                  activeTab === 'publicidad'
                    ? 'text-[#6FFBBE] font-bold border-r-4 border-[#6FFBBE] bg-white/10'
                    : 'text-[#8590A6] hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px]">campaign</span>
                  <span>Publicidad y Avisos</span>
                </div>
              </button>

              {/* Propiedades */}
              <button
                onClick={() => handleNavClick('propiedades')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs transition-all text-left ${
                  activeTab === 'propiedades'
                    ? 'text-[#6FFBBE] font-bold border-r-4 border-[#6FFBBE] bg-white/10'
                    : 'text-[#8590A6] hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">apartment</span>
                <span>Propiedades</span>
              </button>

              {/* Inquilinos */}
              <button
                onClick={() => handleNavClick('inquilinos')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs transition-all text-left ${
                  activeTab === 'inquilinos'
                    ? 'text-[#6FFBBE] font-bold border-r-4 border-[#6FFBBE] bg-white/10'
                    : 'text-[#8590A6] hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">badge</span>
                <span>Padrón de Inquilinos</span>
              </button>
            </div>
          </div>
        </div>

        {/* User Profile Pill at Bottom */}
        <div className="pt-3 border-t border-white/10 px-2 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-[#8590A6] truncate">{user.role}</p>
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-[#006C49] ring-2 ring-emerald-900 shrink-0" title="En línea"></span>
          </div>
        </div>
      </aside>
    </>
  );
};
