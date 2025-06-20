function getAuth() {
    const auth = localStorage.getItem('auth');
    if (auth) {
        console.log("Auth found in localStorage");
        return auth
    }
    console.log("No auth found in localStorage");
    return null;
}

export default getAuth