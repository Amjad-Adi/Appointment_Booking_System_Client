import type { OrganizationResponse } from '../../../../../../../models/organization.model.ts';

import { ProfileActions } from '../../../components/ProfileActions.tsx';
import { OrganizationProfileHeader } from './OrganizationProfileHeader.tsx';
import { OrganizationAboutCard } from './OrganizationAboutCard.tsx';
import { OrganizationLocationCard } from './OrganizationLocationCard.tsx';
import { OrganizationBioCard } from './OrganizationBioCard.tsx';
import { OrganizationAccountCard } from './OrganizationAccountCard.tsx';
import { OrganizationTimeInfo } from './OrganizationTimeInfo.tsx';
import { BackButton } from '../../../../../components/BackButton.tsx';
import { OrganizationWorkingHoursCard } from './working-hours/OrganizationWorkingHoursCard.tsx';

interface OrganizationProfileProps {
    organization: OrganizationResponse;
    backPath?: string;
    canEdit?: boolean;
    onEdit?: () => void;
    canEditWorkingHours: boolean;
}

export function OrganizationProfile({
    organization,
    backPath,
    canEdit = false,
    onEdit,
    canEditWorkingHours=false,
}: OrganizationProfileProps) {
    const timeZone =
        organization.location?.timezone ||
        Intl.DateTimeFormat().resolvedOptions().timeZone ||
        'UTC';

    return (
        <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="flex min-w-0 items-center justify-between gap-3">
                <div>{backPath && <BackButton backPath={backPath} />}</div>
                {canEdit && <ProfileActions onEdit={onEdit} />}
            </div>

            <OrganizationTimeInfo timeZone={timeZone} />

            <OrganizationProfileHeader organization={organization} />

            <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
                <OrganizationAboutCard organization={organization} />
                <OrganizationLocationCard location={organization.location} />
            </div>
            <OrganizationBioCard bio={organization.bio} />
            <OrganizationWorkingHoursCard
                organization={organization}
                canEdit={canEditWorkingHours}
            />
            <OrganizationAccountCard organization={organization} />
        </div>
    );
}
