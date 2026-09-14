import React, { useState } from 'react';
import { ContractItem } from '../types';
import { generateIpcIncreaseCertificatePDF } from '../utils/pdfGenerator';

interface Props {
  contracts: ContractItem[];
  onAddContract: (contract: ContractItem) => void;
  onUpdateContract: (contract: ContractItem) => void;
  onDeleteContract: (id: string) => void;
}

export const StitchContratosView: React.FC<Props> = ({
  contracts,
  onAddContract,
  onUpdateContract,
  onDeleteContract,
}) => {
  const [subView, setSubView] = useState<'todos' | 'control_ipc_4m'>('control_ipc_4m');
  const [calculatingContract, setCalculatingContract] = useState<ContractItem | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // IPC 4-Month Compound Calculator State
  const [ipcMonth1, setIpcMonth1] = useState<number>(4.1);
  const [ipcMonth2, setIpcMonth2] = useState<number>(3.8);
  const [ipcMonth3, setIpcMonth3] = useState<number>(3.6);
  const [ipcMonth4, setIpcMonth4] = useState<number>(3.3);

  // Form State for new contract
  const [tenantName, setTenantName] = useState('');
  const [tenantPhone, setTenantPhone] = useState('+54 236 4');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [currentAmount, setCurrentAmount] = useState(380000);
  const [indexType, setIndexType] = useState<'ICL (Banco Central)' | 'IPC (Inflación INDEC)' | 'Casa Propia'>('IPC (Inflación INDEC)');
  const [adjustmentMonths, setAdjustmentMonths] = useState<number>(4);

  // Copied message status
  const [copiedMsg, setCopiedMsg] = useState(false);

  // Calculate cumulative compound IPC for 4 months: (1+m1)*(1+m2)*(1+m3)*(1+m4) - 1
  const compoundRatePercent = Number(
    (((1 + ipcMonth1 / 100) * (1 + ipcMonth2 / 100) * (1 + ipcMonth3 / 100) * (1 + ipcMonth4 / 100) - 1) * 100).toFixed(2)
  );

  const calculateProjectedAmount = (base: number) => {
    return Math.round(base * (1 + compoundRatePercent / 100));
  };

  const handleOpenIpcModal = (contract: ContractItem) => {
    setCalculatingContract(contract);
    if (contract.ipcMonthlyRates && contract.ipcMonthlyRates.length === 4) {
      setIpcMonth1(contract.ipcMonthlyRates[0]);
      setIpcMonth2(contract.ipcMonthlyRates[1]);
      setIpcMonth3(contract.ipcMonthlyRates[2]);
      setIpcMonth4(contract.ipcMonthlyRates[3]);
    } else {
      setIpcMonth1(4.1);
      setIpcMonth2(3.8);
      setIpcMonth3(3.6);
      setIpcMonth4(3.3);
    }
  };

  const handleApplyAdjustment = () => {
    if (!calculatingContract) return;
    const newAmount = calculateProjectedAmount(calculatingContract.currentAmount);

    // Compute future date +4 months
    const dateNow = new Date();
    dateNow.setMonth(dateNow.getMonth() + 4);
    const monthsNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const newNextDate = `15 de ${monthsNames[dateNow.getMonth()]} ${dateNow.getFullYear()}`;

    const updated: ContractItem = {
      ...calculatingContract,
      currentAmount: newAmount,
      status: 'Al Día',
      lastIncreasePercent: compoundRatePercent,
      nextAdjustmentDate: newNextDate,
      monthsToAdjustment: 4,
      adjustmentPeriodMonths: 4,
      internalAuditStatus: 'al_dia',
      ipcMonthlyRates: [ipcMonth1, ipcMonth2, ipcMonth3, ipcMonth4],
      lastAdjustmentDate: new Date().toLocaleDateString('es-AR')
    };

    onUpdateContract(updated);
    alert(`Aumento cuatrimestral IPC aplicado con éxito.\nNuevo alquiler: $${newAmount.toLocaleString('es-AR')} (+${compoundRatePercent}%).\nPróximo ajuste programado: ${newNextDate}.`);
    setCalculatingContract(null);
  };

  const getFormalNotificationText = () => {
    if (!calculatingContract) return '';
    const newAmount = calculateProjectedAmount(calculatingContract.currentAmount);
    return `Hola ${calculatingContract.tenantName}! Te escribimos de la administración por el ajuste cuatrimestral de alquiler de ${calculatingContract.propertyAddress}.

• Alquiler anterior: $${calculatingContract.currentAmount.toLocaleString('es-AR')}
• Aumento IPC (4 meses INDEC): +${compoundRatePercent}%
• Nuevo alquiler a abonar: $${newAmount.toLocaleString('es-AR')}

El nuevo valor rige a partir de la próxima liquidación mensual. Cualquier consulta estamos a disposición.`;
  };

  const handleCopyNotification = () => {
    const text = getFormalNotificationText();
    navigator.clipboard.writeText(text);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2500);
  };

  const handleDownloadIpcPdf = () => {
    if (!calculatingContract) return;
    const newAmount = calculateProjectedAmount(calculatingContract.currentAmount);
    const dateNow = new Date();
    dateNow.setMonth(dateNow.getMonth() + 4);
    const monthsNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const newNextDate = `15 de ${monthsNames[dateNow.getMonth()]} ${dateNow.getFullYear()}`;

    generateIpcIncreaseCertificatePDF({
      tenantName: calculatingContract.tenantName,
      propertyAddress: calculatingContract.propertyAddress,
      previousAmount: calculatingContract.currentAmount,
      newAmount: newAmount,
      compoundPercent: compoundRatePercent,
      monthlyRates: [ipcMonth1, ipcMonth2, ipcMonth3, ipcMonth4],
      effectiveDate: new Date().toLocaleDateString('es-AR'),
      nextAdjustmentDate: newNextDate,
      agencyName: 'Inmobiliaria Gómez & Asoc.',
      agencyCity: 'Junín, Buenos Aires'
    });
  };

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    const item: ContractItem = {
      id: `cont-${Date.now()}`,
      tenantName: tenantName || 'Nuevo Inquilino',
      tenantPhone: tenantPhone,
      propertyAddress: propertyAddress || 'Propiedad en Alquiler',
      currentAmount: Number(currentAmount) || 350000,
      indexType: indexType,
      adjustmentPeriodMonths: adjustmentMonths,
      nextAdjustmentDate: `En ${adjustmentMonths} meses`,
      monthsToAdjustment: adjustmentMonths,
      status: 'Al Día',
      paymentStatus: 'Pagado',
      lastIncreasePercent: 0,
      ipcMonthlyRates: [4.0, 3.8, 3.5, 3.2],
      internalAuditStatus: 'al_dia',
      contractStartDate: new Date().toLocaleDateString('es-AR')
    };

    onAddContract(item);
    setIsNewModalOpen(false);
    setTenantName('');
    setPropertyAddress('');
  };

  // 4-Month IPC Contracts
  const ipc4mContracts = contracts.filter(c => c.indexType.includes('IPC') || c.adjustmentPeriodMonths === 4);
  const urgentAjustes = contracts.filter(c => c.status === 'Ajuste Pendiente' || c.status === 'Por Vencer' || c.internalAuditStatus === 'vencido_liquidar');
  const alertPreventiva = contracts.filter(c => c.internalAuditStatus === 'preventivo_30d');

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 pb-24 md:pb-8">
      
      {/* Top Banner & KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E0E3E5] shadow-xs border-l-4 border-l-[#BA1A1A]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[#45474C] text-[11px] font-bold uppercase tracking-wider mb-1">
                Aumentos Vencidos / A Liquidar
              </p>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-[#BA1A1A]">
                {urgentAjustes.length}
              </p>
            </div>
            <span className="w-8 h-8 rounded-full bg-red-50 text-[#BA1A1A] flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">schedule</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Cumplieron los 4 meses en ciclo IPC
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E0E3E5] shadow-xs border-l-4 border-l-amber-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[#45474C] text-[11px] font-bold uppercase tracking-wider mb-1">
                Aviso Preventivo (30 días)
              </p>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-amber-700">
                {alertPreventiva.length}
              </p>
            </div>
            <span className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">notification_important</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Pre-liquidación y aviso al propietario
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E0E3E5] shadow-xs border-l-4 border-l-[#006C49]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[#006C49] text-[11px] font-bold uppercase tracking-wider mb-1">
                Total Contratos Activos
              </p>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-[#091426]">
                {contracts.length} <span className="text-xs text-[#006C49] font-sans font-bold">({ipc4mContracts.length} en IPC 4M)</span>
              </p>
            </div>
            <span className="w-8 h-8 rounded-full bg-emerald-50 text-[#006C49] flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">verified</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Control de canones y cobros al día
          </p>
        </div>

      </div>

      {/* Mode Sub-navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-[#E0E3E5] shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setSubView('control_ipc_4m')}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 shrink-0 ${
              subView === 'control_ipc_4m'
                ? 'bg-[#091426] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-emerald-400">trending_up</span>
            Control Interno: Ajustes IPC Cada 4 Meses
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {ipc4mContracts.length}
            </span>
          </button>

          <button
            onClick={() => setSubView('todos')}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 shrink-0 ${
              subView === 'todos'
                ? 'bg-[#091426] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">format_list_bulleted</span>
            Todos los Contratos (ICL / IPC / Otros)
          </button>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="bg-[#006C49] hover:bg-[#007D55] text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center justify-center gap-1.5 shadow-xs shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          + Nuevo Contrato de Locación
        </button>
      </div>

      {/* View 1: Control Interno IPC 4 Meses */}
      {subView === 'control_ipc_4m' && (
        <div className="space-y-4">
          
          {/* Internal Audit Alert Callout */}
          <div className="bg-gradient-to-r from-[#091426] to-[#1E293B] text-white p-4 sm:p-5 rounded-xl shadow-sm border border-[#1E293B] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[11px] border border-emerald-500/30">
                  Régimen Post-DNU 70/2023
                </span>
                <span className="text-xs text-slate-300">Auditoría Interna de Locaciones</span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Tablero de Control de Variación Acumulada IPC Cuatrimestral
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl">
                Supervisa el vencimiento de cada ciclo de 4 meses. Permite calcular el factor compuesto mes a mes publicado por INDEC y liquidar el nuevo canon con notificación automática al locador y locatario.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg border border-white/10 shrink-0">
              <span className="material-symbols-outlined text-emerald-400 text-2xl">calculate</span>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-300">Índice IPC Compuesto Actual</p>
                <p className="text-lg font-mono font-bold text-white">+{compoundRatePercent}% <span className="text-xs font-normal text-slate-300 font-sans">(4 meses)</span></p>
              </div>
            </div>
          </div>

          {/* Cards for Mobile & Desktop Responsive Table */}
          <div className="bg-white rounded-xl border border-[#E0E3E5] shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#E0E3E5] flex justify-between items-center">
              <div>
                <h4 className="font-bold text-sm text-[#091426]">Control de Alquileres (Ajuste Cuatrimestral IPC)</h4>
                <p className="text-[11px] text-slate-500">Semáforo de vencimientos para liquidar a los 4 meses.</p>
              </div>
            </div>

            {/* Mobile View: Cards */}
            <div className="block md:hidden divide-y divide-[#E0E3E5]">
              {ipc4mContracts.map(cont => {
                const isDue = cont.status === 'Ajuste Pendiente' || cont.status === 'Por Vencer' || cont.internalAuditStatus === 'vencido_liquidar';
                const isWarning = cont.internalAuditStatus === 'preventivo_30d';

                return (
                  <div key={cont.id} className={`p-4 space-y-3 ${isDue ? 'bg-red-50/30' : isWarning ? 'bg-amber-50/20' : ''}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="font-bold text-sm text-[#091426]">{cont.tenantName}</h5>
                        <p className="text-xs text-slate-500">{cont.propertyAddress}</p>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">{cont.tenantPhone}</p>
                      </div>
                      {isDue ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-[#BA1A1A] border border-red-200 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#BA1A1A] animate-ping"></span>
                          Vencido (Liquidar)
                        </span>
                      ) : isWarning ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                          Aviso en 30 días
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-[#006C49] border border-emerald-200 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#006C49]"></span>
                          Al Día
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-[#F7F9FB] p-2.5 rounded-lg text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Alquiler Actual</span>
                        <span className="font-mono font-bold text-[#091426] text-sm">
                          ${cont.currentAmount.toLocaleString('es-AR')}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Próximo Ajuste</span>
                        <span className="font-bold text-[#091426] text-xs">
                          {cont.nextAdjustmentDate}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenIpcModal(cont)}
                      className={`w-full py-2.5 rounded-lg font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all ${
                        isDue 
                          ? 'bg-[#BA1A1A] hover:bg-red-700 text-white'
                          : 'bg-[#091426] hover:bg-[#1E293B] text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">calculate</span>
                      {isDue ? 'Liquidar Aumento IPC Ahora' : 'Calcular Aumento IPC'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F7F9FB] border-b border-[#E0E3E5] text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                    <th className="p-4">Semáforo</th>
                    <th className="p-4">Inquilino &amp; Inmueble</th>
                    <th className="p-4">Alquiler Actual</th>
                    <th className="p-4">Último Aumento</th>
                    <th className="p-4">Vencimiento (4M)</th>
                    <th className="p-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0E3E5] text-xs">
                  {ipc4mContracts.map(cont => {
                    const isDue = cont.status === 'Ajuste Pendiente' || cont.status === 'Por Vencer' || cont.internalAuditStatus === 'vencido_liquidar';
                    const isWarning = cont.internalAuditStatus === 'preventivo_30d';

                    return (
                      <tr key={cont.id} className={`hover:bg-[#F7F9FB] transition-colors ${isDue ? 'bg-red-50/40' : isWarning ? 'bg-amber-50/30' : ''}`}>
                        <td className="p-4">
                          {isDue ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-[#BA1A1A] border border-red-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#BA1A1A] animate-ping"></span>
                              Vencido (Liquidar)
                            </span>
                          ) : isWarning ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                              Aviso en 30 días
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-[#006C49] border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#006C49]"></span>
                              Al Día
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-sm text-[#091426]">{cont.tenantName}</p>
                          <p className="text-slate-500 text-[11px]">{cont.propertyAddress}</p>
                          <span className="text-[10px] text-slate-400 font-mono">Tel: {cont.tenantPhone}</span>
                        </td>
                        <td className="p-4 font-mono font-bold text-[#091426] text-sm">
                          ${cont.currentAmount.toLocaleString('es-AR')}
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-slate-700">+{cont.lastIncreasePercent}%</p>
                          <span className="text-[10px] text-slate-400">Fecha: {cont.lastAdjustmentDate || 'Inicio'}</span>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-[#091426]">{cont.nextAdjustmentDate}</p>
                          <span className="text-[10px] text-slate-500">Ciclo: Cada 4 meses (IPC)</span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenIpcModal(cont)}
                              className={`px-3 py-1.5 rounded-lg font-bold text-xs shadow-2xs flex items-center gap-1 transition-all ${
                                isDue 
                                  ? 'bg-[#BA1A1A] hover:bg-red-700 text-white animate-pulse'
                                  : 'bg-[#091426] hover:bg-[#1E293B] text-white'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[14px]">calculate</span>
                              {isDue ? 'Liquidar Aumento' : 'Simular IPC'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Todos los Contratos */}
      {subView === 'todos' && (
        <div className="bg-white rounded-xl border border-[#E0E3E5] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#E0E3E5] flex justify-between items-center">
            <div>
              <h3 className="font-bold text-base text-[#091426]">Todos los Contratos de Locación</h3>
              <p className="text-xs text-slate-500">Esquemas de ajuste ICL (Banco Central), IPC (INDEC) y Casa Propia.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F7F9FB] border-b border-[#E0E3E5] text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                  <th className="p-4">Inquilino &amp; Inmueble</th>
                  <th className="p-4">Alquiler Actual</th>
                  <th className="p-4">Índice &amp; Frecuencia</th>
                  <th className="p-4">Próximo Ajuste</th>
                  <th className="p-4">Estado Cobro</th>
                  <th className="p-4 text-right">Acciones</th>
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
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Cada {cont.adjustmentPeriodMonths || 4} meses
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-[#091426]">{cont.nextAdjustmentDate}</p>
                      <span className="text-[10px] text-slate-400">Último: +{cont.lastIncreasePercent}%</span>
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
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenIpcModal(cont)}
                          className="px-3 py-1.5 bg-[#091426] hover:bg-[#1E293B] text-white font-bold rounded-lg transition-all shadow-2xs"
                        >
                          Ajustar
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar contrato de "${cont.tenantName}"?`)) {
                              onDeleteContract(cont.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-[#BA1A1A] hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* IPC 4-Month Internal Calculator Modal */}
      {calculatingContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091426]/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-xl p-5 sm:p-6 border border-[#E0E3E5] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[#E0E3E5]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006C49] text-xl">calculate</span>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#091426]">Liquidación y Control Interno IPC Cuatrimestral</h3>
                  <p className="text-[11px] text-slate-500">Cálculo de inflación compuesta mes a mes (INDEC).</p>
                </div>
              </div>
              <button onClick={() => setCalculatingContract(null)} className="text-slate-400 hover:text-slate-600 font-bold p-1">✕</button>
            </div>

            {/* Target Contract Header */}
            <div className="p-3 bg-[#F7F9FB] rounded-xl border border-[#E0E3E5] space-y-1">
              <div className="flex justify-between items-center">
                <p className="font-bold text-sm text-[#091426]">{calculatingContract.tenantName}</p>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#091426] text-white">
                  Ciclo: 4 Meses (IPC)
                </span>
              </div>
              <p className="text-slate-500 text-xs">{calculatingContract.propertyAddress}</p>
              <div className="pt-1 flex items-center justify-between text-xs">
                <span className="text-slate-600">Canon actual vigente:</span>
                <strong className="font-mono text-[#091426] text-sm">${calculatingContract.currentAmount.toLocaleString('es-AR')}</strong>
              </div>
            </div>

            {/* 4 Month IPC Inputs */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                Inflación mensual oficial del cuatrimestre (% INDEC):
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="bg-[#F7F9FB] p-2.5 rounded-lg border border-[#E0E3E5]">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mes 1 (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={ipcMonth1}
                    onChange={(e) => setIpcMonth1(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 bg-white border border-[#75777D]/30 rounded font-mono font-bold text-sm text-[#091426]"
                  />
                </div>

                <div className="bg-[#F7F9FB] p-2.5 rounded-lg border border-[#E0E3E5]">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mes 2 (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={ipcMonth2}
                    onChange={(e) => setIpcMonth2(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 bg-white border border-[#75777D]/30 rounded font-mono font-bold text-sm text-[#091426]"
                  />
                </div>

                <div className="bg-[#F7F9FB] p-2.5 rounded-lg border border-[#E0E3E5]">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mes 3 (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={ipcMonth3}
                    onChange={(e) => setIpcMonth3(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 bg-white border border-[#75777D]/30 rounded font-mono font-bold text-sm text-[#091426]"
                  />
                </div>

                <div className="bg-[#F7F9FB] p-2.5 rounded-lg border border-[#E0E3E5]">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mes 4 (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={ipcMonth4}
                    onChange={(e) => setIpcMonth4(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 bg-white border border-[#75777D]/30 rounded font-mono font-bold text-sm text-[#091426]"
                  />
                </div>
              </div>
            </div>

            {/* Compound Calculation Result Banner */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#006C49] uppercase tracking-wider">
                  Variación Compuesta del Cuatrimestre:
                </span>
                <span className="text-lg font-mono font-bold text-[#006C49]">
                  +{compoundRatePercent}%
                </span>
              </div>

              <div className="flex justify-between items-baseline pt-1 border-t border-emerald-200">
                <span className="text-xs text-slate-600">Nuevo Canon Locativo a Liquidar:</span>
                <span className="text-2xl font-mono font-bold text-[#006C49]">
                  ${calculateProjectedAmount(calculatingContract.currentAmount).toLocaleString('es-AR')}
                </span>
              </div>

              <p className="text-[10px] text-slate-500 pt-1">
                Aumento neto mensual: +${(calculateProjectedAmount(calculatingContract.currentAmount) - calculatingContract.currentAmount).toLocaleString('es-AR')}. Se reprogramará el próximo vencimiento automáticamente a 4 meses.
              </p>
            </div>

            {/* Notification Copy Box */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Minuta de Notificación para WhatsApp / Email:
                </p>
                <button
                  type="button"
                  onClick={handleCopyNotification}
                  className="text-xs font-bold text-[#006C49] hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">
                    {copiedMsg ? 'check' : 'content_copy'}
                  </span>
                  {copiedMsg ? '¡Copiado!' : 'Copiar Texto'}
                </button>
              </div>
              <textarea
                readOnly
                rows={3}
                value={getFormalNotificationText()}
                className="w-full p-2.5 bg-[#F7F9FB] border border-[#E0E3E5] rounded-lg text-[11px] text-slate-700 font-sans"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row justify-between gap-2 pt-3 border-t border-[#E0E3E5]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadIpcPdf}
                  className="w-full sm:w-auto px-3.5 py-2 bg-white text-slate-700 border border-[#E0E3E5] hover:bg-slate-50 font-bold text-xs rounded-lg shadow-2xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#006C49]">picture_as_pdf</span>
                  Descargar Constancia PDF
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCalculatingContract(null)}
                  className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleApplyAdjustment}
                  className="flex-1 sm:flex-none px-4 py-2 bg-[#006C49] hover:bg-[#007D55] text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">verified</span>
                  Aplicar Aumento (+4 Meses)
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* New Contract Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091426]/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-xl p-6 border border-[#E0E3E5] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[#E0E3E5]">
              <h3 className="text-sm font-bold text-[#091426]">+ Alta de Contrato de Locación</h3>
              <button onClick={() => setIsNewModalOpen(false)} className="text-slate-400 font-bold p-1">✕</button>
            </div>

            <form onSubmit={handleCreateContract} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Nombre Inquilino *</label>
                <input
                  type="text"
                  required
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  placeholder="Ej: Laura Méndez"
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Teléfono Inquilino *</label>
                <input
                  type="tel"
                  required
                  value={tenantPhone}
                  onChange={(e) => setTenantPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Inmueble / Dirección *</label>
                <input
                  type="text"
                  required
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  placeholder="Ej: Depto Calle Gandini 85, Piso 1"
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Monto Inicial ($)</label>
                  <input
                    type="number"
                    required
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Índice Oficial</label>
                  <select
                    value={indexType}
                    onChange={(e: any) => setIndexType(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg text-xs font-semibold"
                  >
                    <option value="IPC (Inflación INDEC)">IPC (INDEC) - Recomendado</option>
                    <option value="ICL (Banco Central)">ICL (BCRA)</option>
                    <option value="Casa Propia">Casa Propia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Frecuencia de Ajuste</label>
                <select
                  value={adjustmentMonths}
                  onChange={(e) => setAdjustmentMonths(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg text-xs font-semibold text-[#091426]"
                >
                  <option value={4}>Cada 4 meses (Cuatrimestral - Estándar Post-DNU)</option>
                  <option value={3}>Cada 3 meses (Trimestral)</option>
                  <option value={6}>Cada 6 meses (Semestral)</option>
                  <option value={12}>Cada 12 meses (Anual)</option>
                </select>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006C49] text-base">verified</span>
                Habilitará el seguimiento en el panel de control interno cuatrimestral.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsNewModalOpen(false)} className="px-3 py-2 text-xs font-semibold text-slate-500">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-[#091426] text-white font-bold text-xs rounded-lg shadow-sm">
                  Guardar Contrato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
