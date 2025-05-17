import styles from '@/styles/cardlandingpagecomponent.module.scss';

interface CardProps {
    title?: boolean;
    curso?: string;
    img?: string;
}


function MainCard(props: CardProps) {
    return (
        <div className={styles.titulo_content}>
            <div className={styles.card}>
                <div className={styles.title}>
                    <div className={styles.text}>
                        <h1>O seu <span className={styles.txtBlue}>sonho</span> começa com a <span className={styles.txtBlue}>aprovação!</span></h1>
                        <button className={styles.button}>
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
        <div className={styles.second_content}>
            <div className={styles.card}>
                <div className={styles.img}>
                    <img src={props.img} alt="" />
                </div>
                <div className={styles.title}>
                    <h1>{props.curso}</h1>
                    <div className={styles.info}>
                        <h2 className={styles.localizacao}>localização</h2>
                        <button className={styles.button}>
                            <p>Saiba Mais</p>
                        </button>
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