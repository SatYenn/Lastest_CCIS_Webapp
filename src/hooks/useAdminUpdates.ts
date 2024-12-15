import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, orderBy, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './useAuth';
import type { AdminUpdate } from '@/types/chat';

export function useAdminUpdates() {
  const [updates, setUpdates] = useState<AdminUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'adminUpdates'),
      where('visibleTo', 'array-contains', user.role === 'admin' ? 'all' : user.id),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const newUpdates = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as AdminUpdate[];
        
        // Filter out expired updates
        const now = new Date();
        const validUpdates = newUpdates.filter(update => 
          !update.expiresAt || new Date(update.expiresAt) > now
        );
        
        setUpdates(validUpdates);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching updates:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const createUpdate = useCallback(async (
    updateData: Omit<AdminUpdate, 'id' | 'timestamp'>
  ) => {
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    try {
      const docRef = await addDoc(collection(db, 'adminUpdates'), {
        ...updateData,
        timestamp: new Date()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating update:', error);
      throw error;
    }
  }, [user]);

  const updateUpdate = useCallback(async (
    updateId: string,
    updateData: Partial<AdminUpdate>
  ) => {
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    try {
      await updateDoc(doc(db, 'adminUpdates', updateId), updateData);
    } catch (error) {
      console.error('Error updating update:', error);
      throw error;
    }
  }, [user]);

  const deleteUpdate = useCallback(async (updateId: string) => {
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    try {
      await deleteDoc(doc(db, 'adminUpdates', updateId));
    } catch (error) {
      console.error('Error deleting update:', error);
      throw error;
    }
  }, [user]);

  return {
    updates,
    isLoading,
    createUpdate,
    updateUpdate,
    deleteUpdate
  };
}