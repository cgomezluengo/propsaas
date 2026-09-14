export type CRMViewTab = 
  | 'nuevas_consultas' 
  | 'en_seguimiento' 
  | 'visitas_agendadas' 
  | 'cierres_ganados' 
  | 'descartados'
  | 'propiedades'
  | 'contratos'
  | 'inquilinos'
  | 'problemas_tipicos'
  | 'publicidad'
  | 'recepcion'
  | 'ajustes';

export interface Lead {
  id: string;
  name: string;
  initials: string;
  phone: string;
  channel: 'WhatsApp' | 'Instagram DM' | 'FB Messenger' | 'Web Portal';
  channelIcon: string;
  propertyTitle: string;
  propertyPrice: string;
  propertyImage: string;
  propertyAddress: string;
  bedrooms: number;
  bathrooms: number;
  timeAgo: string;
  unansweredHours: number;
  urgencyLevel: 'urgent_48h' | 'urgent_24h' | 'normal';
  aiScore: number;
  aiIntentLevel: 'Alta Intención' | 'Intención Media' | 'Baja Intención';
  lastMessage: string;
  status: 'new' | 'contacted' | 'visit_scheduled' | 'won' | 'lost';
  lockboxCode: string;
  martilleroName: string;
  visitTime?: string;
  guaranteeStatus: string;
}

export interface PropertyItem {
  id: string;
  title: string;
  address: string;
  price: string;
  operation: 'Alquiler' | 'Venta';
  type: 'Departamento' | 'Casa' | 'Local Comercial' | 'Quinta';
  bedrooms: number;
  bathrooms: number;
  coveredM2: number;
  status: 'Disponible' | 'Reservada' | 'Alquilada' | 'Vendida';
  image: string;
  featured?: boolean;
}

export interface ContractItem {
  id: string;
  tenantName: string;
  tenantPhone: string;
  propertyAddress: string;
  currentAmount: number;
  indexType: 'ICL (Banco Central)' | 'IPC (Inflación INDEC)' | 'Casa Propia';
  nextAdjustmentDate: string;
  monthsToAdjustment: number;
  status: 'Al Día' | 'Ajuste Pendiente' | 'Por Vencer';
  paymentStatus: 'Pagado' | 'Pendiente de Validación' | 'Atrasado';
  lastIncreasePercent: number;
  // Control Interno de Aumentos Cuatrimestrales IPC (INDEC)
  adjustmentPeriodMonths?: number; // 4 por defecto para IPC post-DNU
  lastAdjustmentDate?: string;
  ipcMonthlyRates?: number[]; // Variaciones mensuales del cuatrimestre ej: [4.2, 3.8, 3.5, 3.1]
  internalAuditStatus?: 'al_dia' | 'preventivo_30d' | 'vencido_liquidar';
  contractStartDate?: string;
}

export interface MaintenanceIncident {
  id: string;
  propertyAddress: string;
  tenantName: string;
  tenantPhone: string;
  category: 'Humedad y Filtraciones' | 'Gas y Calefón' | 'Electricidad' | 'Plomería y Caños' | 'Expensas y Consorcio' | 'Cerrajería y Accesos' | 'Otro';
  description: string;
  urgency: 'Urgente (<24h)' | 'Ordinaria (<10 días)';
  responsibility: 'Propietario (CCN Art. 1201)' | 'Inquilino (Mantenimiento menor)' | 'Consorcio';
  status: 'Pendiente' | 'En Presupuesto' | 'Técnico Coordinado' | 'Resuelto';
  assignedTrade?: string; // Ej: 'Gasista Matriculado Juan Ruiz'
  estimatedCost?: number;
  dateReported: string;
  resolutionDate?: string;
  lockboxCode?: string;
}

export interface ReceptionEntry {
  id: string;
  visitorName: string;
  visitorType: 'Inquilino' | 'Propietario' | 'Interesado Alquiler/Venta' | 'Proveedor/Gremio' | 'Cadetería';
  reason: string;
  assignedMartillero: string;
  status: 'En Espera' | 'En Atención' | 'Completado';
  timestamp: string;
  contactPhone?: string;
}

export interface KeyCustodyItem {
  id: string;
  propertyTitle: string;
  propertyAddress: string;
  keyTag: string; // Ej: 'LL-042'
  takenBy: string; // Ej: 'Martillero Carlos Gómez' o 'Pintor Roberto'
  takenAt: string;
  returnedAt?: string;
  status: 'En Inmobiliaria' | 'Prestada / En Visita';
  notes?: string;
}

export interface AdCampaign {
  id: string;
  platform: 'Zonaprop' | 'Argenprop' | 'Mercado Libre' | 'Meta Ads (Instagram/FB)' | 'Google Ads';
  campaignTitle: string;
  budgetMonthly: number;
  spendSoFar: number;
  leadsCount: number;
  costPerLead: number;
  status: 'Activa' | 'En Revisión' | 'Pausada';
  syncStatus: 'Sincronizado' | 'Error de Token' | 'Pendiente';
}

export interface TenantPortalData {
  tenantName: string;
  propertyAddress: string;
  currentRent: number;
  nextAdjustmentDate: string;
  monthsLeft: number;
  indexType: string;
  paymentStatus: 'Al Día' | 'Pendiente de Pago';
  receipts: {
    month: string;
    amount: number;
    date: string;
    pdfUrl: string;
  }[];
}

export interface AgencyTenant {
  id: string;
  name: string;
  city: string;
  plan: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  plan: string;
  avatarUrl: string;
}
