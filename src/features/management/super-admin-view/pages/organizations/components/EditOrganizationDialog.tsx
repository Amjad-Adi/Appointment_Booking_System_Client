import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { TextField } from '../../../../../../components/TextField.tsx';
import { Select } from '../../../../../../components/Select.tsx';
import { Button } from '../../../../../../components/Button.tsx';
import { Label } from '../../../../../../components/Label.tsx';

import { useUpdateOrganization } from '../../../../hooks/orgsnization-hook.ts'
import { updateOrganizationByAdminSchema } from '../../../../../../zod-schemas/organization.schema.ts';

import { ActivationStatus } from '../../../../../../models/enums/activation-status.ts';

import type {
    OrganizationResponse,
    UpdateUserByAdminForm,
} from '../../../../../../models/organization.model.ts';

import toast from 'react-hot-toast';
import { Toast } from '../../../../../../utlis/toast.ts';

interface EditOrganizationDialogProps {
    organization: OrganizationResponse;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const loading = 'Updating organization...';
const success = 'Organization updated successfully';
const error = 'Failed to update organization';

export function EditOrganizationDialog({
    organization,
    open,
    onOpenChange,
}: EditOrganizationDialogProps) {
    const updateOrganizationMutation = useUpdateOrganization();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, dirtyFields },
    } = useForm<UpdateUserByAdminForm>({
        resolver: zodResolver(updateOrganizationByAdminSchema),
        defaultValues: {
            status: organization.status,
        },
    });

    useEffect(() => {
        reset({
            status: organization.status,
        });
    }, [organization.status, reset]);

    const onSubmit = async (data: UpdateUserByAdminForm) => {
        const changedData: Partial<UpdateUserByAdminForm> = {};

        if (dirtyFields.status) {
            changedData.status = data.status;
        }

        if (Object.keys(changedData).length === 0) {
            onOpenChange(false);
            return;
        }

        await toast.promise(
            updateOrganizationMutation.mutateAsync(
                {
                    uuid: organization.uuid,
                    ...changedData,
                },
                {
                    onSuccess: () => {
                        onOpenChange(false);
                    },
                },
            ),
            new Toast(loading, success, error),
        );
    };

    const handleCancel = () => {
        reset({
            status: organization.status,
        });

        onOpenChange(false);
    };

    if (!open) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-2 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-4 backdrop-blur-[2px] sm:py-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-organization-title"
        >
            <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-xl border border-[#d3d3df] bg-[#f5f5f8] shadow-2xl">
                <div className="shrink-0 border-b border-[#d3d3df] px-5 py-4 sm:px-6">
                    <h2
                        id="edit-organization-title"
                        className="text-[15px] font-semibold tracking-tight text-[#343447]"
                    >
                        Edit Organization
                    </h2>

                    <p className="mt-0.5 text-[11px] leading-4 text-[#777789]">
                        Update the organization's activation status.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex min-h-0 flex-col overflow-y-auto px-5 py-4 sm:px-6 sm:py-5"
                >
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <TextField
                            label="Name"
                            id="name"
                            value={organization.name}
                            disabled
                        />

                        <TextField
                            label="Email"
                            id="email"
                            type="email"
                            value={organization.email}
                            disabled
                        />

                        <TextField
                            label="Phone Number"
                            id="phoneNumber"
                            value={organization.phoneNumber}
                            disabled
                        />

                        <div className="w-full">
                            <Label htmlFor="status">
                                Status
                            </Label>

                            <Select
                                id="status"
                                hasError={!!errors.status}
                                {...register('status')}
                                className="h-8 px-2.5 text-[11px] sm:h-8 sm:px-2.5 sm:text-[11px] md:h-8 md:text-[11px]"
                            >
                                <option value="">
                                    Select status
                                </option>

                                {Object.values(ActivationStatus).map(
                                    (status) => (
                                        <option
                                            key={status}
                                            value={status}
                                        >
                                            {status}
                                        </option>
                                    ),
                                )}
                            </Select>
                        </div>

                        {updateOrganizationMutation.isError && (
                            <p className="w-full pt-1 text-center text-[10px] leading-4 text-[#c94a5c]">
                                Failed to update organization.
                                Please try again.
                            </p>
                        )}
                    </div>

                    <div className="mt-3 flex shrink-0 flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <div className="group sm:w-auto">
                            <Button
                                type="button"
                                onClick={handleCancel}
                                disabled={
                                    updateOrganizationMutation.isPending
                                }
                                className="h-8 w-full border border-[#d3d3df] bg-transparent px-3 text-[11px] font-semibold text-[#454556] hover:bg-[#ededf2] hover:text-[#343447] sm:h-8 sm:w-auto sm:px-3 sm:text-[11px] md:h-8 md:w-auto md:px-3 md:text-[11px]"
                            >
                                Cancel
                            </Button>
                        </div>

                        <div className="group sm:w-auto">
                            <Button
                                type="submit"
                                disabled={
                                    updateOrganizationMutation.isPending
                                }
                                className="h-8 w-full px-3 text-[11px] font-semibold sm:h-8 sm:w-auto sm:px-3 sm:text-[11px] md:h-8 md:w-auto md:px-3 md:text-[11px]"
                            >
                                Apply Changes
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
