import { AuthArtwork } from '../../components/AuthArtwork.tsx';
import { LoginForm } from './components/LoginForm.tsx';

export function Login() {
    return (
        <main className="border-secondary bg-muted flex w-[80%] flex-col items-center gap-y-4 rounded-[20px] border-[3px] border-solid py-4 sm:flex-row sm:gap-y-0 sm:p-6">
            {/* Image section */}
            <div className="relative flex w-full items-center justify-center px-4 sm:w-[70%] sm:self-stretch sm:p-6 lg:w-1/2">
                <div className="ring-on-image/10 relative aspect-square w-[90%] overflow-hidden rounded-xl shadow-2xl ring-1 sm:aspect-auto sm:h-full sm:w-full">
                    <AuthArtwork
                        kind="login"
                        alt="Smart Appointment Booking icon"
                        priority
                        className="h-full w-full object-cover"
                    />
                    <div className="pointer-events-none absolute top-0 left-0 z-10 flex w-full justify-center">
                        <p className="from-on-image via-on-image/70 to-on-image bg-linear-to-r bg-clip-text pt-2 text-center text-[14px] leading-normal font-extrabold tracking-wide whitespace-nowrap text-transparent sm:pt-4 sm:text-[20px]">
                            Appointment Booking
                        </p>
                    </div>
                    <div className="pointer-events-none absolute bottom-0 left-0 z-10 flex w-full justify-center">
                        <p className="from-on-image via-on-image/70 to-on-image bg-linear-to-r bg-clip-text pb-2 text-center text-[14px] leading-none font-extrabold tracking-wide whitespace-nowrap text-transparent sm:pb-4 sm:text-[20px]">
                            System
                        </p>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="bg-border h-px w-[90%] shrink-0 sm:h-auto sm:w-px sm:self-stretch" />

            {/* Login form */}
            <LoginForm />
        </main>
    );
}
