import { Link, isRouteErrorResponse, useRouteError } from 'react-router';
import { AlertTriangle, RotateCcw } from 'lucide-react';

import { getApiErrorMessage } from '../utlis/api-error.ts';

const fallbackMessage = 'An unexpected error prevented this page from loading.';

export function ErrorPage() {
    const error = useRouteError();

    const isRouteResponse = isRouteErrorResponse(error);

    const isNotFound = isRouteResponse && error.status === 404;

    const status = isRouteResponse ? error.status : undefined;

    const message = isRouteResponse
        ? getRouteErrorMessage(error)
        : getApiErrorMessage(error, fallbackMessage);

    return (
        <main className="flex min-h-dvh items-center justify-center bg-background px-6 text-center">
            <div className="flex max-w-lg flex-col items-center">
                <div className="flex size-14 items-center justify-center rounded-full border border-destructive-border bg-destructive-soft">
                    <AlertTriangle className="size-7 text-destructive" />
                </div>

                <h1 className="mt-5 text-xl font-semibold text-foreground sm:text-2xl">
                    {isNotFound ? 'Page not found' : 'Unable to load this page'}
                </h1>

                {status && (
                    <p className="mt-1 text-[11px] font-semibold tracking-wider text-muted-foreground">
                        Error {status}
                    </p>
                )}

                <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                    {message}
                </p>

                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background focus:outline-none"
                    >
                        <RotateCcw className="size-4" />
                        Reload page
                    </button>

                    <Link
                        to="/login"
                        className="rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-secondary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background focus:outline-none"
                    >
                        Back to sign in
                    </Link>
                </div>
            </div>
        </main>
    );
}

function getRouteErrorMessage(error: { statusText: string; data: unknown }): string {
    if (typeof error.data === 'string' && error.data.trim().length > 0) {
        return error.data;
    }

    if (error.statusText.length > 0) {
        return error.statusText;
    }

    return fallbackMessage;
}
