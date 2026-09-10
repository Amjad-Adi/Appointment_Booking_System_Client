import { Building2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router';

import { useOrganization } from '../../../../../hooks/orgsnization-hook.ts';
import { ActivationStatusRender } from '../../../../../components/ActivationStatusRender.tsx';

interface UserOrganizationCardProps {
    organizationUuid: string;
}

export function UserOrganizationCard({ organizationUuid }: UserOrganizationCardProps) {
    const navigate = useNavigate();

    const { data: organization, isLoading, isError } = useOrganization(organizationUuid);

    if (isLoading) {
        return (
            <OrganizationCardContainer>
                <CardHeader />

                <div className="mt-5 text-[11px] text-[#777789]">Loading organization...</div>
            </OrganizationCardContainer>
        );
    }

    if (isError || !organization) {
        return (
            <OrganizationCardContainer>
                <CardHeader />

                <div className="mt-5 text-[11px] text-[#c94a5c]">Failed to load organization.</div>
            </OrganizationCardContainer>
        );
    }

    return (
        <OrganizationCardContainer>
            <CardHeader />

            <button
                type="button"
                onClick={() => navigate(`/organizations/${organization.uuid}`)}
                className="group mt-5 flex w-full min-w-0 cursor-pointer items-center gap-3 rounded-lg border border-[#d3d3df] bg-[#ededf2] p-3 text-left transition-colors hover:bg-[#e5e6ec]"
            >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#d3d3df] bg-[#f5f5f8] text-[#777789]">
                    <Building2 className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                    <p
                        className="truncate text-[12px] font-semibold text-[#343447]"
                        title={organization.name}
                    >
                        {organization.name}
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                        <span className="text-[10px] text-[#777789]">Organization</span>

                        <ActivationStatusRender status={organization.status} />
                    </div>
                </div>

                <ExternalLink className="size-3.5 shrink-0 text-[#777789] transition-transform group-hover:translate-x-0.5 group-hover:text-[#343447]" />
            </button>
        </OrganizationCardContainer>
    );
}

function OrganizationCardContainer({ children }: { children: React.ReactNode }) {
    return (
        <section className="min-w-0 rounded-xl border border-[#d3d3df] bg-[#f5f5f8] p-5 shadow-sm sm:p-6">
            {children}
        </section>
    );
}

function CardHeader() {
    return (
        <div className={'text-left'}>
            <h3 className="text-[13px] font-semibold text-[#343447]">Organization</h3>

            <p className="mt-0.5 text-[10px] leading-4 text-[#777789]">
                Organization this user belongs to.
            </p>
        </div>
    );
}
