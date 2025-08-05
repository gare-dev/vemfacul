import Api from '@/api';
import styles from '@/styles/createPostagem.module.scss';
import React, { useState } from 'react';
import { AxiosError } from 'axios';
import Tweet from '../UserPost';

interface TweetPopupProps {
    isOpen: boolean;
    coment?: boolean;
    postagemID_pai?: number | string;
    postagemInfo_pai?: Postagem;
    onClose: () => void;
    onPostTweet: (tweet: string) => void;
    onReload: () => void;
}

interface Postagem {
    id_postagem: string | number;
    content: string;
    content_post?: string;
    created_at?: string | Date;
    total_comments: number;
    alredyliked: number | boolean;
    total_likes: number;
    profileImage: string;
}

const TweetPopup: React.FC<TweetPopupProps> = ({ isOpen, coment, postagemID_pai, postagemInfo_pai, onClose, onPostTweet, onReload }) => {
    const [tweetText, setTweetText] = useState('');
    const [error, setError] = useState('');
    const [isVisible, setIsvisible] = useState(false)

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
                    onPostTweet(tweetText);
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
                if (response.data.code === "COMENT_SUCESS") {
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
                    <img src={postagemInfo_pai.profileImage} alt="" />
                        <p>{postagemInfo_pai.content}</p>
                    </>
                )
                }
                <h2>O que você anda estudando?</h2>
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
