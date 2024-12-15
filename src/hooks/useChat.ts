import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  where 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  timestamp: any;
  isAdmin: boolean;
}

export function useChat(userId: string | null | undefined, isAdmin: boolean = false) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const messagesRef = collection(db, 'messages');
    let q;

    if (isAdmin) {
      // Admin query: Fetch messages related to specific client, or all if no client is selected
      if (userId) {
        q = query(
          messagesRef,
          where('recipientId', '==', userId),
          orderBy('timestamp', 'asc')
        );
      } else {
        q = query(messagesRef, orderBy('timestamp', 'asc'));
      }
    } else {
      // Client query: Fetch only their messages
      q = query(
        messagesRef,
        where('senderId', 'in', [auth.currentUser.uid]),
        orderBy('timestamp', 'asc')
      );
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as Message[];
        setMessages(newMessages);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching messages:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, isAdmin]);

  const sendMessage = async (content: string, recipientId: string) => {
    if (!auth.currentUser) return;

    try {
      const currentUser = auth.currentUser;
      await addDoc(collection(db, 'messages'), {
        content,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || 'Anonymous',
        recipientId: recipientId,
        timestamp: serverTimestamp(),
        isAdmin: isAdmin
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  return { messages, sendMessage, loading };
}

