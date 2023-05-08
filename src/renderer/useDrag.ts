import { useEffect, useState } from 'react';

export const useDrag = () => {
    const [isDragging, setDragging] = useState(false);
    const [event, setEvent] = useState<Event | null>(null);
    const [target, setTarget] = useState<HTMLElement | null>(null);

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

    useEffect(() => {
        if (event) {
            if (event instanceof MouseEvent) {
                setTarget(event.target as HTMLElement);
            }
            if (event instanceof TouchEvent) {
                const touch = event.changedTouches[0];
                setTarget(document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement);
            }
        } else {
            setTarget(null);
        }
    }, [event]);

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

    return { isDragging, event, target };
};
