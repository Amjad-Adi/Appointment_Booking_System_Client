import { useState } from 'react';

export function useDialog<T>() {
    const [selectedItem, setSelectedItem] = useState<T | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const open = (item: T) => {
        setSelectedItem(item);
        setIsOpen(true);
    };
    const close = () => {
        setIsOpen(false);
        setSelectedItem(null);
    };
    return { selectedItem, isOpen, open, close };
}
