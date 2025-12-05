import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon } from 'lucide-react';
import styles from './style.module.scss';
import PopupType from '@/types/data';

interface Props {
    events: PopupType[]
}

const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export default function Calendar(Props: Props) {
    const [displayDate, setDisplayDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    // Funções auxiliares de data
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const handlePrevMonth = () => {
        setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
        setSelectedDate(null);
    };

    const handleNextMonth = () => {
        setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
        setSelectedDate(null);
    };

    const handleDateClick = (day: number) => {
        const newDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
        setSelectedDate(newDate);
    };

    const getEventsForDay = (day: number) => {
        return Props.events.filter(event =>
            +event.day === day &&
            +event.month === displayDate.getMonth() &&
            +event.year === displayDate.getFullYear()
        );
    };

    const selectedEvents = selectedDate
        ? getEventsForDay(selectedDate.getDate())
        : [];

    const renderCalendarGrid = () => {
        const daysInMonth = getDaysInMonth(displayDate);
        const firstDay = getFirstDayOfMonth(displayDate);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const hasEvents = getEventsForDay(day).length > 0;
            const isSelected = selectedDate?.getDate() === day &&
                selectedDate?.getMonth() === displayDate.getMonth();
            const isToday = day === new Date().getDate() &&
                displayDate.getMonth() === new Date().getMonth();

            days.push(
                <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`
            ${styles.dayCell} 
            ${isSelected ? styles.selected : ''} 
            ${isToday ? styles.today : ''}
            ${hasEvents ? styles.hasEvents : ''}
          `}
                >
                    <span>{day}</span>
                    {hasEvents && <div className={styles.eventDot} />}
                </button>
            );
        }

        return days;
    };

    return (
        <div className={styles.calendarWrapper}>
            <div className={styles.calendarLeft}>
                <div className={styles.header}>
                    <button onClick={handlePrevMonth}><ChevronLeft size={20} /></button>
                    <h3>{MONTHS[displayDate.getMonth()]} {displayDate.getFullYear()}</h3>
                    <button onClick={handleNextMonth}><ChevronRight size={20} /></button>
                </div>

                <div className={styles.weekDays}>
                    {DAYS_OF_WEEK.map(day => (
                        <span key={day}>{day}</span>
                    ))}
                </div>

                <div className={styles.daysGrid}>
                    {renderCalendarGrid()}
                </div>
            </div>

            {/* Lado Direito: Lista de Eventos */}
            <div className={styles.eventsRight}>
                <div className={styles.eventsHeader}>
                    {selectedDate ? (
                        <>
                            <h3>Eventos do dia {selectedDate.getDate()}</h3>
                            <span>{DAYS_OF_WEEK[selectedDate.getDay()]}</span>
                        </>
                    ) : (
                        <h3>Selecione uma data</h3>
                    )}
                </div>

                <div className={styles.eventsList}>
                    {selectedEvents.length > 0 ? (
                        selectedEvents.map((event, i) => (
                            <div key={i} className={styles.eventCard}>
                                <div className={`${styles.tag} ${styles[event.type]}`}>
                                    {event.type.toUpperCase()}
                                </div>
                                <h4>{event.title}</h4>
                                <p className={styles.institution}>{event.cursinho}</p>

                                <div className={styles.meta}>
                                    <div className={styles.metaItem}>
                                        <Clock size={14} /> {event.hora}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <CalendarIcon size={48} />
                            <p>Nenhum evento encontrado para esta data.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}