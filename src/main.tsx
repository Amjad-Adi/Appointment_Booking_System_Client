import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { router } from './routes/router.tsx';
import { RouterProvider } from 'react-router';
import './styles/index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import axios from 'axios';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
            retry: (failureCount, error) => {
                if (axios.isAxiosError(error)) {
                    const status = error.response?.status;
                    if (status === 404 || status === 409) {
                        return false;
                    }
                }
                return failureCount < 3;
            },
            retryDelay: (attemptIndex, error) => {
                if (axios.isAxiosError(error)) {
                    const retryAfter = error.response?.headers['retry-after'];
                    if (retryAfter) {
                        const seconds = Number(retryAfter);
                        if (!Number.isNaN(seconds)) {
                            return seconds * 1000;
                        }
                    }
                }
                return Math.min(1000 * 2 ** attemptIndex, 30000);
            },
            refetchOnWindowFocus: true, // Refetch when window regains focus
            refetchOnReconnect: true, // Refetch when network reconnects
            refetchOnMount: true, // Refetch when component mounts
            networkMode: 'online', // 'online' | 'always' | 'offlineFirst'
        },
        mutations: {
            retry: false,
        },
    },
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            {import.meta.env.VITE_NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} />
            )}
        </QueryClientProvider>
    </StrictMode>,
);
