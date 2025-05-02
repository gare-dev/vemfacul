import Header from "@/components/Header";
import Popup from "@/components/Popup";
import DemoWrapper from "@/hooks/DemoWrapper";
import useCalendarData from "@/hooks/useCalendarData";
import { useEffect, useState } from "react";



export default function Feed() {
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const { calendarData } = useCalendarData()
    const [hasOpened, setHasOpened] = useState<boolean>(false)


    useEffect(() => {
        if (!hasOpened) return setHasOpened(true)
        setIsVisible(true)
    }, [calendarData])




    return (
        <div className="pb-24">
            <Popup isVisible={isVisible} setIsVisible={() => setIsVisible(!isVisible)} />

            <Header />
            <main className="flex items-center justify-center">
                <DemoWrapper />
            </main>
        </div>
    )
}