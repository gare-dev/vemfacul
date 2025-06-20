import React from 'react';
import Head from 'next/head';
import styles from '@/styles/perfil.module.scss';

const ProfilePage: React.FC = () => {
  // User data (would typically come from props/API in a real app)
  const user = {
    name: 'Alex Johnson',
    username: '@alexjohnson',
    type: 'student',
    description: 'Computer Science Professor with a passion for AI and Machine Learning. Currently teaching at Stanford.',
    universityInterests: ['Stanford University', 'MIT', 'Harvard University'],
    headerImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
  };

  // Emoji mapping for user types
  const typeEmojiMap: Record<string, string> = {
    teacher: '👨‍🏫',
    student: '🧑‍🎓',
    admin: '🔧',
    guest: '👤'
  };

  return (
    <>
      <Head>
        <title>{user.name} | Profile</title>
        <meta name="description" content={`Profile page for ${user.name}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.profileContainer}>
        {/* Header Image */}
        <div className={styles.headerImageContainer}>
          <img 
            src={user.headerImage} 
            alt="Header background" 
            className={styles.headerImage}
          />
        </div>

        {/* Profile Info Section */}
        <div className={styles.profileInfoContainer}>
          {/* Profile Picture and Edit Button */}
          <div className={styles.profilePictureContainer}>
            <img 
              src={user.profileImage} 
              alt={`${user.name}'s profile`} 
              className={styles.profilePicture}
            />
            <button className={styles.editProfileButton}>
              Edit profile
            </button>
          </div>

          {/* Name and Username */}
          <div className={styles.nameSection}>
            <h1 className={styles.name}>{user.name}</h1>
            <p className={styles.username}>{user.username}</p>
          </div>

          {/* User Type Indicator */}
          <div className={styles.typeIndicator}>
            <span className={styles.typeEmoji}>{typeEmojiMap[user.type] || '👤'}</span>
            <span className={styles.typeText}>{user.type.charAt(0).toUpperCase() + user.type.slice(1)}</span>
          </div>

          {/* Description */}
          <p className={styles.description}>{user.description}</p>

          {/* University Interests */}
          <div className={styles.universityInterests}>
            <h3 className={styles.interestsTitle}>Interested in:</h3>
            <ul className={styles.universityList}>
              {user.universityInterests.map((university, index) => (
                <li key={index} className={styles.universityItem}>
                  {university}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;

// SCSS module styles
<style jsx global>{`
  @import './Profile.module.scss';
`}</style>
