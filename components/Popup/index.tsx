import Api from "@/api";
import useAlert from "@/hooks/useAlert";
import useCalendarData from "@/hooks/useCalendarData";
import s from "@/styles/popup.module.scss"
import getAuth from "@/utils/getAuth";
import { IoMdAdd } from "react-icons/io";
import { MdDeleteOutline, MdModeEdit } from "react-icons/md";


interface props {
    isVisible: boolean
    setIsVisible: () => void
    canAdd: boolean
    canRemove: boolean
    canEdit: boolean
    removeFunction?: () => void
    editFunction?: () => void
}

export default function Popup(props: props) {
    const { calendarData } = useCalendarData()
    // const { setIsOpen } = useOpenPopup()
    const { showAlert } = useAlert()

    function padZero(n: number): string {
        return n < 10 ? `0${n}` : `${n}`;
    }

    async function saveEvent() {
        if (getAuth()) {
            try {
                const response = await Api.insertPersonalEvent(calendarData.day, calendarData.month, calendarData.year, calendarData.title, calendarData.cursinho, calendarData.descricao, calendarData.foto, calendarData.link, calendarData.type, calendarData.color, calendarData.main_title)
                if (response.data.code === "EVENT_ADDED") {
                    showAlert('Evento adicionado à sua agenda pessoal!', 'success')
                }
            } catch (error) {
                console.log("NAo REGISTROu" + error)
            }
        }


    }

    // TODOFIXMETODOFIXMETODOFIXMETODO
    // COLOCAR LINK PARA O CURSINHO / CERTO
    // FILTRO PARA APARECER SÓ REDAÇÃO OU SÓ SIMULADOS NO PROPRIO CALENDARIO
    //
    // "SEGUIR" CURSINHO, EU POSSO SEGUIR UM CURSINHO E TODoS OS EVENTOS QUE ELES ADICIONAREM
    // APARECE NO MEU CALENDARIO

    return (
        props.isVisible &&
        (<div className={s.mainDiv}>
            <div className={s.popupBox}>
                <div className={s.divBox}>
                    <div className={s.dateAndImageDiv}>
                        {calendarData.foto && (
                            <div className={s.imageDiv}>
                                <img className={s.image} src={calendarData.foto} alt="" />
                            </div>
                        )}
                        <p>{`${padZero(calendarData.day)}/${String(Number(calendarData.month) + 1).padStart(2, "0")}/${calendarData.year}`}</p>
                        <p>{`${calendarData.hora ?? ""} `}</p>

                    </div>
                    <div className={s.titleAndDescDiv}>
                        <div className={s.titleDiv}>
                            {calendarData.cursinho && <a style={{ color: calendarData.color }} className={s.title}>{`${calendarData.cursinho ? `${calendarData.cursinho}:` : ""}`}</a>}
                            {calendarData.link ? (
                                <a
                                    href={calendarData.link}
                                    style={{ textDecoration: calendarData.cursinho ? "underline" : "" }}
                                    className={s.type}
                                >
                                    {calendarData.title}
                                </a>
                            ) : (
                                <span style={{ color: calendarData.color }} className={s.type}>{calendarData.title}</span>
                            )}

                        </div>
                        <div className={s.descDiv}>
                            <p>{calendarData.descricao}</p>
                        </div>
                    </div>
                </div>

                <div className={s.closeDiv}>
                    <p onClick={() => props.setIsVisible()} className={s.closeText}>X</p>
                </div>
                <div className={s.bttsDiv}>
                    {props.canAdd ?
                        (<div onClick={() => saveEvent()} className={s.addDiv}>
                            <p><IoMdAdd /></p>
                        </div>
                        ) : null}
                    {props.canRemove ?
                        (<div onClick={props.removeFunction} className={s.removeDiv}>
                            <p><MdDeleteOutline />  </p>
                        </div>
                        ) : null}
                    {props.canEdit ?
                        (<div onClick={() => props.editFunction} className={s.editDiv}>
                            <p><MdModeEdit /></p>
                        </div>
                        ) : null}
                </div>

            </div>


        </div >)
    );

}