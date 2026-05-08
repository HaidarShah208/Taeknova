import type { ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';

import { store } from '@redux';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ReduxProvider store={store}>
      <HelmetProvider>
        <BrowserRouter>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              classNames: {
                toast: 'rounded-xl border-border shadow-card',
              },
            }}
          />
        </BrowserRouter>
      </HelmetProvider>
    </ReduxProvider>
  );
}
