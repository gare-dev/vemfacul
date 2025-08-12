import { alertContext } from "@/context/AlertContext";
import { useContext } from "react";

const useAlert = () => {
    const context = useContext(alertContext);
    if (!context) {
        throw Error("useAlert must be used within a AlertProvider");
    }
    return context;
};

export default useAlert;
