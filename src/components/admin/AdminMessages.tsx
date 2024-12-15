import React, { useState, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { LoadingSpinner } from '../ui/loading-spinner';
import { toast } from '../ui/toast';

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const AdminMessages: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const { messages, sendMessage, loading } = useChat(null, true);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      const clientsRef = collection(db, 'users');
      const q = query(clientsRef, where('role', '==', 'client'));
      const snapshot = await getDocs(q);
      const clientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Client[];
      setClients(clientsData);
    };

    fetchClients();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !newMessage.trim()) return;

    try {
      await sendMessage(newMessage, selectedClient);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  // Filter messages for selected client
  const filteredMessages = selectedClient 
    ? messages.filter(m => 
        m.senderId === selectedClient || 
        m.recipientId === selectedClient
      )
    : [];

  return (
    <div className="grid grid-cols-4 gap-4 h-[calc(100vh-100px)]">
      <div className="col-span-1 bg-white p-4 rounded-lg shadow overflow-y-auto">
        {clients.map((client) => (
          <div
            key={client.id}
            className={`p-2 cursor-pointer rounded ${
              selectedClient === client.id ? 'bg-blue-100' : 'hover:bg-gray-100'
            }`}
            onClick={() => setSelectedClient(client.id)}
          >
            <div className="flex justify-between items-center">
              <span>{client.firstName} {client.lastName}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="col-span-3 bg-white p-4 rounded-lg shadow flex flex-col">
        {selectedClient ? (
          <>
            <div className="flex-1 overflow-y-auto mb-4">
              {loading ? (
                <LoadingSpinner />
              ) : (
                filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 ${
                      message.isAdmin ? 'ml-auto text-right' : 'mr-auto'
                    }`}
                  >
                    <div className="text-sm text-gray-600 mb-1">
                      {message.isAdmin ? 'Admin' : message.senderName}
                    </div>
                    <div
                      className={`inline-block p-3 rounded-lg ${
                        message.isAdmin
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100'
                      }`}
                    >
                      {message.content}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {message.timestamp?.toDate().toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={handleSendMessage} className="mt-auto">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 p-2 border rounded"
                  placeholder="Type your message..."
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  disabled={!newMessage.trim()}
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a client to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
