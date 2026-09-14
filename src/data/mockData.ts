import { 
  Lead, 
  AgencyTenant, 
  UserProfile, 
  PropertyItem, 
  ContractItem, 
  TenantPortalData,
  MaintenanceIncident,
  ReceptionEntry,
  KeyCustodyItem,
  AdCampaign
} from '../types';

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
    indexType: 'IPC (Inflación INDEC)',
    adjustmentPeriodMonths: 4,
    lastAdjustmentDate: '15 de Mayo 2026',
    nextAdjustmentDate: '15 de Septiembre 2026',
    monthsToAdjustment: 0,
    status: 'Ajuste Pendiente',
    paymentStatus: 'Pagado',
    lastIncreasePercent: 15.8,
    ipcMonthlyRates: [4.2, 3.8, 3.5, 3.4],
    internalAuditStatus: 'vencido_liquidar',
    contractStartDate: '15 de Enero 2026'
  },
  {
    id: 'cont-102',
    tenantName: 'María Eugenia Rossi',
    tenantPhone: '+54 236 4112233',
    propertyAddress: 'Casa Barrio Real - Calle Ombú 54',
    currentAmount: 480000,
    indexType: 'IPC (Inflación INDEC)',
    adjustmentPeriodMonths: 4,
    lastAdjustmentDate: '01 de Junio 2026',
    nextAdjustmentDate: '01 de Octubre 2026',
    monthsToAdjustment: 1,
    status: 'Al Día',
    paymentStatus: 'Pendiente de Validación',
    lastIncreasePercent: 16.2,
    ipcMonthlyRates: [4.0, 3.9, 3.7, 3.5],
    internalAuditStatus: 'preventivo_30d',
    contractStartDate: '01 de Febrero 2026'
  },
  {
    id: 'cont-103',
    tenantName: 'Ignacio Zavaleta',
    tenantPhone: '+54 236 4889900',
    propertyAddress: 'Local Comercial Calle Arias 310',
    currentAmount: 550000,
    indexType: 'ICL (Banco Central)',
    adjustmentPeriodMonths: 6,
    lastAdjustmentDate: '30 de Marzo 2026',
    nextAdjustmentDate: '30 de Septiembre 2026',
    monthsToAdjustment: 0,
    status: 'Por Vencer',
    paymentStatus: 'Atrasado',
    lastIncreasePercent: 41.0,
    internalAuditStatus: 'vencido_liquidar',
    contractStartDate: '30 de Septiembre 2025'
  },
  {
    id: 'cont-104',
    tenantName: 'Sofía Valenzuela',
    tenantPhone: '+54 236 4332211',
    propertyAddress: 'Depto 2 Ambientes Belgrano, Av. Rivadavia 450',
    currentAmount: 380000,
    indexType: 'IPC (Inflación INDEC)',
    adjustmentPeriodMonths: 4,
    lastAdjustmentDate: '10 de Julio 2026',
    nextAdjustmentDate: '10 de Noviembre 2026',
    monthsToAdjustment: 2,
    status: 'Al Día',
    paymentStatus: 'Pagado',
    lastIncreasePercent: 14.9,
    ipcMonthlyRates: [3.9, 3.6, 3.5, 3.3],
    internalAuditStatus: 'al_dia',
    contractStartDate: '10 de Marzo 2026'
  }
];

export const mockIncidents: MaintenanceIncident[] = [
  {
    id: 'inc-01',
    propertyAddress: 'Depto Calle Borges 142, Piso 2 A',
    tenantName: 'Nicolás Balbi',
    tenantPhone: '+54 236 4554433',
    category: 'Gas y Calefón',
    description: 'Pérdida leve de gas en la llave de paso del calefón Orbis tiro natural. Requiere gasista matriculado urgente por seguridad.',
    urgency: 'Urgente (<24h)',
    responsibility: 'Propietario (CCN Art. 1201)',
    status: 'Técnico Coordinado',
    assignedTrade: 'Gasista Matriculado Roberto Rossi (Mat. 4410)',
    estimatedCost: 35000,
    dateReported: 'Hoy 09:30 hs',
    lockboxCode: '#3001-A'
  },
  {
    id: 'inc-02',
    propertyAddress: 'Casa Barrio Real - Calle Ombú 54',
    tenantName: 'María Eugenia Rossi',
    tenantPhone: '+54 236 4112233',
    category: 'Humedad y Filtraciones',
    description: 'Mancha de humedad en techo de dormitorio principal por membrana de azotea deteriorada.',
    urgency: 'Ordinaria (<10 días)',
    responsibility: 'Propietario (CCN Art. 1201)',
    status: 'En Presupuesto',
    assignedTrade: 'Techista Juan Carlos Silva',
    estimatedCost: 120000,
    dateReported: 'Ayer 16:00 hs',
    lockboxCode: '#7741-B'
  },
  {
    id: 'inc-03',
    propertyAddress: 'Local Comercial Calle Arias 310',
    tenantName: 'Ignacio Zavaleta',
    tenantPhone: '+54 236 4889900',
    category: 'Electricidad',
    description: 'Disyuntor salta al encender iluminación de vidriera. Posible falso contacto en tablero seccional.',
    urgency: 'Urgente (<24h)',
    responsibility: 'Inquilino (Mantenimiento menor)',
    status: 'Pendiente',
    assignedTrade: 'Electricista Mat. Marcos Toledo',
    estimatedCost: 28000,
    dateReported: 'Hoy 11:15 hs',
    lockboxCode: '#9931-E'
  },
  {
    id: 'inc-04',
    propertyAddress: 'Depto 2 Ambientes Belgrano, Av. Rivadavia 450',
    tenantName: 'Sofía Valenzuela',
    tenantPhone: '+54 236 4332211',
    category: 'Cerrajería y Accesos',
    description: 'Cerradura doble paleta de puerta de entrada trabada, llave gira en falso.',
    urgency: 'Urgente (<24h)',
    responsibility: 'Inquilino (Mantenimiento menor)',
    status: 'Resuelto',
    assignedTrade: 'Cerrajería 24hs Centro',
    estimatedCost: 18000,
    dateReported: '12/09/2026',
    resolutionDate: '12/09/2026',
    lockboxCode: '#3001-A'
  }
];

export const mockReceptionEntries: ReceptionEntry[] = [
  {
    id: 'rec-entry-01',
    visitorName: 'Horacio Fernández',
    visitorType: 'Propietario',
    reason: 'Vino a cobrar liquidación de alquiler de Depto Borges 142 y firmar recibo.',
    assignedMartillero: 'Carlos Gómez',
    status: 'En Espera',
    timestamp: '10:45 hs',
    contactPhone: '+54 236 4501234'
  },
  {
    id: 'rec-entry-02',
    visitorName: 'Lucía Santillán',
    visitorType: 'Interesado Alquiler/Venta',
    reason: 'Consulta presencial por departamento de 2 ambientes en alquiler zona céntrica.',
    assignedMartillero: 'Mariana López',
    status: 'En Atención',
    timestamp: '11:10 hs',
    contactPhone: '+54 236 4778899'
  },
  {
    id: 'rec-entry-03',
    visitorName: 'Roberto Rossi',
    visitorType: 'Proveedor/Gremio',
    reason: 'Retiro de llave de Depto Borges para reparación de gas.',
    assignedMartillero: 'Carlos Gómez',
    status: 'Completado',
    timestamp: '09:30 hs',
    contactPhone: '+54 236 4223344'
  },
  {
    id: 'rec-entry-04',
    visitorName: 'Andreani Encomiendas',
    visitorType: 'Cadetería',
    reason: 'Entrega de sobre con contrato timbrado de escribanía.',
    assignedMartillero: 'Recepción General',
    status: 'Completado',
    timestamp: '08:45 hs'
  }
];

export const mockKeyCustodyList: KeyCustodyItem[] = [
  {
    id: 'key-01',
    propertyTitle: 'Depto Calle Borges 142, Piso 2 A',
    propertyAddress: 'Calle Borges 142, Junín',
    keyTag: 'LLA-142',
    takenBy: 'Gasista Roberto Rossi (Mat. 4410)',
    takenAt: 'Hoy 09:30 hs',
    status: 'Prestada / En Visita',
    notes: 'Para arreglo urgente de gas programado con inquilino.'
  },
  {
    id: 'key-02',
    propertyTitle: 'Semipiso 3 Ambientes con Cochera',
    propertyAddress: 'Plaza 25 de Mayo 88, Junín',
    keyTag: 'LLA-088',
    takenBy: 'Martillero Carlos Gómez',
    takenAt: 'Ayer 17:00 hs',
    returnedAt: 'Ayer 18:30 hs',
    status: 'En Inmobiliaria',
    notes: 'Llave en tablero casillero B-4.'
  },
  {
    id: 'key-03',
    propertyTitle: 'Local Comercial Doble Altura Centro',
    propertyAddress: 'Calle Mayor López 120, Junín',
    keyTag: 'LLA-120',
    takenBy: 'Mariana López (Martillera)',
    takenAt: 'Hoy 11:30 hs',
    status: 'Prestada / En Visita',
    notes: 'Muestra a interesado gastronómico.'
  },
  {
    id: 'key-04',
    propertyTitle: 'Quinta Las Lilas 2 Hectáreas',
    propertyAddress: 'Camino al Balneario Km 4, Junín',
    keyTag: 'LLA-505',
    takenBy: 'Oficina Central',
    takenAt: 'Permanente',
    status: 'En Inmobiliaria',
    notes: 'Juego completo con candado de tranquera.'
  }
];

export const mockAdCampaigns: AdCampaign[] = [
  {
    id: 'ad-01',
    platform: 'Meta Ads (Instagram/FB)',
    campaignTitle: 'Campaña Alquileres Céntricos Junín Septiembre',
    budgetMonthly: 120000,
    spendSoFar: 64500,
    leadsCount: 42,
    costPerLead: 1535,
    status: 'Activa',
    syncStatus: 'Sincronizado'
  },
  {
    id: 'ad-02',
    platform: 'Zonaprop',
    campaignTitle: 'Paquete Destacados SuperDestacado Inmobiliaria Gómez',
    budgetMonthly: 180000,
    spendSoFar: 180000,
    leadsCount: 68,
    costPerLead: 2647,
    status: 'Activa',
    syncStatus: 'Sincronizado'
  },
  {
    id: 'ad-03',
    platform: 'Argenprop',
    campaignTitle: 'Sindicación Automática Feed XML Catálogo Completo',
    budgetMonthly: 95000,
    spendSoFar: 95000,
    leadsCount: 31,
    costPerLead: 3064,
    status: 'Activa',
    syncStatus: 'Sincronizado'
  },
  {
    id: 'ad-04',
    platform: 'Mercado Libre',
    campaignTitle: 'Publicaciones Clásicas Inmuebles',
    budgetMonthly: 60000,
    spendSoFar: 42000,
    leadsCount: 19,
    costPerLead: 2210,
    status: 'Activa',
    syncStatus: 'Sincronizado'
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
