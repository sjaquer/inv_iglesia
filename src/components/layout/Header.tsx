import React, { useState } from 'react';
import { Search, Bell, PackagePlus, FileSpreadsheet, Menu } from 'lucide-react';
import { Button } from '../ui/Button';
import { Product, Transaction } from '../../types';
import { NotificationPopover } from './NotificationPopover';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  lowStockItemsCount: number;
  onNewProduct: () => void;
  onExport: () => void;
  products: Product[];
  transactions: Transaction[];
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (c: boolean) => void;
}

export function Header({ 
  searchQuery, 
  setSearchQuery, 
  lowStockItemsCount, 
  onNewProduct, 
  onExport,
  products,
  transactions,
  isSidebarCollapsed,
  setIsSidebarCollapsed
}: HeaderProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <header className="h-20 bg-[#2C3136] border-b border-[#373C42] flex items-center justify-between px-8 shrink-0 relative">
      <div className="flex items-center gap-4 w-full max-w-md">
        {/* Toggle Sidebar Button */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
          className="p-2 text-[#8E9299] hover:text-white hover:bg-[#373C42]/50 rounded transition-colors hidden md:block"
          title={isSidebarCollapsed ? "Expandir menú" : "Contraer menú"}
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-4 bg-[#1A1D21] border border-[#373C42] px-4 py-2 rounded-lg w-full max-w-sm hidden sm:flex">
          <Search className="w-4 h-4 text-[#8E9299]" />
          <input 
            type="text" 
            placeholder="Buscar producto o código..." 
            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-[#8E9299]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center sm:hidden">
        <h1 className="text-lg font-bold tracking-tighter text-white">CENTRO DE ADORACIÓN</h1>
      </div>

      <div className="flex gap-3 sm:gap-4 items-center">
        {/* Notifications Button */}
        <div className="relative">
          <button 
            className={`relative p-2 rounded transition-colors hover:bg-[#373C42]/50 ${
              isNotificationsOpen ? 'text-white bg-[#373C42]' : 'text-[#8E9299] hover:text-white'
            }`} 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            title="Bitácora de Actividad"
          >
            <Bell size={20} />
            {lowStockItemsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-[#2C3136]">
                {lowStockItemsCount > 9 ? '9+' : lowStockItemsCount}
              </span>
            )}
          </button>

          {/* Mount the notifications popover relative to the button */}
          <NotificationPopover 
            isOpen={isNotificationsOpen} 
            onClose={() => setIsNotificationsOpen(false)} 
            products={products}
            transactions={transactions}
          />
        </div>

        <Button 
          variant="outline"
          className="px-3 py-2 bg-transparent text-[#8E9299] border-[#373C42] hover:bg-[#373C42] hover:text-white hidden sm:flex font-medium text-sm rounded"
          onClick={onExport}
        >
          <FileSpreadsheet size={18} className="mr-2" />
          Exportar
        </Button>
        <Button 
          variant="outline"
          className="px-2 py-2 bg-transparent text-[#8E9299] border-[#373C42] hover:bg-[#373C42] hover:text-white sm:hidden flex rounded"
          onClick={onExport}
          title="Exportar"
        >
          <FileSpreadsheet size={18} />
        </Button>
        
        <div className="h-6 w-px bg-[#373C42] mx-1"></div>
        
        <Button 
          className="px-4 py-2 bg-orange-500 text-white rounded font-medium text-sm hover:bg-orange-600 shadow-lg shadow-orange-500/20 border-none hidden sm:flex"
          onClick={onNewProduct}
        >
          <PackagePlus size={18} className="mr-2" />
          Nuevo Producto
        </Button>
        <Button 
          className="px-3 py-2 bg-orange-500 text-white rounded font-medium text-sm hover:bg-orange-600 shadow-lg shadow-orange-500/20 border-none sm:hidden flex"
          onClick={onNewProduct}
        >
          <PackagePlus size={18} />
        </Button>
      </div>
    </header>
  );
}
