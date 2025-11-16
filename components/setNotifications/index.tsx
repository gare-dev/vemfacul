import Api from "@/api"
import { FaBell } from "react-icons/fa";
import styles from "./styles.module.scss"
import { useState, useEffect } from "react";
import Io from "@/utils/ioServer";

export default function SetNotifications() {
    const [count, setCount] = useState<number>(0)
    const [animate, setAnimate] = useState(false);

    const handlerNotificationsQuantity = async () => {
        try {
            const promise = await Api.getNotificationsActive();

            if (promise.status === 200) { setCount(promise.data.data); }
        } catch (err) {
            console.error(err)
        }
    }


    useEffect(() => {
        Io.onNotifications(n => {
            setCount(n)
            setAnimate(true);
            setTimeout(() => setAnimate(false), 700);
        });
    }, [])

    return (
        <div className={styles.wrapper}>
            <FaBell className={`${styles.icon} ${animate ? styles.ring : ""}`} />
            {count > 0 && <span className={`${styles.count} ${styles.pulse}`}>{count}</span>}
        </div>
    )
}
