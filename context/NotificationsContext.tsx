import { createContext, useState } from "react";


type NotificationsContextType = {
    notifications: number;
    setNotifications: (notifications: number) => void;
};

type NotificationsProviderProps = {
    children: React.ReactNode;
};

export const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider = ({ children }: NotificationsProviderProps) => {
    const [notifications, setNotifications] = useState<number>(0);

    return (
        <NotificationsContext.Provider value={{ notifications, setNotifications }}>
            {children}
        </NotificationsContext.Provider>
    );
}