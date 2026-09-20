import { useNavigate, useSearchParams } from 'react-router';
import { usePublicInvitation, useAcceptInvitation } from '../../hooks/invitation-hook.ts';
import { useCurrentUser } from '../../hooks/users-hook.ts';
import { Button } from '../../../../components/Button.tsx';
import toast from 'react-hot-toast';
import { Building2, Calendar, Mail, AlertCircle } from 'lucide-react';
import { InvitationStatus } from '../../../../models/enums/invitation-status.ts';

export function AcceptInvitationPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';
    const navigate = useNavigate();

    const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
    const { data: invitation, isLoading, isError, error } = usePublicInvitation(token);
    const acceptMutation = useAcceptInvitation();

    if (!token) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f5f5f8] p-4">
                <div className="w-full max-w-md rounded-xl border border-[#d3d3df] bg-white p-6 text-center shadow-xl">
                    <AlertCircle className="mx-auto mb-4 size-10 text-[#c94a5c]" />
                    <h1 className="mb-2 text-lg font-semibold text-[#343447]">Invalid Link</h1>
                    <p className="text-[13px] text-[#777789]">
                        No invitation token was provided in the URL.
                    </p>
                    <Button onClick={() => navigate('/')} className="mt-6 h-10 w-full text-[13px]">
                        Return to Home
                    </Button>
                </div>
            </div>
        );
    }

    if (isLoading || isUserLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f5f5f8]">
                <p className="text-[11px] text-[#777789]">Verifying invitation link...</p>
            </div>
        );
    }

    if (isError || !invitation || invitation.status !== InvitationStatus.PENDING) {
        const errorMsg =
            (error as any)?.response?.data?.message || 'This invitation is invalid or has expired.';
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f5f5f8] p-4">
                <div className="w-full max-w-md rounded-xl border border-[#d3d3df] bg-white p-6 text-center shadow-xl">
                    <AlertCircle className="mx-auto mb-4 size-10 text-[#c94a5c]" />
                    <h1 className="mb-2 text-lg font-semibold text-[#343447]">
                        Invitation Unavailable
                    </h1>
                    <p className="text-[13px] text-[#777789]">{errorMsg}</p>
                    <Button onClick={() => navigate('/')} className="mt-6 h-10 w-full text-[13px]">
                        Return to Home
                    </Button>
                </div>
            </div>
        );
    }

    const handleAccept = async () => {
        if (!currentUser) {
            const returnUrl = encodeURIComponent(`/invitations/accept?token=${token}`);
            navigate(`/login?returnTo=${returnUrl}`);
            return;
        }

        try {
            await toast.promise(acceptMutation.mutateAsync(token), {
                loading: 'Accepting invitation...',
                success: 'Welcome to the organization!',
                error: (err: any) => err?.response?.data?.message || 'Failed to accept invitation.',
            });
            navigate(`/admin/organizations/${invitation.organizationUuid}`);
        } catch (e) {
            // Handled by toast.promise
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f5f5f8] p-4">
            <div className="w-full max-w-md rounded-xl border border-[#d3d3df] bg-white p-6 shadow-xl">
                <div className="mb-6 text-center">
                    <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[#ededf2]">
                        <Building2 className="size-6 text-[#343447]" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-[#343447]">
                        Join {invitation.organizationName || 'Organization'}
                    </h1>
                    <p className="mt-1 text-[13px] text-[#777789]">
                        You've been invited to collaborate.
                    </p>
                </div>

                <div className="mb-6 rounded-lg border border-[#d3d3df] bg-[#f5f5f8] p-4">
                    <ul className="flex flex-col gap-3 text-[12px] text-[#343447]">
                        <li className="flex items-center gap-3">
                            <Mail className="size-4 text-[#777789]" />
                            <span className="font-medium">{invitation.recipientEmail}</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="flex size-4 items-center justify-center rounded-full border border-[#777789] text-[8px] font-bold text-[#777789]">
                                R
                            </div>
                            <span>
                                Role: <strong className="font-medium">{invitation.role}</strong>
                            </span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Calendar className="size-4 text-[#777789]" />
                            <span>
                                Expires: {new Date(invitation.expiresAtUTC).toLocaleDateString()}
                            </span>
                        </li>
                    </ul>
                </div>

                {!currentUser && (
                    <div className="mb-4 rounded-md border border-blue-100 bg-blue-50 p-3 text-[11px] text-blue-700">
                        You must log in or create an account with{' '}
                        <strong>{invitation.recipientEmail}</strong> to accept this invitation.
                    </div>
                )}

                <Button
                    onClick={handleAccept}
                    disabled={acceptMutation.isPending}
                    className="h-10 w-full text-[13px] font-semibold"
                >
                    {currentUser ? 'Accept Invitation' : 'Log In or Sign Up to Accept'}
                </Button>
            </div>
        </div>
    );
}
