import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

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
    const isDev = import.meta.env.DEV || import.meta.env.VITE_NODE_ENV === 'development';
    if (isDev) {
        const devServer = import.meta.env.VITE_DEVELOPMENT_SERVER || 'http://localhost';

        const devPort = Number(import.meta.env.VITE_SERVER_PORT) || 3000;

        return `${devServer}:${devPort}`;
    }
    return import.meta.env.VITE_DEPLOYMENT_SERVER || '';
}

export const api: AxiosInstance = axios.create(axiosConfig);

// Used only for refreshing the access token to not get a loop.
const authApi: AxiosInstance = axios.create({
    baseURL,
    withCredentials: true,
});

let refreshPromise: Promise<unknown> | null = null;

api.interceptors.response.use(
    function (response) {
        return response;
    },
    async function (error) {
        const config = error.config as
            (InternalAxiosRequestConfig & { retry: boolean }) | undefined;
        if (error.response?.status !== 401 || !config || config.retry) {
            return Promise.reject(error);
        }
        config.retry = true;
        if (!refreshPromise) {
            refreshPromise = authApi.post('/api/auth/refresh').finally(function () {
                refreshPromise = null;
            });
        }
        try {
            await refreshPromise;
            return api(config);
        } catch (refreshError) {
            window.location.href = '/auth/login';
            return Promise.reject(refreshError);
        }
    },
);
