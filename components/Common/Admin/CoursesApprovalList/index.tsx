import Api from '@/api';
import { ApproveCourse, CourseApprovalCard } from '@/components/Common/Admin/HorizontalCard';
import { useEffect, useState } from 'react';
import styles from "@/styles/courseapprovarllist.module.scss"
import useAlert from '@/hooks/useAlert';
import LoadingBar from '@/components/LoadingBar';

interface Props {
    Course: ApproveCourse[] | null
}

export default function CoursesApprovalList({ Course }: Props) {
    const [courses, setCourses] = useState<ApproveCourse[]>(Course || []);
    const { showAlert } = useAlert()
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    let intervalId: NodeJS.Timeout;

    const startLoading = () => {
        setLoading(true);
        setProgress(10);

        intervalId = setInterval(() => {
            setProgress((prev) => (prev < 90 ? prev + 5 : prev));
        }, 200);
    };

    const stopLoading = () => {
        clearInterval(intervalId);
        setProgress(100);
        setTimeout(() => {
            setLoading(false);
            setProgress(0);
        }, 400);
    };
    const handleApprove = async (id: string) => {
        if (!id) return
        try {
            startLoading()
            const response = await Api.approveCursinho(id)

            if (response.status === 204) {
                showAlert("Cursinho aprovado com sucesso!")
                await handleGetApprovalList()
            }

        } catch (error) {
            showAlert("Erro ao aprovar cursinho: " + error)
        } finally {
            stopLoading()
        }
    };

    const handleReject = (id: string) => {
        console.log(id)
    };

    const handleDetails = (id: string) => {
        console.log(id)
    };

    const handleGetApprovalList = async () => {
        try {
            const response = await Api.selectAproveList();
            if (response.status === 200) {
                setCourses(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching approval list:", error);

        } finally {

        }
    };

    useEffect(() => {
        handleGetApprovalList();
    }, [])

    return (
        <div className={styles.container}>
            {loading && <LoadingBar progress={progress} />}

            {courses.map((course, index) => (
                <CourseApprovalCard
                    key={index}
                    course={course}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onDetails={handleDetails}
                />
            ))}
        </div>
    );
};

