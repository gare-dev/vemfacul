
import { createContext, useState } from "react";

type PopupOptionsContextType = {
    isPopupOptionsOpen: boolean;
    setIsPopupOptionsOpen: (isOpen: boolean) => void;
};

type PopupOptionsProviderProps = {
    children: React.ReactNode;
};

export const PopupOptionsContext = createContext<PopupOptionsContextType | undefined>(undefined);

export const PopupOptionsProvider = ({ children }: PopupOptionsProviderProps) => {
    const [isPopupOptionsOpen, setIsPopupOptionsOpen] = useState<boolean>(false);
    return (
        <PopupOptionsContext.Provider value={{ isPopupOptionsOpen, setIsPopupOptionsOpen }}>
            {children}
        </PopupOptionsContext.Provider>
    );
}