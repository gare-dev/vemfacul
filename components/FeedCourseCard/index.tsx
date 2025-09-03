import { FaCheck } from 'react-icons/fa';
import { Course } from '@/types/coursetype';
import styles from "@/styles/feedcourse.module.scss";
import { MdLocationOn, MdMoneyOffCsred, MdOutlineAttachMoney, MdStar, MdStarBorder, MdStarHalf } from 'react-icons/md';
import { useRouter } from 'next/router';
import { useState } from 'react';
import LoadingComponent from '../LoadingComponent';

interface CourseApprovalCardProps {
    course: Course;
    onFollow: (id: string) => void;
    setLoading: (loading: boolean) => void;
}

export const FeedCourseCard = ({
    course,
    onFollow,
    setLoading
}: CourseApprovalCardProps) => {
    const router = useRouter()
    const renderStars = (averageRating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (averageRating >= i) {
                stars.push(<MdStar key={i} className={styles.starIcon} size={"25px"} aria-hidden="true" color='gold' />);
            } else if (averageRating >= i - 0.5) {
                stars.push(<MdStarHalf key={i} className={styles.starIcon} size={"25px"} aria-hidden="true" color='gold' />);
            } else {
                stars.push(<MdStarBorder key={i} className={styles.starIcon} size={"25px"} aria-hidden="true" color='lightgray' />);
            }
        }
        return stars;
    };

    return (
        <>

            <div className={styles.courseApprovalCard} onClick={(e) => { router.push(`/cursinho/${course.id_cursinho}`); e.stopPropagation(); setLoading(true) }} role="button" tabIndex={0} onKeyPress={() => { router.push(`/cursinho/${course.id_cursinho}`); }}>
                <div className={styles.courseImage}>
                    <img
                        src={course.logo || 'https://placehold.co/300x200'}
                        alt={`${course.nome} cover image`}
                    />
                </div>

                <div className={styles.courseInfo}>
                    <div className={styles.nomeLoc}>
                        <h3 className={styles.courseName}>{course.nome}</h3>
                        <div className={styles.locationInfo}>
                            <MdLocationOn className={styles.locationIcon} aria-hidden="true" size={"1.5em"} />
                            <p className={styles.district}>{course.uf + ", " + course.cidade}</p>
                        </div>
                    </div>

                    <div className={styles.rating}>
                        <div className={styles.priceInfo}>
                            {course.faixa_preco === "gratuito" ? <MdMoneyOffCsred color="#88bc64" size={"1.5em"} /> :
                                course.faixa_preco === "baixa" ? <MdOutlineAttachMoney color="#88bc64" size={"1.5em"} /> :
                                    course.faixa_preco === "media" ? <> <MdOutlineAttachMoney color="#88bc64" size={"1.5em"} /> <MdOutlineAttachMoney color='#88bc64' size={"1.5em"} /> </> :
                                        <> <MdOutlineAttachMoney color="#88bc64" size={"1.5em"} /> <MdOutlineAttachMoney color='#88bc64' size={"1.5em"} /> <MdOutlineAttachMoney color='#88bc64' size={"1.5em"} /> </>}
                        </div>


                        <div className={styles.stars}>
                            <span>{Number(course.media).toFixed(1)} {/* Exibindo a média com uma casa decimal */}</span>
                            {renderStars(+course.media)} {/* Adicionando as estrelas */}
                            <span>({Number(course.total_avaliacoes)})</span>
                        </div>

                    </div>
                    <div>

                    </div>
                </div>

                <div className={styles.actionButtons}>
                    <button
                        onClick={(e) => { onFollow(course.id_cursinho.toString()); e.stopPropagation(); }}
                        className={`${styles.btn} ${styles.follow}`}
                        aria-label="Follow course"
                    >
                        <FaCheck />
                        <span>Seguir</span>
                    </button>
                </div>
            </div>
        </>
    );
};
