import Api from "@/api"
import { useEffect, useState } from "react"
import styles from "@/styles/ranking.module.scss";

type ranking = {
    username: string
    acertosuser: number
}
export default function Ranking() {
    const [ranking, setRanking] = useState<ranking[]>([])

    const handleGetRanking = async () => {
        try {
            const promise = await Api.getRankingUsers()

            if (promise.status == 200) {
                setRanking(promise.data.data)
            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        handleGetRanking();
    }, [])

    return <>
        <div className={styles.container}>
            <h3>Ranking</h3>
            <ul>
                {ranking.map((user, idx) => (
                    <li key={idx}>
                        {user.username}: {user.acertosuser}
                    </li>
                ))}
            </ul>
        </div>
    </>
}