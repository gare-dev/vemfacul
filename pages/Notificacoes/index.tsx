import Api from "@/api";
import Notification from "@/components/Notification";
import Sidebar from "@/components/Sidebar"
import useNotifications from "@/hooks/useNotifications";
import AuthDataType from "@/types/authDataType";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";

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
    const { setNotifications } = useNotifications();

    useEffect(() => {
        setNotifications(0);
    }, [])

    return (
        <>
            <Sidebar setInfo={setUserInfo} userInfo={userInfo} authData={authData} />
            <Notification />
        </>
    )
}