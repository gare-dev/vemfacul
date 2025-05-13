import { EmailContext } from "@/context/EmailContext"
import { OpenPopupContext } from "@/context/OpenPopupContext";
import { useContext } from "react"

export const useOpenPopup = () => {
    const context = useContext(OpenPopupContext);
    if (!context) {
        throw new Error("usePopup must be used within a PopupProvider");
    }
    return context;
};

export default useOpenPopup