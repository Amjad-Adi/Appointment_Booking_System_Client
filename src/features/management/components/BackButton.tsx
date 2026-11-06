import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Button } from '../../../components/Button.tsx';

interface BackButtonProps {
    backPath: string;
}

export function BackButton({ backPath }: BackButtonProps) {
    const navigate = useNavigate();

    return (
        <Button
            type="button"
            onClick={() => navigate(backPath)}
            className="group mt-5 flex h-8 w-auto shrink-0 items-center justify-center gap-1.5 border border-border bg-transparent px-3 text-[11px] font-semibold text-secondary-foreground hover:bg-secondary hover:text-foreground"
        >
            <ArrowLeft className="size-3.5 transition-colors group-hover:text-foreground" />
            Back
        </Button>
    );
}
