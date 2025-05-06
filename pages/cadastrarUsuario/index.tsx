
import Api from "@/api";
import MiniProfile from "@/components/MiniProfile";
import RegisterAccountLoadingComponent from "@/components/RegisterAccountLoadingComponent";
import useEmail from "@/hooks/useEmail";
import s from "@/styles/cadastrarusuario.module.scss";
import { Register } from "@/types/registerType";
import inputs, { inputAlunoEM, inputVestibulando, professorInputs, universitarioInputs, vestibulandoInputs } from "@/utils/inputs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


export default function CadastrarUsuario() {
    const [step, setStep] = useState(0)
    const [nivel, setNivel] = useState("")
    const [isFinish, setIsfinish] = useState(true)
    const router = useRouter()
    const [isLoading, setIsloading] = useState(false)
    const { email } = useEmail()
    const [user, setUser] = useState<Register>({
        nome: "",
        foto: null,
        estado: "SP",
        nivel: "",
        escola: "",
        ano: "1°",
        vestibulares: [],
        materiasLecionadas: [],
        passouVestibular: false,
        universidade: "",
        curso: "",
        formouEM: false,
        trabalha: false,
        instituicao: "",
    })

    useEffect(() => {
        console.log(nivel)
    }, [nivel])


    function handleSubmit(level: string) {
        const functions = {
            alunoEM: async () => {

                const userData = {
                    nome: user.nome,
                    estado: user.estado,
                    nivel: nivel,
                    escola: user.escola,
                    ano: user.ano,
                    vestibulares: user.vestibulares,
                    email: email
                }

                const formData = new FormData()
                formData.append('userData', JSON.stringify(userData))

                if (user.foto instanceof File) {
                    formData.append('imagem', user.foto);
                }

                try {
                    setIsloading(true)
                    const response = await Api.createAccount(formData)

                    if (response.data.code === "REGISTERED_ACCOUNT") {
                        router.push('/feed')
                    }
                } catch (error) {
                    console.log(error)
                }

            },
            alunoVestibular: async () => {
                const userData = {
                    nome: user.nome,
                    estado: user.estado,
                    nivel: nivel,
                    formouEM: user.formouEM,
                    trabalha: user.trabalha,
                    vestibulares: user.vestibulares,
                    email: email
                }

                const formData = new FormData()
                formData.append('userData', JSON.stringify(userData))

                if (user.foto instanceof File) {
                    formData.append('imagem', user.foto);
                }

                try {
                    setIsloading(true)
                    const response = await Api.createAccount(formData)

                    if (response.data.code === "REGISTERED_ACCOUNT") {
                        router.push('/feed')
                    }
                } catch (error) {
                    console.log(error)
                }

            },
            universitario: async () => {
                const userData = {
                    nome: user.nome,
                    estado: user.estado,
                    nivel: nivel,
                    passouVestibular: user.passouVestibular,
                    universidade: user.universidade,
                    curso: user.curso,
                    email: email
                }

                const formData = new FormData()
                formData.append('userData', JSON.stringify(userData))

                if (user.foto instanceof File) {
                    formData.append('imagem', user.foto);
                }

                try {
                    setIsloading(true)
                    const response = await Api.createAccount(formData)

                    if (response.data.code === "REGISTERED_ACCOUNT") {
                        router.push('/feed')
                    }
                } catch (error) {
                    console.log(error)
                }
            },
            outroLevel: () => {
                console.log('Função para outroLevel');

            },

        };


        (functions[level as keyof typeof functions])();
    }

    function updateState(state: string, value: string | boolean | File | null) {
        setUser(prev => {
            if (state === "vestibulares" && typeof value === "string") {
                const jaSelecionado = prev.vestibulares?.includes(value);
                return {
                    ...prev,
                    vestibulares: jaSelecionado
                        ? prev.vestibulares?.filter(v => v !== value)
                        : [...(prev.vestibulares ?? ""), value],
                };
            }

            if (state === "materiasLecionadas" && typeof value === "string") {
                const jaSelecionado = prev.materiasLecionadas?.includes(value);
                return {
                    ...prev,
                    materiasLecionadas: jaSelecionado
                        ? prev.materiasLecionadas?.filter(v => v !== value)
                        : [...(prev.materiasLecionadas ?? ""), value],
                };
            }

            return {
                ...prev,
                [state]: value,
            };
        });
    }



    const checkMandatoryFields = () => {
        if (user.nome === "") {
            alert("Nome é obrigatório")

            return false
        }
    }

    useEffect(() => {
        if (inputAlunoEM[step - 4]?.type === "finished") {
            return handleSubmit("alunoEM");
        }
        if (inputVestibulando[step - 4]?.type === "finished") {
            return handleSubmit("alunoVestibular");
        }
        if (universitarioInputs[step - 4]?.type === "finished") {
            return handleSubmit("universitario");
        }
    }, [step]);



    useEffect(() => {
        if (step !== 0) {
            checkMandatoryFields();
        }
    }, [step]);



    function renderInputAlunoEM() {
        switch (inputAlunoEM[step - 4]?.type) {
            case "textEscola":
                return (
                    <div className={s.inputDivAluno}>
                        <input maxLength={30} value={user.escola} onChange={(e) => updateState("escola", e.target.value)} placeholder={inputAlunoEM[step - 4].placeholder} type="text" className={s.inputAlunoEscola} />
                    </div>
                )
            case "selectAno":
                return (
                    <select value={user.ano} onChange={(e) => updateState("ano", e.target.value)} className={s.select} name="" id="">
                        {inputAlunoEM[step - 4].opcoes?.map((opcao, index) => (
                            <option className={s.option} key={index} value={opcao}>{opcao}</option>
                        ))}
                    </select>
                )
            case "selectVestibular":
                return (
                    <div className={s.optionsDiv}>
                        {inputAlunoEM[step - 4].opcoes?.map((opcao, index) => {
                            const selecionado = user.vestibulares?.includes(opcao);

                            return (
                                <div
                                    key={index}
                                    onClick={() => updateState("vestibulares", opcao)}
                                    style={selecionado ? { backgroundColor: "#777CFE" } : { backgroundColor: "transparent" }}
                                    className={`${s.optionDiv}`}
                                >
                                    <p>{opcao}</p>
                                </div>
                            );
                        })}
                    </div>
                )
            case "finished":
                return (
                    isLoading ? (
                        <div className={s.divAlunoEMLoading}>
                            <RegisterAccountLoadingComponent />
                        </div>
                    ) :
                        <div className={s.divAlunoEMFinalizar}>

                            <div>
                                <p>Conta Registrada! Aperte no botão <p style={{ color: "#777CFE", fontWeight: 600 }}>FINALIZAR</p><p> para ser redirecionado ao nosso feed.</p></p>
                            </div>
                        </div>
                )

        }
    }

    function renderUniversitario() {
        switch (universitarioInputs[step - 4]?.type) {
            case "textEscola":
                return (
                    <div className={s.inputDivAluno}>
                        <input value={user.universidade} onChange={(e) => updateState("universidade", e.target.value)} type="text" placeholder={universitarioInputs[step - 4].placeholder} />
                    </div>

                )
            case "selectProcesso":
                return (
                    <div className={s.universitarioSimNaoDiv}>
                        <div style={user.passouVestibular ? { backgroundColor: "#777CFE" } : { backgroundColor: "transparent" }} onClick={() => updateState("passouVestibular", true)} >
                            <p>Sim</p>
                        </div>
                        <div style={!user.passouVestibular ? { backgroundColor: "#777CFE" } : { backgroundColor: "transparent" }} onClick={() => updateState("passouVestibular", false)} >
                            <p>Não</p>
                        </div>
                    </div>

                )
            case "textCurso":
                return (
                    <div className={s.inputDivAluno}>
                        <input value={user.curso} onChange={(e) => updateState("curso", e.target.value)} type="text" placeholder={universitarioInputs[step - 4].placeholder} />
                    </div>
                )
            case "finished":
                return (
                    !isLoading ? (
                        <div className={s.divAlunoEMLoading}>
                            <RegisterAccountLoadingComponent />
                        </div>
                    ) :
                        <div className={s.divAlunoEMFinalizar}>

                            <div>
                                <p>Conta Registrada! Aperte no botão <p style={{ color: "#777CFE", fontWeight: 600 }}>FINALIZAR</p><p> para ser redirecionado ao nosso feed.</p></p>
                            </div>
                        </div>
                )

        }
    }

    function renderVestibulando() {
        switch (vestibulandoInputs[step - 4]?.type) {
            case "selectEM":
                return (
                    <div className={s.vestibulandoDiv}>
                        {vestibulandoInputs[step - 4].opcoes?.map((opcao, index) => (
                            <div style={(user.formouEM ? "Sim" : "Não") === opcao ? { backgroundColor: "#777CFE" } : { backgroundColor: "transparent" }} onClick={() => updateState("formouEM", (opcao === "Sim" ? true : false))} key={index}>
                                <p>{opcao}</p>
                            </div>
                        ))
                        }
                    </div >
                )
            case "textEscola":
                return (
                    <div className={s.inputVestibulando}>
                        {vestibulandoInputs[step - 4].opcoes?.map((opcao, index) => (
                            <div style={(user.trabalha ? "Sim" : "Não") === opcao ? { backgroundColor: "#777CFE" } : { backgroundColor: "transparent" }} onClick={() => updateState("trabalha", (opcao === "Sim" ? true : false))} key={index}>
                                <p>{opcao}</p>
                            </div>
                        ))}
                    </div>

                )
            case "selectVestibular":
                return (
                    <div className={s.vestibulandoDiv}>
                        {vestibulandoInputs[step - 4].opcoes?.map((opcao, index) => {
                            const selecionado = user.vestibulares?.includes(opcao);


                            return (
                                <div
                                    key={index}
                                    onClick={() => updateState("vestibulares", opcao)}
                                    style={selecionado ? { backgroundColor: "#777CFE" } : { backgroundColor: "transparent" }}
                                    className={`${s.optionDiv}`}
                                >
                                    <p key={index}>{opcao}</p>
                                </div>
                            )
                        })}
                    </div>
                )
            case "finished":
                return (
                    !isLoading ? (
                        <div className={s.divAlunoEMLoading}>
                            <RegisterAccountLoadingComponent />
                        </div>
                    ) :
                        <div className={s.divAlunoEMFinalizar}>

                            <div>
                                <p>Conta Registrada! Aperte no botão <p style={{ color: "#777CFE", fontWeight: 600 }}>FINALIZAR</p><p> para ser redirecionado ao nosso feed.</p></p>
                            </div>
                        </div>
                )
        }
    }

    function renderProfessor() {
        switch (professorInputs[step - 4]?.type) {
            case "textEscola":
                return (
                    <div className={s.inputDivAluno}>
                        <input value={user.instituicao} onChange={(e) => updateState("instituicao", e.target.value)} type="text" placeholder={professorInputs[step - 4].placeholder} />
                    </div>
                )
            case "textArea":
                return (
                    <div className={s.inputProfessorOpcoesDiv}>
                        {professorInputs[step - 4].opcoes?.map((opcao, index) => {
                            const selecionado = user.materiasLecionadas?.includes(opcao);

                            return (
                                <div
                                    key={index}
                                    onClick={() => updateState("materiasLecionadas", opcao)}
                                    style={selecionado ? { backgroundColor: "#777CFE" } : { backgroundColor: "transparent" }}
                                    className={`${s.optionDiv}`}
                                >
                                    <p>{opcao}</p>
                                </div>
                            )
                        })}
                    </div>
                )
            case "finished":
                return (
                    !isLoading ? (
                        <div className={s.divAlunoEMLoading}>
                            <RegisterAccountLoadingComponent />
                        </div>
                    ) :
                        <div className={s.divAlunoEMFinalizar}>

                            <div>
                                <p>Conta Registrada! Aperte no botão <p style={{ color: "#777CFE", fontWeight: 600 }}>FINALIZAR</p><p> para ser redirecionado ao nosso feed.</p></p>
                            </div>
                        </div>
                )

        }

    }

    useEffect(() => {
        const tipo =
            nivel === "Aluno EM" ? inputAlunoEM[step - 4]?.type :
                nivel === "Vestibulando" ? vestibulandoInputs[step - 4]?.type :
                    nivel === "Universitário" ? universitarioInputs[step - 4]?.type :
                        nivel === "Professor" ? professorInputs[step - 4]?.type :
                            null;

        if (tipo === "finished") {
            return setIsfinish(true);
        }
        setIsfinish(false);
    }, [step, nivel]);

    useEffect(() => {
        if (step < 0) {
            setStep(0)
        }
    }, [step])



    return (
        <div className={s.mainDiv}>
            <div className={s.formDiv}>
                <img src="/assets/img/logo.png" alt="Logo" className={s.image} />
                {
                    inputs[step]?.type === "selectImage" ? (
                        <>
                            <div className={s.titleDiv}>
                                <p className={s.titleText}>{inputs[step]?.title}</p>
                            </div>
                            <div className={s.subtitleDiv}>
                                <p className={s.subtitleText}>{inputs[step]?.subtitle}</p>
                            </div>
                            <div className={s.selectDiv}>
                                <label htmlFor="file-upload" className={s.customFileLabel}>
                                    Selecionar imagem
                                </label>
                                <input
                                    onChange={(e) =>
                                        updateState("foto", e.target.files?.[0] ?? null)
                                    }
                                    type="file"
                                    id="file-upload"
                                    style={{ display: "none" }}
                                />
                            </div>
                        </>
                    ) : inputs[step]?.type === "textName" ? (
                        <>
                            <div className={s.titleDiv}>
                                <p className={s.titleText}>{inputs[step]?.title}</p>
                            </div>
                            <div className={s.subtitleDiv}>
                                <p className={s.subtitleText}>{inputs[step]?.subtitle}</p>
                            </div>
                            <div className={s.inputDiv}>

                                <input value={user.nome} onChange={(e) => updateState("nome", e.target.value)} placeholder={inputs[step].placeholder} className={s.input} type="text" />
                            </div>
                        </>
                    ) : inputs[step]?.type === "selectEstado" ? (
                        <>
                            <div className={s.titleDiv}>
                                <p className={s.titleText}>{inputs[step]?.title}</p>
                            </div>
                            <div className={s.subtitleDiv}>
                                <p className={s.subtitleText}>{inputs[step]?.subtitle}</p>
                            </div>
                            <div>
                                <select value={user.estado} onChange={(e) => updateState("estado", e.target.value)} className={s.select} name="" id="">
                                    {inputs[step].opcoes?.map((opcao, index) => (
                                        <option className={s.selectOption} key={index} value={opcao}>{opcao}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    ) : inputs[step]?.type === "optionsNivel" ? (
                        <>
                            <div className={s.titleDiv}>
                                <p className={s.titleText}>{inputs[step]?.title}</p>
                            </div>
                            <div className={s.subtitleDiv}>
                                <p className={s.subtitleText}>{inputs[step]?.subtitle}</p>
                            </div>
                            <div className={s.optionsDiv}>
                                {inputs[step].opcoes?.map((opcao, index) => (
                                    <div style={opcao === nivel ? { backgroundColor: "#777CFE" } : { backgroundColor: "transparent" }} onClick={() => { setNivel(opcao); setStep(step + 1); updateState("nivel", opcao) }} className={s.optionDiv} key={index}>
                                        <p>{opcao}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) :
                        nivel === "Aluno EM" ? (
                            <>
                                <div className={s.titleDiv}>
                                    <p className={s.titleText}>{inputAlunoEM[step - 4]?.title}</p>
                                </div>
                                <div className={s.subtitleDiv}>
                                    <p className={s.subtitleText}>{inputAlunoEM[step - 4]?.subtitle}</p>
                                </div>

                                {renderInputAlunoEM()}
                            </>
                        ) :
                            nivel === "Vestibulando" ? (
                                <>
                                    <div>
                                        <div className={s.titleDiv}>
                                            <p className={s.titleText}>{vestibulandoInputs[step - 4]?.title}</p>
                                        </div>
                                        <div className={s.subtitleDiv}>
                                            <p className={s.subtitleText}>{vestibulandoInputs[step - 4]?.subtitle}</p>
                                        </div>
                                        {renderVestibulando()}
                                    </div>

                                </>

                            ) : nivel === "Universitário" ? (

                                <>
                                    <div className={s.titleDiv}>
                                        <p className={s.titleText}>{universitarioInputs[step - 4]?.title}</p>
                                    </div>
                                    <div className={s.subtitleDiv}>
                                        <p className={s.subtitleText}>{universitarioInputs[step - 4]?.subtitle}</p>
                                    </div>
                                    {renderUniversitario()}
                                </>

                            ) :
                                nivel === "Professor" ? (
                                    <div>
                                        <div className={s.titleDiv}>
                                            <p className={s.titleText}>{professorInputs[step - 4]?.title}</p>
                                        </div>
                                        <div className={s.subtitleDiv}>
                                            <p className={s.subtitleText}>{professorInputs[step - 4]?.subtitle}</p>
                                        </div>
                                        {renderProfessor()}
                                    </div>
                                ) :
                                    (
                                        <div></div>
                                    )
                }

                <div className={s.nextDiv}>
                    {step !== 3 ? <button onClick={
                        () => {
                            const validMandatory = checkMandatoryFields()
                            if (validMandatory !== false) {
                                setStep(!isFinish ? step + 1 : step);
                            }


                        }} className={s.button}>{step === 1 ? user.foto ? "Continuar" : "Pular " : isFinish !== true ? "Continuar" : "Finalizar"}</button> : null}
                    {!isFinish && <button disabled={isFinish ? true : false} onClick={() => setStep(step - 1)} className={s.buttonBack}>Voltar</button>}
                </div>
                <div className={s.barDiv}>
                    <div className={s.barDiv2}>
                        <div style={{ width: `${step * 15}%` }} className={s.bar} />
                    </div>
                </div>

            </div>
            <div className={s.profileDiv}>
                <MiniProfile
                    step={step}
                    ano={nivel === "Aluno EM" ? user.ano + " Ano," : ""}
                    escola={nivel === "Aluno EM" ? user.escola : nivel === "Universitário" ? user.universidade : user.instituicao}
                    photo={user.foto ?? new Blob()}
                    level={nivel as "Aluno EM" | "Universitário" | "Vestibulando" | "Professor"}
                    name={user.nome}
                    estado={user.estado}
                    interesses={nivel === "Aluno EM" ? user.vestibulares : nivel === "Universitário" ? user.curso : user.materiasLecionadas} />

            </div>
        </div>
    );
}