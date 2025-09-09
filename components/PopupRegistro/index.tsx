import Api from "@/api";
import styles from "@/styles/popupregistro.module.scss";
import { useState } from "react";
import ButtonLoadingComponent from "../ButtonLoadingComponent";
import { AxiosError } from "axios";
import { useRouter } from "next/router";

interface props {
    setClose: () => void;
    setSelectedOption: () => void
    selectedOption: string
    changeOption: (option: string) => void
}

export default function PopupRegistro(props: props) {
    const [error, setError] = useState('')
    const [step, setStep] = useState('unshown')
    const [isClosing, setIsClosing] = useState(false);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    const handleClose = () => {
        setIsClosing(true);
        props.setClose();
    };

    const handleSubmitRegister = async () => {

        if (!email || !password) {
            setError('Preencha todos os campos')
            return
        }

        if (!validatePasswordInput()) return

        try {
            setStep('loading')
            const response = await Api.registerAccount(email, password)

            if (response.data.code === "ACCOUNT_CREATED_CHECK_EMAIL") {
                setStep('checkemail')
                setError('')
                return
            }

        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.data.code === "ALREADYUSED_EMAIL") {
                    setStep('shown')
                    return setError(error.response?.data.message)
                }
                if (error.code === "ERR_NETWORK") {
                    setError("Erro de rede. Tente novamente mais tarde.");
                    return
                }
            }
        }
    }

    const handleSubmitLogin = async () => {
        if (!email || !password) {
            setError('Preencha todos os campos')
            return
        }

        try {
            setStep('loading')
            const response = await Api.loginAccount(email, password)

            if (response.data.code === "LOGIN_SUCCESS") {
                setError('')
                props.setClose()
                router.push('/feed')
                return
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.data.code === "INVALID_EMAIL_OR_PASSWORD") {
                    setError(error.response?.data.error)
                    return
                }
            }
        } finally {
            setStep('unshown')
        }
    }

    const validatePasswordInput = () => {
        const mandatoryCharacters = /[0-9@#$]/;
        if (password.length <= 6) {
            setError("A senha deve ter mais de 6 caracteres.");
            return false;
        }
        if (!mandatoryCharacters.test(password)) {
            setError("A senha deve conter pelo menos um número ou um caracter especial.");
            return false;
        }

        return true;
    }



    return (
        <div
            className={`${styles.mainDiv} ${isClosing ? styles.fadeOut : styles.fadeIn
                }`}
        >
            {props.selectedOption === "Entrar" && (
                <div className={styles.popupBox}>
                    <div className={styles.welcomeDiv}>
                        <div>
                            <span className={styles.welcomeToText}>Bem vindo de volta ao</span> <span className={styles.vemfaculText}>VemFacul!</span>
                        </div>
                    </div>
                    {error &&
                        <div className={styles.errorDiv}>
                            <span className={styles.errorText}>{error}</span>
                        </div>
                    }

                    <div className={styles.mainFormDiv}>
                        <div className={styles.emailDiv}>
                            <label className={styles.emailLabel}>E-MAIL</label>
                            <input value={email} onChange={(e) => setEmail(e.target.value)} className={styles.emailInput} type="email" />
                        </div>

                        <div className={styles.passwordDiv}>
                            <label className={styles.passwordLabel}>SENHA</label>
                            <input value={password} onChange={(e) => setPassword(e.target.value)} className={styles.passwordInput} type="password" />
                        </div>

                        <div className={styles.forgotPasswordDiv}>
                            <span onClick={() => {
                                props.changeOption("EsqueciSenha");
                            }
                            } className={styles.forgotPasswordText}>Esqueci minha senha</span><br />
                        </div>

                        <div className={styles.buttonDiv}>
                            <button onClick={handleSubmitLogin} className={`${styles.buttonEntrar}`}>{step === "unshown" ? "ENTRAR COM O EMAIL" : <ButtonLoadingComponent />}</button>
                        </div>

                        <div className={styles.noAccountDiv}>
                            <span className={styles.noAccountText}>Não tem uma conta? </span>
                            <span onClick={() => props.changeOption("Cadastro")} className={styles.createAccountText}>Cadastre-se</span>
                        </div>
                        <div onClick={handleClose} className={styles.closeDiv}>
                            <span className={styles.closetext}>X</span>
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
                                    <span onClick={() => props.changeOption("Entrar")} className={styles.createAccountText}>Entrar</span>
                                </div>

                                <div onClick={handleClose} className={styles.closeDiv}>
                                    <span className={styles.closetext}>X</span>
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
                            <div onClick={handleClose} className={styles.closeDiv}>
                                <span className={styles.closetext}>X</span>
                            </div>
                        </div>)
                    }
                </div>
            )
            }

            {
                props.selectedOption === "EsqueciSenha" && (
                    <div className={styles.popupBox}>
                        <div className={styles.welcomeDiv}>
                            <div>
                                <span className={styles.welcomeToText}>Recuperação de senha</span>
                            </div>
                        </div>
                        {error && (
                            <div className={styles.errorDiv}>
                                <span className={styles.errorText}>{error}</span>
                            </div>
                        )}

                        <div className={styles.mainFormDiv}>
                            <div className={styles.emailDiv}>
                                <label className={styles.emailLabel}>E-MAIL</label>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={styles.emailInput}
                                    type="email"
                                />
                            </div>

                            <div className={styles.buttonDiv}>
                                <button
                                    onClick={async () => {
                                        if (!email) {
                                            setError("Preencha o campo email");
                                            return;
                                        }
                                        setStep("loading");
                                        setError("");
                                        try {
                                            await Api.forgotPassword(email);
                                            props.changeOption('EmaileEnviado');
                                            setStep("checkemail");
                                        } catch (err: unknown) {
                                            if (err instanceof AxiosError) {
                                                setError(err.response?.data.message || "Erro ao enviar email");
                                            }
                                        } finally {
                                            setStep("unshown");
                                        }
                                    }}
                                    className={styles.buttonEntrar}
                                    disabled={step === "loading"}
                                >
                                    {step === "loading" ? <ButtonLoadingComponent /> : "RECUPERAR SENHA"}
                                </button>
                            </div>

                            <div className={styles.noAccountDiv}>
                                <span
                                    onClick={() => props.changeOption("Cadastro")}
                                    className={styles.createAccountText}
                                >
                                    Voltar ao Cadastro
                                </span>
                            </div>

                            <div onClick={handleClose} className={styles.closeDiv}>
                                <span
                                    className={styles.closetext}
                                >
                                    X
                                </span>
                            </div>
                        </div>
                    </div>
                )
            }
            {
                props.selectedOption == 'EmaileEnviado' && (
                    <div className={styles.popupBox}>
                        <div className={styles.welcomeDiv}>
                            <div>
                                <span className={styles.welcomeToText}>Verifique seu e-mail</span>
                            </div>
                        </div>
                        <div className={styles.checkEmailDiv}>
                            <div className={styles.checkEmail}>
                                <p className={styles.checkEmailText}>Enviamos um link de recuperação para o seu e-mail.</p>
                            </div>
                            <div className={styles.checkEmailDescription} style={{
                                flexDirection: "column"
                            }}>
                                <p className={styles.checkEmailDescriptionText}>
                                    Por favor, acesse sua caixa de entrada e siga as instruções para redefinir sua senha.
                                </p>
                                <br />
                                <p className={styles.checkEmailDescriptionText}>
                                    Errou o e-mail?{" "}
                                    <span
                                        className={styles.createAccountText}
                                        style={{ cursor: "pointer", textDecoration: "underline", color: "#001ECB" }}
                                        onClick={() => props.changeOption("EsqueciSenha")}
                                    >
                                        Tentar novamente
                                    </span>
                                </p>
                            </div>
                            <div className={styles.closeDiv}>
                                <span onClick={handleClose} className={styles.closetext}>X</span>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );

}
