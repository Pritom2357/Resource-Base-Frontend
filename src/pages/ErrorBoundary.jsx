import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Component error:", error);
    console.error("Component stack:", errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border-l-4 border-red-500 bg-red-50">
          <h2 className="text-red-800 font-bold">Something went wrong</h2>
          <p className="text-red-700">{this.state.error?.message || "Unknown error"}</p>
          <button 
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded" 
            onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;