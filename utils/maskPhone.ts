export function maskPhone(value: string): string {
    // Remove tudo que não for número
    const cleaned = value.replace(/\D/g, '');

    if (cleaned.length <= 10) {
        // Formato fixo: (99) 9999-9999
        return cleaned.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    } else {
        // Formato celular: (99) 99999-9999
        return cleaned.replace(/^(\d{2})(\d{5})(\d{0,4})$/, '($1) $2-$3');
    }
}
export function unmaskPhone(value: string): string {
    // Remove tudo que não for número
    return value.replace(/\D/g, '');
}