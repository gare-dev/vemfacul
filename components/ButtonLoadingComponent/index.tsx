import styles from "@/styles/buttonloadingcomponent.module.scss"

export default function ButtonLoadingComponent() {
    return (
        <div>
            <div className={`${styles.spinner} ${styles.center}`}>
                <div className={`${styles.spinnerblade}`}></div>
                <div className={`${styles.spinnerblade}`}></div>
                <div className={`${styles.spinnerblade}`}></div>
                <div className={`${styles.spinnerblade}`}></div>
                <div className={`${styles.spinnerblade}`}></div>
                <div className={`${styles.spinnerblade}`}></div>
                <div className={`${styles.spinnerblade}`}></div>
                <div className={`${styles.spinnerblade}`}></div>
                <div className={`${styles.spinnerblade}`}></div>
                <div className={`${styles.spinnerblade}`}></div>
                <div className={`${styles.spinnerblade}`}></div>
                <div className={`${styles.spinnerblade}`}></div>
            </div>
        </div>
    )
}