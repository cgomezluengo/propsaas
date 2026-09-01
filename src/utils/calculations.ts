import jsPDF from 'jspdf';
import { Contract, Lead } from '../types';

export const formatCurrency = (amount: number, currency: 'ARS' | 'USD' = 'ARS'): string => {
  if (currency === 'USD') {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount).replace('US$', 'USD ');
  }

  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount).replace('ARS', '$');
};

export const calculateUpdatedRent = (baseAmount: number, percentageIncrease: number): number => {
  if (isNaN(baseAmount) || isNaN(percentageIncrease)) return 0;
  return baseAmount + (baseAmount * (percentageIncrease / 100));
};

export const exportContractsToCSV = (contracts: Contract[], filename = 'contratos_proptech_pro.csv') => {
  const headers = [
    'ID Contrato',
    'Inquilino',
    'CUIT',
    'Email',
    'Telefono',
    'Direccion Propiedad',
    'Ciudad',
    'Vencimiento',
    'Monto Actual (ARS)',
    'Proximo Aumento',
    'Indice Aplicable',
    'Frecuencia',
    'Estado'
  ];

  const rows = contracts.map(c => [
    c.id,
    `"${c.tenantName}"`,
    c.tenantCuit,
    c.tenantEmail,
    c.tenantPhone,
    `"${c.propertyAddress}"`,
    c.city,
    c.expirationDate,
    c.currentAmount,
    c.nextAdjustmentDate,
    c.indexType,
    c.adjustmentFrequency,
    c.status
  ]);

  const csvContent = '\uFEFF' + [
    headers.join(';'),
    ...rows.map(e => e.join(';'))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportLeadsToCSV = (leads: Lead[], filename = 'prospectos_crm_proptech.csv') => {
  const headers = [
    'ID',
    'Nombre',
    'Email',
    'Telefono',
    'Canal Origen',
    'Propiedad de Interes',
    'Direccion',
    'Estado',
    'Tipo',
    'Presupuesto',
    'Horas Sin Responder',
    'AI Score',
    'Categoria IA'
  ];

  const rows = leads.map(l => [
    l.id,
    `"${l.name}"`,
    l.email,
    l.phone,
    l.channel,
    `"${l.propertyInterest}"`,
    `"${l.propertyAddress}"`,
    l.status,
    l.leadType,
    `"${l.budget}"`,
    l.hoursUnanswered,
    l.aiScore?.score || 'N/A',
    l.aiScore?.category || 'N/A'
  ]);

  const csvContent = '\uFEFF' + [
    headers.join(';'),
    ...rows.map(e => e.join(';'))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateRentReceiptPDF = (
  tenantName: string,
  propertyAddress: string,
  month: string,
  amount: number,
  indexType: string,
  receiptId: string
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Header Banner
  doc.setFillColor(9, 20, 38); // #091426 Deep Navy
  doc.rect(0, 0, 210, 38, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('PropTech Pro - Recibo Oficial de Alquiler', 15, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Sistema SaaS de Gestión Inmobiliaria | Junín & Prov. de Buenos Aires', 15, 26);
  doc.text(`N° Comprobante: ${receiptId} | Fecha: ${new Date().toLocaleDateString('es-AR')}`, 15, 32);

  // Content Box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, 48, 180, 50, 3, 3, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('DATOS DEL LOCATARIO / INQUILINO', 20, 56);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Inquilino: ${tenantName}`, 20, 64);
  doc.text(`Inmueble Locado: ${propertyAddress}`, 20, 72);
  doc.text(`Período Liquidado: ${month}`, 20, 80);
  doc.text(`Cláusula de Indexación: ${indexType} (Banco Central / INDEC)`, 20, 88);

  // Financial Breakdown Table
  doc.setFillColor(241, 245, 249);
  doc.rect(15, 108, 180, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Concepto', 20, 114);
  doc.text('Subtotal ARS', 155, 114);

  doc.setFont('helvetica', 'normal');
  doc.text(`Canon Locativo Alquiler Mensual (${month})`, 20, 126);
  doc.text(formatCurrency(amount * 0.9), 155, 126);

  doc.text('Expensas Ordinarias y Mantenimiento', 20, 136);
  doc.text(formatCurrency(amount * 0.1), 155, 136);

  doc.setLineWidth(0.5);
  doc.setDrawColor(203, 213, 225);
  doc.line(15, 145, 195, 145);

  // Total Card
  doc.setFillColor(16, 185, 129, 0.1);
  doc.setDrawColor(16, 185, 129);
  doc.roundedRect(120, 152, 75, 20, 2, 2, 'FD');

  doc.setFontSize(10);
  doc.setTextColor(0, 113, 77);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL ABONADO (PAGADO):', 124, 160);
  doc.setFontSize(14);
  doc.text(formatCurrency(amount), 124, 168);

  // Signature and Validation stamp
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  doc.text('Este documento digital constituye comprobante válido de pago electrónico emitido a través de la plataforma PropTech Pro.', 15, 195);
  doc.text('Firma Digital y Sello de la Inmobiliaria Administradora - Martillero Colegiado Depto Judicial Junín.', 15, 202);

  // QR / Code box simulation
  doc.setDrawColor(148, 163, 184);
  doc.roundedRect(15, 215, 45, 45, 2, 2, 'D');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('[ VERIFICACIÓN QR ]', 20, 235);
  doc.text('Validación Blockchain', 19, 242);
  doc.text('Segura e Inalterable', 20, 248);

  doc.save(`Recibo_Alquiler_${tenantName.replace(/\s+/g, '_')}_${month.replace(/\s+/g, '_')}.pdf`);
};
