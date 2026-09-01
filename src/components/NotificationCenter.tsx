import React from 'react';
import { 
  X, Bell, AlertTriangle, RefreshCw, Sparkles, CheckCircle, 
  CheckCheck, ArrowRight, Clock 
} from 'lucide-react';
import { AppNotification, ModuleType } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onNavigateToNotification: (module: ModuleType) => void;
}

export const NotificationCenter: React.FC<Props> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onNavigateToNotification
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-sm text-white">Centro de Notificaciones</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-500 text-[11px]">
            {notifications.filter(n => !n.read).length} no leídas
          </span>
          <button
            onClick={onMarkAllRead}
            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1 text-[11px]"
          >
            <CheckCheck className="w-3.5 h-3.5" /> Marcar todas como leídas
          </button>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (n.linkModule) {
                  onNavigateToNotification(n.linkModule);
                  onClose();
                }
              }}
              className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                !n.read 
                  ? 'bg-blue-50/40 dark:bg-slate-800 border-blue-200 dark:border-slate-700 shadow-sm' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-70'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  n.type === 'urgent' ? 'bg-red-50 text-red-600 dark:bg-rose-950/60 border border-red-200 dark:border-rose-800' :
                  n.type === 'alert' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800' :
                  n.type === 'success' ? 'bg-green-50 text-green-600 dark:bg-emerald-950/60 border border-green-200 dark:border-emerald-800' :
                  'bg-blue-50 text-blue-600 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800'
                }`}>
                  {n.type === 'urgent' && <AlertTriangle className="w-3.5 h-3.5" />}
                  {n.type === 'alert' && <RefreshCw className="w-3.5 h-3.5" />}
                  {n.type === 'success' && <Sparkles className="w-3.5 h-3.5" />}
                  {n.type === 'info' && <CheckCircle className="w-3.5 h-3.5" />}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-xs text-slate-900 dark:text-white">
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 flex items-center gap-0.5 font-mono">
                      <Clock className="w-3 h-3" /> {n.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center">
          <span className="text-[11px] text-slate-400">Push Notifications sincronizadas vía Firebase Cloud Messaging</span>
        </div>
      </div>
    </div>
  );
};
