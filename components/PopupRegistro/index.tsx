import Api from "@/api";
import styles from "@/styles/popupregistro.module.scss";
import { useState } from "react";
import ButtonLoadingComponent from "../ButtonLoadingComponent";
import { AxiosError } from "axios";

interface props {
    setClose: () => void;
    setSelectedOption: () => void
    selectedOption: string
}

export default function PopupRegistro(props: props) {
    const [error, setError] = useState('')
    const [step, setStep] = useState('unshown')
    const [isClosing, setIsClosing] = useState(false);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            props.setClose();
        }, 300);
    };

    const handleSubmitRegister = async () => {

        if (!email || !password) {
            setError('Preencha todos os campos')
            return
        }

        try {
            setStep('loading')
            const response = await Api.registerAccount(email, password)

            if (response.data.code === "ACCOUNT_CREATED_CHECK_EMAIL") {
                setStep('checkemail')
                console.log('aqui')
                setError('')
                return
            }

        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.data.code === "ALREADYUSED_EMAIL") {
                    setStep('shown')
                    return setError(error.response?.data.message)
                }
            }
        } finally {

        }

    }


    return (
        <div
            className={`${styles.mainDiv} ${isClosing ? styles.fadeOut : styles.fadeIn
                }`}
        >
            {props.selectedOption === "Entrar" && (<div className={styles.popupBox}>
                <div className={styles.welcomeDiv}>
                    <div>
                        <span className={styles.welcomeToText}>Bem vindo de volta ao</span> <span className={styles.vemfaculText}>VemFacul!</span>
                    </div>
                </div>

                <div className={styles.mainFormDiv}>
                    <div className={styles.emailDiv}>
                        <label className={styles.emailLabel}>E-MAIL</label>
                        <input onChange={(e) => setEmail(e.target.value)} className={styles.emailInput} type="text" />
                    </div>

                    <div className={styles.passwordDiv}>
                        <label className={styles.passwordLabel}>SENHA</label>
                        <input onChange={(e) => setPassword(e.target.value)} className={styles.passwordInput} type="text" />
                    </div>

                    <div className={styles.forgotPasswordDiv}>
                        <span className={styles.forgotPasswordText}>Esqueci minha senha</span>
                    </div>

                    <div className={styles.buttonDiv}>
                        <button className={`${styles.buttonEntrar}`}>ENTRAR COM O EMAIL</button>
                    </div>

                    <div className={styles.noAccountDiv}>
                        <span className={styles.noAccountText}>Não tem uma conta? </span>
                        <span className={styles.createAccountText}>Cadastre-se</span>
                    </div>
                    <div className={styles.closeDiv}>
                        <span onClick={() => props.setClose()} className={styles.closetext}>X</span>
                    </div>

                </div>
            </div>
            )}
            {props.selectedOption === "Cadastro" && (
                <div className={styles.popupBox}>
                    {error &&
                        <div className={styles.errorDiv}>
                            <span className={styles.errorText}>{error}</span>
                        </div>
                    }

                    {step !== "checkemail" ? (
                        <>
                            <div className={styles.welcomeDiv}>

                                <div>
                                    <span className={styles.welcomeToText}>Boas-vindas ao</span> <span className={styles.vemfaculText}>VemFacul!</span>
                                </div>
                            </div>

                            <div className={styles.mainFormDiv}>
                                <div className={styles.emailDiv}>
                                    <label className={styles.emailLabel}>E-MAIL</label>
                                    <input onChange={(e) => setEmail(e.target.value)} className={styles.emailInput} type="text" />
                                </div>

                                {(step === 'shown' || step === 'loading') &&
                                    <div className={styles.passwordDiv}>
                                        <label className={styles.passwordLabel}>SENHA</label>
                                        <input onChange={(e) => setPassword(e.target.value)} className={styles.passwordInput} type="password" />
                                    </div>
                                }

                                <div className={styles.buttonDiv}>
                                    <button onClick={() => {
                                        if (!email) return setError("Preencha o campo email");
                                        setStep('shown');
                                        setError('')
                                        if (step === 'shown') {
                                            handleSubmitRegister()
                                        }
                                    }} className={`${styles.buttonEntrar}`}>{step === 'unshown' ? "Continuar com e-mail" : step === 'loading' ? (<ButtonLoadingComponent />) : "Cadastrar"}</button>
                                </div>

                                <div className={styles.noAccountDiv}>
                                    <span className={styles.noAccountText}>Já tem uma conta? </span>
                                    <span className={styles.createAccountText}>Entrar</span>
                                </div>

                                <div className={styles.closeDiv}>
                                    <span onClick={handleClose} className={styles.closetext}>X</span>
                                </div>

                            </div>
                        </>) : (
                        <div className={styles.checkEmailDiv}>
                            <div className={styles.checkEmail}>
                                <p className={styles.checkEmailText}>Verifique seu e-mail.</p>
                            </div>
                            <div className={styles.checkEmailDescription}>
                                <p className={styles.checkEmailDescriptionText}>Você está quase lá! Nós acabamos de mandar um email para {(<span style={{ fontWeight: 600 }}>{email}</span>)}</p>
                            </div>
                            <div style={{ paddingTop: 20 }} className={styles.checkEmailDescription}>
                                <p className={styles.checkEmailDescriptionText}>Para continuar o registro de sua conta, apenas clique no link e aguarde alguns segundos!</p>
                            </div>
                            <div style={{ paddingTop: 20 }} className={styles.checkEmailDescription}>
                                <p className={styles.checkEmailDescriptionText}>Não conseguiu achar o email? {<span className={styles.reenviarText}>Reenviar email.</span>}</p>
                            </div>
                            <div className={styles.closeDiv}>
                                <span onClick={handleClose} className={styles.closetext}>X</span>
                            </div>
                        </div>)
                    }
                </div>
            )}

        </div>
    );
}
