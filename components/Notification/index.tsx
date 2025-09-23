import Api from "@/api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Notification = {
  destinatario: string;
  ator: string;
  tipo: string;
  postagem: string;
  id_postagem: string
};

export default function Notification() {
  const [notification, setNotification] = useState<Notification[]>([]);
  const router = useRouter()
  const [mode, setMode] = useState<"redacao" | "postagem">("postagem");

  const handleGetNotification = async (mode: "redacao" | "postagem") => {
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
      </div>

      {/* Lista de notificações */}
      <div className="space-y-4">
        {notification.length > 0 ? (
          notification.map((n, idx) => (
            <div
              onClick={() => router.push(`postagem/${n.id_postagem}`)}
              key={idx}
              className="bg-white shadow-md rounded-xl p-4 border hover:shadow-lg transition"
            >
              <p className="text-sm text-gray-500">
                Por: <span className="font-semibold">{n.ator}</span>
              </p>
              <p
                className={`font-medium ${n.tipo === "Curtida" ? "text-green-600" : "text-orange-600"
                  }`}
              >
                {n.tipo}
              </p>
              <p className="mt-2 text-gray-700 italic">“{n.postagem}”</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Nenhuma notificação encontrada.</p>
        )}
      </div>
    </div>
  );
}
