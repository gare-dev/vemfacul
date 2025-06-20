
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
import getAuth from "@/utils/getAuth";
import { AxiosError } from "axios";
import { FaPen } from "react-icons/fa";

type Postagem = {
    id: string | number;
    content: string;
    content_post?: string;
    created_at?: string | Date;
};

export default function UserProfile() {
    const router = useRouter()
    const { username } = router.query;
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [user, setUser] = useState<string | null>(null);
    const [postVisible, setPostVisibel] = useState(false)
    const [isVisibleSubmitPost, setIsVisibleSubmitPost] = useState(false);
    const [postagens, setPostagens] = useState<Postagem[]>([]);
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
        materias_lecionadas: [],
        nivel: ""
    });

    const handleGetPostagens = async () => {
        if (typeof username !== "string") {
            return;
        } else {
            try {
                const promise = await Api.getPostagem(username)

                if (promise.data.code === "POSTAGENS_FOUND") {
                    console.log("apareceu")
                    setPostagens(promise.data.postagens)
                    setPostVisibel(true)
                } else if (promise.data.code === "POSTAGEM_NOT_FOUND") {
                    setPostagens([]);
                    setPostVisibel(false);
                } else {
                    console.log("nao ta aparecendo nada")
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        if (typeof username === "string") {
            handleGetPostagens()
            console.log("ta rodando")
        }
    }, [username])

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
                    materias_lecionadas: [],
                    nivel: ""
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
            {isVisibleSubmitPost && <CreatePostagem
                btnClose={() => setIsVisibleSubmitPost(false)}
                refreshPage={() => router.reload()}
            />}
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
                    {postVisible && postagens.length > 0 && postagens.map((post, idx) => (
                        <UserPost
                            key={post.id || idx}
                            name={userProfile.nome}
                            username={userProfile.username}
                            date={
                                post.created_at
                                    ? (typeof post.created_at === "string"
                                        ? post.created_at
                                        : new Date(post.created_at).toLocaleDateString())
                                    : "Data não informada"
                            }
                            content={post.content}
                            profileImage={userProfile.foto}
                            timestamp={post.created_at ? (typeof post.created_at === "string" ? post.created_at : new Date(post.created_at).toISOString()) : ""}
                            likes={0}
                            comments={0}
                        />
                    ))}
                    {postVisible && postagens.length === 0 && (
                        <div><h1>nenhuma postagem encontrada</h1></div>
                    )}
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
