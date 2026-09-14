import { LayoutGrid, Table2 } from 'lucide-react';

import {
    ViewSwitcher,
    type ViewOption,
} from '../../../../../../components/ViewSwitcher.tsx';

import { ViewMode } from '../../../../../../models/enums/ViewMode.ts';
import { viewModeRecord } from '../../../../../../models/enums-mapping/ViewMode.ts';

interface RoomViewSwitcherProps {
    value: ViewMode;
    onChange: (value: ViewMode) => void;
}

const viewOptions: ViewOption<ViewMode>[] = [
    {
        value: ViewMode.TABLE,
        label: viewModeRecord[ViewMode.TABLE],
        icon: Table2,
    },
    {
        value: ViewMode.GRID,
        label: viewModeRecord[ViewMode.GRID],
        icon: LayoutGrid,
    },
];

export function RoomViewSwitcher({
                                     value,
                                     onChange,
                                 }: RoomViewSwitcherProps) {
    return (
        <ViewSwitcher
            value={value}
    options={viewOptions}
    onChange={onChange}
    />
);
}