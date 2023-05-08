import { useEffect, useState } from 'react';

export const useMouseDrag = () => {
    const [isDragging, setDragging] = useState(false);
    const [event, setEvent] = useState<Event | null>(null);

    // EVENT HANDLING
    useEffect(() => {
        document.addEventListener('mousedown', handleDown);
        document.addEventListener('mouseup', handleUp);
        document.addEventListener('touchstart', handleDown);
        document.addEventListener('touchend', handleUp);
        return () => {
            document.removeEventListener('mousedown', handleDown);
            document.removeEventListener('mouseup', handleUp);
            document.removeEventListener('touchstart', handleDown);
            document.removeEventListener('touchend', handleUp);
        };
    }, []);

    useEffect(() => {
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('touchmove', handleMove);
        return () => {
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('touchmove', handleMove);
        };
    }, [isDragging]);

    const handleDown = (e: Event) => {
        setDragging(true);
        setEvent(e);
    };

    const handleMove = (e: Event) => {
        if (isDragging) setEvent(e);
    };

    const handleUp = () => {
        setDragging(false);
        setEvent(null);
    };

    return { isDragging, event };
};
