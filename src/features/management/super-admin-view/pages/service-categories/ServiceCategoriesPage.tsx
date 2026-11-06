import { useMemo, useState } from 'react';
import { type PaginationState, type SortingState } from '@tanstack/react-table';
import { Pencil, Plus, Tags } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

import { ManagementPage } from '../../../components/ManagementPage.tsx';
import { DataTable } from '../../../../../components/DataTable.tsx';
import { ErrorState } from '../../../../../components/ErrorState.tsx';
import { PAGE_SIZE, type DataTableColumn } from '../../../../../components/DataTableFeatures.ts';
import { Button } from '../../../../../components/Button.tsx';
import { Select } from '../../../../../components/Select.tsx';
import { ImagePicker } from '../../../../../components/ImagePicker.tsx';
import { EntityImage } from '../../../../../components/EntityImage.tsx';
import {
    CreateDialog,
    type CreateDialogField,
} from '../../../../../components/CreateDialog.tsx';

import { useCreateServiceCategory, useServiceCategories, useUpdateServiceCategory } from '../../../hooks/service-categories-hook.ts';

import { ActivationStatus } from '../../../../../models/enums/activation-status.ts';
import { activationStatusRecord } from '../../../../../models/enums-mapping/activation-status.ts';
import { Order } from '../../../../../models/enums/order.ts';
import type { ServiceCategoryResponse } from '../../../../../models/service-category.model.ts';

import { getApiErrorMessage } from '../../../../../utlis/api-error.ts';

const createCategoryFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, { error: 'Name is required' })
        .max(256, { error: 'Name must be at most 256 characters' }),
    description: z
        .string()
        .trim()
        .max(4096, { error: 'Description must be at most 4096 characters' })
        .optional(),
});

const updateCategoryFormSchema = createCategoryFormSchema.extend({
    status: z.enum(ActivationStatus),
});

type CreateCategoryForm = z.infer<typeof createCategoryFormSchema>;
type UpdateCategoryForm = z.infer<typeof updateCategoryFormSchema>;

export function ServiceCategoriesPage() {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: PAGE_SIZE,
    });
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<ActivationStatus | undefined>();

    const [createOpen, setCreateOpen] = useState(false);
    const [editing, setEditing] = useState<ServiceCategoryResponse | undefined>();
    const [createPicture, setCreatePicture] = useState<File | null>(null);
    const [editPicture, setEditPicture] = useState<File | null>(null);

    const createMutation = useCreateServiceCategory();
    const updateMutation = useUpdateServiceCategory();

    const sort = sorting[0];
    const sortBy: 'name' | 'createdAtUTC' | 'updatedAtUTC' | undefined = sort
        ? sort.id === 'createdAtUTC'
            ? 'createdAtUTC'
            : sort.id === 'updatedAtUTC'
              ? 'updatedAtUTC'
              : 'name'
        : undefined;

    const { data, isLoading, isError, error, refetch } = useServiceCategories({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sortBy,
        order: sort ? (sort.desc ? Order.DESC : Order.ASC) : undefined,
        search: search || undefined,
        filter: status ? { status } : undefined,
    });

    const resetPage = () =>
        setPagination((previous) => ({
            ...previous,
            pageIndex: 0,
        }));

    const columns = useMemo<DataTableColumn<ServiceCategoryResponse>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                cell: ({ row }) => (
                    <div className="flex min-w-0 items-center gap-2">
                        <EntityImage
                            src={row.original.picturePath}
                            alt={row.original.name}
                            icon={Tags}
                            className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-secondary text-muted-foreground"
                            iconClassName="size-4"
                        />

                        <span className="max-w-56 truncate font-medium text-foreground">
                            {row.original.name}
                        </span>
                    </div>
                ),
            },
            {
                accessorKey: 'description',
                header: 'Description',
                enableSorting: false,
                cell: ({ row }) => (
                    <span className="block max-w-80 truncate text-muted-foreground">
                        {row.original.description || '—'}
                    </span>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                enableSorting: false,
                cell: ({ row }) => (
                    <span
                        className={[
                            'inline-flex rounded-full border px-2 py-0.5 text-[9px] font-semibold',
                            row.original.status === ActivationStatus.ACTIVE
                                ? 'border-success-border bg-success-soft text-success'
                                : 'border-destructive-border bg-destructive-soft text-destructive',
                        ].join(' ')}
                    >
                        {activationStatusRecord[row.original.status]}
                    </span>
                ),
            },
            {
                id: 'createdAtUTC',
                accessorKey: 'createdAtUTC',
                header: 'Created At',
                cell: ({ row }) => new Date(row.original.createdAtUTC).toLocaleDateString(),
            },
            {
                id: 'actions',
                header: 'Actions',
                enableSorting: false,
                cell: ({ row }) => (
                    <Button
                        type="button"
                        onClick={() => setEditing(row.original)}
                        className="ml-auto flex size-7 min-h-0 min-w-0 items-center justify-center border border-transparent bg-transparent p-0 text-muted-foreground hover:bg-secondary hover:text-foreground sm:h-7 sm:w-7 sm:px-0"
                    >
                        <Pencil className="size-3.5" strokeWidth={1.8} />
                        <span className="sr-only">Edit category</span>
                    </Button>
                ),
            },
        ],
        [],
    );

    const filters = (
        <Select
            label="Status"
            isLabelDisabled
            value={status ?? ''}
            onChange={(event) => {
                const value = event.target.value;
                setStatus(value === '' ? undefined : (value as ActivationStatus));
                resetPage();
            }}
            wrapperClassName="w-36 max-sm:w-[48%] max-[350px]:w-full"
            className="!h-8 px-2 text-[11px]"
        >
            <option value="">All statuses</option>
            {Object.values(ActivationStatus).map((value) => (
                <option key={value} value={value}>
                    {activationStatusRecord[value]}
                </option>
            ))}
        </Select>
    );

    const actions = (
        <Button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="flex h-8 min-h-0 w-auto shrink-0 items-center gap-1.5 px-3 text-[11px]"
        >
            <Plus className="size-3.5" strokeWidth={2} />
            Add Category
        </Button>
    );

    async function handleCreate(values: CreateCategoryForm) {
        try {
            await toast.promise(
                createMutation.mutateAsync({
                    name: values.name,
                    description: values.description || undefined,
                    picture: createPicture,
                }),
                {
                    loading: 'Creating category...',
                    success: 'Service category created',
                    error: (mutationError) =>
                        getApiErrorMessage(mutationError, 'Failed to create service category'),
                },
            );
            setCreateOpen(false);
            setCreatePicture(null);
        } catch {
            // Error is surfaced by toast.promise.
        }
    }

    async function handleUpdate(values: UpdateCategoryForm) {
        if (!editing) {
            return;
        }

        try {
            await toast.promise(
                updateMutation.mutateAsync({
                    uuid: editing.uuid,
                    name: values.name,
                    description: values.description || undefined,
                    status: values.status,
                    picture: editPicture,
                }),
                {
                    loading: 'Updating category...',
                    success: 'Service category updated',
                    error: (mutationError) =>
                        getApiErrorMessage(mutationError, 'Failed to update service category'),
                },
            );
            setEditing(undefined);
            setEditPicture(null);
        } catch {
            // Error is surfaced by toast.promise.
        }
    }

    const createFields: CreateDialogField<CreateCategoryForm>[] = [
        {
            name: 'name',
            label: 'Name',
            type: 'text',
            placeholder: 'Category name',
        },
        {
            name: 'description',
            label: 'Description',
            type: 'custom',
            render: (form) => (
                <div className="flex flex-col">
                    <label
                        htmlFor="category_description"
                        className="mb-1.5 text-[11px] font-medium text-foreground"
                    >
                        Description
                    </label>
                    <textarea
                        id="category_description"
                        rows={3}
                        placeholder="Optional description"
                        className="w-full resize-y rounded-lg border border-border bg-card p-2.5 text-[11px] text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
                        {...form.register('description')}
                    />
                </div>
            ),
        },
    ];

    const editFields: CreateDialogField<UpdateCategoryForm>[] = [
        ...(createFields as unknown as CreateDialogField<UpdateCategoryForm>[]),
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            options: Object.values(ActivationStatus).map((value) => ({
                value,
                label: activationStatusRecord[value],
            })),
            placeholder: 'Select status',
        },
    ];

    if (isError) {
        return (
            <ManagementPage
                title="Service Categories"
                description={['Create and maintain the categories used to organize services.']}
            >
                <ErrorState
                    error={error}
                    title="Failed to load service categories"
                    onRetry={() => refetch()}
                />
            </ManagementPage>
        );
    }

    return (
        <ManagementPage
            title="Service Categories"
            description={['Create and maintain the categories used to organize services.']}
        >
            <DataTable
                tableKey="service-categories-table"
                data={data?.data ?? []}
                columns={columns}
                sorting={sorting}
                onSortingChange={setSorting}
                pagination={pagination}
                onPaginationChange={setPagination}
                search={search}
                onSearchChange={(value) => {
                    setSearch(value);
                    resetPage();
                }}
                filters={filters}
                actions={actions}
                rowCount={data?.pagination?.totalItems ?? 0}
                rowCountLabel={`${
                    data?.pagination?.totalItems === 0
                        ? 'No'
                        : (data?.pagination?.totalItems ?? 0)
                } Service Categories`}
                isLoading={isLoading}
                emptyMessage="No service categories match the current filters."
            />

            <CreateDialog<CreateCategoryForm>
                key={`create-category-${createOpen}`}
                open={createOpen}
                onOpenChange={(open) => {
                    setCreateOpen(open);
                    if (!open) {
                        setCreatePicture(null);
                    }
                }}
                title="Create Service Category"
                description="Add a category that services can be grouped under."
                topContent={
                    <div className="mb-4">
                        <ImagePicker
                            file={createPicture}
                            onChange={setCreatePicture}
                            label="Category Picture"
                        />
                    </div>
                }
                resolver={zodResolver(createCategoryFormSchema)}
                defaultValues={{ name: '', description: '' }}
                fields={createFields}
                submitLabel="Create Category"
                onSubmit={handleCreate}
            />

            <CreateDialog<UpdateCategoryForm>
                key={`edit-category-${editing?.uuid ?? 'none'}`}
                open={Boolean(editing)}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditing(undefined);
                        setEditPicture(null);
                    }
                }}
                title="Edit Service Category"
                description="Update the category details and availability."
                topContent={
                    <div className="mb-4">
                        <ImagePicker
                            file={editPicture}
                            onChange={setEditPicture}
                            currentPath={editing?.picturePath}
                            label="Category Picture"
                        />
                    </div>
                }
                resolver={zodResolver(updateCategoryFormSchema)}
                defaultValues={{
                    name: editing?.name ?? '',
                    description: editing?.description ?? '',
                    status: editing?.status ?? ActivationStatus.ACTIVE,
                }}
                fields={editFields}
                submitLabel="Save Changes"
                onSubmit={handleUpdate}
            />
        </ManagementPage>
    );
}
