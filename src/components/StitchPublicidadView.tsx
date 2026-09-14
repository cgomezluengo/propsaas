import React, { useState } from 'react';
import { AdCampaign, PropertyItem } from '../types';

interface Props {
  campaigns: AdCampaign[];
  properties: PropertyItem[];
  onAddCampaign: (campaign: AdCampaign) => void;
  onUpdateCampaign: (campaign: AdCampaign) => void;
}

export const StitchPublicidadView: React.FC<Props> = ({
  campaigns,
  properties,
  onAddCampaign,
  onUpdateCampaign,
}) => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(properties[0]?.id || '');
  const [platformFormat, setPlatformFormat] = useState<'instagram' | 'whatsapp' | 'facebook'>('instagram');
  const [copiedText, setCopiedText] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);

  // New Campaign Form
  const [campTitle, setCampTitle] = useState('');
  const [campPlatform, setCampPlatform] = useState<AdCampaign['platform']>('Meta Ads (Instagram/FB)');
  const [campBudget, setCampBudget] = useState<number>(85000);

  const selectedProperty = properties.find(p => p.id === selectedPropertyId) || properties[0];

  // Auto-generated copy for property
  const generateAdCopy = () => {
    if (!selectedProperty) return '';
    if (platformFormat === 'whatsapp') {
      return `🏡 *¡NUEVO INGRESO EN ALQUILER!* 🏡\n\n📍 *Ubicación:* ${selectedProperty.address}\n💰 *Precio:* ${selectedProperty.price}\n📐 *Superficie:* ${selectedProperty.coveredM2} m² cubiertos\n🛏 *Comodidades:* ${selectedProperty.bedrooms} dorm. • ${selectedProperty.bathrooms} baño/s\n\n🔑 ¡Disponible para coordinar visita hoy mismo! Escribinos para reservar tu turno.`;
    }
    if (platformFormat === 'facebook') {
      return `✨ OPORTUNIDAD DESTACADA EN ${selectedProperty.operation.toUpperCase()} ✨\n\nPresentamos esta excelente propiedad ubicada en ${selectedProperty.address}.\n\nCaracterísticas principales:\n✅ ${selectedProperty.title}\n✅ Valor: ${selectedProperty.price}\n✅ ${selectedProperty.bedrooms} dormitorios y ${selectedProperty.bathrooms} baños\n✅ Superficie cubierta de ${selectedProperty.coveredM2} m²\n\nPara más información, requisitos o coordinar una visita personalizada, coméntanos esta publicación o envíanos un WhatsApp directo.`;
    }
    // Default Instagram
    return `🔥 ¡Exclusivo en PropSaaS Inmobiliaria! 🔥\n\n${selectedProperty.title} en ${selectedProperty.operation} ✨\n\n📍 ${selectedProperty.address}\n💵 ${selectedProperty.price}\n🛌 ${selectedProperty.bedrooms} Ambientes amplios y luminosos\n🛁 ${selectedProperty.bathrooms} Baño completo\n📏 ${selectedProperty.coveredM2} m² totales\n\n📲 Tocá el link de nuestra bio o envianos un mensaje directo para coordinar tu visita con un martillero.\n\n#Inmobiliaria #Alquiler #Propiedades #${selectedProperty.type.replace(/\s+/g, '')} #OportunidadInmobiliaria`;
  };

  const handleCopyCopy = () => {
    navigator.clipboard.writeText(generateAdCopy());
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const newCamp: AdCampaign = {
      id: `ad-${Date.now()}`,
      platform: campPlatform,
      campaignTitle: campTitle || 'Campaña Publicitaria',
      budgetMonthly: Number(campBudget) || 50000,
      spendSoFar: 0,
      leadsCount: 0,
      costPerLead: 0,
      status: 'Activa',
      syncStatus: 'Sincronizado'
    };

    onAddCampaign(newCamp);
    setIsCampaignModalOpen(false);
    setCampTitle('');
  };

  const totalMonthlyBudget = campaigns.reduce((acc, c) => acc + c.budgetMonthly, 0);
  const totalLeadsGenerated = campaigns.reduce((acc, c) => acc + c.leadsCount, 0);
  const totalSpend = campaigns.reduce((acc, c) => acc + c.spendSoFar, 0);
  const avgCpl = totalLeadsGenerated > 0 ? Math.round(totalSpend / totalLeadsGenerated) : 0;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 pb-24 md:pb-8">
      
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#E0E3E5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006C49]">campaign</span>
            <h2 className="text-lg font-bold text-[#091426] tracking-tight">
              Publicidad y Difusión de Propiedades
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">
            Generador de avisos para publicar en Instagram, WhatsApp y Facebook, y estado de portales (Zonaprop, Argenprop, Mercado Libre).
          </p>
        </div>

        <button
          onClick={() => setIsCampaignModalOpen(true)}
          className="bg-[#091426] hover:bg-[#1E293B] text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-sm shrink-0 transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">add_chart</span>
          + Nueva Campaña / Portal
        </button>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E0E3E5] shadow-xs">
          <p className="text-[#45474C] text-[11px] font-bold uppercase tracking-wider mb-1">Presupuesto Mensual Pauta</p>
          <p className="text-xl sm:text-2xl font-bold font-mono text-[#091426]">
            ${totalMonthlyBudget.toLocaleString('es-AR')}
          </p>
          <span className="text-[10px] text-slate-400">Total asignado en marketing</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E0E3E5] shadow-xs">
          <p className="text-[#45474C] text-[11px] font-bold uppercase tracking-wider mb-1">Inversión Ejecutada</p>
          <p className="text-xl sm:text-2xl font-bold font-mono text-[#091426]">
            ${totalSpend.toLocaleString('es-AR')}
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold">
            {totalMonthlyBudget > 0 ? Math.round((totalSpend / totalMonthlyBudget) * 100) : 0}% consumido
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E0E3E5] shadow-xs">
          <p className="text-[#006C49] text-[11px] font-bold uppercase tracking-wider mb-1">Leads Comerciales</p>
          <p className="text-xl sm:text-2xl font-bold font-mono text-[#006C49]">
            {totalLeadsGenerated}
          </p>
          <span className="text-[10px] text-slate-400">Prospectos captados</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E0E3E5] shadow-xs">
          <p className="text-[#45474C] text-[11px] font-bold uppercase tracking-wider mb-1">Costo por Lead (CPL)</p>
          <p className="text-xl sm:text-2xl font-bold font-mono text-[#091426]">
            ${avgCpl.toLocaleString('es-AR')}
          </p>
          <span className="text-[10px] text-slate-400">Promedio multi-canal</span>
        </div>
      </div>

      {/* Grid: Campaigns List + Marketing Studio Creator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Sindicación y Campañas (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-[#E0E3E5] shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#E0E3E5] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-[#091426]">Canales Publicitarios &amp; Portales Conectados</h3>
                <p className="text-[11px] text-slate-500">Estado de feeds y campañas activas.</p>
              </div>
            </div>

            <div className="divide-y divide-[#E0E3E5] text-xs">
              {campaigns.map(camp => (
                <div key={camp.id} className="p-4 hover:bg-[#F7F9FB] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#091426] text-white">
                        {camp.platform}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-[#006C49] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#006C49]"></span>
                        {camp.syncStatus}
                      </span>
                    </div>
                    <p className="font-bold text-sm text-[#091426]">{camp.campaignTitle}</p>
                    <p className="text-[11px] text-slate-500">
                      Inversión: <strong className="font-mono text-slate-700">${camp.spendSoFar.toLocaleString('es-AR')}</strong> de ${camp.budgetMonthly.toLocaleString('es-AR')}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between gap-1 text-right shrink-0">
                    <p className="text-sm font-bold font-mono text-[#006C49]">
                      {camp.leadsCount} <span className="text-[10px] font-sans text-slate-500 font-normal">consultas</span>
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      CPL: ${camp.costPerLead.toLocaleString('es-AR')}
                    </p>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {camp.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Generador Express de Piezas para Redes (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-[#E0E3E5] shadow-xs p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E0E3E5]">
              <span className="material-symbols-outlined text-[#006C49]">auto_awesome</span>
              <div>
                <h3 className="font-bold text-sm text-[#091426]">Marketing Studio Express</h3>
                <p className="text-[11px] text-slate-500">Genera creativos y copies listos para publicar.</p>
              </div>
            </div>

            {/* Select Property */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Seleccionar Inmueble</label>
              <select
                value={selectedPropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#E0E3E5] rounded-lg text-xs font-semibold text-[#091426]"
              >
                {properties.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title} - {p.price}
                  </option>
                ))}
              </select>
            </div>

            {/* Format Switcher */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Formato / Red Social</label>
              <div className="grid grid-cols-3 gap-1.5 bg-[#F7F9FB] p-1 rounded-lg border border-[#E0E3E5]">
                <button
                  type="button"
                  onClick={() => setPlatformFormat('instagram')}
                  className={`py-1.5 text-xs font-bold rounded transition-all ${platformFormat === 'instagram' ? 'bg-[#091426] text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                  Instagram
                </button>
                <button
                  type="button"
                  onClick={() => setPlatformFormat('whatsapp')}
                  className={`py-1.5 text-xs font-bold rounded transition-all ${platformFormat === 'whatsapp' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => setPlatformFormat('facebook')}
                  className={`py-1.5 text-xs font-bold rounded transition-all ${platformFormat === 'facebook' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                  Facebook
                </button>
              </div>
            </div>

            {/* Visual Card Preview */}
            {selectedProperty && (
              <div className="rounded-xl overflow-hidden border border-[#E0E3E5] bg-white shadow-2xs relative">
                <img
                  src={selectedProperty.image}
                  alt={selectedProperty.title}
                  className="w-full h-36 object-cover"
                />
                <div className="absolute top-2 right-2 bg-[#091426]/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-xs font-bold font-mono">
                  {selectedProperty.price}
                </div>
                <div className="p-3">
                  <p className="font-bold text-xs text-[#091426]">{selectedProperty.title}</p>
                  <p className="text-[11px] text-slate-500">{selectedProperty.address}</p>
                </div>
              </div>
            )}

            {/* Generated Copy */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-600 uppercase">Texto Publicitario Generado:</span>
                <button
                  type="button"
                  onClick={handleCopyCopy}
                  className="text-xs font-bold text-[#006C49] hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">{copiedText ? 'check' : 'content_copy'}</span>
                  {copiedText ? '¡Copiado!' : 'Copiar Copy'}
                </button>
              </div>
              <textarea
                readOnly
                rows={5}
                value={generateAdCopy()}
                className="w-full p-2.5 bg-[#F7F9FB] border border-[#E0E3E5] rounded-lg text-xs font-sans text-slate-800"
              />
            </div>

          </div>
        </div>

      </div>

      {/* New Campaign Modal */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091426]/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-xl p-5 sm:p-6 border border-[#E0E3E5] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[#E0E3E5]">
              <h3 className="font-bold text-base text-[#091426]">+ Nueva Campaña o Portal</h3>
              <button onClick={() => setIsCampaignModalOpen(false)} className="text-slate-400 font-bold p-1">✕</button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Plataforma</label>
                <select
                  value={campPlatform}
                  onChange={(e: any) => setCampPlatform(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg font-semibold"
                >
                  <option value="Meta Ads (Instagram/FB)">Meta Ads (Instagram / Facebook)</option>
                  <option value="Zonaprop">Zonaprop</option>
                  <option value="Argenprop">Argenprop</option>
                  <option value="Mercado Libre">Mercado Libre Inmuebles</option>
                  <option value="Google Ads">Google Ads Inmobiliario</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Título de la Campaña *</label>
                <input
                  type="text"
                  required
                  value={campTitle}
                  onChange={(e) => setCampTitle(e.target.value)}
                  placeholder="Ej: Campaña Alquileres Estudiantes"
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Presupuesto Mensual Asignado ($)</label>
                <input
                  type="number"
                  required
                  value={campBudget}
                  onChange={(e) => setCampBudget(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg font-mono font-bold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#E0E3E5]">
                <button
                  type="button"
                  onClick={() => setIsCampaignModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#091426] hover:bg-[#1E293B] text-white font-bold text-xs rounded-lg shadow-sm"
                >
                  Guardar Campaña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
