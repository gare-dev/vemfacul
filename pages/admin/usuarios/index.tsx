import Api from "@/api";
import UserList, { User } from "@/components/ListUser"
import Sidebar from "@/components/Sidebar";
import AuthDataType from "@/types/authDataType";
import { GetServerSideProps } from "next";


interface Props {
    users: User[]
    authData: AuthDataType
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    try {
        const cookie = ctx.req.headers.cookie
        Api.setCookie(cookie || "")
        const [users, authData] = await Promise.all([
            Api.getAdminUsers(),
            Api.getProfileInfo()
        ])



        return {
            props: {
                users: users.status === 200 ? users.data.data.map((users: User) => ({
                    ...users,
                    created_at: users.created_at ? (typeof users.created_at === "string" ? users.created_at : new Date(users.created_at).toLocaleDateString()) : "Data não informada"
                })) : null,
                authData: authData.data.code === "PROFILE_INFO" ? authData.data.data : null
            }
        }

    } catch (error) {
        console.error("Erro ao obter lista de usuários. " + error)
        return {
            props: {
                users: null,
                authData: null
            }
        }
    }
}
export default function Usuarios({ authData, users }: Props) {

    return (
        <>
            <Sidebar authData={authData} />
            <UserList users={users} />
        </>
    )
}