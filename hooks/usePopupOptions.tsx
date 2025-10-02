import { PopupOptionsContext } from "@/context/PopupOptionsContext"
import { useContext } from "react"

const usePopupOptions = () => {
    const context = useContext(PopupOptionsContext)
    if (!context) {
        throw new Error("usePopupOptions must be used within a PopupOptionsProvider")
    }
    return context

}

export default usePopupOptions