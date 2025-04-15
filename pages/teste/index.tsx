


export default function Teste() {
    return (
        <div>
            <h1>Teste</h1>
            <p>Teste de criptografia</p>
            <p>Chave: {process.env.NEXT_PUBLIC_CRYPT_KEY}</p>
        </div>
    );
}