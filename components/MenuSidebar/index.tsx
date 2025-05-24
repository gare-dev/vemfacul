import React from 'react';
import styles from '@/styles/MenuSidebar.module.scss';
import { useState } from 'react';
// type MenuItem = {
//     label: string;
//     icon?: React.ReactNode;
//     onClick?: () => void;
// };

// const menuItems: MenuItem[] = [
//     { label: 'Dashboard' },
//     { label: 'Kanban' },
//     { label: 'Inbox' },
//     { label: 'Sidebar' },
// ];

const Sidebar: React.FC = () => {
    const [activeItem, setActiveItem] = useState(0);

    return (
        <div className={styles.sidebar}>
            <div className={styles.inner}>
                <div className={styles.header}>
                    {/* <img className={styles.logo} src="/logo.svg" alt="logo" /> */}
                    <h1>Vem Facul</h1>
                </div>
                <nav className={styles.menu} style= {{
                    // `top: ${activeItem * 100}px;` 
                    "marginTop": '0rem'
                }
                }>
                    {['Questões', 'Redação', 'Comunidade'].map((item, i) => (
                        <button key={i} className={i === 0 ? 'active' : ''} onClick={() => setActiveItem(i)}>
                            <span>📁</span>
                            <p>{item}</p>
                        </button>
                    ))}
                </nav>
            </div>
        </div>

    );
};

export default Sidebar;
