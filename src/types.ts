export type CRMViewTab = 
  | 'nuevas_consultas' 
  | 'en_seguimiento' 
  | 'visitas_agendadas' 
  | 'cierres_ganados' 
  | 'descartados'
  | 'propiedades'
  | 'contratos'
  | 'inquilinos'
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
