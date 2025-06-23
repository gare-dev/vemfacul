import Api from '@/api/'
import React, { useEffect, useState } from 'react';
import styles from '@/styles/userPost.module.scss';

interface TweetProps {
  id: number | string;
  content: string;
  name: string;
  username: string;
  profileImage: string;
  timestamp: string;
  likes: number;
  comments: number;
  date: string
}

const Tweet: React.FC<TweetProps> = ({
  id,
  content,
  name,
  username,
  profileImage,
  timestamp,
  likes,
  comments,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(likes);

  const handleLike = () => {
    if (isLiked) {
      setCurrentLikes(currentLikes - 1);
    } else {
      setCurrentLikes(currentLikes + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleGetLikes = async (id_postagem: number | string) => {
    try {
      const promise = await Api.getLikesCount(id_postagem)

      if (promise.data.code === "COUNT_LIKE_SUCESS") {
        return setCurrentLikes(+promise.data.likes)
      }
      return setCurrentLikes(0)
    } catch (erro) {
      console.log(erro)
    }
  }

  useEffect(() => {
    if (typeof id !== "string" && typeof id !== "number") {
      console.log("que id é esse fi", id)
    }
    handleGetLikes(id)
  }, [])
  return (
    <div className={styles.tweetContainer}>
      <div className={styles.tweetContent}>
        {/* Profile Image */}
        <div className={styles.profileImageContainer}>
          <img
            src={profileImage}
            alt={`${name}'s profile`}
            className={styles.profileImage}
          />
        </div>

        {/* Tweet Body */}
        <div className={styles.tweetBody}>
          {/* Tweet Header (name, username, timestamp) */}
          <div className={styles.tweetHeader}>
            <span className={styles.name}>{name}</span>
            <span className={styles.username}>@{username}</span>
            <span className={styles.timestamp}>{timestamp}</span>
          </div>

          {/* Tweet Text */}
          <p className={styles.tweetText}>{content}</p>

          {/* Tweet Actions */}
          <div className={styles.tweetActions}>
            {/* Comment Button */}
            <button className={styles.actionButton}>
              <svg
                className={styles.actionIcon}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <g>
                  <path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></path>
                </g>
              </svg>
              <span>{comments}</span>
            </button>

            {/* Like Button */}
            <button
              className={`${styles.actionButton} ${isLiked ? styles.liked : ''}`}
              onClick={handleLike}
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
            <button className={styles.actionButton}>
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
      </div>
    </div>
  );
};

export default Tweet;

// SCSS module styles
<style jsx global>{`
  @import './Tweet.module.scss';
`}</style>
