import { Link } from 'react-router';
import {
    ArrowRight,
    BriefcaseBusiness,
    CalendarCheck,
    CheckCircle2,
    MapPin,
    UsersRound,
} from 'lucide-react';

import { Role } from '../../../../../../../models/enums/roles.ts';
import { useCurrentUser } from '../../../../../hooks/users-hook.ts';

const features = [
    {
        icon: BriefcaseBusiness,
        title: 'Manage services',
        description: 'Create and organize the services your business offers.',
    },
    {
        icon: UsersRound,
        title: 'Manage your team',
        description: 'Invite employees and manage your organization.',
    },
    {
        icon: CalendarCheck,
        title: 'Manage appointments',
        description: 'Keep track of bookings and your daily schedule.',
    },
];

export function OrganizationWelcomePage() {
    const { data: currentUser, isLoading } = useCurrentUser();

    if (isLoading) {
        return (
            <div className="p-5 text-left text-[11px] text-[#777789]">
                Loading your workspace...
            </div>
        );
    }

    if (!currentUser) return null;

    const needsSetup = currentUser.role === Role.OWNER && currentUser.organizationUuid == null;

    return (
        <main className="flex min-w-0 flex-1 flex-col gap-5 text-left">
            {/* Welcome */}
            <section className="min-w-0 overflow-hidden rounded-xl border border-[#d3d3df] bg-[#f5f5f8] shadow-sm">
                <div className="border-b border-[#dedee8] px-5 py-6 sm:px-6">
                    <div className="flex flex-col items-start gap-2">
                        <span className="rounded-md border border-[#dedee8] bg-[#ededf2] px-2.5 py-1 text-[10px] font-medium text-[#777789]">
                            {needsSetup ? 'Welcome to your workspace' : 'Organization dashboard'}
                        </span>

                        <h1 className="mt-1 text-left text-xl font-semibold text-[#343447] sm:text-2xl">
                            Welcome, {currentUser.firstName}!
                        </h1>

                        <p className="max-w-xl text-left text-[11px] leading-5 text-[#777789]">
                            {needsSetup
                                ? 'Set up your organization to start managing your services, team and appointments.'
                                : 'Manage your organization and keep everything in one place.'}
                        </p>
                    </div>
                </div>

                {needsSetup && (
                    <div className="p-5 sm:p-6">
                        <div className="flex flex-col items-start gap-4 sm:flex-row">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#d3d3df] bg-[#ededf2] text-[#343447]">
                                <BriefcaseBusiness className="size-5" strokeWidth={1.7} />
                            </div>

                            <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
                                <span className="rounded-md border border-[#dedee8] bg-[#ededf2] px-2 py-0.5 text-[10px] font-medium text-[#777789]">
                                    Setup required
                                </span>

                                <h2 className="text-[13px] font-semibold text-[#343447]">
                                    Create your organization
                                </h2>

                                <p className="max-w-xl text-[11px] leading-5 text-[#777789]">
                                    Add your business name, contact details and location to complete
                                    your initial setup.
                                </p>

                                <Link
                                    to="/organization/create"
                                    className="mt-2 inline-flex h-8 items-center justify-center gap-2 rounded-lg bg-[#343447] px-4 text-[11px] font-medium text-white transition-colors hover:bg-[#48485f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#343447]"
                                >
                                    Create Organization
                                    <ArrowRight className="size-3.5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {needsSetup && (
                <section className="flex min-w-0 flex-col gap-4">
                    {/* Section heading */}
                    <div className="flex items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#d3d3df] bg-[#ededf2] text-[#777789]">
                            <CheckCircle2 className="size-4" />
                        </div>

                        <div className="min-w-0">
                            <h2 className="text-[13px] font-semibold text-[#343447]">
                                Getting started
                            </h2>

                            <p className="mt-0.5 text-[10px] leading-4 text-[#777789]">
                                Everything you need to manage your organization.
                            </p>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {features.map((feature) => {
                            const Icon = feature.icon;

                            return (
                                <div
                                    key={feature.title}
                                    className="flex min-w-0 flex-col items-start gap-3 rounded-xl border border-[#d3d3df] bg-[#f5f5f8] p-5 text-left shadow-sm transition-colors hover:border-[#bcbccc] sm:p-6"
                                >
                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#d3d3df] bg-[#ededf2] text-[#777789]">
                                        <Icon className="size-4" strokeWidth={1.7} />
                                    </div>

                                    <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
                                        <h3 className="text-[13px] font-semibold text-[#343447]">
                                            {feature.title}
                                        </h3>

                                        <p className="text-[11px] leading-5 text-[#777789]">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Setup note */}
                    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-[#dedee8] bg-[#ededf2] p-4 text-left">
                        <MapPin className="mt-0.5 size-4 shrink-0 text-[#777789]" />

                        <p className="text-[11px] leading-5 text-[#777789]">
                            You can finish setting up your organization whenever you're ready. Your
                            account is already registered.
                        </p>
                    </div>
                </section>
            )}
        </main>
    );
}
