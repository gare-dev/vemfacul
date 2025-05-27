export default function padzero(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
}