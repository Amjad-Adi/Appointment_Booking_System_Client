import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
export const GENERAL_DEBOUNCE_DELAY = 300;
export function useDebounce<T>(value: T, delay: number): T {
    const [debounce, setDebounce] = useState<T>(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounce(value), delay);
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);
    return debounce;
}
