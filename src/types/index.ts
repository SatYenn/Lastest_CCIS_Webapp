export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'client' | 'admin';
  createdAt: Date;
}

export interface ServiceRequest {
  id: string;
  userId: string;
  type: string;
  status: 'pending' | 'in-progress' | 'awaiting-documents' | 'completed' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  userId: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}