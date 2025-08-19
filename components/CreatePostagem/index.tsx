import Api from '@/api';
import styles from '@/styles/createPostagem.module.scss';
import post_styles from '@/styles/userPost.module.scss';
import React, { useState } from 'react';
import { AxiosError } from 'axios';


interface TweetPopupProps {
    isOpen: boolean;
    coment?: boolean;
    postagemID_pai?: number | string;
    postagemInfo_pai?: Postagem;
    onClose: () => void;
    onReload: () => void;
    onPostTweet: (tweet: string) => void
}

interface Postagem {
    name: string;
    username: string;
    id_postagem: string | number;
    content: string;
    content_post?: string;
    created_at?: string | Date;
    profileImage: string;
}

const TweetPopup: React.FC<TweetPopupProps> = ({ isOpen, coment, postagemID_pai, postagemInfo_pai, onClose, onPostTweet, onReload }) => {
    const [tweetText, setTweetText] = useState('');
    const [error, setError] = useState('');

    const handlePostTweet = async (e: React.FormEvent) => {

        if (tweetText.trim()) {
            e.preventDefault();
            if (tweetText.length === 0) {
                return setError("Você não pode postar um post vazio.");
            }
            if (tweetText.length > 280) {
                return setError("O tweet não pode exceder 280 caracteres.");
            }
            try {
                setError('');
                const response = await Api.createPostagem(tweetText);

                if (response.data.code === "POSTAGEM_SUCESS") {
                    setTweetText('');
                    onClose();
                    onReload();
                    return
                }

            } catch (error) {
                if (error instanceof AxiosError) {
                    if (error.response?.data.code === "POSTAGEM_ERROR") {
                        setError("Ocorreu um erro ao postar o tweet. Tente novamente mais tarde.");
                    }
                }
            }
        }
    };

    const handlePostComentario = async (e: React.FormEvent) => {
        if (!postagemID_pai || (typeof postagemID_pai !== "string")) {
            return <>carregando</>;
        }
        if (!postagemID_pai) {
            return setError("Erro: comentário sem referência à postagem pai.");
        }
        if (tweetText.trim()) {
            e.preventDefault();
            if (tweetText.length === 0) {
                return setError("Você não pode postar um post vazio.");
            }
            if (tweetText.length > 280) {
                return setError("O tweet não pode exceder 280 caracteres.");
            }
            try {
                setError('');
                const response = await Api.createComentario(postagemID_pai, tweetText);
                console.log('api')
                if (response.status === 201) {
                    onPostTweet(tweetText);
                    setTweetText('');
                    onClose();
                    onReload();
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


    if (!isOpen) return null;

    return (
        <div className={styles.popup}>
            <div className={styles.popupContent}>
                <span className={styles.close} onClick={onClose}>&times;</span>
                {coment && postagemInfo_pai && (
                    <>
                        <div className={post_styles.tweetContainer} >
                            <div className={post_styles.tweetContent}>
                                {/* Profile Image */}
                                <div className={post_styles.profileImageContainer}>
                                    <img
                                        src={postagemInfo_pai.profileImage}
                                        className={post_styles.profileImage}
                                    />
                                </div>

                                {/* Tweet Body */}
                                <div className={post_styles.tweetBody} >
                                    {/* Tweet Header (name, username, timestamp) */}
                                    <div className={post_styles.tweetHeader}>
                                        <span className={post_styles.name}>{postagemInfo_pai.name}</span>
                                        <span className={post_styles.username}>@{postagemInfo_pai.username}</span>
                                    </div>

                                    {/* Tweet Text */}
                                    <p className={post_styles.tweetText}> {postagemInfo_pai.content}</p>
                                </div>
                            </div>
                        </div >
                    </>
                )
                }
                <h2>{coment ? 'O que você achou disso?' : 'O que você anda estudando?'}</h2>
                {error && <h1>{error}</h1>}
                <textarea
                    className={styles.textarea}
                    value={tweetText}
                    onChange={(e) => setTweetText(e.target.value)}
                    maxLength={280}
                />
                <button className={styles.postButton} onClick={coment ? handlePostComentario : handlePostTweet}>
                    Postar
                </button>
            </div>
        </div>
    );
};

export default TweetPopup;
