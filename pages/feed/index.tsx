import Api from "@/api";
import { FeedCourseCard } from "@/components/FeedCourseCard";
import Filter from "@/components/FiltroCursinho";
import LoadingComponent from "@/components/LoadingComponent";
import Sidebar from "@/components/Sidebar";
import styles from "@/styles/feed.module.scss";
import AuthDataType from "@/types/authDataType";
import { Course } from "@/types/coursetype";
import { AxiosError } from "axios";
import { GetServerSideProps } from "next";
import { useCallback, useState } from "react";

type Props = {
    cursinho: Course[] | null;
    authData?: AuthDataType | null;
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    try {
        const cookie = context.req.headers.cookie
        Api.setCookie(cookie || "")
        const [cursinho, authData] = await Promise.all([
            Api.getCursinho(),
            Api.getProfileInfo(),
        ])

        return {
            props: {
                cursinho: cursinho.status === 200 ? cursinho.data.data : null,
                authData: authData.data.code === "PROFILE_INFO" ? authData.data.data : null,
            }
        }
    } catch (error) {
        console.error("Error fetching cursinho:", error);
        if (error instanceof AxiosError) {
            return {
                props: {
                    cursinho: null,
                    authData: null,
                }
            }
        }
        return {
            props: {
                cursinho: null,
                authData: null
            }
        }
    }
}

export default function Feed({ cursinho, authData }: Props) {
    const [filteredData, setFilteredData] = useState<Course[]>(cursinho || []);

    const handleFilter = useCallback((filtered: Course[]) => {
        setFilteredData(filtered);
    }, []);

    const [isLoading, setIsLoading] = useState<boolean>(false);


    return (
        <div>
            {isLoading && <LoadingComponent isLoading={isLoading} />}

            <Sidebar authData={authData} />

            <div className={styles.feedPageContainer}>
                <Filter data={cursinho!} onFilter={handleFilter} />

                <div className={styles.feedContainer}>
                    {filteredData.map((item, index) => (
                        <FeedCourseCard
                            key={index}
                            onFollow={() => console.log(`Seguindo o curso: ${item.nome}`)}
                            course={item}
                            setLoading={(loading) => setIsLoading(loading)}
                        />
                    ))}

                    {filteredData.length === 0 && (
                        <h2 style={{ textAlign: 'center' }}>Nenhum cursinho encontrado para o filtro especificado.</h2>
                    )}
                </div>
            </div>
        </div>
    )
}