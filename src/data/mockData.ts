import { Lead, AgencyTenant, UserProfile, PropertyItem, ContractItem, TenantPortalData } from '../types';

export const mockTenant: AgencyTenant = {
  id: 'tenant-1',
  name: 'Inmobiliaria Gómez & Asoc.',
  city: 'Junín, Prov. de Buenos Aires',
  plan: 'Plan Agencia Pro'
};

export const mockUser: UserProfile = {
  name: 'Carlos Gómez',
  email: 'carlos@inmobiliariagomez.com',
  role: 'Martillero Colegiado',
  plan: 'Plan Agencia',
  avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256'
};

export const mockLeadsList: Lead[] = [
  {
    id: 'lead-1',
    name: 'Martín Rodríguez',
    initials: 'MR',
    phone: '+54 236 4123456',
    channel: 'WhatsApp',
    channelIcon: 'forum',
    propertyTitle: 'Depto 2 Ambientes Belgrano',
    propertyPrice: '$380.000 / mes',
    propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600',
    propertyAddress: 'Av. Rivadavia 450, Junín',
    bedrooms: 1,
    bathrooms: 1,
    timeAgo: 'Hace 2 días',
    unansweredHours: 49,
    urgencyLevel: 'urgent_48h',
    aiScore: 96,
    aiIntentLevel: 'Alta Intención',
    lastMessage: 'Hola, estoy muy interesado en el departamento de Belgrano. Ya tengo la garantía en mano. ¿Podemos coordinar visita para mañana?',
    status: 'new',
    lockboxCode: '#4829-B',
    martilleroName: 'Carlos Gómez',
    visitTime: 'Hoy 16:30 hs',
    guaranteeStatus: 'En mano (Recibo de $1.8M)'
  },
  {
    id: 'lead-2',
    name: 'Florencia Benítez',
    initials: 'FB',
    phone: '+54 236 4987654',
    channel: 'Instagram DM',
    channelIcon: 'photo_camera',
    propertyTitle: 'Casa en Olivos Venta',
    propertyPrice: 'USD 220.000',
    propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600',
    propertyAddress: 'Barrio Residencial Olivos, Junín',
    bedrooms: 3,
    bathrooms: 2,
    timeAgo: 'Ayer, 14:30',
    unansweredHours: 26,
    urgencyLevel: 'urgent_24h',
    aiScore: 88,
    aiIntentLevel: 'Intención Media',
    lastMessage: 'Vi la casa en sus historias de Instagram. ¿Sigue disponible? Me gustaría saber si toman departamento en parte de pago.',
    status: 'new',
    lockboxCode: '#1092-A',
    martilleroName: 'Mariana López',
    visitTime: 'Hoy 18:00 hs',
    guaranteeStatus: 'Comprador directo'
  },
  {
    id: 'lead-3',
    name: 'Lucía Fernández',
    initials: 'LF',
    phone: '+54 236 4332211',
    channel: 'WhatsApp',
    channelIcon: 'forum',
    propertyTitle: 'Casa Quinta en Junín Alquiler',
    propertyPrice: '$650.000 / mes',
    propertyImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600',
    propertyAddress: 'Zona Quintas - Acceso Balneario',
    bedrooms: 3,
    bathrooms: 2,
    timeAgo: 'Hace 2 horas',
    unansweredHours: 0,
    urgencyLevel: 'normal',
    aiScore: 92,
    aiIntentLevel: 'Alta Intención',
    lastMessage: 'Tengo recibo de sueldo de $1.8M y garantía propietaria de familiar directo, ¿podemos coordinar para verla el sábado?',
    status: 'contacted',
    lockboxCode: '#7741-C',
    martilleroName: 'Carlos Gómez',
    visitTime: 'Sábado 10:30 hs',
    guaranteeStatus: 'Garantía Propietaria'
  },
  {
    id: 'lead-4',
    name: 'Carlos Menéndez',
    initials: 'CM',
    phone: '+54 236 4667788',
    channel: 'FB Messenger',
    channelIcon: 'chat',
    propertyTitle: 'Local Comercial Centro 80m2',
    propertyPrice: '$420.000 / mes',
    propertyImage: 'https://images.unsplash.com/photo-1582037928769-181f2644ecb7?auto=format&fit=crop&q=80&w=600',
    propertyAddress: 'Calle Mayor López 120, Junín',
    bedrooms: 0,
    bathrooms: 1,
    timeAgo: 'Hace 15 min',
    unansweredHours: 0,
    urgencyLevel: 'normal',
    aiScore: 78,
    aiIntentLevel: 'Intención Media',
    lastMessage: 'Buenas tardes, ¿tienen locales disponibles con habilitación comercial para gastronomía o rubro textil?',
    status: 'new',
    lockboxCode: '#9931-E',
    martilleroName: 'Mariana López',
    visitTime: 'Mañana 11:00 hs',
    guaranteeStatus: 'En verificación'
  },
  {
    id: 'lead-5',
    name: 'Esteban Morales',
    initials: 'EM',
    phone: '+54 236 4990011',
    channel: 'Instagram DM',
    channelIcon: 'photo_camera',
    propertyTitle: 'Semipiso 3 Ambientes Centro',
    propertyPrice: 'USD 140.000',
    propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600',
    propertyAddress: 'Plaza 25 de Mayo, Junín',
    bedrooms: 2,
    bathrooms: 2,
    timeAgo: 'Hace 4 horas',
    unansweredHours: 0,
    urgencyLevel: 'normal',
    aiScore: 94,
    aiIntentLevel: 'Alta Intención',
    lastMessage: '¿Se puede coordinar una visita para este sábado por la mañana con mi arquitecto?',
    status: 'contacted',
    lockboxCode: '#5512-D',
    martilleroName: 'Carlos Gómez',
    visitTime: 'Sábado 11:30 hs',
    guaranteeStatus: 'Fondos propios'
  }
];

export const mockProperties: PropertyItem[] = [
  {
    id: 'prop-1',
    title: 'Depto 2 Ambientes Belgrano',
    address: 'Av. Rivadavia 450, Piso 4 B, Junín',
    price: '$380.000 / mes',
    operation: 'Alquiler',
    type: 'Departamento',
    bedrooms: 1,
    bathrooms: 1,
    coveredM2: 52,
    status: 'Disponible',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600',
    featured: true
  },
  {
    id: 'prop-2',
    title: 'Casa Familiar con Parque y Quincho',
    address: 'Barrio Cerrado Los Almendros, Junín',
    price: 'USD 220.000',
    operation: 'Venta',
    type: 'Casa',
    bedrooms: 3,
    bathrooms: 2,
    coveredM2: 185,
    status: 'Disponible',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600',
    featured: true
  },
  {
    id: 'prop-3',
    title: 'Casa Quinta con Pileta Climatizada',
    address: 'Acceso Balneario Laguna de Gómez',
    price: '$650.000 / mes',
    operation: 'Alquiler',
    type: 'Quinta',
    bedrooms: 3,
    bathrooms: 2,
    coveredM2: 210,
    status: 'Reservada',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'prop-4',
    title: 'Local Comercial Doble Altura Centro',
    address: 'Calle Mayor López 120, Junín',
    price: '$420.000 / mes',
    operation: 'Alquiler',
    type: 'Local Comercial',
    bedrooms: 0,
    bathrooms: 1,
    coveredM2: 80,
    status: 'Disponible',
    image: 'https://images.unsplash.com/photo-1582037928769-181f2644ecb7?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'prop-5',
    title: 'Semipiso 3 Ambientes con Cochera',
    address: 'Plaza 25 de Mayo 88, Junín',
    price: 'USD 140.000',
    operation: 'Venta',
    type: 'Departamento',
    bedrooms: 2,
    bathrooms: 2,
    coveredM2: 95,
    status: 'Disponible',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600'
  }
];

export const mockContracts: ContractItem[] = [
  {
    id: 'cont-101',
    tenantName: 'Nicolás Balbi',
    tenantPhone: '+54 236 4554433',
    propertyAddress: 'Depto Calle Borges 142, Piso 2 A',
    currentAmount: 320000,
    indexType: 'ICL (Banco Central)',
    nextAdjustmentDate: '15 de Octubre 2026',
    monthsToAdjustment: 1,
    status: 'Ajuste Pendiente',
    paymentStatus: 'Pagado',
    lastIncreasePercent: 38.4
  },
  {
    id: 'cont-102',
    tenantName: 'María Eugenia Rossi',
    tenantPhone: '+54 236 4112233',
    propertyAddress: 'Casa Barrio Real - Calle Ombú 54',
    currentAmount: 480000,
    indexType: 'IPC (Inflación INDEC)',
    nextAdjustmentDate: '01 de Diciembre 2026',
    monthsToAdjustment: 3,
    status: 'Al Día',
    paymentStatus: 'Pendiente de Validación',
    lastIncreasePercent: 24.2
  },
  {
    id: 'cont-103',
    tenantName: 'Ignacio Zavaleta',
    tenantPhone: '+54 236 4889900',
    propertyAddress: 'Local Comercial Calle Arias 310',
    currentAmount: 550000,
    indexType: 'ICL (Banco Central)',
    nextAdjustmentDate: '30 de Septiembre 2026',
    monthsToAdjustment: 0,
    status: 'Por Vencer',
    paymentStatus: 'Atrasado',
    lastIncreasePercent: 41.0
  }
];

export const mockTenantPortalData: TenantPortalData = {
  tenantName: 'Nicolás Balbi',
  propertyAddress: 'Depto Calle Borges 142, Piso 2 A, Junín',
  currentRent: 320000,
  nextAdjustmentDate: '15 de Octubre 2026',
  monthsLeft: 1,
  indexType: 'ICL (Índice de Contratos de Locación - BCRA)',
  paymentStatus: 'Al Día',
  receipts: [
    {
      month: 'Agosto 2026',
      amount: 320000,
      date: '04/08/2026',
      pdfUrl: '#'
    },
    {
      month: 'Julio 2026',
      amount: 320000,
      date: '05/07/2026',
      pdfUrl: '#'
    },
    {
      month: 'Junio 2026',
      amount: 231200,
      date: '06/06/2026',
      pdfUrl: '#'
    }
  ]
};
