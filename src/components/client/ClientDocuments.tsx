import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { storage, db } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { LoadingSpinner } from '../ui/loading-spinner';
import { Button } from '../ui/button';
import { toast } from '../ui/toast';
import { Dialog } from '../ui/dialog';

interface Document {
  id: string;
  userId: string;
  name: string;
  url: string;
  type: string;
  uploadDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  originalName?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const ClientDocuments: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customFileName, setCustomFileName] = useState('');
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 10MB limit';
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload PDF, JPEG, PNG, or DOC files';
    }
    return null;
  };

  const fetchDocuments = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const docsRef = collection(db, 'documents');
      const q = query(docsRef, where('userId', '==', user.id));
      const snapshot = await getDocs(q);
      
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadDate: doc.data().uploadDate.toDate()
      })) as Document[];
      
      setDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    const validationError = validateFile(file);

    if (validationError) {
      toast.error(validationError);
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
    setCustomFileName(file.name);
    setShowNameDialog(true);
  };

  const handleUpload = async () => {
    if (!selectedFile || !user || !customFileName) return;
    setUploading(true);
    setError(null);

    try {
      // Create safe filename
      const safeFileName = customFileName.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileExtension = selectedFile.name.split('.').pop();
      const finalFileName = `${safeFileName}.${fileExtension}`;

      // Upload to Storage
      const storageRef = ref(storage, `documents/${user.id}/${finalFileName}`);
      await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(storageRef);

      // Add to Firestore
      await addDoc(collection(db, 'documents'), {
        userId: user.id,
        name: finalFileName,
        originalName: selectedFile.name,
        url: downloadURL,
        type: selectedFile.type,
        uploadDate: new Date(),
        status: 'pending'
      });

      toast.success('Document uploaded successfully');
      await fetchDocuments();
      setShowNameDialog(false);
      setSelectedFile(null);
      setCustomFileName('');
    } catch (error) {
      console.error('Error uploading document:', error);
      setError('Failed to upload document. Please try again.');
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (document: Document) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      // Delete from Storage
      const storageRef = ref(storage, document.url);
      await deleteObject(storageRef);

      // Delete from Firestore
      await deleteDoc(doc(db, 'documents', document.id));

      toast.success('Document deleted successfully');
      await fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document. Please try again.');
    }
  };

  const getStatusBadgeClass = (status: Document['status']) => {
    const baseClasses = 'text-sm px-2 py-1 rounded';
    switch (status) {
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="space-y-6">
      <div className="upload-section">
        <input
          type="file"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
          id="file-upload"
          accept={ALLOWED_FILE_TYPES.join(',')}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload Document'}
        </label>
      </div>

      {showNameDialog && (
        <Dialog
          isOpen={showNameDialog}
          onClose={() => setShowNameDialog(false)}
          title="Customize File Name"
        >
          <div className="space-y-4">
            <input
              type="text"
              value={customFileName}
              onChange={(e) => setCustomFileName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter file name"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setShowNameDialog(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!customFileName || uploading}
              >
                Upload
              </Button>
            </div>
          </div>
        </Dialog>
      )}

      <div className="documents-list space-y-4">
        {documents.length === 0 ? (
          <p className="text-center text-gray-500">No documents uploaded yet</p>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-medium">{doc.name}</h3>
                {doc.originalName && (
                  <p className="text-sm text-gray-400">
                    Original: {doc.originalName}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  Uploaded: {doc.uploadDate.toLocaleDateString()}
                </p>
                <span className={getStatusBadgeClass(doc.status)}>
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
                  onClick={() => handleDelete(doc)}
                  variant="destructive"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientDocuments;
