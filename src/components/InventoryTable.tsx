import React from 'react';
import { Product, TransactionType } from '../types';
import { Button } from './ui/Button';
import { getCategoryColor, cn } from '../lib/utils';
import { ArrowDownToLine, ArrowUpFromLine, RefreshCw, AlertCircle, Pencil } from 'lucide-react';

interface InventoryTableProps {
  products: Product[];
  onTransaction: (product: Product, type: TransactionType) => void;
  onEdit: (product: Product) => void;
}

export function InventoryTable({ products, onTransaction, onEdit }: InventoryTableProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-[#2C3136] rounded-xl border border-[#373C42] shadow-2xl flex-1">
        <div className="w-16 h-16 bg-[#1A1D21] rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-[#8E9299]" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1 tracking-tight">Inventario vacío</h3>
        <p className="text-[#8E9299] text-sm">Agrega el primer producto para comenzar.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#2C3136] border border-[#373C42] rounded-xl flex-1 flex flex-col overflow-hidden shadow-2xl">
      <div className="overflow-auto flex-1">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#1A1D21] border-b border-[#373C42] text-[10px] uppercase tracking-widest font-bold text-[#8E9299] sticky top-0">
            <tr>
              <th className="px-6 py-4">Código</th>
              <th className="px-6 py-4">Producto</th>
              <th className="px-6 py-4">Categoría</th>
              <th className="px-6 py-4">Deficiencias / Estado</th>
              <th className="px-6 py-4 text-center">Stock</th>
              <th className="px-6 py-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#373C42] text-[#E5E7EB]">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-[#373C42]/30 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-[#8E9299]">
                  {product.code}
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-sm">{product.name}</p>
                  {product.description && (
                    <p className="text-xs text-[#8E9299] truncate max-w-[200px] mt-0.5">
                      {product.description}
                    </p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-1 text-[9px] font-bold rounded uppercase",
                    getCategoryColor(product.category)
                  )}>
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "text-xs truncate max-w-[150px] inline-block",
                    product.condition ? "italic text-yellow-400" : "text-[#8E9299]"
                  )}>
                    {product.condition || 'Óptimo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={cn(
                    "font-bold",
                    product.stock <= 0 ? "text-red-500" : "text-[#E5E7EB]"
                  )}>
                    {product.stock.toString().padStart(2, '0')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-3 text-right">
                    <button 
                      className="text-[10px] text-yellow-400 font-bold hover:underline uppercase flex items-center gap-1"
                      title="Editar producto"
                      onClick={() => onEdit(product)}
                    >
                      <Pencil size={12} />
                      <span className="hidden sm:inline">Editar</span>
                    </button>
                    <button 
                      className="text-[10px] text-green-400 font-bold hover:underline uppercase flex items-center gap-1"
                      title="Entrada (Ingreso)"
                      onClick={() => onTransaction(product, 'IN')}
                    >
                      <ArrowDownToLine size={12} />
                      <span className="hidden sm:inline">Surtir</span>
                    </button>
                    <button 
                      className="text-[10px] text-red-400 font-bold hover:underline uppercase flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Salida (Retiro)"
                      onClick={() => onTransaction(product, 'OUT')}
                      disabled={product.stock <= 0}
                    >
                      <ArrowUpFromLine size={12} />
                      <span className="hidden sm:inline">Salida</span>
                    </button>
                    <button 
                      className="text-[10px] text-blue-400 font-bold hover:underline uppercase flex items-center gap-1"
                      title="Retorno (Devolución)"
                      onClick={() => onTransaction(product, 'RETURN')}
                    >
                      <RefreshCw size={12} />
                      <span className="hidden sm:inline">Retorno</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
