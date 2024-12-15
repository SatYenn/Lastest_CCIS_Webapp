import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, Timestamp, or } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { LoadingSpinner } from '../ui/loading-spinner';
import { Button } from '../ui/button';
import { toast } from '../ui/toast';

interface Message {
  id: string;
  content: string;
  senderId: string;
  recipientId?: string;
  isAdmin: boolean;
  timestamp: Timestamp;
}

const ClientMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.log('No authenticated user found');
          setLoading(false);
          return;
        }

        console.log('Fetching messages for user:', currentUser.uid);
        
        const messagesRef = collection(db, 'messages');
        const q = query(
          messagesRef,
          or(
            where('senderId', '==', currentUser.uid),
            where('recipientId', '==', currentUser.uid)
          )
        );
        
        const snapshot = await getDocs(q);
        console.log('Raw messages data:', snapshot.docs.map(doc => doc.data()));

        const messagesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Message[];

        // Sort messages by timestamp
        const sortedMessages = messagesData.sort((a, b) => {
          const timeA = a.timestamp?.toMillis() || 0;
          const timeB = b.timestamp?.toMillis() || 0;
          return timeA - timeB;
        });

        console.log('Processed messages:', sortedMessages);
        setMessages(sortedMessages);
      } catch (error) {
        console.error('Detailed error:', error);
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error('Please log in to send messages');
      return;
    }

    setSending(true);
    try {
      const messageData = {
        content: newMessage,
        senderId: currentUser.uid,
        recipientId: 'admin',
        isAdmin: false,
        timestamp: serverTimestamp(),
      };

      console.log('Sending message:', messageData);
      
      const docRef = await addDoc(collection(db, 'messages'), messageData);
      console.log('Message sent with ID:', docRef.id);
      
      setNewMessage('');
      toast.success('Message sent successfully');
      
      // Refresh messages immediately after sending
      const messagesRef = collection(db, 'messages');
      const q = query(
        messagesRef,
        or(
          where('senderId', '==', currentUser.uid),
          where('recipientId', '==', currentUser.uid)
        )
      );
      
      const snapshot = await getDocs(q);
      const updatedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      
      const sortedMessages = updatedMessages.sort((a, b) => {
        const timeA = a.timestamp?.toMillis() || 0;
        const timeB = b.timestamp?.toMillis() || 0;
        return timeA - timeB;
      });
      
      setMessages(sortedMessages);
    } catch (error) {
      console.error('Detailed send error:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (!auth.currentUser) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p>Please log in to view messages</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="h-[500px] flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <LoadingSpinner size="lg" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-gray-500 text-center">
                No messages yet. Start the conversation!
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === auth.currentUser?.uid ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.senderId === auth.currentUser?.uid
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.senderId === auth.currentUser?.uid
                          ? 'text-blue-100'
                          : 'text-gray-500'
                      }`}>
                        {message.timestamp?.toDate().toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message..."
                disabled={sending}
              />
              <Button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="px-6"
              >
                {sending ? <LoadingSpinner size="sm" /> : 'Send'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientMessages;
