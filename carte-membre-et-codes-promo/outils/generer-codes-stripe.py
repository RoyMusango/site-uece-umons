#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generer-codes-stripe.py — cree UN code promo personnel, a usage unique, par membre.

A EXECUTER SUR L'ORDINATEUR DE ROY UNIQUEMENT.
La cle secrete Stripe se passe par variable d'environnement : elle ne doit
JAMAIS se retrouver dans le depot Git, ni dans un fichier, ni dans un commit.

    Windows (PowerShell) :   $env:STRIPE_SECRET_KEY = "sk_test_..."
    macOS / Linux :          export STRIPE_SECRET_KEY="sk_test_..."

USAGE — d'abord a blanc (aucun appel a Stripe), pour verifier ce qui sera cree :

    python outils/generer-codes-stripe.py membres.csv --coupon promo_membre_2026

puis pour de vrai :

    python outils/generer-codes-stripe.py membres.csv --coupon promo_membre_2026 --reel

Le script ecrit "membres-avec-codes.csv" : le meme registre, colonnes "code",
"code_stripe_id" et "statut_code" remplies. C'est ce fichier qu'on recolle
dans le Google Sheet.

Ce qui garantit l'usage unique, cote Stripe :
    max_redemptions = 1     -> le code meurt apres une commande
    expires_at              -> il meurt aussi a la fin de l'annee academique
    metadata[numero_membre] -> on sait toujours a qui appartient un code

Aucune dependance : uniquement la bibliotheque standard de Python.
"""

import argparse
import csv
import datetime
import json
import os
import secrets
import sys
import urllib.error
import urllib.parse
import urllib.request

API = "https://api.stripe.com/v1"

# Alphabet sans caracteres ambigus (pas de 0/O, 1/I/L, 5/S, 8/B) :
# un code doit pouvoir etre lu sur une carte imprimee et retape sans erreur.
ALPHABET = "ACDEFGHJKMNPQRTUVWXY2346790"


def creer_code(prefixe, longueur=5):
    return "%s-%s" % (prefixe, "".join(secrets.choice(ALPHABET) for _ in range(longueur)))


def appel_stripe(cle, chemin, donnees):
    corps = urllib.parse.urlencode(donnees, doseq=True).encode()
    requete = urllib.request.Request(
        API + chemin, data=corps,
        headers={"Authorization": "Bearer " + cle,
                 "Content-Type": "application/x-www-form-urlencoded"})
    try:
        with urllib.request.urlopen(requete, timeout=30) as reponse:
            return json.load(reponse)
    except urllib.error.HTTPError as err:
        detail = json.load(err)
        raise SystemExit("Stripe a refuse : %s" %
                         detail.get("error", {}).get("message", detail))


def main():
    ap = argparse.ArgumentParser(description="Cree un code promo Stripe par membre.")
    ap.add_argument("registre", help="CSV du registre des membres")
    ap.add_argument("--coupon", required=True,
                    help="identifiant du coupon Stripe deja cree dans le tableau de bord "
                         "(c'est LUI qui porte le pourcentage de reduction)")
    ap.add_argument("--prefixe", default="UECE26", help="prefixe des codes (defaut : UECE26)")
    ap.add_argument("--expire", default=None,
                    help="date de fin de validite, AAAA-MM-JJ (defaut : 30 septembre prochain)")
    ap.add_argument("--sortie", default="membres-avec-codes.csv")
    ap.add_argument("--reel", action="store_true",
                    help="cree reellement les codes chez Stripe (sans ce drapeau : essai a blanc)")
    args = ap.parse_args()

    cle = os.environ.get("STRIPE_SECRET_KEY", "").strip()
    if args.reel and not cle:
        sys.exit("Variable STRIPE_SECRET_KEY absente. Voir l'aide en tete de ce fichier.")
    if args.reel and cle.startswith("sk_live_"):
        reponse = input("Cle de PRODUCTION detectee : les codes seront reels. Taper OUI : ")
        if reponse.strip() != "OUI":
            sys.exit("Annule.")

    if args.expire:
        fin = datetime.datetime.strptime(args.expire, "%Y-%m-%d")
    else:
        today = datetime.date.today()
        annee = today.year if today <= datetime.date(today.year, 9, 30) else today.year + 1
        fin = datetime.datetime(annee, 9, 30, 23, 59)
    expire_at = int(fin.timestamp())

    with open(args.registre, encoding="utf-8-sig", newline="") as f:
        lecteur = csv.DictReader(f)
        colonnes = lecteur.fieldnames or []
        lignes = list(lecteur)
    for obligatoire in ("code", "code_stripe_id", "statut_code"):
        if obligatoire not in colonnes:
            colonnes.append(obligatoire)

    deja = {(l.get("code") or "").strip() for l in lignes if (l.get("code") or "").strip()}
    crees, sautes = 0, 0

    for ligne in lignes:
        numero = (ligne.get("numero") or "").strip()
        statut_cotisation = (ligne.get("statut_cotisation") or "").strip().lower()

        if (ligne.get("code") or "").strip():
            sautes += 1
            continue                                  # ce membre a deja son code
        if statut_cotisation not in ("payee", "payée"):
            print("  saute %s : cotisation %s" % (numero, statut_cotisation or "inconnue"))
            sautes += 1
            continue

        code = creer_code(args.prefixe)
        while code in deja:
            code = creer_code(args.prefixe)
        deja.add(code)

        donnees = {
            "coupon": args.coupon,
            "code": code,
            "max_redemptions": 1,                     # <= LE verrou "une seule commande"
            "expires_at": expire_at,
            "active": "true",
            "metadata[numero_membre]": numero,
            "metadata[titulaire]": "%s %s" % (ligne.get("prenoms", ""), ligne.get("nom", "")),
            "metadata[email]": ligne.get("email", ""),
        }

        if args.reel:
            resultat = appel_stripe(cle, "/promotion_codes", donnees)
            ligne["code_stripe_id"] = resultat["id"]
        else:
            ligne["code_stripe_id"] = "(essai a blanc)"
        ligne["code"] = code
        ligne["statut_code"] = "actif"
        crees += 1
        print("  %s -> %s" % (numero, code))

    with open(args.sortie, "w", encoding="utf-8-sig", newline="") as f:
        ecrivain = csv.DictWriter(f, fieldnames=colonnes)
        ecrivain.writeheader()
        ecrivain.writerows(lignes)

    print("\n%d code(s) %s, %d ligne(s) inchangee(s)." %
          (crees, "crees chez Stripe" if args.reel else "prepares (ESSAI A BLANC)", sautes))
    print("Validite jusqu'au %s." % fin.strftime("%d/%m/%Y"))
    print("Registre ecrit dans :", args.sortie)
    if not args.reel:
        print("\nRien n'a ete envoye a Stripe. Relancez avec --reel quand tout vous convient.")


if __name__ == "__main__":
    main()
