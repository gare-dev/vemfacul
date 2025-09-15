import Api from "@/api";
import RequestsTable, { RequestLog } from "@/components/ApiLog";
import Sidebar from "@/components/Sidebar";
import AuthDataType from "@/types/authDataType";
import { GetServerSideProps } from "next";

interface Props {
    logs_props: RequestLog[]
    authData: AuthDataType | null;
}
export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    try {
        const cookie = ctx.req.headers.cookie
        Api.setCookie(cookie || "")

        const [logs_props, authData] = await Promise.all([
            Api.getAdminLogs(),
            Api.getProfileInfo()
        ])

        return {
            props: {
                logs_props: logs_props.status === 200 ? logs_props.data.data.map((log: RequestLog) => ({
                    ...log,
                    timestamp: log.timestamp ? (typeof log.timestamp === "string" ? log.timestamp : new Date(log.timestamp).toLocaleDateString()) : "Data não informada",
                    response_body: log.response_body ? (typeof log.response_body === "string" ? log.response_body : new Date(log.response_body).toLocaleDateString()) : "Data não informada",
                })) : null,
                authData: authData.data.code === "PROFILE_INFO" ? authData.data.data : null
            }
        }

    } catch (error) {
        console.error("Erro ao carregar logs ou authData: " + error)
        return {
            props: {
                logs_props: null,
                authData: null
            }
        }
    }
}

export default function Teste({ authData, logs_props }: Props) {
    return (
        <>
            <Sidebar authData={authData} />
            <RequestsTable logs_props={logs_props} />
        </>
    )
}