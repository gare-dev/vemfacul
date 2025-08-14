import Api from '@/api';
import { CourseApprovalCard } from '@/components/Common/Admin/HorizontalCard';
import { Course } from '@/types/coursetype';
import { useEffect, useState } from 'react';
import styles from "@/styles/courseapprovarllist.module.scss"
import LoadingComponent from '@/components/LoadingComponent';
import useAlert from '@/hooks/useAlert';

export default function CoursesApprovalList() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true)
    const { showAlert } = useAlert()

    const handleApprove = async (id: string) => {
        console.log(id)
        if (!id) return

        try {
            const response = await Api.approveCursinho(id)

            if (response.status === 204) {
                showAlert("Cursinho aprovado com sucesso!")
                await handleGetApprovalList()
            }

        } catch (error) {
            showAlert("Erro ao aprovar cursinho: " + error)
        } finally {
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
            setLoading(false)
        }
    };

    useEffect(() => {
        handleGetApprovalList();
    }, [])

    return (
        <div className={styles.container}>
            {loading && <LoadingComponent />}
            {!loading && courses.map((course, index) => (
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

