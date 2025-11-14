import { FaBell } from "react-icons/fa";
import styles from "./styles.module.scss"
import { useState, useEffect } from "react";
import Io from "@/utils/ioServer";

export default function SetNotifications() {
    const [count, setCount] = useState<number>(0)
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

        // Verifica conexão inicial
        checkConnection();


        Io.onNotifications((n: number) => {
            console.log("🎯 CALLBACK EXECUTADO - Notificação recebida:", n);
            setCount(n);
            setAnimate(true);
            setTimeout(() => setAnimate(false), 700);
        });

        // Verifica conexão periodicamente
        const interval = setInterval(checkConnection, 10000);

        // Cleanup obrigatório
        return () => {
            console.log("🧹 Limpando listeners do componente");
            clearInterval(interval);
            Io.removeNotificationsListener();
        };
    }, []); // Importante: array vazio para executar apenas uma vez

    useEffect(() => {
        console.log(count)
    }, [count])

    // Função de teste para debug
    // const handleTestNotification = () => {
    //     console.log("🧪 Testando notificação manual...");
    //     const status = Io.getConnectionStatus();
    //     console.log("Status atual:", status);

    //     // Testa callback direto
    //     console.log("🎯 Executando callback diretamente...");
    //     setCount(prev => prev + 1);
    //     setAnimate(true);
    //     setTimeout(() => setAnimate(false), 700);
    // };

    return (
        <div className={styles.wrapper}>
            <FaBell
                size={'0.7em'}
                className={`${styles.icon} ${animate ? styles.ring : ""}`}
                style={{ cursor: 'pointer' }}
            />
            {count > 0 && <span className={`${styles.count} ${styles.pulse}`}>{count}</span>}
        </div>
    )
}
