import { useState } from 'react';
import { AuthArtwork } from '../../components/AuthArtwork.tsx';
import { RegisterForm } from './components/RegisterForm.tsx';

export function Register() {
    const [firstImageReady, setFirstImageReady] = useState(false);
    const [slidesReady, setSlidesReady] = useState(false);
    return (
        <main className="border-secondary bg-muted flex w-[80%] flex-col items-center gap-y-[2vw] rounded-[20px] border-[3px] border-solid py-[2vw] sm:flex-row sm:p-[2vw]">
            <div className="relative flex aspect-3/4 w-[90%] items-center justify-center sm:aspect-auto sm:w-1/2 sm:self-stretch sm:p-[1.5vw] md:w-[35%]">
                <div className="border-border bg-muted relative h-full w-full overflow-hidden border">
                    <div
                        className={`absolute inset-0 flex h-full w-[200%] ${slidesReady ? 'animate-slide' : ''}`}
                    >
                        <div className="h-full w-1/2 shrink-0">
                            <AuthArtwork
                                kind="registerGeneral"
                                priority
                                onLoad={() => setFirstImageReady(true)}
                                alt="Appointment Booking System Showcase"
                                className="h-full w-full object-fill"
                            />
                        </div>

                        <div className="h-full w-1/2 shrink-0">
                            {firstImageReady && (
                                <AuthArtwork
                                    kind="registerFlow"
                                    onLoad={() => setSlidesReady(true)}
                                    alt="Appointment booking flow"
                                    className="h-full w-full object-fill"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-border h-px w-[90%] shrink-0 sm:h-auto sm:w-px sm:self-stretch" />

            <RegisterForm />
        </main>
    );
}
