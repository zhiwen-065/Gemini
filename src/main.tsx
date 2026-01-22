import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = document.getElementById('root');
if (!root) throw new Error('no root');

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: any }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any) {
    console.error('APP CRASHED:', error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <pre style={{ color: 'red', padding: 24, whiteSpace: 'pre-wrap' }}>
          APP CRASHED:
          {'\n'}
          {String(this.state.error)}
        </pre>
      );
    }
    return this.props.children;
  }
}

createRoot(root).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
