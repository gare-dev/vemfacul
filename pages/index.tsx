import React, { useState } from 'react';
import { Search, CheckCircle, Star, ArrowRight, Menu, X, Calendar, MapPin, Building2, ChevronDown, User } from 'lucide-react';
import styles from '@/styles/testeland.module.scss';
import CalendarComponent from "@/components/CalendarLanding";
import PopupRegistro from '@/components/PopupRegistro';
import useOpenPopup from '@/hooks/useOpenPopup';
import PopupType from '@/types/data';
import { GetServerSideProps } from 'next';
import Api from '@/api';
import { useRouter } from 'next/router';

interface CourseCard {
  nome_exibido: string
  uf: string
  logo: string
  media_stars: string
}

interface Props {
  CourseCard: CourseCard[]
  Events: PopupType[]

}
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    const [course_card, events] = await Promise.all([
      Api.getBestCourses(),
      Api.getEvents()
    ])

    return {
      props: {
        CourseCard: course_card.status === 200 ? course_card.data.data : null,
        Events: events.status === 200 ? events.data.data.map((evento: PopupType) => ({
          ...evento,
          created_at: evento.created_at ? (typeof evento.created_at === "string" ? evento.created_at : new Date(evento.created_at).toLocaleDateString()) : "Data não informada"
        })) : null
      }
    }
  } catch (error) {
    console.log("Erro ao buscar melhores cursos: " + error)

    return {
      props: {
        CourseCard: null,
        Events: null
      }
    }
  }
}

export default function LandingPage({ CourseCard, Events }: Props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isOpen, setIsOpen } = useOpenPopup();
  const [selectedOption, setSelectedOption] = useState<string>('Cadastro');
  const router = useRouter()

  return (
    <>
      {isOpen && (
        <PopupRegistro
          changeOption={(option) => setSelectedOption(option)}
          selectedOption={selectedOption}
          setSelectedOption={() => setSelectedOption(selectedOption)}
          setClose={() => setIsOpen(false)}
        />
      )}
      <div className={styles.container}>

        {/* Header */}
        <header className={styles.header}>
          <div className={styles.logo}>
            {/* Substitua o src pelo caminho real da sua logo */}
            <img src="/assets/img/logo_centro.png" alt="Logo AprovaBusca" className={styles.logoImg} />
            <span>VemFacul</span>
          </div>

          <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ''}`}>
            <a href="#eventos">Eventos</a>
            <a href="#destaques">Melhores Avaliados</a>
            <a href="#funcionalidades">Funcionalidades</a>
            <a href="#depoimentos">Depoimentos</a>

            <div className={styles.authButtons}>
              <button onClick={() => {
                setIsOpen(true);
                setSelectedOption('Entrar');
              }} className={styles.btnLogin}>Entrar</button>
              <div className={styles.registerDropdown}>
                <button
                  className={styles.btnRegister}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  Começar Agora
                  <ChevronDown size={16} style={{ marginLeft: '5px' }} />
                </button>

                {isDropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    <p onClick={() => {
                      setSelectedOption('Cadastro');
                      setIsOpen(true);
                      setIsDropdownOpen(false);
                    }} className={styles.dropdownItem}>
                      <User size={18} />
                      <span>Sou um Estudante</span>
                    </p>
                    <p onClick={() => { router.push('/cursinho/cadastro') }} className={styles.dropdownItem}>
                      <Building2 size={18} />
                      <span>Sou um Cursinho</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </nav>

          <button
            className={styles.mobileMenuBtn}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.badge}>O Futuro é Agora</span>
            <h1 className={styles.slogan}>
              O seu sonho começa com a <span className={styles.highlight}>aprovação</span>
            </h1>
            <p className={styles.subtext}>
              Conectamos estudantes dedicados aos melhores cursinhos preparatórios.
              A plataforma completa para sua jornada rumo à universidade.
            </p>

            <div className={styles.heroActions}>
              <button className={styles.ctaPrimary}>Sou Aluno</button>
              <button className={styles.ctaSecondary}>Sou Cursinho</button>
            </div>
          </div>

          <div className={styles.heroVisual}>

            <img src='/assets/img/8899760.jpg' className={styles.heroImage} />
          </div>
        </section>

        <section id="eventos" className={styles.calendarSection}>
          <div className={styles.calendarHeader}>
            <div className={styles.calendarIconWrapper}>
              <Calendar size={32} color="#fff" />
            </div>
            <div className={styles.calendarTexts}>
              <h2>Agenda dos Cursinhos</h2>
              <p>
                Fique por dentro! Estes são os <strong>eventos, aulões e simulados </strong>
                oferecidos pelos cursinhos parceiros para turbinar sua preparação.
              </p>
            </div>
          </div>

          <div className={styles.calendarContainer}>
            <div className={styles.calendarComponentPlaceholder}>
              <span><CalendarComponent events={Events} /></span>
            </div>
          </div>
        </section>

        <section id="destaques" className={styles.topRatedSection}>
          <h2>Destaques da Comunidade</h2>
          <p className={styles.sectionSubtitle}>Os cursinhos com as melhores avaliações dos alunos.</p>

          <div className={styles.cursinhoGrid}>
            {CourseCard.map((cursinho, i) => (
              <div key={i} className={styles.cursinhoCard}>
                <div className={styles.cursinhoHeader}>
                  <img src={cursinho.logo} alt={cursinho.nome_exibido} className={styles.cursinhoLogo} />
                  <div className={styles.ratingBadge}>
                    <Star size={14} fill="#FFD700" stroke="#FFD700" />
                    <span>{cursinho.media_stars.substring(0, 3)}</span>
                  </div>
                </div>
                <div className={styles.cursinhoInfo}>
                  <h3>{cursinho.nome_exibido}</h3>
                  <div className={styles.location}>
                    <MapPin size={16} />
                    <span>{cursinho.uf}</span>
                  </div>
                  <button onClick={() => {
                    setSelectedOption('Cadastro');
                    setIsOpen(true);
                  }} className={styles.btnDetails}>Ver detalhes</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Funcionalidades */}
        <section id="funcionalidades" className={styles.features}>
          <h2>Tudo o que você precisa</h2>
          <div className={styles.featureGrid}>
            <div className={styles.card}>
              <div className={styles.iconBox}><Search size={24} /></div>
              <h3>Busca Inteligente</h3>
              <p>Filtre cursinhos por localização, foco (MED, ITA, ENEM) e faixa de preço.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.iconBox}><Star size={24} /></div>
              <h3>Avaliações Reais</h3>
              <p>Leia opiniões verificadas de ex-alunos sobre a infraestrutura.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.iconBox}><CheckCircle size={24} /></div>
              <h3>Comunidade de Estudantes</h3>
              <p>Conecte-se com outros estudantes, compartilhe dicas e experiências.</p>
            </div>
          </div>
        </section>

        {/* Depoimentos */}
        <section id="depoimentos" className={styles.testimonials}>
          <div className={styles.contentWrapper}>
            <h2>O que os alunos dizem</h2>
            <div className={styles.testimonialsGrid}>
              <div className={styles.testimonialCard}>
                <p>&quot;Encontrei um cursinho focado em medicina que mudou minha rotina. A plataforma facilitou a comparação.&quot;</p>
                <div className={styles.author}>
                  <div className={styles.avatar}>LM</div>
                  <div>
                    <strong>Lucas M.</strong>
                    <span>Aprovado na USP</span>
                  </div>
                </div>
              </div>
              <div className={styles.testimonialCard}>
                <p>&quot;O layout limpo e as informações diretas me ajudaram a escolher sem perder tempo.&quot;</p>
                <div className={styles.author}>
                  <div className={styles.avatar}>BA</div>
                  <div>
                    <strong>Beatriz A.</strong>
                    <span>Estudante ENEM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.finalCta}>
          <h2>Pronto para começar?</h2>
          <p>Junte-se a milhares de estudantes rumo à universidade.</p>
          <button onClick={() => {
            setSelectedOption('Cadastro');
            setIsOpen(true);
          }} >Criar conta gratuita <ArrowRight size={20} /></button>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.logo}>
              <img src="/assets/img/logo_centro.png" alt="Logo VemFacul" className={styles.logoImgFooter} />
              <span>VemFacul</span>
            </div>
            <p>© 2024 VemFacul. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>
    </>

  );
}