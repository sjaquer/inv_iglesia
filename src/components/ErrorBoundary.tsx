import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-[#212529] p-6 font-sans text-[#E5E7EB]">
          <div className="max-w-md rounded-xl border border-[#373C42] bg-[#2C3136] p-8 text-center shadow-2xl">
            <h1 className="text-xl font-bold text-white">Algo salió mal</h1>
            <p className="mt-2 text-sm text-[#8E9299]">
              Ocurrió un error inesperado. Intenta recargar la página.
            </p>
            {this.state.error && (
              <pre className="mt-4 max-h-40 overflow-auto rounded-md bg-[#1A1D21] p-3 text-left text-xs text-red-400">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReload}
              className="mt-6 rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
            >
              Recargar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
