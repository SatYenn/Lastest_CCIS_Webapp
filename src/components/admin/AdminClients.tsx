import * as React from 'react';
const { useState, useEffect } = React;
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { LoadingSpinner } from '../ui/loading-spinner';
import { useNavigate } from 'react-router-dom';

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: any;
  role: string;
}

const AdminClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsRef = collection(db, 'users');
        const q = query(clientsRef, where('role', '==', 'client'));
        const snapshot = await getDocs(q);
        const clientsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Client[];
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching clients:', error);
        setError('Failed to load clients');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleMessageClick = (clientId: string) => {
    navigate('/admin/messages', { state: { selectedClientId: clientId } });
  };

  const handleViewDetailsClick = (clientId: string) => {
    navigate('/admin/documents', { state: { selectedClientId: clientId } });
  };

  const filteredClients = clients.filter(client =>
    `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <LoadingSpinner size="lg" />
    </div>
  );

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Client Management</h1>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search clients..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Created At</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No clients found
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => (
                <tr key={client.id}>
                  <td className="border px-4 py-2">
                    {`${client.firstName} ${client.lastName}`}
                  </td>
                  <td className="border px-4 py-2">{client.email}</td>
                  <td className="border px-4 py-2">
                    {client.createdAt?.toDate().toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">
                    <button 
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                      onClick={() => handleViewDetailsClick(client.id)}
                    >
                      View Details
                    </button>
                    <button 
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      onClick={() => handleMessageClick(client.id)}
                    >
                      Message
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminClients;
