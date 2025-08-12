function getAuth() {
    const auth = localStorage.getItem('auth');
    if (auth) {
        return auth
    }
    return null;
}

export default getAuth