import React, { useState } from 'react';
import styles from './style.module.scss';
import LoadingBar from '../LoadingBar';
import Api from '@/api';
import useAlert from '@/hooks/useAlert';
import { FaEyeSlash, FaRegEye } from 'react-icons/fa';

export interface User {
    id_user: string;
    nome: string;
    email: string;
    created_at: string; // ISO string
    username: string;
    foto: string;
    is_verified: boolean;
    role?: 'admin' | 'user' | 'dono de cursinho'; // novo campo opcional
    senha?: string; // nova propriedade senha

}

interface UserListProps {
    users: User[];
    onToggleActive?: (id: string, active: boolean) => void;
    onRoleChange?: (id: string, role: string) => void; // callback opcional para mudança de role
}

const roles = ['admin', 'user', 'dono de cursinho'] as const;

const UserList: React.FC<UserListProps> = ({ users, onToggleActive, onRoleChange }) => {
    const [userStates, setUser] = useState(
        users?.reduce((acc, user) => {
            acc[user.id_user] = user.is_verified;
            return acc;
        }, {} as Record<string, boolean>)
    );

    const [userRoles, setUserRoles] = useState(
        users?.reduce((acc, user) => {
            acc[user.id_user] = user.role ?? 'user';
            return acc;
        }, {} as Record<string, typeof roles[number]>)
    );

    const [showPasswords, setShowPasswords] = useState(
        users?.reduce((acc, user) => {
            acc[user.id_user] = false;
            return acc;
        }, {} as Record<string, boolean>)
    );

    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();
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
            startLoading();

            const response = await Api.setAdminUserVerify(!userStates[id], id);
            if (response.status === 200) {
                const newState = !userStates[id];
                setUser((prev) => ({ ...prev, [id]: newState }));
                if (onToggleActive) onToggleActive(id, newState);
                showAlert("Usuário atualizado com sucesso!");
            }
        } catch (error) {
            console.log("Erro ao atualizar verificação do usuário! " + error);
        } finally {
            stopLoading();
        }
    };

    const handleRoleChange = async (id: string, newRole: typeof roles[number]) => {
        try {
            startLoading();

            const response = await Api.setAdminUserRole(id, newRole);
            if (response.status === 200) {
                setUserRoles((prev) => ({ ...prev, [id]: newRole }));
                if (onRoleChange) onRoleChange(id, newRole);
                showAlert("Role do usuário atualizado com sucesso!");
            }
        } catch (error) {
            console.log("Erro ao atualizar role do usuário! " + error);
        } finally {
            stopLoading();
        }
    };

    const toggleShowPassword = (id: string) => {
        setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className={styles.userList}>
            {loading && <LoadingBar progress={progress} />}
            {users?.map(({ id_user, nome, email, created_at, username, foto, senha }) => (
                <div key={id_user} className={styles.userCard}>
                    <img src={foto} alt={`${nome} photo`} className={styles.photo} />
                    <div className={styles.info}>
                        <div className={styles.nameUsername}>
                            <h3 className={styles.name}>{nome ?? "Sem nome"}</h3>
                            <span className={styles.username}>{username ? `@${username}` : "Sem Usuário"}</span>
                        </div>
                        <p className={styles.email}>{email}</p>
                        <p className={styles.createdAt}>Criado em: {created_at}</p>

                        <div className={styles.optionsDiv}>
                            <div className={styles.passwordWrapper}>
                                <input
                                    type={showPasswords[id_user] ? 'text' : 'password'}
                                    value={senha ?? ''}
                                    readOnly
                                    className={styles.passwordInput}
                                    aria-label={`Senha do usuário ${nome}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShowPassword(id_user)}
                                    className={styles.showPasswordBtn}
                                    aria-label={showPasswords[id_user] ? 'Ocultar senha' : 'Mostrar senha'}
                                >
                                    {showPasswords[id_user] ? (
                                        <FaRegEye color='#778CFE' size={'1.2em'} />
                                    ) : (
                                        <FaEyeSlash color='#778CFE' size={'1.2em'} />
                                    )}
                                </button>

                            </div>
                            <select
                                className={styles.roleDropdown}
                                value={userRoles[id_user]}
                                onChange={(e) => handleRoleChange(id_user, e.target.value as typeof roles[number])}
                                aria-label={`Selecionar role do usuário ${nome}`}
                            >
                                {roles.map((role) => (
                                    <option key={role} value={role}>
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>



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
