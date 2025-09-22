import Api from "@/api";
import QuickTest from "@/components/QuickTest";
import Ranking from "@/components/RankingUsers"
import Sidebar from "@/components/Sidebar"
import AuthDataType from "@/types/authDataType";
import { GetServerSideProps } from "next";
import { useState } from "react";

interface Props {
    authData?: AuthDataType | null | undefined;

}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    try {
        const cookie = ctx.req.headers.cookie
        Api.setCookie(cookie || "")

        const authData = await Api.getProfileInfo()

        return {
            props: {
                authData: authData.data.code === "PROFILE_INFO" ? authData.data.data : null
            }
        }
    } catch (error) {
        console.log(error)
        return {
            props: {
                authData: null
            }
        }
    }
}

export default function Main({ authData }: Props) {
    const [userInfo, setUserInfo] = useState<string[]>([])


    return (
        <>
            <Sidebar setInfo={setUserInfo} userInfo={userInfo} authData={authData} />
            <QuickTest></QuickTest>
        </>
    )
}