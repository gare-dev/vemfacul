// pages/index.tsx
import React, { useState } from 'react';
import Header from '@/components/Header';
import OpinionBox from '@/components/OpinionBox';
import FeatureCard from '@/components/FeatureCard';
import Footer from '@/components/Footer';

import { FaChalkboardTeacher, FaUsers, FaSearch } from 'react-icons/fa';

import styles from '@/styles/landingpage.module.scss';
import { GetServerSideProps } from 'next';
import Api from '@/api';
import ProductCard from '@/components/CursinhoCard';
import DemoWrapper from '@/hooks/DemoWrapper';
import PopupType from '@/types/data';
import Popup from '@/components/Popup';
import PopupFilter from '@/components/PopupFilter';
import { FiltrosType } from '@/types/filtrosType';

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

export default function Home({ CourseCard, Events }: Props) {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [popupVisible, setPopupVisible] = useState<boolean>(false)
  const [events, setEvents] = useState<PopupType[]>(Events)
  const [originalEvents,
    // setOriginalEvents
  ] = useState<PopupType[]>(Events)
  const [filtroEventos, setFiltroEventos] = useState<FiltrosType[]>([{
    tipoDeEvento: [],
    tipodeCursinho: []
  }]);

  function getFilter() {
    if (
      filtroEventos[0].tipoDeEvento.length === 0 &&
      filtroEventos[0].tipodeCursinho.length === 0
    ) {
      setPopupVisible(false);
      console.log("VOLTOU")
      return setEvents(originalEvents);
    }

    const retorno = originalEvents.filter((dado) => {
      return filtroEventos.some((f) => {
        const tipoOk = f.tipoDeEvento.length === 0 || f.tipoDeEvento.includes(dado.type);
        const cursinhoOk = f.tipodeCursinho.length === 0 || f.tipodeCursinho.includes(dado.cursinho?.toLowerCase());
        return tipoOk && cursinhoOk;
      });
    });

    setPopupVisible(false);
    setEvents(retorno);
  }


  return (
    <>
      <Header />
      <Popup
        canAdd={false}
        isVisible={isVisible}
        setIsVisible={() => setIsVisible(false)}
        canRemove={false}
        canEdit={false}
      />
      <PopupFilter
        setFiltroEventos={setFiltroEventos}
        filtroEventos={filtroEventos}
        isVisible={popupVisible}
        callFilter={() => getFilter()}
      />

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.slogan}>O seu sonho começa com a aprovação!</h1>
        </section>

        <section className={styles.opinionsSection}>
          <h2 style={{ color: "#778CFE" }}>O que dizem sobre o VemFacul</h2>
          <div className={styles.opinions}>
            <OpinionBox
              name="Ana Silva"
              role="Estudante"
              opinion="A plataforma me ajudou a encontrar o cursinho ideal para minha preparação!"
            />
            <OpinionBox
              name="Carlos Souza"
              role="Professor"
              opinion="Excelente ferramenta para conectar cursinhos e estudantes."
            />
            <OpinionBox
              name="Mariana Lima"
              role="Estudante"
              opinion="Simples, intuitiva e muito útil para organizar meus estudos."
            />
          </div>
        </section>

        <section className={styles.featuresSection}>
          <h2>Funcionalidades</h2>
          <div className={styles.features}>
            <FeatureCard
              icon={<FaSearch />}
              title="Busca Avançada"
              description="Encontre cursinhos com filtros detalhados para sua necessidade."
            />
            <FeatureCard
              icon={<FaUsers />}
              title="Comunidade"
              description="Conecte-se com outros estudantes e compartilhe experiências."
            />
            <FeatureCard
              icon={<FaChalkboardTeacher />}
              title="Avaliações"
              description="Veja opiniões reais sobre os cursinhos para tomar a melhor decisão."
            />
          </div>
        </section>

        <section className={styles.cursinhosExample}>
          <h2>Principais Cursinhos</h2>
          <div className={styles.cursinhos}>
            {CourseCard?.map((course: CourseCard, i) => (
              <>
                <ProductCard imageUrl={course.logo} title={course.nome_exibido} location={course.uf} key={i} rating={+course.media_stars} />
              </>
            ))}
          </div>
        </section>

        <section className={styles.calendarioSection}>
          <h2>Eventos Dos Cursinhos</h2>
          <div className={styles.calendario}>
            <DemoWrapper
              isEditable={false}
              eventos={events}
              popUpClick={() => setIsVisible(true)}
              popupFilterClick={() => setPopupVisible(true)} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

