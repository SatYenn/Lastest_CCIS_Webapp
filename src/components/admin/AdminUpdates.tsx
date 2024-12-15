import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { LoadingSpinner } from '../ui/loading-spinner';
import { toast } from '../ui/toast';

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Update {
  id: string;
  clientId: string;
  status: string;
  description: string;
  date: {
    toDate: () => Date;
  };
}

const AdminUpdates = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [clientUpdates, setClientUpdates] = useState<Update[]>([]);
  const [selectedClientName, setSelectedClientName] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsRef = collection(db, 'users');
        const q = query(clientsRef, where('role', '==', 'client'));
        const snapshot = await getDocs(q);
        const clientsData = snapshot.docs.map(doc => ({
          id: doc.id,
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          email: doc.data().email
        }));
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching clients:', error);
        toast.error('Failed to load clients');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const update = {
        clientId: selectedClient,
        status,
        description,
        date: new Date(),
      };

      await addDoc(collection(db, 'updates'), update);
      
      setSelectedClient('');
      setStatus('');
      setDescription('');
      toast.success('Update added successfully');
    } catch (error) {
      console.error('Error adding update:', error);
      toast.error('Failed to add update');
    } finally {
      setSubmitting(false);
    }
  };

  const viewClientUpdates = async (clientId: string) => {
    try {
      const updatesRef = collection(db, 'updates');
      const q = query(updatesRef, where('clientId', '==', clientId));
      const snapshot = await getDocs(q);
      const updates = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Update[];
      
      const client = clients.find(c => c.id === clientId);
      setSelectedClientName(`${client?.firstName} ${client?.lastName}`);
      setClientUpdates(updates);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching client updates:', error);
      toast.error('Failed to load client updates');
    }
  };

  const deleteUpdate = async (updateId: string) => {
    try {
      await deleteDoc(doc(db, 'updates', updateId));
      setClientUpdates(prevUpdates => 
        prevUpdates.filter(update => update.id !== updateId)
      );
      toast.success('Update deleted successfully');
    } catch (error) {
      console.error('Error deleting update:', error);
      toast.error('Failed to delete update');
    }
  };

  const UpdatesModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Updates for {selectedClientName}</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        {clientUpdates.length === 0 ? (
          <p className="text-gray-500 text-center">No updates found for this client.</p>
        ) : (
          <div className="space-y-4">
            {clientUpdates.map((update) => (
              <div key={update.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`inline-block px-2 py-1 rounded text-sm ${
                      update.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      update.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {update.status}
                    </span>
                    <p className="mt-2">{update.description}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {update.date.toDate().toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteUpdate(update.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add Procedure Update</h1>

      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="mb-4">
          <label className="block mb-2">Select Client</label>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a client...</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {`${client.firstName} ${client.lastName} - ${client.email}`}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select status...</option>
            <option value="In Progress">In Progress</option>
            <option value="Documents Required">Documents Required</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="sm" />
                <span>Adding Update...</span>
              </div>
            ) : (
              'Add Update'
            )}
          </button>

          {selectedClient && (
            <button
              type="button"
              onClick={() => viewClientUpdates(selectedClient)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              View Client Updates
            </button>
          )}
        </div>
      </form>

      {showModal && <UpdatesModal />}
    </div>
  );
};

export default AdminUpdates;
