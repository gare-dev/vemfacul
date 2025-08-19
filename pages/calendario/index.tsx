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
import LoadingComponent from "@/components/LoadingComponent"

export default function Calendario() {
    const [isVisible, setIsVisible] = useState(false)
    const [isClose, setIsClose] = useState(false)
    const [hasOpened, setHasOpened] = useState(false)
    const { calendarData } = useCalendarData()
    const [isLoading, setIsLoading] = useState(false)
    const [popupVisible, setPopupVisible] = useState(false)
    const [events, setEvents] = useState<PopupType[]>([])
    const [userInfo, setUserInfo] = useState<string[]>([])
    const [, setOriginalEvents] = useState<PopupType[]>([])
    const { setPersonalEventsData } = usePersonalEvents()
    const [highlighted, setHighlighted] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<'today' | 'week' | 'month' | "all">('today')
    const [filtroEventos, setFiltroEventos] = useState<FiltrosType[]>([{
        tipoDeEvento: [],
        tipodeCursinho: []
    }])

    // ✅ Carregar eventos
    const handleGetPersonalEvents = async () => {
        try {
            setIsLoading(true)
            const response = await Api.getPersonalEvents()

            if (response.status === 200) {
                console.log(response.data.data[0])
                setEvents(response.data.data)
                setOriginalEvents(response.data.data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    // ✅ Remover evento
    const handleRemovePersonalEvents = async () => {
        if (!calendarData.id_pevent) return

        try {
            const response = await Api.deletePersonalEvent(calendarData.id_pevent)
            if (response.data.code === "EVENT_DELETED") {
                setIsVisible(false)
                handleGetPersonalEvents()
            }
        } catch (error) {
            console.error(error)
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

    const toggleImportant = (id: string) => {
        setEvents(events.map(event =>
            event.id_pevent === id ? { ...event, isimportant: !event.isimportant } : event
        ))
        setOriginalEvents(events.map(event =>
            event.id_pevent === id ? { ...event, isimportant: !event.isimportant } : event
        ))
    }

    const toggleComplete = (id: string) => {
        setEvents(events.map(event =>
            event.id_pevent === id ? { ...event, completed: !event.completed } : event
        ))
        setOriginalEvents(events.map(event =>
            event.id_pevent === id ? { ...event, completed: !event.completed } : event
        ))
    }

    useEffect(() => {
        handleGetPersonalEvents()
    }, [])

    useEffect(() => {
        if (!hasOpened) return setHasOpened(true)
        setIsVisible(true)
    }, [calendarData])



    return (
        <>
            <LoadingComponent isLoading={isLoading} />
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
                callFilter={() => {/* TODO: implementar filtro */ }}
            />
            <Sidebar setInfo={setUserInfo} userInfo={userInfo} />

            <header className={styles.headerBlock}>
                <div className={styles.headerContent}>
                    <h1>Bem-Vindo de volta, {userInfo[0]}.</h1>
                    <div className={styles.statsRow}>
                        <div className={styles.statCard}><FiCalendar /> Hoje: {getOverview("getTodayEvents").length}</div>
                        <div className={styles.statCard}><FiCalendar /> Semana: {getOverview("next7Days").length}</div>
                        <div className={styles.statCard}><FiCalendar /> Mês: {getOverview("next31Days").length}</div>
                        <div className={styles.statCard}><FiStar /> Importantes: {getOverview("getImportantEvents").length}</div>
                        <div className={styles.statCard}><FiEdit3 /> Redações: {getOverview("getRedacao").length}</div>
                        <div className={styles.statCard}><FiEdit3 /> Simulados: {getOverview("getSimulado").length}</div>
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
                            className={`${styles.eventCard} ${event.isimportant ? styles.important : ''} ${highlighted === event.id_pevent ? styles.highlighted : ''} ${event.completed || (event.day < new Date().getDate() || event.month < new Date().getMonth()) ? styles.completed : ''}`}
                            onMouseEnter={() => setHighlighted(event.id_pevent)}
                            onMouseLeave={() => setHighlighted(null)}
                        >
                            <div className={styles.eventIcon}>
                                {getEventTypeIcon(event.type)}
                            </div>
                            <div className={styles.eventDetails}>
                                <h3>{event.title}</h3>
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
