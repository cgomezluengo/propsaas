import React, { useState } from 'react';
import { 
  FileText, TrendingUp, Calculator, Download, Plus, Search, 
  CheckCircle, Building, Printer, RefreshCw 
} from 'lucide-react';
import { Contract, Property, Tenant } from '../types';
import { mockContracts, mockProperties } from '../data/mockData';
import { formatCurrency, calculateUpdatedRent, exportContractsToCSV, generateRentReceiptPDF } from '../utils/calculations';

interface Props {
  currentTenant: Tenant;
}

export const ContractsModule: React.FC<Props> = ({ currentTenant }) => {
  const [activeTab, setActiveTab] = useState<'contracts' | 'properties'>('contracts');
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [properties] = useState<Property[]>(mockProperties);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Calculator Modal State
  const [selectedContractForCalc, setSelectedContractForCalc] = useState<Contract | null>(null);
  const [calcIndexType, setCalcIndexType] = useState<'ICL' | 'IPC' | 'CASA_PROPIA'>('ICL');
  const [calcPercentage, setCalcPercentage] = useState<number>(115.4);
  const [isUpdating, setIsUpdating] = useState(false);

  // New Contract Form Modal
  const [isNewContractOpen, setIsNewContractOpen] = useState(false);
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantCuit, setNewTenantCuit] = useState('20-');
  const [newAddress, setNewAddress] = useState('');
  const [newAmount, setNewAmount] = useState(400000);
  const [newIndex, setNewIndex] = useState<'ICL' | 'IPC' | 'CASA_PROPIA'>('ICL');

  // Handle calculation update
  const handleApplyCalculatedRent = () => {
    if (!selectedContractForCalc) return;
    setIsUpdating(true);

    const newAmount = calculateUpdatedRent(selectedContractForCalc.currentAmount, calcPercentage);

    setTimeout(() => {
      setContracts(prev => prev.map(c => {
        if (c.id === selectedContractForCalc.id) {
          return {
            ...c,
            currentAmount: newAmount,
            status: 'vigente',
            nextAdjustmentDate: '01/11/2025'
          };
        }
        return c;
      }));
      setIsUpdating(false);
      
      // Auto trigger PDF
      generateRentReceiptPDF(
        selectedContractForCalc.tenantName,
        selectedContractForCalc.propertyAddress,
        'Noviembre 2024 (Ajuste ICL)',
        newAmount,
        calcIndexType,
        `REC-${Date.now().toString().slice(-6)}`
      );

      setSelectedContractForCalc(null);
    }, 600);
  };

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    const newContract: Contract = {
      id: `ctr-${Date.now()}`,
      tenantName: newTenantName,
      tenantCuit: newTenantCuit,
      tenantEmail: 'contacto@inquilino.com',
      tenantPhone: '+54 236 4559900',
      propertyAddress: newAddress,
      city: currentTenant.city,
      startDate: new Date().toISOString().split('T')[0],
      expirationDate: '31/12/2026',
      currentAmount: Number(newAmount),
      currency: 'ARS',
      nextAdjustmentDate: '01/06/2025',
      indexType: newIndex,
      adjustmentFrequency: 'anual',
      status: 'vigente',
      expensesAmount: 35000
    };

    setContracts([newContract, ...contracts]);
    setIsNewContractOpen(false);
    setNewTenantName('');
    setNewAddress('');
  };

  return (
    <div className="space-y-6 animate-fadeIn text-[#191C1E]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-[#E6E8EA] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)]">
        <div>
          <h1 className="text-xl font-bold text-[#191C1E]">
            Gestión de Contratos & Actualizaciones Legales
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Cálculo automatizado de aumentos de alquiler con índices del BCRA / INDEC y administración de inmuebles.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => exportContractsToCSV(contracts)}
            className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#F2F4F6] active:scale-[0.98] text-[#191C1E] text-xs font-semibold rounded-xl border border-[#CBD5E1] transition-all shadow-2xs"
          >
            <Download className="w-4 h-4 text-slate-500" /> Exportar CSV
          </button>
          
          <button
            onClick={() => setIsNewContractOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#091426] hover:bg-[#1E293B] active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Nuevo Contrato
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E6E8EA] gap-4">
        <button
          onClick={() => setActiveTab('contracts')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'contracts'
              ? 'border-[#091426] text-[#091426]'
              : 'border-transparent text-slate-500 hover:text-[#191C1E]'
          }`}
        >
          <FileText className="w-4 h-4" /> Contratos de Alquiler ({contracts.length})
        </button>
        <button
          onClick={() => setActiveTab('properties')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'properties'
              ? 'border-[#091426] text-[#091426]'
              : 'border-transparent text-slate-500 hover:text-[#191C1E]'
          }`}
        >
          <Building className="w-4 h-4" /> Inventario de Inmuebles ({properties.length})
        </button>
      </div>

      {/* TAB 1: CONTRACTS LIST */}
      {activeTab === 'contracts' && (
        <div className="bg-white rounded-xl border border-[#E6E8EA] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="p-3.5 border-b border-[#E6E8EA] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por inquilino o dirección..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#F7F9FB] border border-[#E6E8EA] rounded-lg text-xs text-[#191C1E] focus:outline-none focus:ring-1 focus:ring-[#091426]"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Mostrando {contracts.length} contratos activos en {currentTenant.city} y alrededores
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F9FB] text-slate-500 uppercase tracking-wider font-bold border-b border-[#E6E8EA]">
                <tr>
                  <th className="px-5 py-3.5">Inquilino / CUIT</th>
                  <th className="px-5 py-3.5">Inmueble / Ciudad</th>
                  <th className="px-5 py-3.5">Canon Actual</th>
                  <th className="px-5 py-3.5">Próximo Ajuste</th>
                  <th className="px-5 py-3.5">Índice</th>
                  <th className="px-5 py-3.5">Estado</th>
                  <th className="px-5 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E8EA]">
                {contracts
                  .filter(c => c.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) || c.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((contract) => (
                    <tr key={contract.id} className="hover:bg-[#F7F9FB] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-[#191C1E]">{contract.tenantName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{contract.tenantCuit}</div>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="text-[#191C1E] font-medium">{contract.propertyAddress}</div>
                        <div className="text-[11px] text-slate-400">{contract.city}</div>
                      </td>

                      <td className="px-5 py-3.5 font-bold font-mono text-[#191C1E]">
                        {formatCurrency(contract.currentAmount)}
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-[#191C1E] font-mono">{contract.nextAdjustmentDate}</div>
                        <div className="text-[10px] text-slate-400 capitalize">{contract.adjustmentFrequency}</div>
                      </td>

                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 bg-[#F2F4F6] text-[#091426] border border-[#E6E8EA] rounded-md font-mono font-bold text-[10px]">
                          {contract.indexType}
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        {contract.status === 'pendiente_actualizacion' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Pendiente Ajuste
                          </span>
                        )}
                        {contract.status === 'vigente' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#006C49] border border-emerald-200">
                            Vigente
                          </span>
                        )}
                        {contract.status === 'proximo_a_vencer' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFDAD6]/60 text-[#BA1A1A] border border-[#FFDAD6]">
                            Vence Pronto
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedContractForCalc(contract);
                              setCalcIndexType((contract.indexType === 'IPC' ? 'IPC' : 'ICL') as any);
                            }}
                            className="px-2.5 py-1.5 bg-[#F2F4F6] text-[#091426] border border-[#E6E8EA] hover:bg-[#E6E8EA] font-semibold rounded-lg transition-all flex items-center gap-1 text-xs active:scale-[0.98]"
                          >
                            <Calculator className="w-3.5 h-3.5 text-[#006C49]" /> Calcular Ajuste
                          </button>

                          <button
                            onClick={() => generateRentReceiptPDF(
                              contract.tenantName,
                              contract.propertyAddress,
                              'Octubre 2024',
                              contract.currentAmount,
                              contract.indexType,
                              `REC-${contract.id.slice(-4)}`
                            )}
                            className="p-1.5 text-slate-500 hover:text-[#091426] rounded-lg hover:bg-[#F2F4F6] transition-colors border border-transparent hover:border-[#E6E8EA]"
                            title="Generar Recibo de Alquiler en PDF"
                          >
                            <Printer className="w-3.5 h-3.5" />
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

      {/* TAB 2: PROPERTIES INVENTORY */}
      {activeTab === 'properties' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((prop) => (
            <div
              key={prop.id}
              className="bg-white rounded-xl border border-[#E6E8EA] overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.06)] hover:border-[#CBD5E1] transition-all group"
            >
              <div className="h-44 relative overflow-hidden bg-slate-100">
                <img
                  src={prop.images[0]}
                  alt={prop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                  <span className="px-2 py-0.5 bg-[#091426]/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase rounded-md">
                    {prop.operationType}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md text-white ${
                    prop.status === 'disponible' ? 'bg-[#006C49]' :
                    prop.status === 'reservada' ? 'bg-amber-600' : 'bg-slate-700'
                  }`}>
                    {prop.status}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="text-base font-bold font-mono text-[#191C1E]">
                  {formatCurrency(prop.price, prop.currency)}
                </div>
                <h4 className="font-semibold text-xs text-[#191C1E] mt-1 line-clamp-1">
                  {prop.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  📍 {prop.address}, {prop.city} ({prop.neighborhood})
                </p>

                <div className="mt-3 pt-3 border-t border-[#E6E8EA] flex justify-between text-[11px] text-slate-500">
                  <span>📐 {prop.coveredM2} m²</span>
                  <span>🛏 {prop.bedrooms} dorm</span>
                  <span>🚿 {prop.bathrooms} baños</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CALCULATOR MODAL (Professional Polish Theme) */}
      {selectedContractForCalc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091426]/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-xl overflow-hidden border border-[#E6E8EA] shadow-2xl">
            {/* Modal Header */}
            <div className="bg-[#091426] text-white p-5 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#6CF8BB]" />
                  <h3 className="text-base font-bold text-white">
                    Calculadora Legal de Actualización
                  </h3>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Inquilino: {selectedContractForCalc.tenantName} • {selectedContractForCalc.propertyAddress}
                </p>
              </div>
              <button
                onClick={() => setSelectedContractForCalc(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Indices selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Índice Legal Aplicable
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'ICL', name: 'ICL (BCRA)', desc: 'Ley 27.551' },
                    { id: 'IPC', name: 'IPC (INDEC)', desc: 'Inflación oficial' },
                    { id: 'CASA_PROPIA', name: 'Casa Propia', desc: 'Salarial' }
                  ].map((idx) => (
                    <button
                      key={idx.id}
                      type="button"
                      onClick={() => setCalcIndexType(idx.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        calcIndexType === idx.id
                          ? 'border-[#091426] bg-[#F2F4F6] ring-1 ring-[#091426]'
                          : 'border-[#E6E8EA] bg-white hover:bg-[#F7F9FB]'
                      }`}
                    >
                      <div className="font-bold text-xs text-[#191C1E]">{idx.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{idx.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Percentage input */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Variación Acumulada del Período
                  </label>
                  <span className="text-xs font-bold font-mono text-[#006C49]">
                    +{calcPercentage}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="250"
                  step="0.1"
                  value={calcPercentage}
                  onChange={(e) => setCalcPercentage(parseFloat(e.target.value))}
                  className="w-full h-2 bg-[#E6E8EA] rounded-lg appearance-none cursor-pointer accent-[#091426]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>Base INDEC / BCRA</span>
                  <span>Ajuste Anual Estimado</span>
                </div>
              </div>

              {/* Calculation Summary Box */}
              <div className="bg-[#091426] text-white p-4 rounded-xl space-y-2 border border-[#1E293B]">
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Canon Locativo Actual:</span>
                  <span className="font-bold text-white">
                    {formatCurrency(selectedContractForCalc.currentAmount)}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Incremento Aplicado (+{calcPercentage}%):</span>
                  <span className="font-bold text-[#6CF8BB]">
                    +{formatCurrency(selectedContractForCalc.currentAmount * (calcPercentage / 100))}
                  </span>
                </div>

                <div className="pt-2.5 border-t border-[#1E293B] flex justify-between items-baseline">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Nuevo Monto a Liquidar:
                  </span>
                  <span className="text-xl font-bold font-mono text-white">
                    {formatCurrency(calculateUpdatedRent(selectedContractForCalc.currentAmount, calcPercentage))}
                  </span>
                </div>
              </div>

              {/* Legal Notice */}
              <p className="text-[11px] text-slate-500 leading-relaxed">
                ⚖️ <strong>Cláusula de Transparencia:</strong> Al aplicar este aumento, el sistema enviará una notificación preventiva al inquilino vía WhatsApp y generará el recibo y adenda en PDF con firma del Martillero.
              </p>
            </div>

            {/* Actions */}
            <div className="p-4 bg-[#F7F9FB] border-t border-[#E6E8EA] flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedContractForCalc(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-[#191C1E]"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={handleApplyCalculatedRent}
                className="px-4 py-2 bg-[#006C49] hover:bg-[#007D55] text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
              >
                {isUpdating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                {isUpdating ? 'Aplicando...' : 'Aplicar Aumento & Descargar PDF'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW CONTRACT MODAL */}
      {isNewContractOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091426]/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 border border-[#E6E8EA] shadow-2xl">
            <h3 className="text-base font-bold text-[#191C1E] mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#006C49]" />
              Dar de Alta Nuevo Contrato de Locación
            </h3>

            <form onSubmit={handleCreateContract} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Nombre del Inquilino / Empresa
                </label>
                <input
                  type="text"
                  required
                  value={newTenantName}
                  onChange={(e) => setNewTenantName(e.target.value)}
                  placeholder="Ej: Laura Santillán"
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#E6E8EA] rounded-xl text-xs text-[#191C1E] focus:outline-none focus:ring-1 focus:ring-[#091426]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    CUIT Inquilino
                  </label>
                  <input
                    type="text"
                    required
                    value={newTenantCuit}
                    onChange={(e) => setNewTenantCuit(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#E6E8EA] rounded-xl text-xs text-[#191C1E] focus:outline-none focus:ring-1 focus:ring-[#091426] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Índice de Ajuste
                  </label>
                  <select
                    value={newIndex}
                    onChange={(e: any) => setNewIndex(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#E6E8EA] rounded-xl text-xs text-[#191C1E] focus:outline-none focus:ring-1 focus:ring-[#091426]"
                  >
                    <option value="ICL">ICL (Banco Central)</option>
                    <option value="IPC">IPC (INDEC)</option>
                    <option value="CASA_PROPIA">Casa Propia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Dirección del Inmueble
                </label>
                <input
                  type="text"
                  required
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Ej: Av. San Martín 450, Piso 2A"
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#E6E8EA] rounded-xl text-xs text-[#191C1E] focus:outline-none focus:ring-1 focus:ring-[#091426]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Monto Inicial del Alquiler (ARS)
                </label>
                <input
                  type="number"
                  required
                  value={newAmount}
                  onChange={(e) => setNewAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#E6E8EA] rounded-xl text-xs text-[#191C1E] focus:outline-none focus:ring-1 focus:ring-[#091426] font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsNewContractOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-[#191C1E]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#091426] hover:bg-[#1E293B] text-white font-bold text-xs rounded-xl shadow-sm active:scale-[0.98]"
                >
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
