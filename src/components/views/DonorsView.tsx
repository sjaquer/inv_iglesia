import React, { useState } from 'react';
import { Transaction, Worker } from '../../types';
import { Users, HardHat, UserPlus, Trash2 } from 'lucide-react';

interface DonorsViewProps {
  transactions: Transaction[];
  workers: Worker[];
}

export function DonorsView({ transactions, workers }: DonorsViewProps) {
  const [tab, setTab] = useState<'donantes' | 'colaboradores'>('donantes');

  const donations = transactions.filter(t => t.type === 'IN' && (t.origin === 'Donación' || !t.origin));
  
  const uniqueDonors = Array.from(new Set(donations.map(d => d.personName))).map(name => {
    const donorTx = donations.filter(d => d.personName === name);
    return {
      name,
      totalDonations: donorTx.length,
      itemsDonated: donorTx.reduce((sum, tx) => sum + tx.quantity, 0),
      lastDonation: Math.max(...donorTx.map(tx => tx.date))
    };
  }).sort((a, b) => b.lastDonation - a.lastDonation);

  const totalSpent = transactions
    .filter(t => t.type === 'IN' && t.origin === 'Compra' && t.cost != null)
    .reduce((sum, t) => sum + (t.cost || 0), 0);

  const tabs = [
    { id: 'donantes', label: 'Donantes', icon: Users, count: uniqueDonors.length },
    { id: 'colaboradores', label: 'Colaboradores', icon: HardHat, count: workers.length },
  ] as const;

  return (
    <div className="flex-1 flex flex-col overflow-hidden space-y-4">
      <div className="shrink-0">
        <h2 className="text-2xl font-bold tracking-tight text-white">Personas</h2>
        <p className="text-[#8E9299] text-sm mt-1">Donantes, colaboradores y trabajadores de la obra.</p>
      </div>

      {/* Pestañas */}
      <div className="flex gap-2 shrink-0">
        {tabs.map(t => {
          const Icon = t.icon;
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                isActive
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'bg-[#2C3136] text-[#8E9299] hover:bg-[#373C42] hover:text-white border border-[#373C42]'
              }`}
            >
              <Icon size={16} />
              {t.label}
              <span className={`ml-1 text-[10px] ${isActive ? 'text-orange-200' : 'text-[#6B7280]'}`}>
                ({t.count})
              </span>
            </button>
          );
        })}
      </div>

      {tab === 'donantes' && (
        <>
          {/* Resumen de gastos por compras */}
          {totalSpent > 0 && (
            <div className="bg-[#2C3136] border border-[#373C42] rounded-xl p-4 flex items-center gap-3 shrink-0">
              <span className="text-xl">💰</span>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#8E9299]">Total invertido en compras</p>
                <p className="text-xl font-bold text-white">S/ {totalSpent.toFixed(2)}</p>
              </div>
            </div>
          )}

          <div className="bg-[#2C3136] rounded-xl overflow-hidden border border-[#373C42] shadow-2xl flex-1 flex flex-col">
            <div className="overflow-auto flex-1">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] uppercase tracking-widest font-bold text-[#8E9299] bg-[#1A1D21] border-b border-[#373C42] sticky top-0">
                  <tr>
                    <th className="px-6 py-4">Nombre / Organización</th>
                    <th className="px-6 py-4 text-center">Donaciones Totales</th>
                    <th className="px-6 py-4 text-center">Items Aportados</th>
                    <th className="px-6 py-4">Última Donación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#373C42] text-[#E5E7EB]">
                  {uniqueDonors.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-[#8E9299]">
                        No hay donantes registrados aún
                      </td>
                    </tr>
                  ) : (
                    uniqueDonors.map((donor, idx) => (
                        <tr key={idx} className="hover:bg-[#373C42]/30 transition-colors">
                          <td className="px-6 py-4 font-semibold text-sm flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#1A1D21] flex items-center justify-center text-orange-500 font-bold border border-[#373C42]">
                              {donor.name.charAt(0).toUpperCase()}
                            </div>
                            {donor.name}
                          </td>
                          <td className="px-6 py-4 font-mono text-center font-bold text-green-400">{donor.totalDonations}</td>
                          <td className="px-6 py-4 font-mono text-center text-white">{donor.itemsDonated}</td>
                          <td className="px-6 py-4 text-xs text-[#8E9299]">{new Date(donor.lastDonation).toLocaleDateString()}</td>
                        </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'colaboradores' && (
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {workers.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#2C3136] rounded-xl border border-[#373C42] shadow-2xl p-12">
              <HardHat className="w-12 h-12 text-[#8E9299] mb-4" />
              <h3 className="text-lg font-bold text-white mb-1">Sin colaboradores</h3>
              <p className="text-[#8E9299] text-sm">Registra personal desde la sección Itinerario.</p>
            </div>
          ) : (
            <div className="bg-[#2C3136] rounded-xl overflow-hidden border border-[#373C42] shadow-2xl flex-1 flex flex-col">
              <div className="overflow-auto flex-1">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] uppercase tracking-widest font-bold text-[#8E9299] bg-[#1A1D21] border-b border-[#373C42] sticky top-0">
                    <tr>
                      <th className="px-6 py-4">Nombre</th>
                      <th className="px-6 py-4">Rol</th>
                      <th className="px-6 py-4">Teléfono</th>
                      <th className="px-6 py-4 text-center">Registrado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#373C42] text-[#E5E7EB]">
                    {workers.map((w) => (
                      <tr key={w.id} className="hover:bg-[#373C42]/30 transition-colors">
                        <td className="px-6 py-4 font-semibold text-sm flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#373C42] flex items-center justify-center text-orange-500 font-bold text-xs">
                            {w.name.charAt(0).toUpperCase()}
                          </div>
                          {w.name}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full font-medium">
                            {w.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#8E9299] text-sm">{w.phone || '—'}</td>
                        <td className="px-6 py-4 text-center text-xs text-[#8E9299]">
                          {w.createdAt ? new Date(w.createdAt).toLocaleDateString() : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="bg-[#2C3136] border border-[#373C42] rounded-xl p-5 shrink-0">
            <p className="text-xs text-[#8E9299]">
              Para agregar o eliminar colaboradores, usa la sección{' '}
              <span className="font-bold text-orange-400">Itinerario</span> del menú lateral.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
