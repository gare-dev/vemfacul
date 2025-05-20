import Api from "@/api";
import useCalendarData from "@/hooks/useCalendarData";
import useOpenPopup from "@/hooks/useOpenPopup";
import s from "@/styles/popup.module.scss"
import getCookieValue from "@/utils/getCookie";


interface props {
    isVisible: boolean
    setIsVisible: () => void
    canAdd: boolean
}

export default function Popup(props: props) {
    const { calendarData } = useCalendarData()
    const { setIsOpen } = useOpenPopup()

    function padZero(n: number): string {
        return n < 10 ? `0${n}` : `${n}`;
    }

    async function saveEvent() {
        if (!getCookieValue("auth")) {
            return setIsOpen(true)
        }

        try {
            const response = await Api.insertPersonalEvent(calendarData.day, calendarData.month, calendarData.year, calendarData.title, calendarData.cursinho, calendarData.descricao, calendarData.foto, calendarData.link, calendarData.type, calendarData.color, calendarData.main_title)
            if (response.data.code === "EVENT_ADDED") {
                console.log("REGISTROu")
            }
        } catch (error) {
            console.log("NAo REGISTROu" + error)

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
                        <p>{`${padZero(calendarData.day)}/${calendarData.month + 1}/${calendarData.year}`}</p>
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
                                <span className={s.type}>{calendarData.title}</span>
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
                {props.canAdd &&
                    (<div onClick={() => saveEvent()} className={s.addDiv}>
                        <p>+</p>
                    </div>
                    )}
            </div>


        </div >)
    );

}