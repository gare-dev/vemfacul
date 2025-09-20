import styles from './style.module.scss';
import { TrendingUser } from "@/pages/explorar";
import UserSearch from "@/components/SearchBar"

type Props = {
    users: TrendingUser[] | null;
    period: 'daily' | 'weekly' | 'monthly';
    onPeriodChange: (period: 'daily' | 'weekly' | 'monthly') => void;
};

export default function TrendingUsers({ users, period, onPeriodChange }: Props) {
    return (
        <section className={styles.trendingSection}>
            <UserSearch />

            {/* <h2 className={styles.title}>Usuários em alta</h2> */}
            <div className={styles.periodButtons}>
                {['daily', 'weekly', 'monthly'].map((p) => (
                    <button
                        key={p}
                        className={`${styles.periodButton} ${period === p ? styles.active : ''}`}
                        onClick={() => onPeriodChange(p as 'daily' | 'weekly' | 'monthly')}
                        aria-pressed={period === p}
                    >
                        {p === 'daily' && 'Diário'}
                        {p === 'weekly' && 'Semanal'}
                        {p === 'monthly' && 'Mensal'}
                    </button>
                ))}
            </div>
            <ul className={styles.userList}>
                {users?.map((user, i) => (
                    <li key={user.id_user} className={styles.userItem}>
                        <img
                            src={user.foto}
                            alt={user.nome}
                            className={styles.avatar}
                            loading="lazy"
                        />
                        <div className={styles.userInfo}>
                            <span className={styles.userName}>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : ""}{user.nome}</span>
                        </div>
                        <span className={styles.exercisesCount}>
                            {user.acertosuser} {user.acertosuser === 1 ? 'exercício' : 'exercícios'}
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
