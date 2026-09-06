import * as React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { TextField } from '../../../../../components/TextField.tsx';
import { CheckboxField } from '../../../../../components/CheckBoxField.tsx';
import { Button } from '../../../../../components/Button.tsx';
import { api } from '../../../../../services/axios.ts';
import { Controller, useForm } from 'react-hook-form';
import { createUserSchema } from '../../../../../zod-schemas/user.schema.ts';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Select } from '../../../../../components/Select.tsx';
import { Role } from '../../../../../models/enums/roles.ts';
import { ShieldUser, User } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

export function RegisterForm() {
    type UserFormInput = z.input<typeof createUserSchema>;
    type UserFormOutput = z.output<typeof createUserSchema>;
    type RegisterRequest = Omit<UserFormOutput, 'privacyPolicy'>;
    const { register, handleSubmit, formState, control } = useForm<
        UserFormInput,
        any,
        UserFormOutput
    >({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            role: Role.CUSTOMER,
            language: 'en',
        },
    });
    const navigate = useNavigate();
    const registerMutation = useMutation({
        mutationFn: async (userForm: RegisterRequest) => {
            const response = await api.post('api/users/register', userForm);
            return response.data;
        },
        onSuccess: async () => {
            navigate('../login');
        },
        onError: (error) => {
            console.log(error);
        },
    });
    function submitRegister(userForm: UserFormOutput) {
        const { privacyPolicy, ...registerForm } = userForm;
        registerMutation.mutate(registerForm);
    }
    const [language, setLanguage] = useState('en');

    return (
        <div className="flex w-full min-w-0 flex-col items-center px-5 sm:flex-1 sm:p-[1.5vw]">
            <form
                className="flex w-full flex-col items-center gap-1 sm:gap-[0.5vw]"
                onSubmit={handleSubmit(submitRegister)}
            >
                <p className="w-full py-1 text-center text-[16px] font-bold text-taupe-950 sm:text-[20px] md:text-[22px] lg:text-[24px]">
                    Create an account
                </p>
                <Controller
                    control={control}
                    name="role"
                    render={({ field }) => (
                        <div className="flex w-full flex-col items-center justify-center gap-2 md:flex-row md:gap-[4vw]">
                            <div className="group w-full max-w-xs md:w-1/2 lg:w-1/3">
                                <Button
                                    type="button"
                                    className={`border-border-subtle flex w-full flex-col items-center justify-center rounded-2xl py-2 transition-transform duration-200 group-hover:-translate-y-0.5 sm:px-0 ${field.value === Role.CUSTOMER ? 'bg-slate-800' : 'bg-gray-50'} ${
                                        field.value === Role.CUSTOMER
                                            ? 'group-hover:bg-slate-900'
                                            : 'group-hover:bg-gray-300'
                                    }`}
                                    onClick={() => field.onChange(Role.CUSTOMER)}
                                >
                                    <div className="flex h-fit w-fit justify-center gap-1">
                                        <User
                                            className={`${field.value == Role.CUSTOMER ? 'text-gray-50' : 'text-slate-800'}`}
                                        />
                                        <div className="flex flex-col justify-center">
                                            <p
                                                className={`${field.value == Role.CUSTOMER ? 'text-gray-50' : 'text-slate-800'} w-full text-center text-[14px] font-bold`}
                                            >
                                                Customer
                                            </p>
                                        </div>
                                    </div>
                                </Button>
                            </div>
                            <div className="group w-full max-w-xs md:w-1/2 lg:w-1/3">
                                <Button
                                    type="button"
                                    className={`border-border-subtle flex w-full flex-col items-center justify-center rounded-2xl py-2 transition-transform duration-200 group-hover:-translate-y-0.5 sm:px-0 ${field.value === Role.OWNER ? 'bg-slate-800' : 'bg-gray-50'} ${
                                        field.value === Role.OWNER
                                            ? 'group-hover:bg-slate-900'
                                            : 'group-hover:bg-gray-300'
                                    }`}
                                    onClick={() => field.onChange(Role.OWNER)}
                                >
                                    <div className="flex h-fit w-fit justify-center gap-1">
                                        <ShieldUser
                                            className={`${field.value == Role.OWNER ? 'text-gray-50' : 'text-slate-800'}`}
                                        />
                                        <div className="flex flex-col justify-center">
                                            <p
                                                className={`${field.value == Role.OWNER ? 'text-gray-50' : 'text-slate-800'} w-full text-center text-[14px] font-bold`}
                                            >
                                                Business Manager
                                            </p>
                                        </div>
                                    </div>
                                </Button>
                            </div>
                        </div>
                    )}
                />

                <div className="mt-2 flex w-full flex-col justify-between md:flex-row md:gap-[1vw]">
                    <div className="w-full">
                        <TextField
                            label="first name"
                            type="text"
                            placeholder="First Name"
                            id="first_name"
                            errorMessage={formState.errors.firstName?.message}
                            {...register('firstName')}
                            isLabelDisabled={true}
                        />
                    </div>
                    <div className="w-full">
                        <TextField
                            label="last name"
                            type="text"
                            placeholder="Last Name"
                            id="last_name"
                            errorMessage={formState.errors.lastName?.message}
                            {...register('lastName')}
                            isLabelDisabled={true}
                        />
                    </div>
                </div>

                <div className="flex w-full flex-col justify-between md:flex-row md:gap-[1vw]">
                    <div className="w-full">
                        <TextField
                            label="email"
                            type="email"
                            placeholder="Email"
                            id="email"
                            errorMessage={formState.errors.email?.message}
                            {...register('email')}
                            isLabelDisabled={true}
                        />
                    </div>
                    <div className="w-full py-1">
                        <Select
                            value={language}
                            hasError={!!formState.errors.language}
                            {...register('language')}
                            onChange={(event) => setLanguage(event.target.value)}
                        >
                            <option value="en">English</option>
                            <option value="ar">العربية</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                        </Select>

                        <div className="min-h-[18px] w-full pt-1 sm:min-h-[20px]">
                            {formState.errors.language && (
                                <p className="text-error w-full self-start ps-2 text-left text-[10px] leading-tight sm:text-[12px]">
                                    {formState.errors.language.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex w-full flex-col justify-between md:flex-row md:gap-[1vw]">
                    <div className="w-full">
                        <TextField
                            label="password"
                            type="password"
                            placeholder="Password"
                            id="password"
                            errorMessage={formState.errors.password?.message}
                            {...register('password')}
                            isLabelDisabled={true}
                        />
                    </div>
                    <div className="w-full">
                        <TextField
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm Password"
                            id="confirm_password"
                            errorMessage={formState.errors.confirmPassword?.message}
                            {...register('confirmPassword')}
                            isLabelDisabled={true}
                        />
                    </div>
                </div>

                <div className="w-full py-1">
                    <CheckboxField {...register('privacyPolicy')}>
                        I have read and agree to the Terms of Service and acknowledge the{' '}
                        <a href="/privacy-policy" className="underline">
                            Privacy Policy.
                        </a>
                    </CheckboxField>

                    <div className="min-h-[18px] w-full pt-1 sm:min-h-[20px]">
                        {formState.errors.privacyPolicy && (
                            <p className="text-error w-full self-start ps-2 text-left text-[10px] leading-tight sm:text-[12px]">
                                {formState.errors.privacyPolicy.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex w-full flex-col items-center justify-center">
                    <Button
                        type="submit"
                        className="h-11 w-full max-w-xs max-[200px]:h-[40px] md:h-[3.5vw] md:w-[50%]"
                        disabled={registerMutation.isPending}
                    >
                        Sign Up
                    </Button>

                    <div className="min-h-[20px] w-full pt-2 sm:min-h-[24px]">
                        {registerMutation.isError && (
                            <p className="text-error w-full text-center text-[10px] sm:text-[12px]">
                                {axios.isAxiosError(registerMutation.error)
                                    ? (registerMutation.error.response?.data.message ??
                                      'Account Creation failed')
                                    : 'Something went wrong'}
                            </p>
                        )}
                    </div>
                </div>
            </form>
            <section className="flex w-[90%] flex-row items-center justify-center gap-2 py-2 max-[300px]:flex-col max-[300px]:gap-1 sm:flex-col sm:gap-1 sm:py-2 md:flex-row md:gap-[0.4vw] md:py-[0.6vw]">
                <p className="text-[10px] font-medium whitespace-nowrap sm:text-[11px] md:text-[11px] lg:text-[12px]">
                    already have an account?
                </p>
                <Link
                    to="../login"
                    className="text-[10px] font-bold whitespace-nowrap no-underline hover:underline sm:text-[11px] md:text-[11px] lg:text-[12px]"
                >
                    Login ↩
                </Link>
            </section>
        </div>
    );
}
