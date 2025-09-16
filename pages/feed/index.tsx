import Api from "@/api";
import { FeedCourseCard } from "@/components/FeedCourseCard";
import LoadingComponent from "@/components/LoadingComponent";
import Sidebar from "@/components/Sidebar";
import styles from "@/styles/feed.module.scss";
import AuthDataType from "@/types/authDataType";
import { Course } from "@/types/coursetype";
import { AxiosError } from "axios";
import { GetServerSideProps } from "next";
import { useState } from "react";

type Props = {
    cursinho: Course[] | null;
    authData?: AuthDataType | null;
    xTraceError?: string | null;
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
                xTraceError: null
            }
        }
    } catch (error) {
        console.error("Error fetching cursinho:", error);
        if (error instanceof AxiosError) {
            return {
                props: {
                    cursinho: null,
                    authData: null,
                    xTraceError: error.response?.headers["x-trace-id"]
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

export default function Feed({ cursinho, authData, xTraceError }: Props) {
    const [cursinhos,] = useState<Course[]>(cursinho || []);
    const [isLoading, setIsLoading] = useState<boolean>(false);



    // function handleFilterChange(filters: { location: string; state: string; city: string; query: string }) {
    //     // const filteredCursinhos = products.filter(cursinho => {
    //     //     return (
    //     //         (filters.location ? cursinho.location.toLowerCase() === filters.location.toLowerCase() : true) &&
    //     //         (filters.state ? cursinho.location.toLowerCase() === filters.state.toLowerCase() : true) &&
    //     //         (filters.city ? cursinho.location.toLowerCase() === filters.city.toLowerCase() : true) &&
    //     //         (filters.query ? cursinho.title.toLowerCase().includes(filters.query.toLowerCase()) : true)
    //     //     );
    //     // });
    //     // setCursinhos(filteredCursinhos);
    //     console.log("FILTRO")
    // }


    return (
        <div>
            {isLoading && <LoadingComponent isLoading={isLoading} />}
            <Sidebar authData={authData} traceID={xTraceError ?? ""} />
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                {/* <FilterBar onSearch={() => console.log("teste")} /> */}
            </div>
            <div className={styles.feedPageContainer}>

                <div className={styles.feedContainer}>
                    {cursinhos.map((item, index) => (
                        <FeedCourseCard

                            key={index}
                            onFollow={() => console.log(`Seguindo o curso: ${item.nome}`)}
                            course={item}
                            setLoading={(loading) => setIsLoading(loading)}
                        />
                    ))}
                    {cursinhos.length === 0 && (
                        <h2 style={{ textAlign: 'center' }}>Nenhum cursinho encontrado para o filtro especificado.</h2>
                    )}
                </div>
            </div>
        </div>
    )
}