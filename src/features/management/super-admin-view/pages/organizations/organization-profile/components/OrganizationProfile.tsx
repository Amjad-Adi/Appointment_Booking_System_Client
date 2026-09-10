import type { OrganizationResponse } from '../../../../../../../models/organization.model.ts';

import { ProfileActions } from '../../../components/ProfileActions.tsx';

import { OrganizationProfileHeader } from './OrganizationProfileHeader.tsx';
import { OrganizationAboutCard } from './OrganizationAboutCard.tsx';
import { OrganizationLocationCard } from './OrganizationLocationCard.tsx';
import { OrganizationBioCard } from './OrganizationBioCard.tsx';
import { OrganizationAccountCard } from './OrganizationAccountCard.tsx';
import { BackButton } from '../../../../../components/BackButton.tsx';

interface OrganizationProfileProps {
    organization: OrganizationResponse;
}

export function OrganizationProfile({ organization }: OrganizationProfileProps) {
    return (
        <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="flex min-w-0 items-center justify-between gap-3">
                <BackButton backPath="/admin/organizations" />
                <ProfileActions editPath={`/admin/organizations/${organization.uuid}/edit`} />
            </div>
            <OrganizationProfileHeader organization={organization} />

            <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
                <OrganizationAboutCard organization={organization} />

                <OrganizationLocationCard location={organization.location} />
            </div>

            <OrganizationBioCard bio={organization.bio} />

            <OrganizationAccountCard organization={organization} />
        </div>
    );
}
