import { Link } from 'react-router';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import googleLogo from '../../../../../assets/images/login-images/google-logo.svg';

import { TextField } from '../../../../../components/TextField.tsx';
import { CheckboxField } from '../../../../../components/CheckBoxField.tsx';
import { Image } from '../../../../../components/Image.tsx';
import { Button } from '../../../../../components/Button.tsx';

import { loginUserSchema } from '../../../../../zod-schemas/user.schema.ts';
import type { LoginForm } from '../../../../../models/user.model.ts';

import { useLogin } from '../../../../management/hooks/users-hook.ts';

export function LoginForm() {
    const { register, handleSubmit, formState } = useForm<LoginForm, never, LoginForm>({
        resolver: zodResolver(loginUserSchema),
    });

    const loginMutation = useLogin();

    const onSubmit = (data: LoginForm) => {
        loginMutation.mutate(data);
    };

    return (
        <div className="flex w-full flex-col items-center px-5 sm:w-[35%] sm:p-[1.5vw] lg:w-1/2">
            <form
                className="flex w-full flex-col items-center gap-1"
                onSubmit={handleSubmit(onSubmit)}
            >
                {/* Description */}
                <p className="w-full py-1 text-center text-[12px] font-bold">
                    Sign in to manage your appointments and organizations
                </p>

                {/* Email */}
                <div className="w-full">
                    <TextField
                        label="email"
                        type="email"
                        placeholder="Enter your Email"
                        id="email"
                        errorMessage={formState.errors.email?.message}
                        {...register('email')}
                        isLabelDisabled={true}
                    />
                </div>

                {/* Password */}
                <div className="w-full">
                    <TextField
                        label="password"
                        id="password"
                        type="password"
                        placeholder="Enter your Password"
                        errorMessage={formState.errors.password?.message}
                        {...register('password')}
                        isLabelDisabled={true}
                    />
                </div>

                {/* Remember / Forgot password */}
                <div className="flex w-[95%] flex-row items-center justify-between gap-2 font-['Inter',serif] max-[300px]:flex-col max-[300px]:gap-1 sm:flex-col sm:gap-1 md:flex-row md:gap-2">
                    <CheckboxField name="privacy-policy">Remember Me</CheckboxField>

                    <Link
                        to="/forget-password"
                        className="shrink-0 text-[11px] transition-colors duration-200 hover:underline"
                    >
                        Forgot Password?
                    </Link>
                </div>

                {/* Sign in button */}
                <div className="mt-2 flex w-[90%] flex-col items-center justify-center">
                    <Button type="submit" className="h-11" disabled={loginMutation.isPending}>
                        Sign In
                    </Button>

                    {/* Error message */}
                    <div className="min-h-[20px] w-full pt-1">
                        {loginMutation.isError && (
                            <p className="text-error w-full text-center text-[10px]">
                                {axios.isAxiosError(loginMutation.error)
                                    ? (loginMutation.error.response?.data.message ?? 'Login failed')
                                    : 'Something went wrong'}
                            </p>
                        )}
                    </div>
                </div>
            </form>

            {/* Divider */}
            <section className="flex w-[90%] items-center gap-2 py-2">
                <span className="h-px flex-1 bg-[#ccc]" />

                <span className="shrink-0 text-[11px] text-[#777]">Or</span>

                <span className="h-px flex-1 bg-[#ccc]" />
            </section>

            {/* Google login */}
            <Button
                type="button"
                className="flex h-11 w-[90%] shrink-0 items-center justify-center gap-2 bg-white px-3 text-[11px] text-[#777] hover:bg-gray-100"
            >
                <Image src={googleLogo} alt="" aria-hidden="true" className="h-5 w-5 shrink-0" />

                <span>Continue With Google</span>
            </Button>

            {/* Register */}
            <section className="flex w-[90%] flex-row items-center justify-center gap-2 py-2 max-[300px]:flex-col max-[300px]:gap-1 sm:flex-col sm:gap-1 md:flex-row">
                <p className="text-[11px] font-medium whitespace-nowrap">Don't have an account?</p>

                <Link
                    to="../register"
                    className="text-[11px] font-bold whitespace-nowrap no-underline hover:underline"
                >
                    Create Account
                </Link>
            </section>
        </div>
    );
}
