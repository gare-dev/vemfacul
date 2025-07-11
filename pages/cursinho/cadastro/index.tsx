import { useState, useEffect, ChangeEvent } from 'react';
import styles from '@/styles/cursinhoCadasto.module.scss';
import Input from '@/components/Common/Cursinho/Input';
import Header from '@/components/Header';
import maskCNPJ from '@/utils/maskCNPJ';
import maskCEP from '@/utils/maskCEP';

interface InstitutionData {
    name: string;
    exhibitionName: string
    cnpj: string;
    legalRepresentative: string;
    contactEmail: string;
    phone: string;
    website: string;
}

interface AddressData {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    cep: string;
    state: string
    uf: string;
    regiao: string
}

interface AcademicData {
    offeredModalities: string[];
    focusSubjects: string[];
    averageStudentsPerClass: string;
    differentials: string;
}

interface FinancialData {
    priceRange: string;
    hasScholarships: boolean;
    acceptsPublicPrograms: boolean;
}

interface MediaData {
    description: string;
    logo: File | null;
    spacePhotos: File[] | null;
}

interface LoginData {
    email: string;
    password: string;
}

export default function InstitutionRegistration() {
    const [institutionData, setInstitutionData] = useState<InstitutionData>({
        name: '',
        exhibitionName: '',
        cnpj: '',
        legalRepresentative: '',
        contactEmail: '',
        phone: '',
        website: ''
    });

    const [addressData, setAddressData] = useState<AddressData>({
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        cep: '',
        state: '',
        uf: '',
        regiao: ''
    });

    const [academicData, setAcademicData] = useState<AcademicData>({
        offeredModalities: [],
        focusSubjects: [],
        averageStudentsPerClass: '',
        differentials: ''
    });

    const [financialData, setFinancialData] = useState<FinancialData>({
        priceRange: '',
        hasScholarships: false,
        acceptsPublicPrograms: false
    });

    const [mediaData, setMediaData] = useState<MediaData>({
        description: '',
        logo: null,
        spacePhotos: null
    });

    const [loginData, setLoginData] = useState<LoginData>({
        email: '',
        password: ''
    });

    // Handle CEP API consultation
    useEffect(() => {
        if (addressData.cep.length === 9) {
            fetch(`https://viacep.com.br/ws/${addressData.cep.replace('-', '')}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (!data.erro) {
                        setAddressData({
                            ...addressData,
                            street: data.logradouro,
                            neighborhood: data.bairro,
                            city: data.localidade,
                            state: data.estado,
                            uf: data.uf,
                            regiao: data.regiao,
                        });
                    }
                })
                .catch(error => console.error('CEP lookup error:', error));
        }
    }, [addressData.cep]);

    // Handlers for each form section
    const handleInstitutionDataChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInstitutionData({
            ...institutionData,
            [name]: value
        });
    };

    const handleAddressDataChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddressData({
            ...addressData,
            [name]: value
        });
    };

    const handleModalityChange = (modality: string) => {
        const isSelected = academicData.offeredModalities.includes(modality);
        let newModalities;
        if (isSelected) {
            newModalities = academicData.offeredModalities.filter(m => m !== modality);
        } else {
            newModalities = [...academicData.offeredModalities, modality];
        }
        setAcademicData({
            ...academicData,
            offeredModalities: newModalities
        });
    };

    const handleSubjectChange = (subject: string) => {
        const isSelected = academicData.focusSubjects.includes(subject);
        let newSubjects;
        if (isSelected) {
            newSubjects = academicData.focusSubjects.filter(s => s !== subject);
        } else {
            newSubjects = [...academicData.focusSubjects, subject];
        }
        setAcademicData({
            ...academicData,
            focusSubjects: newSubjects
        });
    };

    const handleFinancialDataChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, type, checked, value } = e.target;
        setFinancialData({
            ...financialData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleMediaDataChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setMediaData({
            ...mediaData,
            [name]: value
        });
    };

    const handleLoginDataChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value
        });
    };

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, field: 'logo' | 'spacePhotos') => {
        if (e.target.files) {
            if (field === 'logo') {
                setMediaData({
                    ...mediaData,
                    logo: e.target.files[0]
                });
            } else {
                setMediaData({
                    ...mediaData,
                    spacePhotos: Array.from(e.target.files)
                });
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would normally submit the form data to your API
        console.log({
            institutionData,
            addressData,
            academicData,
            financialData,
            mediaData,
            loginData
        });
        alert('Form submitted! Check console for data.');
    };

    return (
        <>
            <Header />
            <div className={styles.container}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Institutional Information */}
                    <div className={styles.formSection}>
                        <h2>Informações Institucionais</h2>
                        <div className={styles.inputGroup}>
                            <Input name='name' label='Nome da Instituição' onChange={handleInstitutionDataChange} value={institutionData.name} required type='text' />
                        </div>
                        <div className={styles.inputGroup}>
                            <Input name='exhibitionName' label='Nome de exibição' onChange={handleInstitutionDataChange} value={institutionData.exhibitionName} required type='text' />
                        </div>
                        <div className={styles.inputGroup}>
                            <Input name='cnpj' maxLength={18} label='CNPJ' onChange={handleInstitutionDataChange} value={maskCNPJ(institutionData.cnpj)} required type='text' />
                        </div>
                        <div className={styles.inputGroup}>
                            <Input name='legalRepresentative' label='Nome do Responsável Legal' onChange={handleInstitutionDataChange} value={institutionData.legalRepresentative} required type='text' />
                        </div>
                        <div className={styles.inputGroup}>
                            <Input name='contactEmail' label='Email de Contato' onChange={handleInstitutionDataChange} value={institutionData.contactEmail} required type='text' />
                        </div>
                        <div className={styles.inputGroup}>
                            <Input name='phone' label='Telefone' onChange={handleInstitutionDataChange} value={institutionData.phone} required type="tel" />
                        </div>
                        <div className={styles.inputGroup}>
                            <Input name='website' label='Site Oficial' onChange={handleInstitutionDataChange} value={institutionData.website} required type='tel' />
                        </div>
                    </div>
                    <div className={styles.formSection}>

                        <h2>Endereço</h2>
                        <div className={styles.inputGroup}>
                            <Input
                                name='cep'
                                label='CEP (digite para consultar)'
                                onChange={handleAddressDataChange}
                                value={maskCEP(addressData.cep)}
                                required
                                maxLength={20}
                                type='text'
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <Input
                                name='street'
                                label='Rua'
                                onChange={handleAddressDataChange}
                                value={addressData.street}
                                required
                                maxLength={40}
                                type='text'
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <Input
                                name='number'
                                label='Número'
                                onChange={handleAddressDataChange}
                                value={addressData.number}
                                required
                                type='number'
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <Input
                                name='neighborhood'
                                label='Bairro'
                                onChange={handleAddressDataChange}
                                value={addressData.neighborhood}
                                required
                                type='text'
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <Input
                                name='city'
                                label='Cidade'
                                onChange={handleAddressDataChange}
                                value={addressData.city}
                                required
                                type='text'
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <Input
                                name='state'
                                label='Estado'
                                onChange={handleAddressDataChange}
                                value={addressData.state}
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
                                            checked={academicData.offeredModalities.includes(modality)}
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
                                            checked={academicData.focusSubjects.includes(subject)}
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
                                id="averageStudentsPerClass"
                                name="averageStudentsPerClass"
                                value={academicData.averageStudentsPerClass}
                                onChange={(e) => setAcademicData({
                                    ...academicData,
                                    averageStudentsPerClass: e.target.value
                                })}
                                min="1"
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="differentials">Diferenciais</label>
                            <textarea
                                id="differentials"
                                name="differentials"
                                value={academicData.differentials}
                                onChange={(e) => setAcademicData({
                                    ...academicData,
                                    differentials: e.target.value
                                })}
                                rows={4}
                                placeholder="Descreva os principais diferenciais da sua instituição"
                            />
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <h2>Informações Financeiras</h2>

                        <div className={styles.inputGroup}>
                            <label htmlFor="priceRange">Faixa de Preço</label>
                            <select
                                id="priceRange"
                                name="priceRange"
                                value={financialData.priceRange}
                                onChange={(e) => setFinancialData({
                                    ...financialData,
                                    priceRange: e.target.value
                                })}
                                required
                            >
                                <option value="">Selecione</option>
                                <option value="baixa">Baixa (até R$500/mês)</option>
                                <option value="media">Média (R$500-R$1500/mês)</option>
                                <option value="alta">Alta (acima de R$1500/mês)</option>
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="hasScholarships"
                                    checked={financialData.hasScholarships}
                                    onChange={handleFinancialDataChange}
                                />
                                Possui Bolsas de Estudo
                            </label>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="acceptsPublicPrograms"
                                    checked={financialData.acceptsPublicPrograms}
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
                            <label htmlFor="description">Descrição da Instituição</label>
                            <textarea
                                id="description"
                                name="description"
                                value={mediaData.description}
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
                                onChange={(e) => handleFileUpload(e, 'spacePhotos')}
                            />
                        </div>
                    </div>

                    {/* Login Information */}
                    <div className={styles.formSection}>
                        <h2>Informações de Login</h2>

                        <div className={styles.inputGroup}>
                            <label htmlFor="loginEmail">Email para Acesso</label>
                            <input
                                type="email"
                                id="loginEmail"
                                name="email"
                                value={loginData.email}
                                onChange={handleLoginDataChange}
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="password">Senha</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={loginData.password}
                                onChange={handleLoginDataChange}
                                minLength={8}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Finalizar Cadastro
                    </button>
                </form >
            </div >
        </>
    );
}

