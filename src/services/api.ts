type ApiRequestOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: unknown;
    headers?: Record<string, string>;
};

export async function apiService(path: string, options: ApiRequestOptions = {}) {
    const { method = 'GET', body, headers = {} } = options;
    const baseUrl = import.meta.env.VITE_NODE_ENV
        ? `${import.meta.env.VITE_DEVELOPMENT_SERVER}:${import.meta.env.VITE_SERVER_PORT}`
        : import.meta.env.VITE_DEPLOYMENT_SERVER;
    const response = await fetch(`${baseUrl}/api/${path}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        ...(body !== undefined && {
            //add body property if provided
            body: JSON.stringify(body),
        }),
    });
    if (!response.ok) {
        throw new Error('API request failed');
    }
    return response.json();
}
