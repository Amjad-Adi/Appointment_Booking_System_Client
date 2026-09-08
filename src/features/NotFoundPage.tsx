import { Link } from 'react-router';

export function NotFoundPage() {
    return (
        <main className="flex min-h-dvh items-center justify-center px-6 text-center text-slate-200">
            <div className="flex max-w-lg flex-col items-center">
                <h1 className="text-[80px] font-bold tracking-[0.15em] text-sky-400 sm:text-[96px]">
                    404
                </h1>
                <h2 className="mt-2 text-xl font-semibold text-slate-200 sm:text-2xl">
                    Page not found
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-lg">
                    The page you are looking for does not exist or has moved.
                </p>

                <Link
                    to="/login"
                    className="mt-7 rounded-lg bg-sky-400 px-7 py-3 font-bold text-slate-950 transition-colors hover:bg-sky-300 focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-950 focus:outline-none"
                >
                    Back to homepage
                </Link>
            </div>
        </main>
    );
}
