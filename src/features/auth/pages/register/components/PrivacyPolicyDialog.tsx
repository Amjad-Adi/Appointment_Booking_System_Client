import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ShieldCheck, X } from 'lucide-react';

interface PrivacyPolicyDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const sections = [
    {
        title: 'What information do we collect?',
        body: 'When you create an account, we collect your name, email address, preferred language, and account role. When you use the platform, we also store information about your appointments, selected services, assigned workers, rooms, and associated organizations.',
    },
    {
        title: 'How do we use your information?',
        body: 'Your information helps us manage your account, display relevant appointments and schedules, send booking invitations and notifications, and keep the platform reliable. We never sell your personal data.',
    },
    {
        title: 'Who can see your information?',
        body: 'Relevant booking information is shared with the organization providing the service. For example, an assigned worker may need your booking details to prepare for your appointment. Organization members can only access information required for their responsibilities, based on their assigned roles and permissions.',
    },
    {
        title: 'How do we protect your data?',
        body: 'We use security measures to protect your information, including securely hashed passwords, authenticated sessions, and role-based permissions that restrict access to authorized records.',
    },
    {
        title: 'You are in control',
        body: 'You can update your profile and personal settings at any time, manage your appointments, and request account deletion. Some records, such as completed appointments, may need to be retained for organizational or record-keeping purposes.',
    },
];

export function PrivacyPolicyDialog({ open, onOpenChange }: PrivacyPolicyDialogProps) {
    useEffect(() => {
        if (!open) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onOpenChange(false);
            }
        };

        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, onOpenChange]);

    if (!open) {
        return null;
    }

    return createPortal(
        <div
            className="bg-overlay/70 fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto px-4 py-4 backdrop-blur-[2px] sm:py-8"
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    onOpenChange(false);
                }
            }}
        >
            <div
                className="border-border bg-card flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-xl border shadow-2xl sm:max-h-[calc(100dvh-4rem)]"
                role="dialog"
                aria-modal="true"
                aria-labelledby="privacy-policy-title"
                aria-describedby="privacy-policy-description"
            >
                {/* Header */}
                <div className="border-border flex shrink-0 items-start gap-3 border-b px-5 py-4 sm:px-6">
                    <div className="bg-secondary flex size-9 shrink-0 items-center justify-center rounded-lg">
                        <ShieldCheck
                            className="text-secondary-foreground size-4"
                            strokeWidth={1.8}
                        />
                    </div>

                    <div className="min-w-0 flex-1">
                        <h2
                            id="privacy-policy-title"
                            className="text-foreground text-sm font-semibold tracking-tight"
                        >
                            Your Privacy Matters
                        </h2>

                        <p
                            id="privacy-policy-description"
                            className="text-muted-foreground mt-1 text-xs leading-relaxed"
                        >
                            Learn how we collect, use, and protect your information.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        aria-label="Close privacy policy"
                        className="text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:ring-ring flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    >
                        <X className="size-4" strokeWidth={2} />
                    </button>
                </div>

                {/* Content */}
                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                    <div className="flex flex-col gap-5">
                        {sections.map((section, index) => (
                            <section key={section.title}>
                                <div className="flex items-start gap-2">
                                    <span className="bg-secondary text-secondary-foreground mt-px flex size-5 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold">
                                        {index + 1}
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-foreground text-[13px] font-semibold">
                                            {section.title}
                                        </h3>

                                        <p className="text-muted-foreground mt-1.5 text-xs leading-[1.7]">
                                            {section.body}
                                        </p>
                                    </div>
                                </div>
                            </section>
                        ))}
                    </div>

                    {/* Privacy reassurance */}
                    <div className="border-border bg-secondary/40 mt-6 flex items-start gap-2.5 rounded-lg border p-3">
                        <ShieldCheck className="text-muted-foreground mt-0.5 size-4 shrink-0" />

                        <p className="text-muted-foreground text-xs leading-relaxed">
                            Your personal data is never sold. Your information is used only to
                            support your account and the services provided through the platform.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-border flex shrink-0 items-center justify-between gap-3 border-t px-5 py-3 sm:px-6">
                    <span className="text-muted-foreground text-[10px]">Privacy Policy</span>

                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring flex h-9 cursor-pointer items-center justify-center rounded-lg px-5 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
}
