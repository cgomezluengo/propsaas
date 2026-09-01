import React, { useState } from 'react';
import { 
  Smartphone, FileText, Download, CheckCircle, Clock, AlertCircle, 
  Upload, Wrench, ArrowRight, ShieldCheck, ChevronRight, Home, CreditCard 
} from 'lucide-react';
import { Contract, PaymentReceipt, Tenant, User } from '../types';
import { mockContracts, mockTenantReceipts } from '../data/mockData';
import { formatCurrency, generateRentReceiptPDF } from '../utils/calculations';

interface Props {
  currentTenant: Tenant;
  currentUser: User;
}

export const TenantPortalModule: React.FC<Props> = ({ currentTenant, currentUser }) => {
  const contract: Contract = mockContracts[0]; // Martín Ramírez in Junín
  const [receipts, setReceipts] = useState<PaymentReceipt[]>(mockTenantReceipts);
  const [isNotifyPaymentOpen, setIsNotifyPaymentOpen] = useState(false);
  const [isReportIssueOpen, setIsReportIssueOpen] = useState(false);
  const [paymentNotified, setPaymentNotified] = useState(false);

  // Form states
  const [paymentMethod, setPaymentMethod] = useState('Transferencia Bancaria');
  const [issueDescription, setIssueDescription] = useState('');
  const [issueCategory, setIssueCategory] = useState('Plomería / Agua');

  const handleSendPaymentProof = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentNotified(true);
    setTimeout(() => {
      const newRcp: PaymentReceipt = {
        id: `rcp-${Date.now().toString().slice(-4)}`,
        contractId: contract.id,
        month: 'Agosto 2024',
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
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Mobile-Friendly App Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-6 rounded-xl shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#091426] font-bold">
              Portal Oficial del Inquilino
            </span>
            <h1 className="text-xl sm:text-2xl font-bold mt-1 text-white">
              Hola, {contract.tenantName}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 mt-1 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-[#091426]" />
              {contract.propertyAddress} ({contract.city})
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-left sm:text-right">
            <span className="text-[10px] text-[#091426] uppercase block font-medium">Administra:</span>
            <span className="text-xs font-bold text-white">{currentTenant.name}</span>
          </div>
        </div>
      </div>

      {/* Main Payment & ICL Countdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* CARD 1: Próximo Vencimiento */}
        <div className="bg-white  p-5 rounded-xl border border-slate-200  shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500  flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-[#091426]" /> Estado de Cuenta
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50  text-green-700  border border-green-200 ">
                Al Día
              </span>
            </div>

            <div className="text-2xl font-bold font-mono text-slate-900 ">
              {formatCurrency(contract.currentAmount + (contract.expensesAmount || 0))}
            </div>
            <p className="text-xs text-slate-500  mt-0.5 font-mono">
              Alquiler: {formatCurrency(contract.currentAmount)} + Expensas: {formatCurrency(contract.expensesAmount || 0)}
            </p>

            <div className="mt-4 p-3 bg-slate-50  rounded-lg border border-slate-200  text-xs">
              <div className="flex justify-between text-slate-600 ">
                <span>Vencimiento:</span>
                <span className="font-semibold text-slate-900 ">10 de Agosto</span>
              </div>
              <div className="flex justify-between text-slate-600  mt-1.5">
                <span>Alias CBU Inmobiliaria:</span>
                <span className="font-mono font-bold text-[#091426] ">INMO.GOMEZ.JUNIN</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsNotifyPaymentOpen(true)}
            className="mt-5 w-full py-2.5 bg-[#091426] hover:bg-[#1E293B] text-white font-semibold text-xs uppercase tracking-wider rounded-lg transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Notificar Pago / Enviar Comprobante
          </button>
        </div>

        {/* CARD 2: Transparencia de Aumento ICL / IPC */}
        <div className="bg-white  p-5 rounded-xl border border-slate-200  shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500  flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#091426]" /> Transparencia Legal
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F2F4F6]  text-[#091426]  border border-[#E6E8EA] ">
                Ley 27.551 (ICL)
              </span>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 ">
              Próxima Actualización de Alquiler
            </h3>
            <p className="text-xl font-bold font-mono text-[#091426]  mt-1">
              01 de Noviembre de 2024
            </p>
            <p className="text-xs text-slate-500  mt-0.5">
              (Faltan ~62 días para el ajuste anual)
            </p>

            <div className="mt-4 p-3 bg-[#F2F4F6]/60  rounded-lg border border-blue-100  text-xs text-slate-600  space-y-1">
              <p>• <strong>Índice:</strong> ICL publicado a diario por el Banco Central.</p>
              <p>• <strong>Estimación transparente:</strong> Sin sorpresas, la inmobiliaria te enviará el valor final 15 días antes.</p>
            </div>
          </div>

          <button
            onClick={() => setIsReportIssueOpen(true)}
            className="mt-5 w-full py-2.5 bg-slate-100  hover:bg-slate-200 :bg-slate-700 text-slate-800  font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-2 border border-slate-200 "
          >
            <Wrench className="w-4 h-4 text-slate-500" />
            Reportar Incidencia de Mantenimiento
          </button>
        </div>

      </div>

      {/* Historial de Recibos y Comprobantes Descargables */}
      <div className="bg-white  p-5 rounded-xl border border-slate-200  shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 ">
              Historial de Recibos Oficiales
            </h3>
            <p className="text-xs text-slate-500">Comprobantes válidos con firma digital y sello del Martillero</p>
          </div>
          <FileText className="w-5 h-5 text-slate-400" />
        </div>

        <div className="divide-y divide-slate-100 ">
          {receipts.map((rcp) => (
            <div key={rcp.id} className="py-3 flex items-center justify-between hover:bg-slate-50 :bg-slate-800/30 px-2 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-50  text-green-600 flex items-center justify-center font-bold text-xs border border-green-200 ">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-slate-900 ">{rcp.month}</h4>
                  <span className="text-[11px] text-slate-400">Abonado el {rcp.date} • {rcp.method}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold font-mono text-slate-900 ">
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
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white  hover:bg-slate-50 :bg-slate-700 text-slate-700  rounded-lg text-xs font-semibold border border-slate-200  transition-colors shadow-sm"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white  w-full max-w-md rounded-xl p-6 border border-slate-200  shadow-2xl">
            <h3 className="text-base font-bold text-slate-900  mb-1 flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#091426]" />
              Notificar Pago de Alquiler
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Sube el comprobante de transferencia bancaria para que el departamento de cobranzas acredite tu pago.
            </p>

            <form onSubmit={handleSendPaymentProof} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700  mb-1">
                  Monto Transferido
                </label>
                <input
                  type="text"
                  readOnly
                  value={formatCurrency(contract.currentAmount + (contract.expensesAmount || 0))}
                  className="w-full px-3 py-2 bg-slate-50  font-bold font-mono text-xs text-slate-900  rounded-lg border border-slate-200 "
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700  mb-1">
                  Método de Pago
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50  border border-slate-200  rounded-lg text-xs text-slate-900  focus:outline-none focus:ring-1 focus:ring-[#091426]"
                >
                  <option value="Transferencia Bancaria">Transferencia Bancaria (CBU/CVU)</option>
                  <option value="Mercado Pago">Mercado Pago</option>
                  <option value="Depósito en Efectivo">Depósito en Efectivo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700  mb-1">
                  Adjuntar Comprobante (PNG / JPG / PDF)
                </label>
                <div className="border-2 border-dashed border-slate-200  rounded-lg p-5 text-center hover:border-[#091426] cursor-pointer bg-slate-50 ">
                  <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1.5" />
                  <span className="text-xs font-semibold text-slate-700  block">
                    Arrastra tu comprobante aquí o haz clic para buscar
                  </span>
                  <span className="text-[10px] text-slate-400">Tamaño máx: 10MB</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsNotifyPaymentOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 "
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={paymentNotified}
                  className="px-4 py-2 bg-[#091426] hover:bg-[#1E293B] text-white font-semibold text-xs rounded-lg shadow-sm"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white  w-full max-w-md rounded-xl p-6 border border-slate-200  shadow-2xl">
            <h3 className="text-base font-bold text-slate-900  mb-1 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#091426]" />
              Reportar Incidencia de Mantenimiento
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Se creará un ticket para el propietario y el martillero administrador.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); alert('Incidencia reportada con éxito. El equipo de mantenimiento te contactará a la brevedad.'); setIsReportIssueOpen(false); }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700  mb-1">
                  Rubro / Categoría
                </label>
                <select
                  value={issueCategory}
                  onChange={(e) => setIssueCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50  border border-slate-200  rounded-lg text-xs text-slate-900  focus:outline-none focus:ring-1 focus:ring-[#091426]"
                >
                  <option value="Plomería / Agua">Plomería / Filtración de Agua</option>
                  <option value="Electricidad">Electricidad / Corte de Suministro</option>
                  <option value="Gas / Calefacción">Gas / Calefón o Termotanque</option>
                  <option value="Cerrajería">Cerrajería / Puertas</option>
                  <option value="Otro">Otro problema edilicio</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700  mb-1">
                  Descripción detallada
                </label>
                <textarea
                  rows={3}
                  required
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder="Explica qué ocurre en el departamento..."
                  className="w-full px-3 py-2 bg-slate-50  border border-slate-200  rounded-lg text-xs text-slate-900  focus:outline-none focus:ring-1 focus:ring-[#091426]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsReportIssueOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 "
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#091426] hover:bg-[#1E293B] text-white font-semibold text-xs rounded-lg shadow-sm"
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
