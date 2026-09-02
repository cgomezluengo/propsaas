import React, { useState, useEffect } from 'react';
import { ContractItem, TenantPortalData, AgencyTenant } from '../types';
import { generateRentReceiptPDF } from '../utils/pdfGenerator';
import { queryReceiptsForContract, insertReceipt } from '../utils/sqliteService';

interface Props {
  contracts: ContractItem[];
  tenant: AgencyTenant;
  initialTenantName?: string;
  onUpdateContract?: (contract: ContractItem) => void;
}

export const StitchInquilinosView: React.FC<Props> = ({
  contracts,
  tenant,
  initialTenantName,
  onUpdateContract,
}) => {
  // Select active tenant / contract
  const initialMatch = initialTenantName 
    ? contracts.find(c => c.tenantName.toLowerCase().includes(initialTenantName.toLowerCase()))?.id 
    : undefined;

  const [selectedContractId, setSelectedContractId] = useState<string>(
    initialMatch || contracts[0]?.id || ''
  );
  const [receiptsList, setReceiptsList] = useState<TenantPortalData['receipts']>([]);
  const [uploadedReceipt, setUploadedReceipt] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [newPayMonth, setNewPayMonth] = useState('Septiembre 2026');
  const [newPayAmount, setNewPayAmount] = useState<number>(320000);
  const [filterQuery, setFilterQuery] = useState('');

  const activeContract = contracts.find(c => c.id === selectedContractId) || contracts[0];

  // Refresh receipts from SQLite whenever contract selection changes
  useEffect(() => {
    if (activeContract) {
      setNewPayAmount(activeContract.currentAmount);
      queryReceiptsForContract(activeContract.id, activeContract.tenantName).then(res => {
        if (res.length > 0) {
          setReceiptsList(res);
        } else {
          // Default receipts if empty
          setReceiptsList([
            {
              month: 'Agosto 2026',
              amount: activeContract.currentAmount,
              date: '05/08/2026',
              pdfUrl: '#'
            },
            {
              month: 'Julio 2026',
              amount: Math.round(activeContract.currentAmount * 0.8),
              date: '04/07/2026',
              pdfUrl: '#'
            }
          ]);
        }
      });
    }
  }, [selectedContractId, activeContract]);

  const handleDownloadPDF = (receipt: TenantPortalData['receipts'][0]) => {
    if (!activeContract) return;
    generateRentReceiptPDF({
      receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
      tenantName: activeContract.tenantName,
      propertyAddress: activeContract.propertyAddress,
      monthPeriod: receipt.month,
      amount: receipt.amount,
      paymentDate: receipt.date,
      paymentMethod: 'Transferencia Bancaria Inmediata',
      agencyName: tenant.name,
      agencyCity: tenant.city
    });
  };

  const handleRegisterPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeContract) return;

    const newRec = {
      contractId: activeContract.id,
      tenantName: activeContract.tenantName,
      month: newPayMonth,
      amount: newPayAmount,
      date: new Date().toLocaleDateString('es-AR')
    };

    await insertReceipt(newRec);
    setReceiptsList([newRec, ...receiptsList]);
    setShowPayModal(false);

    if (onUpdateContract) {
      onUpdateContract({
        ...activeContract,
        paymentStatus: 'Pagado'
      });
    }
  };

  const filteredContracts = contracts.filter(c => 
    c.tenantName.toLowerCase().includes(filterQuery.toLowerCase()) ||
    c.propertyAddress.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#F2F4F6]">
      
      {/* 1. Inquilinos Master Directory (Left Sidebar 35%) */}
      <div className="w-full md:w-[380px] bg-white border-r border-[#E0E3E5] flex flex-col shrink-0 h-full overflow-hidden">
        
        {/* Header & Search */}
        <div className="p-4 border-b border-[#E0E3E5] space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#091426] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#006C49] text-xl">group</span>
                Padrón de Inquilinos
              </h2>
              <p className="text-xs text-slate-500">{contracts.length} locatarios activos</p>
            </div>
          </div>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-sm">search</span>
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Buscar inquilino o dirección..."
              className="w-full pl-9 pr-3 py-2 bg-[#F7F9FB] border border-[#75777D]/20 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#006C49]"
            />
          </div>
        </div>

        {/* Inquilinos List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#E0E3E5]">
          {filteredContracts.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No se encontraron inquilinos con contrato activo.
            </div>
          ) : (
            filteredContracts.map((c) => {
              const isSelected = (activeContract?.id === c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedContractId(c.id);
                    setUploadedReceipt(false);
                  }}
                  className={`w-full text-left p-4 transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-[#F7F9FB] border-l-4 border-l-[#006C49]'
                      : 'hover:bg-[#F9FAFB]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    isSelected ? 'bg-[#006C49] text-white' : 'bg-[#D8E3FB] text-[#091426]'
                  }`}>
                    {c.tenantName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="font-bold text-xs text-[#091426] truncate">{c.tenantName}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.paymentStatus === 'Pagado'
                          ? 'bg-emerald-100 text-[#006C49]'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.paymentStatus}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{c.propertyAddress}</p>
                    
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 text-[11px]">
                      <span className="font-mono font-bold text-[#091426]">${c.currentAmount.toLocaleString('es-AR')}</span>
                      <span className="text-[10px] text-slate-400">Ajuste: {c.indexType.split(' ')[0]}</span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

      </div>

      {/* 2. Tenant Mobile Portal View (Right Canvas) */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-start space-y-6">
        
        {activeContract ? (
          <div className="w-full max-w-lg bg-white rounded-2xl border border-[#E0E3E5] shadow-lg overflow-hidden flex flex-col">
            
            {/* Top App Header */}
            <div className="bg-[#091426] text-white p-6 space-y-2 text-center relative">
              <div className="flex justify-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#6FFBBE] bg-white/10 px-3 py-1 rounded-full inline-block">
                  Portal de Transparencia del Inquilino
                </span>
              </div>
              <h2 className="text-xl font-bold">{activeContract.tenantName}</h2>
              <p className="text-xs text-[#8590A6] flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[14px]">location_on</span>
                {activeContract.propertyAddress}
              </p>
              <p className="text-[11px] text-[#6FFBBE] font-mono">{activeContract.tenantPhone}</p>
            </div>

            {/* State Banner */}
            <div className="p-5 bg-[#F7F9FB] border-b border-[#E0E3E5] flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Estado de Cuenta</p>
                <p className="text-sm font-bold text-[#006C49] flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  {uploadedReceipt ? 'Comprobante en Revisión' : activeContract.paymentStatus}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Alquiler Actual</p>
                <p className="text-lg font-bold font-mono text-[#091426] mt-0.5">
                  ${activeContract.currentAmount.toLocaleString('es-AR')}
                </p>
              </div>
            </div>

            {/* Portal Actions & Transparency */}
            <div className="p-6 space-y-5">
              
              {/* Transparency Banner: Next Adjustment */}
              <div className="bg-[#D8E3FB]/40 border border-[#091426]/10 rounded-xl p-4 space-y-1.5">
                <p className="text-xs font-bold uppercase text-[#091426] tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#006C49]">trending_up</span>
                  Próximo Ajuste de Alquiler
                </p>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Tu próximo aumento está previsto para <strong>{activeContract.nextAdjustmentDate}</strong>, calculado según el índice oficial <strong>{activeContract.indexType}</strong>.
                </p>
                <p className="text-[11px] text-slate-500">
                  Última actualización aplicada: <strong>+{activeContract.lastIncreasePercent}%</strong>
                </p>
              </div>

              {/* Action: Upload Transfer Receipt / Pay */}
              <div className="bg-[#F7F9FB] p-5 rounded-xl border border-[#E0E3E5] space-y-3">
                <div>
                  <p className="text-xs font-bold text-[#091426]">¿Realizaste una transferencia bancaria?</p>
                  <p className="text-[11px] text-slate-500">Notificá tu pago o subí el comprobante para validación automática.</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setUploadedReceipt(true);
                      alert('¡Comprobante de transferencia subido! La administración lo validará en el día.');
                    }}
                    className="flex-1 py-2.5 bg-[#006C49] hover:bg-[#007D55] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">upload_file</span>
                    {uploadedReceipt ? '✓ En Revisión' : 'Subir Comprobante'}
                  </button>

                  <button
                    onClick={() => setShowPayModal(true)}
                    className="py-2.5 px-3 bg-[#091426] hover:bg-[#1E293B] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                    + Registrar Pago
                  </button>
                </div>
              </div>

              {/* History of Receipts with PDF Download */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                    Historial de Recibos y Comprobantes
                  </p>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                    {receiptsList.length} emitidos
                  </span>
                </div>

                <div className="divide-y divide-[#E0E3E5] bg-white rounded-xl border border-[#E0E3E5] overflow-hidden">
                  {receiptsList.map((rec, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between hover:bg-[#F7F9FB] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#006C49] flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm">receipt</span>
                        </div>
                        <div>
                          <p className="font-bold text-xs text-[#091426]">{rec.month}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{rec.date} • ${rec.amount.toLocaleString('es-AR')}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDownloadPDF(rec)}
                        className="bg-white hover:bg-emerald-50 text-[#006C49] border border-[#006C49]/30 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-2xs transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">download</span>
                        PDF Oficial
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="p-12 text-center text-slate-400">
            Selecciona un inquilino para ver su portal.
          </div>
        )}

      </div>

      {/* Modal Registrar Pago Inmediato */}
      {showPayModal && activeContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091426]/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-xl p-6 border border-[#E0E3E5] shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#E0E3E5]">
              <h3 className="text-sm font-bold text-[#091426] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006C49]">receipt_long</span>
                Registrar Pago &amp; Emisión de Recibo
              </h3>
              <button onClick={() => setShowPayModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleRegisterPayment} className="space-y-3 text-xs">
              <div className="p-3 bg-[#F7F9FB] rounded-lg border border-[#E0E3E5]">
                <p className="font-bold text-[#091426]">{activeContract.tenantName}</p>
                <p className="text-slate-500 text-[11px]">{activeContract.propertyAddress}</p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Período / Mes Abonado</label>
                <input
                  type="text"
                  required
                  value={newPayMonth}
                  onChange={(e) => setNewPayMonth(e.target.value)}
                  placeholder="Ej: Septiembre 2026"
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Importe Abonado ($)</label>
                <input
                  type="number"
                  required
                  value={newPayAmount}
                  onChange={(e) => setNewPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg font-mono font-bold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-3 py-2 font-semibold text-slate-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#006C49] hover:bg-[#007D55] text-white font-bold rounded-lg shadow-sm"
                >
                  Guardar y Emitir Recibo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
