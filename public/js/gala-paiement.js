/* ==========================================================================
   gala-paiement.js — ZONE GELÉE (CLAUDE.md §5)
   Script de paiement PayPal de la page Gala, repris À L'IDENTIQUE de
   l'ancien gala.html (fonctions selectTicket, validateForm,
   initializePayPal, telechargerFacture ; custom_id = nom + "|||" + email).
   Seul changement : initializePayPal() n'est plus appelé sur
   DOMContentLoaded mais par la page Next.js (app/(gala)/gala/Billetterie.jsx)
   une fois le SDK PayPal chargé.
   ========================================================================== */
let currentPrice = 15;
let currentTicketType = "Standard";
let transactionData = {};
let paypalButtonsInstance = null;

function selectTicket(type) {
    if(type === 'standard') {
        currentPrice = 15;
        currentTicketType = "Standard";
        document.getElementById('card-standard').classList.add('active');
        document.getElementById('card-vip').classList.remove('active');
    } else {
        currentPrice = 25;
        currentTicketType = "VIP";
        document.getElementById('card-vip').classList.add('active');
        document.getElementById('card-standard').classList.remove('active');
    }
    document.getElementById('displayAmount').innerText = currentPrice + ".00 €";
    // Correctif 11/07/2026 : on ne recrée PLUS les boutons PayPal au
    // changement de formule. createOrder lit currentPrice/currentTicketType
    // AU CLIC, la recréation était inutile — et elle échouait par
    // intermittence (conteneur vidé sans close()), boutons disparus.
}

function validateForm() {
    // Correctif 11/07/2026 : l'email alimente l'envoi du billet via
    // Make ; un format invalide ou des espaces cassaient la chaîne en
    // aval (mail jamais reçu). Validation de forme minimale.
    const nomOk = document.getElementById('nomParticipant').value.trim().length > 0;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(document.getElementById('emailParticipant').value.trim());
    return nomOk && emailOk;
}

function initializePayPal() {
    paypalButtonsInstance = paypal.Buttons({
        onInit: function(data, actions) {
            // Correctif 11/07/2026 : après un changement de formule, les
            // boutons sont recréés alors que le formulaire est déjà rempli.
            // On évalue donc l'état réel au lieu de désactiver aveuglément,
            // sinon les boutons restent morts (bug d'origine du site).
            validateForm() ? actions.enable() : actions.disable();
            document.getElementById('nomParticipant').addEventListener('input', () => validateForm() ? actions.enable() : actions.disable());
            document.getElementById('emailParticipant').addEventListener('input', () => validateForm() ? actions.enable() : actions.disable());
        },
        onClick: function() { if (!validateForm()) alert("Remplissez le formulaire"); },
        // Création de la commande sécurisée avec transmission des données
        createOrder: function(data, actions) {
            // On récupère les valeurs du formulaire (rempli par le client)
            // .trim() : un espace autour de l'email invalide l'envoi Gmail
            const nomSaisi = document.getElementById('nomParticipant').value.trim();
            const emailSaisi = document.getElementById('emailParticipant').value.trim();

            // On fusionne les deux avec un séparateur unique (|||) pour Make
            const donneesPourMake = nomSaisi + "|||" + emailSaisi;

            return actions.order.create({
                purchase_units: [{
                    description: "Ticket Gala UECE 2026 - " + currentTicketType,
                    amount: {
                        value: currentPrice.toFixed(2)
                    },
                    // Ce champ invisible transmettra les infos à Make via PayPal
                    custom_id: donneesPourMake 
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                transactionData = {
                    id: details.id, date: new Date().toLocaleDateString("fr-BE"),
                    nom: document.getElementById('nomParticipant').value,
                    email: document.getElementById('emailParticipant').value,
                    type: currentTicketType, prix: currentPrice
                };
                document.getElementById('participantNameSummary').innerText = transactionData.nom;
                document.getElementById('paypal-button-container').style.display = 'none';
                document.getElementById('factureArea').style.display = 'block';
            });
        }
    });
    paypalButtonsInstance.render('#paypal-button-container');
}

// Billet redessiné (demande explicite du comité, 11/07/2026) :
// même nom de fonction, mêmes données, même nom de fichier — seul
// le rendu du PDF change. Format ticket DL paysage, identité Prestige.
function telechargerFacture() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: [210, 99] });
    const navy = [0, 23, 48], gold = [212, 175, 55], paper = [247, 242, 232], muted = [93, 102, 120];

    function dessiner(logo) {
        // fond papier + bandeau marine à gauche
        doc.setFillColor(paper[0], paper[1], paper[2]);
        doc.rect(0, 0, 210, 99, "F");
        doc.setFillColor(navy[0], navy[1], navy[2]);
        doc.rect(0, 0, 74, 99, "F");

        // cadre double filet or, signature de l'affiche
        doc.setDrawColor(gold[0], gold[1], gold[2]);
        doc.setLineWidth(0.5);
        doc.rect(4, 4, 202, 91);
        doc.setLineWidth(0.2);
        doc.rect(6.5, 6.5, 197, 86);

        // bandeau gauche : logo + événement
        if (logo) { doc.addImage(logo, "PNG", 24, 12, 26, 26); }
        doc.setFont("times", "bold");
        doc.setFontSize(21);
        doc.setTextColor(gold[0], gold[1], gold[2]);
        doc.text("GALA UECE", 37, 50, { align: "center" });
        doc.setFont("times", "italic");
        doc.setFontSize(11);
        doc.setTextColor(paper[0], paper[1], paper[2]);
        doc.text("Gala de Prestige 2026", 37, 57, { align: "center" });
        doc.setDrawColor(gold[0], gold[1], gold[2]);
        doc.setLineWidth(0.3);
        doc.line(20, 62, 54, 62);
        doc.setFont("times", "normal");
        doc.setFontSize(9);
        doc.text("Samedi 15 mai 2026, 19h00", 37, 69, { align: "center" });
        doc.text("Salle des Congrès", 37, 74, { align: "center" });
        doc.text("Grand-Place 22, 7000 Mons", 37, 79, { align: "center" });

        // partie droite : le billet
        // (charSpace n'est pas compté par l'alignement center de
        // jsPDF : on centre à la main sur la largeur réelle)
        const titre = "BILLET D'ENTRÉE";
        doc.setFont("times", "bold");
        doc.setFontSize(15);
        doc.setTextColor(navy[0], navy[1], navy[2]);
        const largTitre = doc.getTextWidth(titre) + (titre.length - 1) * 1;
        doc.text(titre, 140 - largTitre / 2, 20, { charSpace: 1 });
        doc.setDrawColor(gold[0], gold[1], gold[2]);
        doc.setLineWidth(0.4);
        doc.line(140 - largTitre / 2, 24.5, 140 + largTitre / 2, 24.5);

        const lignes = [
            ["Invité(e)", transactionData.nom],
            ["Formule", "Ticket " + transactionData.type + ", " + transactionData.prix + " EUR"],
            ["Référence de paiement", String(transactionData.id)],
            ["Achat du", transactionData.date]
        ];
        let y = 35;
        lignes.forEach(function (l) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(muted[0], muted[1], muted[2]);
            doc.text(l[0].toUpperCase(), 92, y);
            doc.setFont("times", "bold");
            doc.setFontSize(12);
            doc.setTextColor(navy[0], navy[1], navy[2]);
            doc.text(String(l[1]), 92, y + 5.5);
            y += 13;
        });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(muted[0], muted[1], muted[2]);
        doc.text("Présentez ce billet (imprimé ou sur téléphone) à l'entrée. Ouverture des portes à 18h30.", 140, 87, { align: "center" });
        doc.text("Tenue de soirée (Noir & Or)", 140, 91, { align: "center" });

        doc.save("Billet_UECE_" + transactionData.id + ".pdf");
    }

    // le logo est optionnel : le billet se génère même s'il ne charge pas.
    // logo-billet.png = 300px, calibré pour 26mm à 300dpi : net à
    // l'impression sans alourdir le PDF. Chargé au téléchargement.
    const img = new Image();
    img.onload = function () { dessiner(img); };
    img.onerror = function () { dessiner(null); };
    img.src = "images/logo-billet.png";
}

