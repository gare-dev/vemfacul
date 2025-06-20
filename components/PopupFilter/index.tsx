
import styles from "@/styles/popupfilter.module.scss"
import { FiltrosType } from "@/types/filtrosType"
import { cursinhoList, eventList } from "@/utils/eventList"


export default function PopupFilter({ isVisible, setFiltroEventos, filtroEventos, callFilter }: {
    isVisible: boolean,
    filtroEventos: FiltrosType[],
    setFiltroEventos: (value: FiltrosType[]) => void
    callFilter: () => void
}) {
    return (
        isVisible && (
            <div
                // onClick={(e) => { setIsVisible(false); e.stopPropagation() }} 
                className={styles.popupContainer}>
                <div className={styles.boxDiv}>
                    <h2 className={styles.filtrosText}>Filtros</h2>
                    <div className={styles.filtrosContainer}>
                        <div>
                            <p className={styles.titleFiltros}>Tipos de Evento</p>
                            <div>
                                {eventList.map((event, index) => {
                                    const isImportante = event.value === "importante";
                                    const current = filtroEventos[0];
                                    const isActive = isImportante
                                        ? current.importante
                                        : current.tipoDeEvento.includes(event.value);

                                    return (
                                        <div
                                            key={index}
                                            className={styles.eventoContainer}
                                            style={{ backgroundColor: isActive ? "#001ECB" : "" }}
                                            onClick={() => {
                                                if (isImportante) {
                                                    const updated = {
                                                        ...current,
                                                        importante: !current.importante,
                                                    };
                                                    setFiltroEventos([updated]);
                                                } else {
                                                    const alreadyExists = current.tipoDeEvento.includes(event.value);
                                                    const updated = {
                                                        ...current,
                                                        tipoDeEvento: alreadyExists
                                                            ? current.tipoDeEvento.filter((item) => item !== event.value)
                                                            : [...current.tipoDeEvento, event.value],
                                                    };
                                                    setFiltroEventos([updated]);
                                                }
                                            }}
                                        >
                                            <p style={{ color: isActive ? "#fff" : "#000" }}>{event.name}</p>
                                        </div>
                                    );
                                })}

                            </div>
                        </div>
                        <div>
                            <p className={styles.titleFiltros}>Tipos de Evento</p>
                            <div>
                                {cursinhoList.map((event, index) => {
                                    return (
                                        <div key={index} style={filtroEventos[0].tipodeCursinho.includes(event.value) ? { backgroundColor: "#001ECB" } : { backgroundColor: "" }} onClick={() => {
                                            const current = filtroEventos[0];
                                            const alreadyExists = current.tipodeCursinho.includes(event.value);

                                            if (!alreadyExists) {
                                                const updated = {
                                                    ...current,
                                                    tipodeCursinho: [...current.tipodeCursinho, event.value],
                                                };
                                                setFiltroEventos([updated]);
                                            } else {
                                                const updated = {
                                                    ...current,
                                                    tipodeCursinho: current.tipodeCursinho.filter((item) => item !== event.value),
                                                };
                                                setFiltroEventos([updated]);
                                            }
                                        }}
                                        >
                                            <p style={filtroEventos[0].tipodeCursinho.includes(event.value) ? { color: "#fff" } : { color: "#000" }}>{event.name}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>


                    </div>
                    <div className={styles.buttonsContainer}>
                        <button onClick={() => callFilter()}>BUSCAR</button>
                        <button onClick={() => setFiltroEventos([{ tipodeCursinho: [], tipoDeEvento: [], importante: false }])}>LIMPAR</button>
                    </div>

                </div>

            </div >

        )
    )


}