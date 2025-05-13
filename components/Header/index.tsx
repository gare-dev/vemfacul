import React, { useEffect, useState } from 'react';
import styles from "@/styles/header.module.scss";
import PopupRegistro from '../PopupRegistro';
import getCookieValue from '@/utils/getCookie';
import AuthDataType from '@/types/authDataType';
import decodeJwt from '@/utils/decodeJwt';
import { IoMdArrowDropdown } from 'react-icons/io';
import { useRouter } from 'next/router';
import useOpenPopup from '@/hooks/useOpenPopup';




export default function Header() {
    const { isOpen, setIsOpen } = useOpenPopup()
    const [selectedOption, setSelectedOption] = useState<string>('Cadastro');
    const [authData, setAuthData] = useState<AuthDataType>()
    const [profileOptionsVisible, setProfileOptionsVisible] = useState<boolean>(false)
    const router = useRouter()

    function handleSignout() {
        if (getCookieValue("auth")) {
            document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
            if (router.pathname === '/') {
                router.reload(); // força o reload da página atual
            } else {
                router.push('/');
            }
        }
    }

    useEffect(() => {
        if (getCookieValue("auth")) {
            const token: { email: string, image: string, name: string, iat: number, exp: number } = decodeJwt(getCookieValue("auth") ?? "")
            setAuthData({
                email: token.email,
                image: token.image,
                name: token.name
            })
            return
        }
        router.push('/')
    }, [])


    return (

        <header className={styles.header}>


            {isOpen &&
                <PopupRegistro
                    changeOption={(option) => setSelectedOption(option)}
                    selectedOption={selectedOption}
                    setSelectedOption={() => setSelectedOption(selectedOption)}
                    setClose={() => setIsOpen(false)}
                />}

            <div className={styles.header__logo}>
                <img src="/assets/img/logo.png" alt="Logo" className={styles.header__image} />
            </div>
            <div className={styles.header__nav}>
                {authData === undefined ? (<>
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
                </>) : (
                    <>
                        <div style={{ display: "flex", justifyContent: "center", gap: "5px", alignItems: "center" }}>
                            <div style={{ height: "auto", width: "auto" }}>
                                <img className={styles.imageProfile} style={{ borderRadius: "50%", height: "60px", width: "60px", objectFit: "cover" }} src={authData.image} alt="Logo" />
                            </div>
                            <div className="flex gap-1 justify-center">
                                <p className={styles.textHello}>Olá, </p><p className={styles.textName}>{authData.name}</p>
                            </div>
                            <div><IoMdArrowDropdown size={"1.5em"} color='#001ECB' onClick={() => setProfileOptionsVisible(!profileOptionsVisible)} /></div>
                        </div>
                        {profileOptionsVisible && (
                            <div className={styles.overlay} onClick={() => setProfileOptionsVisible(false)}>
                                <div className={styles.popupProfileOptions} onClick={(e) => e.stopPropagation()} >
                                    <div className={styles.almostMainDiv}>
                                        <div className={styles.miniProfileDiv}>
                                            <div style={{ height: "auto", width: "auto", padding: 10 }}>
                                                <img className={styles.imageProfile} style={{ borderRadius: "50%", height: "60px", width: "60px", objectFit: "cover" }} src={authData.image} alt="Logo" />
                                            </div>
                                            <div className={styles.nameDiv}>
                                                <p>{authData.name}</p>
                                            </div>
                                            <div className={styles.options}>
                                                <div onClick={() => router.push('/calendario')}>
                                                    <p>Calendário Pessoal</p>
                                                </div>
                                                <div onClick={handleSignout}>
                                                    <p >Sair</p>
                                                </div>

                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div>

                        )}
                    </>
                )}
            </div>
        </header >
    );
};

