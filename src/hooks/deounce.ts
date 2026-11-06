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

/*
 * Query hooks receive their filters from render state, so the search term is
 * debounced here once instead of in every page that calls a hook.
 */
export function useDebouncedQuery<T extends { search?: string }>(
    query: T,
    delay: number = GENERAL_DEBOUNCE_DELAY,
): T {
    const debouncedSearch = useDebounce(query.search, delay);

    if (debouncedSearch === query.search) {
        return query;
    }

    return { ...query, search: debouncedSearch } as T;
}
