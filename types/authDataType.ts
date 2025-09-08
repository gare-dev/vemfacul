type AuthDataType = {
    foto: string
    nome: string
    email?: string
    username: string
}

type AdminAuthType = {
    id: string
    login: string
}
export type { AdminAuthType }
export default AuthDataType