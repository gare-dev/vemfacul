
import styles from "@/styles/loadingcomponent.module.scss"
import { useEffect } from "react";

interface props {
    isLoading: boolean;
}

export default function LoadingComponent(props: props) {

    useEffect(() => {
        if (props.isLoading) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [props.isLoading]);

    if (!props.isLoading) return null;

    return (
        <div className={styles.loading}>
            <div style={{ zIndex: 9999999999999 }} className="flex items-center justify-center h-screen relative">


                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="200px"
                    width="200px"
                    viewBox="0 0 200 200"
                    className={styles.pencil}
                >
                    <defs>
                        <clipPath id="pencil-eraser">
                            <rect height="30" width="30" ry="5" rx="5"></rect>
                        </clipPath>
                    </defs>
                    <circle
                        transform="rotate(-113,100,100)"
                        strokeLinecap="round"
                        strokeDashoffset={439.82}
                        strokeDasharray="439.82 439.82"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        r="70"
                        className={styles.pencil__stroke}
                    ></circle>
                    <g transform="translate(100,100)" className={styles.pencil__rotate}>
                        <g fill="none">
                            <circle
                                transform="rotate(-90)"
                                strokeDashoffset={402}
                                strokeDasharray="402.12 402.12"
                                strokeWidth="30"
                                stroke="hsl(223,90%,50%)"
                                r="64"
                                className={styles.pencil__body1}
                            ></circle>
                            <circle
                                transform="rotate(-90)"
                                strokeDashoffset={465}
                                strokeDasharray="464.96 464.96"
                                strokeWidth="10"
                                stroke="hsl(223,90%,60%)"
                                r="74"
                                className={styles.pencil__body2}
                            ></circle>
                            <circle
                                transform="rotate(-90)"
                                strokeDashoffset={339}
                                strokeDasharray="339.29 339.29"
                                strokeWidth="10"
                                stroke="hsl(223,90%,40%)"
                                r="54"
                                className={styles.pencil__body3}
                            ></circle>
                        </g>
                        <g transform="rotate(-90) translate(49,0)" className={styles.pencil__eraser}>
                            <g className={styles.pencil__eraser_skew}>
                                <rect height="30" width="30" ry="5" rx="5" fill="hsl(223,90%,70%)"></rect>
                                <rect clipPath="url(#pencil-eraser)" height="30" width="5" fill="hsl(223,90%,60%)"></rect>
                                <rect height="20" width="30" fill="hsl(223,10%,90%)"></rect>
                                <rect height="20" width="15" fill="hsl(223,10%,70%)"></rect>
                                <rect height="20" width="5" fill="hsl(223,10%,80%)"></rect>
                                <rect height="2" width="30" y="6" fill="hsla(223,10%,10%,0.2)"></rect>
                                <rect height="2" width="30" y="13" fill="hsla(223,10%,10%,0.2)"></rect>
                            </g>
                        </g>
                        <g transform="rotate(-90) translate(49,-30)" className={styles.pencil__point}>
                            <polygon points="15 0,30 30,0 30" fill="hsl(33,90%,70%)"></polygon>
                            <polygon points="15 0,6 30,0 30" fill="hsl(33,90%,50%)"></polygon>
                            <polygon points="15 0,20 10,10 10" fill="hsl(223,10%,10%)"></polygon>
                        </g>
                    </g>
                </svg>
            </div>

        </div>
    )
}