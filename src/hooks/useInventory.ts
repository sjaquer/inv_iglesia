import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, Transaction, TransactionType } from '../types';

export function useInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) {
      setError("Falta la configuración de Firebase en el archivo .env");
      setLoading(false);
      return;
    }

    try {
      const qProducts = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const unsubProducts = onSnapshot(qProducts, (snapshot) => {
        const prodData: Product[] = [];
        snapshot.forEach((doc) => {
          prodData.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProducts(prodData);
        setLoading(false);
      }, (err) => {
        console.error(err);
        setError("Error al cargar los productos. Verifica los permisos de Firestore.");
        setLoading(false);
      });

      const qTransactions = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'));
      const unsubTransactions = onSnapshot(qTransactions, (snapshot) => {
        const transData: Transaction[] = [];
        snapshot.forEach((doc) => {
          transData.push({ id: doc.id, ...doc.data() } as Transaction);
        });
        setTransactions(transData);
      });

      return () => {
        unsubProducts();
        unsubTransactions();
      };
    } catch (err) {
      console.error(err);
      setError("Error al inicializar la conexión con Firestore.");
      setLoading(false);
    }
  }, []);

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    if (!db) throw new Error("Base de datos no inicializada");
    await addDoc(collection(db, 'products'), {
      ...productData,
      createdAt: serverTimestamp()
    });
  };

  const registerTransaction = async (
    productId: string,
    type: TransactionType,
    quantity: number,
    personName: string,
    conditionOnReturn?: string,
    origin?: string,
    cost?: number
  ) => {
    if (!db) throw new Error("Base de datos no inicializada");

    let stockChange = 0;
    if (type === 'IN') stockChange = quantity;
    else if (type === 'OUT') stockChange = -quantity;
    else if (type === 'RETURN') stockChange = quantity;

    // 1. Añadir el registro de la transacción
    await addDoc(collection(db, 'transactions'), {
      productId,
      type,
      quantity,
      date: Date.now(),
      personName,
      conditionOnReturn: conditionOnReturn || null,
      origin: origin || null,
      cost: cost != null ? cost : null,
      createdAt: serverTimestamp()
    });

    // 2. Actualizar el stock y/o condición del producto
    const productRef = doc(db, 'products', productId);
    const updates: { stock: ReturnType<typeof increment>; condition?: string } = {
      stock: increment(stockChange)
    };

    if (type === 'RETURN' && conditionOnReturn) {
      updates.condition = conditionOnReturn;
    }

    await updateDoc(productRef, updates);
  };

  return {
    products,
    transactions,
    loading,
    error,
    addProduct,
    registerTransaction
  };
}
