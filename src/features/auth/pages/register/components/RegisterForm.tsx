import * as React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { TextField } from '../../../../../components/TextField.tsx';
import { CheckboxField } from '../../../../../components/CheckBoxField.tsx';
import { Image } from '../../../../../components/Image.tsx';
import { Button } from '../../../../../components/Button.tsx';
import { api } from '../../../../../services/axios.ts';
import { Controller, useForm } from 'react-hook-form';
import { createUserSchema, loginUserSchema } from '../../../../../zod-schemas/user.schema.ts';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Select } from '../../../../../components/Select.tsx';
import { Role } from '../../../../../models/enums/roles.ts';
import { ShieldUser, User } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

let token: string;
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
        onSuccess: async (data) => {
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
                className="flex w-full flex-col items-center gap-2 sm:gap-[0.8vw]"
                onSubmit={handleSubmit(submitRegister)}
            >
                <p className="w-full py-1 text-center font-[Poppins,serif] text-[10px] font-bold text-taupe-950 sm:text-[20px] md:text-[22px] lg:text-[24px]">
                    Create an account
                </p>
                <Controller
                    control={control}
                    name="role"
                    render={({ field }) => (
                        <div className="flex w-full justify-center gap-[4vw]">
                            <Button
                                className={`${field.value == Role.CUSTOMER ? 'bg-slate-800' : 'bg-gray-50'} border-border-subtle flex h-fit w-1/4 justify-center rounded-2xl px-0 py-2 text-base hover:bg-gray-300 sm:h-auto sm:px-0 sm:py-2 sm:text-base md:h-auto md:px-0 md:py-2 md:text-base`}
                                onClick={(e) => {
                                    field.onChange(Role.CUSTOMER);
                                }}
                            >
                                <div className="flex h-fit w-fit justify-center gap-1">
                                    <User
                                        className={`${field.value == Role.CUSTOMER ? 'text-gray-50' : 'text-slate-800'}`}
                                    />
                                    <p
                                        className={`${field.value == Role.CUSTOMER ? 'text-gray-50' : 'text-slate-800'} w-full text-center font-[Poppins,serif] text-[14px] font-bold`}
                                    >
                                        Customer
                                    </p>
                                </div>
                            </Button>
                            <Button
                                className={`${field.value == Role.OWNER ? 'bg-slate-800' : 'bg-gray-50'} border-border-subtle flex h-auto w-1/4 justify-center rounded-2xl px-0 py-2 text-base hover:bg-gray-300 sm:h-auto sm:px-0 sm:py-2 sm:text-base md:h-auto md:px-0 md:py-2 md:text-base`}
                                onClick={(e) => {
                                    field.onChange(Role.OWNER);
                                }}
                            >
                                <div className="flex h-fit w-fit justify-center gap-1">
                                    <ShieldUser
                                        className={`${field.value == Role.OWNER ? 'text-gray-50' : 'text-slate-800'}`}
                                    />
                                    <p
                                        className={`${field.value == Role.OWNER ? 'text-gray-50' : 'text-slate-800'} w-full text-center font-[Poppins,serif] text-[14px] font-bold`}
                                    >
                                        Business Manager
                                    </p>
                                </div>
                            </Button>
                        </div>
                    )}
                />
                <div className="flex w-full justify-between gap-[1vw]">
                    <div className="w-full">
                        <TextField
                            label="first name"
                            type="text"
                            placeholder="First Name"
                            id="first_name"
                            {...register('firstName')}
                            isLabelDisabled={true}
                        />
                        {formState.errors.firstName && (
                            <p className="text-error w-full self-start ps-2 text-left text-[10px] sm:text-[12px]">
                                {formState.errors.firstName.message}
                            </p>
                        )}
                    </div>
                    <div className="w-full">
                        <TextField
                            label="last name"
                            type="text"
                            placeholder="Last Name"
                            id="last_name"
                            {...register('lastName')}
                            isLabelDisabled={true}
                        />
                        {formState.errors.lastName && (
                            <p className="text-error w-full self-start ps-2 text-left text-[10px] sm:text-[12px]">
                                {formState.errors.lastName.message}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex w-full justify-between gap-[1vw]">
                    <div className="w-full">
                        <TextField
                            label="email"
                            type="email"
                            placeholder="Email"
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
                        <Select
                            value={language}
                            {...register('language')}
                            onChange={(event) => setLanguage(event.target.value)}
                        >
                            <option value="en">English</option>
                            <option value="ar">العربية</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                        </Select>
                        {formState.errors.language && (
                            <p className="text-error w-full self-start ps-2 text-left text-[10px] sm:text-[12px]">
                                {formState.errors.language.message}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex w-full justify-between gap-[1vw]">
                    <div className="w-full">
                        <TextField
                            label="password"
                            type="password"
                            placeholder="Password"
                            id="password"
                            {...register('password')}
                            isLabelDisabled={true}
                        />
                        {formState.errors.password && (
                            <p className="text-error w-full self-start ps-2 text-left text-[10px] sm:text-[12px]">
                                {formState.errors.password.message}
                            </p>
                        )}
                    </div>
                    <div className="w-full">
                        <TextField
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm Password"
                            id="confirm_password"
                            {...register('confirmPassword')}
                            isLabelDisabled={true}
                        />
                        {formState.errors.confirmPassword && (
                            <p className="text-error w-full self-start ps-2 text-left text-[10px] sm:text-[12px]">
                                {formState.errors.confirmPassword.message}
                            </p>
                        )}
                    </div>
                </div>
                <div className="w-full">
                    <CheckboxField {...register('privacyPolicy')}>
                        I have read and agree to the Terms of Service and acknowledge the{' '}
                        <a href="/privacy-policy" className="underline">
                            Privacy Policy.
                        </a>
                    </CheckboxField>
                    {formState.errors.privacyPolicy && (
                        <p className="text-error w-full self-start ps-2 text-left text-[10px] sm:text-[12px]">
                            {formState.errors.privacyPolicy.message}
                        </p>
                    )}
                </div>
                <div className="w-full">
                    <Button
                        type="submit"

                        className="h-11 w-[50%] max-[200px]:h-[40px] sm:h-[3.75vw] md:h-[3.5vw]"
                        disabled={registerMutation.isPending}
                    >
                        Sign Up
                    </Button>
                    {registerMutation.isError && (
                        <p className="text-error w-full text-[10px] sm:text-[12px]">
                            {axios.isAxiosError(registerMutation.error)
                                ? (registerMutation.error.response?.data.message ??
                                  'Account Creation failed')
                                : 'Something went wrong'}
                        </p>
                    )}
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
