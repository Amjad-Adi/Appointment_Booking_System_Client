import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router';

import googleLogo from '../../../../../assets/images/login-images/google-logo.svg';

import { TextField } from '../../../../../components/TextField.tsx';
import { CheckboxField } from '../../../../../components/CheckBoxField.tsx';
import { Image } from '../../../../../components/Image.tsx';
import { Button } from '../../../../../components/Button.tsx';

import { api } from '../../../../../services/axios.ts';
import type { UserResponse } from '../../../../../models/user.model.ts';
import { useForm } from 'react-hook-form';
import { loginUserSchema } from '../../../../../zod-schemas/user.schema.ts';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
let token: string;
import { zodResolver } from '@hookform/resolvers/zod';
export function LoginForm() {
    type InputLoginForm = z.input<typeof loginUserSchema>;
    type OutputLoginForm = z.input<typeof loginUserSchema>;

    const { register, handleSubmit, formState } = useForm<InputLoginForm, any, OutputLoginForm>({
        resolver: zodResolver(loginUserSchema),
    });

    const queryClient = useQueryClient();
    const loginMutation = useMutation({
        mutationFn: async (loginForm: OutputLoginForm) => {
            const response = await api.post('api/auth/login', loginForm);
            return response.data;
        },
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        },
        onError: (error) => {
            console.log(error);
        },
    });
    function submitLogin(loginForm: OutputLoginForm) {
        loginMutation.mutate(loginForm);
    }
    return (
        <div className="flex w-full flex-col items-center px-5 sm:w-[35%] sm:p-[1.5vw] lg:w-1/2">
            <form
                className="flex w-full flex-col items-center gap-2 sm:gap-[0.8vw]"
                onSubmit={handleSubmit(submitLogin)}
            >
                <p className="w-full py-1 text-center text-[10px] font-bold sm:text-[12px] md:text-[16px] lg:text-[20px]">
                    Sign in to manage your appointments and organizations
                </p>
                <div className="w-full">
                    <TextField
                        label="email"
                        type="email"
                        placeholder="Enter your Email"
                        id="email"
                        {...register('email')}
                        isLabelDisabled={true}
                    />
                    {formState.errors.email && (
                        <p className="text-error w-full self-start ps-2 text-left text-[10px] sm:text-[12px]">
                            {formState.errors.email.message}
                        </p>
                    )}
                </div>
                <div className="w-full">
                    <TextField
                        label="password"
                        id="password"
                        type="password"
                        placeholder="Enter your Password"
                        {...register('password')}
                        isLabelDisabled={true}
                    />
                    {formState.errors.password && (
                        <p className="text-error w-full self-start ps-2 text-left text-[10px] sm:text-[12px]">
                            {formState.errors.password.message}
                        </p>
                    )}
                </div>

                <div className="flex w-[95%] flex-row items-center justify-between gap-2 font-['Inter',serif] max-[300px]:flex-col max-[300px]:gap-1 sm:flex-col sm:gap-1 md:flex-row md:gap-2">
                    <CheckboxField name="privacy-policy">Remember Me</CheckboxField>
                    <Link
                        to="/forget-password"
                        className="shrink-0 text-[10px] transition-colors duration-200 hover:underline sm:text-[11px] md:text-[11px] lg:text-[12px]"
                    >
                        Forgot Password?
                    </Link>
                </div>
                <div className="w-[90%]">
                    <Button
                        type="submit"
                        className="h-11 max-[200px]:h-[40px] sm:h-[3.75vw] md:h-[3.5vw]"
                        disabled={loginMutation.isPending}
                    >
                        Sign In
                    </Button>
                    {loginMutation.isError && (
                        <p className="text-error w-full text-[10px] sm:text-[12px]">
                            {axios.isAxiosError(loginMutation.error)
                                ? (loginMutation.error.response?.data.message ?? 'Login failed')
                                : 'Something went wrong'}
                        </p>
                    )}
                </div>
            </form>

            <section className="flex w-[90%] items-center gap-2 py-2 sm:gap-[0.6vw] sm:py-[0.6vw]">
                <span className="h-px flex-1 bg-[#ccc]" />

                <span className="shrink-0 text-[10px] text-[#777] sm:text-[11px] md:text-[11px] lg:text-[12px]">
                    Or
                </span>

                <span className="h-px flex-1 bg-[#ccc]" />
            </section>

            <Button
                type="button"
                className="flex h-11 w-[90%] shrink-0 items-center justify-center gap-2 bg-white px-3 text-[10px] text-[#777] hover:bg-gray-100 max-[200px]:h-[80px] sm:h-[3.75vw] sm:gap-[0.5vw] sm:text-[8.5px] md:h-[3.5vw] md:text-[10px] lg:text-[12px]"
            >
                <Image
                    src={googleLogo}
                    alt=""
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 sm:h-[1.4vw] sm:w-[1.4vw]"
                />

                <span>Continue With Google</span>
            </Button>

            <section className="flex w-[90%] flex-row items-center justify-center gap-2 py-2 max-[300px]:flex-col max-[300px]:gap-1 sm:flex-col sm:gap-1 sm:py-2 md:flex-row md:gap-[0.4vw] md:py-[0.6vw]">
                <p className="text-[10px] font-medium whitespace-nowrap sm:text-[11px] md:text-[11px] lg:text-[12px]">
                    Don't have an account?
                </p>

                <Link
                    to="../register"
                    className="text-[10px] font-bold whitespace-nowrap no-underline hover:underline sm:text-[11px] md:text-[11px] lg:text-[12px]"
                >
                    Create Account
                </Link>
            </section>
        </div>
    );
}
