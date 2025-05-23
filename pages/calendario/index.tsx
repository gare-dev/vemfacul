import Api from "@/api"
import Header from "@/components/Header"
import Popup from "@/components/Popup"
import PopupFilter from "@/components/PopupFilter"
import DemoWrapper from "@/hooks/DemoWrapper"
import useCalendarData from "@/hooks/useCalendarData"
import styles from "@/styles/calendario.module.scss"
import PopupType from "@/types/data"
import { FiltrosType } from "@/types/filtrosType"
import { useEffect, useState } from "react"



export default function Calendario() {
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [hasOpened, setHasOpened] = useState<boolean>(false)
    const { calendarData } = useCalendarData()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [popupVisible, setPopupVisible] = useState<boolean>(false)
    const [events, setEvents] = useState<PopupType[]>([])
    const [originalEvents, setOriginalEvents] = useState<PopupType[]>([])
    const [filtroEventos, setFiltroEventos] = useState<FiltrosType[]>([{
        tipoDeEvento: [],
        tipodeCursinho: []
    }]);


    function getOverview(info: "totalEvents" | "next31Days" | "next7Days" | "getRedacao" | "getSimulado" | "getTodayEvents") {

        const overview = {
            totalEvents: events.length,
            next31Days: getNext31DaysEvents(),
            next7Days: getNext7DaysEvents(),
            getRedacao: getType("redacao"),
            getSimulado: getType("simulado"),
            getTodayEvents: getTodayEvents()


        }

        return overview[info as keyof typeof overview]
    }


    const handleGetPersonalEvents = async () => {

        try {
            setIsLoading(true)
            const response = await Api.getPersonalEvents()

            if (response.data.code === "EVENTS_FOUND") {
                setEvents(response.data.data)
                setOriginalEvents(response.data.data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }

    }

    useEffect(() => {
        handleGetPersonalEvents()

    }, [])

    useEffect(() => {
        if (!hasOpened) return setHasOpened(true)
        setIsVisible(true)
    }, [calendarData])

    function getFilter() {
        if (
            filtroEventos[0].tipoDeEvento.length === 0 &&
            filtroEventos[0].tipodeCursinho.length === 0
        ) {
            setPopupVisible(false);
            return setEvents(originalEvents);
        }

        const retorno = originalEvents.filter((dado) => {
            return filtroEventos.some((f) => {
                const tipoOk = f.tipoDeEvento.length === 0 || f.tipoDeEvento.includes(dado.type);
                const cursinhoOk = f.tipodeCursinho.length === 0 || f.tipodeCursinho.includes(dado.cursinho.toLowerCase());
                return tipoOk && cursinhoOk;
            });
        });

        setPopupVisible(false);
        setEvents(retorno);
    }

    function getNext31DaysEvents() {
        const hoje = new Date();
        const limite = new Date();
        limite.setDate(hoje.getDate() + 31);

        let contador = 0;

        events.forEach((evento) => {

            const dia = evento.day
            const mes = evento.month // meses começam do zero
            const ano = evento.year

            const dataEvento = new Date(ano, mes, dia);

            if (dataEvento >= hoje && dataEvento <= limite) {
                contador++;
            }
        });

        return contador;
    }

    function getNext7DaysEvents() {
        const hoje = new Date();
        const limite = new Date();
        limite.setDate(hoje.getDate() + 7);

        let contador = 0;

        events.forEach((evento) => {

            const dia = evento.day
            const mes = evento.month // meses começam do zero
            const ano = evento.year

            const dataEvento = new Date(ano, mes, dia);

            if (dataEvento >= hoje && dataEvento <= limite) {
                contador++;
            }
        });

        return contador;
    }

    function getType(type: string) {
        let count = 0


        events.forEach((evento) => {
            if (evento.type === type) {
                count++
            }
        })
        return count
    }

    function getTodayEvents() {
        const today = new Date()
        let count = 0

        events.forEach((evento) => {

            if (+evento.day === today.getDate() && +evento.month === today.getMonth() && +evento.year === today.getFullYear()) {
                count++
                console.log("entrou")
            }
        })

        return count
    }



    useEffect(() => {
        console.log(events)

    }, [events])

    if (isLoading) {
        return (
            <div style={{
                position: "fixed",
                height: "100%",
                width: "100%",

            }}>

            </div>
        )
    }
    return (
        <>
            <Popup
                isVisible={isVisible}
                setIsVisible={() => setIsVisible(false)}
            />
            <PopupFilter
                setFiltroEventos={setFiltroEventos}
                filtroEventos={filtroEventos}
                isVisible={popupVisible}
                callFilter={() => getFilter()}
            />
            <Header />

            <div className={`${styles.eventosCountDiv} pt-16`}>
                <div className={styles.eventosBox}>
                    <div>
                        <p>{getOverview("totalEvents")}</p>
                        <h1>EVENTOS REGISTRADOS</h1>
                    </div>
                    <div>
                        <p>{getOverview("next31Days")}</p>
                        <h1>EVENTOS NOS PRÓXIMOS 31 DIAS</h1>
                    </div>
                    <div>
                        <p>{getOverview("next7Days")}</p>
                        <h1>EVENTOS NOS PRÓXIMOS 7 DIAS</h1>
                    </div>
                    <div>
                        <p>{getOverview("getTodayEvents")}</p>
                        <h1>EVENTOS HOJE</h1>
                    </div>
                    <div>
                        <p>{getOverview("getRedacao")}</p>
                        <h1>REDAÇÕES MARCADAS</h1>
                    </div>
                    <div>
                        <p>{getOverview("getSimulado")}</p>
                        <h1>SIMULADOS MARCADOS</h1>
                    </div>

                </div>
            </div>

            <div>
                <DemoWrapper
                    isEditable
                    eventos={events}
                    popUpClick={() => setIsVisible(true)}
                    popupFilterClick={() => setPopupVisible(true)}
                />

            </div>
        </>
    )
}