import React, { useState } from "react";

interface TracePopupProps {
    message: string;
    traceId: string;
}

const TracePopup: React.FC<TracePopupProps> = ({ message, traceId }) => {
    const [isOpen, setIsOpen] = useState(true);

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                width: "300px",
                padding: "16px",
                backgroundColor: "#001ECB",
                color: "#fff",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                zIndex: 1000,
            }}
        >
            <div style={{ marginBottom: "8px", fontWeight: 600 }}>{message}</div>
            <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>Trace ID: {traceId}</div>
            <button
                onClick={() => setIsOpen(false)}
                style={{
                    marginTop: "12px",
                    background: "#fff",
                    color: "#001ECB",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: 600,
                }}
            >
                Fechar
            </button>
        </div>
    );
};

export default TracePopup;
