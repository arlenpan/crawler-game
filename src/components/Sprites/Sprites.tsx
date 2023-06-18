import spritesheet from 'src/assets/sprites.jpg';
import styles from './Sprites.module.css';
import { ReactNode } from 'react';

export const TileGeneric = ({ children }: { children: ReactNode }) => {
    return <div className={styles.tile}>{children}</div>;
};

export const TileCoin = () => {
    return (
        <div
            className={styles.tile}
            style={{
                background: `url(${spritesheet})`,
                backgroundSize: '150px 150px',
                backgroundPosition: '0px -3px',
            }}
        />
    );
};

export const TileShield = () => {
    return (
        <div
            className={styles.tile}
            style={{
                background: `url(${spritesheet})`,
                backgroundSize: '150px 150px',
                backgroundPosition: '0px -50px',
            }}
        />
    );
};

export const TileSword = () => {
    return (
        <div
            className={styles.tile}
            style={{
                background: `url(${spritesheet})`,
                backgroundSize: '150px 150px',
                backgroundPosition: '-50px -3px',
            }}
        />
    );
};

export const TilePotion = () => {
    return (
        <div
            className={styles.tile}
            style={{
                background: `url(${spritesheet})`,
                backgroundSize: '150px 150px',
                backgroundPosition: '-98px -3px',
            }}
        />
    );
};
