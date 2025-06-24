import React, { ReactNode, createContext, useState } from "react";
import Alert from "@/components/Alert";

export interface AlertState {
    id: number;
    type: "danger" | "warning" | "success";
    message: string;
}

export interface AlertContext {
    showAlert: (message: string, type?: AlertState["type"]) => void;
    hideAlert: (id: number) => void;
}

export const alertContext = createContext<AlertContext>({} as AlertContext);

type PropsWithChildren<P = unknown> = P & { children?: ReactNode | undefined };
interface Props { }

const AlertProvider: React.FC<PropsWithChildren<Props>> = ({ children }) => {
    const [alerts, setAlerts] = useState<AlertState[]>([]);

    const showAlert = (
        message: AlertState["message"],
        type: AlertState["type"] = "success"
    ) => {
        setAlerts((prev) => [...prev, { id: Date.now(), type, message }]);
    };

    const hideAlert = (id: number) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    };

    return (
        <alertContext.Provider value={{ showAlert, hideAlert }}>
            <div style={{ position: "fixed", top: 0, width: "100%", zIndex: 9999 }}>
                {alerts.map((alert) => (
                    <Alert
                        key={alert.id}
                        type={alert.type}
                        message={alert.message}
                        onClose={() => hideAlert(alert.id)}
                    />
                ))}
            </div>
            {children}
        </alertContext.Provider>
    );
};

export default AlertProvider;
