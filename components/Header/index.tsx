import React, { useEffect, useState, useRef } from 'react';
import styles from '@/styles/header.module.scss';
import PopupRegistro from '../PopupRegistro';
import { IoMdArrowDropdown } from 'react-icons/io';
import { useRouter } from 'next/router';
import useOpenPopup from '@/hooks/useOpenPopup';

export default function Header() {
    const { isOpen, setIsOpen } = useOpenPopup();
    const [selectedOption, setSelectedOption] = useState<string>('Cadastro');
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    return (
        <header className={styles.header}>
            {isOpen && (
                <PopupRegistro
                    changeOption={(option) => setSelectedOption(option)}
                    selectedOption={selectedOption}
                    setSelectedOption={() => setSelectedOption(selectedOption)}
                    setClose={() => setIsOpen(false)}
                />
            )}

            <div className={styles.header__logo} onClick={() => router.push('/')} role="button" tabIndex={0} aria-label="Ir para página inicial">
                <img src="/assets/img/logo.png" alt="Logo" className={styles.header__image} />
            </div>

            <nav className={styles.header__nav}>
                <button
                    onClick={() => {
                        setIsOpen(true);
                        setSelectedOption('Entrar');
                    }}
                    className={styles.header__button__entrar}
                    type="button"
                >
                    Entrar
                </button>

                <div ref={dropdownRef} className={styles.registerWrapper}>
                    <button
                        onClick={() => setShowDropdown((prev) => !prev)}
                        className={styles.header__button__cadastrar}
                        type="button"
                        aria-haspopup="true"
                        aria-expanded={showDropdown}
                    >
                        Cadastre-se Agora <IoMdArrowDropdown style={{ marginLeft: 5 }} />
                    </button>
                    {showDropdown && (
                        <div className={styles.dropdown} role="menu">
                            <div
                                role="menuitem"
                                tabIndex={0}
                                onClick={() => {
                                    router.push('/cursinho/cadastro');
                                    setShowDropdown(false);
                                }}
                                onKeyDown={(e) => { if (e.key === 'Enter') { router.push('/cursinho/cadastro'); setShowDropdown(false); } }}
                            >
                                Sou um Cursinho
                            </div>
                            <div
                                role="menuitem"
                                tabIndex={0}
                                onClick={() => {
                                    setSelectedOption('Cadastro');
                                    setIsOpen(true);
                                    setShowDropdown(false);
                                }}
                                onKeyDown={(e) => { if (e.key === 'Enter') { setSelectedOption('Cadastro'); setIsOpen(true); setShowDropdown(false); } }}
                            >
                                Sou Estudante
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}