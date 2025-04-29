import { createContext, useState } from "react";


type EmailContextType = {
    email: string;
    setEmail: (email: string) => void;
};

type EmailProviderProps = {
    children: React.ReactNode;
};

export const EmailContext = createContext<EmailContextType | undefined>(undefined);

export const EmailProvider = ({ children }: EmailProviderProps) => {
    const [email, setEmail] = useState<string>("");

    return (
        <EmailContext.Provider value={{ email, setEmail }}>
            {children}
        </EmailContext.Provider>
    );
}