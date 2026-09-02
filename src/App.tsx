import React, { useState, useEffect } from 'react';
import { ModuleType, Tenant, User, Lead, AppNotification } from './types';
import { mockTenants, mockUsers, mockNotifications, mockLeads } from './data/mockData';
import { Navbar } from './components/Navbar';
import { LandingModule } from './components/LandingModule';
import { AuthModule } from './components/AuthModule';
import { DashboardCRMModule } from './components/DashboardCRMModule';
import { ContractsModule } from './components/ContractsModule';
import { TenantPortalModule } from './components/TenantPortalModule';
import { IntegrationsModule } from './components/IntegrationsModule';
import { AILeadScoringModule } from './components/AILeadScoringModule';
import { AdminTeamModule } from './components/AdminTeamModule';
import { TechnicalSpecsModal } from './components/TechnicalSpecsModal';
import { NotificationCenter } from './components/NotificationCenter';

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleType>('dashboard');
  const [currentTenant, setCurrentTenant] = useState<Tenant>(mockTenants[0]);
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(mockNotifications);
  const [selectedLeadForAI, setSelectedLeadForAI] = useState<Lead | null>(mockLeads[0]);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.body.className = "bg-[#F7F9FB] text-[#191C1E] antialiased";
  }, []);

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNavigateToNotificationModule = (mod: ModuleType) => {
    setActiveModule(mod);
    setIsNotificationsOpen(false);
  };

  const handleSelectLeadForAI = (lead: Lead) => {
    setSelectedLeadForAI(lead);
    setActiveModule('ai_module');
  };

  // Check if current view is CRM Dashboard (which has full standalone sidebar & layout)
  const isDashboard = activeModule === 'dashboard';

  return (
    <div className="min-h-screen bg-[#F7F9FB] text-[#191C1E] flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Navbar only for standard sub-modules or mobile header */}
      <Navbar
        activeModule={activeModule}
        onNavigate={setActiveModule}
        currentTenant={currentTenant}
        onSelectTenant={setCurrentTenant}
        currentUser={currentUser}
        onSelectUser={setCurrentUser}
        darkMode={false}
        onToggleDarkMode={() => {}}
        onOpenSpecsModal={() => setIsSpecsModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={notifications.filter(n => !n.read).length}
        compactMode={isDashboard}
      />

      {/* Main View Area */}
      <main className={`flex-1 w-full ${isDashboard ? 'h-[calc(100vh-4rem)] overflow-hidden' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'}`}>
        {activeModule === 'landing' && (
          <LandingModule onNavigate={setActiveModule} />
        )}

        {activeModule === 'auth' && (
          <AuthModule
            currentTenant={currentTenant}
            onSelectTenant={setCurrentTenant}
            currentUser={currentUser}
            onSelectUser={setCurrentUser}
            onLoginSuccess={() => setActiveModule('dashboard')}
          />
        )}

        {activeModule === 'dashboard' && (
          <DashboardCRMModule
            currentTenant={currentTenant}
            currentUser={currentUser}
            onOpenSpecsModal={() => setIsSpecsModalOpen(true)}
            onSelectLeadForAI={handleSelectLeadForAI}
            onNavigateModule={setActiveModule}
          />
        )}

        {activeModule === 'contracts' && (
          <ContractsModule
            currentTenant={currentTenant}
          />
        )}

        {activeModule === 'tenant_portal' && (
          <TenantPortalModule
            currentTenant={currentTenant}
            currentUser={currentUser}
          />
        )}

        {activeModule === 'integrations' && (
          <IntegrationsModule
            currentTenant={currentTenant}
          />
        )}

        {activeModule === 'ai_module' && (
          <AILeadScoringModule
            currentTenant={currentTenant}
            selectedLeadProp={selectedLeadForAI}
          />
        )}

        {activeModule === 'admin' && (
          <AdminTeamModule
            currentTenant={currentTenant}
            currentUser={currentUser}
          />
        )}
      </main>

      {/* Technical Specifications & Architecture Modal */}
      <TechnicalSpecsModal
        isOpen={isSpecsModalOpen}
        onClose={() => setIsSpecsModalOpen(false)}
      />

      {/* Push Notification Center Drawer */}
      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onNavigateToNotification={handleNavigateToNotificationModule}
      />
    </div>
  );
}
