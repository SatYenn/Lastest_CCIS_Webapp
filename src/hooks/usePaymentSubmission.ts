import { useState, useCallback } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { services } from '@/pages/AssistancePayment/data/services';
import type { FormData } from '@/pages/AssistancePayment/types';

export function usePaymentSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitPayment = useCallback(async (
    serviceId: string,
    formData: FormData,
    confirmationMethod: 'upload' | 'whatsapp',
    proofFile?: File
  ) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const service = services.find(s => s.id === serviceId);
      if (!service) throw new Error('Service non trouvé');

      let proofUrl: string | undefined;

      if (proofFile) {
        const fileName = `${Date.now()}-${proofFile.name}`;
        const fileRef = ref(storage, `payment-proofs/${fileName}`);
        await uploadBytes(fileRef, proofFile);
        proofUrl = await getDownloadURL(fileRef);
      }

      await addDoc(collection(db, 'payments'), {
        serviceId,
        serviceName: service.name,
        amount: service.price,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        details: formData.details,
        confirmationMethod,
        proofUrl,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

    } catch (err: any) {
      console.error('Error submitting payment:', err);
      setError(err.message || 'Une erreur est survenue lors de la soumission. Veuillez réessayer.');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    submitPayment,
    isSubmitting,
    error,
  };
}