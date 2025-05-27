import styles from '@/styles/funcionalidadeslandinpage.module.scss';
import { FaCalendarAlt, FaRegUser } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { LuNotebookPen } from "react-icons/lu";
import { IoSchoolSharp } from "react-icons/io5";
import { useState } from 'react';

export default function Funcionalidades() {
    // Estado que guarda o índice do botão ativo
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const buttons = [
        {
            classname: 'btnCalendario',
            icon: <FaCalendarAlt className={styles.icon} />,
            text: 'Calendario'
        },
        {
            classname: 'btnComunidade',
            icon: <FaPeopleGroup className={styles.icon} />,
            text: 'Comunidade'
        },
        {
            classname: 'btnQuestoes',
            icon: <LuNotebookPen className={styles.icon} />,
            text: 'Questoes'
        },
        {
            classname: 'btnCursosAvaliados',
            icon: <IoSchoolSharp className={styles.icon} />,
            text: <>Cursos <br /> Avaliados</>
        },
        {
            classname: 'btnCalendarioP',
            icon: <FaRegUser className={styles.icon} />,
            text: <>Calendario <br /> Pessoal</>
        }
    ];

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
