import { useEffect, RefObject } from "react";

export const useClickOutside = (
    refs: RefObject<HTMLElement | null>[],
    callbacks: (() => void)[]
) => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            refs.forEach((ref, index) => {
                if (ref.current && !ref.current.contains(event.target as Node)) {
                    callbacks[index]?.();
                }
            });
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [refs, callbacks]);
};