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
