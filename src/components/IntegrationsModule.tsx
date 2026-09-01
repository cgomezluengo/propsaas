import React, { useState } from 'react';
import { 
  Share2, CheckCircle2, RefreshCw, Copy, Check, ExternalLink, 
  Sparkles, ShieldCheck, Instagram, Facebook, Youtube, Twitter, 
  Github, MessageSquare, AlertCircle 
} from 'lucide-react';
import { IntegrationConnection, Tenant } from '../types';
import { mockIntegrations } from '../data/mockData';

interface Props {
  currentTenant: Tenant;
}

export const IntegrationsModule: React.FC<Props> = ({ currentTenant }) => {
  const [integrations, setIntegrations] = useState<IntegrationConnection[]>(mockIntegrations);
  const [autoImportLeads, setAutoImportLeads] = useState(true);
  const [autoPublishProperties, setAutoPublishProperties] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const webhookUrl = `https://api.proptechpro.com/v1/webhooks/${currentTenant.slug}`;

  const toggleConnection = (id: string) => {
    setConnectingId(id);
    setTimeout(() => {
      setIntegrations(prev => prev.map(item => {
        if (item.id === id) {
          const newConnectedState = !item.connected;
          return {
            ...item,
            connected: newConnectedState,
            accountName: newConnectedState ? `@${currentTenant.slug}_oficial` : undefined,
            lastSync: newConnectedState ? 'Sincronizado recién' : undefined
          };
        }
        return item;
      }));
      setConnectingId(null);
    }, 800);
  };

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="bg-white  p-5 rounded-xl border border-slate-200  shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 ">
              Conexiones & Redes Sociales
            </h1>
            <p className="text-xs text-slate-500  mt-1">
              Conecta tus plataformas para automatizar la captación de prospectos y la publicación de propiedades.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#F2F4F6]  text-[#091426]  px-3 py-1.5 rounded-lg border border-[#E6E8EA]  text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#091426] animate-ping"></span>
            Webhooks Ingesta Activa
          </div>
        </div>
      </div>

      {/* Toggles Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white  p-4 rounded-xl border border-slate-200  shadow-sm flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-xs text-slate-900 ">Importación Automática de Leads</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Crea prospectos en el CRM cuando pregunten por WhatsApp, Instagram o Facebook.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAutoImportLeads(!autoImportLeads)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
              autoImportLeads ? 'bg-[#091426] justify-end' : 'bg-slate-300  justify-start'
            }`}
          >
            <span className="w-4 h-4 bg-white rounded-full shadow-sm"></span>
          </button>
        </div>

        <div className="bg-white  p-4 rounded-xl border border-slate-200  shadow-sm flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-xs text-slate-900 ">Auto-Publicación de Inmuebles</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Difunde automáticamente nuevas propiedades disponibles en las historias de Instagram.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAutoPublishProperties(!autoPublishProperties)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
              autoPublishProperties ? 'bg-[#091426] justify-end' : 'bg-slate-300  justify-start'
            }`}
          >
            <span className="w-4 h-4 bg-white rounded-full shadow-sm"></span>
          </button>
        </div>
      </div>

      {/* Grid of Connections (Matches Exact Screenshot Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((item) => {
          const isBusy = connectingId === item.id;
          return (
            <div
              key={item.id}
              className={`bg-white  p-5 rounded-xl border transition-all shadow-sm flex flex-col justify-between ${
                item.connected 
                  ? 'border-[#091426]/40  ring-1 ring-blue-500/20' 
                  : 'border-slate-200 '
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-100  text-slate-800  border border-slate-200 ">
                    {item.name === 'Instagram' && <Instagram className="w-5 h-5 text-pink-600" />}
                    {item.name === 'Facebook' && <Facebook className="w-5 h-5 text-[#091426]" />}
                    {item.name === 'YouTube' && <Youtube className="w-5 h-5 text-red-600" />}
                    {item.name === 'Twitter/X' && <Twitter className="w-5 h-5 text-sky-500" />}
                    {item.name === 'WhatsApp Business' && <MessageSquare className="w-5 h-5 text-emerald-600" />}
                    {item.name === 'GitHub' && <Github className="w-5 h-5 text-slate-800 " />}
                  </div>

                  {item.connected ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50  text-green-700  border border-green-200  flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Conectado
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100  text-slate-500 border border-slate-200 ">
                      Desconectado
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-slate-900 ">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-500  mt-1 leading-relaxed">
                  {item.description}
                </p>

                {item.connected && item.accountName && (
                  <div className="mt-3 p-2.5 bg-slate-50  rounded-lg border border-slate-200  text-xs">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Cuenta vinculada:</span>
                    <span className="font-semibold text-slate-800  font-mono">{item.accountName}</span>
                    {item.leadsCapturedMonth && (
                      <span className="text-[11px] text-[#091426]  block mt-0.5 font-medium">
                        +{item.leadsCapturedMonth} leads captados este mes
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 ">
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => toggleConnection(item.id)}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                    item.connected
                      ? 'bg-rose-50 text-rose-700   border border-rose-200 hover:bg-rose-100'
                      : 'bg-[#091426] hover:bg-[#1E293B] text-white shadow-sm'
                  }`}
                >
                  {isBusy && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  {isBusy ? 'Procesando...' : item.connected ? 'Desconectar' : 'Conectar Cuenta'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Webhook Endpoint for Developers */}
      <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#091426]">
              Desarrolladores & Portales (Zonaprop / Argenprop / Meta)
            </span>
            <h3 className="text-sm font-bold text-white mt-0.5">URL de Webhook Ingesta Multi-Tenant</h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">{webhookUrl}</p>
          </div>

          <button
            onClick={handleCopyWebhook}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors border border-slate-700"
          >
            {copiedWebhook ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedWebhook ? '¡Copiado!' : 'Copiar URL Webhook'}
          </button>
        </div>
      </div>
    </div>
  );
};
