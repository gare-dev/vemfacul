import React, { useState } from 'react';
import Api from '@/api';
import styles from '@/styles/createPostagem.module.scss';
import postStyles from '@/styles/userPost.module.scss';
import { AxiosError } from 'axios';
import containsWord from '@/utils/wordFilter';
import badWordsList from '@/utils/badWordsList';

interface TweetPopupProps {
    isOpen: boolean;
    coment?: boolean;
    postagemID_pai?: number | string;
    postagemInfo_pai?: Postagem;
    onClose: () => void;
    onReload: () => void;
    onPostTweet: (tweet: string) => void;
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

const TweetPopup: React.FC<TweetPopupProps> = ({
    isOpen,
    coment,
    postagemID_pai,
    postagemInfo_pai,
    onClose,
    onPostTweet,
    onReload,
}) => {
    const [tweetText, setTweetText] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const validateTweet = (text: string) => {
        if (text.trim().length === 0) {
            setError('Você não pode postar um post vazio.');
            return false;
        }
        if (text.length > 280) {
            setError('O tweet não pode exceder 280 caracteres.');
            return false;
        }

        if (containsWord(text, badWordsList)) {
            setError('Seu post contém palavras inadequadas. Por favor, revise-o.');
            return false;
        }
        setError('');
        return true;
    };


    const handlePostTweet = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateTweet(tweetText)) return;

        try {
            const response = await Api.createPostagem(tweetText);
            if (response.status === 201) {
                setTweetText('');
                onClose();
                onReload();
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                if (err.response?.status === 400) {
                    setError('Ocorreu um erro ao postar o tweet. Tente novamente mais tarde.');
                }
            }
        }
    };

    const handlePostComentario = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!postagemID_pai || typeof postagemID_pai !== 'string') {
            setError('Erro: comentário sem referência à postagem pai.');
            return;
        }

        if (!validateTweet(tweetText)) return;

        try {
            const response = await Api.createComentario(postagemID_pai, tweetText);
            if (response.status === 201) {
                onPostTweet(tweetText);
                setTweetText('');
                onClose();
                onReload();
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                if (err.response?.data.code === 'COMENT_ERROR') {
                    setError('Ocorreu um erro ao postar o tweet. Tente novamente mais tarde.');
                }
            }
        }
    };

    return (
        <div className={styles.popup}>
            <div className={styles.popupContent}>
                <button className={styles.close} onClick={onClose} aria-label="Fechar popup">
                    &times;
                </button>

                {coment && postagemInfo_pai && (
                    <div className={postStyles.tweetContainer}>
                        <div className={postStyles.tweetContent}>
                            <div className={postStyles.profileImageContainer}>
                                <img
                                    src={postagemInfo_pai.profileImage}
                                    alt={`${postagemInfo_pai.name} avatar`}
                                    className={postStyles.profileImage}
                                />
                            </div>
                            <div className={postStyles.tweetBody}>
                                <div className={postStyles.tweetHeader}>
                                    <span className={postStyles.name}>{postagemInfo_pai.name}</span>
                                    <span className={postStyles.username}>@{postagemInfo_pai.username}</span>
                                </div>
                                <p className={postStyles.tweetText}>{postagemInfo_pai.content}</p>
                            </div>
                        </div>
                    </div>
                )}

                <h2 className={styles.h2}>{coment ? 'O que você achou disso?' : 'O que você anda estudando?'}</h2>

                {error && <p className={styles.error}>{error}</p>}

                <textarea
                    className={styles.textarea}
                    value={tweetText}
                    onChange={(e) => setTweetText(e.target.value)}
                    maxLength={280}
                    placeholder="Escreva seu post aqui..."
                    aria-label="Campo para escrever o post"
                />

                <button
                    className={styles.postButton}
                    onClick={coment ? handlePostComentario : handlePostTweet}
                    disabled={tweetText.trim().length === 0}
                    aria-disabled={tweetText.trim().length === 0}
                >
                    Postar
                </button>
            </div>
        </div>
    );
};

export default TweetPopup;
