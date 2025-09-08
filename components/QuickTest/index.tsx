import Api from '@/api';
import { useState, useEffect } from 'react';
import styles from '@/styles/questoes.module.scss';

export type Alternatives = {
    letter: string;
    text: string;
    flie: null;
    isCorrect: boolean;
}

export type Question = {
    index: string | number;
    title: string;
    discipline: string;
    language: string;
    year: number;
    context: string;
    flie: string[];
    correctAlternative: string;
    alternativesIntroduction: string;
    alternatives: Alternatives[];
}



export default function QuickTest() {

    const [questions, setQuestions] = useState<Question[]>([]);
    const [year, setYear] = useState<number | null>(null);
    const [span, setSpan] = useState('')
    const [questionIdx, setQuestionIdx] = useState<number | 0>(Number)
    const [isvisible, setIsVisible] = useState(true)
    const [isvisibleResult, setVisibleResult] = useState(false)
    const [respostas, setRespostas] = useState<string[]>([])
    const [verify, setVerify] = useState<boolean[]>([])
    const handleGetQuestoes = async (y: number) => {
        try {
            const require = await Api.questoes(y)
            if (require.status === 200) {
                setQuestions(require.data.questions);
            } else {
                setSpan(`${require.status}`)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const verifyRespostas = () => {
        console.time("verify_call")
        const resultados: boolean[] = questions.map((question, qIdx) => {
            const resposta = respostas[qIdx];
            const alternativa = question.alternatives.find(a => a.letter === resposta);
            return alternativa ? alternativa.isCorrect : false;
        });
        setVerify(resultados);
        resultados.forEach(result => {
            console.log(result)
        })
        console.timeEnd("verify_call")

    }

    useEffect(() => {
        if (year) { handleGetQuestoes(year); setIsVisible(false) };
    }, [year])


    return (
        <div className={styles.main}>
            {isvisibleResult && (
                <>
                    <div className={styles.container_resultado}>
                        <div className={styles.content}>
                            <h1>Resultado</h1>
                            <div className={styles.ul_resultados}>
                                <ul>
                                    {verify.map((resp, idx) => (
                                        <li key={idx}>
                                            {idx} - {resp ? 'Correta' : 'Incorreta'}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className={styles.container_actions}>
                                <div className={styles.options}>
                                    <ul>
                                        <li><button className={styles.btn} onClick={() => {
                                            setQuestions([])
                                            setQuestionIdx(0)
                                            setRespostas([])
                                            setVerify([])
                                            setIsVisible(true)
                                            setVisibleResult(false)
                                        }}>reniciar simulado</button></li>
                                    </ul></div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {isvisible && (
                <>  <form onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    const intYear = Number(formData.get("year"))
                    if (intYear >= 2009 && intYear <= 2023) {
                        setYear(intYear);
                    } else {
                        setSpan('Digite um ano entre 2009 e 2023')
                    }
                }}>
                    {span}
                    <label htmlFor="year">Qual o ano da questao</label>
                    <input type="text" name="year" placeholder='digite o ano das questoes' />
                    <button type='submit' className={styles.btn}>Enviar</button>
                </form></>
            )
            }
            <div className={styles.container}>
                {questions.length > 0 ? (
                    <><div key={`${questions[+questionIdx].index}`} className={styles.card}>
                        <div className={styles.headre}>
                            <h1>{questions[+questionIdx].title}</h1>
                            <h3>{questions[+questionIdx].context}</h3>
                            <br />
                            <h4>{questions[+questionIdx].alternativesIntroduction}</h4>
                            <br />
                        </div>
                        <div className={styles.alternativas}>
                            {questions[+questionIdx].alternatives.map((a, idx) => (
                                <div key={idx} className={styles.alternativa}>
                                    <h2>{a.letter}</h2>
                                    <input type="radio" name={`resposta-${idx}`}
                                        checked={respostas[questionIdx] === a.letter}
                                        onChange={() => {
                                            const novaResposta = [...respostas];
                                            novaResposta[questionIdx] = a.letter;
                                            setRespostas(novaResposta);
                                        }} />
                                    <h2>{a.text}</h2>
                                </div>
                            ))}
                        </div>
                    </div>
                        <div className={styles.container_actions}>
                            <div className={styles.options}>
                                <ul>
                                    <li><button className={styles.btn} id={styles.voltar} onClick={() => setQuestionIdx(questionIdx - 1)}>voltar questao</button></li>
                                    <li><button className={styles.btn} onClick={() => {
                                        if (questionIdx !== 9) {
                                            setQuestionIdx(questionIdx + 1)
                                        } else {
                                            if (respostas.length !== 10) {
                                                alert("Responda todas as alternativas")
                                            } else {
                                                verifyRespostas();
                                                setVisibleResult(true)
                                            }
                                        }
                                    }}>Confirmar Resposta</button></li>
                                </ul></div>
                        </div>
                    </>
                ) : (
                    <><h1>Procurando questao</h1></>
                )}
            </div>
        </div>
    )
} 