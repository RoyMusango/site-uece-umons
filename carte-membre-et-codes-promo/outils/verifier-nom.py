#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
verifier-nom.py — compare le nom saisi a l'achat avec le titulaire de la carte,
et reecrit le nom proprement pour le billet.

C'est la reference : la regle decrite ici est celle que Make doit appliquer.
Le script sert a la tester, a trancher un cas litigieux, et a montrer au
comite ce qui est accepte ou refuse.

USAGE

    python outils/verifier-nom.py "Ebwelle" "Roy" "roy ebwelle"
    python outils/verifier-nom.py --tests        (batterie de cas, doit tout passer)

CE QUI EST ACCEPTE SANS DISCUSSION
    la casse           roy ebwelle        = Roy Ebwelle
    les accents        Lea Haddad         = Léa Haddad
    l'ordre            Ebwelle Roy        = Roy Ebwelle
    les traits d'union Jean Luc Mbala     = Jean-Luc Mbala
    un prenom en moins Chiamaka Okonkwo   = Chiamaka Grace Okonkwo
    un prenom en plus  Roy Junior Ebwelle = Roy Ebwelle
    les espaces en trop

CE QUI PART EN VERIFICATION MANUELLE (verdict "proche")
    une faute de frappe : Ebwele, Ebwellle...

CE QUI EST REFUSE (verdict "different")
    un autre nom de famille, ou aucun prenom en commun.

LE NOM IMPRIME SUR LE BILLET n'est jamais celui que l'acheteur a tape :
c'est celui du registre, recapitalise proprement. C'est le registre qui
fait foi, pas la saisie.
"""

import argparse
import re
import sys
import unicodedata

# Particules : presentes dans un nom, mais jamais exigees pour valider une
# correspondance (on ecrit aussi bien "Van Der Berg" que "vanderberg").
PARTICULES = {
    "de", "du", "des", "la", "le", "les", "van", "von", "der", "den", "ter",
    "da", "do", "dos", "das", "di", "del", "della", "el", "al", "ould", "af",
}


# ---------------------------------------------------------------------------
# Normalisation
# ---------------------------------------------------------------------------
def normaliser(texte):
    """minuscules, sans accents, sans ponctuation, espaces tasses."""
    if not texte:
        return ""
    texte = unicodedata.normalize("NFD", str(texte))
    texte = "".join(c for c in texte if unicodedata.category(c) != "Mn")
    texte = texte.lower()
    for signe in "-–—'’.,_/\\":
        texte = texte.replace(signe, " ")
    return " ".join(texte.split())


def mots(texte):
    return [m for m in normaliser(texte).split(" ") if m]


def mots_utiles(texte):
    """Les mots qui comptent : ni particules, ni initiales isolees."""
    return [m for m in mots(texte) if m not in PARTICULES and len(m) > 1]


# ---------------------------------------------------------------------------
# Distance de Levenshtein (tolerance aux fautes de frappe)
# ---------------------------------------------------------------------------
def distance(a, b):
    if a == b:
        return 0
    if not a or not b:
        return max(len(a), len(b))
    precedente = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        courante = [i]
        for j, cb in enumerate(b, 1):
            courante.append(min(precedente[j] + 1,        # suppression
                                courante[j - 1] + 1,      # insertion
                                precedente[j - 1] + (ca != cb)))  # substitution
        precedente = courante
    return precedente[-1]


def tolerance(mot):
    """Fautes admises selon la longueur du mot."""
    if len(mot) >= 8:
        return 2
    if len(mot) >= 5:
        return 1
    return 0


def present(mot, candidats, approximatif=False):
    if mot in candidats:
        return True
    if not approximatif:
        return False
    return any(distance(mot, autre) <= max(tolerance(mot), tolerance(autre))
               for autre in candidats)


# ---------------------------------------------------------------------------
# Recapitalisation : "roy ebwelle" -> "Roy Ebwelle", "jean-luc" -> "Jean-Luc"
# ---------------------------------------------------------------------------
def _capitaliser_mot(mot):
    """Majuscule a chaque bloc de lettres : jean-luc -> Jean-Luc, d'angelo -> D'Angelo."""
    return re.sub(r"[^\W\d_]+",
                  lambda m: m.group(0)[0].upper() + m.group(0)[1:].lower(),
                  mot, flags=re.UNICODE)


def capitaliser(texte):
    """Respecte traits d'union et apostrophes ; laisse les particules en bas de casse."""
    sortie = []
    for rang, mot in enumerate(str(texte or "").split()):
        if rang > 0 and normaliser(mot) in PARTICULES:
            sortie.append(normaliser(mot))          # ... van der Berg, ... de Souza
        else:
            sortie.append(_capitaliser_mot(mot))
    return " ".join(sortie)


def nom_pour_billet(nom, prenoms):
    """Le nom tel qu'il doit etre imprime : d'apres le REGISTRE, pas la saisie."""
    return capitaliser(" ".join(p for p in (str(prenoms or "").strip(),
                                            str(nom or "").strip()) if p))


def nom_formel(nom, prenoms):
    """Variante administrative : EBWELLE Roy."""
    return " ".join(p for p in (capitaliser(nom).upper(), capitaliser(prenoms)) if p)


# ---------------------------------------------------------------------------
# La comparaison
# ---------------------------------------------------------------------------
def comparer(nom, prenoms, saisi):
    """
    Retourne (verdict, nom_pour_le_billet, explication).

    verdict :
        identique  - meme chaine, aux accents/casse/espaces pres
        equivalent - meme personne (ordre, prenom en plus ou en moins, trait d'union)
        proche     - une faute de frappe pres : A VERIFIER PAR UN HUMAIN
        different  - ce n'est pas la meme personne : alerte
    """
    billet = nom_pour_billet(nom, prenoms)

    attendus_nom = mots_utiles(nom)
    attendus_prenoms = mots_utiles(prenoms)
    proposes = mots_utiles(saisi)

    if not proposes:
        return "different", billet, "aucun nom saisi"

    if normaliser(saisi) == normaliser("%s %s" % (prenoms, nom)) \
       or normaliser(saisi) == normaliser("%s %s" % (nom, prenoms)):
        return "identique", billet, "correspondance exacte"

    def evaluer(approx):
        nom_ok = all(present(m, proposes, approx) for m in attendus_nom) if attendus_nom else False
        prenom_ok = (not attendus_prenoms) or \
            any(present(m, proposes, approx) for m in attendus_prenoms)
        return nom_ok, prenom_ok

    nom_ok, prenom_ok = evaluer(False)
    if nom_ok and prenom_ok:
        return "equivalent", billet, "meme personne (ordre, casse, accents ou prenom intermediaire)"

    nom_proche, prenom_proche = evaluer(True)
    if nom_proche and prenom_proche:
        return "proche", billet, "correspondance a une faute de frappe pres — a verifier"

    if not nom_proche:
        manquant = ", ".join(m for m in attendus_nom if not present(m, proposes, True))
        return "different", billet, "nom de famille absent de la saisie : %s" % (manquant or "?")
    return "different", billet, "aucun prenom du titulaire dans la saisie"


# ---------------------------------------------------------------------------
# Batterie de tests
# ---------------------------------------------------------------------------
CAS = [
    # (nom, prenoms, saisi, verdict attendu)
    ("Ebwelle", "Roy", "roy ebwelle", "identique"),
    ("Ebwelle", "Roy", "Roy Ebwelle", "identique"),
    ("Ebwelle", "Roy", "ROY EBWELLE", "identique"),
    ("Ebwelle", "Roy", "Ebwelle Roy", "identique"),
    ("Ebwelle", "Roy", "  roy   ebwelle  ", "identique"),
    ("Ebwelle", "Roy", "Roy Junior Ebwelle", "equivalent"),
    ("Ebwelle", "Roy", "ebwelle, roy", "identique"),
    ("Ebwelle", "Roy", "Ebwele Roy", "proche"),
    ("Ebwelle", "Roy", "Roy Ebwellle", "proche"),
    ("Ebwelle", "Roy", "Jean Dupont", "different"),
    ("Ebwelle", "Roy", "Roy Mbala", "different"),
    ("Haddad", "Léa", "lea haddad", "identique"),
    ("Haddad", "Léa", "Léa Haddad", "identique"),
    ("Okonkwo", "Chiamaka Grace", "Chiamaka Okonkwo", "equivalent"),
    ("Okonkwo", "Chiamaka Grace", "okonkwo chiamaka grace", "identique"),
    ("Okonkwo", "Chiamaka Grace", "Grace Okonkwo", "equivalent"),
    ("Mbala Kanza", "Joseph Aimé", "joseph aime mbala kanza", "identique"),
    ("Mbala Kanza", "Joseph Aimé", "Joseph Mbala Kanza", "equivalent"),
    ("Mbala Kanza", "Joseph Aimé", "Joseph Mbala", "different"),
    ("Ben Salah", "Yasmine", "yasmine ben salah", "identique"),
    ("Ben Salah", "Yasmine", "Yasmine BenSalah", "different"),
    ("Nguyen", "Minh Anh", "minh anh nguyen", "identique"),
    ("Van Der Berg", "Pieter", "pieter van der berg", "identique"),
    ("Van Der Berg", "Pieter", "Pieter Vanderberg", "different"),
    ("Dupont-Martin", "Jean-Luc", "jean luc dupont martin", "identique"),
    ("Dupont-Martin", "Jean-Luc", "Jean-Luc Dupont-Martin", "identique"),
]

CAPITALISATION = [
    (("ebwelle", "roy"), "Roy Ebwelle"),
    (("EBWELLE", "ROY"), "Roy Ebwelle"),
    (("dupont-martin", "jean-luc"), "Jean-Luc Dupont-Martin"),
    (("van der berg", "pieter"), "Pieter van der Berg"),
    (("d'angelo", "maria"), "Maria D'Angelo"),
    (("okonkwo", "chiamaka grace"), "Chiamaka Grace Okonkwo"),
]


def lancer_tests():
    echecs = 0
    for nom, prenoms, saisi, attendu in CAS:
        verdict, billet, pourquoi = comparer(nom, prenoms, saisi)
        ok = verdict == attendu
        echecs += not ok
        print("%s  %-26s -> %-10s (attendu %-10s)  billet : %s"
              % ("ok " if ok else "ECHEC", saisi, verdict, attendu, billet))
        if not ok:
            print("        motif :", pourquoi)

    print()
    for (nom, prenoms), attendu in CAPITALISATION:
        obtenu = nom_pour_billet(nom, prenoms)
        ok = obtenu == attendu
        echecs += not ok
        print("%s  %-22s -> %-26s (attendu %s)"
              % ("ok " if ok else "ECHEC", "%s / %s" % (prenoms, nom), obtenu, attendu))

    print()
    if echecs:
        print("%d test(s) en echec." % echecs)
    else:
        print("Tous les tests passent (%d cas)." % (len(CAS) + len(CAPITALISATION)))
    return 1 if echecs else 0


def main():
    ap = argparse.ArgumentParser(description="Compare un nom saisi au titulaire de la carte.")
    ap.add_argument("nom", nargs="?", help="nom de famille du registre")
    ap.add_argument("prenoms", nargs="?", help="prenom(s) du registre")
    ap.add_argument("saisi", nargs="?", help="nom tape par l'acheteur sur la page de paiement")
    ap.add_argument("--tests", action="store_true", help="lancer la batterie de tests")
    args = ap.parse_args()

    if args.tests:
        sys.exit(lancer_tests())
    if not (args.nom and args.prenoms and args.saisi):
        ap.print_help()
        sys.exit(2)

    verdict, billet, pourquoi = comparer(args.nom, args.prenoms, args.saisi)
    suite = {
        "identique":  "Billet envoye automatiquement.",
        "equivalent": "Billet envoye automatiquement.",
        "proche":     "Billet retenu : un membre du comite doit trancher.",
        "different":  "Billet retenu et alerte au comite.",
    }[verdict]
    print("verdict        : %s (%s)" % (verdict, pourquoi))
    print("nom du billet  : %s" % billet)
    print("nom formel     : %s" % nom_formel(args.nom, args.prenoms))
    print("consequence    : %s" % suite)


if __name__ == "__main__":
    main()
