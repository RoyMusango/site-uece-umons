// Liste des adhésions lue par la page /verifier (et gardée hors ligne en
// mode contrôle). Remplace l'ancien fichier public adhesions.json, mais en
// direct depuis Supabase : une carte retirée du registre devient invalide
// immédiatement.
//
// Elle ne contient AUCUNE donnée personnelle : seulement les empreintes des
// cartes (SHA-256 de « NUMERO-JETON », 16 caractères), leur date de fin de
// validité et l'année scolaire. Seules les cotisations « payee » y figurent.
import { supabaseServeur } from '../../../lib/supabase-serveur';

export const dynamic = 'force-dynamic';

// Une adhésion « 2026-2027 » est valable jusqu'au 30 septembre 2027.
function finDeValidite(anneeScolaire) {
    return anneeScolaire.split('-')[1] + '-09-30';
}

export async function GET() {
    try {
        const { data, error } = await supabaseServeur()
            .from('membres')
            .select('empreinte, annee_scolaire')
            .eq('statut_cotisation', 'payee')
            .not('empreinte', 'is', null);
        if (error) throw error;

        const empreintes = {};
        for (const m of data) {
            empreintes[m.empreinte] = { e: finDeValidite(m.annee_scolaire), a: m.annee_scolaire };
        }

        return Response.json(
            { empreintes, genere_le: new Date().toISOString().slice(0, 10) },
            { headers: { 'Cache-Control': 'no-store' } }
        );
    } catch (erreur) {
        console.error('api/adhesions :', erreur.message);
        // La page /verifier bascule alors sur sa copie hors ligne, si elle en a une.
        return Response.json({ erreur: 'Liste indisponible' }, { status: 503 });
    }
}
