import React from 'react';
import { useRouter } from 'next/router';

interface PopupProps {
    redirectTo: string;
    traceID?: string | null
}

const PopupMissLogin: React.FC<PopupProps> = ({ redirectTo, traceID }) => {
    const router = useRouter();

    const handleGoBack = () => {
        router.push(redirectTo);
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 999999,
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
        >
            <div
                style={{
                    backgroundColor: '#fff',
                    borderRadius: 12,
                    padding: '2rem 3rem',
                    maxWidth: 400,
                    width: '90%',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    textAlign: 'center',
                }}
            >
                <h2
                    style={{
                        marginBottom: '1.5rem',
                        color: '#333',
                        fontWeight: 600,
                        fontSize: '1.25rem',
                    }}
                >
                    Você precisa estar logado para acessar essa página!
                </h2>
                <button
                    onClick={handleGoBack}
                    style={{
                        backgroundColor: '#001ECB',
                        color: '#D0D7FF',
                        border: 'none',
                        borderRadius: 8,
                        padding: '0.75rem 1.5rem',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#001ECB')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#001ECB')}
                    aria-label="Voltar para página anterior"
                >
                    Voltar
                </button>
                {traceID && <p style={{ fontSize: "0.85rem", opacity: 0.8, paddingTop: "5px" }}>Trace ID: {traceID} </p>}
            </div>
        </div>
    );
};

export default PopupMissLogin;
