import React, { useEffect } from 'react';
import styles from './style.module.scss';

export interface UserImages {
    foto: string;
    header: string;
}

interface ProfilePopupProps {
    images: UserImages;
    selected: 'foto' | 'header';
    onClose: () => void;
}

const titles = {
    foto: 'Foto de Perfil',
    header: 'Imagem do Header',
};

const ProfilePopup: React.FC<ProfilePopupProps> = ({ images, selected, onClose }) => {
    const src = images[selected];
    const title = titles[selected];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick} role="dialog" aria-modal="true">
            <div className={styles.popup}>
                <img src={src} alt={title} className={styles.image} draggable={false} />
            </div>
        </div>
    );
};

export default ProfilePopup;
