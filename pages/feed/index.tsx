import ProductCard from "@/components/CursinhoCard";
import FilterBar from "@/components/SearchHeader";
import Sidebar from "@/components/Sidebar";
import products from "@/mock/cursinhos";
import styles from "@/styles/feed.module.scss";
import { useState } from "react";

export default function Feed() {
    const [cursinhos, setCursinhos] = useState(products);

    function handleFilterChange(filters: { location: string; state: string; city: string; query: string }) {
        const filteredCursinhos = products.filter(cursinho => {
            return (
                (filters.location ? cursinho.location.toLowerCase() === filters.location.toLowerCase() : true) &&
                (filters.state ? cursinho.location.toLowerCase() === filters.state.toLowerCase() : true) &&
                (filters.city ? cursinho.location.toLowerCase() === filters.city.toLowerCase() : true) &&
                (filters.query ? cursinho.title.toLowerCase().includes(filters.query.toLowerCase()) : true)
            );
        });
        setCursinhos(filteredCursinhos);
    }

    return (
        <div>

            <Sidebar />
            <div className={styles.feedPageContainer}>

                <FilterBar onSearch={handleFilterChange} />
                <div className={styles.feedContainer}>
                    {cursinhos.map((item, index) => (
                        <ProductCard
                            key={index}
                            rating={item.rating}
                            location={item.location}
                            imageAlt={item.imageAlt}
                            title={item.title}
                            imageUrl={item.imageUrl}
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