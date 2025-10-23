import { Socket, io } from "socket.io-client";

let socket: Socket | null = null

class _Io {

    constructor() {
        if (socket) {
            console.log("♻️ Reutilizando conexão Socket.IO existente");
            return;
        }

        const serverUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3009";

        console.log(`🔌 Tentando conectar ao servidor: ${serverUrl}`);

        socket = io(serverUrl, {
            withCredentials: true,
            transports: ['websocket', 'polling'],
            timeout: 10000,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        socket.on("connect", () => {
            console.log(`✅ Conectado ao servidor Socket.IO: ${socket?.id}`);
            console.log(`🔗 Transporte usado: ${socket?.io.engine.transport.name}`);
        });

        socket.on("connect_error", (error) => {
            console.error("❌ Erro de conexão Socket.IO:", error.message);
            console.error("🔍 Detalhes:", error);
        });

        socket.on("disconnect", (reason) => {
            console.log(`❌ Socket desconectado. Motivo: ${reason}`);
        });

        socket.on("reconnect", (attemptNumber) => {
            console.log(`🔄 Reconectado após ${attemptNumber} tentativas`);
        });

        socket.on("reconnect_error", (error) => {
            console.error("❌ Erro na reconexão:", error);
        });
    }

    onNotifications(callback: (count: number) => void) {
        if (!socket) {
            console.warn("⚠️ Socket não inicializado para notificações");
            return;
        }

        // Função para configurar o listener
        const setupListener = () => {
            console.log("🎧 Configurando listener de notificações...");

            // Remove listeners anteriores para evitar duplicação
            socket!.off("notifications");

            // Adiciona novo listener
            socket!.on("notifications", (n: number) => {
                console.log(`📬 Notificação recebida via Socket.IO: ${n}`);
                callback(n);
            });

            console.log("✅ Listener de notificações configurado com sucesso");
        };

        // Se já está conectado, configura imediatamente
        if (socket.connected) {
            setupListener();
        } else {
            // Se não está conectado, aguarda a conexão
            console.log("⏳ Aguardando conexão para configurar listener...");
            socket.once("connect", () => {
                console.log("🔗 Conectado! Configurando listener de notificações...");
                setupListener();
            });
        }
    }

    getConnectionStatus() {
        if (!socket) {
            return { connected: false, id: null, status: "not_initialized" };
        }

        return {
            connected: socket.connected,
            id: socket.id,
            status: socket.connected ? "connected" : "disconnected",
            transport: socket.io?.engine?.transport?.name || "unknown"
        };
    }

    removeNotificationsListener() {
        if (!socket) return;
        socket.off("notifications");
        console.log("🧹 Listener de notificações removido");
    }

    // Método para teste manual
    testNotification(count: number = 5) {
        if (!socket) {
            console.warn("⚠️ Socket não conectado para teste");
            return;
        }

        // Simula recebimento de notificação para teste
        socket.emit("test", { count });
        console.log(`🧪 Teste enviado: ${count}`);
    }

    // Método para testar callback diretamente
    simulateNotification(count: number = 3) {
        console.log(`🎭 Simulando notificação: ${count}`);
        if (!socket) {
            console.warn("⚠️ Socket não inicializado");
            return;
        }

        // Simula o evento notifications internamente
        socket.emit("notifications", count);
    }

    // Método para forçar reconexão
    forceReconnect() {
        if (!socket) return;

        console.log("🔄 Forçando reconexão...");
        socket.disconnect();
        socket.connect();
    }

    // Método para listar todos os listeners ativos
    getActiveListeners() {
        if (!socket) return [];
        return Object.keys((socket as any)._callbacks || {});
    }

    static disconnect() {
        if (!socket) { return; }

        socket.disconnect();
        socket = null;
        console.log("🔌 Socket desconectado manualmente");
    }
}
const Io = new _Io()

export default Io;