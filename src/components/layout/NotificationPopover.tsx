import React from 'react';
import { Bell, AlertTriangle, Package, TrendingUp, TrendingDown, RefreshCw, X } from 'lucide-react';
import { Product, Transaction } from '../../types';

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  transactions: Transaction[];
}

export interface LogNotification {
  id: string;
  type: 'alert' | 'transaction_in' | 'transaction_out' | 'transaction_return' | 'new_product';
  title: string;
  description: string;
  timestamp: number;
  read?: boolean;
}

export function NotificationPopover({ isOpen, onClose, products, transactions }: NotificationPopoverProps) {
  if (!isOpen) return null;

  // Generate dynamic log notifications
  const notifications: LogNotification[] = [];

  // 1. Generate low stock alerts
  products.forEach(p => {
    if (p.stock <= 5) {
      notifications.push({
        id: `alert-stock-${p.id}`,
        type: 'alert',
        title: 'Alerta de Stock Mínimo',
        description: `El producto "${p.name}" tiene stock crítico de ${p.stock} unidades.`,
        timestamp: p.createdAt || Date.now() - 3600000, // Fallback if no createdAt
      });
    }
  });

  // 2. Generate transaction events
  transactions.forEach(t => {
    const p = products.find(prod => prod.id === t.productId);
    const prodName = p ? p.name : 'Producto Desconocido';
    
    if (t.type === 'IN') {
      const motive = t.origin ? `(${t.origin})` : '(Donación)';
      notifications.push({
        id: `tx-in-${t.id}`,
        type: 'transaction_in',
        title: 'Ingreso Registrado',
        description: `${t.personName} ingresó ${t.quantity} u. de "${prodName}" ${motive}.`,
        timestamp: t.date,
      });
    } else if (t.type === 'OUT') {
      notifications.push({
        id: `tx-out-${t.id}`,
        type: 'transaction_out',
        title: 'Retiro / Préstamo',
        description: `${t.personName} retiró ${t.quantity} u. de "${prodName}" para uso.`,
        timestamp: t.date,
      });
    } else if (t.type === 'RETURN') {
      const cond = t.conditionOnReturn ? ` - Estado: ${t.conditionOnReturn}` : '';
      notifications.push({
        id: `tx-ret-${t.id}`,
        type: 'transaction_return',
        title: 'Devolución de Material',
        description: `${t.personName} retornó ${t.quantity} u. de "${prodName}"${cond}.`,
        timestamp: t.date,
      });
    }
  });

  // 3. Generate newly created products
  products.forEach(p => {
    // Show products created recently
    notifications.push({
      id: `new-prod-${p.id}`,
      type: 'new_product',
      title: 'Nuevo Producto Registrado',
      description: `Se añadió "${p.name}" (${p.code}) al catálogo en la categoría ${p.category}.`,
      timestamp: p.createdAt || Date.now(),
    });
  });

  // Sort all notifications by timestamp descending (most recent first)
  const sortedNotifications = notifications.sort((a, b) => b.timestamp - a.timestamp).slice(0, 30);

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />;
      case 'transaction_in':
        return <TrendingUp className="w-5 h-5 text-green-500 shrink-0" />;
      case 'transaction_out':
        return <TrendingDown className="w-5 h-5 text-orange-500 shrink-0" />;
      case 'transaction_return':
        return <RefreshCw className="w-5 h-5 text-blue-500 shrink-0" />;
      case 'new_product':
        return <Package className="w-5 h-5 text-purple-500 shrink-0" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400 shrink-0" />;
    }
  };

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return 'Hace un momento';
    if (diff < 3600000) return `Hace ${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return `Hace ${Math.floor(diff / 3600000)} h`;
    return new Date(ts).toLocaleDateString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Backdrop for easy closing */}
      <div className="fixed inset-0 z-40 bg-black/10" onClick={onClose} />
      
      {/* Popover container */}
      <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#2C3136] border border-[#373C42] rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[500px]">
        {/* Header */}
        <div className="p-4 bg-[#1A1D21] border-b border-[#373C42] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-orange-500" />
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">Bitácora de Actividad</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-[#8E9299] hover:text-white transition-colors p-1 hover:bg-[#2C3136] rounded"
          >
            <X size={16} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#373C42] custom-scrollbar">
          {sortedNotifications.length === 0 ? (
            <div className="p-8 text-center text-[#8E9299] text-sm">
              No hay actividades registradas en la obra.
            </div>
          ) : (
            sortedNotifications.map(item => (
              <div 
                key={item.id} 
                className={`p-4 flex gap-3 transition-colors hover:bg-[#373C42]/40 ${
                  item.type === 'alert' ? 'bg-red-500/5' : ''
                }`}
              >
                {getIcon(item.type)}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs font-bold ${
                      item.type === 'alert' ? 'text-red-400' :
                      item.type === 'transaction_in' ? 'text-green-400' :
                      item.type === 'transaction_out' ? 'text-orange-400' :
                      item.type === 'transaction_return' ? 'text-blue-400' :
                      'text-purple-400'
                    }`}>
                      {item.title}
                    </p>
                    <span className="text-[10px] text-[#8E9299] whitespace-nowrap">
                      {formatTime(item.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-[#E5E7EB] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Footer info */}
        <div className="p-3 bg-[#1A1D21] border-t border-[#373C42] text-center">
          <span className="text-[10px] text-[#8E9299]">
            Actualizado en tiempo real • Total {sortedNotifications.length} eventos
          </span>
        </div>
      </div>
    </>
  );
}
