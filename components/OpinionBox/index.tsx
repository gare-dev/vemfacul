// components/OpinionBox.tsx
import React from 'react';
import styles from './style.module.scss';

interface OpinionBoxProps {
    name: string;
    role: string;
    opinion: string;
}

const OpinionBox: React.FC<OpinionBoxProps> = ({ name, role, opinion }) => {
    return (
        <div className={styles.box}>
            <p className={styles.opinion}>&quot{opinion}&quot;</p>
            <p className={styles.author}>
                — {name}, <span>{role}</span>
            </p>
        </div>
    );
};

export default OpinionBox;
