function formatarRedacao(resposta: string): string {
    // Quebra por cada "### Competência" e também pela "### Nota Final"
    const partes = resposta.split(/###\s+/);

    let formatado = "";

    partes.forEach((parte) => {
        if (parte.trim().length === 0) return;

        if (parte.startsWith("Competência")) {
            const [titulo, ...resto] = parte.split("\n");
            formatado += `\n${titulo.trim()}\n${resto.join(" ").trim()}\n\n`;
        } else if (parte.startsWith("Nota Final")) {
            const [titulo, ...resto] = parte.split("\n");
            formatado += `\n${titulo.trim()}\n${resto.join(" ").trim()}\n\n`;
        }
    });

    return formatado.trim();
}

export default formatarRedacao