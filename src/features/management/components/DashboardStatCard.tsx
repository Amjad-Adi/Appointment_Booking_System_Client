import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router';

type DashboardAccent = 'default' | 'success' | 'warning' | 'danger';

interface DashboardStatCardProps {
    label: string;
    value: number | string;
    hint?: string;
    icon: LucideIcon;
    to?: string;
    accent?: DashboardAccent;
}

const accentClasses: Record<DashboardAccent, { icon: string; value: string }> = {
    default: {
        icon: 'border-border bg-secondary text-secondary-foreground',
        value: 'text-foreground',
    },
    success: {
        icon: 'border-success-border bg-success-soft text-success',
        value: 'text-success',
    },
    warning: {
        icon: 'border-warning-border bg-warning-soft text-warning',
        value: 'text-warning',
    },
    danger: {
        icon: 'border-destructive-border bg-destructive-soft text-destructive',
        value: 'text-destructive',
    },
};

export function DashboardStatCard({
    label,
    value,
    hint,
    icon: Icon,
    to,
    accent = 'default',
}: DashboardStatCardProps) {
    const classes = accentClasses[accent];

    const content = (
        <div className="flex h-full min-w-0 items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-border-strong">
            <div
                className={[
                    'flex size-10 shrink-0 items-center justify-center rounded-lg border',
                    classes.icon,
                ].join(' ')}
            >
                <Icon className="size-4.5" strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
                <p className={['text-xl font-semibold leading-none', classes.value].join(' ')}>
                    {value}
                </p>

                <p className="mt-1 truncate text-[11px] font-medium text-foreground">{label}</p>

                {hint ? (
                    <p className="mt-0.5 truncate text-[9px] text-muted-foreground">{hint}</p>
                ) : null}
            </div>
        </div>
    );

    if (!to) {
        return content;
    }

    return (
        <Link to={to} className="block h-full min-w-0">
            {content}
        </Link>
    );
}
