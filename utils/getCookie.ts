function getCookieValue(cookieName: string): string | null {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find(row => row.startsWith(`${cookieName}=`));
    return cookie ? cookie.split('=')[1] : null;
}

export default getCookieValue