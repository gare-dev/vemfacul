
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/router"
import styles from "@/styles/profile.module.scss"
import Api from "@/api";
import { useEffect, useState } from "react";
import LoadingComponent from "@/components/LoadingComponent";
import { UserProfileType } from "@/types/userProfileType";
import EditProfilePopup from "@/components/EditProfilePopup";
import UserPost from "@/components/UserPost";
import getAuth from "@/utils/getAuth";
import { AxiosError } from "axios";


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

        const handleValidateProfile = async () => {
            if (getAuth()) {
                try {
                    const response = await Api.validateProfile()

                    if (response.data.code === "PROFILE_VALIDATED") {
                        setUser(response.data.data.username);
                    }
                } catch (error) {
                    console.log(error);
                }

            }
        }
        handleValidateProfile()

    }, []);


    const handleGetUserProfile = async () => {
        if (!username?.toString()) return router.push('/');

        try {
            const response = await Api.getUserProfile(username.toString());

            if (response.data.code === "USER_FOUND") {
                setUserProfile(response.data.data);
            }
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data.code === "USER_NOT_FOUND") {
                console.log("Usuário não encontrado");
                setUserProfile({
                    nome: "",
                    username: username?.toString() || "",
                    foto: "",
                    header: "",
                    descricao: "Essa conta não existe.",
                    followers_number: "0",
                    following_number: "0",
                    posts_number: "0",
                    vestibulares: [],
                    materias_lecionadas: []

                })


            }
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
                        {userProfile.username && <p>@{userProfile.username}</p>}
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
                <div className={styles.containerProfilePost}>
                    <UserPost
                        profilePhoto={userProfile.foto}
                        profilename={userProfile.nome}
                        username={userProfile.username}
                        postDate="20/04/2025" // exemplo
                        postContent="Oi pessoal da apresentação. Segue nosso insta @vemfacul2025" //exemplo
                    />
                    <UserPost
                        profilePhoto={userProfile.foto}
                        profilename={userProfile.nome}
                        username={userProfile.username}
                        postDate="20/04/2025" // exemplo
                        postContent="Oi pessoal da apresentação. Segue nosso insta @vemfacul2025" //exemplo
                    />
                </div>
            </div>
        </>
    )
}