import Api from "@/api";
import Header from "@/components/Header";
import Popup from "@/components/Popup";
import PopupFilter from "@/components/PopupFilter";
import DemoWrapper from "@/hooks/DemoWrapper";
import useCalendarData from "@/hooks/useCalendarData";
import PopupType from "@/types/data";
import { FiltrosType } from "@/types/filtrosType";
import { useEffect, useState } from "react";



export default function LandingPage() {
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const { calendarData } = useCalendarData()
    const [hasOpened, setHasOpened] = useState<boolean>(false)
    const [events, setEvents] = useState<PopupType[]>([])
    const [originalEvents, setOriginalEvents] = useState<PopupType[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [popupVisible, setPopupVisible] = useState<boolean>(false)
    const [filtroEventos, setFiltroEventos] = useState<FiltrosType[]>([{
        tipoDeEvento: [],
        tipodeCursinho: []
    }]);


    const getEvents = async () => {
        try {
            setIsLoading(true)
            const response = await Api.getEvents()

            if (response.data.code === "EVENTS_SUCCESSFULLY") {
                setEvents(response.data.data)
                setOriginalEvents(response.data.data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }


    useEffect(() => {
        if (!hasOpened) return setHasOpened(true)
        setIsVisible(true)
    }, [calendarData])

    useEffect(() => {
        getEvents()
    }, [])


    useEffect(() => {
        console.log("filtroEventos", filtroEventos)
    }, [filtroEventos])


    function getFilter() {
        if (
            filtroEventos[0].tipoDeEvento.length === 0 &&
            filtroEventos[0].tipodeCursinho.length === 0
        ) {
            setPopupVisible(false);
            console.log("VOLTOU")
            return setEvents(originalEvents);
        }

        const retorno = originalEvents.filter((dado) => {
            return filtroEventos.some((f) => {
                const tipoOk = f.tipoDeEvento.length === 0 || f.tipoDeEvento.includes(dado.type);
                const cursinhoOk = f.tipodeCursinho.length === 0 || f.tipodeCursinho.includes(dado.cursinho.toLowerCase());
                return tipoOk && cursinhoOk;
            });
        });

        setPopupVisible(false);
        setEvents(retorno);
    }


    if (isLoading) {
        return (
            <div style={{
                position: "fixed",
                height: "100%",
                width: "100%"
            }}>
            </div>
        )
    }

    return (
        <div className="pb-24">
            <Popup
                isVisible={isVisible}
                setIsVisible={() => setIsVisible(false)}
            />
            <PopupFilter
                setFiltroEventos={setFiltroEventos}
                filtroEventos={filtroEventos}
                isVisible={popupVisible}
                callFilter={() => getFilter()} />


            <Header />
            <main className="flex items-center justify-center">
                <DemoWrapper eventos={events} popUpClick={() => setIsVisible(true)} popupFilterClick={() => setPopupVisible(true)} />
            </main>
        </div>
    )
}