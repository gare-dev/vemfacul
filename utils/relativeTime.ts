import { format } from "path";

function formatRelativeTime(timestamp: string | number | Date): string {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diffMs = now.getTime() - postDate.getTime();

    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);

    if (diffSec < 60) {
        return `há ${diffSec} s`;
    } else if (diffMin < 60) {
        return `há ${diffMin} min`;
    } else if (diffHours < 24) {
        return `há ${diffHours} h`;
    } else {
        return postDate.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    }
}
export default formatRelativeTime;