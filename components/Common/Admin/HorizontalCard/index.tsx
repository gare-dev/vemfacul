import { FaCheck, FaTimes, FaInfoCircle } from 'react-icons/fa';
import { Course } from '@/types/coursetype';
import styles from "@/components/Common/Admin/HorizontalCard/horizontalcard.module.scss";

interface CourseApprovalCardProps {
    course: Course;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    onDetails: (id: string) => void;
}

export const CourseApprovalCard = ({
    course,
    onApprove,
    onReject,
    onDetails
}: CourseApprovalCardProps) => {


    return (
        <div className={styles.courseApprovalCard}>
            <div className={styles.courseImage}>
                <img
                    src={course.logo || 'https://placehold.co/300x200'}
                    alt={`${course.nome} cover image`}
                />
            </div>

            <div className={styles.courseInfo}>
                <h3 className={styles.courseName}>{course.nome}</h3>
                <p className={styles.exhibitionName}>{course.nome_exibido}</p>

                <div className={styles.contactInfo}>
                    <div className={styles.contactGroup}>
                        <span className={styles.label}>Representante Legal:</span>
                        <span>{course.representante_legal}</span>
                    </div>
                    <div className={styles.contactGroup}>
                        <span className={styles.label}>Email:</span>
                        <span>{course.email_contato}</span>
                    </div>
                    <div className={styles.contactGroup}>
                        <span className={styles.label}>Telephone:</span>
                        <span>{course.telefone}</span>
                    </div>
                </div>
            </div>

            <div className={styles.actionButtons}>
                <button
                    onClick={() => onApprove(course.id)}
                    className={`${styles.btn} ${styles.approve}`}
                    aria-label="Approve course"
                >
                    <FaCheck />
                    <span>Aprovar</span>
                </button>
                <button
                    onClick={() => onReject(course.id)}
                    className={`${styles.btn} ${styles.reject}`}
                    aria-label="Reject course"
                >
                    <FaTimes />
                    <span>Rejeitar</span>
                </button>

                <button
                    onClick={() => onDetails(course.id)}
                    className={`${styles.btn} ${styles.details}`}
                    aria-label="View details"
                >
                    <FaInfoCircle />
                    <span>Detalhes</span>
                </button>
            </div>
        </div>
    );
};
