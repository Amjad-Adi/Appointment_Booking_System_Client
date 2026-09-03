import icon from '../../../../assets/images/icons/icon.png';
import { Image } from '../../../../components/Image.tsx';
import { LoginForm } from './components/LoginForm.tsx';

export function Login() {
    return (
        <div className="flex min-h-dvh w-full items-center justify-center py-[5dvh]">
            <main className="border-secondary flex w-[80%] flex-col items-center gap-y-[2vw] rounded-[20px] border-[3px] border-solid bg-[#e9e9f1] py-[2vw] sm:flex-row sm:p-[2vw]">
                <div className="relative flex w-full items-center justify-center px-[4vw] sm:w-[70%] sm:self-stretch sm:p-[1.5vw] lg:w-1/2">
                    <div className="relative aspect-square w-[90%] overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10 sm:aspect-auto sm:h-full sm:w-full">
                        <Image
                            src={icon}
                            alt="Smart Appointment Booking icon"
                            className="h-full w-full object-cover"
                        />

                        <div className="pointer-events-none absolute top-0 left-1/2 z-10 h-fit w-fit -translate-x-1/2">
                            <p className="bg-linear-to-r from-white via-blue-200 to-white bg-clip-text pt-2 text-center leading-none font-extrabold tracking-wide whitespace-nowrap text-transparent min-[0px]:text-[2.5px] min-[100px]:text-[5px] min-[200px]:text-[10px] min-[300px]:text-[16px] min-[500px]:text-[24px] sm:pt-4">
                                Appointment Booking
                            </p>
                        </div>

                        <div className="pointer-events-none absolute bottom-0 left-1/2 z-10 h-fit w-fit -translate-x-1/2">
                            <p className="bg-linear-to-r from-white via-blue-200 to-white bg-clip-text pb-2 text-center leading-none font-extrabold tracking-wide whitespace-nowrap text-transparent min-[0px]:text-[2.5px] min-[100px]:text-[5px] min-[200px]:text-[10px] min-[300px]:text-[16px] min-[500px]:text-[24px] sm:pb-4">
                                System
                            </p>
                        </div>
                    </div>
                </div>

                <div className="h-px w-[90%] shrink-0 bg-[#ccc] sm:h-auto sm:w-px sm:self-stretch" />
                <LoginForm />
            </main>
        </div>
    );
}
