import jsPDF from 'jspdf';

interface ReceiptData {
  receiptNumber: string;
  tenantName: string;
  propertyAddress: string;
  monthPeriod: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  agencyName: string;
  agencyCity: string;
}

export function generateRentReceiptPDF(data: ReceiptData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Background card styling
  doc.setFillColor(247, 249, 251);
  doc.roundedRect(10, 10, 190, 277, 4, 4, 'F');

  // Header Banner
  doc.setFillColor(9, 20, 38); // #091426 Deep Corporate Navy
  doc.roundedRect(15, 15, 180, 32, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(data.agencyName.toUpperCase(), 22, 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(111, 251, 190); // #6FFBBE
  doc.text('RECIBO OFICIAL DE PAGO DE ALQUILER', 22, 35);
  doc.text(`${data.agencyCity} • Folio #${data.receiptNumber}`, 22, 41);

  // Body Container
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, 52, 180, 225, 3, 3, 'F');

  // Tenant & Property Box
  doc.setTextColor(9, 20, 38);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('DETALLE DE LA LOCACIÓN', 22, 64);

  doc.setDrawColor(224, 227, 229);
  doc.line(22, 67, 188, 67);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(69, 71, 76);

  doc.text('Inquilino / Locatario:', 22, 76);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(9, 20, 38);
  doc.text(data.tenantName, 70, 76);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(69, 71, 76);
  doc.text('Inmueble / Domicilio:', 22, 85);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(9, 20, 38);
  doc.text(data.propertyAddress, 70, 85);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(69, 71, 76);
  doc.text('Período Correspondiente:', 22, 94);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(9, 20, 38);
  doc.text(data.monthPeriod, 70, 94);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(69, 71, 76);
  doc.text('Fecha de Acreditación:', 22, 103);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(9, 20, 38);
  doc.text(data.paymentDate, 70, 103);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(69, 71, 76);
  doc.text('Medio de Pago:', 22, 112);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(9, 20, 38);
  doc.text(data.paymentMethod, 70, 112);

  // Breakdown Table
  doc.setFillColor(247, 249, 251);
  doc.roundedRect(22, 125, 166, 45, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(9, 20, 38);
  doc.text('CONCEPTO', 28, 134);
  doc.text('IMPORTE', 155, 134);

  doc.setDrawColor(224, 227, 229);
  doc.line(28, 137, 182, 137);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(69, 71, 76);
  doc.text(`Canon Locativo Mensual (${data.monthPeriod})`, 28, 146);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(9, 20, 38);
  doc.text(`$ ${data.amount.toLocaleString('es-AR')}`, 150, 146);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(69, 71, 76);
  doc.text('Gastos Administrativos / Gestión', 28, 155);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 108, 73); // emerald
  doc.text('BONIFICADO', 145, 155);

  // Total Banner
  doc.setFillColor(0, 108, 73); // #006C49
  doc.roundedRect(22, 180, 166, 22, 2, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('TOTAL ABONADO', 28, 194);
  doc.setFontSize(14);
  doc.text(`$ ${data.amount.toLocaleString('es-AR')}`, 145, 194);

  // Legal disclaimer & Signature
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(133, 144, 166);
  doc.text('El presente comprobante certifica el cobro del canon locativo por cuenta y orden del propietario.', 22, 220);
  doc.text('Válido como constancia de libre deuda del período especificado según Ley de Alquileres vigente.', 22, 226);

  // Signature line
  doc.setDrawColor(180, 180, 180);
  doc.line(110, 255, 180, 255);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(69, 71, 76);
  doc.text('Firma y Sello de la Inmobiliaria', 120, 260);

  // Save PDF
  doc.save(`Recibo_Alquiler_${data.tenantName.replace(/\s+/g, '_')}_${data.monthPeriod.replace(/\s+/g, '_')}.pdf`);
}
