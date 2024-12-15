import { useState, useCallback, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  updateDoc,
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Procedure, ProcedureStatus } from '@/types/procedure';

interface UseProceduresOptions {
  userId?: string;
  type?: string;
  status?: ProcedureStatus;
}

export function useProcedures(options: UseProceduresOptions = {}) {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProcedures = useCallback(async () => {
    try {
      let q = query(
        collection(db, 'procedures'),
        orderBy('submittedAt', 'desc')
      );

      if (options.userId) {
        q = query(q, where('userId', '==', options.userId));
      }
      if (options.type) {
        q = query(q, where('type', '==', options.type));
      }
      if (options.status) {
        q = query(q, where('status', '==', options.status));
      }

      const snapshot = await getDocs(q);
      const proceduresData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Procedure[];

      setProcedures(proceduresData);
      setError(null);
    } catch (err) {
      console.error('Error fetching procedures:', err);
      setError('Error fetching procedures');
    } finally {
      setIsLoading(false);
    }
  }, [options.userId, options.type, options.status]);

  useEffect(() => {
    fetchProcedures();
  }, [fetchProcedures]);

  const updateProcedureStatus = async (
    procedureId: string, 
    status: ProcedureStatus,
    currentStage?: number,
    note?: string
  ) => {
    try {
      const procedureRef = doc(db, 'procedures', procedureId);
      const updateData: any = {
        status,
        updatedAt: serverTimestamp(),
      };

      if (typeof currentStage === 'number') {
        updateData.currentStage = currentStage;
      }

      if (note) {
        updateData.notes = {
          id: Date.now().toString(),
          content: note,
          createdAt: new Date(),
          createdBy: 'admin'
        };
      }

      await updateDoc(procedureRef, updateData);
      await fetchProcedures();
    } catch (err) {
      console.error('Error updating procedure:', err);
      throw err;
    }
  };

  return {
    procedures,
    isLoading,
    error,
    updateProcedureStatus,
    refresh: fetchProcedures,
  };
}