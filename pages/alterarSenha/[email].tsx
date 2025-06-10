import Api from "@/api";
import Styles from "@/styles/alterarSenha.module.scss";
import { AxiosError } from "axios";
import { useRouter } from "next/router";

const AlterarSenha = () => {
    const router = useRouter();
    const { email } = router.query;

    if (!email || typeof email !== 'string') {
        return <div>Carregando...</div>;
    }
    return (

        <div className={Styles.container}>
            <div className={Styles.form}>
                <h1>Redefinindo Senha</h1>
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    const password = (e.target as HTMLFormElement).password.value;
                    console.log("Enviando para resetPassword:", { password, email });
                    try {
                        await Api.resetPassword(password, email);
                        alert('Senha redefinida com sucesso.');
                        router.push('/');
                    } catch (error) {
                        if (error instanceof AxiosError) {
                            alert(`Error ao redefinir senha: ${error?.response?.data?.message || error.message || error}`);
                        }
                    }
                }}>
                    <p className={Styles.label}>NOVA SENHA</p>
                    <input type="password" name="password" autoComplete="off" required />
                    <div className={Styles.buttonDiv}>
                        <button className={Styles.button} type="submit">Enviar</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AlterarSenha;