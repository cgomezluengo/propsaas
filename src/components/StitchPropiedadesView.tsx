import React, { useState } from 'react';
import { PropertyItem } from '../types';

interface Props {
  properties: PropertyItem[];
  onAddProperty: (prop: PropertyItem) => void;
  onDeleteProperty: (id: string) => void;
}

export const StitchPropiedadesView: React.FC<Props> = ({
  properties,
  onAddProperty,
  onDeleteProperty,
}) => {
  const [filterOp, setFilterOp] = useState<'Todos' | 'Alquiler' | 'Venta'>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newPrice, setNewPrice] = useState('$350.000 / mes');
  const [newOperation, setNewOperation] = useState<'Alquiler' | 'Venta'>('Alquiler');
  const [newType, setNewType] = useState<'Departamento' | 'Casa' | 'Local Comercial' | 'Quinta'>('Departamento');
  const [newBedrooms, setNewBedrooms] = useState(2);
  const [newBathrooms, setNewBathrooms] = useState(1);
  const [newCoveredM2, setNewCoveredM2] = useState(65);

  const filtered = properties.filter(p => {
    const matchOp = filterOp === 'Todos' || p.operation === filterOp;
    const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchOp && matchSearch;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const item: PropertyItem = {
      id: `prop-${Date.now()}`,
      title: newTitle || 'Nuevo Inmueble',
      address: newAddress || 'Calle Principal, Junín',
      price: newPrice,
      operation: newOperation,
      type: newType,
      bedrooms: newBedrooms,
      bathrooms: newBathrooms,
      coveredM2: newCoveredM2,
      status: 'Disponible',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=600'
    };

    onAddProperty(item);
    setIsModalOpen(false);
    setNewTitle('');
    setNewAddress('');
  };

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
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#006C49] hover:bg-[#007D55] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs whitespace-nowrap"
          >
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
            className="bg-white rounded-xl border border-[#E0E3E5] shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group relative"
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

            <div className="p-4 pt-0 flex gap-2">
              <button
                onClick={() => alert(`Ficha de ${prop.title} compartida por WhatsApp.`)}
                className="flex-1 py-2 bg-[#F2F4F6] hover:bg-[#E0E3E5] text-[#091426] font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">share</span>
                Compartir
              </button>
              <button
                onClick={() => {
                  if (confirm(`¿Eliminar la propiedad "${prop.title}" del catálogo?`)) {
                    onDeleteProperty(prop.id);
                  }
                }}
                className="p-2 text-slate-400 hover:text-[#BA1A1A] hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar propiedad"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Cargar Propiedad */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091426]/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-xl p-6 border border-[#E0E3E5] shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#E0E3E5]">
              <h3 className="text-sm font-bold text-[#091426]">+ Agregar Inmueble al Inventario</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Título del Inmueble *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: Depto 3 Ambientes con Cochera"
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Dirección / Ubicación *</label>
                <input
                  type="text"
                  required
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Ej: Calle España 220, Junín"
                  className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Operación</label>
                  <select
                    value={newOperation}
                    onChange={(e: any) => setNewOperation(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg text-xs"
                  >
                    <option value="Alquiler">Alquiler</option>
                    <option value="Venta">Venta</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Precio *</label>
                  <input
                    type="text"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="$350.000 / mes o USD 120.000"
                    className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Dormitorios</label>
                  <input
                    type="number"
                    value={newBedrooms}
                    onChange={(e) => setNewBedrooms(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Baños</label>
                  <input
                    type="number"
                    value={newBathrooms}
                    onChange={(e) => setNewBathrooms(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">M² Cubiertos</label>
                  <input
                    type="number"
                    value={newCoveredM2}
                    onChange={(e) => setNewCoveredM2(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#75777D]/30 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-2 text-xs font-semibold text-slate-500">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-[#006C49] text-white font-bold text-xs rounded-lg shadow-sm">
                  Guardar en Inventario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
