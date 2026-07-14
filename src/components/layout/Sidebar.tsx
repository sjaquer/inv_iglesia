import React from 'react';
import { Activity, LayoutDashboard, History, Users, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  activeTab: 'dashboard' | 'inventory' | 'history' | 'donors' | 'itinerary';
  setActiveTab: (tab: 'dashboard' | 'inventory' | 'history' | 'donors' | 'itinerary') => void;
  isCollapsed: boolean;
  setIsCollapsed: (c: boolean) => void;
}

export function Sidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }: SidebarProps) {
  const tabs = [
    { id: 'dashboard', label: 'Resumen', icon: Activity },
    { id: 'inventory', label: 'Inventario', icon: LayoutDashboard },
    { id: 'history', label: 'Movimientos', icon: History },
    { id: 'itinerary', label: 'Itinerario', icon: CalendarDays },
    { id: 'donors', label: 'Colaboradores', icon: Users },
  ] as const;

  return (
    <aside className={`bg-[#1A1D21] border-r border-[#373C42] flex flex-col hidden md:flex transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed ? (
          <div>
            <h1 className="text-xl font-bold tracking-tighter text-white flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-sm flex items-center justify-center text-xs shrink-0 font-extrabold">CA</div>
              <span className="truncate">CENTRO DE ADORACIÓN</span>
            </h1>
            <p className="text-[10px] text-[#8E9299] mt-1 uppercase tracking-[0.2em]">Misión Posible - CNC</p>
          </div>
        ) : (
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-sm font-extrabold text-white shadow-lg shadow-orange-500/20" title="Centro de Adoración">
            CA
          </div>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`w-full flex items-center rounded-lg transition-all duration-200 group relative ${
                isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
              } ${isActive ? 'bg-[#373C42] text-white shadow-md' : 'text-[#8E9299] hover:bg-[#2C3136] hover:text-white'}`}
              onClick={() => setActiveTab(tab.id)}
              title={isCollapsed ? tab.label : undefined}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-orange-500' : 'text-[#8E9299] group-hover:text-white'}`} />
              {!isCollapsed && <span className="text-sm font-medium">{tab.label}</span>}
              
              {/* Tooltip for collapsed mode */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-[#1A1D21] text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-[#373C42] shadow-xl">
                  {tab.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle Button at bottom */}
      <div className="p-4 border-t border-[#373C42]">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center py-2 text-[#8E9299] hover:text-white hover:bg-[#2C3136] rounded-lg transition-all duration-200"
          title={isCollapsed ? "Expandir menú" : "Contraer menú"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : (
            <div className="flex items-center gap-2 text-xs font-semibold">
              <ChevronLeft size={18} />
              <span>Contraer menú</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
