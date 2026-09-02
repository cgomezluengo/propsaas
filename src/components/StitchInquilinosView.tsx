import React, { useState } from 'react';
import { mockTenantPortalData } from '../data/mockData';

export const StitchInquilinosView: React.FC = () => {
  const [portalData] = useState(mockTenantPortalData);
  const [uploadedReceipt, setUploadedReceipt] = useState(false);

  return (
    <div className="flex-1 flex flex-col items-center justify-start overflow-y-auto p-8 space-y-6">
      
      {/* Mobile-First Preview Container */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E0E3E5] shadow-lg overflow-hidden flex flex-col">
        
        {/* Top App Header */}
        <div className="bg-[#091426] text-white p-5 space-y-1 text-center relative">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#6FFBBE] bg-white/10 px-2 py-0.5 rounded-full inline-block mb-1">
            Portal del Inquilino
          </span>
          <h2 className="text-lg font-bold">{portalData.tenantName}</h2>
          <p className="text-xs text-[#8590A6] truncate">{portalData.propertyAddress}</p>
        </div>

        {/* State Banner */}
        <div className="p-5 bg-[#F7F9FB] border-b border-[#E0E3E5] flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Estado de Cuenta</p>
            <p className="text-base font-bold text-[#006C49] flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              {uploadedReceipt ? 'Comprobante en Revisión' : portalData.paymentStatus}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Alquiler Mensual</p>
            <p className="text-lg font-bold font-mono text-[#091426] mt-0.5">
              ${portalData.currentRent.toLocaleString('es-AR')}
            </p>
          </div>
        </div>

        {/* Transparency Banner: Next Adjustment */}
        <div className="p-5 space-y-3">
          <div className="bg-[#D8E3FB]/30 border border-[#091426]/10 rounded-xl p-4 space-y-1">
            <p className="text-[11px] font-bold uppercase text-[#091426] tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">info</span>
              Próximo Ajuste de Alquiler
            </p>
            <p className="text-xs text-slate-700 leading-relaxed">
              Tu próximo aumento será en <strong>{portalData.monthsLeft} mes ({portalData.nextAdjustmentDate})</strong>, calculado sobre la variación oficial del <strong>{portalData.indexType}</strong>.
            </p>
          </div>

          {/* Action: Upload Transfer Receipt */}
          <div className="bg-[#F7F9FB] p-4 rounded-xl border border-[#E0E3E5] space-y-2">
            <p className="text-xs font-bold text-[#091426]">¿Realizaste una transferencia bancaria?</p>
            <p className="text-[11px] text-slate-500">Subí el comprobante para que la administración lo valide al instante.</p>
            <button
              onClick={() => {
                setUploadedReceipt(true);
                alert('¡Comprobante de transferencia subido con éxito! La inmobiliaria lo validará en el día.');
              }}
              className="w-full py-2.5 bg-[#006C49] hover:bg-[#007D55] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">upload_file</span>
              {uploadedReceipt ? '✓ Comprobante Subido' : 'Subir Comprobante de Pago'}
            </button>
          </div>

          {/* History of Receipts */}
          <div className="space-y-2 pt-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider text-[11px]">
              Historial de Recibos y Comprobantes
            </p>
            <div className="divide-y divide-[#E0E3E5] bg-white rounded-xl border border-[#E0E3E5] overflow-hidden">
              {portalData.receipts.map((rec, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between hover:bg-[#F7F9FB] transition-colors">
                  <div>
                    <p className="font-bold text-xs text-[#091426]">{rec.month}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{rec.date} • ${rec.amount.toLocaleString('es-AR')}</p>
                  </div>
                  <button
                    onClick={() => alert(`Descargando Recibo Oficial PDF de ${rec.month}...`)}
                    className="text-[#006C49] text-xs font-bold hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    PDF
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
