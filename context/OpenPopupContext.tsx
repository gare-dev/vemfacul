import React, { createContext, useContext, useState } from 'react';

type PopupContextType = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void
};

type OpenPopupProviderProps = {
    children: React.ReactNode;
};

export const OpenPopupContext = createContext<PopupContextType | undefined>(undefined);

export const OpenPopupProvider = ({ children }: OpenPopupProviderProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <OpenPopupContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </OpenPopupContext.Provider>
    );
}