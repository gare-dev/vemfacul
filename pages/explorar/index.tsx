import { useEffect, useState } from 'react';
import TrendingUsers from '@/components/TrendingUsers';
import styles from '@/styles/teste.module.scss';
import { GetServerSideProps } from 'next';
import Api from '@/api';
import AuthDataType from '@/types/authDataType';
import Sidebar from '@/components/Sidebar';
import LoadingBar from '@/components/LoadingBar';

export type TrendingUser = {
    id_user: string;
    nome: string;
    foto: string;
    acertosuser: number;
};

interface Props {
    authData?: AuthDataType | null | undefined;
    topUsers: TrendingUser[] | null
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    try {
        const cookie = ctx.req.headers.cookie
        Api.setCookie(cookie || "")

        const [authData, topUsers] = await Promise.all([
            Api.getProfileInfo(),
            Api.getTop10Users("daily")
        ])

        return {
            props: {
                topUsers: topUsers.status === 200 ? topUsers.data.data : null,
                authData: authData.data.code === "PROFILE_INFO" ? authData.data.data : null,
            }
        }

    } catch (error) {
        console.error("Error fetching calendar events:", error)
        return {
            props: {
                eventsProp: [],
                topUsers: null,
                authData: null
            }
        }
    }
}

export default function Explorar({ authData, topUsers }: Props) {
    const [trendingUsers, setTrendingUsers] = useState<TrendingUser[] | null>(topUsers);
    const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
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

    async function fetchTrending() {
        try {
            startLoading()
            const res = await Api.getTop10Users(period)
            if (res.status === 200) {
                setTrendingUsers(res.data.data);
            }
        } catch (error) {
            console.log("Erro ao obter top 10 usuários. " + error)
        } finally {
            stopLoading()
        }

    }

    useEffect(() => {
        fetchTrending();
    }, [period]);

    return (
        <div className={styles.container}>
            <Sidebar authData={authData} />
            {loading && <LoadingBar progress={progress} />}
            <aside className={styles.sidebar}>
                <TrendingUsers
                    users={trendingUsers}
                    period={period}
                    onPeriodChange={setPeriod}
                />
            </aside>
        </div>
    );
}
