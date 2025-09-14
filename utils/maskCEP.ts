export function maskCEP(value: string): string {
    if (!value) return ""
    return value
        .replace(/\D/g, '')                  // Remove tudo que não for número
        .replace(/^(\d{5})(\d)/, '$1-$2')    // Insere o hífen após os 5 primeiros dígitos
        .replace(/(-\d{3})\d+?$/, '$1');     // Limita a 8 dígitos no total
}


export default maskCEP