import React from "react";

export interface RequestLog {
    id: string;
    timestamp: string;
    method: string;
    url: string;
    status_code: number;
    duration_ms: number;
    user_id: string | null;
    environment: string;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    query_params: any;
    request_body: any;
    request_headers: any;
    response_body: any;
    /* eslint-enable @typescript-eslint/no-explicit-any */
    error_message: string | null;
    response_size: number;
    error_stack: string;
    trace_id: string;
}

interface Props {
    logs_props: RequestLog[];
}

const methodColors: Record<string, string> = {
    GET: "#001ECB", // azul escuro
    POST: "#2E8B57", // verde escuro
    PUT: "#FFA500", // laranja
    DELETE: "#B22222", // vermelho escuro
    PATCH: "#8A2BE2", // azul violeta
    OPTIONS: "#778CFE", // azul claro
    HEAD: "#555555", // cinza escuro
};

const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "#2E8B57";
    if (status >= 300 && status < 400) return "#FFA500";
    if (status >= 400 && status < 500) return "#B22222";
    if (status >= 500) return "#8B0000";
    return "#001ECB";
};

const LogEntry = ({ logs_props }: Props) => {
    return (
        <>
            <style>{`
        .log-container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f5f7ff;
          border: 1px solid #001ECB;
          border-radius: 8px;
          padding: 16px;
          margin: 12px auto;
          max-width: 600px;
          color: #001ECB;
          box-shadow: 0 2px 8px rgba(0, 30, 203, 0.2);
          word-break: break-word;
          transition: box-shadow 0.3s ease;
        }
        .log-container:hover {
          box-shadow: 0 4px 16px rgba(0, 30, 203, 0.4);
        }
        .log-header {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          margin-bottom: 12px;
          border-bottom: 2px solid #778CFE;
          padding-bottom: 8px;
        }
        .log-header > div {
          margin-bottom: 6px;
          font-weight: 600;
          font-size: 0.9rem;
          color: #001ECB;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .method-badge {
          font-weight: 700;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.85rem;
          text-transform: uppercase;
          min-width: 50px;
          text-align: center;
        }
        .status-badge {
          font-weight: 700;
          color: white;
          padding: 2px 10px;
          border-radius: 12px;
          font-size: 0.85rem;
          min-width: 50px;
          text-align: center;
        }
        .log-section {
          margin-bottom: 12px;
        }
        .log-section h4 {
          margin: 0 0 6px 0;
          color: #001ECB;
          border-left: 4px solid #778CFE;
          padding-left: 8px;
          font-size: 1rem;
        }
        .log-key {
          font-weight: 600;
          color: #001ECB;
        }
        .log-value {
          margin-left: 6px;
          color: #333;
          word-wrap: break-word;
        }
        pre {
          background: #e3e7ff;
          padding: 8px;
          border-radius: 4px;
          overflow-x: auto;
          color: #001ECB;
          font-size: 0.9rem;
        }
        @media (max-width: 480px) {
          .log-container {
            padding: 12px;
            margin: 0px 20px 50px 20px;
            max-width: 100%;
            border: 0;
            border-radius: 0;

          }
          .log-header {
            flex-direction: column;
            gap: 6px;
          }
          .log-header > div {
            font-size: 0.85rem;
          }
          .log-section h4 {
            font-size: 0.95rem;
          }
        }
      `}</style>

            {logs_props?.map((log: RequestLog, i) => {
                const methodColor = methodColors[log.method.toUpperCase()] || "#001ECB";
                const statusColor = getStatusColor(log.status_code);

                return (
                    <article key={i} className="log-container" aria-label="API Log Entry">
                        <header className="log-header">
                            <div>
                                <span className="log-key">ID:</span>{" "}
                                <span className="log-value">{log.id}</span>
                            </div>
                            <div>
                                <span className="log-key">Timestamp:</span>{" "}
                                <span className="log-value">{log.timestamp}</span>
                            </div>
                            <div>
                                <span className="log-key">Method:</span>{" "}
                                <span
                                    className="method-badge"
                                    style={{ backgroundColor: methodColor }}
                                >
                                    {log.method.toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <span className="log-key">Status:</span>{" "}
                                <span
                                    className="status-badge"
                                    style={{ backgroundColor: statusColor }}
                                >
                                    {log.status_code}
                                </span>
                            </div>
                            <div>
                                <span className="log-key">Duration:</span>{" "}
                                <span className="log-value">{log.duration_ms} ms</span>
                            </div>
                        </header>

                        <section className="log-section">
                            <h4>Request</h4>
                            <div>
                                <span className="log-key">URL:</span>{" "}
                                <span className="log-value">{log.url}</span>
                            </div>
                            {Object.keys(log.query_params).length > 0 && (
                                <div>
                                    <span className="log-key">Query Params:</span>
                                    <pre>{JSON.stringify(log.query_params, null, 2)}</pre>
                                </div>
                            )}
                            {Object.keys(log.request_body).length > 0 && (
                                <div>
                                    <span className="log-key">Request Body:</span>
                                    <pre>{JSON.stringify(log.request_body, null, 2)}</pre>
                                </div>
                            )}
                            <div>
                                <span className="log-key">Headers:</span>
                                <pre>{JSON.stringify(log.request_headers, null, 2)}</pre>
                            </div>
                        </section>

                        <section className="log-section">
                            <h4>Response</h4>
                            <div>
                                <span className="log-key">Status Code:</span>{" "}
                                <span className="log-value">{log.status_code}</span>
                            </div>
                            <div>
                                <span className="log-key">Response Size:</span>{" "}
                                <span className="log-value">{log.response_size} bytes</span>
                            </div>
                            <div>
                                <span className="log-key">Response Body:</span>
                                <pre style={{ maxHeight: "300px" }}>
                                    {(() => {
                                        try {
                                            return JSON.stringify(
                                                JSON.parse(log.response_body),
                                                null,
                                                2
                                            );
                                        } catch {
                                            return log.response_body;
                                        }
                                    })()}
                                </pre>
                            </div>
                        </section>

                        {log.error_message && (
                            <section className="log-section" style={{ color: "#b00020" }}>
                                <h4>Error</h4>
                                <div>
                                    <span className="log-key">Message:</span>{" "}
                                    <span className="log-value">{log.error_message}</span>
                                </div>
                                {log.error_stack && <pre>{log.error_stack}</pre>}
                            </section>
                        )}

                        <section className="log-section">
                            <h4>Metadata</h4>
                            <div>
                                <span className="log-key">User  ID:</span>{" "}
                                <span className="log-value">{log.user_id ?? "N/A"}</span>
                            </div>
                            <div>
                                <span className="log-key">Environment:</span>{" "}
                                <span className="log-value">{log.environment}</span>
                            </div>
                            <div>
                                <span className="log-key">Trace ID:</span>{" "}
                                <span className="log-value">{log.trace_id}</span>
                            </div>
                        </section>
                    </article>
                );
            })}
        </>
    );
};

export default LogEntry;
