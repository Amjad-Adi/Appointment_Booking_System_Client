import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { TextField } from '../../../../../components/TextField.tsx';
import { CheckboxField } from '../../../../../components/CheckBoxField.tsx';
import { Button } from '../../../../../components/Button.tsx';

import { loginFormSchema } from '../../../../../zod-schemas/user.schema.ts';
import type { LoginForm } from '../../../../../models/user.model.ts';

import { useLogin } from '../../../../management/hooks/users-hook.ts';
import { getApiErrorMessage } from '../../../../../utlis/api-error.ts';

export function LoginForm() {
    const { register, handleSubmit, formState } = useForm<LoginForm, never, LoginForm>({
        resolver: zodResolver(loginFormSchema),
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
                            <p className="text-destructive w-full text-center text-[10px]">
                                {getApiErrorMessage(loginMutation.error, 'Login failed')}
                            </p>
                        )}
                    </div>
                </div>
            </form>

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
