import { Building2, CalendarDays, Mail, UserRound } from 'lucide-react';

import type { CustomerInvitationResponse } from '../../../../../../models/customer-invitation.model.ts';
import { CustomerInvitationStatus } from '../../../../../../models/enums/customer-invitation-status.ts';
import { customerInvitationStatusRecord } from '../../../../../../models/enums-mapping/customer-invitation-status.ts';

import { Button } from '../../../../../../components/Button.tsx';
import { EntityImage } from '../../../../../../components/EntityImage.tsx';

const statusClasses: Record<string, string> = {
    [CustomerInvitationStatus.PENDING]: 'border-warning-border bg-warning-soft text-warning',
    [CustomerInvitationStatus.ACCEPTED]: 'border-success-border bg-success-soft text-success',
    [CustomerInvitationStatus.REJECTED]:
        'border-destructive-border bg-destructive-soft text-destructive',
    [CustomerInvitationStatus.CANCELLED]: 'border-border bg-muted text-muted-foreground',
    [CustomerInvitationStatus.EXPIRED]: 'border-border bg-muted text-muted-foreground',
};

interface InvitationCardProps {
    invitation: CustomerInvitationResponse;
    onRespond: (
        invitation: CustomerInvitationResponse,
        status: CustomerInvitationStatus,
    ) => void;
    isResponding: boolean;
}

export function InvitationCard({ invitation, onRespond, isResponding }: InvitationCardProps) {
    const isPending = invitation.status === CustomerInvitationStatus.PENDING;

    const senderName = [invitation.senderFirstName, invitation.senderLastName]
        .filter(Boolean)
        .join(' ');

    return (
        <article className="flex h-full min-w-0 flex-col rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <EntityImage
                        src={invitation.organizationProfilePicturePath}
                        alt={invitation.organizationName}
                        icon={Building2}
                        className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary text-muted-foreground"
                        iconClassName="size-5"
                    />

                    <div className="min-w-0">
                        <h3
                            className="truncate text-sm font-semibold text-foreground"
                            title={invitation.organizationName}
                        >
                            {invitation.organizationName}
                        </h3>

                        <div className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[10px] text-muted-foreground">
                            <Mail className="size-3 shrink-0" strokeWidth={1.8} />
                            <span className="truncate">{invitation.recipientEmail}</span>
                        </div>
                    </div>
                </div>

                <span
                    className={[
                        'inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-semibold',
                        statusClasses[invitation.status] ??
                            'border-border bg-secondary text-secondary-foreground',
                    ].join(' ')}
                >
                    {customerInvitationStatusRecord[invitation.status]}
                </span>
            </div>

            <div className="mt-3 flex flex-col gap-1.5 rounded-lg border border-border bg-muted/60 p-2.5 text-[10px] text-muted-foreground">
                <div className="flex min-w-0 items-center gap-1.5">
                    <UserRound className="size-3.5 shrink-0" strokeWidth={1.8} />
                    <span className="truncate">
                        Invited by {senderName || invitation.senderEmail}
                    </span>
                </div>

                <div className="flex min-w-0 items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-1.5">
                        <CalendarDays className="size-3.5 shrink-0" strokeWidth={1.8} />
                        <span className="truncate">
                            Received {new Date(invitation.createdAtUTC).toLocaleDateString()}
                        </span>
                    </span>

                    <span className="shrink-0 whitespace-nowrap">
                        Expires {new Date(invitation.expiresAtUTC).toLocaleDateString()}
                    </span>
                </div>
            </div>

            <div className="mt-auto flex items-center gap-2 pt-3">
                <Button
                    type="button"
                    disabled={!isPending || isResponding}
                    onClick={() => onRespond(invitation, CustomerInvitationStatus.ACCEPTED)}
                    className="inline-flex h-8 flex-1 items-center justify-center rounded-lg bg-primary px-3 text-[11px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Accept
                </Button>

                <Button
                    type="button"
                    disabled={!isPending || isResponding}
                    onClick={() => onRespond(invitation, CustomerInvitationStatus.REJECTED)}
                    className="inline-flex h-8 flex-1 items-center justify-center rounded-lg border border-destructive-border bg-transparent px-3 text-[11px] font-semibold text-destructive transition-colors hover:bg-destructive-soft disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Reject
                </Button>
            </div>
        </article>
    );
}
