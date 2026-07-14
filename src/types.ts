export type Category = 'Herramientas' | 'Limpieza' | 'Seguridad' | 'Mobiliario' | 'Papelería' | 'Otros';

export type ProductCondition = 'Óptimo' | 'Desgastado' | 'Falla Leve' | 'Requiere Reparación' | 'Inservible';

export interface Product {
  id: string; // Document ID
  code: string; // e.g., "HRR-001"
  name: string;
  description: string;
  category: Category;
  condition: ProductCondition | string; // Estado / Deficiencias
  stock: number;
  createdAt: number;
}

export type TransactionType = 'IN' | 'OUT' | 'RETURN';

export type TransactionOrigin = 'Donación' | 'Compra' | 'Ajuste' | 'Otro';

export interface Transaction {
  id: string;
  productId: string;
  type: TransactionType;
  quantity: number;
  date: number; // Timestamp
  personName: string; // Nombre de quién donó, retiró o devolvió
  conditionOnReturn?: string; // Deficiencias al momento de entregar/devolver
  origin?: TransactionOrigin | string; // Reason or source of the transaction
  cost?: number; // Monto en caso de compra
  createdAt: number;
}

export type WorkerRole = 'Operario' | 'Maestro' | 'Ayudante' | 'Ingeniero' | 'Arquitecto' | 'Otro';

export interface Worker {
  id: string;
  name: string;
  role: WorkerRole | string;
  phone?: string;
  createdAt: number;
}

export interface Schedule {
  id: string;
  workerId: string;
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  location: string; // Area/lugar de trabajo
  notes?: string;
  createdAt: number;
}

