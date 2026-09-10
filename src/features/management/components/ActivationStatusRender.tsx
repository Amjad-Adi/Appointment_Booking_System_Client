import type { OrganizationResponse } from '../../../models/organization.model.ts';
import { useNavigate } from 'react-router';
import { ActivationStatus } from '../../../models/enums/activation-status.ts';

export function ActivationStatusRender({ status }: { status: ActivationStatus }) {
    const isActive = status === ActivationStatus.ACTIVE;
    return (
        <div className="justify-left flex items-center">
            <span className="relative size-2.5">
                {isActive && (
                    <span className="absolute inset-0 size-2.5 rounded-full bg-emerald-500 opacity-15" />
                )}

                <span
                    className={`absolute inset-0 size-2.5 rounded-full ${
                        isActive ? 'bg-emerald-500' : 'bg-red-400'
                    }`}
                />
            </span>
        </div>
    );
}
