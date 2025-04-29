export type Register = {
    nome?: string;
    foto?: File | null | Blob;
    estado?: "SP" | "RJ" | "MG" | "ES" | "BA" | "SE" | "AL" | "PE" | "PB" | "RN" | "CE" | "PI" | "MA" | "PA" | "AP" | "TO" | "MT" | "MS" | "GO" | "DF" | "RO" | "AC" | "AM" | "RR" | "";
    nivel?: "Aluno EM" | "Universitário" | "Vestibulando" | "Professor" | "";
    escola?: string;
    ano?: string
    vestibulares?: string[];
    passouVestibular?: boolean;
    universidade?: string;
    curso?: string;
    formouEM?: boolean;
    trabalha: boolean | undefined
    instituicao?: string;
    materiasLecionadas?: string[];
}


