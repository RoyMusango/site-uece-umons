/* ==========================================================================
   motion-desktop.js — Palier 2 : spectacle desktop (fusion A+B validée)

   Module ES chargé en import() dynamique par motion-gate.js, uniquement si
   html.motion-rich (desktop ≥1024px, pointer:fine, pas de reduced-motion,
   pas de saveData, deviceMemory ≥ 4). Jamais référencé dans le HTML.

   Effets « Salle d'honneur » :
   - halo qui suit le curseur sur le hero (--mx/--my, lissage lerp .08) ;
   - parallax de l'arc monumental (--phx/--phy, ±24/±12 px) ;
   - inclinaison 3D ≤ 3° des éléments [data-tilt] (les deux affiches).

   Règles : UN seul écouteur mousemove global, throttlé par rAF ; transform/
   opacity uniquement ; couches décoratives en pointer-events:none ; aucun
   effet sur ou autour du bouton PayPal (gala n'a aucun [data-tilt]).
   ========================================================================== */
export function init(gsap, ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    /* gsap/ScrollTrigger restent disponibles pour les blocs suivants
       (reveals enrichis T5.1) ; le moteur curseur ci-dessous est vanilla. */

    var hero = document.querySelector('.hero-section');
    var tilts = Array.prototype.slice.call(document.querySelectorAll('[data-tilt]'));
    if (!hero && !tilts.length) { return; }

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

        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
}
