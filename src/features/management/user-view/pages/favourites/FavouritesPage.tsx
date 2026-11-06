import { useState } from 'react';
import { type PaginationState } from '@tanstack/react-table';

import { ManagementPage } from '../../../components/ManagementPage.tsx';
import { BoardView } from '../../../../../components/BoardView.tsx';
import { ErrorState } from '../../../../../components/ErrorState.tsx';
import { PAGE_SIZE } from '../../../../../components/DataTableFeatures.ts';

import { useFavourites } from '../../../hooks/favourite-hook.ts';

import type { FavouriteServiceResponse } from '../../../../../models/favourite.model.ts';

import { FavouriteServiceCard } from './components/FavouriteServiceCard.tsx';

export function FavouritesPage() {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: PAGE_SIZE,
    });
    const [search, setSearch] = useState('');

    const { data, isLoading, isError, error, refetch } = useFavourites({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: search || undefined,
    });

    const resetPage = () => {
        setPagination((previous) => ({ ...previous, pageIndex: 0 }));
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        resetPage();
    };

    if (isError) {
        return (
            <ManagementPage
                title="Favourites"
                description={['Services you saved for later. Book them in a single click.']}
            >
                <ErrorState
                    error={error}
                    title="Failed to load favourites"
                    onRetry={() => refetch()}
                />
            </ManagementPage>
        );
    }

    return (
        <ManagementPage
            title="Favourites"
            description={['Services you saved for later. Book them in a single click.']}
        >
            <BoardView<FavouriteServiceResponse>
                items={data?.data ?? []}
                getKey={(favourite) => favourite.uuid}
                renderItem={(favourite) => <FavouriteServiceCard favourite={favourite} />}
                search={search}
                onSearchChange={handleSearchChange}
                pagination={pagination}
                onPaginationChange={setPagination}
                rowCount={data?.pagination?.totalItems ?? 0}
                rowCountLabel={`${data?.pagination?.totalItems === 0 ? 'No' : (data?.pagination?.totalItems ?? 0)} Favourites`}
                isLoading={isLoading}
                emptyTitle="No favourites yet"
                emptyDescription="Save services you like to find them here."
            />
        </ManagementPage>
    );
}
