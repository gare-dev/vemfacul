
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
                                    return (
                                        <div style={filtroEventos[0].tipoDeEvento.includes(event.value) ? { backgroundColor: "#001ECB" } : { backgroundColor: "" }} onClick={() => {
                                            const current = filtroEventos[0];
                                            const alreadyExists = current.tipoDeEvento.includes(event.value);

                                            if (!alreadyExists) {
                                                const updated = {
                                                    ...current,
                                                    tipoDeEvento: [...current.tipoDeEvento, event.value],
                                                };
                                                setFiltroEventos([updated]);
                                            } else {
                                                const updated = {
                                                    ...current,
                                                    tipoDeEvento: current.tipoDeEvento.filter((item) => item !== event.value),
                                                };
                                                setFiltroEventos([updated]);
                                            }
                                        }}

                                            key={index} className={styles.eventoContainer}>
                                            <p style={filtroEventos[0].tipoDeEvento.includes(event.value) ? { color: "#fff" } : { color: "#000" }}>{event.name}</p>
                                        </div>
                                    )
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
                        <button onClick={() => setFiltroEventos([{ tipodeCursinho: [], tipoDeEvento: [] }])}>LIMPAR</button>
                    </div>

                </div>

            </div >

        )
    )


}