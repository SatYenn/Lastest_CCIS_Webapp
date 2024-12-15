import { useState, useCallback } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { toast } from '../components/ui/toast';

export function useFormSubmissions() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const createSubmission = useCallback(async (
    type: 'evaluation' | 'payment',
    data: any
  ): Promise<string> => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Add error handling for Firebase connection
      if (!db) {
        throw new Error('Firebase database connection not established');
      }

      // Validate data before submission
      if (!data) {
        throw new Error('No data provided for submission');
      }

      // Clean and prepare data for Firestore
      const cleanData = {
        ...data,
        ...(type === 'evaluation' && {
          personalInfo: {
            ...data.personalInfo,
            birthDate: data.personalInfo.birthDate ? new Date(data.personalInfo.birthDate) : null,
            monthlySalary: Number(data.personalInfo.monthlySalary) || 0,
          },
          workExperience: {
            ...data.workExperience,
            yearsOfExperience: Number(data.workExperience.yearsOfExperience) || 0,
          },
          immigrationDetails: {
            ...data.immigrationDetails,
            familySize: Number(data.immigrationDetails.familySize) || 1,
            budget: data.immigrationDetails.budget === 'undisclosed' ? 
              'undisclosed' : 
              Number(data.immigrationDetails.budget) || undefined,
          }
        })
      };

      console.log('Submitting data to Firebase:', cleanData);

      // Create submission document with error handling
      const submissionsCollection = collection(db, `${type}s`);
      const docRef = await addDoc(submissionsCollection, {
        type,
        data: cleanData,
        userId: user?.uid || null,
        userName: user ? `${user.firstName} ${user.lastName}` : 
          type === 'evaluation' ? 
            `${data.personalInfo.firstName} ${data.personalInfo.lastName}` : 
            data.name,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log('Submission successful, document ID:', docRef.id);
      
      toast.success(
        type === 'evaluation' 
          ? 'Votre évaluation a été soumise avec succès !'
          : 'Votre paiement a été enregistré avec succès !'
      );

      return docRef.id;
    } catch (error) {
      console.error('Error creating submission:', error);
      const errorMessage = error instanceof Error ? 
        error.message : 
        'Une erreur est survenue lors de la soumission. Veuillez réessayer.';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [user]);

  return {
    createSubmission,
    isSubmitting,
    error,
  };
}