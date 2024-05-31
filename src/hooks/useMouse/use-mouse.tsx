"use client";
import { useEffect, useRef, useState, useCallback } from 'react';
import type { MouseEvent } from 'react';

/**
 * This hook is used for tracking mouse position. Note: this is to be tested and not recommended as of 1.1.0
 *  for use as it re-renders  whole component on change of cursor position. It is to be optimized.
 */
function useMouse<T extends HTMLElement = any>(
    options: { resetOnExit?: boolean } = { resetOnExit: false }
) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const ref = useRef<T>(null);
    const requestRef = useRef<number | null>(null);
    const positionRef = useRef(position);

    const setMousePosition = useCallback((event: MouseEvent<HTMLElement>) => {
        if (ref.current) {
            const rect = event.currentTarget.getBoundingClientRect();
            const x = Math.max(
                0,
                Math.round(event.pageX - rect.left - (window.pageXOffset || window.scrollX))
            );
            const y = Math.max(
                0,
                Math.round(event.pageY - rect.top - (window.pageYOffset || window.scrollY))
            );
            positionRef.current = { x, y };
        } else {
            positionRef.current = { x: event.clientX, y: event.clientY };
        }
        if (requestRef.current === null) {
            requestRef.current = requestAnimationFrame(() => {
                setPosition(positionRef.current);
                requestRef.current = null;
            });
        }
    }, []);

    const resetMousePosition = useCallback(() => {
        positionRef.current = { x: 0, y: 0 };
        setPosition({ x: 0, y: 0 });
    }, []);

    useEffect(() => {
        const element = ref.current || document;
        element.addEventListener('mousemove', setMousePosition as any);
        if (options.resetOnExit) element.addEventListener('mouseleave', resetMousePosition as any);

        return () => {
            element.removeEventListener('mousemove', setMousePosition as any);
            if (options.resetOnExit) element.removeEventListener('mouseleave', resetMousePosition as any);
            if (requestRef.current !== null) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [setMousePosition, resetMousePosition, options.resetOnExit]);

    return { ref, ...position };
}

export default useMouse;
