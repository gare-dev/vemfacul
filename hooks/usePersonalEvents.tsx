import { PersonalEventDataContext } from "@/context/PersonalEventPopupContext"
import { useContext } from "react"

const usePersonalEvents = () => {
    const context = useContext(PersonalEventDataContext)
    if (!context) {
        throw new Error("usePersonalEvents must be used within an PersonalEventsProvider")
    }
    return context
}

export default usePersonalEvents 