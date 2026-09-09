import type { ReactNode } from 'react';

interface PageSectionProps {
    title: string;
    description?: string[];
    children: ReactNode;
}

export function PageSection({ title, description = [], children }: PageSectionProps) {
    return (
        <section className="mt-3 w-full min-w-0">
            <div className="mb-3 px-1 text-left">
                <h2 className="text-[15px] font-semibold tracking-tight text-[#343447]">{title}</h2>

                {description.map((line, index) => (
                    <p key={index} className="mt-0.5 text-[11px] leading-4 text-[#777789]">
                        {line}
                    </p>
                ))}
            </div>

            {children}
        </section>
    );
}
