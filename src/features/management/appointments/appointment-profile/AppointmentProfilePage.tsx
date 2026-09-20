import { useParams } from 'react-router';

import { useAppointment, useOrganizationAppointment } from '../../hooks/appointment-hook.ts';

import { useCurrentUser } from '../../hooks/users-hook.ts';

import { AppointmentProfile } from './components/AppointmentProfile.tsx';

export function AppointmentProfilePage() {
    const { appointmentUuid } = useParams<{
        appointmentUuid: string;
    }>();

    const { data: currentUser } = useCurrentUser();

    const isOrganizationRelated = currentUser?.organizationUuid != null;

    const {
        data: userAppointment,
        isLoading: isUserAppointmentLoading,
        isError: isUserAppointmentError,
    } = useAppointment(appointmentUuid ?? '', !isOrganizationRelated);

    const {
        data: organizationAppointment,
        isLoading: isOrganizationAppointmentLoading,
        isError: isOrganizationAppointmentError,
    } = useOrganizationAppointment(
        currentUser?.organizationUuid,
        appointmentUuid ?? '',
        isOrganizationRelated,
    );

    if (!appointmentUuid) {
        return (<div>Appointment not found</div>);
    }

    const appointment = isOrganizationRelated ? organizationAppointment : userAppointment;

    const isLoading = isOrganizationRelated
        ? isOrganizationAppointmentLoading
        : isUserAppointmentLoading;

    const isError = isOrganizationRelated ? isOrganizationAppointmentError : isUserAppointmentError;

    if (isLoading) {
        return <div>Loading appointment...</div>;
    }

    if (isError || !appointment) {
        return <div>Failed to load appointment.</div>;
    }

    const canManage =
        isOrganizationRelated && (currentUser?.role === 'OWNER' || currentUser?.role === 'MANAGER');

    return (
        <AppointmentProfile
            appointment={appointment}
            organizationUuid={appointment.organizationUuid}
            canManage={canManage}
        />
    );
}
