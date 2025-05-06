import PopupType from "@/types/data";
import { createContext, useState } from "react";


type CalendarDataContextType = {
    calendarData: PopupType;
    setCalendarData: React.Dispatch<React.SetStateAction<PopupType>>;
};

type CalendarDataProviderProps = {
    children: React.ReactNode;
};

export const CalendarDataContext = createContext<CalendarDataContextType | undefined>(undefined);

export const CalendarDataProvider = ({ children }: CalendarDataProviderProps) => {
    const [calendarData, setCalendarData] = useState<PopupType>({} as PopupType);

    return (
        <CalendarDataContext.Provider value={{ calendarData, setCalendarData }}>
            {children}
        </CalendarDataContext.Provider>
    );
}