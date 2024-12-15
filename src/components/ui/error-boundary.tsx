import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-600" />
            <h1 className="mt-4 text-3xl font-bold text-gray-900">Une erreur est survenue</h1>
            <p className="mt-2 text-gray-600">
              {this.state.error?.message || 'Une erreur inattendue s\'est produite.'}
            </p>
            <Button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="mt-6"
            >
              Réessayer
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}