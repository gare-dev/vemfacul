import styles from '@/styles/funcionalidadeslandinpage.module.scss';
import { FaCalendarAlt, FaRegUser } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { LuNotebookPen } from "react-icons/lu";
import { IoSchoolSharp } from "react-icons/io5";

export default function Funcionalidades() {
    return (
        <div className={styles.container}>
            <div className={styles.container_button}>
                <button className={`${styles.btn} ${styles.btnCalendario}`}>
                    <FaCalendarAlt className={styles.icon} />
                    <span className={styles.txtButton}>Calendario</span>
                </button>
                <button className={`${styles.btn} ${styles.btnComunidade}`}>
                    <FaPeopleGroup className={styles.icon} />
                    <span className={styles.txtButton}>Comunidade</span>
                </button>
                <button className={`${styles.btn} ${styles.btnQuestoes}`}>
                    <LuNotebookPen className={styles.icon} />
                    <span className={styles.txtButton}>Questoes</span>
                </button>
                <button className={`${styles.btn} ${styles.btnCursosAvaliados}`}>
                    <IoSchoolSharp className={styles.icon} />
                    <span className={styles.txtButton}>Cursos <br /> Avaliados </span>
                </button>
                <button className={`${styles.btn} ${styles.btnCalendarioP}`}>
                    <FaRegUser className={styles.icon} />
                    <span className={styles.txtButton}>Calendario <br />Pessoal</span>
                </button>

            </div>
            <div className={styles.img}>
                <img src="/assets/img/head_funcionalidades.png" alt="" />
            </div>
        </div>
    )
}