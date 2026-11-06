import type { ReactNode } from 'react';
import type { OnChangeFn, PaginationState } from '@tanstack/react-table';

import type { ServiceResponse } from '../../../../../../models/service.model.ts';

import { BoardView } from '../../../../../../components/BoardView.tsx';
import { ServiceCard } from '../components/ServiceCard.tsx';

interface ServicesGridProps {
    services: ServiceResponse[];
    search: string;
    onSearchChange: (value: string) => void;
    filters?: ReactNode;
    actions?: ReactNode;
    pagination: PaginationState;
    onPaginationChange: OnChangeFn<PaginationState>;
    rowCount: number;
    rowCountLabel: string;
    isLoading?: boolean;
    canEdit?: boolean;
    canBook?: boolean;
    canFavourite?: boolean;
    onEdit?: (service: ServiceResponse) => void;
}

export function ServicesGrid({
    services,
    search,
    onSearchChange,
    filters,
    actions,
    pagination,
    onPaginationChange,
    rowCount,
    rowCountLabel,
    isLoading = false,
    canEdit = false,
    canBook = false,
    canFavourite = false,
    onEdit,
}: ServicesGridProps) {
    return (
        <BoardView<ServiceResponse>
            items={services}
            getKey={(service) => service.uuid}
            renderItem={(service) => (
                <ServiceCard
                    service={service}
                    canEdit={canEdit}
                    canBook={canBook}
                    canFavourite={canFavourite}
                    onEdit={onEdit}
                />
            )}
            search={search}
            onSearchChange={onSearchChange}
            filters={filters}
            actions={actions}
            pagination={pagination}
            onPaginationChange={onPaginationChange}
            rowCount={rowCount}
            rowCountLabel={rowCountLabel}
            isLoading={isLoading}
            emptyTitle="No services found"
            emptyDescription="Try changing your search or filters."
        />
    );
}
