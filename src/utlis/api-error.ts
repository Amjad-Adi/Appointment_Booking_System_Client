import axios from 'axios';

export interface ApiErrorPayload {
    status?: string;
    code?: string;
    message?: string;
    fieldErrors?: Record<string, string>;
}

const FIREBASE_MESSAGES: Record<string, string> = {
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/invalid-login-credentials': 'Invalid email or password.',
    'auth/wrong-password': 'Invalid email or password.',
    'auth/user-not-found': 'Invalid email or password.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'The password is too weak.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/too-many-requests': 'Too many attempts. Please wait and try again.',
    'auth/network-request-failed': 'Unable to reach the sign-in service. Check your connection.',
};

const FALLBACK_MESSAGE = 'Something went wrong. Please try again.';

export function getApiErrorPayload(error: unknown): ApiErrorPayload | undefined {
    if (!axios.isAxiosError(error)) {
        return undefined;
    }

    const data = error.response?.data;

    if (typeof data === 'string') {
        return { message: data };
    }

    if (data && typeof data === 'object') {
        const payload = data as Record<string, unknown>;

        return {
            status: typeof payload.status === 'string' ? payload.status : undefined,
            code: typeof payload.code === 'string' ? payload.code : undefined,
            message: typeof payload.message === 'string' ? payload.message : undefined,
            fieldErrors:
                payload.fieldErrors && typeof payload.fieldErrors === 'object'
                    ? (payload.fieldErrors as Record<string, string>)
                    : undefined,
        };
    }

    return undefined;
}

export function getApiFieldErrors(error: unknown): Record<string, string> | undefined {
    const fieldErrors = getApiErrorPayload(error)?.fieldErrors;

    return fieldErrors && Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
}

export function getApiErrorCode(error: unknown): string | undefined {
    return getApiErrorPayload(error)?.code;
}

export function getApiErrorMessage(error: unknown, fallback = FALLBACK_MESSAGE): string {
    if (axios.isAxiosError(error)) {
        const payload = getApiErrorPayload(error);

        if (payload?.message) {
            return payload.message;
        }

        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
            return 'The server took too long to respond. Please try again.';
        }

        if (!error.response) {
            return 'Unable to reach the server. Check your connection and try again.';
        }

        const status = error.response.status;

        if (status === 401) {
            return 'Your session has expired. Please sign in again.';
        }

        if (status === 403) {
            return 'You do not have permission to perform this action.';
        }

        if (status === 404) {
            return 'The requested item could not be found.';
        }

        if (status === 429) {
            return 'Too many requests. Please wait a moment and try again.';
        }

        if (status >= 500) {
            return 'The server encountered a problem. Please try again later.';
        }

        return fallback;
    }

    const firebaseCode = (error as { code?: string } | null)?.code;

    if (firebaseCode && FIREBASE_MESSAGES[firebaseCode]) {
        return FIREBASE_MESSAGES[firebaseCode];
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    return fallback;
}
