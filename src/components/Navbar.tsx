import React, { useState } from 'react';
import { 
  Building2, Moon, Sun, Globe, Bell, FileCode, Users, 
  Menu, X, ChevronDown, Check, Shield, Home, Smartphone, 
  TrendingUp, Share2, Sparkles, MessageSquare 
} from 'lucide-react';
import { AppNotification, ModuleType, Tenant, User } from '../types';
import { mockTenants, mockUsers } from '../data/mockData';

interface Props {
  activeModule: ModuleType;
  onNavigate: (module: ModuleType) => void;
  currentTenant: Tenant;
  onSelectTenant: (tenant: Tenant) => void;
  currentUser: User;
  onSelectUser: (user: User) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSpecsModal: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
}

export const Navbar: React.FC<Props> = ({
  activeModule,
  onNavigate,
  currentTenant,
  onSelectTenant,
  currentUser,
  onSelectUser,
  darkMode,
  onToggleDarkMode,
  onOpenSpecsModal,
  onOpenNotifications,
  unreadNotificationsCount
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTenantDropdownOpen, setIsTenantDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [lang, setLang] = useState<'ES' | 'EN'>('ES');

  const navItems: { id: ModuleType; label: string; icon: any }[] = [
    { id: 'landing', label: 'Inicio / Landing', icon: Home },
    { id: 'dashboard', label: 'CRM & Leads', icon: MessageSquare },
    { id: 'contracts', label: 'Contratos & ICL', icon: TrendingUp },
    { id: 'tenant_portal', label: 'Portal Inquilino', icon: Smartphone },
    { id: 'integrations', label: 'Conexiones', icon: Share2 },
    { id: 'ai_module', label: 'Scoring IA', icon: Sparkles },
    { id: 'admin', label: 'Agencia & Equipo', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Brand & Tenant Selector */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm group-hover:bg-blue-700 transition-colors">
                P
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white block leading-tight">
                    PropSaaS
                  </span>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-700 font-medium">
                    v1.0.4
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 block -mt-0.5">
                  Agencia {currentTenant.city}
                </span>
              </div>
            </button>

            {/* Tenant Selector Dropdown */}
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setIsTenantDropdownOpen(!isTenantDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 transition-all border border-slate-200 dark:border-slate-700"
              >
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span className="max-w-[150px] truncate">{currentTenant.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isTenantDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Cambiar Espacio Inmobiliario (Tenant)
                  </div>
                  {mockTenants.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        onSelectTenant(t);
                        setIsTenantDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                        currentTenant.id === t.id ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50/50 dark:bg-blue-950/30' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div>
                        <div>{t.name}</div>
                        <div className="text-[10px] text-slate-400">📍 {t.city} • {t.totalProperties} Propiedades</div>
                      </div>
                      {currentTenant.id === t.id && <Check className="w-4 h-4 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-blue-600 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400 dark:text-white' : 'text-slate-500'}`} />
                  {item.label}
                  {item.id === 'ai_module' && (
                    <span className="bg-blue-600 dark:bg-blue-500 text-[10px] text-white px-1.5 py-0.2 rounded-full font-bold ml-0.5">
                      IA
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2">
            
            {/* Technical Specs Document Button */}
            <button
              onClick={onOpenSpecsModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
              title="Ver Stack, Esquema PostgreSQL RLS, API y Roadmap MVP"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Docs Técnicos</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
              title="Notificaciones push"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Multi-language Selector */}
            <button
              onClick={() => setLang(lang === 'ES' ? 'EN' : 'ES')}
              className="px-2 py-1 rounded-md text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 border border-slate-200 dark:border-slate-700"
              title="Cambiar idioma"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              {lang}
            </button>

            {/* Role / User Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="w-7 h-7 rounded-full bg-slate-700 text-white overflow-hidden text-xs font-bold flex items-center justify-center">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    currentUser.name.charAt(0)
                  )}
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-fadeIn">
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
                    <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">Rol: {currentUser.role}</span>
                  </div>
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Simular Otro Rol
                  </div>
                  {mockUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSelectUser(u);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 ${
                        currentUser.id === u.id ? 'text-blue-600 font-bold bg-blue-50/50 dark:bg-blue-950/30' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{u.name} ({u.role})</span>
                      {currentUser.id === u.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-4 space-y-1 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-blue-600 dark:text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenSpecsModal();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2"
            >
              <FileCode className="w-4 h-4" /> Ver Especificaciones Técnicas
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
