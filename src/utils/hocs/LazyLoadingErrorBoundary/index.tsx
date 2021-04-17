
import * as React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

// eslint-disable-next-line require-jsdoc
class LazyLoadingErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  // eslint-disable-next-line require-jsdoc
  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  // eslint-disable-next-line require-jsdoc
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('Uncaught error:', error, errorInfo);
  }

  // eslint-disable-next-line require-jsdoc
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '64px 0',
            textAlign: 'center'
          }}>
          <button onClick={() => window.location.reload()}>Click to Reload</button>
          <p
            style={{
              textAlign: 'center',
              padding: '12px 0'
            }}>
            {/* TODO: should use i18n */}
            Lazy-loading failed!
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default LazyLoadingErrorBoundary;
