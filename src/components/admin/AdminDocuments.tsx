import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { 
  collection, 
  query, 
  getDocs, 
  updateDoc, 
  doc 
} from 'firebase/firestore';
import { LoadingSpinner } from '../ui/loading-spinner';
import { Button } from '../ui/button';
import { toast } from '../ui/toast';

interface Document {
  id: string;
  userId: string;
  name: string;
  url: string;
  type: string;
  uploadDate: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export const AdminDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const docsRef = collection(db, 'documents');
      const q = query(docsRef);
      const snapshot = await getDocs(q);
      
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadDate: doc.data().uploadDate.toDate()
      })) as Document[];
      
      setDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const updateDocumentStatus = async (documentId: string, status: 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'documents', documentId), { status });
      toast.success(`Document ${status}`);
      fetchDocuments();
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('Failed to update document status');
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Document Management</h2>
      
      <div className="documents-list space-y-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-medium">{doc.name}</h3>
              <p className="text-sm text-gray-500">
                Uploaded: {doc.uploadDate.toLocaleDateString()}
              </p>
              <span className={`text-sm px-2 py-1 rounded ${
                doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {doc.status}
              </span>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => window.open(doc.url, '_blank')}
                variant="outline"
              >
                View
              </Button>
              <Button
                onClick={() => updateDocumentStatus(doc.id, 'approved')}
                variant="success"
                disabled={doc.status === 'approved'}
              >
                Approve
              </Button>
              <Button
                onClick={() => updateDocumentStatus(doc.id, 'rejected')}
                variant="destructive"
                disabled={doc.status === 'rejected'}
              >
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
