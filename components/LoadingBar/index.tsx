import React from 'react';
import styles from './style.module.scss';


interface LoadingBarProps {
    progress: number;
}
const LoadingBar: React.FC<LoadingBarProps> = ({ progress }) => {
    return (
        <div className={styles.container}>
            <div
                className={styles.bar}
                style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            />
        </div>
    );
};
export default LoadingBar;