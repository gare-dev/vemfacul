import Api from "@/api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Notification = {
  destinatario: string;
  ator: string;
  tipo: string;
  postagem: string;
  id_postagem: string
  content: string
};

export default function Notification() {
  const [notification, setNotification] = useState<Notification[]>([]);
  const router = useRouter()
  const [mode, setMode] = useState<"redacao" | "postagem" | "denuncias">("postagem");

  const handleGetNotification = async (mode: "redacao" | "postagem" | "denuncias") => {
    try {
      const promise = await Api.getNotifications(mode);
      if (promise.status === 200) {
        setNotification(promise.data.data ?? []);
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    handleGetNotification(mode);
  }, [mode]);



  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Notificações</h2>
      <div className="flex space-x-4 mb-6">
        <button
          style={{ backgroundColor: mode === "postagem" ? "#778CFE" : "" }}
          onClick={() => setMode("postagem")}
          className={`px-4 py-2 rounded-lg font-medium transition ${mode === "postagem"
            ? "bg-blue-600 text-white shadow"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          Postagens
        </button>
        <button
          style={{ backgroundColor: mode === "redacao" ? "#778CFE" : "" }}
          onClick={() => setMode("redacao")}
          className={`px-4 py-2 rounded-lg font-medium transition ${mode === "redacao"
            ? "bg-blue-600 text-white shadow"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          Redações
        </button>
        <button
          style={{ backgroundColor: mode === "denuncias" ? "#778CFE" : "" }}
          onClick={() => setMode("denuncias")}
          className={`px-4 py-2 rounded-lg font-medium transition ${mode === "denuncias"
            ? "bg-blue-600 text-white shadow"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          Denúncias
        </button>
      </div>

      {/* Lista de notificações */}
      <div className="space-y-4">
        {notification.length > 0 ? (
          notification.map((n, idx) => (
            <div
              onClick={() => {
                if (n.tipo === "Redação") {
                  router.push(`/redacao`);
                } else if (n.tipo === "Denuncias") {
                  return;
                } else {
                  router.push(`/postagem/${n.id_postagem}`);
                }
              }}
              key={idx}
              style={{
                borderColor: "#778CFE",
                cursor: n.tipo === "denuncias" ? "default" : "pointer"
              }}
              className="bg-white shadow-md rounded-xl p-4 border hover:shadow-lg transition"
            >
              {(n.tipo === "Comentário" || n.tipo === "Curtida") && (<p className="text-sm text-gray-500">
                Por: <span className="font-semibold">{n.ator}</span>
              </p>)}
              <p
                className={`font-medium ${n.tipo === "Curtida" ? "text-green-600" : "text-orange-600"
                  }`}
              >
                {n.tipo}
              </p>
              {(n.tipo === "Comentário" || n.tipo === "Curtida") && (<p className="mt-2 text-gray-700 italic">“{n.postagem}”</p>)}
              {(n.tipo === "Redação") && <p className="mt-2 text-gray-700 italic">“{n.content}”</p>}
              {(n.tipo === "Denuncias") && <p className="mt-2 text-gray-700">{n.content}</p>}
            </div>
          ))
        ) : (
          <p className="text-gray-500">Nenhuma notificação encontrada.</p>
        )}
      </div>
    </div>
  );
}
