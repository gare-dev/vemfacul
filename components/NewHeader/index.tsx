// components/Header.tsx
import React, { useState, useRef, useEffect } from 'react';
import styles from './style.module.scss';

const Header: React.FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fecha dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className={styles.header}>
            <div className={styles.logo}>PréVest</div>
            <nav className={styles.nav}>
                <button className={styles.loginBtn}>Login</button>
                <div className={styles.registerWrapper} ref={dropdownRef}>
                    <button
                        className={styles.registerBtn}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        aria-haspopup="true"
                        aria-expanded={dropdownOpen}
                    >
                        Registro ▾
                    </button>
                    {dropdownOpen && (
                        <ul className={styles.dropdown}>
                            <li><a href="#">Sou um cursinho</a></li>
                            <li><a href="#">Sou um estudante</a></li>
                        </ul>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
