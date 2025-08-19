function formatDate(timestamp: string | Date): string {
    const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;

    // Hora no formato 12h com AM/PM
    const time = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });

    // Data no formato "13 de ago de 2025"
    const formattedDate = date.toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

    return `${time} · ${formattedDate}`;
}

export default formatDate