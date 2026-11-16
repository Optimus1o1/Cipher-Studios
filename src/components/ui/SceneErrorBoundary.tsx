'use client';

import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class SceneErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn(
      '[SceneErrorBoundary] 3D canvas encountered an issue; displaying celestial background fallback:',
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            className="fixed inset-0 pointer-events-none z-0"
            style={{
              background: 'radial-gradient(ellipse at 75% 30%, #1a2048 0%, #05060d 65%)',
            }}
            aria-hidden="true"
          />
        )
      );
    }

    return this.props.children;
  }
}
