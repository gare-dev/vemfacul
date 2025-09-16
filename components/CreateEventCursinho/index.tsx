// components/Popup.tsx
import React, { useEffect, useRef, useState } from 'react';
import styles from './style.module.scss';
import Api from '@/api';
import useAlert from '@/hooks/useAlert';
import LoadingBar from '../LoadingBar';

interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
    date: number[]
}

interface FormData {
    titulo: string;
    nome: string;
    descricao: string;
    data: string;
    link: string;
    hora: string;
    types: string;
}

const optionsTypes = ['Redação', 'Simulado', 'Aulão', 'Outro'];

const formatDateForInput = (date: number[]) => {
    const [day, month, year] = date;
    const d = String(day).padStart(2, "0");
    const m = String(month + 1).padStart(2, "0");
    return `${year}-${m}-${d}`;
};

const CreateEventCursinhoPopup: React.FC<PopupProps> = ({ isOpen, onClose, date }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        titulo: '',
        nome: '',
        descricao: '',
        data: formatDateForInput(date),
        hora: '',
        link: '',
        types: '',
    });

    const { showAlert } = useAlert();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
            }
        };
        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        const { name, value, type } = target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (target as HTMLInputElement).checked : value,
        }));
    };

    const handleSelectType = (type: string) => {
        setFormData((prev) => ({ ...prev, types: type }));
        setDropdownOpen(false);
    };

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            startLoading()
            console.log(formData);
            const response = await Api.insertAdminCourseEvent(
                formData.titulo,
                formData.descricao,
                formData.link,
                formData.types.toUpperCase(),
                formData.nome,
                formData.hora,
                String(date[0]),
                String(date[1] + 1),
                String(date[2])
            );

            if (response.status === 201) {
                showAlert("Evento criado com sucesso!", "success");
                onClose();
                setFormData({
                    titulo: '',
                    nome: '',
                    descricao: '',
                    data: formatDateForInput(date),
                    hora: '',
                    link: '',
                    types: '',
                });
            }
        } catch (error) {
            alert('Erro ao enviar dados. Tente novamente.');
            console.error(error);
        } finally {
            stopLoading()
        }
    };

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            data: formatDateForInput(date),
        }));
    }, [date]);

    if (!isOpen) return null;

    return (
        <>
            {loading && <LoadingBar progress={progress} />}

            <div className={styles.overlay} onClick={onClose}>
                <div
                    className={styles.popup}
                    onClick={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="popup-title"
                >
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar popup">
                        &times;
                    </button>
                    <h2 className={styles.popupTitle}>Novo Evento Geral</h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <label>
                            Título
                            <input
                                type="text"
                                name="titulo"
                                value={formData.titulo}
                                onChange={handleChange}
                                required
                                maxLength={100}
                            />
                        </label>

                        <label>
                            Nome
                            <input
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                required
                                maxLength={100}
                            />
                        </label>

                        <label>
                            Link do Evento
                            <input
                                type="text"
                                name="link"
                                value={formData.link}
                                onChange={handleChange}
                                required
                                maxLength={100}
                            />
                        </label>

                        <label>
                            Descrição
                            <textarea
                                name="descricao"
                                value={formData.descricao}
                                onChange={handleChange}
                                rows={4}
                                maxLength={500}
                            />
                        </label>

                        {/* Dropdown Types */}
                        <label className={styles.dropdownLabel}>
                            Tipo
                            <div
                                className={styles.dropdown}
                                ref={dropdownRef}
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') setDropdownOpen(false);
                                }}
                            >
                                <button
                                    type="button"
                                    className={styles.toggleBtn}
                                    onClick={() => setDropdownOpen((prev) => !prev)}
                                    aria-haspopup="listbox"
                                    aria-expanded={isDropdownOpen}
                                >
                                    {formData.types || 'Selecione um tipo'}
                                    <span className={styles.arrow} />
                                </button>

                                {isDropdownOpen && (
                                    <ul className={styles.menu} role="listbox" tabIndex={-1}>
                                        {optionsTypes.map((option) => (
                                            <li
                                                key={option}
                                                role="option"
                                                aria-selected={formData.types === option}
                                                className={`${styles.option} ${formData.types === option ? styles.selected : ''
                                                    }`}
                                                onClick={() => handleSelectType(option)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        handleSelectType(option);
                                                    }
                                                }}
                                                tabIndex={0}
                                            >
                                                {option}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </label>

                        <div className={styles.row}>
                            <label>
                                Data
                                <input
                                    type="date"
                                    name="data"
                                    value={formData.data}
                                    onChange={handleChange}
                                    required
                                    readOnly
                                />
                            </label>

                            <label>
                                Hora
                                <input
                                    type="time"
                                    name="hora"
                                    value={formData.hora}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                        </div>
                        <button type="submit" className={styles.submitBtn}>
                            Enviar
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateEventCursinhoPopup;
