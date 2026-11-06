import { useParams } from 'react-router';

import { useAppointment, useOrganizationAppointment } from '../../hooks/appointment-hook.ts';

import { useCurrentUser } from '../../hooks/users-hook.ts';
import { Role } from '../../../../models/enums/roles.ts';

import { ErrorState } from '../../../../components/ErrorState.tsx';
import { LoadingState } from '../../../../components/LoadingState.tsx';

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
        error: userAppointmentError,
        refetch: refetchUserAppointment,
    } = useAppointment(appointmentUuid ?? '', !isOrganizationRelated);

    const {
        data: organizationAppointment,
        isLoading: isOrganizationAppointmentLoading,
        isError: isOrganizationAppointmentError,
        error: organizationAppointmentError,
        refetch: refetchOrganizationAppointment,
    } = useOrganizationAppointment(
        currentUser?.organizationUuid,
        appointmentUuid ?? '',
        isOrganizationRelated,
    );

    if (!appointmentUuid) {
        return (
            <ErrorState
                title="Appointment not found"
                message="The requested appointment does not exist."
            />
        );
    }

    const appointment = isOrganizationRelated ? organizationAppointment : userAppointment;

    const isLoading = isOrganizationRelated
        ? isOrganizationAppointmentLoading
        : isUserAppointmentLoading;

    const isError = isOrganizationRelated ? isOrganizationAppointmentError : isUserAppointmentError;
    const error = isOrganizationRelated ? organizationAppointmentError : userAppointmentError;
    const refetch = isOrganizationRelated
        ? refetchOrganizationAppointment
        : refetchUserAppointment;

    if (isLoading) {
        return <LoadingState label="Loading appointment..." />;
    }

    if (isError) {
        return (
            <ErrorState
                error={error}
                title="Failed to load appointment"
                onRetry={() => refetch()}
            />
        );
    }

    if (!appointment) {
        return (
            <ErrorState
                title="Appointment not found"
                message="This appointment does not exist or is no longer available."
            />
        );
    }

    const canManage =
        isOrganizationRelated &&
        (currentUser?.role === Role.OWNER ||
            currentUser?.role === Role.MANAGER ||
            currentUser?.role === Role.CRM);

    return (
        <AppointmentProfile
            appointment={appointment}
            organizationUuid={appointment.organizationUuid}
            canManage={canManage}
        />
    );
}
