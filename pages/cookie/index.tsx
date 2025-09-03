import Api from "@/api";
import { useEffect } from "react";


export default function teste() {

    useEffect(() => {
        (async () => {
            const response = await Api.tokenTeste();
            console.log(response)
        })();
    }, [])

}