import { MdOutlineLocationOn } from "react-icons/md";
import s from "@/styles/miniprofile.module.scss";

interface props {
    name: string | undefined
    estado: string | undefined
    interesses: string[] | undefined | string
    level: "Aluno EM" | "Universitário" | "Vestibulando" | "Professor"
    photo: File | Blob | MediaSource
    escola: string | undefined
    ano: string | undefined
    step: number
}



export default function MiniProfile(props: props) {

    function getEmoji(level: "Aluno EM" | "Universitário" | "Vestibulando" | "Professor" | ""): string {

        const emojis = {
            "Aluno EM": () => "📚",
            "Universitário": () => "🎓",
            "Vestibulando": () => "✍️",
            "Professor": () => "👨‍🏫",
            "": () => ""
        }

        return emojis[level]()
    }
    return (
        <div className={s.mainDiv}>
            <div className={s.imageDiv}>
                {props.step >= 1 && <img src={URL.createObjectURL(props.photo)} alt="" />}
            </div>
            <div className={s.nameDiv}>
                <p>{props.name}{getEmoji(props.level)}</p>

            </div>
            <div className={s.schoolDiv}>
                <p>{props.ano} {props.escola}</p>
            </div>
            <div className={s.locationDiv}>
                {(props.estado && props.step >= 2) && <p><MdOutlineLocationOn className={s.icon} />{props.estado}</p>}
            </div>
            <div className={s.subjectsDiv}>
                <p>{Array.isArray(props.interesses) ? props.interesses?.map((interesse, index) => {
                    return (
                        `${index > 0 ? ', ' : ''}${interesse}`
                    )
                }) : props.interesses}</p>
            </div>

        </div>
    )

}