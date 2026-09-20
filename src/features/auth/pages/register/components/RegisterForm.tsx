import { Link } from 'react-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegisterUser } from '../../../../management/hooks/users-hook.ts';
import { ShieldUser, User } from 'lucide-react';
import axios from 'axios';

import { TextField } from '../../../../../components/TextField.tsx';
import { CheckboxField } from '../../../../../components/CheckBoxField.tsx';
import { Button } from '../../../../../components/Button.tsx';
import { Select } from '../../../../../components/Select.tsx';

import { registerUserSchema } from '../../../../../zod-schemas/user.schema.ts';
import { Role } from '../../../../../models/enums/roles.ts';
import type { CreateUser, RegisterUser } from '../../../../../models/user.model.ts';
import { Language } from '../../../../../models/enums/language.ts';
import { languageRecord } from '../../../../../models/enums-mapping/language.ts';
import { roleRecord } from '../../../../../models/enums-mapping/roles.ts';
import { z } from 'zod';
type RegisterUserForm = z.input<typeof registerUserSchema>;
type RegisterUserFormOutput = z.output<typeof registerUserSchema>;
export function RegisterForm() {
    const { register, handleSubmit, formState, control } = useForm<
        RegisterUserForm,
        any,
        RegisterUserFormOutput
    >({
        resolver: zodResolver(registerUserSchema),
        defaultValues: {
            role: Role.CUSTOMER,
            language: Language.ENGLISH,
            profilePicturePath: 'DEFAULT_PICTURE_PATH',
        },
    });

    const registerMutation = useRegisterUser();

    function submitRegister(registerForm: RegisterUser) {
        const { privacyPolicy, ...user } = registerForm;

        registerMutation.mutate(user as CreateUser);
    }

    return (
        <div className="flex w-full min-w-0 flex-col items-center px-5 sm:flex-1 sm:p-[1.5vw]">
            <form
                className="flex w-full flex-col items-center gap-1 sm:gap-[0.5vw]"
                onSubmit={handleSubmit(submitRegister)}
            >
                <p className="w-full text-center text-[16px] font-bold text-taupe-950 sm:text-[20px] md:text-[22px] lg:text-[24px]">
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
                                    className={`border-border-subtle flex w-full flex-col items-center justify-center rounded-2xl py-2 transition-transform duration-200 group-hover:-translate-y-0.5 sm:px-0 ${
                                        field.value === Role.CUSTOMER
                                            ? 'bg-slate-800'
                                            : 'bg-gray-50'
                                    } ${
                                        field.value === Role.CUSTOMER
                                            ? 'group-hover:bg-slate-900'
                                            : 'group-hover:bg-gray-300'
                                    }`}
                                    onClick={() => field.onChange(Role.CUSTOMER)}
                                >
                                    <div className="flex h-fit w-fit justify-center gap-1">
                                        <User
                                            className={
                                                field.value === Role.CUSTOMER
                                                    ? 'text-gray-50'
                                                    : 'text-slate-800'
                                            }
                                        />

                                        <div className="flex flex-col justify-center">
                                            <p
                                                className={`w-full text-center text-[14px] font-bold ${
                                                    field.value === Role.CUSTOMER
                                                        ? 'text-gray-50'
                                                        : 'text-slate-800'
                                                }`}
                                            >
                                                {roleRecord[Role.CUSTOMER]}
                                            </p>
                                        </div>
                                    </div>
                                </Button>
                            </div>

                            <div className="group w-full max-w-xs md:w-1/2 lg:w-1/3">
                                <Button
                                    type="button"
                                    className={`border-border-subtle flex w-full flex-col items-center justify-center rounded-2xl py-2 transition-transform duration-200 group-hover:-translate-y-0.5 sm:px-0 ${
                                        field.value === Role.OWNER ? 'bg-slate-800' : 'bg-gray-50'
                                    } ${
                                        field.value === Role.OWNER
                                            ? 'group-hover:bg-slate-900'
                                            : 'group-hover:bg-gray-300'
                                    }`}
                                    onClick={() => field.onChange(Role.OWNER)}
                                >
                                    <div className="flex h-fit w-fit justify-center gap-1">
                                        <ShieldUser
                                            className={
                                                field.value === Role.OWNER
                                                    ? 'text-gray-50'
                                                    : 'text-slate-800'
                                            }
                                        />

                                        <div className="flex flex-col justify-center">
                                            <p
                                                className={`w-full text-center text-[14px] font-bold ${
                                                    field.value === Role.OWNER
                                                        ? 'text-gray-50'
                                                        : 'text-slate-800'
                                                }`}
                                            >
                                                {roleRecord[Role.OWNER]}
                                            </p>
                                        </div>
                                    </div>
                                </Button>
                            </div>
                        </div>
                    )}
                />

                <div className="mt-2 flex w-full flex-col justify-between md:flex-row md:gap-[1vw]">
                    <div className="w-full min-w-0">
                        <TextField
                            label="First name"
                            type="text"
                            placeholder="First Name"
                            id="first_name"
                            isLabelDisabled
                            errorMessage={formState.errors.firstName?.message}
                            {...register('firstName')}
                        />
                    </div>

                    <div className="w-full min-w-0">
                        <TextField
                            label="Last name"
                            type="text"
                            placeholder="Last Name"
                            id="last_name"
                            isLabelDisabled
                            errorMessage={formState.errors.lastName?.message}
                            {...register('lastName')}
                        />
                    </div>
                </div>

                <div className="flex w-full flex-col justify-between md:flex-row md:gap-[1vw]">
                    <div className="w-full min-w-0">
                        <TextField
                            label="Email"
                            type="email"
                            placeholder="Email"
                            id="email"
                            isLabelDisabled
                            errorMessage={formState.errors.email?.message}
                            {...register('email')}
                        />
                    </div>

                    <div className="w-full min-w-0">
                        <Select
                            label="Language"
                            isLabelDisabled
                            hasError={!!formState.errors.language}
                            errorMessage={formState.errors.language?.message}
                            {...register('language')}
                        >
                            <option value={Language.ENGLISH}>
                                {languageRecord[Language.ENGLISH]}
                            </option>
                            <option value={Language.ARABIC}>
                                {languageRecord[Language.ARABIC]}
                            </option>
                            <option value={Language.FRANCIS}>
                                {languageRecord[Language.FRANCIS]}
                            </option>
                            <option value={Language.DEUTSCH}>
                                {languageRecord[Language.DEUTSCH]}
                            </option>
                        </Select>
                    </div>
                </div>

                <div className="flex w-full flex-col justify-between md:flex-row md:gap-[1vw]">
                    <div className="w-full min-w-0">
                        <TextField
                            label="Password"
                            type="password"
                            placeholder="Password"
                            id="password"
                            isLabelDisabled
                            errorMessage={formState.errors.password?.message}
                            {...register('password')}
                        />
                    </div>

                    <div className="w-full min-w-0">
                        <TextField
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm Password"
                            id="confirm_password"
                            isLabelDisabled
                            errorMessage={formState.errors.confirmPassword?.message}
                            {...register('confirmPassword')}
                        />
                    </div>
                </div>
                <div className="w-full min-w-0">
                    <CheckboxField {...register('privacyPolicy')}>
                        I have read and agree to the Terms of Service and acknowledge the{' '}
                        <a href="/privacy-policy" className="underline">
                            Privacy Policy.
                        </a>
                    </CheckboxField>

                    <div className="min-h-[18px] w-full pt-1 sm:min-h-[20px]">
                        {formState.errors.privacyPolicy && (
                            <p className="text-error max-w-full ps-2 text-left text-[10px] leading-tight break-words sm:text-[12px]">
                                {formState.errors.privacyPolicy.message}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex w-full flex-col items-center justify-center">
                    <Button type="submit" className="w-1/3" disabled={registerMutation.isPending}>
                        Sign Up
                    </Button>

                    <div className="h-[10px] w-full sm:h-[12px]">
                        {registerMutation.isError && (
                            <p className="text-error w-full text-center text-[10px] break-words sm:text-[12px]">
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
