import { useState, useEffect, ChangeEvent } from 'react';
import styles from '@/styles/cursinhoCadasto.module.scss';
import Input from '@/components/Common/Cursinho/Input';
import Header from '@/components/Header';
import maskCNPJ from '@/utils/maskCNPJ';
import maskCEP from '@/utils/maskCEP';
import { maskPhone } from '@/utils/maskPhone';
import Api from '@/api';

export interface InstitutionData {
    nome: string;
    nomeExibido: string
    cnpj: string;
    representanteLegal: string;
    emailContato: string;
    telefone: string;
    site: string;
}

export interface AddressData {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    cep: string;
    estado: string;
    uf: string;
    regiao: string
}

export interface AcademicData {
    modalidades: string[];
    disciplinasFoco: string[];
    mediaAlunosPorTurma: string;
    diferenciais: string;
}

export interface FinancialData {
    faixaPreco: string;
    temBolsa: boolean;
    aceitaProgramasPublicos: boolean;
}

export interface MediaData {
    descricao: string;
    logo: File | null;
    imagensLugar: File[] | null;
}

export interface LoginData {
    email: string;
    password: string;
}

export default function InstitutionRegistration() {
    const [overlay, setOverlay] = useState(false);
    const [instituicao, setInstitutionData] = useState<InstitutionData>({
        nome: '',
        nomeExibido: '',
        cnpj: '',
        representanteLegal: '',
        emailContato: '',
        telefone: '',
        site: ''
    });

    const [endereco, setAddressData] = useState<AddressData>({
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        cep: '',
        estado: '',
        uf: '',
        regiao: ''
    });

    const [academico, setAcademicData] = useState<AcademicData>({
        modalidades: [],
        disciplinasFoco: [],
        mediaAlunosPorTurma: '',
        diferenciais: ''
    });

    const [financeiro, setFinancialData] = useState<FinancialData>({
        faixaPreco: '',
        temBolsa: false,
        aceitaProgramasPublicos: false
    });

    const [imagens, setMediaData] = useState<MediaData>({
        descricao: '',
        logo: null,
        imagensLugar: null
    });

    const [login, setLoginData] = useState<LoginData>({
        email: '',
        password: ''
    });

    // Handle CEP API consultation
    useEffect(() => {
        if (endereco.cep.length === 8) {
            fetch(`https://viacep.com.br/ws/${endereco.cep}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (!data.erro) {
                        setAddressData({
                            ...endereco,
                            rua: data.logradouro,
                            bairro: data.bairro,
                            cidade: data.localidade,
                            estado: data.estado,
                            uf: data.uf,
                            regiao: data.regiao,
                        });
                    }
                })
                .catch(error => console.error('CEP lookup error:', error));
        }
    }, [endereco.cep]);


    const handleInstitutionDataChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInstitutionData({
            ...instituicao,
            [name]: name === 'cnpj' ? value.replace(/\D/g, '') : value
        });
    };

    const handleAddressDataChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddressData({
            ...endereco,
            [name]: name === 'cep' ? value.replace(/\D/g, '') : value
        });
    };

    const handleModalityChange = (modality: string) => {
        const isSelected = academico.modalidades.includes(modality);
        let newModalities;
        if (isSelected) {
            newModalities = academico.modalidades.filter(m => m !== modality);
        } else {
            newModalities = [...academico.modalidades, modality];
        }
        setAcademicData({
            ...academico,
            modalidades: newModalities
        });
    };

    const handleSubjectChange = (subject: string) => {
        const isSelected = academico.disciplinasFoco.includes(subject);
        let newSubjects;
        if (isSelected) {
            newSubjects = academico.disciplinasFoco.filter(s => s !== subject);
        } else {
            newSubjects = [...academico.disciplinasFoco, subject];
        }
        setAcademicData({
            ...academico,
            disciplinasFoco: newSubjects
        });
    };

    const handleFinancialDataChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, type, checked, value } = e.target;
        setFinancialData({
            ...financeiro,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleMediaDataChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setMediaData({
            ...imagens,
            [name]: value
        });
    };

    const handleLoginDataChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData({
            ...login,
            [name]: value
        });
    };

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, field: 'logo' | 'spacePhotos') => {
        if (e.target.files) {
            if (field === 'logo') {
                setMediaData({
                    ...imagens,
                    logo: e.target.files[0]
                });
            } else {
                setMediaData({
                    ...imagens,
                    imagensLugar: Array.from(e.target.files)
                });
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const dataToSend = {
                instituicao,
                endereco,
                academico,
                financeiro,
                login,
                imagens: {
                    descricao: imagens.descricao,
                }
            };

            const formData = new FormData();
            formData.append('data', JSON.stringify(dataToSend));

            imagens.imagensLugar?.forEach((file: File) => {
                formData.append(`imagens`, file);
            });

            formData.append('logo', imagens.logo as File);

            const response = await Api.insertCursinho(formData);

            if (response.data.code === "CURSINHO_INSERTED") {
                setOverlay(true);
                setInstitutionData({
                    nome: '',
                    nomeExibido: '',
                    cnpj: '',
                    representanteLegal: '',
                    emailContato: '',
                    telefone: '',
                    site: ''
                });
                setAddressData({
                    rua: '',
                    numero: '',
                    bairro: '',
                    cidade: '',
                    cep: '',
                    estado: '',
                    uf: '',
                    regiao: ''
                });
                setAcademicData({
                    modalidades: [],
                    disciplinasFoco: [],
                    mediaAlunosPorTurma: '',
                    diferenciais: ''
                });
                setFinancialData({
                    faixaPreco: '',
                    temBolsa: false,
                    aceitaProgramasPublicos: false
                });
                setMediaData({
                    descricao: '',
                    logo: null,
                    imagensLugar: null
                });
                setLoginData({
                    email: '',
                    password: ''
                });
            }
        } catch (error) {
            console.log(error)
        }

    };

    return (
        <>
            <Header />
            <div className={styles.container}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formSection}>
                        <h2>Informações Institucionais</h2>
                        <div className={styles.inputGroup}>
                            <Input name='nome' label='Nome da Instituição' onChange={handleInstitutionDataChange} value={instituicao.nome} required type='text' />
                        </div>
                        <div className={styles.inputGroup}>
                            <Input name='nomeExibido' label='Nome de exibição' onChange={handleInstitutionDataChange} value={instituicao.nomeExibido} required type='text' />
                        </div>
                        <div className={styles.inputGroup}>
                            <Input name='cnpj' maxLength={18} label='CNPJ' onChange={handleInstitutionDataChange} value={maskCNPJ(instituicao.cnpj)} required type='text' />
                        </div>
                        <div className={styles.inputGroup}>
                            <Input name='representanteLegal' label='Nome do Responsável Legal' onChange={handleInstitutionDataChange} value={instituicao.representanteLegal} required type='text' />
                        </div>
                        <div className={styles.inputGroup}>
                            <Input name='emailContato' label='Email de Contato' onChange={handleInstitutionDataChange} value={instituicao.emailContato} required type='text' />
                        </div>
                        <div className={styles.inputGroup}>
                            <Input maxLength={15} name='telefone' label='Telefone' onChange={handleInstitutionDataChange} value={maskPhone(instituicao.telefone)} required type="tel" />
                        </div>
                        <div className={styles.inputGroup}>
                            <Input name='site' label='Site Oficial' onChange={handleInstitutionDataChange} value={instituicao.site} required type='tel' />
                        </div>
                    </div>
                    <div className={styles.formSection}>
                        <h2>Endereço</h2>
                        <div className={styles.inputGroup}>
                            <Input
                                name='cep'
                                label='CEP (digite para consultar)'
                                onChange={handleAddressDataChange}
                                value={maskCEP(endereco.cep)}
                                required
                                maxLength={20}
                                type='text'
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <Input
                                name='rua'
                                label='Rua'
                                onChange={handleAddressDataChange}
                                value={endereco.rua}
                                required
                                maxLength={40}
                                type='text'
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <Input
                                name='numero'
                                label='Número'
                                onChange={handleAddressDataChange}
                                value={endereco.numero}
                                required
                                type='number'
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <Input
                                name='bairro'
                                label='Bairro'
                                onChange={handleAddressDataChange}
                                value={endereco.bairro}
                                required
                                type='text'
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <Input
                                name='cidade'
                                label='Cidade'
                                onChange={handleAddressDataChange}
                                value={endereco.cidade}
                                required
                                type='text'
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <Input
                                name='estado'
                                label='Estado'
                                onChange={handleAddressDataChange}
                                value={endereco.estado}
                                required
                                type='text'
                            />
                        </div>
                    </div>
                    <div className={styles.formSection}>
                        <h2>Informações Acadêmicas</h2>

                        <div className={styles.inputGroup}>
                            <label>Modalidades Oferecidas</label>
                            <div className={styles.checkboxGroup}>
                                {['Extensivo', 'Semi-extensivo', 'Intensivo', 'ITA', 'Medicina'].map(modality => (
                                    <label key={modality} className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={academico.modalidades.includes(modality)}
                                            onChange={() => handleModalityChange(modality)}
                                        />
                                        {modality}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Disciplinas de Foco</label>
                            <div className={styles.checkboxGroup}>
                                {['Humanas', 'Exatas', 'Biológicas', 'Redação', 'Linguagens'].map(subject => (
                                    <label key={subject} className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={academico.disciplinasFoco.includes(subject)}
                                            onChange={() => handleSubjectChange(subject)}
                                        />
                                        {subject}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="averageStudentsPerClass">Número Médio de Alunos por Turma</label>
                            <input
                                type="number"
                                id="mediaAlunosPorTurma"
                                name="mediaAlunosPorTurma"
                                value={academico.mediaAlunosPorTurma}
                                onChange={(e) => setAcademicData({
                                    ...academico,
                                    mediaAlunosPorTurma: e.target.value
                                })}
                                min="1"
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="differentials">Diferenciais</label>
                            <textarea
                                id="diferenciais"
                                name="diferenciais"
                                value={academico.diferenciais}
                                onChange={(e) => setAcademicData({
                                    ...academico,
                                    diferenciais: e.target.value
                                })}
                                rows={4}
                                placeholder="Descreva os principais diferenciais da sua instituição"
                            />
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <h2>Informações Financeiras</h2>

                        <div className={styles.inputGroup}>
                            <label htmlFor="faixaPreco">Faixa de Preço</label>
                            <select
                                id="faixaPreco"
                                name="faixaPreco"
                                value={financeiro.faixaPreco}
                                onChange={(e) => setFinancialData({
                                    ...financeiro,
                                    faixaPreco: e.target.value
                                })}
                                required
                            >
                                <option value="">Selecione</option>
                                <option value="gratuito">Gratuito</option>
                                <option value="baixa">Baixa (até R$500/mês)</option>
                                <option value="media">Média (R$500-R$1500/mês)</option>
                                <option value="alta">Alta (acima de R$1500/mês)</option>
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="temBolsa"
                                    checked={financeiro.temBolsa}
                                    onChange={handleFinancialDataChange}
                                />
                                Possui Bolsas de Estudo
                            </label>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="aceitaProgramasPublicos"
                                    checked={financeiro.aceitaProgramasPublicos}
                                    onChange={handleFinancialDataChange}
                                />
                                Aceita Inscrição por Programas Públicos
                            </label>
                        </div>
                    </div>

                    {/* Media and Presentation */}
                    <div className={styles.formSection}>
                        <h2>Mídia e Apresentação</h2>

                        <div className={styles.inputGroup}>
                            <label htmlFor="descricao">Descrição da Instituição</label>
                            <textarea
                                id="descricao"
                                name="descricao"
                                value={imagens.descricao}
                                onChange={handleMediaDataChange}
                                rows={6}
                                placeholder="Descreva sua instituição, sua missão, valores, etc."
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="logo">Logo da Instituição</label>
                            <input
                                type="file"
                                id="logo"
                                name="logo"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, 'logo')}
                            />

                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="spacePhotos">Fotos do Espaço (até 5 fotos)</label>
                            <input
                                type="file"
                                id="spacePhotos"
                                name="spacePhotos"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 5) {
                                        return alert('Você pode enviar no máximo 5 fotos.');
                                    }
                                    handleFileUpload(e, 'spacePhotos')
                                }}
                            />
                        </div>
                    </div>


                    <div className={styles.formSection}>
                        <h2>Informações de Login</h2>

                        <div className={styles.inputGroup}>
                            <Input name='email' label='Email para Acesso' onChange={handleLoginDataChange} value={login.email} required type='text' />
                        </div>

                        <div className={styles.inputGroup}>
                            <Input name='password' label='Senha' onChange={handleLoginDataChange} value={login.password} required type='password' />
                        </div>
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Finalizar Cadastro
                    </button>
                </form >
            </div >
            {overlay && (
                <div className={styles.overlay}>
                    <div className={styles.overlayContent}>
                        <span onClick={() => setOverlay(false)}>x</span>
                        <h2>Cadastro enviado com sucesso!</h2>
                        <p>Nós enviaremos um email quando o seu cadastro for aprovado.
                            Após a aprovação, você poderá acessar a plataforma com as informações de login preenchidas.</p>
                    </div>
                </div>
            )}
        </>
    );
}

