import { useEffect, useState } from 'react'
import styles from "@/styles/singlePostpage.module.scss"
import Sidebar from "@/components/Sidebar";
import { useRouter } from 'next/router'
import Api from '@/api'
import Tweet from '@/components/UserPost'
import monthsMap from "@/utils/getMonth";
import MainTweet from '@/components/MainTweet';
import { FaArrowLeft } from 'react-icons/fa6';
import AuthDataType from '@/types/authDataType';
import { GetServerSideProps } from 'next';


export type Postagem = {
    id_postagem: string | number;
    nome: string;
    username: string;
    content: string;
    content_post?: string;
    created_at?: string | Date;
    foto: string;
    total_comments: number;
    alredyliked: number | boolean;
    total_likes: number;
};

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
export default function SinlgePostagem({ authData }: Props) {
    const router = useRouter()
    const { id_postagem } = router.query
    const [isVisible, setIsVisible] = useState(false)
    const [loading, setLoading] = useState(true)
    const [comentsVisible, setComentsVisible] = useState(false)
    const [coments, setComents] = useState<Postagem[]>([])
    const [postagem, setPostagem] = useState<Postagem[]>([])
    const [userInfo, setUserInfo] = useState<string[]>([])

    const handleGetSinglePost = async () => {
        if (!id_postagem || (typeof id_postagem !== "string" && typeof id_postagem !== "number")) {
            return <>Carregando </>
        }
        try {
            setLoading(true)

            const promise = await Api.getSinglePostagem(id_postagem);
            if (promise.status === 200) {
                setPostagem(promise.data.data)
                setIsVisible(true)
            } else if (promise.data.length < 0) {
                setPostagem([]);
                setIsVisible(false);
            } else {
                console.log("nao ta aparecendo nada")
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    const handleGetComentarios = async () => {
        if (!id_postagem || (typeof id_postagem !== "string" && typeof id_postagem !== "number")) {
            return <>carregando</>;
        } else {
            try {
                setLoading(true)
                const promise = await Api.getComentarios(id_postagem)
                if (promise.status === 200) {
                    setComentsVisible(true)
                    console.log(promise.data)
                    setComents(promise.data.data)
                } else {
                    setComentsVisible(false)
                }
            } catch (error) {
                console.log("error", error)
            } finally {
                setLoading(false)
            }
        }
    }

    const updateComments = (coment: Postagem) => {
        setComents((prev) => [...prev, coment]);
    }
    useEffect(() => {
        if (!id_postagem || (typeof id_postagem !== "string" && typeof id_postagem !== "number")) {
            return;
        }
        try {
            handleGetSinglePost()
            handleGetComentarios()
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

    }, [id_postagem])

    return (
        <>
            {!loading && <Sidebar setInfo={setUserInfo} userInfo={userInfo} authData={authData} />}
            <div className={styles.btnBack}>
                <div className={styles.btt}>
                    <button onClick={() => router.back()}>
                        <FaArrowLeft size={"1.5em"} color='#666' />
                    </button>
                    <p>Post</p>
                </div>
            </div>
            <div className={styles.main}>
                <div className={styles.postMain}>

                    {isVisible && postagem.length === 1 && postagem.map((post, idx) => (
                        < MainTweet
                            updateComment={updateComments}
                            key={post.id_postagem || idx}
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
                            timestamp={post.created_at!}
                            alredyLiked={post.alredyliked}
                            likes={post.total_likes}
                            comments={+post.total_comments}
                            userImage={userInfo[1]}
                        />
                    ))}
                </div>
                <div className={styles.container_comentarios}>
                    <div className={styles.comments}>
                        {comentsVisible && coments.length > 0 && coments.map((comentario, idx) => (
                            <Tweet
                                key={comentario.id_postagem || idx}
                                id={comentario.id_postagem}
                                name={comentario.nome}
                                username={comentario.username}
                                date={
                                    comentario.created_at
                                        ? (typeof comentario.created_at === "string"
                                            ? comentario.created_at
                                            : new Date(comentario.created_at).toLocaleDateString())
                                        : "Data não informada"
                                }
                                content={comentario.content}
                                profileImage={comentario.foto}
                                timestamp={comentario.created_at ? (typeof comentario.created_at === "string" ? comentario.created_at : new Date(comentario.created_at).getDate().toString() + " de " + monthsMap[new Date(comentario.created_at).getMonth()]) : ""}
                                alredyLiked={false}
                                likes={0}
                                comments={comentario.total_comments}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}