'use client';

/* ==========================================================================
   Comportements.jsx — tout le JavaScript « décor » du site, par paliers
   (CONTEXTE_REPRISE §5). Remplace motion-gate.js, reveals.js et
   carrousels.js de l'ancien site statique.

   Palier 0 (sans JS)  : aucune classe posée, tout le contenu est visible.
   Palier 1+2          : html.motion-on = pas de reduced-motion ni saveData
                         → révélations au scroll (IntersectionObserver).
   Palier 2 (desktop)  : html.motion-rich = motion-on + ≥1024px +
                         pointer:fine + deviceMemory ≥ 4 → GSAP + ScrollTrigger
                         chargés à la demande (lib/motion-desktop.js).

   Next.js change de page sans recharger : les effets liés au contenu
   (révélations, carrousels, décor desktop) sont relancés à chaque page.
   ========================================================================== */
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

function mouvementReduit() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* Révélations au scroll des [data-reveal] (ex-reveals.js). */
function lancerRevelations() {
    if (!document.documentElement.classList.contains('motion-on')) return undefined;

    const els = Array.from(document.querySelectorAll('[data-reveal]'));
    els.forEach((el) => {
        const d = parseFloat(el.getAttribute('data-reveal'));
        if (d) el.style.transitionDelay = d + 's';
    });

    /* Déjà dans l'écran : révélés tout de suite (aucun flash, LCP intact). */
    const vh = window.innerHeight;
    const enAttente = els.filter((el) => {
        if (el.getBoundingClientRect().top < vh) {
            el.classList.add('is-in');
            return false;
        }
        return true;
    });
    if (!enAttente.length) return undefined;

    if (!('IntersectionObserver' in window)) {
        enAttente.forEach((el) => el.classList.add('is-in'));
        return undefined;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-in');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    enAttente.forEach((el) => io.observe(el));
    return () => io.disconnect();
}

/* Carrousels [data-carrousel-auto] : 6 s, pause au survol, jamais
   d'auto-défilement en reduced-motion (ex-carrousels.js). */
function lancerCarrousels() {
    const bs = window.bootstrap;
    if (!bs || !bs.Carousel) return undefined;
    const reduit = mouvementReduit();
    const instances = Array.from(document.querySelectorAll('[data-carrousel-auto]')).map((el) =>
        reduit
            ? bs.Carousel.getOrCreateInstance(el, { ride: false, interval: false })
            : bs.Carousel.getOrCreateInstance(el, { ride: 'carousel', interval: 6000, pause: 'hover' })
    );
    return () => instances.forEach((c) => { try { c.dispose(); } catch { /* déjà retiré */ } });
}

/* Décor desktop (palier 2) : après load + un moment d'inactivité, jamais
   avant — le décor ne doit pas concurrencer le LCP. */
function lancerDecor() {
    let annule = false;
    let nettoyer = null;

    function charger() {
        Promise.all([
            import('gsap'),
            import('gsap/ScrollTrigger'),
            import('../lib/motion-desktop'),
        ]).then(([g, st, decor]) => {
            if (annule) return;
            nettoyer = decor.init(g.gsap || g.default, st.ScrollTrigger || st.default);
        }).catch(() => { /* décor uniquement : le site reste complet */ });
    }

    function auRepos() {
        document.body.classList.add('anim-ready');   /* rotations du motif */
        if (!document.documentElement.classList.contains('motion-rich')) return;
        if (window.requestIdleCallback) window.requestIdleCallback(charger, { timeout: 3000 });
        else setTimeout(charger, 1200);
    }

    if (document.readyState === 'complete') auRepos();
    else window.addEventListener('load', auRepos, { once: true });

    return () => {
        annule = true;
        window.removeEventListener('load', auRepos);
        if (nettoyer) nettoyer();
    };
}

export default function Comportements() {
    const chemin = usePathname();
    const [bootstrapPret, setBootstrapPret] = useState(false);

    /* Une seule fois : paliers de motion + navbar transparente → marine. */
    useEffect(() => {
        const html = document.documentElement;
        document.body.classList.add('js');

        const reduit = mouvementReduit();
        const saveData = !!(navigator.connection && navigator.connection.saveData);
        if (!reduit && !saveData) {
            html.classList.add('motion-on');
            const mem = navigator.deviceMemory;   /* non exposé (Firefox/Safari) = OK */
            const riche = window.matchMedia('(min-width: 1024px)').matches &&
                window.matchMedia('(pointer: fine)').matches &&
                (mem === undefined || mem >= 4);
            if (riche) html.classList.add('motion-rich');
        }

        const navbar = document.querySelector('.navbar');
        if (!navbar || !document.body.classList.contains('has-hero')) return undefined;
        const auScroll = () => navbar.classList.toggle('is-scrolled', window.scrollY > 40);
        auScroll();
        window.addEventListener('scroll', auScroll, { passive: true });
        return () => window.removeEventListener('scroll', auScroll);
    }, []);

    /* À chaque page : menu mobile refermé, révélations, décor desktop. */
    useEffect(() => {
        const menu = document.getElementById('navbarNav');
        if (menu && menu.classList.contains('show')) {
            menu.classList.remove('show');
            document.querySelector('.navbar-toggler')?.setAttribute('aria-expanded', 'false');
        }
        const finRevelations = lancerRevelations();
        const finDecor = lancerDecor();
        return () => {
            if (finRevelations) finRevelations();
            finDecor();
        };
    }, [chemin]);

    /* À chaque page, une fois Bootstrap chargé : carrousels. */
    useEffect(() => {
        if (!bootstrapPret) return undefined;
        return lancerCarrousels();
    }, [chemin, bootstrapPret]);

    return (
        <Script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
            strategy="afterInteractive"
            onReady={() => setBootstrapPret(true)}
        />
    );
}
