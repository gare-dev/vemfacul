// components/Filter.tsx
import React, { useState, useEffect } from 'react';
import styles from './style.module.scss';

export interface Cursinho {
    id_cursinho: string;
    nome: string;
    nome_exibido: string;
    cidade: string;
    uf: string;
    faixa_preco: 'baixa' | 'media' | 'alta' | 'gratuito';
    logo: string;
    estado: string;
    regiao: string;
    modalidades: string[];
    disciplinas_foco: string[];
    tem_bolsa: boolean;
    aceita_programas_publico: boolean;
    media: number | null;
    total_avaliacoes: string;
}

interface FilterProps {
    data: Cursinho[];
    onFilter: (filtered: Cursinho[]) => void;
}

const ESTADOS_BRASIL = [
    "Acre",
    "Alagoas",
    "Amapá",
    "Amazonas",
    "Bahia",
    "Ceará",
    "Distrito Federal",
    "Espírito Santo",
    "Goiás",
    "Maranhão",
    "Mato Grosso",
    "Mato Grosso do Sul",
    "Minas Gerais",
    "Pará",
    "Paraíba",
    "Paraná",
    "Pernambuco",
    "Piauí",
    "Rio de Janeiro",
    "Rio Grande do Norte",
    "Rio Grande do Sul",
    "Rondônia",
    "Roraima",
    "Santa Catarina",
    "São Paulo",
    "Sergipe",
    "Tocantins"
];

const FAIXA_PRECO_OPTIONS_2 = [
    {
        value: 'gratuito',
        label: 'Gratuito'
    },
    {
        value: 'baixa',
        label: 'Baixa (até R$500/mês)'
    },
    {
        value: 'media',
        label: 'Média (R$500-R$1500/mês)'
    },
    {
        value: 'alta',
        label: 'Alta (acima de R$1500/mês)'
    },
]
const REGIAO_OPTIONS = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'];

const Filter: React.FC<FilterProps> = ({ data, onFilter }) => {
    const [nome, setNome] = useState('');
    const [cidade, setCidade] = useState('');
    const [uf,] = useState('');
    const [faixaPreco, setFaixaPreco] = useState('');
    const [estado, setEstado] = useState('');
    const [regiao, setRegiao] = useState('');
    const [modalidades, setModalidades] = useState<string[]>([]);
    const [disciplinas, setDisciplinas] = useState<string[]>([]);
    const [temBolsa, setTemBolsa] = useState<boolean | null>(null);
    const [aceitaProgramas, setAceitaProgramas] = useState<boolean | null>(null);

    // Extrair opções únicas de modalidades e disciplinas do dataset
    const allModalidades = Array.from(new Set(data.flatMap(d => d.modalidades))).sort();
    const allDisciplinas = Array.from(new Set(data.flatMap(d => d.disciplinas_foco))).sort();

    useEffect(() => {
        let filtered = data;

        if (nome.trim()) {
            filtered = filtered.filter(c =>
                c.nome.toLowerCase().includes(nome.toLowerCase()) ||
                c.nome_exibido.toLowerCase().includes(nome.toLowerCase())
            );
        }
        if (cidade.trim()) {
            filtered = filtered.filter(c => c.cidade.toLowerCase().includes(cidade.toLowerCase()));
        }
        if (uf) {
            filtered = filtered.filter(c => c.uf === uf);
        }
        if (faixaPreco) {
            filtered = filtered.filter(c => c.faixa_preco === faixaPreco);
        }
        if (estado) {
            filtered = filtered.filter(c => c.estado === estado);
        }
        if (regiao) {
            filtered = filtered.filter(c => c.regiao === regiao);
        }
        if (modalidades.length > 0) {
            filtered = filtered.filter(c => modalidades.every(m => c.modalidades.includes(m)));
        }
        if (disciplinas.length > 0) {
            filtered = filtered.filter(c => disciplinas.every(d => c.disciplinas_foco.includes(d)));
        }
        if (temBolsa !== null) {
            filtered = filtered.filter(c => c.tem_bolsa === temBolsa);
        }
        if (aceitaProgramas !== null) {
            filtered = filtered.filter(c => c.aceita_programas_publico === aceitaProgramas);
        }

        onFilter(filtered);
    }, [nome, cidade, uf, faixaPreco, estado, regiao, modalidades, disciplinas, temBolsa, aceitaProgramas, data, onFilter]);

    // Handlers para checkbox múltiplo
    const toggleModalidade = (mod: string) => {
        setModalidades(prev =>
            prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod]
        );
    };
    const toggleDisciplina = (disc: string) => {
        setDisciplinas(prev =>
            prev.includes(disc) ? prev.filter(d => d !== disc) : [...prev, disc]
        );
    };

    return (
        <form className={styles.filter} onSubmit={e => e.preventDefault()}>
            <div className={styles.row}>
                <div className={styles.inputGroup}>
                    <label htmlFor="nome">Nome</label>
                    <div className={styles.inputIcon}>
                        <input
                            id="nome"
                            type="text"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                            placeholder="Buscar por nome"
                        />
                    </div>
                </div>


                <div className={styles.inputGroup}>
                    <label htmlFor="faixaPreco">Faixa de Preço</label>
                    <select id="faixaPreco" value={faixaPreco} onChange={e => setFaixaPreco(e.target.value)}>
                        <option value="">Todas</option>
                        {FAIXA_PRECO_OPTIONS_2.map((fp, i) => (
                            <option key={i} value={fp.value}>{fp.label}</option>
                        ))}
                    </select>
                </div>

                {/* <div className={styles.inputGroup}>
                    <label htmlFor="uf">UF</label>
                    <select id="uf" value={uf} onChange={e => setUf(e.target.value)}>
                        <option value="">Todas</option>
                        {UF_OPTIONS.map(u => (
                            <option key={u} value={u}>{u}</option>
                        ))}
                    </select>
                </div> */}
            </div>

            <div className={styles.row}>

                <div className={styles.inputGroup}>
                    <label htmlFor="cidade">Cidade</label>
                    <div className={styles.inputIcon}>
                        <input
                            id="cidade"
                            type="text"
                            value={cidade}
                            onChange={e => setCidade(e.target.value)}
                            placeholder="Buscar por cidade"
                        />
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="estado">Estado</label>
                    <select id="estado" value={estado} onChange={e => setEstado(e.target.value)}>
                        <option value="">Todos</option>
                        {ESTADOS_BRASIL.map(e => (
                            <option key={e} value={e}>{e}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="regiao">Região</label>
                    <select id="regiao" value={regiao} onChange={e => setRegiao(e.target.value)}>
                        <option value="">Todas</option>
                        {REGIAO_OPTIONS.map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>
            </div>

            <fieldset className={styles.checkboxGroup}>
                <legend>Modalidades</legend>
                <div className={styles.checkboxList}>
                    {allModalidades.map(mod => (
                        <label key={mod} className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={modalidades.includes(mod)}
                                onChange={() => toggleModalidade(mod)}
                            />
                            {mod}
                        </label>
                    ))}
                </div>
            </fieldset>

            <fieldset className={styles.checkboxGroup}>
                <legend>Disciplinas Foco</legend>
                <div className={styles.checkboxList}>
                    {allDisciplinas.map(disc => (
                        <label key={disc} className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={disciplinas.includes(disc)}
                                onChange={() => toggleDisciplina(disc)}
                            />
                            {disc}
                        </label>
                    ))}
                </div>
            </fieldset>

            <div className={styles.row}>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={temBolsa === true}
                        onChange={() => setTemBolsa(temBolsa === true ? null : true)}
                    />

                    Tem Bolsa
                </label>

                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={aceitaProgramas === true}
                        onChange={() => setAceitaProgramas(aceitaProgramas === true ? null : true)}
                    />
                    Aceita Programas Público
                </label>
            </div>
        </form >
    );
};

export default Filter;
