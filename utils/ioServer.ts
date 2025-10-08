import { Socket, io } from "socket.io-client";

let socket: Socket | null = null

class _Io {

    constructor() {
        if (socket) { return ;}

        socket = io("http://localhost:3002", { withCredentials: true }) 

        socket.on("connect", () => console.log(`✅ Conectado ao servidor: ${socket?.id}`))

        socket.on("disconnect", () => console.log("❌ Socket desconectado"))
    }

    onNotifications(callback: (count: number) => void) {
        if (!socket) { return ;}

        socket.on("notifications", (n: number) => { callback(n) })
    }

    static disconnect() {
        if (!socket) { return ;}

        socket.disconnect();
        socket = null;
        console.log("🔌 Socket desconectado manualmente");
    }
}
const Io = new _Io()

export default Io;