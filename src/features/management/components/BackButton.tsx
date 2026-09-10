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
            className="group flex h-8 w-auto shrink-0 items-center justify-center gap-1.5 border border-[#d3d3df] bg-transparent px-3 text-[11px] font-semibold text-[#454556] hover:bg-[#ededf2] hover:text-[#343447]"
        >
            <ArrowLeft className="size-3.5 transition-colors group-hover:text-[#343447]" />
            Back
        </Button>
    );
}
