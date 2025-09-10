import Api from "@/api"
import Popup from "@/components/Popup"
import PopupFilter from "@/components/PopupFilter"
import PopupPersonalEvents from "@/components/PopupPersonalEvents"
import Sidebar from "@/components/Sidebar"
import DemoWrapper from "@/hooks/DemoWrapper"
import useCalendarData from "@/hooks/useCalendarData"
import usePersonalEvents from "@/hooks/usePersonalEvents"
import styles from "@/styles/calendario.module.scss"
import { FiltrosType } from "@/types/filtrosType"
import PopupType from "@/types/data"   // ✅ Usa o tipo centralizado
import { useEffect, useState } from "react"
import { FiAlertTriangle, FiCalendar, FiCheckCircle, FiEdit3, FiStar } from "react-icons/fi"
import { GetServerSideProps } from "next"
import AuthDataType from "@/types/authDataType"
import LoadingBar from "@/components/LoadingBar"
import useAlert from "@/hooks/useAlert"

type Props = {
    eventsProp: PopupType[]
    authData?: AuthDataType | null | undefined;

}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    try {
        const cookie = ctx.req.headers.cookie
        Api.setCookie(cookie || "")

        const [response, authData] = await Promise.all([
            Api.getPersonalEvents(),
            Api.getProfileInfo()
        ])

        const eventos = response.data.data.map((evento: PopupType) => ({
            ...evento,
            created_at: evento.created_at ? (typeof evento.created_at === "string" ? evento.created_at : new Date(evento.created_at).toLocaleDateString()) : "Data não informada"
        }))

        return {
            props: {
                eventsProp: response.status === 200 ? eventos : [],
                authData: authData.data.code === "PROFILE_INFO" ? authData.data.data : null

            }
        }

    } catch (error) {
        console.error("Error fetching calendar events:", error)
        return {
            props: {
                eventsProp: [],
                authData: null
            }
        }
    }
}

export default function Calendario({ eventsProp, authData }: Props) {
    const [isVisible, setIsVisible] = useState(false)
    const [isClose, setIsClose] = useState(false)
    const [hasOpened, setHasOpened] = useState(false)
    const { calendarData } = useCalendarData()
    const { showAlert } = useAlert()
    const [popupVisible, setPopupVisible] = useState(false)
    const [events, setEvents] = useState<PopupType[]>(eventsProp || [])
    const [userInfo, setUserInfo] = useState<string[]>([])
    const [originalEvents, setOriginalEvents] = useState<PopupType[]>(eventsProp || [])
    const { setPersonalEventsData } = usePersonalEvents()
    const [highlighted, setHighlighted] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<'today' | 'week' | 'month' | "all">('today')
    const [filtroEventos, setFiltroEventos] = useState<FiltrosType[]>([{
        tipoDeEvento: [],
        tipodeCursinho: []
    }])
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    let intervalId: NodeJS.Timeout;

    const startLoading = () => {
        setLoading(true);
        setProgress(10);

        intervalId = setInterval(() => {
            setProgress((prev) => (prev < 90 ? prev + 5 : prev));
        }, 200);
    };

    const stopLoading = () => {
        clearInterval(intervalId);
        setProgress(100);
        setTimeout(() => {
            setLoading(false);
            setProgress(0);
        }, 400);
    };

    const handleGetPersonalEvents = async () => {
        try {
            startLoading()
            const response = await Api.getPersonalEvents()

            if (response.status === 200) {
                setEvents(response.data.data)
                setOriginalEvents(response.data.data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            stopLoading()
        }
    }

    // ✅ Remover evento
    const handleRemovePersonalEvents = async () => {
        if (!calendarData.id_pevent) return

        try {
            startLoading()
            const response = await Api.deletePersonalEvent(calendarData.id_pevent)
            if (response.status === 200) {
                setIsVisible(false)
                handleGetPersonalEvents()
            }
        } catch (error) {
            console.error(error)
        } finally {
            stopLoading()
        }
    }

    // ✅ Contadores de visão geral
    const getOverview = (info: "totalEvents" | "next31Days" | "next7Days" | "getRedacao" | "getSimulado" | "getTodayEvents" | "getImportantEvents") => {
        const overview = {
            totalEvents: events,
            next31Days: events.filter(e => isWithinDays(e, 31)),
            next7Days: events.filter(e => isWithinDays(e, 7)),
            getRedacao: events.filter(e => e.type === "redacao"),
            getSimulado: events.filter(e => e.type === "simulado"),
            getTodayEvents: events.filter(e => isToday(e)),
            getImportantEvents: events.filter(e => e.isimportant)
        }
        return overview[info]
    }

    // ✅ Helpers
    const isToday = (event: PopupType) => {
        const today = new Date()
        return (
            +event.day === today.getDate() &&
            +event.month === today.getMonth() &&
            +event.year === today.getFullYear()
        )
    }

    const isWithinDays = (event: PopupType, days: number) => {
        const hoje = new Date()
        const limite = new Date()
        limite.setDate(hoje.getDate() + days)
        const dataEvento = new Date(event.year, event.month, event.day)
        return dataEvento >= hoje && dataEvento <= limite
    }

    const getEventTypeIcon = (type: PopupType['type']) => {
        switch (type) {
            case 'essay':
                return <FiEdit3 />
            case 'meeting':
                return <FiCalendar />
            case 'reminder':
                return <FiAlertTriangle />
            default:
                return <FiCheckCircle />
        }
    }

    const toggleImportant = async (id: string) => {


        try {
            startLoading()
            const response = await Api.setPersonalEventImportant(id)

            if (response.status === 200) {
                setEvents(events.map(event =>
                    event.id_pevent === id ? { ...event, isimportant: !event.isimportant } : event
                ))
                setOriginalEvents(events.map(event =>
                    event.id_pevent === id ? { ...event, isimportant: !event.isimportant } : event
                ))
                stopLoading()
                showAlert("Evento atualizado com sucesso!", "success")
            }
        } catch (error) {
            console.log("Erro ao atualizar evento. " + error)
        } finally {
            stopLoading()
        }
    }

    const toggleComplete = async (id: string) => {
        try {
            startLoading()
            const response = await Api.setPersonalEventDone(id)

            if (response.status === 200) {
                stopLoading()
                setEvents(events.map(event =>
                    event.id_pevent === id ? { ...event, isdone: !event.isdone } : event
                ))
                setOriginalEvents(events.map(event =>
                    event.id_pevent === id ? { ...event, isdone: !event.isdone } : event
                ))
                showAlert("Evento atualizado com sucesso!", "success")
            }
        } catch (error) {
            console.log("Erro ao atualizar evento! " + error)
        } finally {
            stopLoading()
        }
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

    useEffect(() => {
        if (!hasOpened) return setHasOpened(true)
        setIsVisible(true)
    }, [calendarData])



    return (
        <>
            {loading && <LoadingBar progress={progress} />}
            <PopupPersonalEvents onClose={() => setIsClose(!isClose)} isVisible={isClose} />
            <Popup
                isVisible={isVisible}
                setIsVisible={() => setIsVisible(false)}
                canAdd={false}
                canRemove
                canEdit
                removeFunction={handleRemovePersonalEvents}
            />
            <PopupFilter
                setFiltroEventos={setFiltroEventos}
                filtroEventos={filtroEventos}
                isVisible={popupVisible}
                callFilter={() => getFilter()}
            />
            <Sidebar setInfo={setUserInfo} userInfo={userInfo} authData={authData} />

            <header className={styles.headerBlock}>
                <div className={styles.headerContent}>
                    <h1>Bem-Vindo de volta, {userInfo[0]}.</h1>
                    <div className={styles.statsRow}>
                        <div className={styles.statCard}><FiCalendar /> Hoje: <strong>{getOverview("getTodayEvents").length}</strong></div>
                        <div className={styles.statCard}><FiCalendar /> Semana: <strong>{getOverview("next7Days").length}</strong></div>
                        <div className={styles.statCard}><FiCalendar /> Mês: <strong>{getOverview("next31Days").length}</strong></div>
                        <div className={styles.statCard}><FiStar /> Importantes: <strong>{getOverview("getImportantEvents").length}</strong></div>
                        <div className={styles.statCard}><FiEdit3 /> Redações: <strong>{getOverview("getRedacao").length}</strong></div>
                        <div className={styles.statCard}><FiEdit3 /> Simulados: <strong>{getOverview("getSimulado").length}</strong></div>
                    </div>
                </div>
            </header>

            <main className={styles.mainContent}>
                <div className={styles.viewControls}>
                    {['all', 'today', 'week', 'month'].map(mode => (
                        <button
                            key={mode}
                            className={`${styles.viewButton} ${viewMode === mode ? styles.active : ''}`}
                            onClick={() => setViewMode(mode as typeof viewMode)}
                        >
                            {mode === 'today' ? 'Hoje' : mode === 'week' ? 'Próximos 7 dias' : mode === "all" ? "Todos" : 'Próximos 31 dias'}
                        </button>
                    ))}
                </div>

                <div className={styles.eventsList}>
                    {(viewMode === 'today'
                        ? getOverview("getTodayEvents")
                        : viewMode === 'week'
                            ? getOverview("next7Days")
                            : viewMode === 'all'
                                ? getOverview("totalEvents")
                                : getOverview("next31Days")
                    ).map(event => (
                        <div
                            key={event.id_pevent}
                            className={`${styles.eventCard} ${event.isimportant ? styles.important : ''} ${highlighted === event.id_pevent ? styles.highlighted : ''} ${event.completed || event.isdone || (event.day < new Date().getDate() || event.month < new Date().getMonth()) ? styles.completed : ''}`}
                            onMouseEnter={() => setHighlighted(event.id_pevent)}
                            onMouseLeave={() => setHighlighted(null)}
                        >
                            <div className={styles.eventIcon}>
                                {getEventTypeIcon(event.type)}
                            </div>
                            <div className={styles.eventDetails}>
                                <h3>{event.main_title}</h3>
                                <span className={styles.eventDate}>{`${event.day.toString().padStart(2, '0')}/${(+event.month + 1).toString().padStart(2, '0')}/${event.year}`}</span>
                            </div>
                            <div className={styles.eventActions}>
                                <button
                                    className={`${styles.actionButton} ${event.isimportant ? styles.active : ''
                                        }`} onClick={() => toggleImportant(event.id_pevent)}><FiStar /></button>
                                <button
                                    className={`${styles.actionButton} ${event.completed ? styles.active : ''
                                        }`} onClick={() => toggleComplete(event.id_pevent)}><FiCheckCircle /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <DemoWrapper
                isEditable
                eventos={events}
                popUpClick={() => setIsVisible(true)}
                popupFilterClick={() => setPopupVisible(true)}
                onDateClick={(day, month, year) => {
                    setIsClose(true)
                    setPersonalEventsData(prev => ({
                        ...prev,
                        day: String(day),
                        month: String(month),
                        year: String(year),
                    }))
                }}
            />
        </>
    )
}
