import styles from '@/styles/funcionalidadeslandinpage.module.scss';
import { FaCalendarAlt, FaRegUser } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { LuNotebookPen } from "react-icons/lu";
import { IoSchoolSharp } from "react-icons/io5";
import { useState } from 'react';

export default function Funcionalidades() {
    const [activeIndex, setActiveIndex] = useState(0);
    const buttons = [
        { icon: <FaCalendarAlt className={styles.icon} />, text: "Calendário Pessoal", classname: "btnCalendario" },
        { icon: <FaPeopleGroup className={styles.icon} />, text: "Comunidade", classname: "btnComunidade" },
        { icon: <LuNotebookPen className={styles.icon} />, text: "Correção de Redação", classname: "btnCursosAvaliados" },
        { icon: <IoSchoolSharp className={styles.icon} />, text: "Exercícios", classname: "btnQuestoes" },
        { icon: <FaRegUser className={styles.icon} />, text: "Perfil", classname: "btnCalendarioP" }
    ]
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <div className={styles.container_button}>
                    {buttons.map((button, index) => {
                        const isActive = index === activeIndex;
                        return (
                            <button
                                key={index}
                                className={`${styles.btn} ${styles[button.classname]} ${isActive ? styles.active : ''}`}
                                onClick={() => setActiveIndex(index)}
                            >
                                {button.icon}
                                <span className={styles.txtButton}>{button.text}</span>
                            </button>
                        )
                    })}
                </div>
                <div className={styles.img}>
                    <img src="/assets/img/mascoteFuncionalidades.png" alt="" />
                </div>
            </div>
        </div>
    );
}
