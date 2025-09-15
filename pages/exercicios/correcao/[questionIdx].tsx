import { useRouter } from "next/router"
export default function Correcao() {
    const router = useRouter()
    const { questionIdx } = router.query;
    
    return (
        <>
        <div>
            <h1>questao - {questionIdx}</h1>
        </div>
        </>
    )
}