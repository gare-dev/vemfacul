import Api from "@/api"
import { AxiosError } from "axios"

async function getAuth() {
    try {
        const response = await Api.removeAuthToken()

        if (response.status === 200) {
            return true
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.data.code === "TOKEN_NOT_FOUND") {
                return null
            }
        }
    }
}

export default getAuth