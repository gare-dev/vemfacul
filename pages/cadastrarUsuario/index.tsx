
import s from "@/styles/cadastrarusuario.module.scss";
import inputs from "@/utils/inputs";
import { useState } from "react";


export default function CadastrarUsuario() {
    const [step, setStep] = useState(0)


    return (
        <div className={s.mainDiv}>
            <div className={s.formDiv}>
                <img src="/assets/img/logo.png" alt="Logo" className={s.image} />

                <div className={s.titleDiv}>
                    <p className={s.titleText}>{inputs[step].title}</p>
                </div>
                <div className={s.subtitleDiv}>
                    <p className={s.subtitleText}>{inputs[step].subtitle}</p>
                </div>
                {
                    inputs[step].type === "select" ? (
                        <div className={s.selectDiv}>
                            <select className={s.select} onChange={() => { }}>
                                {inputs[step].niveis?.map((nivel, index) => (
                                    <option key={index} value={nivel}>{nivel}</option>
                                ))}
                            </select>
                        </div>
                    ) : inputs[step].type === "text" ? (
                        <div className={s.inputDiv}>
                            <input placeholder={inputs[step].placeholder} className={s.input} type="text" />
                        </div>
                    ) : (
                        <input type={inputs[step].type} />
                    )
                }

                <div className={s.nextDiv}>
                    <button onClick={() => setStep(step + 1)} className={s.button}>Continuar</button>
                </div>
                <div className={s.barDiv}>
                    <div className={s.barDiv2}>
                        <div style={{ width: `${step * 10}%` }} className={s.bar} />
                    </div>
                </div>

            </div>
            <div className={s.profileDiv}>

            </div>
        </div>
    );
}