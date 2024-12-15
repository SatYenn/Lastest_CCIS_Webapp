import React from 'react';
import { UseFormRegister, Control, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { Input } from '../ui/input';
import { CustomDatePicker } from '../ui/date-picker';
import { countries } from 'countries-list';
import type { EvaluationFormData } from '../../types/evaluation';

interface PersonalInfoStepProps {
  register: UseFormRegister<EvaluationFormData>;
  control: Control<EvaluationFormData>;
  setValue: UseFormSetValue<EvaluationFormData>;
  errors: FieldErrors<EvaluationFormData>;
}

type Country = {
  name: string;
  [key: string]: any;
};

type Countries = {
  [key: string]: Country;
};

const typedCountries = countries as Countries;

const countryOptions = Object.entries(typedCountries).map(([code, country]) => ({
  value: code,
  label: country.name,
})).sort((a, b) => a.label.localeCompare(b.label));

export function PersonalInfoStep({ register, control, setValue, errors }: PersonalInfoStepProps) {
  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      setValue('personalInfo.birthDate', formattedDate, { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Prénom *
          </label>
          <Input
            {...register('personalInfo.firstName')}
            error={errors.personalInfo?.firstName?.message}
            placeholder="Votre prénom"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nom *
          </label>
          <Input
            {...register('personalInfo.lastName')}
            error={errors.personalInfo?.lastName?.message}
            placeholder="Votre nom"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email *
          </label>
          <Input
            type="email"
            {...register('personalInfo.email')}
            error={errors.personalInfo?.email?.message}
            placeholder="votre.email@exemple.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Téléphone *
          </label>
          <Input
            type="tel"
            {...register('personalInfo.phone')}
            error={errors.personalInfo?.phone?.message}
            placeholder="+237 6XX XX XX XX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date de naissance *
          </label>
          <CustomDatePicker
            value={control._formValues.personalInfo?.birthDate ? new Date(control._formValues.personalInfo.birthDate) : null}
            onChange={handleDateChange}
            maxDate={new Date()}
            minDate={new Date(1900, 0, 1)}
            placeholderText="Sélectionnez votre date de naissance"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
          {errors.personalInfo?.birthDate && (
            <p className="mt-1 text-sm text-red-600">{errors.personalInfo.birthDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nationalité *
          </label>
          <select
            {...register('personalInfo.nationality')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
          >
            <option value="">Sélectionnez votre nationalité</option>
            {countryOptions.map((country) => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </select>
          {errors.personalInfo?.nationality && (
            <p className="mt-1 text-sm text-red-600">{errors.personalInfo.nationality.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pays de résidence *
          </label>
          <select
            {...register('personalInfo.currentCountry')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
          >
            <option value="">Sélectionnez votre pays de résidence</option>
            {countryOptions.map((country) => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </select>
          {errors.personalInfo?.currentCountry && (
            <p className="mt-1 text-sm text-red-600">{errors.personalInfo.currentCountry.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            État civil *
          </label>
          <select
            {...register('personalInfo.maritalStatus')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
          >
            <option value="">Sélectionnez votre état civil</option>
            <option value="single">Célibataire</option>
            <option value="married">Marié(e)</option>
            <option value="divorced">Divorcé(e)</option>
            <option value="widowed">Veuf/Veuve</option>
          </select>
          {errors.personalInfo?.maritalStatus && (
            <p className="mt-1 text-sm text-red-600">{errors.personalInfo.maritalStatus.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Salaire mensuel (FCFA) *
          </label>
          <Input
            type="number"
            {...register('personalInfo.monthlySalary', { valueAsNumber: true })}
            error={errors.personalInfo?.monthlySalary?.message}
            placeholder="Ex: 500000"
          />
          <p className="mt-1 text-xs text-gray-500">
            Entrez votre salaire mensuel en FCFA
          </p>
        </div>
      </div>
    </div>
  );
}