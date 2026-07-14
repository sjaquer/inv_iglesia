import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, addDoc, serverTimestamp, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Worker, Schedule } from '../types';

export function useItinerary() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) {
      setError('Firebase no inicializado');
      setLoading(false);
      return;
    }

    const workersQuery = query(collection(db, 'workers'), orderBy('createdAt', 'desc'));
    const schedulesQuery = query(collection(db, 'schedules'));

    const unsubscribeWorkers = onSnapshot(workersQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Worker[];
      setWorkers(data);
      if (schedules.length > 0) setLoading(false);
    }, (err) => {
      console.error(err);
      setError('Error al cargar trabajadores');
    });

    const unsubscribeSchedules = onSnapshot(schedulesQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Schedule[];
      
      // Sort client-side to prevent requiring custom composite Firestore indexes
      data.sort((a, b) => {
        if (a.date !== b.date) {
          return a.date.localeCompare(b.date);
        }
        return a.startTime.localeCompare(b.startTime);
      });

      setSchedules(data);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setError('Error al cargar itinerarios');
    });

    return () => {
      unsubscribeWorkers();
      unsubscribeSchedules();
    };
  }, []);

  const addWorker = async (workerData: Omit<Worker, 'id' | 'createdAt'>) => {
    if (!db) throw new Error('DB not initialized');
    await addDoc(collection(db, 'workers'), {
      ...workerData,
      createdAt: serverTimestamp()
    });
  };

  const deleteWorker = async (id: string) => {
    if (!db) throw new Error('DB not initialized');
    await deleteDoc(doc(db, 'workers', id));
  };

  const addSchedule = async (scheduleData: Omit<Schedule, 'id' | 'createdAt'>) => {
    if (!db) throw new Error('DB not initialized');
    await addDoc(collection(db, 'schedules'), {
      ...scheduleData,
      createdAt: serverTimestamp()
    });
  };

  const deleteSchedule = async (id: string) => {
    if (!db) throw new Error('DB not initialized');
    await deleteDoc(doc(db, 'schedules', id));
  };

  return { workers, schedules, loading, error, addWorker, deleteWorker, addSchedule, deleteSchedule };
}
