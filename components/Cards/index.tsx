import styles from '@/styles/cardlandingpagecomponent.module.scss';
import { IoLocationSharp } from 'react-icons/io5';
import useOpenPopup from '@/hooks/useOpenPopup';
import { useState } from 'react';


interface CardProps {
    title?: boolean;
    curso?: string;
    img?: string;
    textInfo?: string;
    style?: object;
}


function MainCard(props: CardProps) {
    const { setIsOpen } = useOpenPopup()
    const [, setSelectedOption] = useState<string>('Cadastro')
    return (
        <div className={styles.titulo_content}>

            <div className={styles.card}>
                <div className={styles.title}>
                    <div className={styles.text}>
                        <h1>O seu <span className={styles.txtBlue}>sonho</span> começa com a <span className={styles.txtBlue}>aprovação!</span></h1>
                        <button className={styles.button} onClick={() => {
                            setIsOpen(true)
                            setSelectedOption("Cadastro")
                        }}>
                            <p>CADASTRE-SE</p>
                        </button>
                    </div>
                    <div className={styles.img}>
                        <img src={props.img} alt="" />
                    </div>
                </div>
            </div>
        </div>
    );
}
function secondCard(props: CardProps) {
    return (
        <div className={styles.content}>
            <div className={styles.second_content}
                style={props.style}>
                <div className={styles.card}>
                    <div className={styles.img}>
                        <img src={props.img} alt="" />
                    </div>
                    <div className={styles.title}>
                        <h1>{props.curso}</h1>
                        <div className={styles.info}>
                            <h2 className={styles.localizacao}><IoLocationSharp />São Paulo</h2>
                            <button className={styles.button}>
                                <p>VER MAIS</p>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}


function Card(props: CardProps) {
    return props.title ? MainCard(props) : secondCard(props);
}

export default Card;