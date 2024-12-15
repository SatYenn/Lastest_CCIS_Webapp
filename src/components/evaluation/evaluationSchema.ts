import { z } from 'zod';

export const evaluationSchema = z.object({
  personalInfo: z.object({
    firstName: z.string()
      .min(2, 'Le prénom doit contenir au moins 2 caractères')
      .max(50, 'Le prénom ne doit pas dépasser 50 caractères')
      .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le prénom ne doit contenir que des lettres'),
    lastName: z.string()
      .min(2, 'Le nom doit contenir au moins 2 caractères')
      .max(50, 'Le nom ne doit pas dépasser 50 caractères')
      .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le nom ne doit contenir que des lettres'),
    email: z.string()
      .email('Format d\'email invalide')
      .min(5, 'L\'email est trop court')
      .max(100, 'L\'email est trop long'),
    phone: z.string()
      .regex(/^\+?[1-9]\d{8,14}$/, 'Format de téléphone invalide')
      .min(9, 'Le numéro doit contenir au moins 9 chiffres')
      .max(15, 'Le numéro ne doit pas dépasser 15 chiffres'),
    birthDate: z.string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date de naissance invalide')
      .refine((date) => {
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >= 18 && age <= 100;
      }, 'Vous devez avoir au moins 18 ans'),
    nationality: z.string()
      .min(2, 'Nationalité requise')
      .max(50, 'Nationalité trop longue'),
    currentCountry: z.string()
      .min(2, 'Pays actuel requis')
      .max(50, 'Pays trop long'),
    maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed']),
    monthlySalary: z.number()
      .min(50000, 'Le salaire minimum est de 50,000 FCFA')
      .max(10000000, 'Le salaire maximum est de 10,000,000 FCFA'),
  }),

  education: z.object({
    highestDegree: z.string()
      .min(2, 'Diplôme requis'),
    fieldOfStudy: z.string()
      .min(2, 'Domaine d\'études requis'),
    institution: z.string()
      .min(2, 'Institution requise'),
    graduationYear: z.string()
      .min(4, 'Année requise'),
    languageTests: z.object({
      type: z.enum(['TCF', 'TEF', 'IELTS', 'CELPIP', 'none']),
      score: z.string().optional(),
      testDate: z.string().optional(),
    }),
  }),

  workExperience: z.object({
    currentOccupation: z.string()
      .min(2, 'Profession actuelle requise'),
    yearsOfExperience: z.number()
      .min(0, 'Les années d\'expérience ne peuvent pas être négatives'),
    employmentStatus: z.enum(['employed', 'self-employed', 'unemployed', 'student']),
    canadianExperience: z.boolean(),
    desiredOccupation: z.string()
      .min(2, 'Profession souhaitée requise'),
  }),

  immigrationDetails: z.object({
    programInterest: z.array(z.string())
      .min(1, 'Sélectionnez au moins un programme'),
    timeframe: z.enum(['immediate', '6months', '1year', 'planning']),
    familySize: z.number()
      .min(1, 'La taille de la famille doit être d\'au moins 1'),
    previousApplications: z.boolean(),
    previousRefusals: z.boolean(),
    budget: z.union([
      z.number()
        .min(1000000, 'Le budget minimum est de 1,000,000 FCFA')
        .max(100000000, 'Le budget maximum est de 100,000,000 FCFA'),
      z.literal('undisclosed')
    ]),
    additionalInfo: z.string().optional(),
  }),
});