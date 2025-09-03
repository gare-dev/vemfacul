
import Api from "@/api";
import LoadingComponent from "@/components/LoadingComponent";
import Sidebar from "@/components/Sidebar";
import useAlert from "@/hooks/useAlert";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import styles from "@/styles/comunidade.module.scss";
import { PostsType } from "@/types/postsType";
import UserPost from "@/components/UserPost";
import monthsMap from "@/utils/getMonth";
import CreatePostagem from "@/components/CreatePostagem";
import { useRouter } from "next/router";
import { FaPen } from "react-icons/fa";


export default function Comunidade() {
    const [posts, setPosts] = useState<PostsType[]>([])
    const [loading, setLoading] = useState(true);
    const { showAlert } = useAlert()
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

    const handleGetPosts = async () => {
        try {
            const response = await Api.selectAllPosts();

            if (response.status === 200) {
                setPosts(response.data.data);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.code === 'ERR_NETWORK') {
                    showAlert('Não foi possível obter os posts, tente novamente mais tarde.', 'danger');
                }
                if (error.response?.data.code === "POSTAGEM_NOT_FOUND") {
                    showAlert('Nenhum post encontrado.', 'danger');
                }
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleGetPosts();
    }, [])


    return (
        <>

            <Sidebar isLoading={loading} setIsLoading={setLoading} />
            <CreatePostagem
                onPostTweet={handlePostTweet}
                isOpen={isPopupOpen}
                onClose={handleClosePopup}
                onReload={() => router.reload()}
            />
            {loading && (
                <div className={styles.loadingContainer}>
                    <LoadingComponent isLoading={loading} />
                </div>

            )}
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
                            comments={0}
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