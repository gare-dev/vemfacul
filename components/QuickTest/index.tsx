import Api from '@/api';
import { useState, useEffect } from 'react';
import styles from '@/styles/questoes.module.scss';
import { useRouter } from 'next/router';

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



export default function QuickTest() {
    const router = useRouter()
    const [questions, setQuestions] = useState<Question[]>([]);
    const [year, setYear] = useState<number | null>(null);
    const [offset, setOffSet] = useState<number>(Number)
    const diciplinas: Disciplina[] = [
        { titulo: "Linguagens", idx: 1 },
        { titulo: "CIencias Humanas", idx: 46 },
        { titulo: "Ciencias da Natureza", idx: 91 },
        { titulo: "Matemátiaca", idx: 146 }
    ];
    const [span, setSpan] = useState('')
    const [questionIdx, setQuestionIdx] = useState<number | 0>(Number)
    const [isvisible, setIsVisible] = useState(true)
    const [isvisibleResult, setVisibleResult] = useState(false)
    const [respostas, setRespostas] = useState<string[]>([])
    const [verify, setVerify] = useState<boolean[]>([])

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
            const require = await Api.questoes(y, gerarQuestoes(idxQuestion))
            if (require.status === 200) {
                setQuestions(require.data.questions);
            } else {
                setSpan(`${require.status}`)
            }
        } catch (error) {
            console.log(error);
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
            console.log("FrontEndo: ",+question.index, question.year, question.discipline, alternativa ? alternativa.isCorrect : false)
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
            {isvisibleResult && (
                <>
                    <div className={styles.container_resultado}>
                        <div className={styles.content}>
                            <h1>Resultado</h1>
                            <div className={styles.ul_resultados}>
                                <ul>
                                    {verify.map((resp, idx) => (
                                        <li key={idx}>
                                            <button onClick={() => router.push(`/exercicios/correcao/${questions[questionIdx].index}`)}>{idx + 1} - {resp ? 'Correta' : 'Incorreta'}</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className={styles.container_actions}>
                                <div className={styles.options}>
                                    <ul>
                                        <li><button className={styles.btn} onClick={() => {
                                            router.reload()
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
                    const intOffSet = Number(formData.get("diciplina"))
                    if (intYear >= 2009 && intYear <= 2023) {
                        setOffSet(intOffSet)
                        setYear(intYear);
                    } else {
                        setSpan('Digite um ano entre 2009 e 2023')
                    }
                }}>
                    {span}
                    <div className={styles.container_diciplinas}>
                        <h2>Escolha a diciplina</h2>
                        <div className={styles.content}>
                            <select name="diciplina" id="diciplina">
                                {diciplinas.map((d, idx) => (
                                    <option key={idx} value={d.idx}>{d.titulo}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <label htmlFor="year">Qual o ano da questao</label>
                    <input type="text" name="year" placeholder='digite o ano das questoes' />
                    <button type='submit' className={styles.btn}>Enviar</button>
                </form></>
            )
            }
            <div className={styles.container}>
                {questions.length > 0 ? (
                    <>
                        <div key={`${questions[+questionIdx].index}`} className={styles.card}>
                            <div className={styles.headre}>
                                <h1>{questions[+questionIdx].title}</h1>
                                <h2>{questionIdx + 1}. SIMULADO - VEMFACUL</h2>
                                <p>{questions[+questionIdx].context}</p>
                                <br />
                                {questions[+questionIdx].files && (
                                    <img src={questions[+questionIdx].files[0]} alt="" />
                                )}
                                <h3>{questions[+questionIdx].alternativesIntroduction}</h3>
                                <br />
                            </div>
                            <div className={styles.alternativas}>
                                {questions[+questionIdx].alternatives.map((a, idx) => (
                                    <div key={idx} className={styles.alternativa}>
                                        <h2>{a.letter}</h2>
                                        <input type="radio" name={`resposta-${questionIdx}`}
                                            checked={respostas[questionIdx] === a.letter}
                                            onChange={() => {
                                                const novaResposta = [...respostas];
                                                novaResposta[questionIdx] = a.letter;
                                                setRespostas(novaResposta);
                                            }} />
                                        <h2>{a.text}</h2>
                                        {a.file && (
                                            <img src={a.file} alt="" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.container_actions}>
                            <div className={styles.options}>
                                <ul>
                                    <li><button className={styles.btn} id={styles.voltar} onClick={() => setQuestionIdx(prev => Math.max(prev - 1, 0))}>voltar questao</button></li>
                                    <li><button className={styles.btn} onClick={() => {
                                        if (questionIdx < questions.length - 1) {
                                            setQuestionIdx(questionIdx + 1)
                                            console.log(respostas.length)
                                        } else {
                                            if (respostas.length !== questions.length) {
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