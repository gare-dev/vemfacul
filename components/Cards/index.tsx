import styles from './styles.module.css';

interface CardProps {
    // style: string;
    // MainText: string;
    img: string;
}

function MainCard(props: CardProps) {
    return (
        <div className={styles.content}>
            <div className={styles.card}>
                <div className={styles.title}>
                    <div className={styles.text}>
                        <h1>O seu <span className={styles.txtBlue}>sonho</span> comeca com a <span className={styles.txtBlue}>aprovacao!</span></h1>
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

export default MainCard;
