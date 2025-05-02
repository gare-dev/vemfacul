import { CalendarDataContext } from "@/context/CalendarDataContext"
import { useContext } from "react"



const useCalendarData = () => {
    const context = useContext(CalendarDataContext)
    if (!context) {
        throw new Error("useCalendarData must be used within an CalendarDataProvider")
    }
    return context
}

export default useCalendarData   