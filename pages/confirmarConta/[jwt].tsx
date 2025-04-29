import Api from "@/api"
import useEmail from "@/hooks/useEmail"
import { AxiosError } from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"



export default function ConfirmarConta() {
    const router = useRouter()
    const { jwt } = router.query
    const [error, setError] = useState('')
    const { setEmail } = useEmail()

    useEffect(() => {
        const handleConfirmarConta = async () => {
            if (!jwt || typeof jwt !== 'string') return

            try {
                const response = await Api.confirmAccount(jwt)

                if (response.data.code === "CONFIRMED_ACCOUNT") {
                    setEmail(jwt)
                    return router.push('/cadastrarUsuario')
                }

            } catch (error) {
                if (error instanceof AxiosError) {
                    setError(error.response?.data.code)
                    return
                }
            }
        }

        handleConfirmarConta()
    }, [jwt])



    return (
        <div>{error}</div>
    )

}