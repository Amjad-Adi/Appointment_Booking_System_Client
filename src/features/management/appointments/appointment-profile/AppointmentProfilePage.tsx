import { useParams } from 'react-router';

import { useCurrentUser } from '../../hooks/users-hook.ts';

import { useOrganizationAppointment } from '../../hooks/appointment-hook.ts';

import { AppointmentProfile } from './components/AppointmentProfile.tsx';

export function AppointmentProfilePage() {
    const { appointmentUuid } = useParams<{
        appointmentUuid: string;
    }>();

    const { data: currentUser } = useCurrentUser();

    const {
        data: appointment,
        isLoading,
        isError,
    } = useOrganizationAppointment(currentUser?.organizationUuid, appointmentUuid ?? '');

    if (!appointmentUuid) {
        return <div>Appointment not found</div>;
    }

    if (isLoading) {
        return <div>Loading appointment...</div>;
    }

    if (isError || !appointment) {
        return <div>Failed to load appointment.</div>;
    }

    return <AppointmentProfile appointment={appointment} canManage />;
}
