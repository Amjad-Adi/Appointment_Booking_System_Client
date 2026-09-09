import type { ReactNode } from 'react';

import { PageSection } from './PageSection.tsx';

interface ManagementPageProps {
    title: string;
    description?: string[];
    children: ReactNode;
}

export function ManagementPage({ title, description = [], children }: ManagementPageProps) {
    return (
        <PageSection title={title} description={description}>
            {children}
        </PageSection>
    );
}
