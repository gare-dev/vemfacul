// components/Popup.tsx
import React, { useEffect, useState } from 'react';
import styles from './style.module.scss';
import Api from '@/api';
import useAlert from '@/hooks/useAlert';

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
    link: string
    hora: string;
}

const formatDateForInput = (date: number[]) => {
    const [day, month, year] = date;
    const d = String(day).padStart(2, "0");
    const m = String(month + 1).padStart(2, "0");
    return `${year}-${m}-${d}`;
};
const CreateEventCursinhoPopup: React.FC<PopupProps> = ({ isOpen, onClose, date }) => {
    const [formData, setFormData] = useState<FormData>({
        titulo: '',
        nome: '',
        descricao: '',
        data: formatDateForInput(date),
        hora: '',
        link: ''
    });
    const { showAlert } = useAlert()

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            console.log(formData)
            const response = await Api.insertAdminCourseEvent(formData.titulo, formData.descricao, formData.link, "teste", formData.nome, formData.hora, String(date[0]), String(date[1] + 1), String(date[2]));

            if (response.status === 201) {
                showAlert("Evento criado com sucesso!", "success");
                onClose();
                setFormData({
                    titulo: '',
                    nome: '',
                    descricao: '',
                    data: formatDateForInput(date),
                    hora: '',
                    link: ''
                });
            }
        } catch (error) {
            alert('Erro ao enviar dados. Tente novamente.');
            console.error(error);
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
    );
};

export default CreateEventCursinhoPopup
