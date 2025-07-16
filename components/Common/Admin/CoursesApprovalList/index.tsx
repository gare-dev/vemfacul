import Api from '@/api';
import { CourseApprovalCard } from '@/components/Common/Admin/HorizontalCard';
import { Course } from '@/types/coursetype';
import { useEffect, useState } from 'react';

export default function CoursesApprovalList() {
    const [courses, setCourses] = useState<Course[]>([]);

    const handleApprove = (id: string) => {
        console.log(id)
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
            if (response.data.code === "CURSINHOS_SELECTED") {
                setCourses(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching approval list:", error);

        }
    };

    useEffect(() => {
        handleGetApprovalList();
    }, [])

    return (
        <div>
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

