import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/router"
import styles from "@/styles/profile.module.scss"
import Api from "@/api";
import { useEffect, useState } from "react";
import LoadingComponent from "@/components/LoadingComponent";
import { UserProfileType } from "@/types/userProfileType";
import EditProfilePopup from "@/components/EditProfilePopup";
import CreatePostagem from "@/components/CreatePostagem";
import UserPost from "@/components/UserPost";
import { FaPen } from "react-icons/fa";


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
    const [isVisibleSubmitPost, setIsVisibleSubmitPost] = useState(false);

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
            {isVisible &&
                <EditProfilePopup
                    closePopup={() => setIsVisible(false)}
                    descricao={userProfile.descricao}
                    foto={userProfile.foto}
                    header={userProfile.header}
                    name={userProfile.nome}
                    refreshPage={() => router.reload()}
                />
            }
            {isVisibleSubmitPost && <CreatePostagem
                btnClose={() => setIsVisibleSubmitPost(false)

                } />}
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
                        <div className={styles.profileStats}>
                            <div className={styles.statsItem}>
                                <p>{userProfile.posts_number || 0}</p>
                                <span>Posts</span>
                            </div>
                            <div className={styles.statsItem}>
                                <p>{userProfile.followers_number || 0}</p>
                                <span>Seguidores</span>
                            </div>
                            <div className={styles.statsItem}>
                                <p>{userProfile.following_number || 0}</p>
                                <span>Seguindo</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.editProfile}>
                        <button onClick={() => setIsVisible(true)}>Editar Perfil</button>
                    </div>
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

                <div className={styles.content_btn_postagem} onClick={() => setIsVisibleSubmitPost(!isVisibleSubmitPost)}>
                    <button className={styles.btn}>
                        <span>
                            <FaPen />
                        </span>
                    </button>
                </div>
            </div>
        </>
    )
}