import Api from "@/api"
import Header from "@/components/Header"
import Popup from "@/components/Popup"
import DemoWrapper from "@/hooks/DemoWrapper"
import useCalendarData from "@/hooks/useCalendarData"
// import styles from "@/styles/calendario.module.scss"
import PopupType from "@/types/data"
import { useEffect, useState } from "react"



export default function Calendario() {
    const [eventos, setEventos] = useState<PopupType[]>([])
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [hasOpened, setHasOpened] = useState<boolean>(false)
    const { calendarData } = useCalendarData()
    const [isLoading, setIsLoading] = useState<boolean>(false)


    const handleGetPersonalEvents = async () => {

        try {
            setIsLoading(true)
            const response = await Api.getPersonalEvents()

            if (response.data.code === "EVENTS_FOUND") {
                setEventos(response.data.data)
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
            <Header />

            <div>
                <DemoWrapper eventos={eventos} popUpClick={() => setIsVisible(true)} />

            </div>
        </>
    )
}