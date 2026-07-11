/* ==========================================================================
   motion-desktop.js — Palier 2 : spectacle desktop (fusion A+B validée)

   Module ES chargé en import() dynamique par motion-gate.js, uniquement si
   html.motion-rich (desktop ≥1024px, pointer:fine, pas de reduced-motion,
   pas de saveData, deviceMemory ≥ 4). Jamais référencé dans le HTML.

   Effets « Salle d'honneur » :
   - halo qui suit le curseur sur le hero (--mx/--my, lissage lerp .08) ;
   - parallax de l'arc monumental (--phx/--phy, ±24/±12 px) ;
   - inclinaison 3D ≤ 3° des éléments [data-tilt] (les deux affiches) ;
   - halo suiveur des sections sombres [data-glow] (--gx/--gy, T4.2) ;
   - hover magnétique ≤ 5 px des CTA [data-magnet] (T4.3).

   Règles : UN seul écouteur mousemove global, throttlé par rAF ; transform/
   opacity uniquement ; couches décoratives en pointer-events:none ; aucun
   effet sur ou autour du bouton PayPal (gala n'a aucun marqueur data-*).
   ========================================================================== */
export function init(gsap, ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    /* GSAP est effectivement là : les états "avant dessin" des
       séparateurs peuvent s'appliquer (cf. html.motion-gsap en CSS) */
    document.documentElement.classList.add('motion-gsap');

    /* Séparateurs signature : les filets se dessinent au scroll (T5.1) */
    gsap.utils.toArray('.separator-mains').forEach(function (el) {
        ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            once: true,
            onEnter: function () { el.classList.add('is-drawn'); }
        });
    });

    var hero = document.querySelector('.hero-section');
    var tilts = Array.prototype.slice.call(document.querySelectorAll('[data-tilt]'));
    var glows = Array.prototype.slice.call(document.querySelectorAll('[data-glow]'));
    var magnets = Array.prototype.slice.call(document.querySelectorAll('[data-magnet]'));
    if (!hero && !tilts.length && !glows.length && !magnets.length) { return; }

    var rawX = window.innerWidth / 2;    /* dernière position réelle du curseur */
    var rawY = window.innerHeight * 0.35;
    var mx = 0.5, my = 0.35;             /* position lissée (fractions du hero) */
    var seen = false;

    document.addEventListener('mousemove', function (e) {
        rawX = e.clientX;
        rawY = e.clientY;
        seen = true;
    }, { passive: true });

    tilts.forEach(function (el) { el._rx = 0; el._ry = 0; });
    glows.forEach(function (el) { el._gx = 0; el._gy = 0; el._gInit = false; });
    magnets.forEach(function (el) { el._mx = 0; el._my = 0; });

    function frame() {
        if (seen && hero) {
            var r = hero.getBoundingClientRect();
            var tx = Math.min(Math.max((rawX - r.left) / r.width, 0), 1);
            var ty = Math.min(Math.max((rawY - r.top) / r.height, 0), 1);
            mx += (tx - mx) * 0.08;
            my += (ty - my) * 0.08;
            hero.style.setProperty('--mx', (mx * 100).toFixed(2) + '%');
            hero.style.setProperty('--my', (my * 100).toFixed(2) + '%');
            hero.style.setProperty('--phx', ((mx - 0.5) * 24).toFixed(2) + 'px');
            hero.style.setProperty('--phy', ((my - 0.5) * 12).toFixed(2) + 'px');
        }

        tilts.forEach(function (el) {
            var b = el.getBoundingClientRect();
            var inside = seen &&
                rawX >= b.left && rawX <= b.right &&
                rawY >= b.top && rawY <= b.bottom;
            var gx = inside ? ((rawX - b.left) / b.width - 0.5) * 2 : 0;   /* -1..1 */
            var gy = inside ? ((rawY - b.top) / b.height - 0.5) * 2 : 0;
            el._ry += (gx * 3 - el._ry) * 0.12;     /* cible ≤ 3° */
            el._rx += (-gy * 3 - el._rx) * 0.12;
            if (Math.abs(el._rx) > 0.02 || Math.abs(el._ry) > 0.02) {
                el.style.transform = 'perspective(800px) rotateX(' + el._rx.toFixed(2) +
                                     'deg) rotateY(' + el._ry.toFixed(2) + 'deg)';
            } else if (el.style.transform) {
                el.style.transform = '';
            }
        });

        /* Halo des sections sombres : suit le curseur à l'intérieur de
           l'élément (l'opacité, elle, est gérée en CSS via :hover) */
        glows.forEach(function (el) {
            if (!seen) { return; }
            var b = el.getBoundingClientRect();
            if (rawX < b.left - 80 || rawX > b.right + 80 ||
                rawY < b.top - 80 || rawY > b.bottom + 80) { return; }
            var tx = rawX - b.left;
            var ty = rawY - b.top;
            if (!el._gInit) { el._gx = tx; el._gy = ty; el._gInit = true; }
            el._gx += (tx - el._gx) * 0.15;
            el._gy += (ty - el._gy) * 0.15;
            el.style.setProperty('--gx', el._gx.toFixed(1) + 'px');
            el.style.setProperty('--gy', el._gy.toFixed(1) + 'px');
        });

        /* Hover magnétique : le CTA glisse de ≤ 5 px vers le curseur
           quand il s'en approche, revient en place sinon */
        magnets.forEach(function (el) {
            var b = el.getBoundingClientRect();
            var cx2 = b.left + b.width / 2;
            var cy2 = b.top + b.height / 2;
            var dx = rawX - cx2;
            var dy = rawY - cy2;
            var near = seen && Math.abs(dx) < b.width / 2 + 56 &&
                              Math.abs(dy) < b.height / 2 + 56;
            var txm = near ? Math.max(-5, Math.min(5, dx * 0.08)) : 0;
            var tym = near ? Math.max(-5, Math.min(5, dy * 0.12)) : 0;
            el._mx += (txm - el._mx) * 0.18;
            el._my += (tym - el._my) * 0.18;
            if (Math.abs(el._mx) > 0.05 || Math.abs(el._my) > 0.05) {
                el.style.transform = 'translate(' + el._mx.toFixed(2) + 'px,' +
                                     el._my.toFixed(2) + 'px)';
            } else if (el.style.transform) {
                el.style.transform = '';
            }
        });

        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
}
