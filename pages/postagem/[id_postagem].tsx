import { useEffect, useState } from 'react'
import styles from "@/styles/singlePostpage.module.scss"
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter } from 'next/router'
import Api from '@/api'
import Tweet from '@/components/UserPost'
import monthsMap from "@/utils/getMonth";

type Postagem = {
    id_postagem: string | number;
    nome: string;
    username: string;
    content: string;
    content_post?: string;
    created_at?: string | Date;
    foto: string;
    total_comments: number;
    alredyLiked: number | boolean;
    total_likes: number;
};
export default function SinlgePostagem() {
    const router = useRouter()
    const { id_postagem } = router.query
    const [isVisible, setIsVisible] = useState(false)
    const [comentsVisible, setComentsVisible] = useState(false)
    const [coments, setComents] = useState<Postagem[]>([])
    const [postagem, setPostagem] = useState<Postagem[]>([])

    const handleGetSinglePost = async () => {
        if (!id_postagem || (typeof id_postagem !== "string" && typeof id_postagem !== "number")) {
            return <>Carregando </>
        }
        try {
            const promise = await Api.getSinglePostagem(id_postagem);
            if (promise.data.code === "POSTAGENS_FOUND") {
                setPostagem(promise.data.postagem)
                setIsVisible(true)
            } else if (promise.data.length < 0) {
                setPostagem([]);
                setIsVisible(false);
            } else {
                console.log("nao ta aparecendo nada")
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleGetComentarios = async () => {
        if (!id_postagem || (typeof id_postagem !== "string" && typeof id_postagem !== "number")) {
            return <>carregando</>;
        } else {

            console.log("comentarios_certo");
            try {
                console.log("promise")
                const promise = await Api.getComentarios(id_postagem)
                if (promise.data.code === "COMENTS_FOUND") {
                    setComentsVisible(true)
                    setComents(promise.data.coments)
                } else {
                    setComentsVisible(false)
                }
            } catch (error) {
                console.log("error", error)
            }
        }
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
        }

    }, [id_postagem])

    return (
        <>
            <div className={styles.main}>
                <div className={styles.btnBack}>
                    <button onClick={() => router.back()}>
                        <IoMdArrowRoundBack />
                    </button>
                </div>
                <div className={styles.postMain}>
                    {isVisible && postagem.length == 1 && postagem.map((post, idx) => (
                        
                        < Tweet
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
                            timestamp={post.created_at ? (typeof post.created_at === "string" ? post.created_at : new Date(post.created_at).getDate().toString() + " de " + monthsMap[new Date(post.created_at).getMonth()]) : ""}
                            alredyLiked={post.alredyLiked}
                            likes={post.total_likes}
                            comments={+post.total_comments}
                        />
                    ))}
                </div>
                <div className={styles.container_comentarios}>
                    {comentsVisible && coments.length > 0 && coments.map((comentario, idx) => (
                        < Tweet
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
        </>
    )
}