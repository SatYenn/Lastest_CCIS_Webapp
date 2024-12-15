import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';

interface FormSubmission {
  id: string;
  type: 'evaluation' | 'payment';
  userId: string;
  userName: string;
  fileUrls: {
    pdf?: string;
    excel?: string;
  };
  submittedAt: Date;
  status: 'pending' | 'processed' | 'archived';
}

export function useFormStorage() {
  const uploadForm = async (
    userId: string,
    userName: string,
    type: 'evaluation' | 'payment',
    pdfBlob?: Blob,
    excelBlob?: Blob
  ) => {
    const timestamp = new Date().toISOString();
    const fileUrls: { pdf?: string; excel?: string } = {};

    try {
      // Upload PDF if provided
      if (pdfBlob) {
        const pdfRef = ref(storage, `forms/${type}/${userId}/${timestamp}-form.pdf`);
        await uploadBytes(pdfRef, pdfBlob);
        fileUrls.pdf = await getDownloadURL(pdfRef);
      }

      // Upload Excel if provided
      if (excelBlob) {
        const excelRef = ref(storage, `forms/${type}/${userId}/${timestamp}-form.xlsx`);
        await uploadBytes(excelRef, excelBlob);
        fileUrls.excel = await getDownloadURL(excelRef);
      }

      // Store submission record in Firestore
      await addDoc(collection(db, 'formSubmissions'), {
        type,
        userId,
        userName,
        fileUrls,
        submittedAt: new Date(),
        status: 'pending'
      });

      return fileUrls;
    } catch (error) {
      console.error('Error uploading form:', error);
      throw error;
    }
  };

  const getSubmissions = async (type?: 'evaluation' | 'payment'): Promise<FormSubmission[]> => {
    try {
      let q = query(
        collection(db, 'formSubmissions'),
        orderBy('submittedAt', 'desc')
      );

      if (type) {
        q = query(q, where('type', '==', type));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FormSubmission[];
    } catch (error) {
      console.error('Error fetching submissions:', error);
      throw error;
    }
  };

  return {
    uploadForm,
    getSubmissions
  };
}