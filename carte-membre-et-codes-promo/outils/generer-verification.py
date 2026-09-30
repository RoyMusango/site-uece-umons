#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generer-verification.py — prepare la verification des cartes par QR code.

Il fait deux choses :

  1. il attribue un JETON a chaque membre en regle qui n'en a pas encore
     (colonne `jeton_verif` du registre) — c'est le secret imprime sur la
     carte, dans le QR ;
  2. il produit `verification/adhesions.json`, le fichier que consulte la page
     `verifier.html` quand on scanne une carte.

USAGE (depuis le dossier carte-membre-et-codes-promo/) :

    python outils/generer-verification.py membres.csv
    python outils/generer-verification.py membres.csv --annee "2025 — 2026"

Le registre est reecrit sur place (une copie .sauvegarde est gardee) et le
JSON est ecrit dans verification/.

CE QUE LE JSON CONTIENT — ET CE QU'IL NE CONTIENT PAS
-----------------------------------------------------
Il ne contient AUCUN nom, AUCUN numero, AUCUN email : uniquement l'empreinte
SHA-256 de "NUMERO-JETON" et la date d'echeance. Le fichier est public (le
site est statique), donc :

  * on ne peut pas y lire la liste des adherents ;
  * on ne peut pas fabriquer une carte valide sans connaitre un couple
    numero + jeton, qui n'existe que sur la carte elle-meme ;
  * retirer une ligne du JSON invalide la carte a la seconde ou le fichier
    est republie (carte perdue, cotisation impayee).

Aucune dependance : uniquement la bibliotheque standard de Python.
"""

import argparse
import csv
import datetime
import hashlib
import json
import os
import secrets
import shutil
import sys

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Meme alphabet que les codes promo : pas de 0/O, 1/I/L, 5/S, 8/B.
# Le jeton peut devoir etre retape a la main si le QR est abime.
ALPHABET = "ACDEFGHJKMNPQRTUVWXY2346790"

PAYEE = ("payee", "payée")


def nouveau_jeton(longueur=6):
    return "".join(secrets.choice(ALPHABET) for _ in range(longueur))


def empreinte(numero, jeton):
    """Doit donner exactement le meme resultat que la page verifier.html."""
    brut = ("%s-%s" % (numero.strip(), jeton.strip())).upper()
    return hashlib.sha256(brut.encode("utf-8")).hexdigest()[:16]


def echeance_par_defaut():
    """30 septembre de l'annee academique en cours."""
    today = datetime.date.today()
    annee = today.year if today <= datetime.date(today.year, 9, 30) else today.year + 1
    return "%d-09-30" % annee


def main():
    ap = argparse.ArgumentParser(
        description="Attribue les jetons et genere le fichier de verification.")
    ap.add_argument("registre", help="CSV du registre des membres")
    ap.add_argument("--annee", default=None,
                    help='annee academique affichee, ex. "2025 — 2026"')
    ap.add_argument("--echeance", default=None,
                    help="echeance par defaut, AAAA-MM-JJ (defaut : 30 septembre prochain)")
    ap.add_argument("--sortie", default=os.path.join("verification", "adhesions.json"))
    ap.add_argument("--sans-qualite", action="store_true",
                    help="ne pas publier la qualite (membre adherent / du bureau)")
    args = ap.parse_args()

    chemin = args.registre if os.path.isabs(args.registre) else os.path.join(RACINE, args.registre)
    if not os.path.exists(chemin):
        sys.exit("Registre introuvable : %s" % chemin)

    defaut = args.echeance or echeance_par_defaut()

    with open(chemin, encoding="utf-8-sig", newline="") as f:
        lecteur = csv.DictReader(f)
        colonnes = list(lecteur.fieldnames or [])
        lignes = list(lecteur)
    for obligatoire in ("jeton_verif", "echeance"):
        if obligatoire not in colonnes:
            colonnes.append(obligatoire)

    empreintes = {}
    nouveaux, publies, ecartes = 0, 0, []

    for ligne in lignes:
        numero = (ligne.get("numero") or "").strip()
        statut = (ligne.get("statut_cotisation") or "").strip().lower()
        if not numero:
            continue

        if statut not in PAYEE:
            # Cotisation non encaissee : le membre garde son jeton mais
            # n'est pas publie. Sa carte sera refusee a la verification.
            ecartes.append("%s (cotisation : %s)" % (numero, statut or "inconnue"))
            continue

        jeton = (ligne.get("jeton_verif") or "").strip()
        if not jeton:
            jeton = nouveau_jeton()
            ligne["jeton_verif"] = jeton
            nouveaux += 1

        echeance = (ligne.get("echeance") or "").strip() or defaut
        ligne["echeance"] = echeance

        fiche = {"e": echeance}
        qualite = (ligne.get("qualite") or "").strip()
        if qualite and not args.sans_qualite:
            fiche["q"] = qualite
        empreintes[empreinte(numero, jeton)] = fiche
        publies += 1

    # --- registre reecrit (avec sauvegarde) --------------------------------
    if nouveaux:
        shutil.copyfile(chemin, chemin + ".sauvegarde")
    with open(chemin, "w", encoding="utf-8-sig", newline="") as f:
        ecrivain = csv.DictWriter(f, fieldnames=colonnes)
        ecrivain.writeheader()
        ecrivain.writerows(lignes)

    # --- fichier public ----------------------------------------------------
    sortie = args.sortie if os.path.isabs(args.sortie) else os.path.join(RACINE, args.sortie)
    os.makedirs(os.path.dirname(sortie), exist_ok=True)
    donnees = {
        "genere_le": datetime.date.today().isoformat(),
        "annee": args.annee or "",
        "empreintes": empreintes,
    }
    with open(sortie, "w", encoding="utf-8") as f:
        json.dump(donnees, f, ensure_ascii=False, indent=1, sort_keys=True)

    print("%d jeton(s) attribue(s), %d adhesion(s) publiee(s)." % (nouveaux, publies))
    for motif in ecartes:
        print("  non publie :", motif)
    print("Echeance par defaut :", defaut)
    print("Fichier de verification :", sortie)
    print("\nA FAIRE ENSUITE : deposer verifier.html et adhesions.json a la racine du site,\n"
          "puis publier. Tant que le fichier n'est pas en ligne, les QR ne verifient rien.")


if __name__ == "__main__":
    main()
