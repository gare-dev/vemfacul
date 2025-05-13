import { EmailContext } from "@/context/EmailContext"
import { useContext } from "react"

const useEmail = () => {
    const context = useContext(EmailContext)
    if (!context) {
        throw new Error("useEmail must be used within an EmailProvider")
    }
    return context
}

export default useEmail    