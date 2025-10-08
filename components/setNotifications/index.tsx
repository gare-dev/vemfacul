import { FaBell } from "react-icons/fa";
import styles from "./styles.module.scss"
import { useState, useEffect } from "react";
import Io from "@/utils/ioServer";

export default function SetNotifications() {
    const [count, setCount] = useState<number>(0)
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        Io.onNotifications(n => {
            setCount(n)
            setAnimate(true);
            setTimeout(() => setAnimate(false), 700);
        })
    }, [])

    return (
        <div className={styles.wrapper}>
            <FaBell className={`${styles.icon} ${animate ? styles.ring : ""}`} />
            {count > 0 && <span className={`${styles.count} ${styles.pulse}`}>{count}</span>}
        </div>
    )
}
