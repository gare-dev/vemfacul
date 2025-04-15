import InputText from "@/types/InputsTextType";


const inputs: InputText[] = [
    {
        placeholder: "Nome",
        type: "text",
        value: "",
        onChange: (e) => { },
        title: "Qual seu nome?",
        subtitle: "Esse nome ficará exposto para outros usuários.",
    },
    {
        placeholder: "",
        type: "select",
        value: "",
        onChange: (e) => { },
        title: "Qual seu nível?",
        subtitle: "Já se formou? Vai se formar? Está lecionando?",
        niveis: ["Terceirão", "Veterano", "Vestibulando", "Professor", "Aluno EM", "Bixo"],

    }
]

export default inputs;