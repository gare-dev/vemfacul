import React, { useEffect, useState, useRef } from 'react';
import styles from "@/styles/header.module.scss";
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

            <div className={styles.header__logo}>
                <img
                    onClick={() => router.push('/')}
                    style={{ cursor: "pointer" }}
                    src="/assets/img/logo.png"
                    alt="Logo"
                    className={styles.header__image}
                />
            </div>

            <div className={styles.header__nav}>
                <div
                    ref={dropdownRef}
                    style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
                >
                    <button
                        onClick={() => setShowDropdown(prev => !prev)}
                        className={styles.header__button__cadastrar}
                    >
                        Cadastre-se Agora <IoMdArrowDropdown style={{ marginLeft: 5 }} />
                    </button>
                    {showDropdown && (
                        <div className={styles.dropdown}>
                            <div
                                onClick={() => {
                                    router.push('/cursinho/cadastro')
                                }}
                            >
                                Sou um Cursinho
                            </div>
                            <div
                                onClick={() => {
                                    setSelectedOption("Cadastro");
                                    setIsOpen(true);
                                    setShowDropdown(false);
                                }}
                            >
                                Sou Estudante
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                    <button
                        onClick={() => {
                            setIsOpen(true);
                            setSelectedOption('Entrar');
                        }}
                        className={styles.header__button__entrar}
                    >
                        Entrar
                    </button>
                </div>
            </div>
        </header>
    );
}
