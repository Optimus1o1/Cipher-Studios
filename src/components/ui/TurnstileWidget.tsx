'use client';

import React, { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          action?: string;
          theme?: 'light' | 'dark' | 'auto';
          size?: 'normal' | 'compact' | 'flexible';
          callback?: (token: string) => void;
          'error-callback'?: () => void;
          'expired-callback'?: () => void;
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

export interface TurnstileWidgetRef {
  reset: () => void;
}

interface TurnstileWidgetProps {
  action: 'contact_submission' | 'review_submission';
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  className?: string;
}

export const TurnstileWidget = forwardRef<TurnstileWidgetRef, TurnstileWidgetProps>(
  function TurnstileWidget({ action, onVerify, onExpire, onError, className }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);

    // Keep callback refs stable across parent re-renders so form keystrokes never recreate the widget
    const onVerifyRef = useRef(onVerify);
    onVerifyRef.current = onVerify;
    const onExpireRef = useRef(onExpire);
    onExpireRef.current = onExpire;
    const onErrorRef = useRef(onError);
    onErrorRef.current = onError;

    const siteKey =
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

    const renderWidget = useCallback(() => {
      if (!window.turnstile || !containerRef.current || widgetIdRef.current) return;

      try {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action,
          theme: 'dark',
          size: 'normal',
          callback: (token: string) => {
            onVerifyRef.current(token);
          },
          'expired-callback': () => {
            onExpireRef.current?.();
          },
          'error-callback': () => {
            onErrorRef.current?.();
          },
        });
      } catch (err) {
        console.error('[Turnstile] Render error:', err);
      }
    }, [siteKey, action]);

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.reset(widgetIdRef.current);
          } catch (e) {
            console.warn('[Turnstile] Reset failed:', e);
          }
        }
      },
    }));

    useEffect(() => {
      let isMounted = true;

      const tryRender = () => {
        if (!isMounted) return;
        renderWidget();
      };

      // If turnstile script is already available on window
      if (window.turnstile) {
        tryRender();
      } else {
        // Ensure Cloudflare API script is present in document
        let script = document.getElementById('cf-turnstile-script') as HTMLScriptElement | null;
        if (!script) {
          script = document.createElement('script');
          script.id = 'cf-turnstile-script';
          script.src =
            'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback&render=explicit';
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);
        }

        const prevCallback = window.onloadTurnstileCallback;
        window.onloadTurnstileCallback = () => {
          if (typeof prevCallback === 'function') prevCallback();
          tryRender();
        };
      }

      return () => {
        isMounted = false;
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch (e) {
            // Ignore removal errors on unmount
          }
          widgetIdRef.current = null;
        }
      };
    }, [renderWidget]);

    return (
      <div className={className || 'my-4 flex justify-center'}>
        <div ref={containerRef} className="min-h-[65px] flex items-center justify-center" />
      </div>
    );
  }
);
