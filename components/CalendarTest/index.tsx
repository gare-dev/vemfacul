import React, { useState } from 'react';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function CalendarWithTasks() {
    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
    const [tasks, setTasks] = useState<{ [date: string]: string[] }>({}); // { 'YYYY-MM-DD': ['task1', 'task2'] }

    function getDaysInMonth(year: number, month: number): number {
        return new Date(year, month + 1, 0).getDate();
    }

    // Format Date object as YYYY-MM-DD
    function formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    // Handler for previous month
    function prevMonth() {
        if (currentMonth === 0) {
            setCurrentYear(currentYear - 1);
            setCurrentMonth(11);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    }

    // Handler for next month
    function nextMonth() {
        if (currentMonth === 11) {
            setCurrentYear(currentYear + 1);
            setCurrentMonth(0);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    }

    // Add task for a given date
    interface TasksMap {
        [date: string]: string[];
    }

    function addTask(dateStr: string): void {
        const task = prompt('Enter new task:');
        if (task && task.trim()) {
            setTasks((prevTasks: TasksMap) => {
                const dayTasks = prevTasks[dateStr] ? [...prevTasks[dateStr]] : [];
                dayTasks.push(task.trim());
                return { ...prevTasks, [dateStr]: dayTasks };
            });
        }
    }

    // Generate calendar grid days array including previous month's trailing days and next month's starting days to fill weeks completely
    interface CalendarDay {
        date: Date;
        currentMonth: boolean;
    }

    function generateCalendarDays(year: number, month: number): CalendarDay[] {
        const daysInMonth = getDaysInMonth(year, month);
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun ... 6=Sat

        // Previous month trailing days count
        const prevMonthTrailingDays = firstDayOfMonth;

        // Get previous month and year
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevYear = month === 0 ? year - 1 : year;
        const prevMonthDays = getDaysInMonth(prevYear, prevMonth);

        // Array to hold all calendar dates (date objects with info)
        const calendarDays: CalendarDay[] = [];

        // Add previous month trailing days
        for (let i = prevMonthDays - prevMonthTrailingDays + 1; i <= prevMonthDays; i++) {
            calendarDays.push({
                date: new Date(prevYear, prevMonth, i),
                currentMonth: false,
            });
        }

        // Add current month days
        for (let i = 1; i <= daysInMonth; i++) {
            calendarDays.push({
                date: new Date(year, month, i),
                currentMonth: true,
            });
        }

        // Add next month leading days to fill up to full weeks (6 rows of 7 = 42 cells)
        const nextMonth = month === 11 ? 0 : month + 1;
        const nextYear = month === 11 ? year + 1 : year;
        while (calendarDays.length < 42) {
            const nextDayNum = calendarDays.length - (daysInMonth + prevMonthTrailingDays) + 1;
            calendarDays.push({
                date: new Date(nextYear, nextMonth, nextDayNum),
                currentMonth: false,
            });
        }

        return calendarDays;
    }

    const calendarDays = generateCalendarDays(currentYear, currentMonth);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
        <>
            <style jsx>{`
        .calendar-container {
          max-width: 900px;
          margin: 20px auto;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
          overflow: hidden;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          user-select: none;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(90deg, #667eea, #764ba2);
          color: white;
          padding: 16px 24px;
          font-size: 1.5rem;
          font-weight: 700;
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        .nav-button {
          background: rgba(255,255,255,0.3);
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          color: white;
          font-weight: 700;
          font-size: 1.2rem;
          cursor: pointer;
          transition: background 0.3s;
          display: flex;
          justify-content: center;
          align-items: center;
          user-select: none;
        }
        .nav-button:hover {
          background: rgba(255,255,255,0.5);
        }
        .days-of-week {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          background: #f3f4f6;
          padding: 12px 0;
          font-weight: 600;
          color: #555;
          text-align: center;
          border-bottom: 1px solid #e5e7eb;
        }
        .day-cell {
          border-right: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
          padding: 10px;
          min-height: 100px;
          position: relative;
          background: white;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          font-size: 0.9rem;
          transition: background 0.2s;
          cursor: default;
        }
        .day-cell:last-child {
          border-right: none;
        }
        .day-cell.outside-month {
          background: #f9fafb;
          color: #aaa;
        }
        .day-number {
          font-weight: 700;
          margin-bottom: 6px;
          flex-shrink: 0;
        }
        .tasks-list {
          flex-grow: 1;
          overflow-y: auto;
          margin-bottom: 24px;
        }
        .task-item {
          background: #4c51bf22;
          border-radius: 8px;
          padding: 4px 8px;
          margin-bottom: 4px;
          font-size: 0.85rem;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #4c51bf;
          user-select: text;
        }
        .add-task-button {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          font-weight: 700;
          font-size: 18px;
          line-height: 1;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(102,126,234,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          transition: background 0.3s;
        }
        .add-task-button:hover {
          background: #5367d6;
        }
        @media (max-width: 600px) {
          .calendar-container {
            max-width: 100%;
            border-radius: 0;
            box-shadow: none;
          }
          .day-cell {
            min-height: 80px;
            padding: 6px 4px;
            font-size: 0.75rem;
          }
          .add-task-button {
            width: 20px;
            height: 20px;
            font-size: 14px;
            bottom: 6px;
            right: 6px;
          }
        }
      `}</style>
            <div className="calendar-container" role="region" aria-label="Calendar with tasks">
                <header className="header">
                    <button className="nav-button" aria-label="Previous month" onClick={prevMonth}>&lt;</button>
                    <div>{monthNames[currentMonth]} {currentYear}</div>
                    <button className="nav-button" aria-label="Next month" onClick={nextMonth}>&gt;</button>
                </header>
                <div className="days-of-week" aria-hidden="true">
                    {daysOfWeek.map(day => (
                        <div key={day}>{day}</div>
                    ))}
                </div>
                <div
                    className="calendar-grid"
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}
                >
                    {calendarDays.map(({ date, currentMonth: isCurrentMonth }) => {
                        const dateStr = formatDate(date);
                        const dayTasks = tasks[dateStr] || [];
                        const isToday =
                            date.toDateString() === new Date().toDateString();

                        return (
                            <div
                                key={dateStr}
                                className={`day-cell ${!isCurrentMonth ? 'outside-month' : ''}`}
                                aria-label={`${date.toDateString()}${dayTasks.length > 0 ? ', has tasks' : ', no tasks'}`}
                                tabIndex={0}
                            >
                                <div className="day-number" style={{ color: isToday ? '#667eea' : undefined }}>
                                    {date.getDate()}
                                </div>
                                <div className="tasks-list" aria-live="polite">
                                    {dayTasks.map((task, idx) => (
                                        <div key={idx} className="task-item" title={task}>{task}</div>
                                    ))}
                                </div>
                                {isCurrentMonth && (
                                    <button
                                        className="add-task-button"
                                        aria-label={`Add task to ${dateStr}`}
                                        onClick={() => addTask(dateStr)}
                                    >
                                        +
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default CalendarWithTasks;

