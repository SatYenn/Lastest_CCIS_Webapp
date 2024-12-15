import React, { useReducer } from 'react';
import { storage, db } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { services } from '../components/assistance/AssServices';
import { ContactForm } from '../components/assistance/ContactForm';
import { PaymentInstructions } from '../components/assistance/PaymentInstructions';
import { FileUpload } from '../components/assistance/FileUpload';
import { StatusMessages } from '../components/assistance/StatusMessages';
import { SubmitButton } from '../components/assistance/SubmitButton';
import { SuccessMessage } from '../components/assistance/SuccessMessage';
import { ServicesList } from '../components/assistance/ServicesList';

interface FormData {
  email: string;
  name: string;
  phone: string;
  details: string;
  paymentProof: File | null;
}

interface State {
  selectedService: string;
  formData: FormData;
  showPaymentInstructions: boolean;
  submissionComplete: boolean;
  loadingState: { isSubmitting: boolean; isUploading: boolean };
  uploadStatus: string;
  error: string | null;
}

type Action =
  | { type: 'SET_SERVICE'; payload: string }
  | { type: 'SET_FORM_DATA'; field: keyof FormData; value: string }
  | { type: 'SET_FILE'; payload: File }
  | { type: 'TOGGLE_INSTRUCTIONS' }
  | { type: 'SUBMISSION_SUCCESS' }
  | { type: 'SET_LOADING'; key: 'isSubmitting' | 'isUploading'; value: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_UPLOAD_STATUS'; payload: string };

const initialState: State = {
  selectedService: '',
  formData: { email: '', name: '', phone: '', details: '', paymentProof: null },
  showPaymentInstructions: false,
  submissionComplete: false,
  loadingState: { isSubmitting: false, isUploading: false },
  uploadStatus: '',
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_SERVICE':
      return { ...state, selectedService: action.payload };
    case 'SET_FORM_DATA':
      return { ...state, formData: { ...state.formData, [action.field]: action.value } };
    case 'SET_FILE':
      return { ...state, formData: { ...state.formData, paymentProof: action.payload } };
    case 'TOGGLE_INSTRUCTIONS':
      return { ...state, showPaymentInstructions: true };
    case 'SUBMISSION_SUCCESS':
      return { ...state, submissionComplete: true };
    case 'SET_LOADING':
      return { ...state, loadingState: { ...state.loadingState, [action.key]: action.value } };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_UPLOAD_STATUS':
      return { ...state, uploadStatus: action.payload };
    default:
      return state;
  }
}

export function AssistancePayment() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const validateFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) return 'Le fichier est trop volumineux. Maximum 10MB.';
    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type))
      return 'Format de fichier non supporté. Utilisez JPG, PNG ou PDF.';
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      dispatch({ type: 'SET_ERROR', payload: error });
    } else {
      dispatch({ type: 'SET_FILE', payload: file });
      dispatch({ type: 'SET_UPLOAD_STATUS', payload: `Fichier sélectionné: ${file.name}` });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_ERROR', payload: null });
    console.log('Starting submission...'); 

    // First step - just show payment instructions
    if (!state.showPaymentInstructions) {
      console.log('Moving to payment instructions');
      dispatch({ type: 'TOGGLE_INSTRUCTIONS' });
      return;
    }

    // Second step - actual submission
    try {
      dispatch({ type: 'SET_LOADING', key: 'isSubmitting', value: true });
      dispatch({ type: 'SET_UPLOAD_STATUS', payload: 'Démarrage de la soumission...' });
      
      // Basic validation
      if (!state.selectedService) {
        dispatch({ type: 'SET_ERROR', payload: 'Veuillez sélectionner un service' });
        return;
      }

      if (!state.formData.name || !state.formData.email || !state.formData.phone) {
        dispatch({ type: 'SET_ERROR', payload: 'Veuillez remplir tous les champs obligatoires' });
        return;
      }

      if (!state.formData.paymentProof) {
        dispatch({ type: 'SET_ERROR', payload: 'Veuillez télécharger une preuve de paiement' });
        return;
      }

      // Step 1: Save to Firestore first
      try {
        dispatch({ type: 'SET_UPLOAD_STATUS', payload: 'Enregistrement de la demande...' });
        console.log('Starting Firestore document creation...');
        
        // Find selected service details
        const selectedServiceDetails = services.find(s => s.id === state.selectedService);
        if (!selectedServiceDetails) {
          throw new Error('Service non trouvé');
        }

        // Log the data we're trying to save
        const initialServiceRequest = {
          email: state.formData.email,
          name: state.formData.name,
          phone: state.formData.phone,
          details: state.formData.details || "",
          service: selectedServiceDetails,
          status: 'pending',
          timestamp: new Date(),
          paymentProofURL: ''
        };
        
        console.log('Attempting to save data:', initialServiceRequest);

        // First create the document reference
        const docRef = await addDoc(collection(db, 'service-requests'), initialServiceRequest);

        // Try to save to Firestore
        try {
          const docRef = await addDoc(collection(db, 'service-requests'), initialServiceRequest);
          console.log('Document written with ID: ', docRef.id);
          dispatch({ type: 'SET_UPLOAD_STATUS', payload: 'Demande enregistrée, téléchargement du fichier...' });
        } catch (innerError) {
          console.error('Detailed Firestore Error:', {
            error: innerError,
            errorMessage: innerError instanceof Error ? innerError.message : 'Unknown error',
            errorStack: innerError instanceof Error ? innerError.stack : 'No stack trace'
          });
          throw new Error(`Erreur Firestore détaillée: ${innerError instanceof Error ? innerError.message : 'Erreur inconnue'}`);
        }

        // Step 2: Now try to upload the file
        try {
          const file = state.formData.paymentProof;
          
          // Validate file
          if (!file) {
            throw new Error('No file selected');
          }

          // Validate file size (10MB max)
          const maxSize = 10 * 1024 * 1024; // 10MB in bytes
          if (file.size > maxSize) {
            throw new Error(`File size (${file.size}) exceeds maximum allowed (${maxSize})`);
          }

          // Validate file type
          const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
          if (!allowedTypes.includes(file.type)) {
            throw new Error(`File type (${file.type}) not allowed. Allowed types: ${allowedTypes.join(', ')}`);
          }

          // Create a safe file name
          const fileExtension = file.name.split('.').pop();
          const timestamp = Date.now();
          const randomString = Math.random().toString(36).substring(7);
          const safeFileName = `${timestamp}-${randomString}.${fileExtension}`;
          const filePath = `payment-proofs/${safeFileName}`;

          console.log('Preparing to upload file:', {
            originalName: file.name,
            safeName: safeFileName,
            type: file.type,
            size: file.size,
            path: filePath
          });

          // Create storage reference
          const storageRef = ref(storage, filePath);

          // Set metadata
          const metadata = {
            contentType: file.type,
            customMetadata: {
              'originalName': file.name,
              'timestamp': timestamp.toString(),
              'size': file.size.toString()
            }
          };

          // Upload file
          dispatch({ type: 'SET_UPLOAD_STATUS', payload: 'Téléchargement du fichier...' });
          console.log('Starting upload...');
          
          const uploadResult = await uploadBytes(storageRef, file, metadata);
          console.log('Upload completed:', uploadResult);

          // Get download URL
          dispatch({ type: 'SET_UPLOAD_STATUS', payload: 'Obtention du lien...' });
          const downloadURL = await getDownloadURL(uploadResult.ref);
          console.log('Download URL obtained:', downloadURL);

          // Update Firestore document
          dispatch({ type: 'SET_UPLOAD_STATUS', payload: 'Mise à jour de la demande...' });
          await updateDoc(doc(db, 'service-requests', docRef.id), {
            paymentProofURL: downloadURL,
            fileName: safeFileName
          });

          console.log('Document updated successfully');
          dispatch({ type: 'SET_UPLOAD_STATUS', payload: 'Demande complétée avec succès!' });
          dispatch({ type: 'SUBMISSION_SUCCESS' });

        } catch (storageError) {
          console.error('Storage Error:', {
            name: (storageError as Error).name,
            message: (storageError as Error).message,
            code: (storageError as any).code,
            stack: (storageError as Error).stack,
            file: state.formData.paymentProof ? {
              name: state.formData.paymentProof.name,
              type: state.formData.paymentProof.type,
              size: state.formData.paymentProof.size
            } : 'No file'
          });

          dispatch({ type: 'SET_ERROR', payload: 
            `Erreur lors du téléchargement: ${storageError instanceof Error ? storageError.message : 'Erreur inconnue'}. Veuillez réessayer ou nous contacter.`
          });
        }

      } catch (firestoreError) {
        console.error('Firestore Error:', {
          error: firestoreError,
          errorMessage: firestoreError instanceof Error ? firestoreError.message : 'Unknown error',
          errorStack: firestoreError instanceof Error ? firestoreError.stack : 'No stack trace',
          state: {
            selectedService: state.selectedService,
            formDataKeys: Object.keys(state.formData),
            serviceDetails: services.find(s => s.id === state.selectedService)
          }
        });
        dispatch({ type: 'SET_ERROR', payload: `Erreur lors de l'enregistrement de la demande: ${firestoreError instanceof Error ? firestoreError.message : 'Erreur inconnue'}` });
        return;
      }

    } catch (error) {
      console.error('General Error:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Une erreur est survenue' });
    } finally {
      dispatch({ type: 'SET_LOADING', key: 'isSubmitting', value: false });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 lg:pt-24">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-red-700 to-red-900 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white font-georgia">
              Assistance & Paiement
            </h1>
            <p className="mt-3 max-w-md mx-auto text-lg sm:text-xl md:text-2xl text-red-100 sm:mt-5 md:max-w-3xl font-merriweather">
              Sélectionnez vos services et procédez au paiement en toute sécurité
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10">
          {state.submissionComplete ? (
            <SuccessMessage />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <ServicesList
                selectedService={state.selectedService}
                onServiceSelect={(id) => dispatch({ type: 'SET_SERVICE', payload: id })}
              />

              <ContactForm
                formData={state.formData}
                onChange={(field, value) => 
                  dispatch({ type: 'SET_FORM_DATA', field: field as keyof FormData, value })}
              />

              <StatusMessages
                error={state.error}
                uploadStatus={state.uploadStatus}
              />

              {state.showPaymentInstructions && (
                <>
                  <PaymentInstructions />
                  <FileUpload
                    onFileChange={handleFileChange}
                    fileName={state.formData.paymentProof?.name || null}
                    isLoading={state.loadingState.isUploading}
                  />
                </>
              )}

              <SubmitButton
                isLoading={state.loadingState.isSubmitting}
                showPaymentInstructions={state.showPaymentInstructions}
              />
            </form>
          )}
        </div>
      </div>

      {/* Optional: Additional Information Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 font-georgia mb-4">
              Besoin d'aide?
            </h2>
            <p className="text-gray-600 font-merriweather">
              Pour toute question concernant nos services ou le processus de paiement, 
              n'hésitez pas à nous contacter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
