import Api from "@/api";
import Header from "@/components/Header";
import Popup from "@/components/Popup";
import DemoWrapper from "@/hooks/DemoWrapper";
import useCalendarData from "@/hooks/useCalendarData";
import PopupType from "@/types/data";
import { useEffect, useState } from "react";



export default function LandingPage() {
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const { calendarData } = useCalendarData()
    const [hasOpened, setHasOpened] = useState<boolean>(false)
    const [events, setEvents] = useState<PopupType[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)



    const getEvents = async () => {

        try {
            setIsLoading(true)
            const response = await Api.getEvents()

            if (response.data.code === "EVENTS_SUCCESSFULLY") {
                setEvents(response.data.data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }


    useEffect(() => {
        if (!hasOpened) return setHasOpened(true)
        setIsVisible(true)
    }, [calendarData])

    useEffect(() => {
        getEvents()
    }, [])

    if (isLoading) {
        return (
            <div style={{
                position: "fixed",
                height: "100%",
                width: "100%"
            }}>

            </div>
        )
    }

    return (
        <div className="pb-24">
            <Popup
                isVisible={isVisible}
                setIsVisible={() => setIsVisible(false)}
            />


            <Header />
            <main className="flex items-center justify-center">
                <DemoWrapper eventos={events} popUpClick={() => setIsVisible(true)} />
            </main>
        </div>
    )
}