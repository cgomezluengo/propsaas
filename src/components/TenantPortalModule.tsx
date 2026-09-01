import React, { useState } from 'react';
import { 
  Smartphone, FileText, Download, CheckCircle, 
  Upload, Wrench, ShieldCheck, Home, CreditCard, Copy, Check 
} from 'lucide-react';
import { Contract, PaymentReceipt, Tenant, User } from '../types';
import { mockContracts, mockTenantReceipts } from '../data/mockData';
import { formatCurrency, generateRentReceiptPDF } from '../utils/calculations';

interface Props {
  currentTenant: Tenant;
  currentUser: User;
}

export const TenantPortalModule: React.FC<Props> = ({ currentTenant }) => {
  const contract: Contract = mockContracts[0]; // Martín Ramírez in Junín
  const [receipts, setReceipts] = useState<PaymentReceipt[]>(mockTenantReceipts);
  const [isNotifyPaymentOpen, setIsNotifyPaymentOpen] = useState(false);
  const [isReportIssueOpen, setIsReportIssueOpen] = useState(false);
  const [paymentNotified, setPaymentNotified] = useState(false);
  const [copiedAlias, setCopiedAlias] = useState(false);

  // Form states
  const [paymentMethod, setPaymentMethod] = useState('Transferencia Bancaria');
  const [issueDescription, setIssueDescription] = useState('');
  const [issueCategory, setIssueCategory] = useState('Plomería / Agua');

  const handleCopyAlias = () => {
    navigator.clipboard.writeText('INMO.GOMEZ.JUNIN');
    setCopiedAlias(true);
    setTimeout(() => setCopiedAlias(false), 2000);
  };

  const handleSendPaymentProof = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentNotified(true);
    setTimeout(() => {
      const newRcp: PaymentReceipt = {
        id: `rcp-${Date.now().toString().slice(-4)}`,
        contractId: contract.id,
        month: 'Noviembre 2024',
        amount: contract.currentAmount + (contract.expensesAmount || 0),
        date: new Date().toLocaleDateString('es-AR'),
        status: 'en_revision',
        method: paymentMethod
      };
      setReceipts([newRcp, ...receipts]);
      setIsNotifyPaymentOpen(false);
      setPaymentNotified(false);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12 text-[#191C1E]">
      {/* App Header */}
      <div className="bg-[#091426] text-white p-6 sm:p-7 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] relative overflow-hidden border border-[#1E293B]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#6CF8BB] font-bold">
              Portal Oficial del Inquilino
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold mt-1 text-white">
              Hola, {contract.tenantName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-[#6CF8BB]" />
              {contract.propertyAddress} ({contract.city})
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 text-left sm:text-right">
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">Inmobiliaria:</span>
            <span className="text-xs font-bold text-white">{currentTenant.name}</span>
          </div>
        </div>
      </div>

      {/* Main Payment & ICL Countdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* CARD 1: Próximo Vencimiento */}
        <div className="bg-white p-5 rounded-xl border border-[#E6E8EA] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-[#091426]" /> Estado de Cuenta
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#006C49] border border-emerald-200">
                Al Día
              </span>
            </div>

            <div className="text-2xl font-bold font-mono text-[#191C1E]">
              {formatCurrency(contract.currentAmount + (contract.expensesAmount || 0))}
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">
              Alquiler: {formatCurrency(contract.currentAmount)} + Expensas: {formatCurrency(contract.expensesAmount || 0)}
            </p>

            <div className="mt-4 p-3 bg-[#F7F9FB] rounded-xl border border-[#E6E8EA] text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Vencimiento del mes:</span>
                <span className="font-bold text-[#191C1E]">10 de Noviembre</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 mt-2 pt-2 border-t border-[#E6E8EA]">
                <span>Alias CBU Inmobiliaria:</span>
                <button
                  onClick={handleCopyAlias}
                  className="flex items-center gap-1 font-mono font-bold text-[#091426] hover:text-[#006C49] transition-colors"
                >
                  <span>INMO.GOMEZ.JUNIN</span>
                  {copiedAlias ? <Check className="w-3.5 h-3.5 text-[#006C49]" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsNotifyPaymentOpen(true)}
            className="mt-5 w-full py-2.5 bg-[#091426] hover:bg-[#1E293B] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Upload className="w-4 h-4" />
            Notificar Pago / Enviar Comprobante
          </button>
        </div>

        {/* CARD 2: Transparencia de Aumento ICL / IPC */}
        <div className="bg-white p-5 rounded-xl border border-[#E6E8EA] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#006C49]" /> Transparencia Legal
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F2F4F6] text-[#091426] border border-[#E6E8EA]">
                Ley 27.551 ({contract.indexType})
              </span>
            </div>

            <h3 className="text-sm font-semibold text-[#191C1E]">
              Próxima Actualización de Alquiler
            </h3>
            <p className="text-xl font-bold font-mono text-[#091426] mt-1">
              01 de Noviembre de 2025
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              (Ajuste anual según índice oficial)
            </p>

            <div className="mt-4 p-3 bg-[#F7F9FB] rounded-xl border border-[#E6E8EA] text-xs text-slate-600 space-y-1">
              <p>• <strong>Índice oficial:</strong> ICL publicado a diario por el Banco Central.</p>
              <p>• <strong>Sin sorpresas:</strong> La inmobiliaria te notificará el cálculo 15 días antes.</p>
            </div>
          </div>

          <button
            onClick={() => setIsReportIssueOpen(true)}
            className="mt-5 w-full py-2.5 bg-white hover:bg-[#F2F4F6] text-[#191C1E] font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 border border-[#CBD5E1] shadow-2xs active:scale-[0.98]"
          >
            <Wrench className="w-4 h-4 text-slate-500" />
            Reportar Incidencia de Mantenimiento
          </button>
        </div>

      </div>

      {/* Historial de Recibos y Comprobantes Descargables */}
      <div className="bg-white p-5 rounded-xl border border-[#E6E8EA] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)]">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#E6E8EA]">
          <div>
            <h3 className="text-sm font-bold text-[#191C1E]">
              Historial de Recibos Oficiales
            </h3>
            <p className="text-xs text-slate-500">Comprobantes con firma digital y sello del Martillero</p>
          </div>
          <FileText className="w-5 h-5 text-slate-400" />
        </div>

        <div className="divide-y divide-[#E6E8EA]">
          {receipts.map((rcp) => (
            <div key={rcp.id} className="py-3 flex items-center justify-between hover:bg-[#F7F9FB] px-2 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#006C49] flex items-center justify-center font-bold text-xs border border-emerald-200">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-[#191C1E]">{rcp.month}</h4>
                  <span className="text-[11px] text-slate-400">Abonado el {rcp.date} • {rcp.method}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold font-mono text-[#191C1E]">
                  {formatCurrency(rcp.amount)}
                </span>
                <button
                  onClick={() => generateRentReceiptPDF(
                    contract.tenantName,
                    contract.propertyAddress,
                    rcp.month,
                    rcp.amount,
                    contract.indexType,
                    rcp.id
                  )}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F2F4F6] text-slate-700 rounded-lg text-xs font-semibold border border-[#CBD5E1] transition-colors shadow-2xs active:scale-[0.98]"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" /> PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NOTIFY PAYMENT MODAL */}
      {isNotifyPaymentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091426]/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-xl p-6 border border-[#E6E8EA] shadow-2xl">
            <h3 className="text-base font-bold text-[#191C1E] mb-1 flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#006C49]" />
              Notificar Pago de Alquiler
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Adjuntá tu comprobante de transferencia bancaria para que el departamento de cobranzas acredite el pago.
            </p>

            <form onSubmit={handleSendPaymentProof} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Monto Transferido
                </label>
                <input
                  type="text"
                  readOnly
                  value={formatCurrency(contract.currentAmount + (contract.expensesAmount || 0))}
                  className="w-full px-3 py-2 bg-[#F7F9FB] font-bold font-mono text-xs text-[#191C1E] rounded-xl border border-[#E6E8EA]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Método de Pago
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#E6E8EA] rounded-xl text-xs text-[#191C1E] focus:outline-none focus:ring-1 focus:ring-[#091426]"
                >
                  <option value="Transferencia Bancaria">Transferencia Bancaria (CBU/CVU)</option>
                  <option value="Mercado Pago">Mercado Pago</option>
                  <option value="Depósito en Efectivo">Depósito en Efectivo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Adjuntar Comprobante (PNG / JPG / PDF)
                </label>
                <div className="border-2 border-dashed border-[#CBD5E1] rounded-xl p-5 text-center hover:border-[#091426] cursor-pointer bg-[#F7F9FB]">
                  <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1.5" />
                  <span className="text-xs font-semibold text-slate-700 block">
                    Arrastrá tu comprobante aquí o hacé clic para buscar
                  </span>
                  <span className="text-[10px] text-slate-400">Tamaño máx: 10MB</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsNotifyPaymentOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-[#191C1E]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={paymentNotified}
                  className="px-4 py-2 bg-[#006C49] hover:bg-[#007D55] text-white font-bold text-xs rounded-xl shadow-sm active:scale-[0.98]"
                >
                  {paymentNotified ? 'Enviando...' : 'Enviar a la Inmobiliaria'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REPORT ISSUE MODAL */}
      {isReportIssueOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091426]/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-xl p-6 border border-[#E6E8EA] shadow-2xl">
            <h3 className="text-base font-bold text-[#191C1E] mb-1 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#091426]" />
              Reportar Incidencia de Mantenimiento
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Se creará un ticket para el propietario y el martillero administrador.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); alert('Incidencia reportada con éxito. El equipo de mantenimiento te contactará a la brevedad.'); setIsReportIssueOpen(false); }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Rubro / Categoría
                </label>
                <select
                  value={issueCategory}
                  onChange={(e) => setIssueCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#E6E8EA] rounded-xl text-xs text-[#191C1E] focus:outline-none focus:ring-1 focus:ring-[#091426]"
                >
                  <option value="Plomería / Agua">Plomería / Filtración de Agua</option>
                  <option value="Electricidad">Electricidad / Corte de Suministro</option>
                  <option value="Gas / Calefacción">Gas / Calefón o Termotanque</option>
                  <option value="Cerrajería">Cerrajería / Puertas</option>
                  <option value="Otro">Otro problema edilicio</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Descripción detallada
                </label>
                <textarea
                  rows={3}
                  required
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder="Explica qué ocurre en el departamento..."
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#E6E8EA] rounded-xl text-xs text-[#191C1E] focus:outline-none focus:ring-1 focus:ring-[#091426]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsReportIssueOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-[#191C1E]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#091426] hover:bg-[#1E293B] text-white font-bold text-xs rounded-xl shadow-sm active:scale-[0.98]"
                >
                  Enviar Reporte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
