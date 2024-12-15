import { useState, useCallback, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  serverTimestamp, 
  onSnapshot,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import type { Message } from '@/types/portal';

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    let unsubscribe: () => void;

    const setupMessagesListener = async () => {
      try {
        // Create a chat thread if it doesn't exist
        const threadQuery = query(
          collection(db, 'chatThreads'),
          where('userId', '==', user.id)
        );
        const threadSnapshot = await getDocs(threadQuery);
        
        let threadId: string;
        
        if (threadSnapshot.empty) {
          const threadRef = await addDoc(collection(db, 'chatThreads'), {
            userId: user.id,
            userName: `${user.firstName} ${user.lastName}`,
            createdAt: serverTimestamp(),
            lastMessage: null,
            unreadCount: 0,
            status: 'active'
          });
          threadId = threadRef.id;
        } else {
          threadId = threadSnapshot.docs[0].id;
        }

        // Set up real-time listener for messages
        const messagesQuery = query(
          collection(db, 'messages'),
          where('threadId', '==', threadId),
          orderBy('timestamp', 'desc')
        );

        unsubscribe = onSnapshot(
          messagesQuery,
          (snapshot) => {
            const newMessages = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              timestamp: (doc.data().timestamp as Timestamp).toDate()
            })) as Message[];
            
            setMessages(newMessages);
            setError(null);
            setIsLoading(false);
          },
          (err) => {
            console.error('Error in messages listener:', err);
            setError('Erreur lors de la réception des messages. Veuillez actualiser la page.');
            setIsLoading(false);
          }
        );
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Erreur lors du chargement des messages. Veuillez réessayer.');
        setIsLoading(false);
      }
    };

    setupMessagesListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  const sendMessage = async (content: string) => {
    if (!user || !content.trim()) return;

    try {
      // Get the user's chat thread
      const threadQuery = query(
        collection(db, 'chatThreads'),
        where('userId', '==', user.id)
      );
      const threadSnapshot = await getDocs(threadQuery);
      
      if (threadSnapshot.empty) {
        throw new Error('Chat thread not found');
      }

      const threadId = threadSnapshot.docs[0].id;

      // Add the message
      await addDoc(collection(db, 'messages'), {
        threadId,
        content: content.trim(),
        userId: user.id,
        timestamp: serverTimestamp(),
        isRead: false,
      });

      setError(null);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Erreur lors de l\'envoi du message. Veuillez réessayer.');
      throw error;
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
}