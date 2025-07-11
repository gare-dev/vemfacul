

export function maskCNPJ(value: string): string {
    return value
        .replace(/\D/g, '')                      // remove tudo que não for dígito
        .replace(/^(\d{2})(\d)/, '$1.$2')        // insere o primeiro ponto
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3') // segundo ponto
        .replace(/\.(\d{3})(\d)/, '.$1/$2')      // a barra
        .replace(/(\d{4})(\d)/, '$1-$2')         // o hífen
        .replace(/(-\d{2})\d+?$/, '$1');         // impede que digite mais que 14 números
}


export default maskCNPJ