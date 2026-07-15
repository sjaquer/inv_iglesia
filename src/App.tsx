import React, { useState, useMemo } from 'react';
import { useInventory } from './hooks/useInventory';
import { useItinerary } from './hooks/useItinerary';
import { InventoryTable } from './components/InventoryTable';
import { ProductModal } from './components/ProductModal';
import { TransactionModal } from './components/TransactionModal';
import { Product, TransactionType, Category } from './types';
import { AlertTriangle, Search } from 'lucide-react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { DashboardView } from './components/views/DashboardView';
import { HistoryView } from './components/views/HistoryView';
import { DonorsView } from './components/views/DonorsView';
import { ItineraryView } from './components/views/ItineraryView';
import { exportToExcel } from './utils/exportExcel';

export default function App() {
  const { products, transactions, loading, error, addProduct, updateProduct, registerTransaction } = useInventory();
  const { workers } = useItinerary();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [transactionModalData, setTransactionModalData] = useState<{
    isOpen: boolean;
    product: Product | null;
    type: TransactionType;
  }>({
    isOpen: false,
    product: null,
    type: 'IN',
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'history' | 'donors' | 'itinerary'>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const knownNames = useMemo(() => {
    const names = new Set<string>();
    workers.forEach(w => names.add(w.name));
    transactions.forEach(t => { if (t.personName) names.add(t.personName); });
    return Array.from(names).sort();
  }, [workers, transactions]);

  const uniqueDonorsCount = useMemo(() => 
    new Set(transactions.filter(t => t.type === 'IN' && (t.origin === 'Donación' || !t.origin)).map(d => d.personName)).size,
    [transactions]
  );

  const handleTransaction = (product: Product, type: TransactionType) => {
    setTransactionModalData({ isOpen: true, product, type });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (data: { id?: string; code: string; name: string; description: string; category: Category; condition: string; stock: number }) => {
    if (data.id) {
      await updateProduct(data.id, {
        code: data.code,
        name: data.name,
        description: data.description,
        category: data.category,
        condition: data.condition,
        stock: data.stock,
      });
    } else {
      await addProduct({
        code: data.code,
        name: data.name,
        description: data.description,
        category: data.category,
        condition: data.condition,
        stock: data.stock,
      });
    }
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const closeTransactionModal = () => {
    setTransactionModalData(prev => ({ ...prev, isOpen: false }));
  };

  const lowStockItems = products.filter(p => p.stock <= 5).length;
  
  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (q && activeTab !== 'inventory') {
      setActiveTab('inventory');
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#212529] text-[#E5E7EB] font-sans overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header 
          searchQuery={searchQuery} 
          setSearchQuery={handleSearchChange} 
          lowStockItemsCount={lowStockItems}
          onNewProduct={() => setIsProductModalOpen(true)}
          onExport={() => exportToExcel(products, transactions)}
          products={products}
          transactions={transactions}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />

        {/* Content Section */}
        <section className="flex-1 flex flex-col p-4 sm:p-8 pb-20 md:pb-8 overflow-hidden">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3 shrink-0">
              <AlertTriangle className="text-red-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-400">Error de Configuración</h3>
                <p className="text-sm text-red-300 mt-1">{error}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView 
                  products={products} 
                  transactions={transactions} 
                  uniqueDonorsCount={uniqueDonorsCount}
                />
              )}
              
              {activeTab === 'inventory' && (
                <div className="flex-1 flex flex-col overflow-hidden space-y-4">
                  <div className="shrink-0 sm:hidden">
                     <h2 className="text-xl font-bold tracking-tight text-white">Inventario General</h2>
                  </div>
                  <div className="sm:hidden mb-2">
                    <div className="flex items-center gap-2 bg-[#1A1D21] border border-[#373C42] px-4 py-2 rounded-lg w-full">
                      <Search className="w-4 h-4 text-[#8E9299]" />
                      <input 
                        type="text" 
                        placeholder="Buscar producto..." 
                        className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-[#8E9299]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <InventoryTable 
                    products={products.filter(p => 
                      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      p.code.toLowerCase().includes(searchQuery.toLowerCase())
                    )} 
                    onTransaction={handleTransaction}
                    onEdit={handleEditProduct}
                  />
                </div>
              )}
              
              {activeTab === 'history' && (
                <HistoryView products={products} transactions={transactions} />
              )}
              
              {activeTab === 'donors' && (
                <DonorsView transactions={transactions} workers={workers} />
              )}
              
              {activeTab === 'itinerary' && (
                <ItineraryView />
              )}
            </>
          )}
        </section>
      </main>

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Modals */}
      <ProductModal 
        isOpen={isProductModalOpen} 
        onClose={closeProductModal} 
        onSave={handleSaveProduct}
        product={editingProduct}
      />
      
      <TransactionModal 
        isOpen={transactionModalData.isOpen} 
        onClose={closeTransactionModal} 
        product={transactionModalData.product} 
        type={transactionModalData.type} 
        onSave={registerTransaction}
        knownNames={knownNames}
      />
    </div>
  );
}
