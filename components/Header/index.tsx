import React, { useState } from 'react';
import styles from "@/styles/header.module.scss";
import PopupRegistro from '../PopupRegistro';

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string>('');

    return (
        <header className={styles.header}>
            {isOpen && <PopupRegistro changeOption={(option) => setSelectedOption(option)} selectedOption={selectedOption} setSelectedOption={() => setSelectedOption(selectedOption)} setClose={() => setIsOpen(false)} />}

            <div className={styles.header__logo}>
                <img src="/assets/img/logo.png" alt="Logo" className={styles.header__image} />
            </div>
            <div className={styles.header__nav}>
                <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>

                    <button onClick={() => {
                        setSelectedOption("Cadastro")
                        setIsOpen(true)
                    }
                    } className={styles.header__button__cadastrar}>Cadastre-se Agora</button>

                </div>
                <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>

                    <button onClick={() => {
                        setIsOpen(true)
                        setSelectedOption('Entrar')
                    }} className={styles.header__button__entrar}>Entrar</button>
                </div>
            </div>

        </header >
    );
};

export default Header;