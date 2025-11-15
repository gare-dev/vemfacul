import { NotificationsContext } from "@/context/NotificationsContext"
import { useContext } from "react"

const useNotifications = () => {
    const context = useContext(NotificationsContext)
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationsProvider")
    }
    return context
}

export default useNotifications    