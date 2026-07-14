import React from 'react';
import { Product, Transaction } from '../../types';

interface DashboardViewProps {
  products: Product[];
  transactions: Transaction[];
  uniqueDonorsCount: number;
}

export function DashboardView({ products, transactions, uniqueDonorsCount }: DashboardViewProps) {
  const totalItems = products.length;
  const lowStockItems = products.filter(p => p.stock <= 5).length;
  
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const entriesToday = transactions.filter(t => t.type === 'IN' && t.date >= todayStart.getTime()).length;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto space-y-6">
      <div className="shrink-0">
        <h2 className="text-2xl font-bold tracking-tight text-white">Resumen General</h2>
        <p className="text-[#8E9299] text-sm mt-1">Estado de inventario y estadísticas principales.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#2C3136] border border-[#373C42] p-5 rounded-xl shadow-lg">
          <p className="text-[10px] text-[#8E9299] uppercase tracking-widest font-bold">Total Items</p>
          <h3 className="text-3xl font-bold mt-2 text-white">{totalItems}</h3>
        </div>
        <div className="bg-[#2C3136] border border-[#373C42] p-5 rounded-xl shadow-lg">
          <p className="text-[10px] text-[#8E9299] uppercase tracking-widest font-bold">Total Donantes</p>
          <h3 className="text-3xl font-bold mt-2 text-blue-400">{uniqueDonorsCount}</h3>
        </div>
        <div className="bg-[#2C3136] border border-[#373C42] p-5 rounded-xl shadow-lg">
          <p className="text-[10px] text-[#8E9299] uppercase tracking-widest font-bold">Entradas (Hoy)</p>
          <h3 className="text-3xl font-bold mt-2 text-green-500">{entriesToday}</h3>
        </div>
        <div className="bg-[#2C3136] border border-[#373C42] p-5 rounded-xl shadow-lg">
          <p className="text-[10px] text-[#8E9299] uppercase tracking-widest font-bold">Alertas Stock</p>
          <h3 className="text-3xl font-bold mt-2 text-red-500">{lowStockItems}</h3>
        </div>
      </div>
      
      <div className="bg-[#2C3136] rounded-xl border border-[#373C42] shadow-2xl p-6">
        <h3 className="text-sm uppercase tracking-widest font-bold text-[#8E9299] mb-4">Actividad Reciente</h3>
        <div className="space-y-4">
          {transactions.slice(0, 5).map(tx => {
            const product = products.find(p => p.id === tx.productId);
            return (
              <div key={tx.id} className="flex items-center justify-between py-2 border-b border-[#373C42] last:border-0">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {tx.type === 'IN' ? (tx.origin === 'Donación' ? 'Donación Recibida' : 'Entrada') : 
                     tx.type === 'OUT' ? 'Salida' : 'Retorno'}: <span className="text-[#8E9299] font-normal">{product?.name}</span>
                  </p>
                  <p className="text-xs text-[#8E9299]">{tx.personName} • {new Date(tx.date).toLocaleString()}</p>
                </div>
                <span className={`font-mono text-sm font-bold ${tx.type === 'IN' ? 'text-green-500' : tx.type === 'OUT' ? 'text-red-500' : 'text-blue-500'}`}>
                  {tx.type === 'OUT' ? '-' : '+'}{tx.quantity}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
