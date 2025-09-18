
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/router"
import styles from "@/styles/profile.module.scss"
import Api from "@/api";
import { useEffect, useState } from "react";
import { UserProfileType } from "@/types/userProfileType";
import EditProfilePopup from "@/components/EditProfilePopup";
import CreatePostagem from "@/components/CreatePostagem";
import UserPost from "@/components/UserPost";
import { FaPen } from "react-icons/fa";
import Head from "next/head";
import monthsMap from "@/utils/getMonth";
import { GetServerSideProps } from "next";
import { RESERVED_ROUTES } from "@/middleware";
import AuthDataType from "@/types/authDataType";
import { MdVerified } from "react-icons/md";

type Postagem = {
    id_postagem: string | number;
    content: string;
    content_post?: string;
    created_at?: string | Date;
    total_comments: number;
    alredyliked: number | boolean;
    total_likes: number;
};

type Props = {
    userProfileProp: UserProfileType;
    postagensProp: Postagem[];
    authData?: AuthDataType | null | undefined;
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    if (RESERVED_ROUTES.includes(context.params?.username as string) || context.params?.username === "null") {
        return {
            notFound: true
        }
    }

    try {
        const cookie = context.req.headers.cookie
        Api.setCookie(cookie || "")
        const [userProfile, postagens, authData] = await Promise.all([
            Api.getUserProfile(context.params?.username as string),
            Api.getPostagem(context.params?.username as string),
            Api.getProfileInfo()
        ]);

        const post = postagens.data.data.map((post: Postagem) => ({
            ...post,
            created_at: post.created_at ? (typeof post.created_at === "string" ? post.created_at : new Date(post.created_at).toLocaleDateString()) : "Data não informada"
        }));

        return {
            props: {
                userProfileProp: userProfile.data.data[0],
                postagensProp: post,
                authData: authData.data.code === "PROFILE_INFO" ? authData.data.data : null
            }
        }
    } catch (error) {
        console.error("Error fetching user profile or postagens:", error);
        return {
            props: {
                userProfileProp: null,
                postagensProp: [],
                authData: null
            }
        }
    }
}

export default function UserProfile({ userProfileProp, postagensProp, authData }: Props) {
    const router = useRouter()
    const { username } = router.query;
    const [isVisible, setIsVisible] = useState(false);
    const [user, setUser] = useState<string | null>(null);
    const [isVisibleSubmitPost, setIsVisibleSubmitPost] = useState(false);
    const [postagens,] = useState<Postagem[]>(postagensProp || []);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [userProfile,] = useState<UserProfileType>(userProfileProp || {
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
        nivel: "",
    });

    const typeEmojiMap: Record<string, string> = {
        "Professor": '👨‍🏫',
        "Aluno EM": '🧑‍🎓',
        "Vestibulando": '🧑‍🎓',
        guest: '👤'
    };

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };
    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handlePostTweet = (tweet: string) => {
        console.log(tweet)
    }

    // const handleGetPostagens = async () => {
    //     if (typeof username !== "string") {
    //         return;
    //     } else {
    //         try {
    //             setLoading(true)
    //             const promise = await Api.getPostagem(username);

    //             if (promise.status === 200) {
    //                 setPostagens(promise.data.data)
    //                 setPostVisibel(true)
    //             } else if (promise.data.code === "POSTAGEM_NOT_FOUND") {
    //                 setPostagens([]);
    //                 setPostVisibel(false);
    //             } else {
    //                 console.log("nao ta aparecendo nada")
    //             }
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     }
    // }

    // useEffect(() => {
    //     if (typeof username === "string") {
    //         handleGetPostagens()
    //     }
    // }, [username])

    useEffect(() => {

        (async () => {
            try {
                const response = await Api.validateProfile()

                if (response.data.code === "PROFILE_VALIDATED") {
                    setUser(response.data.data.username);
                }
            } catch (error) {
                console.log(error);
            }
        })()
    }, []);


    // const handleGetUserProfile = async () => {
    //     if (!username?.toString()) return router.push('/');

    //     try {
    //         setLoading(true);
    //         const response = await Api.getUserProfile(username.toString());

    //         if (response.status === 200) {
    //             setUserProfile(response.data.data[0]);
    //         }
    //     } catch (error) {
    //         console.log("ASd")
    //         if (error instanceof AxiosError && error.response?.data.code === "USER_NOT_FOUND") {
    //             console.log("Usuário não encontrado");
    //             setUserProfile({
    //                 nome: "",
    //                 username: username?.toString() || "",
    //                 foto: "",
    //                 header: "",
    //                 descricao: "Essa conta não existe.",
    //                 followers_number: "0",
    //                 following_number: "0",
    //                 posts_number: "0",
    //                 vestibulares: [],
    //                 materias_lecionadas: [],
    //                 nivel: "",
    //             })
    //         }
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    // useEffect(() => {
    //     if (username?.toString()) handleGetUserProfile()
    // }, [username])

    return (
        <>
            {<Sidebar authData={authData} />}
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
            {isVisibleSubmitPost &&
                <CreatePostagem
                    onPostTweet={handlePostTweet}
                    isOpen={isPopupOpen}
                    onClose={handleClosePopup}
                    onReload={() => router.reload()}
                />
            }
            <div className={styles.main}>
                <Head>
                    <title>{`${userProfile.nome} | Perfil`}</title>
                    <meta name="description" content={`Profile page for ${userProfile.nome}`} />
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <div className={styles.profileContainer}>

                    <div className={styles.headerImageContainer}>
                        <img
                            src={userProfile.header === '' ? undefined : userProfile.header}

                            className={styles.headerImage}
                        />
                    </div>

                    <div className={styles.profileInfoContainer}>
                        <div className={styles.profilePictureContainer}>
                            <img
                                src={userProfile.foto === '' ? undefined : userProfile.foto}
                                alt={`${userProfile.nome}'s profile`}
                                className={styles.profilePicture}
                            />
                            {user === username &&
                                <button onClick={() => setIsVisible(true)} className={styles.editProfileButton}>
                                    Editar Perfil
                                </button>}
                        </div>

                        <div className={styles.nameSection}>
                            <h1 className={styles.name}>
                                {userProfile.nome}{" "}
                                {authData?.role === "admin" && (
                                    <span className={styles.verifiedWrapper}>
                                        <MdVerified className={styles.icone} size={"1.2em"} />
                                        <div className={styles.tooltipBox}>
                                            Usuário verificado por ser um desenvolvedor do VemFacul.
                                        </div>
                                    </span>
                                )}
                            </h1>
                            <p className={styles.username}>@{userProfile.username}</p>
                        </div>

                        <div className={styles.typeIndicator}>
                            <span className={styles.typeEmoji}>{typeEmojiMap[userProfile.nivel] || '👤'}</span>
                            <span className={styles.typeText}>{userProfile.nivel?.charAt(0).toUpperCase() + userProfile.nivel?.slice(1)}</span>
                        </div>

                        {/* Description */}
                        <p className={styles.description}>{userProfile.descricao}</p>
                        <h3> Questões corretas: {userProfile.acertosuser}</h3>

                        {/* University Interests */}
                        <div className={styles.universityInterests}>
                            <h3 className={styles.interestsTitle}>{userProfile.nivel === "Aluno EM" ? "Vestibulares" : "Matérias Lecionadas"}</h3>
                            <ul className={styles.universityList}>
                                {userProfile.nivel === "Aluno EM" ? userProfile.vestibulares?.map((university, index) => (
                                    <li key={index} className={styles.universityItem}>
                                        {university}
                                    </li>
                                )) : userProfile.nivel === "Vestibulando" ? userProfile.vestibulares?.map((university, index) => (
                                    <li key={index} className={styles.universityItem}>
                                        {university}
                                    </li>
                                )) : userProfile.materias_lecionadas?.map((university, index) => (
                                    <li key={index} className={styles.universityItem}>
                                        {university}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={styles.containerProfilePost} style={{ borderRadius: 2 }}>
                    {postagensProp.length > 0 && postagensProp.map((post, idx) => (
                        <UserPost
                            key={0 || idx}
                            id={post.id_postagem}
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
                            timestamp={post.created_at ? (typeof post.created_at === "string" ? post.created_at : new Date(post.created_at).getDate().toString() + " de " + monthsMap[new Date(post.created_at).getMonth()]) : ""}
                            alredyLiked={post.alredyliked}
                            likes={post.total_likes}
                            comments={post.total_comments}
                        />
                    ))}
                    {postagens.length === 0 && (
                        <div><h1 style={{ textAlign: "center" }}>Nenhuma postagem encontrada</h1></div>
                    )}
                </div>

                <div className={styles.content_btn_postagem} onClick={() => { setIsVisibleSubmitPost(!isVisibleSubmitPost); handleOpenPopup() }}>
                    <button onClick={() => { setIsVisibleSubmitPost(!isVisibleSubmitPost); handleOpenPopup() }} className={styles.btn}>
                        <span onClick={() => { setIsVisibleSubmitPost(!isVisibleSubmitPost); handleOpenPopup() }}>
                            <FaPen />
                        </span>
                    </button>
                </div>
            </div>
        </>
    )
}
