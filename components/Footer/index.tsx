// components/Footer.tsx
import React from 'react';
import styles from './style.module.scss';

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div>
                <p>© 2025 <strong>VemFacul.</strong> Todos os direitos reservados.</p>
                <p>Contato: <strong>tccvemfacul@gmail.com</strong></p>

            </div>
        </footer>
    );
};

export default Footer;
