import Api from "@/api";
import useCalendarData from "@/hooks/useCalendarData";
import useOpenPopup from "@/hooks/useOpenPopup";
import s from "@/styles/popup.module.scss"
import getCookieValue from "@/utils/getCookie";


interface props {
    isVisible: boolean
    setIsVisible: () => void
}

export default function Popup(props: props) {
    const { calendarData } = useCalendarData()
    const { setIsOpen } = useOpenPopup()


    function getMonth(month: number) {
        const days = {
            0: "01",
            1: "02",
            2: "03",
            3: "04",
            4: "05",
            5: "06",
            6: "07",
            7: "08",
            8: "09",
            9: "10",
            10: "11",
            11: "12"
        }
        return days[month as keyof typeof days]
    }

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
                        <div className={s.imageDiv}>
                            <img className={s.image} src={calendarData.foto} alt="" />
                        </div>
                        <p>{`${padZero(calendarData.day)}/${getMonth(calendarData.month)}/${calendarData.year}`}</p>
                    </div>
                    <div className={s.titleAndDescDiv}>
                        <div className={s.titleDiv}>
                            <a style={{ color: calendarData.color }} className={s.title}>{calendarData.cursinho}:</a>
                            <a href={calendarData.link} style={{ textDecoration: "underline" }} className={s.type}>{calendarData.title}</a>
                        </div>
                        <div className={s.descDiv}>
                            <p>{calendarData.descricao}</p>
                        </div>
                    </div>
                </div>

                <div className={s.closeDiv}>
                    <p onClick={() => props.setIsVisible()} className={s.closeText}>X</p>
                </div>
                <div onClick={() => saveEvent()} className={s.addDiv}>
                    <p>+</p>
                </div>
            </div>


        </div >)
    );

}