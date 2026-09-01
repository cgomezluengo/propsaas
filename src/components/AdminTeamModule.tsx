import React, { useState } from 'react';
import { 
  Users, Shield, Key, UserPlus, CheckCircle, Lock, 
  Building2, Mail, Phone, ShieldAlert, ArrowRight, Settings 
} from 'lucide-react';
import { Tenant, User } from '../types';
import { mockUsers } from '../data/mockData';

interface Props {
  currentTenant: Tenant;
  currentUser: User;
}

export const AdminTeamModule: React.FC<Props> = ({ currentTenant, currentUser }) => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<User['role']>('martillero');

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      tenantId: currentTenant.id,
      phone: '+54 236 4'
    };
    setUsers([...users, newUser]);
    setIsInviteModalOpen(false);
    setInviteName('');
    setInviteEmail('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Administración de Agencia & Equipo
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestión de roles RBAC, miembros del equipo martillero y configuración de seguridad multi-tenant.
          </p>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-[#091426] hover:bg-[#1E293B] text-white text-xs font-semibold rounded-lg transition-all shadow-sm"
        >
          <UserPlus className="w-4 h-4" /> Invitar Miembro
        </button>
      </div>

      {/* Agency Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Razón Social / Martillero
          </span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
            {currentTenant.name}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 font-mono">CUIT: {currentTenant.cuit}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Jurisdicción & Sede
          </span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
            {currentTenant.city}, {currentTenant.province}
          </h3>
          <p className="text-xs text-[#091426] dark:text-[#091426] font-medium mt-0.5">Depto. Judicial Junín</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Plan Contratado
          </span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1 uppercase text-[#091426] dark:text-[#091426]">
            {currentTenant.plan}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Aislamiento PostgreSQL RLS activo</p>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
            Usuarios con Acceso a la Inmobiliaria ({users.length})
          </h3>
          <span className="text-xs text-slate-500">Separación estricta por Tenant ID</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3">Usuario</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Rol en la Agencia</th>
                <th className="px-5 py-3">2FA Activo</th>
                <th className="px-5 py-3 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:border-slate-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 overflow-hidden text-xs">
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                        ) : (
                          u.name.charAt(0)
                        )}
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white">{u.name}</span>
                    </div>
                  </td>

                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300 font-mono text-xs">
                    {u.email}
                  </td>

                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      u.role === 'admin' ? 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800' :
                      u.role === 'martillero' ? 'bg-[#F2F4F6] text-[#091426] dark:bg-[#F2F4F6] dark:text-[#091426] border border-[#E6E8EA] dark:border-[#E6E8EA]' :
                      u.role === 'cobranzas' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>

                  <td className="px-5 py-3">
                    {u.twoFactorEnabled ? (
                      <span className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5" /> Habilitado
                      </span>
                    ) : (
                      <span className="text-slate-400">Desactivado</span>
                    )}
                  </td>

                  <td className="px-5 py-3 text-right">
                    <span className="text-green-600 dark:text-green-400 font-semibold">Activo</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RBAC Matrix */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3">
          Matriz de Permisos por Rol (RBAC)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-purple-600 dark:text-purple-400 block mb-1">Administrador / Titular</span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Control total: alta de contratos, cálculo y aplicación de ICL, configuración de webhooks y facturación.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-[#091426] dark:text-[#091426] block mb-1">Martillero / Ventas</span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Gestión de leads en Kanban, respuestas asistidas por IA, agenda de visitas y catálogo de inmuebles.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">Cobranzas</span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Validación de comprobantes de transferencia de inquilinos y emisión de recibos oficiales en PDF.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-green-600 dark:text-green-400 block mb-1">Inquilino (Portal Móvil)</span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Solo lectura de su propio contrato, contador de aumentos ICL, descarga de comprobantes y reporte de averías.
            </p>
          </div>
        </div>
      </div>

      {/* INVITE USER MODAL */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Invitar Miembro a la Agencia
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Se enviará un correo con un token de acceso seguro para unirse a {currentTenant.name}.
            </p>

            <form onSubmit={handleInviteUser} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Ej: Marcelo Venta"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#091426]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Email Corporativo
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="marcelo@inmobiliaria.com"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#091426]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Rol Asignado
                </label>
                <select
                  value={inviteRole}
                  onChange={(e: any) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#091426]"
                >
                  <option value="martillero">Martillero / Asesor Comercial</option>
                  <option value="cobranzas">Cobranzas & Administración</option>
                  <option value="admin">Administrador General</option>
                  <option value="inquilino">Inquilino (Acceso limitado a portal)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#091426] hover:bg-[#1E293B] text-white font-semibold text-xs rounded-lg shadow-sm"
                >
                  Enviar Invitación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
