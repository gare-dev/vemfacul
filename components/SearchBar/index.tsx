import React, { useState, useEffect, useRef } from 'react';
import styles from './style.module.scss';
import Api from '@/api';
import { useRouter } from 'next/router';

interface User {
    id_user: number;
    nome: string;
    username: string;
    foto: string;
}

const fetchUsers = async (query: string) => {
    try {
        const response = await Api.getUsersSearchBar(query)
        return response.data.data
    } catch (error) {
        console.log("Erro ao procurar usuário: " + error)
    }
};

const SearchBar: React.FC = () => {
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter()

    useEffect(() => {
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        if (!query.trim()) {
            setUsers([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        debounceTimeout.current = setTimeout(() => {
            fetchUsers(query).then((results) => {
                setUsers(results);
                setLoading(false);
            });
        }, 500);

        return () => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        };
    }, [query]);

    const closeSearch = () => {
        setQuery('');
        setUsers([]);
        setLoading(false);
        inputRef.current?.blur();
    };

    const handleUserClick = (user: User) => {
        router.push(`/${user.username}`)
        closeSearch();
    };

    const isOpen = (loading || users.length > 0) && query.trim() !== '';

    return (
        <>
            <div
                style={{ border: users.length > 0 ? 0 : "auto" }}
                className={styles.searchContainer}>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Buscar"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={styles.input}
                    aria-label="Buscar"
                    autoComplete="off"
                />
            </div>

            {isOpen && (
                <>
                    <div className={styles.overlay} onClick={closeSearch} />

                    <div className={styles.results}>
                        {loading && <div className={styles.loadingBar} />}
                        {users.length === 0 && (
                            <div className={styles.noResults}>Nenhum usuário encontrado</div>
                        )}
                        <ul className={styles.userList}>
                            {users.map((user) => (
                                <li
                                    key={user.id_user}
                                    className={styles.userItem}
                                    onClick={() => handleUserClick(user)}
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            handleUserClick(user);
                                        }
                                    }}
                                >
                                    <img src={user.foto} alt={user.nome} className={styles.avatar} />
                                    <div className={styles.userInfo}>
                                        <span className={styles.name}>{user.nome}</span>
                                        <span className={styles.username}>@{user.username}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </>
    );
};

export default SearchBar;
