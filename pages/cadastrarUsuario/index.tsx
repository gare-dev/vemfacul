
import MiniProfile from "@/components/MiniProfile";
import s from "@/styles/cadastrarusuario.module.scss";
import inputs, { inputAlunoEM, professorInputs, universitarioInputs, vestibulandoInputs } from "@/utils/inputs";
import { useEffect, useState } from "react";


export default function CadastrarUsuario() {
    const [step, setStep] = useState(0)
    const [nivel, setNivel] = useState("")

    useEffect(() => {
        console.log(step)
    }, [step])

    useEffect(() => {
        console.log(nivel)
    }, [nivel])

    function renderInputAlunoEM() {
        switch (inputAlunoEM[step - 4].type) {
            case "textEscola":
                return (
                    <div className={s.inputDivAluno}>
                        <input placeholder={inputAlunoEM[step - 4].placeholder} type="text" className={s.inputAlunoEscola} />

                    </div>
                )
            case "selectAno":
                return (
                    <select className={s.select} name="" id="">
                        {inputAlunoEM[step - 4].opcoes?.map((opcao, index) => (
                            <option className={s.option} key={index} value={opcao}>{opcao}</option>
                        ))}
                    </select>
                )
            case "selectVestibular":
                return (
                    <div className={s.optionsDiv}>
                        {inputAlunoEM[step - 4].opcoes?.map((opcao, index) => (
                            <div className={s.optionDiv}>
                                <p key={index}>{opcao}</p>

                            </div>
                        ))}
                    </div>
                )
        }
    }

    function renderUniversitario() {
        switch (universitarioInputs[step - 4].type) {
            case "textEscola":
                return (
                    <div className={s.inputDivAluno}>
                        <input type="text" placeholder={universitarioInputs[step - 4].placeholder} />
                    </div>

                )
            case "selectProcesso":
                return (
                    <div className={s.universitarioSimNaoDiv}>
                        <div>
                            <p>Sim</p>
                        </div>
                        <div>
                            <p>Não</p>
                        </div>
                    </div>

                )
            case "textCurso":
                return (
                    <div className={s.inputDivAluno}>
                        <input type="text" placeholder={universitarioInputs[step - 4].placeholder} />

                    </div>
                )
        }
    }

    function renderVestibulando() {
        switch (vestibulandoInputs[step - 4].type) {
            case "selectEM":
                return (
                    <>
                        {vestibulandoInputs[step - 4].opcoes?.map((opcao, index) => (
                            <div key={index}>{opcao}</div>
                        ))}
                    </>
                )
            case "textEscola":
                return (
                    <div>
                        <input type="text" />
                    </div>

                )
            case "selectVestibular":
                return (
                    <div>
                        {vestibulandoInputs[step - 4].opcoes?.map((opcao, index) => (
                            <p key={index}>{opcao}</p>
                        ))}
                    </div>
                )
        }
    }

    function renderProfessor() {
        switch (professorInputs[step - 4].type) {
            case "textEscola":
                return (
                    <input type="text" />
                )
            case "textArea":
                return (
                    <div>
                        {professorInputs[step - 4].opcoes?.map((opcao, index) => (
                            <p key={index}>{opcao}</p>
                        ))}
                    </div>
                )

        }

    }
    return (
        <div className={s.mainDiv}>
            <div className={s.formDiv}>
                <img src="/assets/img/logo.png" alt="Logo" className={s.image} />
                {
                    inputs[step]?.type === "selectImage" ? (
                        <>
                            <div className={s.titleDiv}>
                                <p className={s.titleText}>{inputs[step].title}</p>
                            </div>
                            <div className={s.subtitleDiv}>
                                <p className={s.subtitleText}>{inputs[step].subtitle}</p>
                            </div>
                            <div className={s.selectDiv}>
                                <label htmlFor="file-upload" className={s.customFileLabel}>
                                    Selecionar imagem
                                </label>
                                <input
                                    type="file"
                                    id="file-upload"
                                    style={{ display: "none" }}
                                // onChange={handleFileChange}
                                />

                            </div>
                        </>
                    ) : inputs[step]?.type === "textName" ? (<>
                        <div className={s.titleDiv}>
                            <p className={s.titleText}>{inputs[step].title}</p>
                        </div>
                        <div className={s.subtitleDiv}>
                            <p className={s.subtitleText}>{inputs[step].subtitle}</p>
                        </div>
                        <div className={s.inputDiv}>
                            <input placeholder={inputs[step].placeholder} className={s.input} type="text" />
                        </div></>
                    ) : inputs[step]?.type === "selectEstado" ? (
                        <>
                            <div className={s.titleDiv}>
                                <p className={s.titleText}>{inputs[step].title}</p>
                            </div>
                            <div className={s.subtitleDiv}>
                                <p className={s.subtitleText}>{inputs[step].subtitle}</p>
                            </div>
                            <div>
                                <select className={s.select} name="" id="">
                                    {inputs[step].opcoes?.map((opcao, index) => (
                                        <option className={s.selectOption} key={index} value={opcao}>{opcao}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    ) : inputs[step]?.type === "optionsNivel" ? (
                        <>
                            <div className={s.titleDiv}>
                                <p className={s.titleText}>{inputs[step].title}</p>
                            </div>
                            <div className={s.subtitleDiv}>
                                <p className={s.subtitleText}>{inputs[step].subtitle}</p>
                            </div>
                            <div className={s.optionsDiv}>
                                {inputs[step].opcoes?.map((opcao, index) => (
                                    <div onClick={(e) => { setNivel(opcao); setStep(step + 1) }} className={s.optionDiv} key={index}>
                                        <p>{opcao}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) :
                        nivel === "Aluno EM" ? (
                            <>
                                <div className={s.titleDiv}>
                                    <p className={s.titleText}>{inputAlunoEM[step - 4].title}</p>
                                </div>
                                <div className={s.subtitleDiv}>
                                    <p className={s.subtitleText}>{inputAlunoEM[step - 4].subtitle}</p>
                                </div>

                                {renderInputAlunoEM()}
                            </>
                        ) :
                            nivel === "Vestibulando" ? (
                                <>
                                    <div>
                                        <div className={s.titleDiv}>
                                            <p className={s.titleText}>{vestibulandoInputs[step - 4].title}</p>
                                        </div>
                                        <div className={s.subtitleDiv}>
                                            <p className={s.subtitleText}>{vestibulandoInputs[step - 4].subtitle}</p>
                                        </div>
                                        {renderVestibulando()}
                                    </div>

                                </>

                            ) : nivel === "Universitário" ? (

                                <>
                                    <div className={s.titleDiv}>
                                        <p className={s.titleText}>{universitarioInputs[step - 4].title}</p>
                                    </div>
                                    <div className={s.subtitleDiv}>
                                        <p className={s.subtitleText}>{universitarioInputs[step - 4].subtitle}</p>
                                    </div>
                                    {renderUniversitario()}
                                </>

                            ) :
                                nivel === "Professor" ? (
                                    <div>
                                        <div className={s.titleDiv}>
                                            <p className={s.titleText}>{professorInputs[step - 4].title}</p>
                                        </div>
                                        <div className={s.subtitleDiv}>
                                            <p className={s.subtitleText}>{professorInputs[step - 4].subtitle}</p>
                                        </div>
                                        {renderProfessor()}
                                    </div>
                                ) :
                                    (
                                        <div></div>

                                    )
                }

                <div className={s.nextDiv}>
                    {step !== 3 ? <button onClick={() => setStep(step + 1)} className={s.button}>Continuar</button> : null}
                    <button onClick={() => setStep(step - 1)} className={s.buttonBack}>Voltar</button>
                </div>
                <div className={s.barDiv}>
                    <div className={s.barDiv2}>
                        <div style={{ width: `${step * 10}%` }} className={s.bar} />
                    </div>
                </div>

            </div>
            <div className={s.profileDiv}>
                <MiniProfile />

            </div>
        </div>
    );
}