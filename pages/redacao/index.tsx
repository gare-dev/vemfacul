import { useEffect, useState } from "react";
import styles from "@/styles/redacao.module.scss";
import Api from "@/api";
import { GetServerSideProps } from "next";
import AuthDataType from "@/types/authDataType";
import Sidebar from "@/components/Sidebar";
import formatarRedacao from "@/utils/formatEssayText"
import LoadingBar from "@/components/LoadingBar";
import useAlert from "@/hooks/useAlert";

type Redacao = {
    id_essay?: number;
    created_at?: Date
    essay: string;
    notes?: string;
    score?: number;
    title: string
    theme: string
};

interface Props {
    authData?: AuthDataType | null | undefined;
    userEssays: Redacao[]
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    try {
        const cookie = ctx.req.headers.cookie
        Api.setCookie(cookie || "")

        const [response, authData] = await Promise.all([
            Api.userEssays(),
            Api.getProfileInfo()
        ])

        return {
            props: {
                authData: authData.data.code === "PROFILE_INFO" ? authData.data.data : null,
                userEssays: response.status === 200 ? response.data.data.map((essay: Redacao) => ({
                    ...essay,
                    created_at: essay.created_at ? (typeof essay.created_at === "string" ? essay.created_at : new Date(essay.created_at).toLocaleDateString()) : "Data não informada"

                })) : null
            }
        }
    } catch (error) {
        console.log("Erro ao selecionar redações ou AuthData. " + error)
        return {
            props: {
                userEssays: null,
                authData: null
            }
        }
    }
}

export default function Redacao({ userEssays, authData }: Props) {
    const [redacoes, setRedacoes] = useState<Redacao[]>(userEssays);

    const [modoCriar, setModoCriar] = useState(false);
    const [textoNovaRedacao, setTextoNovaRedacao] = useState("");
    const [titleNovaRedacao, setTitleNovaRedacao] = useState("")
    const [themeNovaRedacao, setThemeNovaRedacao] = useState("")
    const [redacaoSelecionada, setRedacaoSelecionada] = useState<Redacao | null>(
        null
    );
    const [enviando, setEnviando] = useState(false);
    const { showAlert } = useAlert()
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    let intervalId: NodeJS.Timeout;

    const startLoading = () => {
        setLoading(true);
        setProgress(10);

        intervalId = setInterval(() => {
            setProgress((prev) => (prev < 90 ? prev + 5 : prev));
        }, 200);
    };

    const stopLoading = () => {
        clearInterval(intervalId);
        setProgress(100);
        setTimeout(() => {
            setLoading(false);
            setProgress(0);
        }, 400);
    };

    async function enviarRedacao() {

        try {
            startLoading()
            const response = await Api.insertEssay(textoNovaRedacao, themeNovaRedacao, titleNovaRedacao)
            if (response.status === 201) {
                const nova_redacao = response.data.data[0];
                setRedacoes((prev) => [...prev, nova_redacao]);
                setRedacaoSelecionada(nova_redacao);
            }

        } catch (error) {
            console.log("Erro ao inserir redação. " + error)
        } finally {
            stopLoading()
        }
    }

    async function handleEnviar() {
        if (!textoNovaRedacao.trim()) return;
        if (textoNovaRedacao.trim().length > 3100) return showAlert("O número máximo de caracteres é 3100.")

        setEnviando(true);
        await enviarRedacao();

        setTextoNovaRedacao("");
        setModoCriar(false);
        setEnviando(false);
        setTitleNovaRedacao("")
        setThemeNovaRedacao("")
    }

    function handleSelecionarRedacao(id: number) {
        const r = redacoes.find((r) => r.id_essay === id) || null;
        setRedacaoSelecionada(r);
        setModoCriar(false);
    }

    return (
        <main className={styles.container}>
            {loading && <LoadingBar progress={progress} />}
            <Sidebar authData={authData} />

            <section className={styles.listaContainer}>
                <h2 className={styles.subtitulo}>Redações anteriores</h2>
                <ul className={styles.listaRedacoes}>
                    {redacoes?.map((r) => (
                        <li
                            key={r.id_essay}
                            className={`${styles.itemRedacao} ${redacaoSelecionada?.id_essay === r.id_essay ? styles.selecionado : ""
                                }`}
                            onClick={() => handleSelecionarRedacao(r.id_essay ?? 0)}
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    handleSelecionarRedacao(r.id_essay ?? 0);
                                }
                            }}
                            role="button"
                            aria-pressed={redacaoSelecionada?.id_essay === r.id_essay}
                        >
                            <p className={styles.previewTexto}>
                                {r.essay.length > 40 ? r.essay.slice(0, 40) + "..." : r.essay}
                            </p>
                            <span className={styles.notaBadge}>{r.score ?? "?"}</span>
                        </li>
                    ))}
                </ul>

                <button
                    className={styles.botaoNova}
                    onClick={() => {
                        setModoCriar(true);
                        setRedacaoSelecionada(null);
                    }}
                    type="button"
                >
                    + Criar nova redação
                </button>
            </section>

            <section className={styles.editorContainer}>
                {modoCriar ? (
                    <>
                        <h2 className={styles.subtitulo}>{titleNovaRedacao === "" ? "Nova Redação" : titleNovaRedacao}</h2>
                        <input
                            value={titleNovaRedacao}
                            onChange={(e) => setTitleNovaRedacao(e.target.value)}
                            placeholder="Título..." className={styles.titleInput} type="text" />
                        <input
                            value={themeNovaRedacao}
                            onChange={(e) => setThemeNovaRedacao(e.target.value)}
                            placeholder="Tema..." className={styles.titleInput} type="text" />
                        <textarea
                            className={styles.textarea}
                            placeholder="Escreva sua redação aqui..."
                            value={textoNovaRedacao}
                            onChange={(e) => setTextoNovaRedacao(e.target.value)}
                            rows={10}
                            disabled={enviando}
                        />
                        <button
                            className={styles.botaoEnviar}
                            onClick={handleEnviar}
                            disabled={enviando || !textoNovaRedacao.trim()}
                            type="button"
                        >
                            {enviando ? "Enviando..." : "Enviar redação"}
                        </button>
                        <button
                            className={styles.botaoCancelar}
                            onClick={() => {
                                setModoCriar(false);
                                setTextoNovaRedacao("");
                            }}
                            type="button"
                            disabled={enviando}
                        >
                            Cancelar
                        </button>
                    </>
                ) : redacaoSelecionada ? (
                    <>
                        <h2 className={styles.subtitulo}>Redação Selecionada</h2>
                        <div className={styles.redacaoExibicao}>
                            <p className={styles.textoRedacao}>{redacaoSelecionada.essay}</p>
                            <div className={styles.feedbackContainer}>
                                <h3>Feedback:</h3>
                                <p className={styles.feedbackTexto}>
                                    {formatarRedacao(redacaoSelecionada.notes ?? "")}
                                </p>
                                <p className={styles.notaTexto}>
                                    Nota:{" "}
                                    <span className={styles.notaValor}>
                                        {redacaoSelecionada.score}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </>
                ) : (
                    <p className={styles.instrucao}>
                        Selecione uma redação para ver o feedback ou crie uma nova.
                    </p>
                )}
            </section>
        </main>
    );
}