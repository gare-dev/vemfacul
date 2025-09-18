import Api from "@/api";
import CoursesApprovalList from "@/components/Common/Admin/CoursesApprovalList";
import { ApproveCourse } from "@/components/Common/Admin/HorizontalCard";
import Sidebar from "@/components/Sidebar";
import AuthDataType from "@/types/authDataType";
import { GetServerSideProps } from "next";

interface Props {
    Course: ApproveCourse[] | null
    authData?: AuthDataType | null;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    try {
        const cookie = ctx.req.headers.cookie
        Api.setCookie(cookie || "")
        const [approval_list, authData] = await Promise.all([
            Api.selectAproveList(),
            Api.getProfileInfo(),
        ])

        // TODO Provavelmente isso vai quebrar se não tiver nenhum cursinho pra ser aprovado, acho que da pra retornar 200 na API e mandar o array vazio
        return {
            props: {
                Course: approval_list.status === 200 ? approval_list.data.data : null,
                authData: authData.data.code === "PROFILE_INFO" ? authData.data.data : null
            }
        }
    } catch (error) {
        console.error("Erro ao selecionar lista de cursinhos a serem aprovados: " + error)

        return {
            props: {
                Course: null,
                authData: null
            }
        }
    }
}

export default function AprovarCursinho({ Course, authData }: Props) {
    return (

        <>
            <Sidebar authData={authData} />
            <CoursesApprovalList Course={Course} />
        </>
    )
}