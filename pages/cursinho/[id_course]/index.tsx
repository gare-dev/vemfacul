import Api from '@/api';
import Popup from '@/components/Popup';
import Sidebar from '@/components/Sidebar';
import DemoWrapper from '@/hooks/DemoWrapper';
import useAlert from '@/hooks/useAlert';
import usePersonalEvents from '@/hooks/usePersonalEvents';
import styles from '@/styles/perfil.module.scss';
import AuthDataType from '@/types/authDataType';
import PopupType from '@/types/data';
import maskCEP from '@/utils/maskCEP';
import { GetServerSideProps } from 'next';
import { useState, useRef, useEffect } from 'react';

type Cursinho = {
    id_cursinho: string
    created_at: Date
    nome: string
    nome_exibido: string
    rua: string
    numero: string
    bairro: string
    cep: string
    regiao: string
    cidade: string
    uf: string
    telefone: string
    email_contato: string
    site: string
    modalidades: string[]
    disciplinas_foco: string[]
    media_alunos: string
    faixa_preco: string
    tem_bolsa: boolean
    aceita_programas_publico: boolean
    diferenciais: string[]
    descricao: string
    logo: string
    imagens_espaco: string[]
    avaliacoes: Avaliacao[]
}

type Avaliacao = {
    name: string
    id_user: number
    pfp: string
    stars: number
    content: string
    created_at?: string
}

interface Props {
    id_course: string;
    cursinhoProp: Cursinho | null;
    authData: AuthDataType | null | undefined;
    events: PopupType[] | []
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { id_course } = ctx.params as { id_course: string };
    if (id_course === "null") {
        return {
            notFound: true
        }
    }

    try {
        const cookie = ctx.req.headers.cookie
        Api.setCookie(cookie || "")

        const [cursinho, authData, events] = await Promise.all([
            Api.getCursinhoById(id_course as string),
            Api.getProfileInfo(),
            Api.getCourseEventById(id_course)
        ])


        const cursinhoData = cursinho.status === 200
            ? {
                ...cursinho.data.data,
                avaliacoes: cursinho.data.data.avaliacoes.map((avaliacao: Avaliacao) => ({
                    ...avaliacao,
                    created_at: avaliacao.created_at
                        ? (typeof avaliacao.created_at === "string"
                            ? avaliacao.created_at
                            : new Date(avaliacao.created_at).toLocaleDateString("pt-BR"))
                        : "Data não informada"
                }))
            }
            : null;


        return {
            props: {
                cursinhoProp: cursinhoData,
                id_course: id_course as string,
                authData: authData.data.code === "PROFILE_INFO" ? authData.data.data : null,
                events: events.status === 200 ? events.data.data.map((evento: PopupType) => ({
                    ...evento,
                    created_at: new Date(evento.created_at!).toLocaleDateString('pt-BR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    })
                })) : []
            }
        };
    } catch (error) {
        console.error("Error fetching cursinho:", error);
        return {
            props: {
                id_course: id_course as string,
                cursinho: null,
                authData: null,
                events: []
            }
        };
    }
}

export default function CursinhoPage({ id_course, authData, cursinhoProp, events }: Props) {
    const [newComment, setNewComment] = useState('');
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [cursinho, setCursinho] = useState<Cursinho | null>(cursinhoProp);
    const slideInterval = useRef<NodeJS.Timeout>(null);
    const { showAlert } = useAlert();
    // const [comments, setComments] = useState<Avaliacao[]>(cursinho?.avaliacoes || []);
    const [info, setInfo] = useState<string[]>([]);
    const { setPersonalEventsData } = usePersonalEvents()
    const [, setPopupVisible] = useState(false)
    const [, setIsClose] = useState(false)
    const [isVisible, setIsVisible] = useState(false)


    useEffect(() => {
        if (cursinho?.imagens_espaco?.length && cursinho.imagens_espaco.length > 1) {
            startSlider();
        }
        return () => {
            if (slideInterval.current) {
                clearInterval(slideInterval.current);
            }
        };
    }, [cursinho?.imagens_espaco]);


    const startSlider = () => {
        const length = cursinho?.imagens_espaco?.length ?? 0;
        if (length <= 1) return; // nada de slider

        slideInterval.current = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % length);
        }, 5000);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        if (slideInterval.current) {
            clearInterval(slideInterval.current);
        }
        startSlider();
    };

    // const toggleLike = (commentId: number) => {
    //     setComments(comments.map(comment => {
    //         if (comment.id === commentId) {
    //             const isLiked = !comment.isLiked;
    //             return {
    //                 ...comment,
    //                 likes: isLiked ? comment.likes + 1 : comment.likes - 1,
    //                 isLiked
    //             };
    //         }
    //         return comment;
    //     }));
    // };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        let created_at
        try {
            const response = await Api.insertReview(id_course, userRating, newComment);

            if (response.status === 201) {
                created_at = response.data.created_at
                showAlert("Avaliação enviada com sucesso!", "success");
            }
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
        if (newComment.trim()) {
            const newCommentObj: Avaliacao = {
                id_user: cursinho?.avaliacoes.length as number + 1,
                name: info[0],
                content: newComment,
                stars: userRating,
                pfp: info[1],
                created_at: created_at.toLocaleDateString("pt-BR")

            };
            setCursinho(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    avaliacoes: [newCommentObj, ...prev.avaliacoes]
                };
            });
            setNewComment('');
            setUserRating(0);
        }
    };

    return (

        <>
            <Sidebar setInfo={setInfo} userInfo={info} authData={authData} />
            <Popup
                isVisible={isVisible}
                setIsVisible={() => setIsVisible(false)}
                canAdd={true}
                canRemove={false}
                canEdit
            />
            <div className={styles.pageContainer}>
                <div className={styles.header}>
                    <img
                        src={cursinho?.logo}
                        alt="Imagem de capa mostrando alunos estudando em ambiente moderno com paredes brancas e móveis coloridos"
                        className={styles.coverImage}
                    />
                    <div className={styles.profileContainer}>
                        <img
                            src={cursinho?.logo}
                            alt="Logo do cursinho preparatório em formato circular com fundo azul e símbolo de capelo acadêmico"
                            className={styles.profileImage}
                        />
                        <h1 className={styles.title}>{cursinho?.nome}</h1>
                        <p className={styles.motto}>{cursinho?.nome_exibido}</p>
                    </div>
                </div>

                {/* Main Info Section */}
                <div className={styles.infoSection}>
                    <div className={styles.addressContainer}>
                        <h2 className={styles.adressText}>Localização</h2>
                        <p><strong>Endereço:</strong>{` Rua ${cursinho?.rua}, ${cursinho?.numero} - ${cursinho?.bairro}, ${cursinho?.cidade}/${cursinho?.uf}`}</p>
                        <p><strong>CEP: </strong>{maskCEP(cursinho?.cep as string)}</p>
                    </div>

                    <div className={styles.contactContainer}>
                        <h2>Contato</h2>
                        <p><strong>Telefone: </strong>{cursinho?.telefone}</p>
                        <p><strong>E-mail: </strong>{cursinho?.email_contato}</p>
                        <p><strong>Site: </strong> <a href={cursinho?.site}>{cursinho?.site}</a></p>
                    </div>
                </div>

                <div className={styles.academicInfo}>
                    <div className={styles.modalidades}>
                        <h2>Modalidades Oferecidas</h2>
                        <div className={styles.modalidadesGrid}>
                            {cursinho?.modalidades.map((modalidade, index) => (
                                <div key={index} className={styles.modalidadeCard}>
                                    <h3>{modalidade}</h3>
                                    {/* <p>{modalidade.descricao}</p> */}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.disciplinas}>
                        <h2>Disciplinas de Foco</h2>
                        <ul>
                            {cursinho?.disciplinas_foco.map((disciplina, index) => (
                                <li key={index}>{disciplina}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Additional Info Section */}
                <div className={styles.additionalInfo}>
                    <div className={styles.infoItem}>
                        <h3>Número Médio de Alunos por Turma</h3>
                        <p className={styles.numberDisplay}>{cursinho?.media_alunos}</p>
                    </div>

                    <div className={styles.infoItem}>
                        <h3>Descrição</h3>
                        <p>{cursinho?.descricao}</p>
                    </div>
                    <div className={styles.infoItem}>
                        <h3>Diferenciais</h3>
                        <ul>
                            {cursinho?.diferenciais
                                ?.map((item: string) => JSON.parse(item) as { id: string; text: string })
                                .map((diferencial: { id: string; text: string }) => (
                                    <li key={diferencial.id}>{diferencial.text}</li>
                                ))}
                        </ul>
                    </div>


                    <div className={styles.infoItem}>
                        <h3>Faixa de Preço</h3>
                        <p>{cursinho?.faixa_preco === 'baixa' ? "Até R$ 500,00" : cursinho?.faixa_preco === 'media' ? "R$ 500,00 - R$ 1.500,00" : cursinho?.faixa_preco === "alta" ? "Acima de R$ 1.500,00" : "Gratuito"}</p>
                    </div>

                    <div className={styles.infoItem}>
                        <h3>Bolsa de Estudos</h3>
                        <p>{cursinho?.tem_bolsa ? 'Sim' : 'Não'}</p>
                    </div>

                    <div className={styles.infoItem}>
                        <h3>Inscrição por Programa Público</h3>
                        <p>{cursinho?.aceita_programas_publico ? 'Sim' : 'Não'}</p>
                    </div>

                </div>

                {/* Space Gallery */}
                <div className={styles.spaceSection}>
                    <h2>Conheça Nosso Espaço</h2>
                    <div className={styles.sliderContainer}>
                        <div className={styles.slider}>
                            {cursinho?.imagens_espaco.map((image, index) => (
                                <div
                                    key={index}
                                    className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
                                >
                                    <img
                                        src={image}
                                        className={styles.slideImage}
                                    />
                                </div>
                            ))}
                        </div>
                        {(Number(cursinho?.imagens_espaco.length)) > 1 && (
                            <div className={styles.sliderControls}>
                                {cursinho?.imagens_espaco.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`${styles.sliderDot} ${index === currentSlide ? styles.active : ''}`}
                                        onClick={() => goToSlide(index)}
                                        aria-label={`Ir para imagem ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}

                    </div>
                </div>

                <div className={styles.calendarSection}>
                    <h2>Calendário de Eventos do {cursinho?.nome}</h2>

                    <DemoWrapper
                        isEditable={false}
                        eventos={events}
                        popUpClick={() => setIsVisible(true)}
                        popupFilterClick={() => setPopupVisible(true)}
                        onDateClick={(day, month, year) => {
                            setIsClose(true)
                            setPersonalEventsData(prev => ({
                                ...prev,
                                day: String(day),
                                month: String(month),
                                year: String(year),
                            }))
                        }}
                    />

                </div>




                {/* Comments Section */}
                <div className={styles.commentsSection}>
                    <h2>Avaliações dos Alunos</h2>

                    <div className={styles.commentForm}>
                        <h3>Deixe sua avaliação</h3>
                        <form onSubmit={handleSubmitComment}>
                            <div className={styles.ratingInput}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={`${styles.star} ${star <= (hoverRating || userRating) ? styles.filled : ''}`}
                                        onClick={() => setUserRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Conte sua experiência com o cursinho..."
                                required
                            />
                            <button type="submit">Enviar Avaliação</button>
                        </form>
                    </div>

                    <div className={styles.commentsList}>
                        {cursinho?.avaliacoes
                            .filter(comment => comment.id_user !== null)
                            .map((comment, i) => (
                                <div key={i} className={styles.commentCard}>
                                    <div className={styles.commentHeader}>
                                        <img className={styles.avatar} src={comment.pfp} alt="" />
                                        <span className={styles.author}>{comment.name}</span>
                                        <div className={styles.rating}>
                                            {[...Array(comment.stars)].map((_, j) => (
                                                <span key={j} className={j < comment.stars ? styles.filled : ''}>★</span>
                                            ))}
                                        </div>
                                        <span className={styles.date}>
                                            {comment.created_at}
                                        </span>
                                    </div>
                                    <p className={styles.commentText}>{comment.content}</p>
                                </div>
                            ))}

                    </div>
                </div>
            </div>
        </>
    );
}


