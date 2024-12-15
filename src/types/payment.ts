export interface PaymentSubmission {
  id?: string;
  serviceId: string;
  serviceName: string;
  amount: string;
  name: string;
  email: string;
  phone: string;
  details?: string;
  confirmationMethod: 'upload' | 'whatsapp';
  proofUrl?: string;
  status: 'pending' | 'verified' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}