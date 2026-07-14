import React from 'react';
import { Activity, LayoutDashboard, History, CalendarDays, Users } from 'lucide-react';

interface MobileNavProps {
  activeTab: 'dashboard' | 'inventory' | 'history' | 'donors' | 'itinerary';
  setActiveTab: (tab: 'dashboard' | 'inventory' | 'history' | 'donors' | 'itinerary') => void;
}

export function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 w-full bg-[#1A1D21] border-t border-[#373C42] flex z-20">
      <button 
        className={`flex-1 flex flex-col items-center justify-center py-3 px-2 ${activeTab === 'dashboard' ? 'text-white' : 'text-[#8E9299]'}`}
        onClick={() => setActiveTab('dashboard')}
      >
        <Activity className="w-5 h-5 mb-1" />
        <span className="text-[9px] font-medium tracking-wider">RESUMEN</span>
      </button>
      <button 
        className={`flex-1 flex flex-col items-center justify-center py-3 px-2 ${activeTab === 'inventory' ? 'text-white' : 'text-[#8E9299]'}`}
        onClick={() => setActiveTab('inventory')}
      >
        <LayoutDashboard className="w-5 h-5 mb-1" />
        <span className="text-[9px] font-medium tracking-wider">INVENTARIO</span>
      </button>
      <button 
        className={`flex-1 flex flex-col items-center justify-center py-3 px-2 ${activeTab === 'history' ? 'text-white' : 'text-[#8E9299]'}`}
        onClick={() => setActiveTab('history')}
      >
        <History className="w-5 h-5 mb-1" />
        <span className="text-[9px] font-medium tracking-wider">MOV.</span>
      </button>
      <button 
        className={`flex-1 flex flex-col items-center justify-center py-3 px-1 ${activeTab === 'itinerary' ? 'text-white' : 'text-[#8E9299]'}`}
        onClick={() => setActiveTab('itinerary')}
      >
        <CalendarDays className="w-5 h-5 mb-1" />
        <span className="text-[8px] font-medium tracking-wider">ITINERARIO</span>
      </button>
      <button 
        className={`flex-1 flex flex-col items-center justify-center py-3 px-1 ${activeTab === 'donors' ? 'text-white' : 'text-[#8E9299]'}`}
        onClick={() => setActiveTab('donors')}
      >
        <Users className="w-5 h-5 mb-1" />
        <span className="text-[8px] font-medium tracking-wider">COLAB.</span>
      </button>
    </nav>
  );
}
