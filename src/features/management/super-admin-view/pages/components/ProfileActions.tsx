import { Pencil } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Button } from '../../../../../components/Button.tsx';

interface ProfileActionsProps {
    editPath?: string;
    onEdit?: () => void;
}

export function ProfileActions({ editPath, onEdit }: ProfileActionsProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onEdit) {
            onEdit();
            return;
        }

        if (editPath) {
            navigate(editPath);
        }
    };

    if (!editPath && !onEdit) {
        return null;
    }

    return (
        <div className="flex min-w-0 items-center justify-end gap-3">
            <Button
                type="button"
                onClick={handleClick}
                className="group flex h-8 w-auto shrink-0 items-center justify-center gap-1.5 border border-border bg-transparent px-3 text-[11px] font-semibold text-secondary-foreground hover:bg-secondary hover:text-foreground"
            >
                <Pencil className="size-3.5 transition-colors group-hover:text-foreground" />
                Edit
            </Button>
        </div>
    );
}
