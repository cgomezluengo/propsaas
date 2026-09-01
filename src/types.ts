export type ModuleType = 
  | 'landing'
  | 'auth'
  | 'dashboard'
  | 'contracts'
  | 'tenant_portal'
  | 'integrations'
  | 'ai_module'
  | 'admin';

export type UserRole = 'admin' | 'martillero' | 'cobranzas' | 'inquilino';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo: string;
  city: string;
  province: string;
  cuit: string;
  plan: 'freemium' | 'agencia' | 'multi_sucursal';
  totalProperties: number;
  totalContracts: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
  avatar?: string;
  phone?: string;
  twoFactorEnabled?: boolean;
}

export type LeadStatus = 'new' | 'contacted' | 'visit_scheduled' | 'lost' | 'converted';
export type LeadType = 'alquiler' | 'venta_residencial' | 'comercial' | 'inversion';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  channel: 'instagram' | 'facebook' | 'whatsapp' | 'web' | 'zonaprop' | 'argenprop' | 'manual';
  propertyInterest: string;
  propertyAddress: string;
  status: LeadStatus;
  leadType: LeadType;
  budget: string;
  timeframe: string;
  createdAt: string;
  hoursUnanswered: number;
  notes?: string;
  aiScore?: {
    score: number; // 0 - 100
    category: 'alta_intencion' | 'media_intencion' | 'spam_baja_intencion';
    reason: string;
    suggestedReply: string;
    guaranteeStatus?: string;
    verifiedIncome?: boolean;
  };
}

export type ContractStatus = 'vigente' | 'pendiente_actualizacion' | 'proximo_a_vencer' | 'finalizado';
export type IndexType = 'ICL' | 'IPC' | 'CASA_PROPIA' | 'FIJO';

export interface Contract {
  id: string;
  tenantName: string;
  tenantCuit: string;
  tenantEmail: string;
  tenantPhone: string;
  propertyAddress: string;
  city: string;
  startDate: string;
  expirationDate: string;
  currentAmount: number;
  currency: 'ARS' | 'USD';
  nextAdjustmentDate: string;
  indexType: IndexType;
  adjustmentFrequency: 'semestral' | 'cuatrimestral' | 'anual' | 'trimestral';
  status: ContractStatus;
  lastIncreasePercentage?: number;
  expensesAmount?: number;
}

export interface PaymentReceipt {
  id: string;
  contractId: string;
  month: string;
  amount: number;
  date: string;
  status: 'pagado' | 'pendiente' | 'en_revision';
  receiptUrl?: string;
  method: 'Transferencia Bancaria' | 'Efectivo' | 'Débito Automático';
}

export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  neighborhood: string;
  price: number;
  currency: 'ARS' | 'USD';
  operationType: 'alquiler' | 'venta';
  propertyType: 'departamento' | 'casa' | 'local_comercial' | 'galpon' | 'terreno';
  bedrooms: number;
  bathrooms: number;
  coveredM2: number;
  images: string[];
  status: 'disponible' | 'reservada' | 'alquilada' | 'vendida';
  featured?: boolean;
}

export interface IntegrationConnection {
  id: string;
  name: 'Instagram' | 'Facebook' | 'YouTube' | 'Twitter/X' | 'WhatsApp Business' | 'GitHub';
  icon: string;
  connected: boolean;
  accountName?: string;
  lastSync?: string;
  leadsCapturedMonth?: number;
  description: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'info' | 'success' | 'alert';
  time: string;
  read: boolean;
  linkModule?: ModuleType;
}
