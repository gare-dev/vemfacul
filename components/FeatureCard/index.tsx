// components/FeatureCard.tsx
import React from 'react';
import styles from './style.module.scss';

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
    return (
        <div className={styles.card}>
            <div className={styles.front}>
                <div className={styles.icon}>{icon}</div>
                <h3>{title}</h3>
            </div>
            <div className={styles.back}>
                <p>{description}</p>
            </div>
        </div>
    );
};

export default FeatureCard;
