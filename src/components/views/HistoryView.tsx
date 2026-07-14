import React from 'react';
import { Product, Transaction } from '../../types';

interface HistoryViewProps {
  products: Product[];
  transactions: Transaction[];
}

export function HistoryView({ products, transactions }: HistoryViewProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 2 }).format(amount);

  return (
    <div className="flex-1 flex flex-col overflow-hidden space-y-4">
      <div className="shrink-0">
        <h2 className="text-2xl font-bold tracking-tight text-white">Historial de Movimientos</h2>
        <p className="text-[#8E9299] text-sm mt-1">Registro de entradas, salidas y devoluciones.</p>
      </div>
      
      <div className="bg-[#2C3136] rounded-xl overflow-hidden border border-[#373C42] shadow-2xl flex-1 flex flex-col">
        <div className="overflow-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] uppercase tracking-widest font-bold text-[#8E9299] bg-[#1A1D21] border-b border-[#373C42] sticky top-0">
              <tr>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4 text-center">Cant.</th>
                <th className="px-6 py-4">Persona</th>
                <th className="px-6 py-4">Notas / Origen</th>
                <th className="px-6 py-4 text-right">Costo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#373C42] text-[#E5E7EB]">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-[#8E9299]">
                    No hay movimientos registrados
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const product = products.find(p => p.id === tx.productId);
                  const date = new Date(tx.date).toLocaleString();
                  return (
                    <tr key={tx.id} className="hover:bg-[#373C42]/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-[#8E9299]">{date}</td>
                      <td className="px-6 py-4 text-xs font-bold">
                        {tx.type === 'IN' && <span className="text-green-500">ENTRADA</span>}
                        {tx.type === 'OUT' && <span className="text-red-500">SALIDA</span>}
                        {tx.type === 'RETURN' && <span className="text-blue-500">RETORNO</span>}
                      </td>
                      <td className="px-6 py-4 font-semibold text-sm">{product?.name || 'Desconocido'}</td>
                      <td className="px-6 py-4 font-mono text-center">{tx.quantity.toString().padStart(2, '0')}</td>
                      <td className="px-6 py-4">{tx.personName}</td>
                      <td className="px-6 py-4 text-[#8E9299] text-xs italic">
                        {tx.type === 'IN' && tx.origin ? tx.origin : ''}
                        {tx.type === 'RETURN' && tx.conditionOnReturn ? tx.conditionOnReturn : ''}
                        {(!tx.origin && !tx.conditionOnReturn) && '-'}
                      </td>
                      <td className="px-6 py-4 text-right text-xs font-mono">
                        {tx.type === 'IN' && tx.origin === 'Compra' && tx.cost != null && tx.cost > 0 ? (
                          <span className="text-orange-400 font-bold">{formatCurrency(tx.cost)}</span>
                        ) : (
                          <span className="text-[#4B5563]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
