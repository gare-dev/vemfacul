import React, { useState } from 'react';
import styles from '@/styles/searchheader.module.scss';
import { MdSearch } from 'react-icons/md';

interface FilterBarProps {
    onSearch?: (filters: { location: string; state: string; city: string; query: string }) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onSearch }) => {
    const [location, setLocation] = useState('');
    const [state, setState] = useState('');
    const [city,] = useState('');
    const [query, setQuery] = useState('');

    return (
        <div className={styles.filterBar} role="search" aria-label="Search filter bar">
            <div className={styles.filterItem}>
                <label htmlFor="filter-location" className={styles.filterLabel}>
                    Estado
                </label>
                <select
                    id="filter-location"
                    className={styles.filterSelect}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                >
                    <option value="">Todos</option>
                    <option value="sp">São Paulo</option>
                    <option value="rj">Rio de Janeiro</option>
                    <option value="bh">Belo Horizonte</option>
                </select>
            </div>

            <div className={styles.filterItem}>
                <label htmlFor="filter-state" className={styles.filterLabel}>
                    Cidade
                </label>
                <select
                    id="filter-state"
                    className={styles.filterSelect}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    disabled={!location}
                >
                    <option value="">{location ? 'Todos' : 'Selecione o Estado Primeiro'}</option>
                    {location === 'sp' && (
                        <>
                            <option value="sp">São Paulo</option>
                            <option value="santo-andre">Santo André</option>
                            <option value="sao-bernardo-do-campo">São Bernardo do Campo</option>
                        </>
                    )}
                    {location === 'rj' && (
                        <>
                            <option value="rj">Rio de Janeiro</option>
                            <option value="niteroi">Niterói</option>
                            <option value="duque-de-caxias">Duque de Caxias</option>
                        </>
                    )}
                    {location === 'bh' && (
                        <>
                            <option value="bh">Belo Horizonte</option>
                            <option value="contagem">Contagem</option>
                            <option value="betim">Betim</option>
                        </>
                    )}
                </select>
            </div>

            <div className={styles.filterItem} style={{ flex: '2 1 200px' }}>
                <label htmlFor="filter-search" className={styles.filterLabel}>
                    Buscar pelo nome...
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        id="filter-search"
                        type="text"
                        className={styles.filterInput}
                        placeholder="Buscar..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onSearch?.({ location, state, city, query });
                            }
                        }}
                        aria-label="Search query input"
                    />
                    <button
                        type="button"
                        className={styles.searchButton}
                        onClick={() => onSearch?.({ location, state, city, query })}
                        aria-label="Execute search"
                    >
                        <MdSearch className={styles.searchIcon} aria-hidden="true" />
                        Procurar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
