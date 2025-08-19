
import styles from '@/styles/perfil.module.scss';
// pages/dashboard.tsx
import { useState, useEffect } from 'react';
import { FiCalendar, FiStar, FiEdit3, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import Head from 'next/head';


interface Event {
  id: string;
  title: string;
  date: Date;
  important: boolean;
  type: 'essay' | 'meeting' | 'reminder' | 'other';
  completed?: boolean;
}

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'today' | 'week' | 'month'>('today');
  const [highlighted, setHighlighted] = useState<string | null>(null);

  useEffect(() => {
    const simulateDataLoading = () => {
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Essay Submission - History',
          date: new Date(),
          important: true,
          type: 'essay',
        },
        {
          id: '2',
          title: 'Study Group Meeting',
          date: new Date(new Date().setDate(new Date().getDate() + 1)),
          important: false,
          type: 'meeting',
        },
        {
          id: '3',
          title: 'Project Deadline',
          date: new Date(new Date().setDate(new Date().getDate() + 3)),
          important: true,
          type: 'other',
        },
        {
          id: '4',
          title: 'Literature Review',
          date: new Date(new Date().setDate(new Date().getDate() + 5)),
          important: false,
          type: 'essay',
        },
        {
          id: '5',
          title: 'Monthly Progress Report',
          date: new Date(new Date().setDate(new Date().getDate() + 7)),
          important: true,
          type: 'other',
        },
        {
          id: '6',
          title: 'Team Sync',
          date: new Date(new Date().setDate(new Date().getDate() + 2)),
          important: false,
          type: 'meeting',
          completed: true,
        },
      ];
      setEvents(mockEvents);
      setLoading(false);
    };

    setTimeout(simulateDataLoading, 1000);
  }, []);

  const toggleImportant = (id: string) => {
    setEvents(events.map(event =>
      event.id === id ? { ...event, important: !event.important } : event
    ));
  };

  const toggleComplete = (id: string) => {
    setEvents(events.map(event =>
      event.id === id ? { ...event, completed: !event.completed } : event
    ));
  };

  const filteredEvents = {
    today: events.filter(event => {
      const today = new Date();
      return (
        event.date.getDate() === today.getDate() &&
        event.date.getMonth() === today.getMonth() &&
        event.date.getFullYear() === today.getFullYear()
      );
    }),
    week: events.filter(event => {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      return event.date <= nextWeek && event.date >= new Date();
    }),
    month: events.filter(event => {
      const nextMonth = new Date();
      nextMonth.setDate(nextMonth.getDate() + 31);
      return event.date <= nextMonth && event.date >= new Date();
    }),
    important: events.filter(event => event.important),
    essays: events.filter(event => event.type === 'essay'),
  };

  const countUpcomingEvents = {
    today: filteredEvents.today.length,
    week: filteredEvents.week.length,
    month: filteredEvents.month.length,
    important: filteredEvents.important.length,
    essays: filteredEvents.essays.length,
  };

  const getEventTypeIcon = (type: Event['type']) => {
    switch (type) {
      case 'essay':
        return <FiEdit3 />;
      case 'meeting':
        return <FiCalendar />;
      case 'reminder':
        return <FiAlertTriangle />;
      default:
        return <FiCheckCircle />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={styles.dashboard}>
      <Head>
        <title>Academic Dashboard</title>
        <meta name="description" content="Academic calendar and task management" />
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className={styles.contentContainer}>
        <header className={styles.headerBlock}>
          <div className={styles.headerContent}>
            <h1>Academic Calendar</h1>
            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <FiCalendar size={24} />
                <span>Today: {countUpcomingEvents.today}</span>
              </div>
              <div className={styles.statCard}>
                <FiCalendar size={24} />
                <span>This Week: {countUpcomingEvents.week}</span>
              </div>
              <div className={styles.statCard}>
                <FiCalendar size={24} />
                <span>This Month: {countUpcomingEvents.month}</span>
              </div>
              <div className={styles.statCard}>
                <FiStar size={24} />
                <span>Important: {countUpcomingEvents.important}</span>
              </div>
              <div className={styles.statCard}>
                <FiEdit3 size={24} />
                <span>Essays: {countUpcomingEvents.essays}</span>
              </div>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.viewControls}>
            <button
              className={`${styles.viewButton} ${viewMode === 'today' ? styles.active : ''}`}
              onClick={() => setViewMode('today')}
            >
              Today
            </button>
            <button
              className={`${styles.viewButton} ${viewMode === 'week' ? styles.active : ''}`}
              onClick={() => setViewMode('week')}
            >
              Next 7 Days
            </button>
            <button
              className={`${styles.viewButton} ${viewMode === 'month' ? styles.active : ''}`}
              onClick={() => setViewMode('month')}
            >
              Next 31 Days
            </button>
          </div>

          {loading ? (
            <div className={styles.loading}>Loading events...</div>
          ) : (
            <div className={styles.eventsList}>
              {(viewMode === 'today'
                ? filteredEvents.today
                : viewMode === 'week'
                  ? filteredEvents.week
                  : filteredEvents.month
              ).map(event => (
                <div
                  key={event.id}
                  className={`${styles.eventCard} ${event.important ? styles.important : ''} ${highlighted === event.id ? styles.highlighted : ''
                    } ${event.completed ? styles.completed : ''}`}
                  onMouseEnter={() => setHighlighted(event.id)}
                  onMouseLeave={() => setHighlighted(null)}
                >
                  <div className={styles.eventIcon}>
                    {getEventTypeIcon(event.type)}
                  </div>
                  <div className={styles.eventDetails}>
                    <h3>{event.title}</h3>
                    <span className={styles.eventDate}>{formatDate(event.date)}</span>
                  </div>
                  <div className={styles.eventActions}>
                    <button
                      className={`${styles.actionButton} ${event.important ? styles.active : ''
                        }`}
                      onClick={() => toggleImportant(event.id)}
                    >
                      <FiStar />
                    </button>
                    <button
                      className={`${styles.actionButton} ${event.completed ? styles.active : ''
                        }`}
                      onClick={() => toggleComplete(event.id)}
                    >
                      <FiCheckCircle />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <style jsx global>{`
        body {
          font-family: 'Kantumruy Pro', sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
      `}</style>
    </div>
  );
}
