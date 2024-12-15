import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { Input } from '../ui/input';
import type { EvaluationFormData } from '../../types/evaluation';

interface ImmigrationStepProps {
  register: UseFormRegister<EvaluationFormData>;
  errors: FieldErrors<EvaluationFormData>;
  setValue: UseFormSetValue<EvaluationFormData>;
  watch?: UseFormWatch<EvaluationFormData>;
}

export function ImmigrationStep({ 
  register, 
  errors, 
  setValue,
  watch 
}: ImmigrationStepProps) {
  const watchBudget = watch ? watch('immigrationDetails.budget') : undefined;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Programmes d'intérêt *
        </label>
        <div className="mt-2 space-y-2">
          {[
            'Permis de travail',
            'Permis d\'études',
            'Résidence permanente',
            'Parrainage familial',
            'Visa visiteur',
          ].map((program) => (
            <label key={program} className="inline-flex items-center mr-6">
              <input
                type="checkbox"
                value={program}
                {...register('immigrationDetails.programInterest')}
                className="rounded border-gray-300 text-red-600 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
              <span className="ml-2 text-sm text-gray-600">{program}</span>
            </label>
          ))}
        </div>
        {errors.immigrationDetails?.programInterest && (
          <p className="mt-1 text-sm text-red-600">
            {errors.immigrationDetails.programInterest.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Échéance prévue *
          </label>
          <select
            {...register('immigrationDetails.timeframe')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
          >
            <option value="">Sélectionnez une échéance</option>
            <option value="immediate">Immédiatement</option>
            <option value="6months">Dans les 6 mois</option>
            <option value="1year">Dans l'année</option>
            <option value="planning">En phase de planification</option>
          </select>
          {errors.immigrationDetails?.timeframe && (
            <p className="mt-1 text-sm text-red-600">
              {errors.immigrationDetails.timeframe.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Taille de la famille *
          </label>
          <Input
            type="number"
            min="1"
            max="20"
            {...register('immigrationDetails.familySize', {
              valueAsNumber: true,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                const value = parseInt(e.target.value, 10);
                setValue('immigrationDetails.familySize', value || 1);
              }
            })}
            defaultValue="1"
            error={errors.immigrationDetails?.familySize?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Budget disponible
          </label>
          <div className="space-y-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.checked) {
                    setValue('immigrationDetails.budget', 'undisclosed');
                    setValue('immigrationDetails.budgetCurrency', undefined);
                  } else {
                    setValue('immigrationDetails.budget', undefined);
                  }
                }}
                checked={watchBudget === 'undisclosed'}
                className="rounded border-gray-300 text-red-600 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
              <span className="ml-2 text-sm text-gray-600">
                Je préfère ne pas divulguer mon budget
              </span>
            </label>

            {watchBudget !== 'undisclosed' && (
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  {...register('immigrationDetails.budget', {
                    setValueAs: (value: string) => value === '' ? undefined : Number(value),
                  })}
                  placeholder="Ex: 5.000.000 FCFA"
                  error={errors.immigrationDetails?.budget?.message}
                />
                <select
                  {...register('immigrationDetails.budgetCurrency')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                >
                  <option value="">Devise</option>
                  <option value="CAD">CAD</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="FCFA">FCFA</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Applications précédentes
          </label>
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                {...register('immigrationDetails.previousApplications')}
                className="rounded border-gray-300 text-red-600 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
              <span className="ml-2 text-sm text-gray-600">
                J'ai déjà fait une demande d'immigration au Canada
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Refus précédents
          </label>
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                {...register('immigrationDetails.previousRefusals')}
                className="rounded border-gray-300 text-red-600 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
              <span className="ml-2 text-sm text-gray-600">
                J'ai déjà eu un refus d'immigration au Canada
              </span>
            </label>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Informations supplémentaires
          </label>
          <textarea
            {...register('immigrationDetails.additionalInfo')}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
            placeholder="Ajoutez toute information pertinente pour votre demande"
          />
        </div>
      </div>
    </div>
  );
}