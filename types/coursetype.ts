// types/course.ts
export interface Course {

    id_cursinho: string;
    nome: string;
    nome_exibido: string;
    cidade: string;
    uf: string;
    faixa_preco: 'baixa' | 'media' | 'alta' | 'gratuito';
    logo: string;
    estado: string;
    regiao: string;
    modalidades: string[];
    disciplinas_foco: string[];
    tem_bolsa: boolean;
    aceita_programas_publico: boolean;
    media: number | null;
    total_avaliacoes: string;
}
