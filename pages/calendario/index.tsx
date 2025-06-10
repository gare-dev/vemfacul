import Api from "@/api"
import Popup from "@/components/Popup"
import PopupFilter from "@/components/PopupFilter"
import PopupPersonalEvents from "@/components/PopupPersonalEvents"
import Sidebar from "@/components/Sidebar"
import DemoWrapper from "@/hooks/DemoWrapper"
import useCalendarData from "@/hooks/useCalendarData"
import usePersonalEvents from "@/hooks/usePersonalEvents"
import styles from "@/styles/calendario.module.scss"
import PopupType from "@/types/data"
import { FiltrosType } from "@/types/filtrosType"
import { useEffect, useState } from "react"



export default function Calendario() {
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [isClose, setIsClose] = useState<boolean>(false)
    const [hasOpened, setHasOpened] = useState<boolean>(false)
    const { calendarData } = useCalendarData()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [popupVisible, setPopupVisible] = useState<boolean>(false)
    const [events, setEvents] = useState<PopupType[]>([])
    const [originalEvents, setOriginalEvents] = useState<PopupType[]>([])
    const { setPersonalEventsData } = usePersonalEvents()
    const [filtroEventos, setFiltroEventos] = useState<FiltrosType[]>([{
        tipoDeEvento: [],
        tipodeCursinho: []
    }]);


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

    const handleRemovePersonalEvents = async () => {
        if (!calendarData.id_pevent) return

        try {
            const response = await Api.deletePersonalEvent(calendarData.id_pevent)
            if (response.data.code === "EVENT_DELETED") {
                setIsVisible(false)
                handleGetPersonalEvents()
            }
        } catch (error) {
            console.log(error)
        }

    }
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
                const cursinhoOk = f.tipodeCursinho.length === 0 || f.tipodeCursinho.includes(dado.cursinho?.toLowerCase());
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
        handleGetPersonalEvents()

    }, [])

    useEffect(() => {
        if (!hasOpened) return setHasOpened(true)
        setIsVisible(true)
    }, [calendarData])

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
            <PopupPersonalEvents onClose={() => setIsClose(!isClose)} isVisible={isClose} />
            <Popup
                isVisible={isVisible}
                setIsVisible={() => setIsVisible(false)}
                canAdd={false}
                canRemove={true}
                canEdit={true}
                removeFunction={handleRemovePersonalEvents}

            />
            <PopupFilter
                setFiltroEventos={setFiltroEventos}
                filtroEventos={filtroEventos}
                isVisible={popupVisible}
                callFilter={() => getFilter()}
            />
            <Sidebar />


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
                    onDateClick={(day, month, year) => {
                        setIsClose(true)
                        setPersonalEventsData((prev) => ({
                            ...prev,
                            day: String(day),
                            month: String(month),
                            year: String(year),
                        }))
                    }}
                />

            </div>
        </>
    )
}