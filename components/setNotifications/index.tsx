import { FaBell } from "react-icons/fa";
import styles from "./styles.module.scss"
import { useState, useEffect } from "react";
import Io from "@/utils/ioServer";
import useNotifications from "@/hooks/useNotifications";

export default function SetNotifications() {
    const { notifications, setNotifications } = useNotifications()
    const [animate, setAnimate] = useState(false);
    const [, setIsConnected] = useState(false);
    // const [connection, setConnection] = useState<Socket | null>(null);

    useEffect(() => {
        console.log("🚀 Inicializando componente de notificações");

        const checkConnection = () => {
            const status = Io.getConnectionStatus();
            setIsConnected(status.connected);
            console.log("🔍 Status da conexão Socket.IO:", status);
        };

        checkConnection();

        Io.onNotifications((n: number) => {
            console.log("🎯 CALLBACK EXECUTADO - Notificação recebida:", n);
            setNotifications(n);
            setAnimate(true);
            setTimeout(() => setAnimate(false), 700);
        });

        // const interval = setInterval(checkConnection, 10000);

        return () => {
            console.log("🧹 Limpando listeners do componente");
            // clearInterval(interval);
            Io.removeNotificationsListener();
        };
    }, []);

    return (
        <div className={styles.wrapper}>
            <FaBell
                size={'0.7em'}
                className={`${styles.icon} ${animate ? styles.ring : ""}`}
                style={{ cursor: 'pointer' }}
            />
            {notifications > 0 && <span className={`${styles.count} ${styles.pulse}`}>{notifications}</span>}
        </div>
    )
}
