import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  FallbackComponent?: React.ComponentType;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorInfo: string | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, errorInfo: null };

  static getDerivedStateFromError(error: Error) {
    console.error('Error:', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo: errorInfo.componentStack || null });
  }

  render() {
    if (this.state.hasError) {
      return this.props.FallbackComponent ? (
        <this.props.FallbackComponent />
      ) : (
        <div style={styles.container}>
          <div style={styles.messageBox}>
            <h1 style={styles.title}>Something went wrong.</h1>
            <p style={styles.message}>
              We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.
            </p>
            {this.state.errorInfo && (
              <details style={styles.details}>
                {this.state.errorInfo}
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f8f9fa',
  },
  messageBox: {
    textAlign: 'center' as const,
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    maxWidth: '600px',
    width: '90%',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#dc3545',
  },
  message: {
    fontSize: '16px',
    color: '#6c757d',
  },
  details: {
    marginTop: '10px',
    whiteSpace: 'pre-wrap',
    textAlign: 'left',
    color: '#343a40',
  },
};

export default ErrorBoundary; 