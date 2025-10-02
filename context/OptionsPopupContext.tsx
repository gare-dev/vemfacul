import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OptionsPopupContextType {
    activePopupId: string | number | null;
    setActivePopupId: (id: string | number | null) => void;
}

const OptionsPopupContext = createContext<OptionsPopupContextType | undefined>(undefined);

export const OptionsPopupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activePopupId, setActivePopupId] = useState<string | number | null>(null);

    return (
        <OptionsPopupContext.Provider value={{ activePopupId, setActivePopupId }}>
            {children}
        </OptionsPopupContext.Provider>
    );
};

export const useOptionsPopup = () => {
    const context = useContext(OptionsPopupContext);
    if (context === undefined) {
        throw new Error('useOptionsPopup must be used within an OptionsPopupProvider');
    }
    return context;
};