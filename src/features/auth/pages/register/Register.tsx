import registerImageGeneral from '../../../../assets/images/register_images/register-image-general.png';
import registerImageFlow from '../../../../assets/images/register_images/register-image-flow.png';

import { Image } from '../../../../components/Image.tsx';
import { RegisterForm } from './components/RegisterForm.tsx';

export function Register() {
    return (
        <div className="flex min-h-dvh w-full items-center justify-center py-[5dvh]">
            <main className="border-secondary flex h-[500px] w-[80%] flex-col items-center gap-y-[2vw] rounded-[20px] border-[3px] border-solid bg-[#e9e9f1] py-[2vw] sm:flex-row sm:p-[2vw]">
                <div className="relative aspect-[3/4] h-full shrink-0 sm:p-[1.5vw]">
                    <div className="border-border-subtle relative h-full w-full overflow-hidden border bg-[#f4f4f4]">
                        <div className="animate-slide absolute inset-0 flex w-[200%]">
                            <div className="h-full w-1/2 shrink-0">
                                <Image
                                    src={registerImageGeneral}
                                    alt="Appointment Booking sstem Showcase"
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="h-full w-1/2 shrink-0">
                                <Image
                                    src={registerImageFlow}
                                    alt="Appointment booking flow"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-px w-[90%] shrink-0 bg-[#ccc] sm:h-[90%] sm:w-px" />

                <RegisterForm />
            </main>
        </div>
    );
}
