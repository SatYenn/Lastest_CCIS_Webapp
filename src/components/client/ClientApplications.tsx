import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { format } from 'date-fns';
import { LoadingSpinner } from '../ui/loading-spinner';

interface Application {
  id: string;
  type: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  submissionDate: any;
  lastUpdate: any;
  comments?: string;
}

const ClientApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const applicationsRef = collection(db, 'applications');
        const q = query(applicationsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const applicationsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Application[];

        setApplications(applicationsData);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <LoadingSpinner size="lg" />
    </div>
  );
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Applications</h2>
      
      {applications.length === 0 ? (
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <p>No applications found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <div key={application.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{application.type}</h3>
                  <p className="text-sm text-gray-600">
                    Submitted: {format(application.submissionDate.toDate(), 'PPP')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  application.status === 'completed' ? 'bg-green-100 text-green-800' :
                  application.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {application.status}
                </span>
              </div>

              {application.comments && (
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm">{application.comments}</p>
                </div>
              )}

              <p className="text-sm text-gray-600 mt-4">
                Last updated: {format(application.lastUpdate.toDate(), 'PPP')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientApplications;
