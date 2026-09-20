import {
    type Auth,
    createUserWithEmailAndPassword,
    isSignInWithEmailLink,
    sendEmailVerification,
    signInWithEmailAndPassword,
    signInWithEmailLink,
    signOut,
} from 'firebase/auth';

import { mapFirebaseError } from './map-firebase-error';

export async function createUserByFireBase(
    auth: Auth,
    email: string,
    password: string,
): Promise<string> {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);

        await sendEmailVerification(result.user);

        return await result.user.getIdToken();
    } catch (error) {
        return mapFirebaseError(error);
    }
}

export async function fireBaseLogIn(auth: Auth, email: string, password: string): Promise<string> {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);

        return await result.user.getIdToken();
    } catch (error) {
        return mapFirebaseError(error);
    }
}

export async function logOut(auth: Auth): Promise<void> {
    try {
        await signOut(auth);
    } catch (error) {
        mapFirebaseError(error);
    }
}

export async function invitationReceive(
    auth: Auth,
    email: string,
    signInLink: string,
): Promise<string | undefined> {
    try {
        if (!isSignInWithEmailLink(auth, signInLink)) {
            return undefined;
        }

        const result = await signInWithEmailLink(auth, email, signInLink);

        return await result.user.getIdToken();
    } catch (error) {
        return mapFirebaseError(error);
    }
}
