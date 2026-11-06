import { Link } from 'react-router';
import {
    ArrowRight,
    BriefcaseBusiness,
    Building2,
    Tags,
    Users,
} from 'lucide-react';

import { ManagementPage } from '../../../components/ManagementPage.tsx';
import { DashboardStatCard } from '../../../components/DashboardStatCard.tsx';

import { useUsers } from '../../../hooks/users-hook.ts';
import { useOrganizations } from '../../../hooks/organization-hook.ts';
import { useServices } from '../../../hooks/services-hook.ts';
import { useServiceCategories } from '../../../hooks/service-categories-hook.ts';

import { Order } from '../../../../../models/enums/order.ts';
import { activationStatusRecord } from '../../../../../models/enums-mapping/activation-status.ts';

export function SuperAdminDashboardPage() {
    const { data: users } = useUsers({ page: 1, limit: 1 });

    const { data: organizations } = useOrganizations({
        page: 1,
        limit: 5,
        sortBy: 'createdAtUTC',
        order: Order.DESC,
    });

    const { data: services } = useServices({ page: 1, limit: 1 });

    const { data: categories } = useServiceCategories({ page: 1, limit: 1 });

    return (
        <ManagementPage
            title="Dashboard"
            description={['Platform overview across users, organizations and services.']}
        >
            <div className="flex min-w-0 flex-col gap-4">
                <section className="flex min-w-0 flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <p className="text-[11px] font-medium text-muted-foreground">Super Admin</p>

                        <h2 className="mt-0.5 truncate text-lg font-semibold tracking-tight text-foreground">
                            Platform overview
                        </h2>

                        <p className="mt-1 text-[11px] text-muted-foreground">
                            Monitor the platform and manage users, organizations and services.
                        </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                        <Link
                            to="/admin/organizations"
                            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-[11px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            <Building2 className="size-3.5" />
                            Organizations
                        </Link>

                        <Link
                            to="/admin/users"
                            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-border bg-transparent px-3 text-[11px] font-semibold text-secondary-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        >
                            <Users className="size-3.5" />
                            Users
                        </Link>
                    </div>
                </section>

                <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <DashboardStatCard
                        label="Users"
                        value={users?.pagination.totalItems ?? 0}
                        hint="Registered accounts"
                        icon={Users}
                        to="/admin/users"
                    />

                    <DashboardStatCard
                        label="Organizations"
                        value={organizations?.pagination.totalItems ?? 0}
                        hint="Businesses on the platform"
                        icon={Building2}
                        to="/admin/organizations"
                    />

                    <DashboardStatCard
                        label="Services"
                        value={services?.pagination.totalItems ?? 0}
                        hint="Active services"
                        icon={BriefcaseBusiness}
                        to="/admin/services"
                    />

                    <DashboardStatCard
                        label="Service Categories"
                        value={categories?.pagination.totalItems ?? 0}
                        hint="Available classifications"
                        icon={Tags}
                        to="/admin/service-categories"
                    />
                </div>

                <section className="min-w-0 rounded-xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-[13px] font-semibold text-foreground">
                                Recently Added Organizations
                            </h2>

                            <p className="mt-0.5 text-[10px] text-muted-foreground">
                                The latest organizations created on the platform.
                            </p>
                        </div>

                        <Link
                            to="/admin/organizations"
                            className="inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold text-secondary-foreground hover:text-foreground"
                        >
                            View all
                            <ArrowRight className="size-3" />
                        </Link>
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                        {(organizations?.data.length ?? 0) === 0 ? (
                            <div className="rounded-lg border border-dashed border-border bg-card p-5 text-center">
                                <p className="text-[11px] font-medium text-foreground">
                                    No organizations yet
                                </p>

                                <p className="mt-1 text-[10px] text-muted-foreground">
                                    Create the first organization from the organizations page.
                                </p>
                            </div>
                        ) : (
                            organizations?.data.map((organization) => (
                                <Link
                                    key={organization.uuid}
                                    to={`/admin/organizations/${organization.uuid}`}
                                    className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-secondary"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-[11px] font-semibold text-foreground">
                                            {organization.name}
                                        </p>

                                        <p className="mt-0.5 truncate text-[9px] text-muted-foreground">
                                            {organization.email} ·{' '}
                                            {new Date(organization.createdAtUTC).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <span className="shrink-0 rounded-full border border-border bg-card px-2 py-0.5 text-[9px] font-semibold text-secondary-foreground">
                                        {activationStatusRecord[organization.status]}
                                    </span>
                                </Link>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </ManagementPage>
    );
}
