function containsWord(text: string, words: string[]): boolean {
    const lowerText = text.toLowerCase();

    return words.some(word => lowerText.includes(word.toLowerCase()));
}

export default containsWord