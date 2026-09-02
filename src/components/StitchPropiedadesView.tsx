import React, { useState } from 'react';
import { PropertyItem } from '../types';
import { mockProperties } from '../data/mockData';

export const StitchPropiedadesView: React.FC = () => {
  const [properties, setProperties] = useState<PropertyItem[]>(mockProperties);
  const [filterOp, setFilterOp] = useState<'Todos' | 'Alquiler' | 'Venta'>('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = properties.filter(p => {
    const matchOp = filterOp === 'Todos' || p.operation === filterOp;
    const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchOp && matchSearch;
  });

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-8 space-y-6">
      
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E0E3E5] shadow-xs">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#45474C] text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar por dirección, título o barrio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg text-xs text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-[#091426]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {(['Todos', 'Alquiler', 'Venta'] as const).map(op => (
            <button
              key={op}
              onClick={() => setFilterOp(op)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterOp === op
                  ? 'bg-[#091426] text-white shadow-xs font-bold'
                  : 'bg-[#F2F4F6] text-slate-700 hover:bg-[#E0E3E5]'
              }`}
            >
              {op}
            </button>
          ))}
          <button className="bg-[#006C49] hover:bg-[#007D55] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs whitespace-nowrap">
            <span className="material-symbols-outlined text-[16px]">add</span>
            + Cargar Inmueble
          </button>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(prop => (
          <div
            key={prop.id}
            className="bg-white rounded-xl border border-[#E0E3E5] shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={prop.image}
                  alt={prop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm text-white ${
                  prop.operation === 'Alquiler' ? 'bg-[#091426]' : 'bg-[#006C49]'
                }`}>
                  {prop.operation}
                </span>
                <span className="absolute top-3 right-3 text-[10px] font-bold bg-white/90 backdrop-blur-xs text-[#091426] px-2 py-0.5 rounded-md shadow-xs">
                  {prop.status}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase text-slate-400">{prop.type}</span>
                  <p className="text-base font-bold font-mono text-[#006C49]">{prop.price}</p>
                </div>

                <h3 className="font-bold text-sm text-[#091426] leading-snug">{prop.title}</h3>
                <p className="text-xs text-slate-500 truncate">📍 {prop.address}</p>

                <div className="flex items-center gap-4 text-xs text-slate-600 pt-2 border-t border-[#E0E3E5]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">bed</span> {prop.bedrooms} Dorm.
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">bathtub</span> {prop.bathrooms} Baños
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    📐 {prop.coveredM2} m²
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0">
              <button
                onClick={() => alert(`Ficha de ${prop.title} lista para compartir con clientes por WhatsApp.`)}
                className="w-full py-2 bg-[#F2F4F6] hover:bg-[#E0E3E5] text-[#091426] font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">share</span>
                Compartir Ficha
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
