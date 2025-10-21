
import Api from '@/api/'
import TweetPopup from '../CreatePostagem';
import React, { useEffect, useState } from 'react';
import styles from '@/styles/userPost.module.scss';
import { useRouter } from 'next/router';
import { BsThreeDots } from 'react-icons/bs';
import { useOptionsPopup } from '@/context/OptionsPopupContext';
import useAlert from '@/hooks/useAlert';
import { AxiosError } from 'axios';

interface TweetProps {
  id: number | string;
  content: string;
  name: string;
  username: string;
  profileImage: string;
  timestamp: string;
  alredyLiked: number | boolean;
  likes: number;
  comments: number;
  date: string
  userProfileUsername?: string
  // id_user: string

}

interface Postagem {
  name: string;
  username: string;
  id_postagem: string | number;
  content: string;
  content_post?: string;
  profileImage: string;
  userProfileUsername?: string
}

const Tweet: React.FC<TweetProps> = ({
  id,
  content,
  name,
  username,
  profileImage,
  timestamp,
  alredyLiked,
  likes,
  comments,
  userProfileUsername,

}) => {
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(alredyLiked);
  const [currentLikes, setCurrentLikes] = useState<number>(Number(likes));
  const [currentComments, setCurrenComments] = useState(Number(comments));
  const [isVisibleSubmitPost, setIsVisibleSubmitPost] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [postagemPai, setPostagemPai] = useState<Postagem | null>(null)
  const { showAlert } = useAlert()
  const { activePopupId, setActivePopupId } = useOptionsPopup();
  const showOptionsPopup = activePopupId === id;

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
    setActivePopupId(null);
  };
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setActivePopupId(null);
  };
  const handlePostTweet = (tweet: string) => {
    setCurrenComments((prev) => prev + 1)
    console.log('Tweet posted:', tweet);
  };
  const handleSharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: "Veja esta postagem!",
        url: `${window.location.origin}/postagem/${id}`
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/postagem/${id}`)
      alert('link copiado');
    }
  }

  const handleDeletePost = async () => {
    if (confirm('Tem certeza que deseja deletar esta postagem?')) {
      try {
        setActivePopupId(null);
        const response = await Api.deletePost(id);
        if (response.status === 204) {
          showAlert('Postagem deletada com sucesso!', 'success');
          router.reload();
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) {
            setActivePopupId(null);
            return showAlert('Postagem não encontrada', 'warning');
          }
        }
        return showAlert('Erro ao deletar postagem', 'danger');
      }
    }
    setActivePopupId(null);
  };

  const handleReportPost = async () => {
    try {
      const response = await Api.reportPost(String(id));

      if (response.status === 201) {
        showAlert('Postagem reportada com sucesso!', 'success');
      }

    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          setActivePopupId(null);
          return showAlert('Postagem não encontrada', 'warning');
        }
      }
    }
    setActivePopupId(null);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/postagem/${id}`);
    alert('Link copiado para a área de transferência!');
    setActivePopupId(null);
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

  // Fechar popup ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Se clicou fora do popup de opções, fecha ele
      if (showOptionsPopup && !target.closest(`.${styles.moreOptions}`)) {
        setActivePopupId(null);
        event.stopPropagation(); // Impede a propagação para evitar abrir a postagem
      }
    };

    if (showOptionsPopup) {
      document.addEventListener('click', handleClickOutside, true); // Usa capture phase
    }

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [showOptionsPopup, setActivePopupId]); return (
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
        <div className={styles.profileImageContainer}>
          <img
            onClick={(e) => { e.stopPropagation(); router.push(`/${username}`) }}
            src={profileImage}
            style={{ 'cursor': 'pointer' }}
            alt={`${name}'s profile`}
            className={styles.profileImage}
          />
        </div>


        <div className={styles.tweetBody} style={{ 'cursor': 'pointer' }} onClick={() => { router.push(`/postagem/${id}`) }}>
          <div className={styles.tweetHeader}>
            <span className={styles.name}>{name}</span>
            <span className={styles.username}>@{username}</span>
            <span className={styles.timestamp}>• {timestamp}</span>

          </div>

          <p className={styles.tweetText}> {content}</p>


          <div className={styles.tweetActions}>
            <button className={styles.actionButton} onClick={(e) => {
              e.stopPropagation()
              setActivePopupId(null); // Fecha o popup de opções se estiver aberto
              setIsVisibleSubmitPost(!isVisibleSubmitPost);
              handleOpenPopup({
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
              <span>{Number(currentLikes)}</span>
            </button>

            <button className={styles.actionButton} style={{ 'cursor': 'pointer' }} onClick={(e) => { e.stopPropagation(); handleSharePost() }}>
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
        </div>
        <div className={styles.moreOptions} onClick={(e) => {
          e.stopPropagation();
          setIsPopupOpen(false); // Fecha o popup de comentários se estiver aberto
          setIsVisibleSubmitPost(false); // Fecha o popup de comentários se estiver aberto
          setActivePopupId(showOptionsPopup ? null : id);
        }}>
          <BsThreeDots size={"1.5em"} className={styles.moreOptionsIcon} />
          {showOptionsPopup && (
            <div className={styles.optionsPopup} onClick={(e) => e.stopPropagation()}>
              <button className={styles.optionItem} onClick={handleCopyLink}>
                <svg className={styles.optionIcon} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.36 5.64c-1.95-1.96-5.11-1.96-7.07 0L9.88 7.05 8.46 5.64l1.42-1.42c2.73-2.73 7.16-2.73 9.9 0 2.73 2.74 2.73 7.17 0 9.9l-1.42 1.42-1.41-1.42 1.41-1.41c1.96-1.96 1.96-5.12 0-7.07z" />
                  <path d="M8.05 16.54c1.96 1.96 5.12 1.96 7.07 0l1.41-1.41 1.42 1.41-1.42 1.42c-2.73 2.73-7.16 2.73-9.9 0-2.73-2.74-2.73-7.17 0-9.9l1.42-1.42 1.41 1.42-1.41 1.41c-1.96 1.96-1.96 5.12 0 7.07z" />
                  <path d="M14.12 9.88l-4.24 4.24-1.41-1.41 4.24-4.24z" />
                </svg>
                Copiar link
              </button>

              <button className={styles.optionItem} onClick={handleReportPost}>
                <svg className={styles.optionIcon} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                Reportar postagem
              </button>

              {username === userProfileUsername && (<button className={styles.optionItemDelete} onClick={handleDeletePost}>
                <svg className={styles.optionIcon} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                </svg>
                Deletar postagem
              </button>)}
            </div>
          )}
        </div>
      </div>
    </div >
  );
};

export default Tweet;

// SCSS module styles
<style jsx global>{`
  @import './Tweet.module.scss';
`}</style>
