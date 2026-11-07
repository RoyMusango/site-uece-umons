// Client Supabase côté SERVEUR uniquement (routes /api, pages serveur).
// Il utilise la clé secrète, qui contourne la sécurité RLS : ce fichier ne
// doit jamais être importé par un composant 'use client'.
// Variables : .env.local en local, réglages du projet sur Vercel.
import { createClient } from '@supabase/supabase-js';

export function supabaseServeur() {
    const url = process.env.SUPABASE_URL;
    const cle = process.env.SUPABASE_SECRET_KEY;
    if (!url || !cle) {
        throw new Error('SUPABASE_URL ou SUPABASE_SECRET_KEY manquante');
    }
    return createClient(url, cle, { auth: { persistSession: false } });
}
