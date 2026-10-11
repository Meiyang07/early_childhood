import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import App from './App';
import './styles.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/query-client';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      
    <App />
    </QueryClientProvider>
    <Toaster position="bottom-right" richColors closeButton />
  </StrictMode>,
);