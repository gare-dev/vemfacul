import Api from "@/api"
import { useEffect } from "react"



export default function Teste() {

    useEffect(() => {
        const api = Api.tokenTeste()
        console.log(api)
    }, [])

    return (
        <>
            <h2>teste</h2></>
    )
}