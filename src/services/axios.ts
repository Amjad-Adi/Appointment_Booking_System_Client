import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
    retry?: boolean;
}

const baseURL = getBaseURL();

const axiosConfig = {
    baseURL,
    headers: {
        Accept: 'application/json',
    },
    maxContentLength: 10 * 1024 * 1024,
    maxBodyLength: 10 * 1024 * 1024,
    withCredentials: true,
    timeout: 60 * 1000,
};

function getBaseURL(): string {
    const isDev = import.meta.env.VITE_NODE_ENV === 'development' || import.meta.env.DEV;

    if (isDev) {
        const devServer = import.meta.env.VITE_DEVELOPMENT_SERVER || 'http://localhost';

        const devPort = Number(import.meta.env.VITE_SERVER_PORT) || 3000;

        return `${devServer}:${devPort}`;
    }

    const productionServer = import.meta.env.VITE_PRODUCTION_SERVER;

    if (!productionServer) {
        throw new Error('VITE_PRODUCTION_SERVER is not configured.');
    }

    return productionServer;
}

export const api: AxiosInstance = axios.create(axiosConfig);

// Used only for refreshing the access token to not get a loop.
const authApi: AxiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 60 * 1000,
});

let refreshPromise: Promise<void> | null = null;

api.interceptors.response.use(
    function (response) {
        return response;
    },
    async function (error: unknown) {
        if (!axios.isAxiosError(error)) {
            return Promise.reject(error);
        }

        const config = error.config as RetryableAxiosRequestConfig | undefined;

        if (error.response?.status !== 401 || !config || config.retry || isAuthRoute(config.url)) {
            return Promise.reject(error);
        }

        config.retry = true;

        if (!refreshPromise) {
            refreshPromise = authApi
                .post('/api/auth/refresh')
                .then(() => undefined)
                .finally(() => {
                    refreshPromise = null;
                });
        }

        try {
            await refreshPromise;
            return api(config);
        } catch (refreshError) {
            window.location.href = '/login';
            return Promise.reject(refreshError);
        }
    },
);

function isAuthRoute(url?: string): boolean {
    if (!url) {
        return false;
    }

    return (
        url.includes('/api/auth/login') ||
        url.includes('/api/auth/register') ||
        url.includes('/api/auth/refresh') ||
        url.includes('/api/auth/logout')
    );
}
