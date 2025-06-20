import Api from "@/api";
import styles from "@/styles/createPostagem.module.scss"
import { useState, useEffect } from "react";
import { IoArrowBack } from "react-icons/io5"
import ButtonLoadingComponent from "../ButtonLoadingComponent";

interface props {
    btnClose: () => void,
    refreshPage: () => void

}

export default function CreatePostagem(props: props) {
    const [value, setValue] = useState('')
    const [visible, setIsVisible] = useState(false)
    const [loading, setIsLoadin] = useState(false)
    const [messageStatus, setMessageStatus] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!value) {
            setIsVisible(true)
            setMessageStatus("digite Algo");
        } else {
            setIsVisible(false)
            setIsLoadin(true)
            try {
                const promise = await Api.createPostagem(value)

                if (promise.data.code === "POSTAGEM_SUCESS") {
                    setMessageStatus(`postado: ${promise.data.data}`);
                    setValue('')
                    props.btnClose();
                    props.refreshPage()

                } else {
                    setMessageStatus(`Erro: ${promise.data.message || "Erro ao postar"}`);
                }
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoadin(false)
            }
        }
    }

    useEffect(() => {

    }, [])

    return (
        <>
            <div className={styles.contentPost}>
                <div className={styles.main}>
                    <div className={styles.closeDiv}>
                        <button className={styles.btn} onClick={props.btnClose}>
                            <span>
                                <IoArrowBack />
                            </span>
                        </button>
                    </div>
                    <div className={styles.label}>
                        <h1 className={styles.label}>O que você anda estudndo?</h1>
                        {visible && <h3 className={styles.alertStatus}>{messageStatus}</h3>}
                    </div>
                    <form onSubmit={handleSubmit}>
                        <textarea maxLength={250} value={value} onChange={(e) => setValue(e.target.value)} />
                        <button className={styles.btn} type="submit">
                            {loading ? <ButtonLoadingComponent /> : <span>Postar</span>}
                        </button>
                    </form>
                </div>
            </div >
        </>
    )
}