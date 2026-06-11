1. **Restore and Integrate Journey Content**:
    *   I will modify `src/pages/FoolsJourneyPage.tsx` to integrate the narrative texts for each of the 22 Major Arcana.
    *   The narrative text will be displayed alongside each arcano in the list, ensuring it's pedagogically rich as requested.
    *   I will use the `JourneyArcanoContent` from the content adapter, which already includes `textoNarrativo` and `papel`.

2. **Update UI in `src/pages/FoolsJourneyPage.tsx`**:
    *   Ensure the "Hero" section uses the integrated title ("A Jornada do Louco" or "Jornada dos Arcanos Maiores").
    *   Ensure the introduction narrative correctly explains the path of the 22 Arcana.
    *   Update the arcano cards within the list to show:
        *   Image of the card.
        *   Canonical number and name.
        *   The narrative/pedagogical text (`papel` + `textoNarrativo`).
        *   Status (locked/unlocked/completed).
        *   Action button (Start/Continue).

3. **Consolidate Navigation**:
    *   Update `src/components/BottomNav.tsx` to ensure the "Jornada" tab always points to `/jornada`.
    *   Update `src/pages/Index.tsx` (the current `/module/arcanos-maiores` portal) to provide a clear path to the integrated Journey, or keep it as the "Map/Academic" view while ensuring `/jornada` is the "Narrative" experience.
    *   Actually, the user wants `/jornada` to be the integrated experience and `BottomNav` to point to it.

4. **Preserve Logic and Data**:
    *   I will not delete any content or change the deck images.
    *   I will ensure keys (recompensa) are used instead of XP.
    *   I will maintain the current unlocking/progression logic.

5. **Technical Details**:
    *   Read `src/data/fools-journey.ts` to ensure all original narrative texts are available in the integrated page (the `useJourneyContent` hook should already provide them via the legacy repo fallback if not in DB).
    *   Adjust `src/pages/FoolsJourneyPage.tsx` to render these texts effectively for mobile (390px) and desktop.
    *   Ensure the division by phases (Atos) is preserved or enhanced.

---

### Technical Plan

- **File: `src/pages/FoolsJourneyPage.tsx`**
    - Update the arcano card rendering to include `arcano.papel` and `arcano.textoNarrativo`.
    - Add a "Start/Continue" button to each arcano if it's unlocked.
    - Improve the visual layout to make the texts highly legible.

- **File: `src/components/BottomNav.tsx`**
    - Verify that the "Jornada" item points to `/jornada`.

- **File: `src/pages/Index.tsx`**
    - Keep it as the "Arcanos Maiores" module portal, but ensure it links prominently to the "integrated narrative journey" at `/jornada`.

- **File: `src/App.tsx`**
    - Ensure `/jornada` and `/module/arcanos-maiores` routes are correctly set up.
