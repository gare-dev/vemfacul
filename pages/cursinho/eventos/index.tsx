import Api from "@/api"
import CreateEventCursinhoPopup from "@/components/CreateEventCursinho"
import Popup from "@/components/Popup"
import Sidebar from "@/components/Sidebar"
import DemoWrapper from "@/hooks/DemoWrapper"
import useCalendarData from "@/hooks/useCalendarData"
import AuthDataType from "@/types/authDataType"
import { GetServerSideProps } from "next"
import { useState } from "react"

interface Caralho {
    day: number
    month: number
    year: number
    title: string
    cursinho: string
    descricao: string
    foto: string
    type: string
    color: string
    main_title: string
    link: string
    hora: string
    id_pevent: string
    isimportant: boolean
    completed: boolean
    created_at?: Date | string | number
    isdone?: boolean
}

interface Props {
    authData: AuthDataType | null
    eventsProps: Caralho[]
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
    try {
        const cookie = ctx.req.headers.cookie
        Api.setCookie(cookie || "")
        const [authData, events] = await Promise.all([
            Api.getProfileInfo(),
            Api.getEvents()
        ])

        return {
            props: {
                authData: authData.data.code === "PROFILE_INFO" ? authData.data.data : null,
                eventsProps: events.status === 200 ? events.data.data.map((events: Caralho) => ({
                    ...events,
                    created_at: new Date(events.created_at!).toLocaleDateString('pt-BR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    })
                })) : []
            }
        }
    } catch (error) {
        console.error("Error fetching profile info:", error);
        return {
            props: {
                authData: null,
                eventsProps: []
            }
        }
    }
}

export default function EventosCursinho({ authData, eventsProps }: Props) {
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [events,] = useState<Caralho[]>(eventsProps || [])
    const [date, setDate] = useState<number[]>([])
    const { calendarData } = useCalendarData()
    const [popupFormVisible, setPopupFormVisible] = useState<boolean>(false)

    const handleRemoveEvent = async (id: string) => {
        try {
            await Api.deleteCursinhoEvent(id)
            // setEvents(events.filter(event => event.id_pevent !== id))
        } catch (error) {
            console.error("Error removing event:", error);
        }

    }


    return (
        <>
            <Popup
                isVisible={isVisible}
                setIsVisible={() => setIsVisible(false)}
                canAdd={false}
                canRemove
                canEdit
                removeFunction={() => handleRemoveEvent(calendarData.id_event ?? "")}
            />
            <Sidebar authData={authData} />
            <CreateEventCursinhoPopup
                date={date}
                isOpen={popupFormVisible}
                onClose={() => setPopupFormVisible(false)}
            />

            <DemoWrapper
                eventos={events}
                onDateClick={(date, month, year) => {
                    setDate([date, month, year]);
                    setPopupFormVisible(true);
                }}
                popUpClick={() => setIsVisible(true)}
                isEditable
            />
        </>
    )
}