import React, { useState } from 'react';
import { 
  Building2, Lock, Mail, Eye, EyeOff, ArrowRight, ArrowLeft, 
  CheckCircle, Globe, Shield, Sparkles, Check, KeyRound, Smartphone, Fingerprint 
} from 'lucide-react';
import { Tenant, User } from '../types';
import { mockTenants, mockUsers } from '../data/mockData';

interface Props {
  currentTenant: Tenant;
  onSelectTenant: (tenant: Tenant) => void;
  currentUser: User;
  onSelectUser: (user: User) => void;
  onLoginSuccess: () => void;
}

type AuthView = 'login' | 'onboarding' | 'tenant_selector' | 'forgot_password' | 'two_factor';

export const AuthModule: React.FC<Props> = ({
  currentTenant,
  onSelectTenant,
  currentUser,
  onSelectUser,
  onLoginSuccess
}) => {
  const [view, setView] = useState<AuthView>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('cgomezluengo@gmail.com');
  const [password, setPassword] = useState('••••••••');
  
  // Onboarding Wizard State
  const [wizardStep, setWizardStep] = useState(1);
  const [agencyName, setAgencyName] = useState('Inmobiliaria Baires Central');
  const [workspaceUrl, setWorkspaceUrl] = useState('bairescentral');
  const [adminEmail, setAdminEmail] = useState('contacto@bairescentral.com.ar');
  const [adminPhone, setAdminPhone] = useState('+54 236 4438900');
  const [agencyCity, setAgencyCity] = useState('Junín');
  const [cuit, setCuit] = useState('30-71994821-3');
  const [matricula, setMatricula] = useState('T° III F° 142 Col. Martilleros Junín');
  const [selectedPlan, setSelectedPlan] = useState<'freemium' | 'agencia' | 'multi_sucursal'>('agencia');

  // 2FA state
  const [twoFactorCode, setTwoFactorCode] = useState(['', '', '', '', '', '']);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (is2FAEnabled) {
      setView('two_factor');
    } else {
      setView('tenant_selector');
    }
  };

  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setView('tenant_selector');
  };

  const handleSelectTenantAndEnter = (t: Tenant) => {
    onSelectTenant(t);
    onLoginSuccess();
  };

  const handleFinishOnboarding = () => {
    const newTenant: Tenant = {
      id: `tenant-${Date.now()}`,
      name: agencyName,
      slug: workspaceUrl,
      logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=120&auto=format&fit=crop&q=80',
      city: agencyCity,
      province: 'Buenos Aires',
      cuit: cuit,
      plan: selectedPlan,
      totalProperties: 1,
      totalContracts: 0
    };
    onSelectTenant(newTenant);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#070D18] flex items-center justify-center p-4 sm:p-6 transition-colors">
      
      {/* 1. LOGIN SCREEN (Matches user's exact mockup) */}
      {view === 'login' && (
        <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row min-h-[600px] animate-fadeIn">
          {/* Left Hero Image Box */}
          <div className="hidden md:flex md:w-1/2 relative flex-col justify-end p-10 lg:p-12 overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80')`
              }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent"></div>
            
            <div className="relative z-10 text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-950/80 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-800">
                <Sparkles className="w-3.5 h-3.5" />
                SaaS B2B Multi-Tenant
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-3">
                Transformando la <br />
                Gestión Inmobiliaria
              </h1>
              <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
                Plataforma centralizada para operaciones B2B, contratos, cálculo ICL/IPC y análisis de datos en tiempo real.
              </p>

              <div className="mt-8 pt-6 border-t border-slate-800 flex items-center gap-4 text-xs text-slate-400">
                <span>📍 Junín & PBA</span>
                <span>•</span>
                <span>🔒 Aislamiento RLS</span>
                <span>•</span>
                <span>⚡ IA Scoring</span>
              </div>
            </div>
          </div>

          {/* Right Form Container */}
          <div className="w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-12 relative">
            {/* Brand Logo */}
            <div className="flex justify-between items-center mb-8">
              <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  P
                </div>
                PropTech Pro
              </div>

              {/* 2FA Toggle for Demo */}
              <button
                type="button"
                onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors flex items-center gap-1.5 font-medium ${
                  is2FAEnabled 
                    ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                    : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                }`}
                title="Activar simulación de autenticación de doble factor"
              >
                <Shield className="w-3.5 h-3.5" />
                2FA: {is2FAEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="max-w-md w-full mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Bienvenido de nuevo</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Ingresa tus credenciales para acceder a tu panel de control.
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Email Profesional
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ejemplo@inmobiliaria.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      Contraseña
                    </label>
                    <button
                      type="button"
                      onClick={() => setView('forgot_password')}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                    >
                      ¿Olvidé mi contraseña?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs uppercase tracking-wider rounded-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm mt-2"
                >
                  Ingresar
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Divider */}
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                  <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase">O</span>
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                </div>

                {/* Google Login */}
                <button
                  type="button"
                  onClick={() => setView('tenant_selector')}
                  className="w-full py-2.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  Continuar con Google
                </button>
              </form>

              {/* Footer text */}
              <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
                ¿Tu inmobiliaria aún no está en la red?{' '}
                <button
                  onClick={() => setView('onboarding')}
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline ml-1"
                >
                  Registrar Inmobiliaria
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ONBOARDING WIZARD (Dar de alta la agencia) */}
      {view === 'onboarding' && (
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 animate-fadeIn">
          {/* Header */}
          <div className="flex justify-between items-center pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Alta de Inmobiliaria Multi-Tenant
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                Configuración del Espacio de Trabajo
              </h2>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-600 dark:text-slate-300">
              Paso {wizardStep} de 3
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full my-6 overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${(wizardStep / 3) * 100}%` }}
            />
          </div>

          {/* Step 1: Agency details */}
          {wizardStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Nombre de la Inmobiliaria
                </label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => {
                    setAgencyName(e.target.value);
                    setWorkspaceUrl(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
                  }}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Ej: Inmobiliaria Junín Propiedades"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Subdominio / URL del espacio de trabajo
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-mono rounded-l-lg border border-r-0 border-slate-200 dark:border-slate-700">
                    https://
                  </span>
                  <input
                    type="text"
                    value={workspaceUrl}
                    onChange={(e) => setWorkspaceUrl(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="miinmobiliaria"
                  />
                  <span className="px-3 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-mono rounded-r-lg border border-l-0 border-slate-200 dark:border-slate-700">
                    .proptechpro.com
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Email Administrador
                  </label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Legal & Location */}
          {wizardStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    CUIT Inmobiliaria / Martillero
                  </label>
                  <input
                    type="text"
                    value={cuit}
                    onChange={(e) => setCuit(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Ciudad Sede
                  </label>
                  <select
                    value={agencyCity}
                    onChange={(e) => setAgencyCity(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Junín">Junín (Provincia de Buenos Aires)</option>
                    <option value="Pergamino">Pergamino</option>
                    <option value="Chacabuco">Chacabuco</option>
                    <option value="Lincoln">Lincoln</option>
                    <option value="San Nicolás">San Nicolás</option>
                    <option value="CABA">Ciudad Autónoma de Buenos Aires</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Matrícula Profesional Martillero Colegiado
                </label>
                <input
                  type="text"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-xl border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300">
                <span className="font-bold">✓ Verificación Regional:</span> Tu espacio de trabajo quedará habilitado para operar con indexaciones oficiales del Banco Central (ICL) y Cámara Inmobiliaria de la Prov. de Buenos Aires.
              </div>
            </div>
          )}

          {/* Step 3: Plan Selection */}
          {wizardStep === 3 && (
            <div className="space-y-4">
              <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-2">
                Selecciona el Plan de Arranque
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div 
                  onClick={() => setSelectedPlan('freemium')}
                  className={`cursor-pointer p-4 rounded-xl border transition-all ${
                    selectedPlan === 'freemium' 
                      ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 ring-2 ring-blue-500/20' 
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span className="font-bold text-xs text-slate-900 dark:text-white">Freemium</span>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">$0</p>
                  <p className="text-[11px] text-slate-500 mt-2">1 usuario, 50 inmuebles</p>
                </div>

                <div 
                  onClick={() => setSelectedPlan('agencia')}
                  className={`cursor-pointer p-4 rounded-xl border transition-all ${
                    selectedPlan === 'agencia' 
                      ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 ring-2 ring-blue-500/20' 
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">Agencia</span>
                    <span className="text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded">Recomendado</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">$49/mes</p>
                  <p className="text-[11px] text-slate-500 mt-2">Hasta 5 usuarios + IA CRM</p>
                </div>

                <div 
                  onClick={() => setSelectedPlan('multi_sucursal')}
                  className={`cursor-pointer p-4 rounded-xl border transition-all ${
                    selectedPlan === 'multi_sucursal' 
                      ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 ring-2 ring-blue-500/20' 
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span className="font-bold text-xs text-slate-900 dark:text-white">Multi-Sucursal</span>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">$99/mes</p>
                  <p className="text-[11px] text-slate-500 mt-2">Usuarios ilimitados + API</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
            {wizardStep > 1 ? (
              <button
                type="button"
                onClick={() => setWizardStep(wizardStep - 1)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-lg flex items-center gap-2 hover:bg-slate-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Atrás
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setView('login')}
                className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
              >
                Cancelar y volver al login
              </button>
            )}

            {wizardStep < 3 ? (
              <button
                type="button"
                onClick={() => setWizardStep(wizardStep + 1)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg flex items-center gap-2 transition-colors ml-auto"
              >
                Continuar <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg flex items-center gap-2 transition-colors ml-auto shadow-sm"
              >
                Crear Inmobiliaria y Entrar <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. TENANT SELECTOR (Multi-Sucursal Transition) */}
      {view === 'tenant_selector' && (
        <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 animate-fadeIn">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center mx-auto mb-3">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Selecciona tu Inmobiliaria</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Tu usuario tiene acceso a los siguientes espacios de trabajo multi-tenant:
            </p>
          </div>

          <div className="space-y-2.5">
            {mockTenants.map((tenant) => (
              <div
                key={tenant.id}
                onClick={() => handleSelectTenantAndEnter(tenant)}
                className="cursor-pointer p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img src={tenant.logo} alt={tenant.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {tenant.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      📍 {tenant.city}, {tenant.province} • {tenant.totalContracts} Contratos activos
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {tenant.plan}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
            <button
              onClick={() => setView('login')}
              className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
            >
              Cerrar sesión
            </button>
            <button
              onClick={() => setView('onboarding')}
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              + Registrar otra sucursal
            </button>
          </div>
        </div>
      )}

      {/* 4. FORGOT PASSWORD SCREEN */}
      {view === 'forgot_password' && (
        <div className="w-full max-w-md bg-white dark:bg-[#0F172A] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 animate-fadeIn text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-amber-800">
            <KeyRound className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recuperar Contraseña</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-6">
            Ingresa tu email corporativo y te enviaremos un enlace seguro para restablecer tu acceso.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); alert('Enlace de recuperación enviado con éxito a tu casilla.'); setView('login'); }} className="space-y-4">
            <div className="text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Email Registrado
              </label>
              <input
                type="email"
                required
                defaultValue="cgomezluengo@gmail.com"
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                placeholder="ejemplo@inmobiliaria.com"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#091426] dark:bg-emerald-500 text-white dark:text-[#091426] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-800 transition-all"
            >
              Enviar Enlace
            </button>
          </form>

          <button
            onClick={() => setView('login')}
            className="mt-6 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold"
          >
            ← Volver al Login
          </button>
        </div>
      )}

      {/* 5. TWO-FACTOR AUTHENTICATION SCREEN */}
      {view === 'two_factor' && (
        <div className="w-full max-w-md bg-white dark:bg-[#0F172A] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 animate-fadeIn text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-800">
            <Smartphone className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Verificación en Dos Pasos (2FA)</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-6">
            Ingresa el código de 6 dígitos generado por tu aplicación autenticadora (Google Authenticator / Authy).
          </p>

          <form onSubmit={handle2FASubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  defaultValue={String((i + 3) % 9)}
                  className="w-11 h-12 text-center text-lg font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
            >
              Verificar y Continuar
            </button>
          </form>

          <div className="mt-6 flex justify-between items-center text-xs text-slate-500">
            <button onClick={() => setView('login')} className="hover:underline">
              ← Cancelar
            </button>
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <Fingerprint className="w-4 h-4" /> Biometría lista
            </span>
          </div>
        </div>
      )}

    </div>
  );
};
