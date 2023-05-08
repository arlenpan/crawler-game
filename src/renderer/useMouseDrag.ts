import { useEffect, useState } from 'react';

export const useMouseDrag = () => {
    const [isDragging, setDragging] = useState(false);
    const [mouseEvent, setMouseEvent] = useState<MouseEvent | null>(null);

    // EVENT HANDLING
    useEffect(() => {
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isDragging]);

    const handleMouseDown = (e: MouseEvent) => {
        setDragging(true);
        setMouseEvent(e);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) setMouseEvent(e);
    };

    const handleMouseUp = () => {
        setDragging(false);
        setMouseEvent(null);
    };

    return { isDragging, mouseEvent };
};
