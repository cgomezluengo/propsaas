import React, { useState } from 'react';
import { ContractItem } from '../types';
import { mockContracts } from '../data/mockData';

export const StitchContratosView: React.FC = () => {
  const [contracts, setContracts] = useState<ContractItem[]>(mockContracts);
  const [calculatingContract, setCalculatingContract] = useState<ContractItem | null>(null);
  const [adjustmentRate, setAdjustmentRate] = useState<number>(34.5);

  const handleApplyAdjustment = () => {
    if (!calculatingContract) return;
    const newAmount = Math.round(calculatingContract.currentAmount * (1 + adjustmentRate / 100));

    setContracts(prev => prev.map(c => {
      if (c.id === calculatingContract.id) {
        return {
          ...c,
          currentAmount: newAmount,
          status: 'Al Día',
          lastIncreasePercent: adjustmentRate,
          nextAdjustmentDate: 'En 6 meses'
        };
      }
      return c;
    }));

    alert(`¡Aumento del ${adjustmentRate}% aplicado con éxito! Nuevo alquiler: $${newAmount.toLocaleString('es-AR')}. Se ha generado el comprobante.`);
    setCalculatingContract(null);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-8 space-y-6">
      
      {/* Top Banner & KPI Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-[#E0E3E5] shadow-xs border-l-4 border-l-[#BA1A1A]">
          <p className="text-[#45474C] text-[11px] font-bold uppercase tracking-wider mb-1">Aumentos Pendientes (Mes Actual)</p>
          <p className="text-3xl font-bold font-mono text-[#BA1A1A]">1</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#E0E3E5] shadow-xs">
          <p className="text-[#45474C] text-[11px] font-bold uppercase tracking-wider mb-1">Contratos Activos</p>
          <p className="text-3xl font-bold font-mono text-[#091426]">{contracts.length}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#E0E3E5] shadow-xs">
          <p className="text-[#006C49] text-[11px] font-bold uppercase tracking-wider mb-1">Cobranzas al Día</p>
          <p className="text-3xl font-bold font-mono text-[#006C49]">98.2%</p>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-xl border border-[#E0E3E5] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E0E3E5] flex justify-between items-center bg-white">
          <div>
            <h3 className="font-bold text-base text-[#091426]">Contratos y Actualización por Índices</h3>
            <p className="text-xs text-slate-500">Cálculo de variación ICL (Banco Central) e IPC (INDEC) en 1 clic.</p>
          </div>
          <button
            onClick={() => setCalculatingContract(contracts[0])}
            className="bg-[#006C49] hover:bg-[#007D55] text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">calculate</span>
            Calculadora ICL / IPC
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F9FB] border-b border-[#E0E3E5] text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                <th className="p-4">Inquilino &amp; Inmueble</th>
                <th className="p-4">Alquiler Actual</th>
                <th className="p-4">Índice Aplicado</th>
                <th className="p-4">Próximo Ajuste</th>
                <th className="p-4">Estado Cobro</th>
                <th className="p-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E3E5] text-xs">
              {contracts.map(cont => (
                <tr key={cont.id} className="hover:bg-[#F7F9FB] transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-sm text-[#091426]">{cont.tenantName}</p>
                    <p className="text-slate-500 text-[11px]">{cont.propertyAddress}</p>
                  </td>
                  <td className="p-4 font-mono font-bold text-[#091426] text-sm">
                    ${cont.currentAmount.toLocaleString('es-AR')}
                  </td>
                  <td className="p-4">
                    <span className="bg-[#D8E3FB]/50 text-[#091426] font-bold px-2 py-0.5 rounded text-[11px] border border-[#091426]/10">
                      {cont.indexType}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-[#091426]">{cont.nextAdjustmentDate}</p>
                    <span className="text-[10px] text-slate-400">Último ajuste: +{cont.lastIncreasePercent}%</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                      cont.paymentStatus === 'Pagado'
                        ? 'bg-emerald-100 text-[#006C49]'
                        : cont.paymentStatus === 'Pendiente de Validación'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-[#BA1A1A]'
                    }`}>
                      {cont.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setCalculatingContract(cont)}
                      className="px-3 py-1.5 bg-[#091426] hover:bg-[#1E293B] text-white font-bold rounded-lg transition-all shadow-2xs"
                    >
                      Actualizar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calculator Modal */}
      {calculatingContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091426]/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 border border-[#E0E3E5] shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#E0E3E5]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006C49]">calculate</span>
                <h3 className="font-bold text-base text-[#091426]">Ajuste de Alquiler por Índice Oficial</h3>
              </div>
              <button onClick={() => setCalculatingContract(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#F7F9FB] rounded-xl border border-[#E0E3E5]">
                <p className="font-bold text-sm text-[#091426]">{calculatingContract.tenantName}</p>
                <p className="text-slate-500">{calculatingContract.propertyAddress}</p>
                <p className="mt-2 text-slate-700">
                  Monto base actual: <strong className="font-mono text-[#091426]">${calculatingContract.currentAmount.toLocaleString('es-AR')}</strong>
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Porcentaje de Variación Acumulada ({calculatingContract.indexType})
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={adjustmentRate}
                    onChange={(e) => setAdjustmentRate(parseFloat(e.target.value) || 0)}
                    className="w-32 px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg text-sm font-mono font-bold text-[#091426]"
                  />
                  <span className="font-bold text-sm text-[#091426]">%</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                <p className="text-[11px] font-bold text-[#006C49] uppercase tracking-wider">Nuevo Alquiler Calculado:</p>
                <p className="text-2xl font-bold font-mono text-[#006C49]">
                  ${Math.round(calculatingContract.currentAmount * (1 + adjustmentRate / 100)).toLocaleString('es-AR')}
                </p>
                <p className="text-[11px] text-slate-600">Dispara notificación automática por WhatsApp y emisión de recibo PDF.</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCalculatingContract(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleApplyAdjustment}
                className="px-4 py-2 bg-[#006C49] hover:bg-[#007D55] text-white font-bold text-xs rounded-lg shadow-sm"
              >
                Aprobar y Notificar Inquilino
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
