import Api from "@/api";
import { FeedCourseCard } from "@/components/FeedCourseCard";
import LoadingComponent from "@/components/LoadingComponent";
import FilterBar from "@/components/SearchHeader";
import Sidebar from "@/components/Sidebar";
import styles from "@/styles/feed.module.scss";
import { Course } from "@/types/coursetype";
import { useEffect, useState } from "react";

export default function Feed() {
    const [cursinhos, setCursinhos] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            setIsLoading(true)
            const response = await Api.getCursinho()

            if (response.status === 200) {
                setCursinhos(response.data.data);
                setIsLoading(false);
            }
        })()
    }, [])


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
            <Sidebar isLoading={isLoading} setIsLoading={setIsLoading} />
            <div className={styles.feedPageContainer}>

                <FilterBar onSearch={() => console.log("teste")} />
                <div className={styles.feedContainer}>
                    {cursinhos.map((item, index) => (
                        <FeedCourseCard
                            key={index}
                            onFollow={() => console.log(`Seguindo o curso: ${item.nome}`)}
                            course={item}
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