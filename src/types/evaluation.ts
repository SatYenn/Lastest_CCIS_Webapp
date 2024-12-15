import { z } from 'zod';
import { Timestamp } from 'firebase/firestore';

// Constants for validation
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 50;
const PHONE_MIN_LENGTH = 9;
const PHONE_MAX_LENGTH = 15;
const MIN_FAMILY_SIZE = 1;

// Enums for better type safety
export enum MaritalStatus {
  Single = 'single',
  Married = 'married',
  Divorced = 'divorced',
  Widowed = 'widowed'
}

export enum LanguageTestType {
  TCF = 'TCF',
  TEF = 'TEF',
  IELTS = 'IELTS',
  CELPIP = 'CELPIP',
  None = 'none'
}

export enum EmploymentStatus {
  Employed = 'employed',
  SelfEmployed = 'self-employed',
  Unemployed = 'unemployed',
  Student = 'student'
}

export enum TimeFrame {
  Immediate = 'immediate',
  SixMonths = '6months',
  OneYear = '1year',
  Planning = 'planning'
}

export enum Currency {
  CAD = 'CAD',
  USD = 'USD',
  EUR = 'EUR',
  FCFA = 'FCFA'
}

// Updated schema with better organization and validation
export const evaluationSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(NAME_MIN_LENGTH).max(NAME_MAX_LENGTH),
    lastName: z.string().min(NAME_MIN_LENGTH).max(NAME_MAX_LENGTH),
    email: z.string().email(),
    phone: z.string().min(PHONE_MIN_LENGTH).max(PHONE_MAX_LENGTH),
    birthDate: z.instanceof(Timestamp),
    nationality: z.string().min(NAME_MIN_LENGTH),
    currentCountry: z.string().min(NAME_MIN_LENGTH),
    maritalStatus: z.nativeEnum(MaritalStatus),
    monthlySalary: z.number().nonnegative(),
  }),

  education: z.object({
    highestDegree: z.string().min(NAME_MIN_LENGTH),
    fieldOfStudy: z.string().min(NAME_MIN_LENGTH),
    institution: z.string().min(NAME_MIN_LENGTH),
    graduationYear: z.string().regex(/^\d{4}$/),
    languageTests: z.object({
      type: z.nativeEnum(LanguageTestType),
      score: z.string().optional(),
      testDate: z.string().datetime().optional(),
    }),
  }),

  workExperience: z.object({
    currentOccupation: z.string().min(NAME_MIN_LENGTH),
    yearsOfExperience: z.number().nonnegative(),
    employmentStatus: z.nativeEnum(EmploymentStatus),
    canadianExperience: z.boolean(),
    desiredOccupation: z.string().min(NAME_MIN_LENGTH),
  }),

  immigrationDetails: z.object({
    programInterest: z.array(z.string()).min(1),
    timeframe: z.nativeEnum(TimeFrame),
    familySize: z.number().min(MIN_FAMILY_SIZE),
    previousApplications: z.boolean(),
    previousRefusals: z.boolean(),
    budget: z.union([
      z.number().positive(),
      z.literal('undisclosed')
    ]).optional(),
    budgetCurrency: z.nativeEnum(Currency).optional(),
    additionalInfo: z.string().optional(),
  }),
});

export type EvaluationFormData = z.infer<typeof evaluationSchema>;

export interface ValidationError {
  type: string;
  message: string;
  path?: string[];
}

export interface FormError {
  field: string;
  errors: ValidationError[];
}

export interface Evaluation {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: EvaluationStatus;
  type: string;
  userId: string | null;
  userName: string;
  data: {
    education: {
      fieldOfStudy: string;
      graduationYear: string;
      highestDegree: string;
      institution: string;
      languageTests: {
        score: string;
        type: LanguageTestType;
      };
    };
    immigrationDetails: {
      additionalInfo: string;
      budget: number;
      familySize: number;
      previousApplications: boolean;
      previousRefusals: boolean;
      programInterest: string[];
      timeframe: TimeFrame;
    };
    personalInfo: {
      birthDate: Timestamp;
      currentCountry: string;
      email: string;
      firstName: string;
      lastName: string;
      nationality: string;
      phone: string;
      maritalStatus: MaritalStatus;
      monthlySalary: number;
    };
    workExperience: {
      canadianExperience: boolean;
      currentOccupation: string;
      desiredOccupation: string;
      employmentStatus: EmploymentStatus;
      yearsOfExperience: number;
    };
  };
}

// Add evaluation status enum
export enum EvaluationStatus {
  Pending = 'pending',
  InProgress = 'in-progress',
  Completed = 'completed',
  Rejected = 'rejected'
}