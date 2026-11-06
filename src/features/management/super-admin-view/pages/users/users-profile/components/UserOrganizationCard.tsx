import { Building2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router';

import { useOrganization } from '../../../../../hooks/organization-hook.ts';
import { ActivationStatusRender } from '../../../../../components/ActivationStatusRender.tsx';
import { LoadingState } from '../../../../../../../components/LoadingState.tsx';
import { ErrorState } from '../../../../../../../components/ErrorState.tsx';

interface UserOrganizationCardProps {
    organizationUuid: string;
}

export function UserOrganizationCard({ organizationUuid }: UserOrganizationCardProps) {
    const navigate = useNavigate();
    const { data: organization, isLoading, isError, error, refetch } = useOrganization(organizationUuid);

    if (isLoading) {
        return (
            <OrganizationCardContainer>
                <CardHeader />

                <LoadingState label="Loading organization..." rows={1} className="mt-5" />
            </OrganizationCardContainer>
        );
    }

    if (isError) {
        return (
            <OrganizationCardContainer>
                <CardHeader />

                <ErrorState
                    error={error}
                    title="Failed to load organization"
                    onRetry={() => {
                        void refetch();
                    }}
                    className="mt-5"
                />
            </OrganizationCardContainer>
        );
    }

    if (!organization) {
        return (
            <OrganizationCardContainer>
                <CardHeader />

                <div className="mt-5 text-[11px] text-muted-foreground">
                    This user doesn't belong to an organization.
                </div>
            </OrganizationCardContainer>
        );
    }

    return (
        <OrganizationCardContainer>
            <CardHeader />

            <button
                type="button"
                onClick={() => navigate(`/admin/organizations/${organization.uuid}`)}
                className="group mt-5 flex w-full min-w-0 cursor-pointer items-center gap-3 rounded-lg border border-border bg-secondary p-3 text-left transition-colors hover:bg-muted"
            >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground">
                    <Building2 className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                    <p
                        className="truncate text-[12px] font-semibold text-foreground"
                        title={organization.name}
                    >
                        {organization.name}
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground">Organization</span>

                        <ActivationStatusRender status={organization.status} />
                    </div>
                </div>

                <ExternalLink className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </button>
        </OrganizationCardContainer>
    );
}

function OrganizationCardContainer({ children }: { children: React.ReactNode }) {
    return (
        <section className="min-w-0 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
            {children}
        </section>
    );
}

function CardHeader() {
    return (
        <div className={'text-left'}>
            <h3 className="text-[13px] font-semibold text-foreground">Organization</h3>

            <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
                Organization this user belongs to.
            </p>
        </div>
    );
}
