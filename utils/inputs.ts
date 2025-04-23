import InputText from "@/types/InputsTextType";


const inputs: InputText[] = [
    {
        placeholder: "Nome",
        type: "textName",
        value: "",
        onChange: (e) => { },
        title: "Qual seu nome?",
        subtitle: "Esse nome ficará exposto para outros usuários.",
        level: "initialLogin"
    },
    {
        placeholder: "",
        type: "selectImage",
        value: "",
        onChange: (e) => { },
        title: "Coloque uma foto de perfil!",
        subtitle: "Ela será exibida no seu perfi, então escolhe uma bem bonita!",
        level: "initialLogin"
    },
    {
        placeholder: "",
        type: "selectEstado",
        value: "",
        onChange: (e) => { },
        title: "Você mora em qual estado?",
        subtitle: "Ajude-nos a te direcionar à Instituições próximas",
        level: "initialLogin",
        opcoes: ["SP", "RJ", "MG", "ES", "BA", "SE", "AL", "PE", "PB", "RN", "CE", "PI", "MA", "PA", "AP", "TO", "MT", "MS", "GO", "DF", "RO", "AC", "AM", "RR"]
    },
    {
        placeholder: "",
        type: "optionsNivel",
        value: "",
        onChange: (e) => { },
        title: "Qual seu nível?",
        subtitle: "Já se formou? Vai se formar? Está lecionando?",
        level: "initialLogin",
        opcoes: ["Aluno EM", "Universitário", "Vestibulando", "Professor"]
    }
]

export const universitarioInputs: InputText[] = [
    {
        placeholder: "",
        type: "selectProcesso",
        value: "",
        onChange: (e) => { },
        title: "Você já passou por um processo de vestibular?",
        subtitle: "",
        level: "vestibulando",
    },
    {
        placeholder: "Universidade",
        type: "textEscola",
        value: "",
        onChange: (e) => { },
        title: "Em que universidade você estuda?",
        subtitle: "",
        level: "vestibulando",
    },
    {
        placeholder: "Curso",
        type: "textCurso",
        value: "",
        onChange: (e) => { },
        title: "Qual curso você estuda?",
        subtitle: "",
        level: "vestibulando",
    },

]

export const vestibulandoInputs: InputText[] = [
    {
        placeholder: "",
        type: "selectEM",
        value: "",
        onChange: (e) => { },
        title: "Você já se formou no Ensino Médio?",
        subtitle: "",
        opcoes: ["Sim", "Não"],
        level: "vestibulando",
    },
    {
        placeholder: "Universidade",
        type: "textEscola",
        value: "",
        onChange: (e) => { },
        title: "Você trabalha?",
        subtitle: "",
        opcoes: ["Sim", "Não"],
        level: "vestibulando",
    },
    {
        placeholder: "",
        type: "selectVestibular",
        value: "",
        onChange: (e) => { },
        title: "Qual vestibular você pretende fazer?",
        subtitle: "",
        level: "vestibulando",
        opcoes: ["FUVEST", "ITA", "ENEM", "VUNESP", "UNICAMP", "Outros..."]
    }
]

export const professorInputs: InputText[] = [

    {
        placeholder: "",
        type: "textEscola",
        value: "",
        onChange: (e) => { },
        title: "Em que instituição você leciona?",
        subtitle: "",
        level: "professor",
    },
    {
        placeholder: "",
        type: "textArea",
        value: "",
        onChange: (e) => { },
        title: "Que área você leciona?",
        subtitle: "",
        level: "professor",
        opcoes: ["Linguagens", "Exatas", "Naturezas", "Biológicas", "Humanas", "Técnicas", "Outros..."]
    },

]

export const inputAlunoEM: InputText[] = [
    {
        placeholder: "Escola",
        type: "textEscola",
        value: "",
        onChange: (e) => { },
        title: "Em que escola você estuda?",
        level: "alunoEM",
    },
    {
        title: "Está cursando qual ano?",
        type: "selectAno",
        value: "",
        onChange: (e) => { },
        level: "alunoEM",
        opcoes: ["1º", "2º", "3º"]
    },
    {
        title: "Qual vestibular você pretende fazer?",
        type: "selectVestibular",
        value: "",
        onChange: (e) => { },
        level: "alunoEM",
        opcoes: ["FUVEST", "ITA", "ENEM", "VUNESP", "UNICAMP", "Outros..."]
    }
]

export const inputVestibulando: InputText[] = [
    {
        title: "Você já se formou no Ensino Médio?",
        type: "selectFormado",
        value: "",
        onChange: (e) => { },
        level: "vestibulando",
        opcoes: ["Sim", "Não"]
    },
    {
        title: "Você trabalha?",
        type: "selectTrabalho",
        value: "",
        onChange: (e) => { },
        level: "vestibulando",
        opcoes: ["Sim", "Não"]

    },
    {
        title: "Qual vestibular você pretende fazer?",
        type: "selectVestibular",
        value: "",
        onChange: (e) => { },
        level: "vestibulando",
        opcoes: ["FUVEST", "ITA", "ENEM", "VUNESP", "UNICAMP", "Outros..."]
    }

]

export default inputs;