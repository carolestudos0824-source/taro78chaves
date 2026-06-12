import { ARQUITETURA_MENORES_LESSONS } from "@/content/lessons/arquitetura-menores";
import GenericLessonPage from "./GenericLessonPage";

const ArquiteturaMenoresLessonPage = () => (
  <GenericLessonPage
    lessons={ARQUITETURA_MENORES_LESSONS}
    getLessonByOrder={(order) => ARQUITETURA_MENORES_LESSONS.find(l => l.order === order)}
    moduleRoute="/arquitetura-menores"
    moduleName="Arquitetura dos Menores"
    moduleId="arquitetura-menores"
    categoryLabel="Arcanos Menores"
    themeAccent="36 38% 48%"
    moduleSlug="arquitetura-menores"
  />
);

export default ArquiteturaMenoresLessonPage;
