
import Api from '@/api/'
import TweetPopup from '../CreatePostagem';
import React, { useEffect, useState } from 'react';
import styles from '@/styles/maintweet.module.scss';
import { useRouter } from 'next/router';
import formatDate from '@/utils/formatDate';
import { AxiosError } from 'axios';
import { Postagem as Post } from '@/pages/postagem/[id_postagem]';


interface TweetProps {
    id: number | string;
    content: string;
    name: string;
    username: string;
    profileImage: string;
    timestamp: string | Date;
    alredyLiked: number | boolean;
    likes: number;
    comments: number;
    date: string
    userImage: string;
    updateComment: (comment: Post) => void
}

interface Postagem {
    name: string;
    username: string;
    id_postagem: string | number;
    content: string;
    content_post?: string;
    profileImage: string;
}

const MainTweet: React.FC<TweetProps> = ({
    id,
    content,
    name,
    username,
    profileImage,
    timestamp,
    alredyLiked,
    likes,
    comments,
    userImage,
    updateComment
}) => {
    const router = useRouter()
    const [isLiked, setIsLiked] = useState(alredyLiked);
    const [currentLikes, setCurrentLikes] = useState(likes);
    const [currentComments, setCurrenComments] = useState(comments);
    const [isVisibleSubmitPost, setIsVisibleSubmitPost] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [postagemPai, setPostagemPai] = useState<Postagem | null>(null)
    const [answerText, setAnswerText] = useState('');
    const [, setError] = useState('');

    const liked = () => {
        if (alredyLiked) {
            setIsLiked(true)
        } else {
            setIsLiked(false)
        }
    }
    const handleOpenPopup = (post: Postagem) => {
        setPostagemPai(post)
        setIsPopupOpen(true);
    };
    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };
    const handlePostTweet = (tweet: string) => {
        setCurrenComments((prev) => prev + 1)
        console.log('Tweet posted:', tweet);
    };

const handleLike = async () => {
    if (isLiked) {
      const promise = await Api.unLinkePostagem(id);
      if (promise.status === 201) {
        setCurrentLikes(currentLikes - 1);
        setIsLiked(false);
      }
    } else {
      const promise = await Api.likePostagem(id);
      if (promise.status === 201) {
        setCurrentLikes(currentLikes + 1);
        setIsLiked(true);
      }
    }
  };
    useEffect(() => {
        if (typeof id !== "string" && typeof id !== "number") {
            liked();
        }
    }, [])

    const handlePostComentario = async (e: React.FormEvent) => {

        if (answerText.trim()) {
            e.preventDefault();
            if (answerText.length === 0) {
                return setError("Você não pode postar um post vazio.");
            }
            if (answerText.length > 280) {
                return setError("O tweet não pode exceder 280 caracteres.");
            }
            try {

                const response = await Api.createComentario(id, answerText);
                console.log('api')
                if (response.status === 201) {
                    handlePostTweet(answerText);
                    setAnswerText('');
                    updateComment({
                        nome: name,
                        username,
                        id_postagem: id,
                        content: answerText,
                        alredyliked: false,
                        foto: userImage,
                        total_comments: 0,
                        total_likes: 0,
                        created_at: new Date()
                    })
                    return
                }

            } catch (error) {
                if (error instanceof AxiosError) {
                    if (error.response?.data.code === "COMENT_ERROR") {
                        setError("Ocorreu um erro ao postar o tweet. Tente novamente mais tarde.");
                    }
                }
            }
        }
    };

    return (
        <div className={styles.tweetContainer} >
            {isVisibleSubmitPost && (id && typeof id === "string" || typeof id === "number") && (
                <TweetPopup
                    coment
                    postagemID_pai={id}
                    postagemInfo_pai={postagemPai ?? undefined}
                    isOpen={isPopupOpen}
                    onClose={handleClosePopup}
                    onReload={() => router.reload()}
                    onPostTweet={handlePostTweet}
                />
            )
            }
            <div className={styles.tweetContent}>
                {/* Profile Image */}
                <div className={styles.profileImageContainer}>
                    <img
                        src={profileImage}
                        alt={`${name}'s profile`}
                        className={styles.profileImage}
                    />
                    <div className={styles.tweetHeader}>
                        <span className={styles.name}>{name}</span>
                        <span className={styles.username}>@{username}</span>
                    </div>
                </div>

                {/* Tweet Body */}
                <div className={styles.tweetBody} style={{ 'cursor': 'pointer' }} onClick={() => { router.replace(`/postagem/${id}`) }}>



                    {/* Tweet Text */}
                    <p className={styles.tweetText}> {content}</p>
                    <span className={styles.timestamp}>{formatDate(timestamp)}</span>


                    {/* Tweet Actions */}

                    <hr className={styles.divider} />

                    <div className={styles.tweetActions}>
                        {/* Comment Button */}
                        <button className={styles.actionButton} onClick={(e) => {
                            e.stopPropagation()
                            setIsVisibleSubmitPost(!isVisibleSubmitPost); handleOpenPopup({
                                name: name,
                                username: username,
                                id_postagem: id,
                                content,
                                content_post: content,
                                profileImage: profileImage
                            })
                        }}>
                            <svg
                                className={styles.actionIcon}
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <g>
                                    <path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></path>
                                </g>
                            </svg>
                            <span>{+currentComments}</span>
                        </button>

                        {/* Like Button */}
                        <button
                            className={`${styles.actionButton} ${isLiked ? styles.liked : ''}`}
                            onClick={(e) => {
                                e.stopPropagation()
                                handleLike()
                            }}
                        >

                            <svg
                                className={styles.actionIcon}
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <g>
                                    {isLiked ? (
                                        <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"></path>
                                    ) : (
                                        <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"></path>
                                    )}
                                </g>
                            </svg>
                            <span>{currentLikes}</span>
                        </button>

                        {/* Share Button */}
                        <button className={styles.actionButton} onClick={(e) => e.stopPropagation()}>
                            <svg
                                className={styles.actionIcon}
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <g>
                                    <path d="M17.53 7.47l-5-5c-.293-.293-.768-.293-1.06 0l-5 5c-.294.293-.294.768 0 1.06s.767.294 1.06 0l3.72-3.72V15c0 .414.336.75.75.75s.75-.336.75-.75V4.81l3.72 3.72c.146.147.338.22.53.22s.384-.072.53-.22c.293-.293.293-.767 0-1.06z"></path>
                                    <path d="M19.708 21.944H4.292C3.028 21.944 2 20.916 2 19.652V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 .437.355.792.792.792h15.416c.437 0 .792-.355.792-.792V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 1.264-1.028 2.292-2.292 2.292z"></path>
                                </g>
                            </svg>
                        </button>

                    </div>
                    <hr className={styles.divider} />
                    <div onClick={(e) => e.stopPropagation()} className={styles.respondePost}>
                        <img src={userImage} alt="User Avatar" className={styles.avatar} />
                        <input value={answerText} onChange={(e) => { setAnswerText(e.target.value) }} type="text" placeholder='Poste sua resposta' className={styles.input} />
                        <button onClick={(e) => {
                            handlePostComentario(e);

                            e.stopPropagation();
                        }} className={styles.submitButton}>Enviar</button>
                    </div>

                </div>
            </div>
        </div >
    );
};

export default MainTweet;

// SCSS module styles
<style jsx global>{`
  @import './Tweet.module.scss';
`}</style>
