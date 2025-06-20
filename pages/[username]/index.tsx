import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/router"
import styles from "@/styles/profile.module.scss"
import Api from "@/api";
import { useEffect, useState } from "react";
import LoadingComponent from "@/components/LoadingComponent";
import { UserProfileType } from "@/types/userProfileType";
import EditProfilePopup from "@/components/EditProfilePopup";
import CreatePostagem from "@/components/CreatePostagem";
import getAuth from "@/utils/getAuth";
import { AxiosError } from "axios";
import { FaPen } from "react-icons/fa";
import Head from "next/head";
import Tweet from "@/components/UserPost";


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
        materias_lecionadas: [],
        nivel: ""
    });
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [user, setUser] = useState<string | null>(null);

    const typeEmojiMap: Record<string, string> = {
        teacher: '👨‍🏫',
        "Aluno EM": '🧑‍🎓',
        admin: '🔧',
        guest: '👤'
    };

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

    const [isVisibleSubmitPost, setIsVisibleSubmitPost] = useState(false);

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
                btnClose={() => setIsVisibleSubmitPost(false)

                } />}
            <div className={styles.main}>
                <Head>
                    <title>{userProfile.nome} | Profile</title>
                    <meta name="description" content={`Profile page for ${userProfile.nome}`} />
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <div className={styles.profileContainer}>
                    {/* Header Image */}
                    <div className={styles.headerImageContainer}>
                        <img
                            src={userProfile.header}
                            alt="Header background"
                            className={styles.headerImage}
                        />
                    </div>

                    <div className={styles.profileInfoContainer}>
                        <div className={styles.profilePictureContainer}>
                            <img
                                src={userProfile.foto}
                                alt={`${userProfile.nome}'s profile`}
                                className={styles.profilePicture}
                            />
                            {user === username && <button onClick={() => setIsVisible(true)} className={styles.editProfileButton}>
                                Edit profile
                            </button>}
                        </div>

                        <div className={styles.nameSection}>
                            <h1 className={styles.name}>{userProfile.nome}</h1>
                            <p className={styles.username}>@{userProfile.username}</p>
                        </div>

                        <div className={styles.typeIndicator}>
                            <span className={styles.typeEmoji}>{typeEmojiMap[userProfile.nivel] || '👤'}</span>
                            <span className={styles.typeText}>{userProfile.nivel.charAt(0).toUpperCase() + userProfile.nivel.slice(1)}</span>
                        </div>

                        <p className={styles.description}>{userProfile.descricao}</p>

                        <div className={styles.universityInterests}>
                            <h3 className={styles.interestsTitle}>{userProfile.nivel === "Aluno EM" ? "Vestibulares: " : "Matérias Lecionadas: "}</h3>
                            <ul className={styles.universityList}>
                                {userProfile.nivel === "Professor" ? userProfile.materias_lecionadas.map((university, index) => (
                                    <li key={index} className={styles.universityItem}>
                                        {university}
                                    </li>
                                )) : userProfile.vestibulares.map((university, index) => (
                                    <li key={index} className={styles.universityItem}>
                                        {university}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={styles.containerProfilePost}>
                    <Tweet
                        content="Just created a new profile page component with Next.js, TypeScript, and SCSS! #webdev #frontend"
                        name={userProfile.nome}
                        username={userProfile.username}
                        profileImage={userProfile.foto}
                        timestamp="2h ago"
                        likes={42}
                        comments={7}
                    />
                    <Tweet
                        content="Just created a new profile page component with Next.js, TypeScript, and SCSS! #webdev #frontend"
                        name={userProfile.nome}
                        username={userProfile.username}
                        profileImage={userProfile.foto}
                        timestamp="2h ago"
                        likes={42212}
                        comments={7}
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
