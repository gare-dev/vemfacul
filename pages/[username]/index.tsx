
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/router"
import styles from "@/styles/profile.module.scss"
import Api from "@/api";
import { useEffect, useState } from "react";
import LoadingComponent from "@/components/LoadingComponent";
import { UserProfileType } from "@/types/userProfileType";
import EditProfilePopup from "@/components/EditProfilePopup";
import getCookieValue from "@/utils/getCookie";
import decodeJwt from "@/utils/decodeJwt";


export default function UserProfile() {
    const router = useRouter()
    const { username } = router.query;
    const [userProfile, setUserProfile] = useState<UserProfileType>({
        nome: "",
        username: "",
        foto: "",
        header: "",
        descricao: "",
        followers_number: "0",
        following_number: "0",
        posts_number: "0",
        vestibulares: [],
        materias_lecionadas: []
    });
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        const authCookie = getCookieValue("auth");
        if (authCookie) {
            const token: { username: string } = decodeJwt(authCookie);
            setUser(token.username);
        }
    }, []);


    const handleGetUserProfile = async () => {
        if (!username?.toString()) return router.push('/');

        try {
            const response = await Api.getUserProfile(username.toString());

            if (response.data.code === "USER_FOUND") {
                setUserProfile(response.data.data);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (username?.toString()) handleGetUserProfile()
    }, [username])
    return (
        <>
            {loading && <LoadingComponent />}
            {!loading && <Sidebar />}
            {isVisible && user === username &&
                <EditProfilePopup
                    closePopup={() => setIsVisible(false)}
                    descricao={userProfile.descricao}
                    foto={userProfile.foto}
                    header={userProfile.header}
                    name={userProfile.nome}
                    refreshPage={() => router.reload()}
                />
            }
            <div className={styles.main}>
                <div className={styles.profileContainer}>
                    <div className={styles.profileHeader}>
                        {userProfile.header && <img src={userProfile.header} alt="" />}
                    </div>
                    <div className={styles.profileImage}>
                        {userProfile.foto && <img src={userProfile.foto} alt="User profile" />}
                    </div>
                    <div className={styles.profileName}>
                        <p>{userProfile.nome}</p>
                    </div>
                    <div className={styles.profileUsername}>
                        <p>@{userProfile.username}</p>
                    </div>
                    <div className={styles.profileDescription}>
                        <p>{userProfile.descricao}</p>
                    </div>
                    {user === username &&
                        <div className={styles.editProfile}>
                            <button onClick={() => setIsVisible(true)}>Editar Perfil</button>
                        </div>}
                    <div className={styles.interesses}>
                        <p>{Array.isArray(userProfile.vestibulares) ? userProfile.vestibulares?.map((interesse, index) => {
                            return (
                                `${index > 0 ? ', ' : ''}${interesse}`
                            )
                        }) : userProfile.vestibulares}</p>
                    </div>
                </div>
            </div>
        </>
    )
}