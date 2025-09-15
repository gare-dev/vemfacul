import { PersonalEventType } from "@/types/personaleventType";
import { createContext, useState } from "react";


type PersonalEventDataContextType = {
    personalEventsData: PersonalEventType;
    setPersonalEventsData: React.Dispatch<React.SetStateAction<PersonalEventType>>;
};

type PersonalEventDataProviderProps = {
    children: React.ReactNode;
};

export const PersonalEventDataContext = createContext<PersonalEventDataContextType | undefined>(undefined);

export const PersonalEventDataProvider = ({ children }: PersonalEventDataProviderProps) => {
    const [personalEventsData, setPersonalEventsData] = useState<PersonalEventType>({
        color: "#7685f5",
        hora: "14:30",
        isImportant: false,

    } as PersonalEventType);

    return (
        <PersonalEventDataContext.Provider value={{ personalEventsData, setPersonalEventsData }}>
            {children}
        </PersonalEventDataContext.Provider>
    );
}