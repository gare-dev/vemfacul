import Api from "@/api";
import Styles from "@/styles/alterarSenha.module.scss";
import { useRouter } from "next/router";

const alterarSenha = () => {
    const router = useRouter();
    return (
        <div className={Styles.container}>
            <div className={Styles.form}>
                <h1>Redefinindo Senha</h1>
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    const password = (e.target as HTMLFormElement).password.value;
                    const email = (e.target as HTMLFormElement).email.value;
                    try {
                        await Api.resetPassword(password, email);
                        alert('Senha redefinida com sucesso.');
                        router.push('/');
                    } catch (error) {
                        alert('Erro ao redefinir senha. Tente novamente.');
                    }

                }}>
                    <p className={Styles.label}>CONFIRME O EMAIL</p>
                    <input type="email" name="email" required />
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

export default alterarSenha;