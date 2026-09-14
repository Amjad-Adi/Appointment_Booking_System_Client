import type { ReactNode } from 'react';

import type { ServiceResponse } from '../../../../../../models/service.model.ts';

import { Grid } from '../../../../../../components/Grid.tsx';
import { DataViewToolbar } from '../../../../../../components/DataViewToolbar.tsx';
import { ServiceCard } from '../components/ServiceCard.tsx';

interface ServicesGridProps {
    services: ServiceResponse[];
    search: string;
    onSearchChange: (value: string) => void;
    filters?: ReactNode;
    actions?: ReactNode;
    canEdit?: boolean;
    onEdit?: (service: ServiceResponse) => void;
}

export function ServicesGrid({
    services,
    search,
    onSearchChange,
    filters,
    actions,
    canEdit = false,
    onEdit,
}: ServicesGridProps) {
    return (
        <div className="w-full min-w-0">
            <DataViewToolbar
                search={search}
                onSearchChange={onSearchChange}
                filters={filters}
                actions={actions}
            />

            <div className="border-x border-b border-[#dedee8] bg-[#f5f5f8] p-2 sm:p-3">
                <Grid
                    items={services}
                    getKey={(service) => service.uuid}
                    emptyTitle="No services found"
                    emptyDescription="Try changing your search or filters."
                    renderItem={(service) => (
                        <ServiceCard service={service} canEdit={canEdit} onEdit={onEdit} />
                    )}
                />
            </div>
        </div>
    );
}
