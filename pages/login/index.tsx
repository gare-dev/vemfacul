import Api from "@/api";
import { useEffect, useState } from "react";

export default function Main() {
  const [mensagem, setMensagem] = useState<string>();

  const teste = async () => {
    const teste = await Api.teste();
    setMensagem(teste?.data.message);
  };

  useEffect(() => {
    teste();
  }, []);

  return (
    <div>
      <h2>{mensagem}</h2>
    </div>
  );
}
