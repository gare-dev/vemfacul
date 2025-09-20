import Api from '@/api';
import { useState, useEffect } from 'react';
import styles from '@/styles/questoes.module.scss';
import { useRouter } from 'next/router';
import LoadingBar from '../LoadingBar';

type Disciplina = { titulo: string; idx: number };

export type Alternatives = {
    letter: string;
    text: string;
    file: null;
    isCorrect: boolean;
}

export type Question = {
    index: string | number;
    title: string;
    discipline: string;
    language: string;
    year: number;
    context: string;
    files: string[];
    correctAlternative: string;
    alternativesIntroduction: string;
    alternatives: Alternatives[];
}

const ano_questoes = ['2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023']


export default function QuickTest() {
    const router = useRouter()
    const [questions, setQuestions] = useState<Question[]>([]);
    const [year, setYear] = useState<number | null>(null);
    const [offset, setOffSet] = useState<number>(Number)
    const diciplinas: Disciplina[] = [
        { titulo: "Linguagens", idx: 1 },
        { titulo: "Ciências Humanas", idx: 46 },
        { titulo: "Ciências da Natureza", idx: 91 },
        { titulo: "Matemática", idx: 146 }
    ];
    const [span, setSpan] = useState('')
    const [questionIdx, setQuestionIdx] = useState<number | 0>(Number)
    const [isvisible, setIsVisible] = useState(true)
    const [isvisibleResult, setVisibleResult] = useState(false)
    const [respostas, setRespostas] = useState<string[]>([])
    const [verify, setVerify] = useState<boolean[]>([])
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

    const handleGetQuestoes = async (y: number, idxQuestion: number) => {

        function gerarQuestoes(iq: number) {
            const r = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min)
            switch (iq) {
                case 1: return r(1, 45)
                case 46: return r(46, 90)
                case 91: return r(91, 145)
                case 146: return r(146, 180)
            }
            return idxQuestion
        }

        try {
            startLoading()
            const require = await Api.questoes(y, gerarQuestoes(idxQuestion))
            if (require.status === 200) {
                setQuestions(require.data.questions);
            } else {
                setSpan(`${require.status}`)
            }
        } catch (error) {
            console.log(error);
        } finally {
            stopLoading()
        }
    }

    const handleInsertQuestion = async (index: number, year: number, disciplines: string, isCorrect: boolean) => {
        try {
            let id_disciplines: number = 0;
            switch (disciplines) {
                case "ciencias-humanas": { id_disciplines = 1; break; }
                case "ciencias-natureza": { id_disciplines = 2; break; }
                case "linguagens": { id_disciplines = 3; break; }
                case "matematica": { id_disciplines = 4; break; }
                default: { id_disciplines = 0; break; }
            }
            console.log("Enviando ao banco: ", index, year, id_disciplines, isCorrect);
            const promise = await Api.insertQuestion(index, year, id_disciplines, isCorrect)
            if (promise.status === 200) {
                setSpan("Simulado concluido!")
            }
        } catch (e) {
            console.log(e)
        }
    }
    const verifyRespostas = () => {
        const resultados: boolean[] = questions.map((question, qIdx) => {
            const resposta = respostas[qIdx];
            const alternativa = question.alternatives.find(a => a.letter === resposta);
            console.log("FrontEndo: ", +question.index, question.year, question.discipline, alternativa ? alternativa.isCorrect : false)
            handleInsertQuestion(+question.index, question.year, question.discipline, alternativa ? alternativa.isCorrect : false)
            return alternativa ? alternativa.isCorrect : false;
        });
        setVerify(resultados);
    }


    useEffect(() => {
        if (year) { handleGetQuestoes(year, offset); setIsVisible(false) };
    }, [year])

    return (
        <div className={styles.main}>
            {loading && <LoadingBar progress={progress} />}
            {isvisibleResult && (
                <div className={styles.container_resultado}>
                    <div className={styles.resultadoContent}>
                        <h1 className={styles.resultadoTitle}>Resultado</h1>
                        <div className={styles.ul_resultados}>
                            <ul className={styles.ul_resultadosList}>
                                {verify.map((resp, idx) => (
                                    <li key={idx} className={styles.ul_resultadosItem}>
                                        <div>
                                            <p>{idx + 1}</p>
                                            <button
                                                style={{ color: resp ? "#22c55e" : "red" }}
                                                className={styles.ul_resultadosButton}
                                                onClick={() => router.push(`/exercicios/correcao/${questions[questionIdx].index}`)}
                                            >
                                                {resp ? 'Correta' : 'Incorreta'}
                                            </button>
                                            {resp ? <button className={styles.explicacaoBtt}>Explicação</button> : <button className={styles.correcaoBtt}>Correção</button>}
                                        </div>

                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className={styles.resultadoActions}>
                            <ul className={styles.resultadoOptionsList}>
                                <li className={styles.resultadoOptionsItem}>
                                    <button
                                        className={styles.btn}
                                        onClick={() => {
                                            router.reload();
                                        }}
                                    >
                                        Voltar
                                    </button>
                                    {/* <button
                                        style={{ backgroundColor: "#ef4444" }}
                                        className={styles.btn}
                                        onClick={() => {
                                            setVisibleResult(false)
                                        }}
                                    >
                                        Voltar
                                    </button> */}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {isvisible && (
                <form
                    className={styles.form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const intYear = Number(formData.get('ano'));
                        const intOffSet = Number(formData.get('diciplina'));
                        if (intYear >= 2009 && intYear <= 2023) {
                            setOffSet(intOffSet);
                            setYear(intYear);
                            setSpan('');
                        } else {
                            setSpan('Digite um ano entre 2009 e 2023');
                        }
                    }}
                >
                    {span && <span className={styles.spanError}>{span}</span>}

                    <div className={styles.container_diciplinas}>
                        <h2 className={styles.container_diciplinasTitle}>Disciplina</h2>
                        <div className={styles.container_diciplinasContent}>
                            <select name="diciplina" id="diciplina" className={styles.selectDiciplina}>
                                {diciplinas.map((d, idx) => (
                                    <option key={idx} value={d.idx}>
                                        {d.titulo}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <label htmlFor="year" className={styles.formLabel}>
                        Ano das questões
                    </label>
                    <select name="ano" id="ano" className={styles.selectDiciplina}>
                        {ano_questoes.map((d, i) => (
                            <option key={i} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>
                    <button type="submit" className={styles.btn}>
                        Começar Simulado
                    </button>
                </form>
            )}

            {questions.length > 0 && (<div className={styles.container}>

                <>
                    <div key={`${questions[questionIdx].index}`} className={styles.card}>
                        <div>
                            <h1 className={styles.headreTitle}>{questions[questionIdx].title}</h1>
                            <h2 className={styles.headreSubtitle}>
                                {questionIdx + 1}. SIMULADO - VEMFACUL
                            </h2>
                            <p className={styles.headreParagraph}>{questions[questionIdx].context.replace(/!\[.*?\]\(.*?\)/g, "").trim()}</p>
                            <br />
                            {questions[questionIdx].files && questions[questionIdx].files.length > 0 && (
                                <img
                                    src={questions[questionIdx].files[0]}
                                    alt=""
                                    className={styles.headreImage}
                                />
                            )}
                            <h3 className={styles.headreIntro}>
                                {questions[questionIdx].alternativesIntroduction}
                            </h3>
                            <br />
                        </div>

                        <div className={styles.alternativas}>
                            {questions[questionIdx].alternatives.map((a, idx) => (
                                <label key={idx} className={styles.alternativa}>
                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
                                        <h2 className={styles.alternativaLetter}>{a.letter}</h2>
                                        <input
                                            type="radio"
                                            name={`resposta-${questionIdx}`}
                                            checked={respostas[questionIdx] === a.letter}
                                            onChange={() => {
                                                const novaResposta = [...respostas];
                                                novaResposta[questionIdx] = a.letter;
                                                setRespostas(novaResposta);
                                            }}
                                            className={styles.alternativaInput}
                                        />
                                    </div>
                                    <h2 className={styles.alternativaText}>{a.text}</h2>
                                    {a.file && (
                                        <img src={a.file} alt="" className={styles.alternativaImage} />
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className={styles.container_actions}>
                        <div>
                            <ul className={styles.optionsList}>
                                <li className={styles.optionsListItem}>
                                    <button
                                        className={`${styles.btn} ${styles.btnVoltar}`}
                                        onClick={() => setQuestionIdx((prev) => Math.max(prev - 1, 0))}
                                    >
                                        Voltar Questão
                                    </button>
                                </li>
                                <li className={styles.optionsListItem}>
                                    <button
                                        className={styles.btn}
                                        onClick={() => {
                                            if (questionIdx < questions.length - 1) {
                                                setQuestionIdx(questionIdx + 1);
                                            } else {
                                                if (respostas.length !== questions.length) {
                                                    alert('Responda todas as alternativas');
                                                } else {
                                                    verifyRespostas();
                                                    setVisibleResult(true);
                                                }
                                            }
                                        }}
                                    >
                                        Confirmar Resposta
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </>
            </div>)}
        </div>
    );
} 