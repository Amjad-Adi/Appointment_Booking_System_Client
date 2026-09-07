import registerImageGeneral from '../../../../assets/images/register_images/register-image-general.png';
import registerImageFlow from '../../../../assets/images/register_images/register-image-flow.png';
import { Image } from '../../../../components/Image.tsx';
import { RegisterForm } from './components/RegisterForm.tsx';

export function Register() {
    return (
        <main className="border-secondary flex w-[80%] flex-col items-center gap-y-[2vw] rounded-[20px] border-[3px] border-solid bg-[#e9e9f1] py-[2vw] sm:flex-row sm:p-[2vw]">
            <div className="relative flex aspect-3/4 w-[90%] items-center justify-center sm:aspect-auto sm:w-1/2 sm:self-stretch sm:p-[1.5vw] md:w-[35%]">
                <div className="border-border-subtle relative h-full w-full overflow-hidden border bg-[#f4f4f4]">
                    <div className="animate-slide absolute inset-0 flex h-full w-[200%]">
                        <div className="h-full w-1/2 shrink-0">
                            <Image
                                src={registerImageGeneral}
                                alt="Appointment Booking System Showcase"
                                className="h-full w-full object-fill"
                            />
                        </div>

                        <div className="h-full w-1/2 shrink-0">
                            <Image
                                src={registerImageFlow}
                                alt="Appointment booking flow"
                                className="h-full w-full object-fill"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-px w-[90%] shrink-0 bg-[#ccc] sm:h-auto sm:w-px sm:self-stretch" />

            <RegisterForm />
        </main>
    );
}
