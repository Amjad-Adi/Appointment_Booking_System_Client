import type { FirebaseError } from 'firebase/app';

export function mapFirebaseError(error: unknown): never {
    const code = (error as FirebaseError).code;

    switch (code) {
        case 'auth/invalid-credential':
        case 'auth/invalid-email':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            throw new Error('Invalid email or password.');

        case 'auth/email-already-in-use':
            throw new Error('An account with this email already exists.');

        case 'auth/weak-password':
            throw new Error('The password is too weak.');

        case 'auth/user-disabled':
            throw new Error('This account has been disabled.');

        case 'auth/too-many-requests':
            throw new Error('Too many attempts. Please try again later.');

        case 'auth/network-request-failed':
            throw new Error('Network error. Please check your connection.');

        default:
            throw new Error('Authentication failed. Please try again.');
    }
}
