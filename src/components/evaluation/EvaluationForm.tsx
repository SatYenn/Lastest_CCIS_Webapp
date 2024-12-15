import React, { useState, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { useFormSubmissions } from '../../hooks/useFormSubmissions';
import { evaluationSchema } from './evaluationSchema';
import { ProgressBar } from './ProgressBar';
import { PersonalInfoStep } from './PersonalInfoStep';
import { EducationStep } from './EducationStep';
import { ProfessionalStep } from './ProfessionalStep';
import { ImmigrationStep } from './ImmigrationStep';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, AlertTriangle, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from '../ui/toast';
import type { EvaluationFormData } from '../../types/evaluation';
import ErrorBoundary from '../ErrorBoundary';

const STEPS = ['personal', 'education', 'professional', 'immigration'] as const
type Step = typeof STEPS[number];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

interface FormErrorDisplayProps {
  error: {
    message?: string;
    type?: string;
    [key: string]: any;
  };
}

const FormErrorDisplay = ({ error }: FormErrorDisplayProps) => {
  const formatError = (err: any) => {
    try {
      if (err instanceof Error) {
        return {
          message: err.message,
          stack: err.stack,
        };
      }
      return JSON.stringify(err, null, 2);
    } catch {
      return 'Unable to format error';
    }
  };

  const hasErrorContent = (err: any) => {
    return err && (
      err.message ||
      err.type ||
      Object.keys(err).length > 0
    );
  };

  if (!hasErrorContent(error)) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-red-50 text-red-800 rounded-md"
    >
      <div className="flex items-start space-x-2">
        <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium">Une erreur est survenue</p>
          <details className="mt-2 text-sm">
            <summary className="cursor-pointer">Voir les détails</summary>
            <pre className="mt-2 whitespace-pre-wrap text-xs">
              {formatError(error)}
            </pre>
          </details>
        </div>
      </div>
    </motion.div>
  );
};

const EvaluationFormContent = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [direction, setDirection] = useState(0);
  const { createSubmission, isSubmitting, error: submissionError } = useFormSubmissions();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isValid },
    trigger,
    watch,
  } = useForm<EvaluationFormData>({
    resolver: zodResolver(evaluationSchema),
    mode: 'onChange',
    defaultValues: {
      personalInfo: {
        monthlySalary: 50.000,
      },
      workExperience: {
        yearsOfExperience: 0,
      },
      immigrationDetails: {
        familySize: 1,
        budget: 1.000,
        programInterest: [],
        previousApplications: false,
        previousRefusals: false,
      },
    },
  });

  const currentStepIndex = STEPS.indexOf(currentStep);
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const validateCurrentStep = useCallback(async () => {
    try {
      const fieldsToValidate = {
        personal: ['personalInfo'],
        education: ['education'],
        professional: ['workExperience'],
        immigration: ['immigrationDetails'],
      }[currentStep];

      const isValid = await trigger(fieldsToValidate as any);
      
      if (!isValid) {
        const stepErrors = Object.entries(errors)
          .filter(([key]) => fieldsToValidate.includes(key))
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

        if (Object.keys(stepErrors).length > 0) {
          toast.error('Veuillez corriger les erreurs avant de continuer');
          console.error('Validation errors:', stepErrors);
        }
      }

      return isValid;
    } catch (error) {
      console.error('Validation error:', error);
      toast.error('Erreur lors de la validation du formulaire');
      throw error;
    }
  }, [currentStep, trigger, errors]);

  const handleStepChange = useCallback(async (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      const isStepValid = await validateCurrentStep();
      if (!isStepValid) {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    const currentIndex = STEPS.indexOf(currentStep);
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    if (newIndex >= 0 && newIndex < STEPS.length) {
      setDirection(direction === 'next' ? 1 : -1);
      setCurrentStep(STEPS[newIndex]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep, validateCurrentStep]);

  const onSubmit = useCallback(async (data: EvaluationFormData) => {
    try {
      console.log('Form data being submitted:', data);
      console.log('Current errors:', errors);
      
      await createSubmission('evaluation', data);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast.success('Votre évaluation a été soumise avec succès !');
    } catch (error) {
      console.error('Submission error:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Une erreur inconnue est survenue';
      toast.error(errorMessage);
      
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      }
    }
  }, [createSubmission, errors]);

  const processForm = handleSubmit(
    (data) => {
      console.log('Form is valid, attempting submission');
      onSubmit(data);
    },
    (errors) => {
      console.log('Form validation failed:', errors);
      toast.error('Veuillez corriger les erreurs dans le formulaire');
    }
  );

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8 text-center"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="flex justify-center mb-6"
        >
          <CheckCircle className="h-16 w-16 text-green-500" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4 font-georgia">
          Merci pour votre soumission !
        </h2>
        
        <p className="text-gray-600 mb-8 font-merriweather">
          Votre évaluation a été reçue avec succès. Un de nos conseillers vous contactera bientôt pour discuter de vos options d'immigration.
        </p>

        <div className="grid gap-4 max-w-md mx-auto">
          <Button asChild variant="default" className="w-full">
            <Link to="/signup">
              Créer un compte
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full">
            <Link to="/login">
              Se connecter à un compte existant
            </Link>
          </Button>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button asChild variant="outline">
              <Link to="/">Accueil</Link>
            </Button>

            <Button asChild variant="outline">
              <Link to="/services">Nos services</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8" ref={formRef}>
      <ProgressBar currentStep={currentStep} />

      <form onSubmit={processForm} className="space-y-6" noValidate>
        {(submissionError || Object.keys(errors).length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 text-red-800 rounded-md"
          >
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">
                  {submissionError ? "Erreur de soumission" : "Veuillez corriger les erreurs suivantes :"}
                </p>
                {submissionError && (
                  <details className="mt-2 text-sm">
                    <summary className="cursor-pointer">Voir les détails</summary>
                    <pre className="mt-2 whitespace-pre-wrap">
                      {JSON.stringify(submissionError, null, 2)}
                    </pre>
                  </details>
                )}
                {Object.keys(errors).length > 0 && (
                  <ul className="mt-2 text-sm list-disc list-inside">
                    {Object.entries(errors).map(([key, value]: any) => (
                      <li key={key}>
                        <strong>{key}:</strong> {value.message}
                        {value.type && (
                          <details className="ml-4">
                            <summary className="cursor-pointer text-xs">Type d'erreur</summary>
                            <code className="text-xs">{value.type}</code>
                          </details>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        )}

        <div className="relative">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
            >
              {currentStep === 'personal' && (
                <PersonalInfoStep 
                  register={register} 
                  control={control}
                  setValue={setValue}
                  errors={errors} 
                />
              )}

              {currentStep === 'education' && (
                <EducationStep 
                  register={register} 
                  control={control}
                  errors={errors}
                />
              )}

              {currentStep === 'professional' && (
                <ProfessionalStep 
                  register={register} 
                  control={control}
                  errors={errors}
                />
              )}

              {currentStep === 'immigration' && (
                <ImmigrationStep 
                  register={register} 
                  control={control}
                  setValue={setValue}
                  errors={errors}
                  watch={watch}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-between pt-6">
          {currentStepIndex > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => handleStepChange('prev')}
              disabled={isSubmitting}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Précédent
            </Button>
          )}

          {isLastStep ? (
            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="ml-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                'Soumettre'
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => handleStepChange('next')}
              className="ml-auto"
            >
              Suivant
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

export function EvaluationForm() {
  return (
    <ErrorBoundary>
      <EvaluationFormContent />
    </ErrorBoundary>
  );
}