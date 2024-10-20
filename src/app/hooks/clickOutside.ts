import { useEffect, useRef } from "react";

// Handles the click outside of the assigned element ref.
export default function useClickOutsideHandler<T extends Element>(
    handler: () => void
) {
    const elementRef = useRef<T>(null);

    useEffect(() => {
        if (!elementRef.current || !handler) return;

        const handleOutsideClick = (event: MouseEvent) => {
            if (!elementRef.current?.contains(event.target as Node)) {
                handler?.();
            }
        };

        window.addEventListener("mousedown", handleOutsideClick);

        return () => {
            window.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [elementRef, handler]);

    return {
        elementRef,
    };
}
