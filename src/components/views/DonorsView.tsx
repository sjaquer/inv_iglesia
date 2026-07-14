import React from 'react';
import { Transaction } from '../../types';

interface DonorsViewProps {
  transactions: Transaction[];
}

export function DonorsView({ transactions }: DonorsViewProps) {
  // We only count as "Donations" transactions that are type IN and origin Donación (or empty origin for legacy data).
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

  return (
    <div className="flex-1 flex flex-col overflow-hidden space-y-4">
      <div className="shrink-0">
        <h2 className="text-2xl font-bold tracking-tight text-white">Donantes y Colaboradores</h2>
        <p className="text-[#8E9299] text-sm mt-1">Personas que han contribuido con materiales mediante donaciones a la obra.</p>
      </div>
      
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
    </div>
  );
}
