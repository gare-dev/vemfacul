import styles from "@/styles/alert.module.scss";
import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { MdDangerous } from "react-icons/md";
import { TiWarningOutline } from "react-icons/ti";

interface Props {
  type?: "danger" | "warning" | "success";
  message?: string;
  onClose: () => void;
}

const Alert: React.FC<Props> = ({ type = "success", message, onClose }) => {
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExit(true);
      setTimeout(onClose, 500); // espera a animação terminar
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const types = {
    success: {
      color: "#777CFE",
      icon: FaCheckCircle,
    },
    warning: {
      color: "#777CFE",
      icon: TiWarningOutline,
    },
    danger: {
      color: "#D0D7FF",
      icon: MdDangerous,
    },
  };

  const Icon = types[type].icon;
  const backgroundColor = types[type].color;

  return (
    <div
      className={`${styles.alertContainer} ${exit ? styles.fadeOut : ""}`}
      style={{ backgroundColor }}
    >
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Icon size={"1.5em"} color="white" />
          <p className={styles.alertText}>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Alert;
