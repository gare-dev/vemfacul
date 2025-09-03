import Api from "@/api";
import { useEffect } from "react";


export default function Teste() {

    useEffect(() => {
        (async () => {
            const response = await Api.tokenTeste();
            console.log(response)
        })();
    }, [])

    return (
        <>
            <h2>teste</h2>
        </>
    )
}