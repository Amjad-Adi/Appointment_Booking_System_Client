// 1. Add = void here
import { useState } from 'react';

export function useDialog<T = void>() {
    const [selectedItem, setSelectedItem] = useState<T | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const open = (item?: T) => {
        setSelectedItem(item ?? null);
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
        setSelectedItem(null);
    };

    return { selectedItem, isOpen, open, close };
}
