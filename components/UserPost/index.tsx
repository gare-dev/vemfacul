import styles from '@/styles/userPost.module.scss'
import { useState } from 'react';

interface postProps {
    profilename: string;
    username: string;
    profilePhoto: string;
    postDate: string;
    postContent: string;
}
export default function UserPost(props: postProps) {
    const [liked, setLiked] = useState(false);
    return (
        <>
            <div className={styles.post}>
                <div className={styles.postHeader}>
                    <div className={styles.mainData}>
                        <div className={styles.postProfileImage}>
                            <img src={props.profilePhoto} alt="" />
                        </div>
                        <span className={styles.postName}>{props.profilename}</span>
                    </div>
                    <div className={styles.postData}>
                        <span className={styles.postUsername}>@{props.username} </span>
                        <span className={styles.postDate}>{props.postDate}</span>
                    </div>
                </div>
                <div className={styles.postContent}>
                    <p className={styles.postText}>
                        {props.postContent}
                    </p>
                </div>
                <div className={styles.postStatus}>
                    <ul>
                        <li>
                            <span className={liked ? styles.liked : styles.postLike} onClick={() => { setLiked((prev) => !prev) }}>
                                <i><svg width="20" height="20" fill="currentColor"
                                    stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21C12 21 4 13.5 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.5 16 21 16 21H12Z" /></svg></i></span>
                        </li>
                        <li>
                            <span><i><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg></i></span>
                        </li>
                        <li>
                            <span><i><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg></i></span>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}