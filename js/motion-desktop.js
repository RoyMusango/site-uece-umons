/* ==========================================================================
   motion-desktop.js — Palier 2 : spectacle desktop (GSAP + ScrollTrigger)

   Module ES chargé en import() dynamique par motion-gate.js, uniquement si
   html.motion-rich (desktop ≥1024px, pointer:fine, pas de reduced-motion,
   pas de saveData, deviceMemory ≥ 4). Ne jamais le référencer dans le HTML.

   C'est ici que s'implémentera le « wow » desktop de la Phase 2 (blocs 2 et
   4 du plan de tâches) : séquence hero GSAP, parallax curseur multi-couches,
   halo suiveur… Règles : transform/opacity uniquement, couches décoratives
   en pointer-events:none, un seul écouteur mousemove global throttlé par rAF,
   et JAMAIS d'effet sur ou autour du bouton PayPal.
   ========================================================================== */
export function init(gsap, ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    /* Squelette volontairement vide : le spectacle desktop (T2.4, bloc 4)
       s'implémente ici, avec gsap et ScrollTrigger déjà prêts. */
}
