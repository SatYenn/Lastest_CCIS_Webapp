import { useCallback } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useFormLinking() {
  const linkFormToUser = useCallback(async (formId: string, formType: 'evaluation' | 'payment', email: string) => {
    try {
      // Find user by email
      const usersQuery = query(
        collection(db, 'users'),
        where('email', '==', email)
      );
      const userSnapshot = await getDocs(usersQuery);

      if (!userSnapshot.empty) {
        const userId = userSnapshot.docs[0].id;

        // Update the form with the user ID
        const formRef = doc(db, `${formType}s`, formId);
        await updateDoc(formRef, {
          userId,
          linkedAt: new Date(),
        });

        // Create a procedure entry
        const procedureData = {
          userId,
          userEmail: email,
          type: formType,
          status: 'submitted',
          currentStage: 1,
          totalStages: formType === 'evaluation' ? 4 : 3,
          submittedAt: new Date(),
          updatedAt: new Date(),
          documents: [],
          notes: [],
          formId,
        };

        await addDoc(collection(db, 'procedures'), procedureData);

        // Add to user's activity log
        await addDoc(collection(db, 'activities'), {
          type: 'form_submission',
          userId,
          userName: `${userSnapshot.docs[0].data().firstName} ${userSnapshot.docs[0].data().lastName}`,
          action: `Nouveau formulaire de ${formType} soumis`,
          timestamp: new Date(),
          details: `Formulaire ${formType} lié au compte utilisateur`,
        });
      }
    } catch (error) {
      console.error('Error linking form to user:', error);
      throw error;
    }
  }, []);

  return {
    linkFormToUser,
  };
}