import Api from "@/api"
import CreateEventCursinhoPopup from "@/components/CreateEventCursinho"
import Sidebar from "@/components/Sidebar"
import DemoWrapper from "@/hooks/DemoWrapper"
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
    events: Caralho[]
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
                events: events.status === 200 ? events.data.data.map((events: Caralho) => ({
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
                events: []
            }
        }
    }
}

export default function EventosCursinho({ authData, events }: Props) {
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [date, setDate] = useState<number[]>([])


    return (
        <>
            <Sidebar authData={authData} />
            <CreateEventCursinhoPopup
                date={date}
                isOpen={isVisible}
                onClose={() => setIsVisible(false)}
            />

            <DemoWrapper
                eventos={events}
                onDateClick={(date, month, year) => {
                    setDate([date, month, year]);
                    setIsVisible(true);
                }}
                isEditable
            />
        </>
    )
}