// components/TweetPopup.tsx
import React, { useState } from 'react';
import styles from '@/styles/createPostagem.module.scss';
import Api from '@/api';
import { AxiosError } from 'axios';

interface TweetPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onReload: () => void;
}

const TweetPopup: React.FC<TweetPopupProps> = ({ isOpen, onClose, onReload }) => {
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

    if (!isOpen) return null;

    return (
        <div className={styles.popup}>
            <div className={styles.popupContent}>
                <span className={styles.close} onClick={onClose}>&times;</span>
                <h2>O que você anda estudando?</h2>
                {error && <h1>{error}</h1>}
                <textarea
                    className={styles.textarea}
                    value={tweetText}
                    onChange={(e) => setTweetText(e.target.value)}
                    maxLength={280}
                />
                <button className={styles.postButton} onClick={handlePostTweet}>
                    Postar
                </button>
            </div>
        </div>
    );
};

export default TweetPopup;
