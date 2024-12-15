// src/components/client/ClientUpdates.tsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { LoadingSpinner } from '../ui/loading-spinner';

interface Update {
  id: string;
  clientId: string;
  status: string;
  description: string;
  date: Timestamp;
}

const ClientUpdates: React.FC = () => {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.log('No authenticated user found');
          setError('Please log in to view updates');
          setLoading(false);
          return;
        }

        console.log('Fetching updates for user:', currentUser.uid);
        
        const updatesRef = collection(db, 'updates');
        const q = query(
          updatesRef,
          where('clientId', '==', currentUser.uid)
        );
        
        const snapshot = await getDocs(q);
        console.log(`Found ${snapshot.docs.length} updates`);

        if (snapshot.empty) {
          console.log('No updates found for user');
          setUpdates([]);
          setLoading(false);
          return;
        }

        const updatesData = snapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Update data:', data);
          return {
            id: doc.id,
            clientId: data.clientId,
            status: data.status,
            description: data.description,
            date: data.date
          };
        });

        setUpdates(updatesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching updates:', err);
        setError('Failed to load updates');
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (updates.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No updates available at this time.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Procedure Updates</h2>
      <div className="space-y-4">
        {updates.map((update) => (
          <div
            key={update.id}
            className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500"
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`inline-block px-2 py-1 rounded text-sm ${
                update.status === 'Approved' ? 'bg-green-100 text-green-800' :
                update.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {update.status}
              </span>
              <span className="text-sm text-gray-500">
                {update.date?.toDate().toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <p className="text-gray-700 mt-2">{update.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientUpdates;