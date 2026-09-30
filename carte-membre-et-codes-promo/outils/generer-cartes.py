#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generer-cartes.py — fabrique les cartes de membre en PDF, en serie, a partir du registre.

USAGE (depuis le dossier carte-membre-uece/) :

    python outils/generer-cartes.py membres-exemple.csv

    python outils/generer-cartes.py membres-exemple.csv --sortie cartes --bat
    python outils/generer-cartes.py membres-exemple.csv --seulement UECE-2026-0042

Ce que fait le script :
  1. il demarre un petit serveur web local (necessaire pour que les polices
     se chargent correctement dans Chrome) ;
  2. pour chaque ligne du CSV dont la cotisation est "payee", il ouvre
     modele-carte-membre.html avec les donnees du membre ;
  3. il imprime le resultat en PDF (2 pages : recto + verso) dans le dossier
     de sortie, sous le nom "UECE-2026-0042 - NOM Prenoms.pdf" ;
  4. si PyMuPDF est installe, il assemble aussi toutes les cartes dans un
     seul PDF "planche-imprimeur.pdf" a envoyer a l'imprimeur.

Aucune dependance obligatoire : seuls Python et Google Chrome sont necessaires.
"""

import argparse
import csv
import http.server
import os
import re
import shutil
import socket
import socketserver
import subprocess
import sys
import threading
import urllib.parse

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GABARIT = "modele-carte-membre.html"

# Colonnes du registre reprises telles quelles sur la carte.
CHAMPS = ["nom", "prenoms", "faculte", "qualite", "numero", "annee", "photo"]

# Mois en toutes lettres : le registre stocke des dates ISO (2026-09-30),
# la carte imprime "30 septembre 2026".
MOIS = ["janvier", "fevrier", "mars", "avril", "mai", "juin", "juillet",
        "août", "septembre", "octobre", "novembre", "décembre"]
MOIS[1] = "février"


def date_en_clair(iso):
    """2026-09-30 -> 30 septembre 2026. Tout autre format est laisse tel quel."""
    morceaux = (iso or "").strip().split("-")
    if len(morceaux) != 3:
        return (iso or "").strip()
    try:
        annee, mois, jour = int(morceaux[0]), int(morceaux[1]), int(morceaux[2])
        return "%d %s %d" % (jour, MOIS[mois - 1], annee)
    except (ValueError, IndexError):
        return iso.strip()


# --------------------------------------------------------------------------
# Chrome
# --------------------------------------------------------------------------
def trouver_chrome():
    """Repere Chrome (ou Edge) sur Windows, macOS et Linux."""
    pistes = [
        os.environ.get("CHROME"),
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser",
    ]
    for p in pistes:
        if p and os.path.exists(p):
            return p
    for nom in ("google-chrome", "chromium", "chrome", "msedge"):
        trouve = shutil.which(nom)
        if trouve:
            return trouve
    sys.exit("Google Chrome est introuvable. Installez-le, ou indiquez son chemin :\n"
             "    set CHROME=C:\\chemin\\vers\\chrome.exe   (Windows)")


# --------------------------------------------------------------------------
# Serveur local temporaire
# --------------------------------------------------------------------------
def demarrer_serveur(dossier):
    """Sert le dossier du gabarit sur un port libre, en tache de fond."""
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        port = s.getsockname()[1]

    class Handler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *a, **kw):
            super().__init__(*a, directory=dossier, **kw)

        def log_message(self, *a):        # silence
            pass

    serveur = socketserver.ThreadingTCPServer(("127.0.0.1", port), Handler)
    serveur.daemon_threads = True
    threading.Thread(target=serveur.serve_forever, daemon=True).start()
    return serveur, port


# --------------------------------------------------------------------------
# Fabrication
# --------------------------------------------------------------------------
def nom_de_fichier(ligne):
    brut = "%s - %s %s" % (ligne.get("numero", ""), ligne.get("nom", "").upper(),
                           ligne.get("prenoms", ""))
    brut = re.sub(r'[\\/:*?"<>|]', "-", brut).strip(" -")
    return (brut or "carte") + ".pdf"


def fabriquer(chrome, port, ligne, dossier_sortie, bat, base_verif, avec_code):
    params = {}
    for champ in CHAMPS:
        valeur = (ligne.get(champ) or "").strip()
        if valeur:
            params[champ] = valeur

    # date d'echeance -> mention "Valable jusqu'au ..." du recto
    echeance = (ligne.get("echeance") or ligne.get("validite") or "").strip()
    if echeance:
        params["validite"] = date_en_clair(echeance)

    # jeton de verification -> QR du verso
    jeton = (ligne.get("jeton_verif") or "").strip()
    if jeton:
        params["jeton"] = jeton
    if base_verif:
        params["base"] = base_verif

    # code avantage : imprime seulement si le comite le souhaite
    if avec_code:
        code = (ligne.get("code") or "").strip()
        if code:
            params["code"] = code
    else:
        params["code"] = ""

    if bat:
        params["bat"] = "1"

    url = "http://127.0.0.1:%d/%s?%s" % (port, GABARIT, urllib.parse.urlencode(params))
    sortie = os.path.join(dossier_sortie, nom_de_fichier(ligne))

    subprocess.run([chrome, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
                    "--virtual-time-budget=6000",
                    "--print-to-pdf=" + sortie, url],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return sortie


def assembler(fichiers, destination):
    """Regroupe toutes les cartes dans un seul PDF (si PyMuPDF est disponible)."""
    try:
        import pymupdf
    except ImportError:
        return None
    planche = pymupdf.open()
    for f in fichiers:
        with pymupdf.open(f) as doc:
            planche.insert_pdf(doc)
    planche.save(destination)
    planche.close()
    return destination


def main():
    ap = argparse.ArgumentParser(description="Genere les cartes de membre UECE en PDF.")
    ap.add_argument("registre", help="fichier CSV du registre des membres")
    ap.add_argument("--sortie", default="cartes", help="dossier de destination (defaut : cartes)")
    ap.add_argument("--bat", action="store_true",
                    help="version imprimeur : 91,6 x 60 mm, fonds perdus + traits de coupe")
    ap.add_argument("--seulement", default=None,
                    help="ne generer qu'un numero de membre precis")
    ap.add_argument("--base", default=None,
                    help="adresse de la page de verification visee par le QR "
                         "(defaut : celle inscrite dans le gabarit)")
    ap.add_argument("--sans-code", action="store_true",
                    help="ne pas imprimer le code avantage au verso")
    ap.add_argument("--tous", action="store_true",
                    help="generer meme les membres dont la cotisation n'est pas payee")
    args = ap.parse_args()

    if not os.path.exists(os.path.join(RACINE, GABARIT)):
        sys.exit("Gabarit introuvable : %s" % os.path.join(RACINE, GABARIT))

    chemin_registre = args.registre if os.path.isabs(args.registre) \
        else os.path.join(RACINE, args.registre)
    if not os.path.exists(chemin_registre):
        sys.exit("Registre introuvable : %s" % chemin_registre)

    dossier_sortie = args.sortie if os.path.isabs(args.sortie) \
        else os.path.join(RACINE, args.sortie)
    os.makedirs(dossier_sortie, exist_ok=True)

    with open(chemin_registre, encoding="utf-8-sig", newline="") as f:
        lignes = list(csv.DictReader(f))

    chrome = trouver_chrome()
    serveur, port = demarrer_serveur(RACINE)
    faits, ignores = [], []
    try:
        for ligne in lignes:
            numero = (ligne.get("numero") or "").strip()
            if args.seulement and numero != args.seulement:
                continue
            statut = (ligne.get("statut_cotisation") or "").strip().lower()
            if not args.tous and statut not in ("payee", "payée"):
                ignores.append("%s (cotisation : %s)" % (numero, statut or "inconnue"))
                continue
            if not (ligne.get("jeton_verif") or "").strip():
                ignores.append("%s (pas de jeton : lancer d'abord generer-verification.py)"
                               % numero)
                continue
            chemin = fabriquer(chrome, port, ligne, dossier_sortie, args.bat,
                               args.base, not args.sans_code)
            faits.append(chemin)
            print("  carte generee :", os.path.basename(chemin))
    finally:
        serveur.shutdown()

    print("\n%d carte(s) dans %s" % (len(faits), dossier_sortie))
    for motif in ignores:
        print("  ignore :", motif)

    if len(faits) > 1:
        planche = assembler(faits, os.path.join(dossier_sortie, "planche-imprimeur.pdf"))
        if planche:
            print("PDF unique pour l'imprimeur :", planche)
        else:
            print("(PyMuPDF absent : pas de PDF unique. « pip install pymupdf » pour l'obtenir.)")


if __name__ == "__main__":
    main()
