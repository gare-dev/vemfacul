export default function getAdminToken() {
    const token = localStorage.getItem('admin_token');
    if (token) {
        return token;
    }
    return null;
}