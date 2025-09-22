
import Api from "@/api";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import styles from "@/styles/comunidade.module.scss";
import { PostsType } from "@/types/postsType";
import UserPost from "@/components/UserPost";
import monthsMap from "@/utils/getMonth";
import CreatePostagem from "@/components/CreatePostagem";
import { useRouter } from "next/router";
import { FaPen } from "react-icons/fa";
import { GetServerSideProps } from "next";
import AuthDataType from "@/types/authDataType";

interface Props {
    postsProp: PostsType[];
    authData?: AuthDataType | null | undefined;
}

function formatRelativeTime(timestamp: string | number | Date): string {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diffMs = now.getTime() - postDate.getTime();

    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);

    if (diffSec < 60) {
        return `há ${diffSec} s`;
    } else if (diffMin < 60) {
        return `há ${diffMin} min`;
    } else if (diffHours < 24) {
        return `há ${diffHours} h`;
    } else {
        return postDate.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }); 
    }
}


export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const cookie = ctx.req.headers.cookie
    Api.setCookie(cookie || "")
    try {
        const [posts, authData] = await Promise.all([
            Api.selectAllPosts(),
            Api.getProfileInfo()
        ])

        const eventos = posts.status === 200 ? posts.data.data.map((post: PostsType) => ({
            ...post,
            created_at: post.created_at ? (typeof post.created_at === "string" ? post.created_at : new Date(post.created_at).getDate() === new Date().getDate() ? formatRelativeTime(post.created_at) : new Date(post.created_at).toLocaleDateString()) : "Data não informada"
        })) : []

        return {
            props: {
                postsProp: eventos,
                authData: authData.data.code === "PROFILE_INFO" ? authData.data.data : null
            }
        }
    } catch (error) {
        console.error("Error fetching posts:", error)
        return {
            props: {
                postsProp: [],
                authData: null
            }
        }
    }
}

export default function Comunidade({ postsProp, authData }: Props) {
    const [posts,] = useState<PostsType[]>(postsProp || [])
    // const { showAlert } = useAlert()
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isVisibleSubmitPost, setIsVisibleSubmitPost] = useState(false);
    const router = useRouter();

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };
    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handlePostTweet = (tweet: string) => {
        console.log(tweet)
    }

    // const handleGetPosts = async () => {
    //     try {
    //         const response = await Api.selectAllPosts();

    //         if (response.status === 200) {
    //             setPosts(response.data.data);
    //         }
    //     } catch (error) {
    //         if (error instanceof AxiosError) {
    //             if (error.code === 'ERR_NETWORK') {
    //                 showAlert('Não foi possível obter os posts, tente novamente mais tarde.', 'danger');
    //             }
    //             if (error.response?.data.code === "POSTAGEM_NOT_FOUND") {
    //                 showAlert('Nenhum post encontrado.', 'danger');
    //             }
    //         }
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    // useEffect(() => {
    //     handleGetPosts();
    // }, [])


    return (
        <>

            <Sidebar authData={authData} />
            <div className={styles.searchBar}>
                {/* <SearchBar /> */}
            </div>
            <CreatePostagem
                onPostTweet={handlePostTweet}
                isOpen={isPopupOpen}
                onClose={handleClosePopup}
                onReload={() => router.reload()}
            />
            <div className={styles.comunidadeContainer}>
                <div className={styles.comunidadePosts}>
                    {posts.map((post, index) => (
                        <UserPost
                            alredyLiked={false}
                            key={0 || index}
                            id={post.id_postagem}
                            name={post.nome}
                            username={post.username}
                            date={
                                post.created_at
                                    ? (typeof post.created_at === "string"
                                        ? post.created_at
                                        : new Date(post.created_at).toLocaleDateString())
                                    : "Data não informada"
                            }
                            content={post.content}
                            profileImage={post.foto}
                            timestamp={post.created_at ? (typeof post.created_at === "string" ? post.created_at : new Date(post.created_at).getDate().toString() + " de " + monthsMap[new Date(post.created_at).getMonth()]) : ""}
                            likes={+(post.total_likes ?? 0)}
                            comments={post.total_comments}
                        />
                    ))}
                </div>
            </div>
            <div className={styles.content_btn_postagem} onClick={() => { setIsVisibleSubmitPost(!isVisibleSubmitPost); handleOpenPopup() }}>
                <button onClick={() => { setIsVisibleSubmitPost(!isVisibleSubmitPost); handleOpenPopup() }} className={styles.btn}>
                    <span onClick={() => { setIsVisibleSubmitPost(!isVisibleSubmitPost); handleOpenPopup() }}>
                        <FaPen />
                    </span>
                </button>
            </div>

        </>

    )



}