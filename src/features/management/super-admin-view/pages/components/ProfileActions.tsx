import { Pencil } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Button } from '../../../../../components/Button.tsx';

interface ProfileActionsProps {
    editPath?: string;
}

export function ProfileActions({ editPath }: ProfileActionsProps) {
    const navigate = useNavigate();

    return (
        <div className="flex min-w-0 items-center justify-end gap-3">
            {editPath && (
                <Button
                    type="button"
                    onClick={() => navigate(editPath)}
                    className="group flex h-8 w-auto shrink-0 items-center justify-center gap-1.5 border border-[#d3d3df] bg-transparent px-3 text-[11px] font-semibold text-[#454556] hover:bg-[#ededf2] hover:text-[#343447]"
                >
                    <Pencil className="size-3.5 transition-colors group-hover:text-[#343447]" />
                    Edit
                </Button>
            )}
        </div>
    );
}
