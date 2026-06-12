import { ARQUITETURA_MENORES_LESSONS } from "@/content/lessons/arquitetura-menores";
import GenericModulePage from "./GenericModulePage";

const ArquiteturaMenoresPage = () => (
  <GenericModulePage
    moduleTitle="Arquitetura dos Menores"
    moduleSubtitle="O Mapa dos 56"
    moduleIcon="🗺"
    categoryLabel="Arcanos Menores"
    editorialIntro="Antes de mergulhar em cada carta, compreenda o sistema que as organiza — naipes, números e a lógica simbólica que dá sentido ao cotidiano do Tarô."
    themeAccent="36 38% 48%"
    lessons={ARQUITETURA_MENORES_LESSONS}
    lessonRoutePrefix="/arquitetura-menores"
    moduleSlug="arquitetura-menores"
    backRoute="/app"
  />
);

export default ArquiteturaMenoresPage;
