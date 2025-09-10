import React, { useState } from 'react';
import styles from './style.module.scss';
import LoadingBar from '../LoadingBar';
import Api from '@/api';
import useAlert from '@/hooks/useAlert';
export interface User {
    id_user: string;
    nome: string;
    email: string;
    created_at: string; // ISO string
    username: string;
    foto: string;
    is_verified: boolean;
}
interface UserListProps {
    users: User[];
    onToggleActive?: (id: string, active: boolean) => void;
}
const UserList: React.FC<UserListProps> = ({ users, onToggleActive }) => {
    const [userStates, setUser] = useState(
        users.reduce((acc, user) => {
            acc[user.id_user] = user.is_verified;
            return acc;
        }, {} as Record<string, boolean>)
    );
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert()
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

    const handleToggle = async (id: string) => {

        try {
            startLoading()

            const response = await Api.setAdminUserVerify(!userStates[id], id)
            if (response.status === 200) {
                const newState = !userStates[id];
                setUser((prev) => ({ ...prev, [id]: newState }));
                if (onToggleActive) onToggleActive(id, newState);
                showAlert("Usuário atualizado com sucesso!")

            }
        } catch (error) {
            console.log("Erro ao atualizar verificação do usuário! " + error)
        } finally {
            stopLoading()
        }
    };
    return (
        <div className={styles.userList}>
            {loading && <LoadingBar progress={progress} />}
            {users.map(({ id_user, nome, email, created_at, username, foto }) => (
                <div key={id_user} className={styles.userCard}>
                    <img src={foto} alt={`${nome} photo`} className={styles.photo} />
                    <div className={styles.info}>
                        <div className={styles.nameUsername}>
                            <h3 className={styles.name}>{nome ?? "Sem nome"}</h3>
                            <span className={styles.username}>{`${username ? `@${username}` : "Sem Usuário"}`}</span>
                        </div>
                        <p className={styles.email}>{email}</p>
                        <p className={styles.createdAt}>
                            Criado em: {created_at}
                        </p>
                    </div>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={userStates[id_user]}
                            onChange={() => handleToggle(id_user)}
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>
            ))}
        </div>
    );
};
export default UserList;