// =============================================================================
// SEZIONE 1: INIZIALIZZAZIONE E SELEZIONE ELEMENTI DOM
// =============================================================================

// Selezione degli elementi DOM principali
// Selezione degli elementi DOM principali
const tabCategorieBtn = document.getElementById('tabCategorie');
const tabMaterialiBtn = document.getElementById('tabMateriali');
const tabOffertaBtn = document.getElementById('tabOfferta');
const espandiTuttoBtn = document.getElementById('espandiTuttoBtn');
const comprimiTuttoBtn = document.getElementById('comprimiTuttoBtn');
const aggiungiCategoriaBtn = document.getElementById('aggiungiCategoria');
const aggiungiCategoriaXPWEBtn = document.getElementById('aggiungiCategoriaXPWE');
const categoriaFileInput = document.getElementById('categoriaFile');
const categoriaFileXPWEInput = document.getElementById('categoriaFileXPWE');
const categorieContainer = document.getElementById('categorieContainer');
const materialiContainer = document.getElementById('materialiContainer');
const offertaContainer = document.getElementById('offertaContainer');
const valoreManodoperaInput = document.getElementById('valoreManodopera');
const salvaValoreBtn = document.getElementById('salvaValore');
const cancellaValoreBtn = document.getElementById('cancellaValore');
const salvaProgettoBtn = document.getElementById('salvaProgetto');
const caricaProgettoBtn = document.getElementById('caricaProgetto');
const progettoFileInput = document.getElementById('progettoFile');
const stampaButton = document.getElementById('stampaButton');
const titoloModal = document.getElementById('titoloModal');
const titoloInput = document.getElementById('titoloInput');
const clienteInput = document.getElementById('clienteInput');
const annullaTitoloBtn = document.getElementById('annullaTitolo');

// Bottoni di stampa
const stampaOrganizzazioneBtn = document.getElementById('stampaOrganizzazioneBtn');
const stampaRichiestaMaterialiBtn = document.getElementById('stampaRichiestaMaterialiBtn');
const stampaRichiestaOffertaBtn = document.getElementById('stampaRichiestaOffertaBtn');
const stampaCostoMaterialiBtn = document.getElementById('stampaCostoMaterialiBtn');
const stampaOffertaBtn = document.getElementById('stampaOffertaBtn');

// Modal per la modifica delle lavorazioni
const modificaLavorazioneModal = document.getElementById('modificaLavorazioneModal');
const modificaLavorazioneForm = document.getElementById('modificaLavorazioneForm');
const editNumero = document.getElementById('editNumero');
const editTariffa = document.getElementById('editTariffa');
const editNome = document.getElementById('editNome');
const editQuantita = document.getElementById('editQuantita');
const editImportoManodopera = document.getElementById('editImportoManodopera');
const editPrezzoUnitario = document.getElementById('editPrezzoUnitario');
const editPercentualeMO = document.getElementById('editPercentualeMO');
const annullaModificaBtn = document.getElementById('annullaModificaBtn');
const salvaModificaBtn = document.getElementById('salvaModificaBtn');

// Modal per la modifica dei materiali
const modificaMaterialeModal = document.getElementById('modificaMaterialeModal');
const modificaMaterialeForm = document.getElementById('modificaMaterialeForm');
const editMaterialeDescrizione = document.getElementById('editMaterialeDescrizione');
const editMaterialeQuantita = document.getElementById('editMaterialeQuantita');
const editMaterialeUM = document.getElementById('editMaterialeUM');
const editMaterialePrezzo = document.getElementById('editMaterialePrezzo');
const annullaModificaMaterialeBtn = document.getElementById('annullaModificaMaterialeBtn');
const salvaModificaMaterialeBtn = document.getElementById('salvaModificaMaterialeBtn');

// Array e variabili globali per mantenere lo stato dell'applicazione
window.categorie = [];
window.materiali = {}; // Oggetto con chiave = numero lavorazione, valore = array di materiali
window.operai = []; // Nuovo array per gli operai
let currentCategoryIndex = null;
let currentLavorazioneIndex = null;
let currentMaterialeIndex = null;
let currentMaterialeVoce = null;
let currentOperaioId = null; // Nuovo ID per tenere traccia dell'operaio in modifica

// Alias locali per un accesso più conciso
let categorie = window.categorie;
let materiali = window.materiali;
let operai = window.operai;

// Container per la stampa
let printContainer = null;
let printContentContainer = null;

// Variabili per i modali di gestione operai
let tabOperaiBtn = null;
let organicoModal = null;
let editOperaioModal = null;
let assegnaOperaiModal = null;
let nuovoOperaioNome = null;
let nuovoOperaioCognome = null;
let editOperaioNome = null;
let editOperaioCognome = null;
let dragDropMode = 'lavorazioni'; // Possibili valori: 'lavorazioni' o 'categorie'
let dragDropModeActive = false; // Indica se la modalità è stata attivata manualmente


// Assicurati che il container per la stampa esista, altrimenti crealo
function inizializzaContainerStampa() {
    // Verifica se il container già esiste
    printContainer = document.getElementById('printContainer');
    if (printContainer) {
        printContentContainer = document.getElementById('printContentContainer');
        return;
    }
    
    // Se non esiste, crea il container principale per la stampa
    printContainer = document.createElement('div');
    printContainer.id = 'printContainer';
    printContainer.className = 'print-only';
    document.body.appendChild(printContainer);
    
    // Crea la struttura della mascherina
    const printMascherina = document.createElement('div');
    printMascherina.className = 'print-mascherina';
    printMascherina.innerHTML = `
        <div class="mascherina-background"></div>
        <div class="print-document-type"></div>
        <div class="print-title"></div>
        <div class="print-client-container">
            <div class="print-client"></div>
            <div class="print-firma-linea"></div>
        </div>
        <div class="print-impresa-container">
            <div class="print-impresa">L'impresa</div>
            <div class="print-firma-linea"></div>
        </div>
        <div class="print-date-container">
            <div class="print-date"></div>
        </div>
    `;
    
    // Crea il container per il contenuto specifico della stampa
    printContentContainer = document.createElement('div');
    printContentContainer.id = 'printContentContainer';
    
    // Aggiungi i container al DOM
    printContainer.appendChild(printMascherina);
    printContainer.appendChild(printContentContainer);
}
// Inietta CSS aggiuntivo per miglioramenti grafici e supporto alla stampa
const styleElement = document.createElement('style');
styleElement.textContent = `
    /* Miglioramenti grafici generali */
    body {
        background-color: #f8f9fa;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    /* Miglioramento navbar */
    .navbar-container {
        background: #1a2980;
        padding: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        margin-bottom: 25px;
        border-radius: 0 0 10px 10px;
    }
    
    /* Stili per container di stampa */
    #printContainer {
        display: none;
    }
    
    /* Stili per la nuova mascherina */
    .print-mascherina {
        position: relative;
        width: 210mm;
        height: 297mm;
        margin: 0 auto;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    .mascherina-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url('./mascherina.png');
        background-size: cover;
        background-position: center;
        z-index: 1;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        color-adjust: exact;
    }
    
    .print-document-type {
        position: absolute;
        width: 100%;
        text-align: center;
        left: 50%;
        bottom: 205.5mm;  /* Spostato verso il basso di 7mm */
        transform: translateX(-50%);
        font-size: 24px;
        font-weight: bold;
        z-index: 2;
    }
    
    .print-title {
        position: absolute;
        width: 100%;
        text-align: center;
        left: 50%;
        bottom: 168mm;   /* Spostato verso il basso di 7mm */
        transform: translateX(-50%);
        font-size: 20px;
        z-index: 2;
    }
    
    .print-client-container {
        position: absolute;
        width: 80mm;
        text-align: center;
        left: 45.25mm;  /* 4.525cm */
        bottom: 18mm;   /* Spostato verso il basso di 7mm */
        transform: translateX(-50%);
        z-index: 2;
    }
    
    .print-client {
        font-size: 18px;
        margin-bottom: 5mm;
    }
    
    .print-impresa-container {
        position: absolute;
        width: 80mm;
        text-align: center;
        left: 164.75mm;  /* 16.475cm */
        bottom: 18mm;    /* Spostato verso il basso di 7mm */
        transform: translateX(-50%);
        z-index: 2;
    }
    
    .print-impresa {
        font-size: 18px;
        margin-bottom: 5mm;
    }
    
    .print-date-container {
        position: absolute;
        width: 80mm;
        text-align: center;
        left: 105mm;    /* 10.5cm */
        bottom: 18mm;   /* Spostato verso il basso di 7mm */
        transform: translateX(-50%);
        z-index: 2;
    }
    
    .print-date {
        font-size: 16px;
    }
    
    .print-firma-linea {
        border-bottom: 1px solid #000;
        width: 70%;  /* Ridotto del 30% */
        margin: 10mm auto 0;  /* Centrato orizzontalmente */
    }
    
    /* Stili per le tabelle */
    .print-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
        page-break-inside: avoid;
    }
    
    .print-table th,
    .print-table td {
        border: 1px solid #dee2e6;
        padding: 8px 12px;
    }
    
    .print-table th {
        background-color: #f8f9fa;
        font-weight: bold;
    }
    
    .print-category-header {
        background-color: #e6f0fa !important;
        font-weight: bold;
        color: #0056b3;
    }
    
    .print-totale-row {
        background-color: #f1f5f9;
        font-weight: bold;
    }
    
    @media print {
        #printContainer {
            display: block;
        }
        
        body > *:not(#printContainer) {
            display: none !important;
        }
        
        .print-table {
            width: 100%;
            table-layout: fixed;
        }
        
        .print-page-break {
            page-break-before: always;
        }
        
      rassas/* Forza dimensioni esatte in stampa */
        .print-mascherina {
            width: 210mm;
            height: 297mm;
            margin: 0;
            overflow: hidden;
            page-break-after: always;
        }
        
        .mascherina-background {
            background-image: url('./mascherina.png') !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
        }
        
        #printContentContainer {
            margin-top: 5mm;
        }
    }
`;
document.head.appendChild(styleElement);
// =============================================================================
// SEZIONE 2: FUNZIONI DI BASE E UTILITÀ
// =============================================================================

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
    });
    
    const pageToShow = document.getElementById(pageId);
    if (!pageToShow) {
        console.error(`Pagina con id '${pageId}' non trovata nel DOM`);
        return; // Esci dalla funzione se la pagina non esiste
    }
    
    pageToShow.classList.add('active');
    pageToShow.style.display = 'block';
    
    // Aggiorna i pulsanti di navigazione
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => button.classList.remove('active'));
    
    // Gestione dei pulsanti Espandi/Comprimi tutto
if (pageId === 'pageCategorie' || pageId === 'pageMateriali' || pageId === 'pageOperai') {
    // Mostra i pulsanti nelle pagine Categorie, Materiali e Operai
    espandiTuttoBtn.style.display = 'inline-block';
    comprimiTuttoBtn.style.display = 'inline-block';
    
    // Aggiorna gli event listeners in base alla pagina attiva
    if (pageId === 'pageCategorie') {
        console.log('Configurando pulsanti per espandere/comprimere categorie');
        espandiTuttoBtn.onclick = espandiTutteCategorie;
        comprimiTuttoBtn.onclick = comprimiTutteCategorie;
    } else if (pageId === 'pageMateriali') {
        console.log('Configurando pulsanti per espandere/comprimere materiali');
        espandiTuttoBtn.onclick = espandiTuttiMateriali;
        comprimiTuttoBtn.onclick = comprimiTuttiMateriali;
    } else if (pageId === 'pageOperai') {
        console.log('Configurando pulsanti per espandere/comprimere operai');
        espandiTuttoBtn.onclick = espandiTutteSquadre;
        comprimiTuttoBtn.onclick = comprimiTutteSquadre;
    }
} else {
    // Nascondi i pulsanti nelle altre pagine
    espandiTuttoBtn.style.display = 'none';
    comprimiTuttoBtn.style.display = 'none';
}

// Funzione per espandere tutte le squadre nella pagina operai
function espandiTutteSquadre() {
    document.querySelectorAll('.squadra-section .table-container').forEach(container => {
        container.style.display = 'block';
        container.classList.remove('collapsed');
    });
}

// Funzione per comprimere tutte le squadre nella pagina operai
function comprimiTutteSquadre() {
    document.querySelectorAll('.squadra-section .table-container').forEach(container => {
        container.style.display = 'none';
        container.classList.add('collapsed');
    });
}
    
    switch(pageId) {
        case 'pageCategorie':
            if (tabCategorieBtn) tabCategorieBtn.classList.add('active');
            // Quando si torna alla pagina categorie, assicurati che i dati delle date siano aggiornati
            console.log("Passaggio alla pagina categorie - aggiornamento date");
            categorie.forEach((categoria, index) => {
                aggiornaDateInCategorie(index);
            });
            break;
        case 'pageMateriali':
            if (tabMaterialiBtn) tabMaterialiBtn.classList.add('active');
            aggiornaTabelleMateriali();
            break;
        case 'pageOfferta':
            if (tabOffertaBtn) tabOffertaBtn.classList.add('active');
            aggiornaOfferta();
            break;
        case 'pageOperai':
            if (tabOperaiBtn) {
                tabOperaiBtn.classList.add('active');
                aggiornaGestioneOperai();
            } else {
                console.error('Il pulsante tabOperaiBtn non è inizializzato');
                // Tenta di recuperare o ricreare il pulsante
                aggiungiPulsanteNavOperai();
                if (tabOperaiBtn) tabOperaiBtn.classList.add('active');
                aggiornaGestioneOperai();
            }
            break;
    }
}

/**
 * Formatta un numero come valuta in formato italiano
 * @param {number|string} number - Numero da formattare come valuta
 * @param {Object} options - Opzioni di formattazione
 * @param {boolean} options.showSymbol - Se mostrare il simbolo € (default: true)
 * @param {number} options.decimals - Numero di decimali (default: 2)
 * @returns {string} Valore formattato come valuta
 */
function formatCurrency(number, options = {}) {
    // Opzioni predefinite
    const defaults = {
        showSymbol: true,
        decimals: 2
    };
    
    // Unisci le opzioni predefinite con quelle fornite
    const settings = { ...defaults, ...options };
    
    // Converti in numero
    const value = typeof number === 'string' ? parseEuroToNumber(number) : number;
    
    // Gestisci valori non numerici
    if (isNaN(value)) {
        return settings.showSymbol ? "0,00 €" : "0,00";
    }
    
    try {
        // Usa Intl.NumberFormat per la formattazione
        const formatter = new Intl.NumberFormat('it-IT', { 
            style: settings.showSymbol ? 'currency' : 'decimal',
            currency: 'EUR',
            minimumFractionDigits: settings.decimals,
            maximumFractionDigits: settings.decimals
        });
        
        return formatter.format(value);
    } catch (error) {
        console.error('Errore nella formattazione del valore monetario:', error);
        
        // Fallback semplice in caso di errore
        const formatted = value.toFixed(settings.decimals).replace('.', ',');
        return settings.showSymbol ? `${formatted} €` : formatted;
    }
}

/**
 * Converte un valore in formato valuta (Euro) in un numero
 * Gestisce correttamente formati italiani e internazionali
 * @param {string|number} euroString - Valore in formato valuta da convertire
 * @returns {number} Il valore numerico
 */
function parseEuroToNumber(euroString) {
    // Gestione dei valori nulli o undefined
    if (euroString === null || euroString === undefined || euroString === '') return 0;
    
    // Se è già un numero, ritornalo direttamente
    if (typeof euroString === 'number') return euroString;
    
    try {
        // Converti in stringa per sicurezza
        const strValue = String(euroString).trim();
        
        // Rimuovi il simbolo dell'euro e altri caratteri non numerici (tranne punto e virgola)
        let cleanString = strValue.replace(/[^0-9.,\-]/g, '');
        
        // Gestisci valori negativi
        const isNegative = cleanString.indexOf('-') !== -1;
        cleanString = cleanString.replace(/-/g, '');
        
        // Gestisci vari formati di valuta
        if (cleanString.includes('.') && cleanString.includes(',')) {
            // Formato con punto per migliaia e virgola per decimali (es. 1.234,56)
            if (cleanString.lastIndexOf('.') < cleanString.lastIndexOf(',')) {
                cleanString = cleanString.replace(/\./g, '').replace(',', '.');
            } 
            // Formato con virgola per migliaia e punto per decimali (es. 1,234.56)
            else {
                cleanString = cleanString.replace(/,/g, '');
            }
        } 
        // Se c'è solo la virgola, assumiamo sia il separatore decimale
        else if (cleanString.includes(',')) {
            cleanString = cleanString.replace(',', '.');
        }
        // Gestisci il caso di singolo punto (potrebbe essere separatore migliaia o decimale)
        else if (cleanString.includes('.')) {
            // Se il punto è vicino alla fine, è probabilmente un separatore decimale
            if (cleanString.length - cleanString.lastIndexOf('.') <= 3) {
                // Mantieni il punto come separatore decimale
            } 
            // Altrimenti è probabilmente un separatore migliaia
            else {
                cleanString = cleanString.replace(/\./g, '');
            }
        }
        
        // Converti in numero
        let result = parseFloat(cleanString);
        
        // Applica segno negativo se necessario
        if (isNegative) result = -result;
        
        return isNaN(result) ? 0 : result;
    } catch (error) {
        console.error('Errore nella conversione del valore monetario:', error);
        return 0;
    }
}

/**
 * Normalizza una quantità in formato numerico, gestendo correttamente separatori di migliaia e decimali
 * @param {string} quantitaStr - Stringa con la quantità da normalizzare
 * @returns {string} Quantità normalizzata
 */
function normalizzaQuantita(quantitaStr) {
    if (!quantitaStr) return '';
    
    // Separa la parte numerica da eventuali unità di misura
    const parti = quantitaStr.trim().split(/\s+/);
    if (parti.length === 0) return quantitaStr;
    
    let valorePulito = parti[0];
    // Verifica se il valore contiene un punto o una virgola
    if (valorePulito.includes('.') || valorePulito.includes(',')) {
        // Se contiene entrambi, il punto è separatore delle migliaia
        if (valorePulito.includes('.') && valorePulito.includes(',')) {
            // Se la virgola è dopo l'ultimo punto, il punto è separatore delle migliaia
            if (valorePulito.lastIndexOf('.') < valorePulito.lastIndexOf(',')) {
                valorePulito = valorePulito.replace(/\./g, '').replace(',', '.');
            } else {
                // Altrimenti la virgola è separatore delle migliaia (raro)
                valorePulito = valorePulito.replace(/,/g, '');
            }
        } 
        // Se contiene solo virgola, assumiamo sia separatore decimale
        else if (valorePulito.includes(',')) {
            valorePulito = valorePulito.replace(',', '.');
        }
        // Se contiene solo punto, assumiamo che sia un separatore decimale se è vicino alla fine
        else if (valorePulito.includes('.')) {
            // Non facciamo nulla, assumiamo sia già nel formato corretto
        }
    }
    
    // Riassembla con eventuali unità di misura
    if (parti.length > 1) {
        return valorePulito + ' ' + parti.slice(1).join(' ');
    }
    
    return valorePulito;
}

/**
 * Funzione centralizzata per il calcolo degli importi finanziari
 * @param {Object} options - Opzioni di calcolo
 * @param {number} options.importoBase - Importo base senza sconto
 * @param {number} options.sconto - Percentuale di sconto (da 0 a 100)
 * @param {number} options.quantita - Quantità per calcolo prezzo unitario
 * @param {boolean} options.calcolaUnitario - Se true, calcola anche il prezzo unitario
 * @returns {Object} Risultato con importo scontato e prezzo unitario
 */
function calcolaImporti({ importoBase, sconto = 0, quantita = 1, calcolaUnitario = false }) {
    // Verifica e normalizza i parametri
    importoBase = parseFloat(importoBase) || 0;
    sconto = parseFloat(sconto) || 0;
    quantita = parseFloat(quantita) || 1;
    
    // Limita lo sconto tra 0 e 100
    sconto = Math.min(Math.max(sconto, 0), 100);
    
    // Calcola l'importo scontato
    const importoScontato = importoBase * (1 - (sconto / 100));
    
    // Calcola il prezzo unitario se richiesto
    let prezzoUnitario = 0;
    if (calcolaUnitario && quantita > 0) {
        prezzoUnitario = importoScontato / quantita;
        // Arrotonda a 2 decimali
        prezzoUnitario = Math.round(prezzoUnitario * 100) / 100;
    }
    
    return {
        importoScontato: importoScontato,
        prezzoUnitario: prezzoUnitario
    };
}

/**
 * Calcola il totale degli importi di una categoria, considerando lo sconto
 * @param {Object} categoria - L'oggetto categoria da cui calcolare il totale
 * @param {boolean} consideraSconto - Se considerare lo sconto della categoria
 * @returns {number} Il totale calcolato
 */
function calcolaTotaleCategoria(categoria, consideraSconto = true) {
    if (!categoria || !Array.isArray(categoria.lavorazioni)) {
        return 0;
    }
    
    const sconto = consideraSconto ? (categoria.sconto || 0) : 0;
    let totale = 0;
    
    categoria.lavorazioni.forEach(lavorazione => {
        // Determiniamo l'importo base corretto
        let importoBase = 0;
        
        if (lavorazione.importoManodoperaRaw !== undefined) {
            importoBase = lavorazione.importoManodoperaRaw;
        } else if (lavorazione.importoManodopera) {
            importoBase = parseEuroToNumber(lavorazione.importoManodopera);
        }
        
        // Calcoliamo l'importo scontato
        if (importoBase > 0) {
            const risultato = calcolaImporti({
                importoBase: importoBase,
                sconto: sconto
            });
            
            // Aggiorniamo l'importo scontato nella lavorazione per usi futuri
            lavorazione.importoManodoperaScontato = risultato.importoScontato;
            
            // Aggiungiamo al totale
            totale += risultato.importoScontato;
        }
    });
    
    return totale;
}

// Funzione per estrarre numero e codice da una stringa
function estraiNumeroECodice(valore) {
    if (!valore) return { numero: '', codice: '' };
    const parti = valore.trim().split(' ');
    if (parti.length >= 2 && /^\d+$/.test(parti[0])) {
        return {
            numero: parti[0],
            codice: parti.slice(1).join(' ')
        };
    }
    return null;
}

// Funzione per mostrare un modal con animazione
function showModal(modal) {
    modal.style.display = 'block';
    // Aggiungi la classe show con un leggero ritardo per permettere l'animazione
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Funzione per nascondere un modal con animazione
function hideModal(modal) {
    modal.classList.remove('show');
    // Nascondi completamente dopo l'animazione
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

/**
 * Calcola il numero massimo di giornate lavorative in base al totale importi e numero operai
 * @param {number} totaleImporti - Totale degli importi (già scontato se necessario)
 * @param {number} numeroOperai - Numero di operai 
 * @param {number} sconto - Percentuale di sconto (da 0 a 100)
 * @returns {string|number} Numero di giornate massime o '-' se non calcolabile
 */
function calcolaGiornateMassime(totaleImporti, numeroOperai, sconto = 0) {
    // Verifica e normalizza i parametri
    totaleImporti = parseFloat(totaleImporti) || 0;
    numeroOperai = parseInt(numeroOperai) || 0;
    sconto = parseFloat(sconto) || 0;
    
    // Ottieni il costo giornaliero dalla UI
    const costoGiornaliero = parseEuroToNumber(valoreManodoperaInput.value);
    
    // Verifica che tutti i parametri necessari siano validi
    if (numeroOperai <= 0 || costoGiornaliero <= 0 || totaleImporti <= 0) {
        return '-';
    }
    
    try {
        // Applica lo sconto al totale se necessario (potrebbe essere già applicato)
        const totaleDopoSconto = totaleImporti * (1 - (sconto / 100));
        
        // Calcola le giornate massime
        const giornateMassime = Math.floor(totaleDopoSconto / (numeroOperai * costoGiornaliero));
        
        // Ritorna il risultato o '-' se il calcolo non ha senso
        return giornateMassime > 0 ? giornateMassime : '-';
    } catch (error) {
        console.error('Errore nel calcolo delle giornate massime:', error);
        return '-';
    }
}

// Lista di festività italiane (aggiungile come necessario)
const festivitaItaliane = [
    '01-01', // Capodanno
    '01-06', // Epifania
    '04-25', // Liberazione
    '05-01', // Festa del Lavoro
    '06-02', // Festa della Repubblica
    '08-15', // Ferragosto
    '11-01', // Tutti i Santi
    '12-08', // Immacolata Concezione
    '12-25', // Natale
    '12-26', // Santo Stefano
];

// Funzione per verificare se una data è un giorno festivo
function isFestivo(data) {
    // Ottieni il mese e il giorno in formato MM-DD
    const mese = String(data.getMonth() + 1).padStart(2, '0');
    const giorno = String(data.getDate()).padStart(2, '0');
    const meseGiorno = `${mese}-${giorno}`;
    
    // Controlla se è nel nostro elenco di festività
    return festivitaItaliane.includes(meseGiorno);
}

// Funzione per verificare se una data è un giorno lavorativo
function isGiornoLavorativo(data) {
    const giorno = data.getDay();
    // 0 = domenica, 6 = sabato
    if (giorno === 0 || giorno === 6) {
        return false;
    }
    
    // Controlla che non sia una festività
    return !isFestivo(data);
}

// Calcola la Pasqua per un dato anno (algoritmo di Gauss)
function calcolaPasqua(anno) {
    const a = anno % 19;
    const b = Math.floor(anno / 100);
    const c = anno % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    
    return new Date(anno, month - 1, day);
}

// Funzione per calcolare la data di fine sommando giorni lavorativi alla data di inizio
function calcolaDataFineDaGiorni(dataInizio, giorni) {
    if (!dataInizio || !giorni || giorni === '-' || isNaN(giorni)) return '';
    
    // Crea un oggetto Date dalla data di inizio
    const dataInizioObj = new Date(dataInizio);
    if (isNaN(dataInizioObj.getTime())) return '';
    
    // Converti giorni in numero intero
    const giorniLavorativi = parseInt(giorni);
    
    // Calcola la Pasqua e il Lunedì dell'Angelo (Pasquetta) per l'anno corrente
    const anno = dataInizioObj.getFullYear();
    const pasqua = calcolaPasqua(anno);
    
    // Aggiungi Pasqua e Pasquetta all'elenco delle festività per l'anno corrente
    const pasquaMeseGiorno = `${String(pasqua.getMonth() + 1).padStart(2, '0')}-${String(pasqua.getDate()).padStart(2, '0')}`;
    
    // Pasquetta (Lunedì dell'Angelo)
    const pasquetta = new Date(pasqua);
    pasquetta.setDate(pasqua.getDate() + 1);
    const pasquettaMeseGiorno = `${String(pasquetta.getMonth() + 1).padStart(2, '0')}-${String(pasquetta.getDate()).padStart(2, '0')}`;
    
    // Aggiungiamo temporaneamente queste festività
    festivitaItaliane.push(pasquaMeseGiorno, pasquettaMeseGiorno);
    
    // Inizia dal giorno di inizio (che conta come primo giorno lavorativo)
    let dataCorrente = new Date(dataInizioObj);
    let giorniCalcolati = 0;
    
    // Il giorno di inizio è già il primo giorno lavorativo, quindi iniziamo da 1
    giorniCalcolati = 1;
    
    // Continua ad aggiungere giorni finché non raggiungiamo il numero richiesto di giorni lavorativi
    while (giorniCalcolati < giorniLavorativi) {
        // Passa al giorno successivo
        dataCorrente.setDate(dataCorrente.getDate() + 1);
        
        // Se è un giorno lavorativo, incrementa il contatore
        if (isGiornoLavorativo(dataCorrente)) {
            giorniCalcolati++;
        }
    }
    
    // Rimuoviamo le festività temporanee
    const pasquaIndex = festivitaItaliane.indexOf(pasquaMeseGiorno);
    if (pasquaIndex > -1) festivitaItaliane.splice(pasquaIndex, 1);
    
    const pasquettaIndex = festivitaItaliane.indexOf(pasquettaMeseGiorno);
    if (pasquettaIndex > -1) festivitaItaliane.splice(pasquettaIndex, 1);
    
    // Formatta la data finale nel formato ISO (YYYY-MM-DD)
    const annoFine = dataCorrente.getFullYear();
    const meseFine = String(dataCorrente.getMonth() + 1).padStart(2, '0');
    const giornoFine = String(dataCorrente.getDate()).padStart(2, '0');
    
    return `${annoFine}-${meseFine}-${giornoFine}`;
}

// Funzione per ottenere la data corrente in formato italiano
function getDataOggi() {
    const oggi = new Date();
    return oggi.toLocaleDateString('it-IT');
}

// Funzione per ottenere la data corrente in formato ISO (YYYY-MM-DD)
function getDataOggiISO() {
    const oggi = new Date();
    const anno = oggi.getFullYear();
    const mese = String(oggi.getMonth() + 1).padStart(2, '0');
    const giorno = String(oggi.getDate()).padStart(2, '0');
    return `${anno}-${mese}-${giorno}`;
}

// Funzione per formattare le date nel formato italiano
function formatDate(date) {
    if (!date) return '';
    if (typeof date === 'string') {
        // Converti la stringa in oggetto Date (assumendo formato YYYY-MM-DD)
        const parts = date.split('-');
        if (parts.length === 3) {
            date = new Date(parts[0], parts[1] - 1, parts[2]);
        } else {
            return date; // Se non è nel formato previsto, restituisci la stringa originale
        }
    }
    
    if (!(date instanceof Date) || isNaN(date)) {
        return '';
    }
    
    return date.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Funzione per convertire una data dal formato italiano (DD/MM/YYYY) al formato ISO (YYYY-MM-DD)
function parseItalianDate(dateString) {
    if (!dateString) return '';
    
    // Supporta più formati di input
    const cleanDate = dateString.replace(/\./g, '/').replace(/-/g, '/');
    const parts = cleanDate.split('/');
    
    if (parts.length !== 3) return '';
    
    // Verifica se il primo numero è giorno o anno (assumendo che anno sia a 4 cifre)
    if (parts[0].length === 4) {
        // Formato YYYY/MM/DD
        return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
    } else {
        // Formato DD/MM/YYYY
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
}

// Funzione per calcolare la durata in giorni tra due date
function calcolaDurataGiorni(dataInizio, dataFine) {
    if (!dataInizio || !dataFine) return '-';
    
    // Converti le date in formato ISO se necessario
    const startISO = dataInizio.includes('-') ? dataInizio : parseItalianDate(dataInizio);
    const endISO = dataFine.includes('-') ? dataFine : parseItalianDate(dataFine);
    
    const start = new Date(startISO);
    const end = new Date(endISO);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return '-';
    
    // Calcola la differenza in millisecondi e converti in giorni
    // +1 per includere sia il giorno di inizio che quello di fine
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return diffDays;
}

// Funzione per calcolare la durata in giorni tra due date
function calcolaDurataGiorni(dataInizio, dataFine) {
    if (!dataInizio || !dataFine) return '-';
    
    // Converti le date in formato ISO se necessario
    const startISO = dataInizio.includes('-') ? dataInizio : parseItalianDate(dataInizio);
    const endISO = dataFine.includes('-') ? dataFine : parseItalianDate(dataFine);
    
    const start = new Date(startISO);
    const end = new Date(endISO);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return '-';
    
    // Calcola la differenza in millisecondi e converti in giorni
    // +1 per includere sia il giorno di inizio che quello di fine
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return diffDays;
}

// Funzione per ottenere tutte le lavorazioni da tutte le categorie
function getAllLavorazioni() {
    const tutte = [];
    categorie.forEach((categoria, categoriaIndex) => {
        categoria.lavorazioni.forEach((lavorazione) => {
            tutte.push({
                ...lavorazione,
                categoriaName: categoria.nome,
                categoriaIndex: categoriaIndex
            });
        });
    });
    return tutte;
}

// Funzione per generare un ID univoco (utile per operai e altre entità)
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Funzione per ottenere gli operai assegnati a una categoria
function getOperaiPerCategoria(categoriaIndex) {
    if (!categorie[categoriaIndex] || !categorie[categoriaIndex].operaiAssegnati) {
        return [];
    }
    return categorie[categoriaIndex].operaiAssegnati;
}

// Funzione per ottenere i nomi degli operai come stringa
function getNomiOperaiPerCategoria(categoriaIndex) {
    const operaiIds = getOperaiPerCategoria(categoriaIndex);
    if (!operaiIds || operaiIds.length === 0) return '-';
    
    const nomiOperai = operaiIds.map(id => {
        const operaio = operai.find(o => o.id === id);
        return operaio ? `${operaio.nome} ${operaio.cognome}` : '';
    }).filter(nome => nome !== '');
    
    return nomiOperai.length > 0 ? nomiOperai.join(' - ') : '-';
}

function espandiTutteCategorie() {
    document.querySelectorAll('.category-section').forEach(categorySection => {
        const contentContainer = categorySection.querySelector('.category-content');
        const toggleButton = categorySection.querySelector('.toggle-category-btn img');
        
        if (contentContainer) {
            contentContainer.style.display = 'block';
            contentContainer.classList.remove('collapsed');
        }
        
        if (toggleButton) {
            toggleButton.style.transform = 'rotate(0deg)';
        }
    });
}

// Funzione per comprimere tutte le categorie
function comprimiTutteCategorie() {
    document.querySelectorAll('.category-section').forEach(categorySection => {
        const contentContainer = categorySection.querySelector('.category-content');
        const toggleButton = categorySection.querySelector('.toggle-category-btn img');
        
        if (contentContainer) {
            contentContainer.style.display = 'none';
            contentContainer.classList.add('collapsed');
        }
        
        if (toggleButton) {
            toggleButton.style.transform = 'rotate(-90deg)';
        }
    });
}

// Funzione per raggruppare le categorie per squadra
function raggruppaPerSquadra() {
    // Il risultato sarà un oggetto con chiave = IDs operai, valore = array di categorie
    const squadre = {};
    
    categorie.forEach((categoria, index) => {
        // Ottieni gli operai assegnati a questa categoria
        const operaiAssegnati = categoria.operaiAssegnati || [];
        
        // Se non ci sono operai assegnati, salta questa categoria
        if (operaiAssegnati.length === 0) return;
        
        // Crea un identificatore della squadra ordinando gli ID per avere una chiave coerente
        const squadraKey = operaiAssegnati.sort().join('_');
        
        // Se questa squadra non esisteva ancora, inizializza l'array
        if (!squadre[squadraKey]) {
            squadre[squadraKey] = {
                operaiIds: operaiAssegnati,
                categorie: []
            };
        }
        
        // Aggiungi questa categoria all'array della squadra
        squadre[squadraKey].categorie.push({
            ...categoria,
            index: index
        });
    });
    
    return squadre;
}

/**
 * Applica lo sconto a tutte le voci di una categoria e calcola il totale
 * @param {Object} categoria - Oggetto categoria contenente le lavorazioni
 * @returns {number} Il totale delle lavorazioni scontate
 */
function applicaScontoAlleVoci(categoria) {
    const sconto = categoria.sconto || 0;
    let totaleLavorazioni = 0;
    
    // Applica lo sconto a ciascuna lavorazione e calcola il totale aggiornato
    categoria.lavorazioni.forEach(lavorazione => {
        // Assicurati che abbiamo un valore raw valido
        if (lavorazione.importoManodoperaRaw === undefined && lavorazione.importoManodopera) {
            lavorazione.importoManodoperaRaw = parseEuroToNumber(lavorazione.importoManodopera);
        }
        
        if (lavorazione.importoManodoperaRaw !== undefined && !isNaN(lavorazione.importoManodoperaRaw)) {
            // Utilizza la funzione centralizzata
            const risultato = calcolaImporti({
                importoBase: lavorazione.importoManodoperaRaw,
                sconto: sconto,
                quantita: parseFloat(lavorazione.quantita) || 1,
                calcolaUnitario: true
            });
            
            // Aggiorna il valore scontato
            lavorazione.importoManodoperaScontato = risultato.importoScontato;
            
            // Aggiorna il prezzo unitario se necessario
            if (risultato.prezzoUnitario > 0) {
                lavorazione.prezzoUnitarioRaw = risultato.prezzoUnitario;
                lavorazione.prezzoUnitario = formatCurrency(risultato.prezzoUnitario);
            }
            
            // Aggiungi al totale
            totaleLavorazioni += risultato.importoScontato;
        }
    });
    
    return totaleLavorazioni;
}

// Funzione per pulire il contenitore di stampa
function pulisciContenutoStampa() {
    if (printContentContainer) {
        printContentContainer.innerHTML = '';
    }
}

// Funzione per pulire gli elementi di stampa residui
function cleanupPrintElements() {
    // Rimuovi elementi relativi alla stampa che potrebbero essere rimasti
    const elementsToRemove = [
        '.print-header', 
        '.print-footer', 
        '.print-page-mask',
        '.firma-riquadro',
        '.page-content-after-mask'
    ];
    
    elementsToRemove.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => element.remove());
    });
}

// Aggiungi stili CSS per le notifiche
const styleNotificaPersistente = document.createElement('style');
styleNotificaPersistente.textContent = `
    .notification {
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%) translateY(-20px);
        padding: 8px 12px;
        background-color: #1a2980;
        color: white;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        transition: opacity 0.3s, transform 0.3s;
        opacity: 0;
        z-index: 1000;
        font-size: 14px;
        max-width: 90%;
        text-align: center;
    }
    
    .notification.visible {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
    
    .notification.persistent {
        background-color: #d9534f;
    }
    
    .notification.success {
        background-color: #5cb85c;
    }
    
    .notification.error {
        background-color: #d9534f;
    }
    
    .notification.info {
        background-color: #5bc0de;
    }
`;
document.head.appendChild(styleNotificaPersistente);

// Funzione per mostrare una notifica
function mostraNotifica(messaggio, tipo = 'info', durata = 2000) {
    // Rimuovi eventuali notifiche già presenti dello stesso tipo
    const vecchieNotifiche = document.querySelectorAll(`.notification:not(.persistent)`);
    vecchieNotifiche.forEach(notifica => notifica.remove());
    
    // Crea l'elemento notifica
    const notifica = document.createElement('div');
    notifica.className = `notification ${tipo}`;
    notifica.textContent = messaggio;
    document.body.appendChild(notifica);
    
    // Forza il reflow per permettere la transizione
    notifica.offsetHeight;
    
    // Mostra la notifica
    notifica.classList.add('visible');
    
    // Nascondi la notifica dopo la durata specificata (solo se non è persistente)
    if (!notifica.classList.contains('persistent') && durata > 0) {
        setTimeout(() => {
            notifica.classList.remove('visible');
            
            // Rimuovi l'elemento dopo che la transizione è completata
            setTimeout(() => {
                notifica.remove();
            }, 300);
        }, durata);
    }
    
    return notifica; // Restituisce l'elemento notifica per poterlo manipolare
}

// =============================================================================
// SEZIONE 3: PREPARAZIONE E GESTIONE STAMPA
// =============================================================================

function salvaStatoCategorie() {
    const statoCategorieEspanse = {};
    
    document.querySelectorAll('.category-section').forEach(categorySection => {
        const categoriaIndex = categorySection.dataset.categoryIndex;
        const contentContainer = categorySection.querySelector('.category-content');
        const toggleButton = categorySection.querySelector('.toggle-category-btn img');
        
        // Salva sia lo stato di espansione che l'indice originale e lo stato della rotazione dell'icona
        statoCategorieEspanse[categoriaIndex] = {
            espanso: contentContainer && contentContainer.style.display !== 'none',
            indiceOriginale: parseInt(categoriaIndex),
            rotazioneIcona: toggleButton ? toggleButton.style.transform : ''
        };
    });
    
    return statoCategorieEspanse;
}
// Funzione per ripristinare lo stato delle categorie
function ripristinaStatoCategorie(statoCategorieEspanse) {
    // Questa funzione ora utilizza uno stato più avanzato che include indice originale e rotazione icona
    document.querySelectorAll('.category-section').forEach(categorySection => {
        const categoriaIndex = categorySection.dataset.categoryIndex;
        const contentContainer = categorySection.querySelector('.category-content');
        const toggleButton = categorySection.querySelector('.toggle-category-btn img');
        
        // Cerca prima il nuovo indice tra gli stati salvati
        for (const indice in statoCategorieEspanse) {
            if (statoCategorieEspanse[indice] && 
                statoCategorieEspanse[indice].indiceOriginale == categoriaIndex) {
                
                // Trovata corrispondenza, ripristina lo stato
                if (statoCategorieEspanse[indice].espanso) {
                    // Categoria espansa
                    if (contentContainer) {
                        contentContainer.style.display = 'block';
                        contentContainer.classList.remove('collapsed');
                    }
                    if (toggleButton) {
                        toggleButton.style.transform = 'rotate(0deg)';
                    }
                } else {
                    // Categoria compressa
                    if (contentContainer) {
                        contentContainer.style.display = 'none';
                        contentContainer.classList.add('collapsed');
                    }
                    if (toggleButton) {
                        toggleButton.style.transform = 'rotate(-90deg)';
                    }
                }
                
                // Applica la rotazione salvata dell'icona se disponibile
                if (toggleButton && statoCategorieEspanse[indice].rotazioneIcona) {
                    toggleButton.style.transform = statoCategorieEspanse[indice].rotazioneIcona;
                }
                
                break;
            }
        }
        
        // Fallback alla vecchia logica se non troviamo corrispondenze
        if (statoCategorieEspanse[categoriaIndex] !== undefined && 
            typeof statoCategorieEspanse[categoriaIndex] === 'boolean') {
            
            if (statoCategorieEspanse[categoriaIndex]) {
                // Categoria espansa
                if (contentContainer) {
                    contentContainer.style.display = 'block';
                    contentContainer.classList.remove('collapsed');
                }
                if (toggleButton) {
                    toggleButton.style.transform = 'rotate(0deg)';
                }
            } else {
                // Categoria compressa
                if (contentContainer) {
                    contentContainer.style.display = 'none';
                    contentContainer.classList.add('collapsed');
                }
                if (toggleButton) {
                    toggleButton.style.transform = 'rotate(-90deg)';
                }
            }
        }
    });
}
// Funzione principale per preparare e gestire la stampa
function preparaStampa(tipoStampa, titolo, cliente, elementiSelezionati) {
    // Assicurati che il container per la stampa esista
    inizializzaContainerStampa();
    
    // Pulisci eventuali contenuti precedenti
    pulisciContenutoStampa();
    
    // Nascondi tutti gli altri contenuti durante la stampa (in modo più affidabile)
    document.querySelectorAll('body > *:not(#printContainer)').forEach(el => {
        el.classList.add('no-print');
    });
    
    // Mostra il container di stampa
    printContainer.style.display = 'block';
    
    // Imposta le informazioni nella mascherina
    const docTypeElement = document.querySelector('#printContainer .print-document-type');
    const titleElement = document.querySelector('#printContainer .print-title');
    const clientElement = document.querySelector('#printContainer .print-client');
    const dateElement = document.querySelector('#printContainer .print-date');
    
    // Debug - verifica che gli elementi siano stati trovati
    console.log('Elementi mascherina:', { 
        docTypeElement, 
        titleElement, 
        clientElement, 
        dateElement 
    });
    
    if (docTypeElement) docTypeElement.textContent = tipoStampa;
    if (titleElement) titleElement.textContent = titolo || '';
    if (clientElement) clientElement.textContent = cliente || 'Cliente';
    if (dateElement) dateElement.textContent = getDataOggi();
    
    // Verifica che ci siano elementi selezionati
    if (Array.isArray(elementiSelezionati) && elementiSelezionati.length === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'print-empty-state';
        emptyDiv.innerHTML = '<p>Nessun elemento selezionato per la stampa.</p>';
        printContentContainer.appendChild(emptyDiv);
    } else {
        // Genera il contenuto specifico in base al tipo di stampa
        switch(tipoStampa) {
            case 'Organizzazione cantiere':
                generaStampaOrganizzazioneCantiere(elementiSelezionati);
                break;
            case 'Richiesta materiali':
                generaStampaRichiestaMateriali(elementiSelezionati);
                break;
            case 'Richiesta offerta':
                generaStampaRichiestaOfferta(elementiSelezionati);
                break;
            case 'Costo materiali':
                generaStampaCostoMateriali(elementiSelezionati);
                break;
            case 'Offerta':
                generaStampaOfferta(elementiSelezionati);
                break;
            case 'Gestione operai':
                generaStampaGestioneOperai(elementiSelezionati);
                break;
            default:
                const errorDiv = document.createElement('div');
                errorDiv.className = 'print-empty-state';
                errorDiv.innerHTML = '<p>Tipo di stampa non riconosciuto.</p>';
                printContentContainer.appendChild(errorDiv);
        }
    }
    
    // Esegui la stampa
    setTimeout(() => {
        window.print();
        
        // Dopo la stampa, nascondi il container della stampa e ripristina la visibilità
        if (printContainer) {
            printContainer.style.display = 'none';
        }
        document.querySelectorAll('body > *:not(#printContainer)').forEach(el => {
            el.classList.remove('no-print');
        });
    }, 500);  // Aumentato il timeout per garantire il caricamento completo
}
// Modal per la selezione delle categorie da stampare
function mostraSelezioneCategoriePrimaDiStampare(tipoStampa, titolo, cliente) {
    // Crea il modal se non esiste
    let modalSelezioneCategorie = document.getElementById('modalSelezioneCategorie');
    
    if (!modalSelezioneCategorie) {
        modalSelezioneCategorie = document.createElement('div');
        modalSelezioneCategorie.id = 'modalSelezioneCategorie';
        modalSelezioneCategorie.className = 'modal';
        
        // Crea il contenuto del modal
        modalSelezioneCategorie.innerHTML = `
            <div class="modal-content">
                <h3>Seleziona le categorie da stampare</h3>
                <div id="categoriePerStampaContainer" class="categorie-stampa-container">
                    <!-- Le categorie verranno generate dinamicamente -->
                </div>
                <div class="modal-buttons">
                    <button id="annullaStampaSelectBtn">Annulla</button>
                    <button id="confermaStampaSelectBtn">Conferma e Stampa</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalSelezioneCategorie);
    }
    
    // Rimuovi eventuali listener precedenti per evitare duplicazioni
    const annullaBtn = document.getElementById('annullaStampaSelectBtn');
    const confermaBtn = document.getElementById('confermaStampaSelectBtn');
    
    // Clona e rimpiazza i pulsanti per rimuovere eventuali listener
    if (annullaBtn) {
        const newAnnullaBtn = annullaBtn.cloneNode(true);
        annullaBtn.parentNode.replaceChild(newAnnullaBtn, annullaBtn);
    }
    
    if (confermaBtn) {
        const newConfermaBtn = confermaBtn.cloneNode(true);
        confermaBtn.parentNode.replaceChild(newConfermaBtn, confermaBtn);
    }
    
    // Aggiungi event listeners per i pulsanti (riferimenti aggiornati)
    document.getElementById('annullaStampaSelectBtn').addEventListener('click', function() {
        console.log('Clic sul pulsante Annulla');
        hideModal(modalSelezioneCategorie);
    });
    
    document.getElementById('confermaStampaSelectBtn').addEventListener('click', function() {
        console.log('Clic sul pulsante Conferma e Stampa');
        // Raccogli le categorie selezionate
        const checkboxes = document.querySelectorAll('#categoriePerStampaContainer input[type="checkbox"]:checked');
        const categorieSelezionate = Array.from(checkboxes).map(cb => parseInt(cb.value));
        
        // Nascondi questo modal
        hideModal(modalSelezioneCategorie);
        
        // Esegui la stampa con le categorie selezionate
        preparaStampa(tipoStampa, titolo, cliente, categorieSelezionate);
    });
    
    // Gestione del clic fuori dal modal (utilizzo di una funzione separata per facilitare la rimozione)
    function handleOutsideClick(e) {
        if (e.target === modalSelezioneCategorie) {
            console.log('Clic fuori dal modal');
            hideModal(modalSelezioneCategorie);
            // Rimuovi questo listener quando il modal viene chiuso
            document.removeEventListener('click', handleOutsideClick);
        }
    }
    
    // Rimuovi eventuali listener precedenti e aggiungi il nuovo
    document.removeEventListener('click', handleOutsideClick);
    document.addEventListener('click', handleOutsideClick);
    
    // Aggiorna il contenuto delle categorie
    const container = document.getElementById('categoriePerStampaContainer');
    container.innerHTML = '';
    
// Aggiunta degli event listener e gestione espandi/comprimi
aggiungiGestioneMateriali();
aggiungiGestioneToggleCategorieInMateriali();

    // Aggiungi checkbox per selezionare/deselezionare tutte le categorie
    const headerDiv = document.createElement('div');
    headerDiv.className = 'categorie-selection-header';
    headerDiv.innerHTML = `
        <label class="select-all-label">
            <input type="checkbox" id="seleziona-tutte-categorie-stampa" checked>
            <span class="checkbox-label">Seleziona/Deseleziona tutte</span>
        </label>
    `;
    container.appendChild(headerDiv);
    
    // Aggiungi un checkbox per ogni categoria
    categorie.forEach((categoria, index) => {
        const categoriaDiv = document.createElement('div');
        categoriaDiv.className = 'categoria-checkbox';
        categoriaDiv.innerHTML = `
            <label>
                <input type="checkbox" value="${index}" checked>
                <span class="checkbox-label">${categoria.nome}</span>
            </label>
        `;
        container.appendChild(categoriaDiv);
    });
    
    // Aggiungi event listener per il checkbox "seleziona tutti"
    const selezionaTutteCheckbox = document.getElementById('seleziona-tutte-categorie-stampa');
    selezionaTutteCheckbox.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        document.querySelectorAll('#categoriePerStampaContainer input[type="checkbox"]:not(#seleziona-tutte-categorie-stampa)').forEach(cb => {
            cb.checked = isChecked;
        });
    });
    
    // Aggiungi event listener per aggiornare il checkbox "seleziona tutti" quando cambia una selezione
    document.querySelectorAll('#categoriePerStampaContainer input[type="checkbox"]:not(#seleziona-tutte-categorie-stampa)').forEach(cb => {
        cb.addEventListener('change', () => {
            const allCheckboxes = document.querySelectorAll('#categoriePerStampaContainer input[type="checkbox"]:not(#seleziona-tutte-categorie-stampa)');
            const checkedCheckboxes = document.querySelectorAll('#categoriePerStampaContainer input[type="checkbox"]:not(#seleziona-tutte-categorie-stampa):checked');
            selezionaTutteCheckbox.checked = allCheckboxes.length === checkedCheckboxes.length;
        });
    });
    
    // Mostra il modal
    showModal(modalSelezioneCategorie);
}

// Modal per la selezione dei materiali prima della stampa
function mostraSelezioneMaterialiPrimaDiStampare(tipoStampa, titolo, cliente) {
    // Crea il modal se non esiste
    let modalSelezioneMateriali = document.getElementById('modalSelezioneMateriali');
    
    if (!modalSelezioneMateriali) {
        modalSelezioneMateriali = document.createElement('div');
        modalSelezioneMateriali.id = 'modalSelezioneMateriali';
        modalSelezioneMateriali.className = 'modal';
        
        // Crea il contenuto del modal
        modalSelezioneMateriali.innerHTML = `
            <div class="modal-content">
                <h3>Seleziona le categorie con materiali da stampare</h3>
                <div id="materialiPerStampaContainer" class="materiali-stampa-container">
                    <!-- Le categorie verranno generate dinamicamente -->
                </div>
                <div class="modal-buttons">
                    <button id="annullaStampaMaterialiBtn">Annulla</button>
                    <button id="confermaStampaMaterialiBtn">Conferma e Stampa</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalSelezioneMateriali);
    }
    
    // Aggiorna il contenuto delle categorie
    const container = document.getElementById('materialiPerStampaContainer');
    container.innerHTML = '';
    
    // Aggiungi checkbox per selezionare/deselezionare tutte le categorie
    const headerDiv = document.createElement('div');
    headerDiv.className = 'materiali-selection-header';
    headerDiv.innerHTML = `
        <label class="select-all-label">
            <input type="checkbox" id="seleziona-tutte-categorie-stampa" checked>
            <span class="checkbox-label">Seleziona/Deseleziona tutte</span>
        </label>
    `;
    container.appendChild(headerDiv);
    
    // Ottieni le categorie con materiali
    const categorieConMateriali = [];
    const categorieIndici = [];
    
    // Verifica per ogni categoria se ha materiali associati
    categorie.forEach((categoria, categoriaIndex) => {
        const haMateriali = categoria.lavorazioni.some(lavorazione => {
            const codiceUnivoco = `cat${categoriaIndex}_${lavorazione.numero}`;
            return materiali[codiceUnivoco] && materiali[codiceUnivoco].length > 0;
        });
        
        if (haMateriali) {
            categorieConMateriali.push(categoria);
            categorieIndici.push(categoriaIndex);
        }
    });
    
    // Aggiungi un checkbox per ogni categoria con materiali
    categorieConMateriali.forEach((categoria, index) => {
        const categoriaIndexOriginale = categorieIndici[index];
        const categoriaDiv = document.createElement('div');
        categoriaDiv.className = 'materiale-checkbox';
        categoriaDiv.innerHTML = `
            <label>
                <input type="checkbox" value="${categoriaIndexOriginale}" checked>
                <span class="checkbox-label">${categoria.nome}</span>
            </label>
        `;
        container.appendChild(categoriaDiv);
    });
    
    // Event listener per il pulsante Annulla
    const annullaBtn = document.getElementById('annullaStampaMaterialiBtn');
    annullaBtn.onclick = () => hideModal(modalSelezioneMateriali);
    
    // Event listener per il pulsante Conferma e Stampa
    const confermaBtn = document.getElementById('confermaStampaMaterialiBtn');
    confermaBtn.onclick = () => {
        // Raccogli le categorie selezionate
        const checkboxes = document.querySelectorAll('#materialiPerStampaContainer input[type="checkbox"]:checked');
        const categorieSelezionate = Array.from(checkboxes)
            .map(cb => parseInt(cb.value))
            .filter(val => !isNaN(val));
        
        // Nascondi questo modal
        hideModal(modalSelezioneMateriali);
        
        // Esegui la stampa con le categorie selezionate
        preparaStampa(tipoStampa, titolo, cliente, categorieSelezionate);
    };
    
    // Chiudi modal cliccando fuori
    modalSelezioneMateriali.addEventListener('click', (e) => {
        if (e.target === modalSelezioneMateriali) {
            hideModal(modalSelezioneMateriali);
        }
    });
    
    // Aggiungi event listener per il checkbox "seleziona tutti"
    const selezionaTutteCheckbox = document.getElementById('seleziona-tutte-categorie-stampa');
    selezionaTutteCheckbox.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        document.querySelectorAll('#materialiPerStampaContainer input[type="checkbox"]:not(#seleziona-tutte-categorie-stampa)').forEach(cb => {
            cb.checked = isChecked;
        });
    });
    
    // Mostra il modal
    showModal(modalSelezioneMateriali);
}

// Modal per la selezione delle squadre prima della stampa
function mostraSelezioneSquadrePrimaDiStampare(tipoStampa, titolo, cliente) {
    // Crea il modal se non esiste
    let modalSelezioneSquadre = document.getElementById('modalSelezioneSquadre');
    
    if (!modalSelezioneSquadre) {
        modalSelezioneSquadre = document.createElement('div');
        modalSelezioneSquadre.id = 'modalSelezioneSquadre';
        modalSelezioneSquadre.className = 'modal';
        
        // Crea il contenuto del modal
        modalSelezioneSquadre.innerHTML = `
            <div class="modal-content">
                <h3>Seleziona le squadre da stampare</h3>
                <div id="squadrePerStampaContainer" class="squadre-stampa-container">
                    <!-- Le squadre verranno generate dinamicamente -->
                </div>
                <div class="modal-buttons">
                    <button id="annullaStampaSquadreBtn">Annulla</button>
                    <button id="confermaStampaSquadreBtn">Conferma e Stampa</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalSelezioneSquadre);
    }
    
    // Aggiorna il contenuto delle squadre
    const container = document.getElementById('squadrePerStampaContainer');
    container.innerHTML = '';
    
    // Ottieni tutte le squadre
    const squadre = raggruppaPerSquadra();
    const squadreList = [];
    
    Object.keys(squadre).forEach(key => {
        if (squadre[key].operaiIds.length > 0) {
            const nomiOperai = squadre[key].operaiIds.map(id => {
                const operaio = operai.find(o => o.id === id);
                return operaio ? `${operaio.nome} ${operaio.cognome}` : '';
            }).filter(nome => nome !== '').join(', ');
            
            squadreList.push({
                key: key,
                nome: nomiOperai
            });
        }
    });
    
    // Aggiungi checkbox per selezionare/deselezionare tutte le squadre
    const headerDiv = document.createElement('div');
    headerDiv.className = 'squadre-selection-header';
    headerDiv.innerHTML = `
        <label class="select-all-label">
            <input type="checkbox" id="seleziona-tutte-squadre-stampa" checked>
            <span class="checkbox-label">Seleziona/Deseleziona tutte</span>
        </label>
    `;
    container.appendChild(headerDiv);
    
    // Aggiungi un checkbox per ogni squadra
    squadreList.forEach(squadra => {
        const squadraDiv = document.createElement('div');
        squadraDiv.className = 'squadra-checkbox';
        squadraDiv.innerHTML = `
            <label>
                <input type="checkbox" value="${squadra.key}" checked>
                <span class="checkbox-label">${squadra.nome}</span>
            </label>
        `;
        container.appendChild(squadraDiv);
    });
    
    // Rimuovi eventuali event listener precedenti
    const annullaBtn = document.getElementById('annullaStampaSquadreBtn');
    const confermaBtn = document.getElementById('confermaStampaSquadreBtn');
    
    // Clona i pulsanti per rimuovere gli event listener
    const newAnnullaBtn = annullaBtn.cloneNode(true);
    const newConfermaBtn = confermaBtn.cloneNode(true);
    
    annullaBtn.parentNode.replaceChild(newAnnullaBtn, annullaBtn);
    confermaBtn.parentNode.replaceChild(newConfermaBtn, confermaBtn);
    
    // Aggiungi nuovi event listener
    newAnnullaBtn.addEventListener('click', () => {
        hideModal(modalSelezioneSquadre);
    });
    
    newConfermaBtn.addEventListener('click', () => {
        // Raccogli le squadre selezionate
        const checkboxes = document.querySelectorAll('#squadrePerStampaContainer input[type="checkbox"]:checked');
        const squadreSelezionate = Array.from(checkboxes).map(cb => cb.value);
        
        // Nascondi questo modal
        hideModal(modalSelezioneSquadre);
        
        // Esegui la stampa con le squadre selezionate
        preparaStampa(tipoStampa, titolo, cliente, squadreSelezionate);
    });
    
    // Chiudi modal cliccando fuori
    modalSelezioneSquadre.addEventListener('click', (e) => {
        if (e.target === modalSelezioneSquadre) {
            hideModal(modalSelezioneSquadre);
        }
    });
    
    // Aggiungi event listener per il checkbox "seleziona tutte"
    const selezionaTutteCheckbox = document.getElementById('seleziona-tutte-squadre-stampa');
    selezionaTutteCheckbox.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        document.querySelectorAll('#squadrePerStampaContainer input[type="checkbox"]:not(#seleziona-tutte-squadre-stampa)').forEach(cb => {
            cb.checked = isChecked;
        });
    });
    
    // Aggiungi event listener per aggiornare il checkbox "seleziona tutte" quando cambia una selezione
    document.querySelectorAll('#squadrePerStampaContainer input[type="checkbox"]:not(#seleziona-tutte-squadre-stampa)').forEach(cb => {
        cb.addEventListener('change', () => {
            const allCheckboxes = document.querySelectorAll('#squadrePerStampaContainer input[type="checkbox"]:not(#seleziona-tutte-squadre-stampa)');
            const checkedCheckboxes = document.querySelectorAll('#squadrePerStampaContainer input[type="checkbox"]:not(#seleziona-tutte-squadre-stampa):checked');
            selezionaTutteCheckbox.checked = allCheckboxes.length === checkedCheckboxes.length;
        });
    });
    
    // Mostra il modal
    showModal(modalSelezioneSquadre);
}

// Funzione per gestire il click sui pulsanti di stampa, ora mostra il modal di selezione
function inizializzaStampa(tipo) {
    // Nascondi il modal del titolo
    hideModal(titoloModal);
    
    // Ottieni il titolo e il nome cliente (estrai i valori dagli input)
    let titolo = document.getElementById('titoloInput').value;
    let cliente = document.getElementById('clienteInput').value;
    
    // Verifica se ci sono categorie disponibili
    if (categorie.length === 0) {
        alert('Non ci sono categorie disponibili per la stampa.');
        return;
    }
    
    // In base al tipo di stampa, mostra il modal appropriato per la selezione
    switch(tipo) {
        case 'organizzazione':
        case 'richiestaOfferta':
        case 'offerta':
            mostraSelezioneCategoriePrimaDiStampare(
                tipo === 'organizzazione' ? 'Organizzazione cantiere' : 
                tipo === 'richiestaOfferta' ? 'Richiesta offerta' : 'Offerta',
                titolo, cliente
            );
            break;
            
        case 'richiestaMateriali':
        case 'costoMateriali':
            // Controlla se ci sono categorie con materiali
            const categorieConMateriali = trovaCategorieConMateriali();
            if (categorieConMateriali.length === 0) {
                alert('Non ci sono materiali disponibili per la stampa.');
                return;
            }
            
            mostraSelezioneMaterialiPrimaDiStampare(
                tipo === 'richiestaMateriali' ? 'Richiesta materiali' : 'Costo materiali',
                titolo, cliente
            );
            break;
            
        case 'gestioneOperai':
            mostraSelezioneSquadrePrimaDiStampare('Gestione operai', titolo, cliente);
            break;
    }
}

// Funzione per trovare categorie che hanno materiali
function trovaCategorieConMateriali() {
    const result = [];
    categorie.forEach((categoria, categoriaIndex) => {
        const haMateriali = categoria.lavorazioni.some(lavorazione => {
            const codiceUnivoco = `cat${categoriaIndex}_${lavorazione.numero}`;
            return materiali[codiceUnivoco] && materiali[codiceUnivoco].length > 0;
        });
        
        if (haMateriali) {
            result.push({
                categoria: categoria,
                index: categoriaIndex
            });
        }
    });
    return result;
}

// Funzione per aggiungere il riquadro firma (non più necessaria con la nuova mascherina)
function aggiungiRiquadroFirma() {
    // Non fa più nulla perché le firme sono già nella mascherina
    return;
}

// Funzione per aggiornare il modal di stampa con i nuovi pulsanti
function aggiornaModalStampa() {
    // Svuota i contenuti del modal
    const modalContent = document.querySelector('#titoloModal .modal-content');
    if (!modalContent) return;
    
    // Mantieni solo i campi di input e i pulsanti di annulla
    modalContent.innerHTML = `
        <h3>Inserisci i dati per la stampa</h3>
        <input type="text" id="titoloInput" placeholder="Inserisci il titolo">
        <input type="text" id="clienteInput" placeholder="Nome del cliente">
        <div class="modal-buttons">
            <button id="annullaTitolo">Annulla</button>
            <button id="stampaOrganizzazioneBtn">Organizzazione Cantiere</button>
            <button id="stampaRichiestaMaterialiBtn">Richiesta Materiali</button>
            <button id="stampaRichiestaOffertaBtn">Richiesta Offerta</button>
            <button id="stampaCostoMaterialiBtn">Costo Materiali</button>
            <button id="stampaOffertaBtn">Offerta</button>
            <button id="stampaGestioneOperaiBtn">Piano di Lavoro Operai</button>
        </div>
    `;
    
    // Ottenere nuovi riferimenti agli elementi senza riassegnare le variabili const
    const nuovoTitoloInput = document.getElementById('titoloInput');
    const nuovoClienteInput = document.getElementById('clienteInput');
    const nuovoStampaOrganizzazioneBtn = document.getElementById('stampaOrganizzazioneBtn');
    
    // Aggiungi event listeners per i pulsanti
    document.getElementById('annullaTitolo').addEventListener('click', () => {
        hideModal(titoloModal);
    });
    
    // Event listeners per i pulsanti di stampa
    document.getElementById('stampaOrganizzazioneBtn').addEventListener('click', () => {
        inizializzaStampa('organizzazione');
    });
    
    document.getElementById('stampaRichiestaMaterialiBtn').addEventListener('click', () => {
        inizializzaStampa('richiestaMateriali');
    });
    
    document.getElementById('stampaRichiestaOffertaBtn').addEventListener('click', () => {
        inizializzaStampa('richiestaOfferta');
    });
    
    document.getElementById('stampaCostoMaterialiBtn').addEventListener('click', () => {
        inizializzaStampa('costoMateriali');
    });
    
    document.getElementById('stampaOffertaBtn').addEventListener('click', () => {
        inizializzaStampa('offerta');
    });
    
    document.getElementById('stampaGestioneOperaiBtn').addEventListener('click', () => {
        inizializzaStampa('gestioneOperai');
    });
    
    // Gestisci tasto Enter per il titolo di stampa
    nuovoTitoloInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            nuovoClienteInput.focus();
        }
    });

    nuovoClienteInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            nuovoStampaOrganizzazioneBtn.click();
        }
    });
}

// Funzione per pulire il contenitore di stampa
function pulisciContenutoStampa() {
    if (printContentContainer) {
        printContentContainer.innerHTML = '';
    }
    
    // Assicurati che il container di stampa sia vuoto prima di iniziare una nuova stampa
    if (printContainer) {
        // Mantieni solo l'intestazione e rimuovi tutti gli altri elementi
        const headerElement = printContainer.querySelector('.print-header-page');
        if (headerElement) {
            // Salva l'intestazione
            const headerClone = headerElement.cloneNode(true);
            
            // Svuota il container
            printContainer.innerHTML = '';
            
            // Ripristina l'intestazione e il container del contenuto
            printContainer.appendChild(headerClone);
            
            // Ricrea il container del contenuto
            printContentContainer = document.createElement('div');
            printContentContainer.id = 'printContentContainer';
            printContainer.appendChild(printContentContainer);
        }
    }
}

// Funzione per pulire gli elementi di stampa residui
function cleanupPrintElements() {
    // Rimuovi elementi relativi alla stampa che potrebbero essere rimasti
    const elementsToRemove = [
        '.print-header:not(.print-header-page)', 
        '.print-footer', 
        '.print-page-mask',
        '.firma-riquadro',
        '.page-content-after-mask'
    ];
    
    elementsToRemove.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => element.remove());
    });
    
    // Nascondi il container di stampa
    if (printContainer) {
        printContainer.style.display = 'none';
    }
    
    // Rimuovi la classe no-print da tutti gli elementi
    document.querySelectorAll('.no-print').forEach(el => {
        // Solo se non ha già questa classe in CSS
        if (!el.classList.contains('no-print-permanent')) {
            el.classList.remove('no-print');
        }
    });
}

// =============================================================================
// SEZIONE 4: GENERAZIONE DEI CONTENUTI DI STAMPA
// =============================================================================

// Organizzazione cantiere - Tabella con Voci e Quantità
function generaStampaOrganizzazioneCantiere(categorieSelezionate) {
    if (!printContentContainer) return;
    
    // Filtra le categorie in base alla selezione
    const categorieDaStampare = categorieSelezionate 
        ? categorie.filter((cat, index) => categorieSelezionate.includes(index))
        : categorie;
    
    categorieDaStampare.forEach((categoria, index) => {
        // Ottieni l'indice originale della categoria nell'array principale
        const categoriaIndexOriginale = categorie.findIndex(c => c.nome === categoria.nome);
        
        // Crea la tabella per questa categoria
        const table = document.createElement('table');
        table.className = 'print-table print-organizzazione-table';
        table.style.tableLayout = 'fixed';
        table.style.width = '100%';
        
        // Ottieni gli operai assegnati alla categoria
        const nomiOperai = getNomiOperaiPerCategoria(categoriaIndexOriginale);
        
        // Intestazione tabella
        let tableHTML = `
            <colgroup>
                <col style="width: 80%;">
                <col style="width: 20%;">
            </colgroup>
            <thead>
                <tr>
                    <th colspan="2" class="print-category-header">
                        ${categoria.nome}
                        ${nomiOperai !== '-' ? `<div style="font-size: 0.9em; margin-top: 5px;">Squadra: ${nomiOperai}</div>` : ''}
                    </th>
                </tr>
                <tr>
                    <th style="text-align: left;">Voce</th>
                    <th style="text-align: center;">Quantità</th>
                </tr>
            </thead>
            <tbody>`;
        
        // Aggiungi le righe per ogni lavorazione
        categoria.lavorazioni.forEach(lavorazione => {
            tableHTML += `
                <tr>
                    <td style="text-align: left; width: 80%;">${lavorazione.nome}</td>
                    <td style="text-align: center; width: 20%;">${lavorazione.quantita || ''}</td>
                </tr>`;
        });
        
        // Aggiungi le righe per operai e giornate
        const totaleImporti = categoria.lavorazioni.reduce((acc, lavorazione) => {
            return acc + (lavorazione.importoManodoperaRaw || parseEuroToNumber(lavorazione.importoManodopera) || 0);
        }, 0);
        
        const giornateLavorative = calcolaGiornateMassime(totaleImporti, categoria.numeroOperai, categoria.sconto);
        
        // Aggiungi informazioni sulle date se sono state impostate
        let infoDate = '';
        if (categoria.dataInizio || categoria.dataFine) {
            const dataInizioFormattata = categoria.dataInizio ? formatDate(categoria.dataInizio) : '-';
            const dataFineFormattata = categoria.dataFine ? formatDate(categoria.dataFine) : '-';
            const durata = (categoria.dataInizio && categoria.dataFine) ? 
                calcolaDurataGiorni(categoria.dataInizio, categoria.dataFine) : '-';
            
            infoDate = `
                <tr class="date-row">
                    <td style="text-align: left; width: 80%;"><strong>Data inizio</strong></td>
                    <td style="text-align: center; width: 20%;">${dataInizioFormattata}</td>
                </tr>
                <tr class="date-row">
                    <td style="text-align: left; width: 80%;"><strong>Data fine</strong></td>
                    <td style="text-align: center; width: 20%;">${dataFineFormattata}</td>
                </tr>`;
        }
        
        tableHTML += `
                <tr class="print-totale-row">
                    <td style="text-align: left; width: 80%;"><strong>Numero operai</strong></td>
                    <td style="text-align: center; width: 20%;">${categoria.numeroOperai || '-'}</td>
                </tr>
                <tr class="print-totale-row">
                    <td style="text-align: left; width: 80%;"><strong>Giornate lavorative</strong></td>
                    <td style="text-align: center; width: 20%;">${giornateLavorative}</td>
                </tr>
                ${infoDate}
            </tbody>`;
        
        table.innerHTML = tableHTML;
        printContentContainer.appendChild(table);
        
        // Aggiungi le note se presenti
        if (categoria.note && categoria.note.trim() !== '') {
            const noteDiv = document.createElement('div');
            noteDiv.className = 'print-note';
            noteDiv.innerHTML = `
                <div style="margin-bottom: 20px;">
                    <strong>NOTE:</strong>
                    <div style="padding: 10px; border: 1px solid #dee2e6; margin-top: 5px;">
                        ${categoria.note}
                    </div>
                </div>`;
            printContentContainer.appendChild(noteDiv);
        }
        
        // Aggiungi un separatore di pagina se non è l'ultima categoria
        if (index < categorieDaStampare.length - 1) {
            const pageSeparator = document.createElement('div');
            pageSeparator.className = 'print-page-break';
            printContentContainer.appendChild(pageSeparator);
        }
    });
    
    // Aggiungi il riquadro per la firma
    aggiungiRiquadroFirma();
}

// Richiesta materiali - Tabelle materiali con prezzi vuoti
function generaStampaRichiestaMateriali(categorieSelezionate) {
    if (!printContentContainer) return;
    
    // Ottieni tutte le lavorazioni
    const lavorazioni = getAllLavorazioni();
    
    // Filtra le lavorazioni in base alle categorie selezionate
    const lavorazioniDaStampare = categorieSelezionate && categorieSelezionate.length > 0
        ? lavorazioni.filter(lav => categorieSelezionate.includes(lav.categoriaIndex))
        : lavorazioni;
    
    // Contatore per tenere traccia di quante lavorazioni con materiali sono state stampate
    let lavorazioniConMaterialiStampate = 0;
    
    lavorazioniDaStampare.forEach((lavorazione, index) => {
        // Genera il codice univoco per questa lavorazione
        const codiceUnivocoLavorazione = `cat${lavorazione.categoriaIndex}_${lavorazione.numero}`;
        
        // Salta le lavorazioni che non hanno materiali
        if (!materiali[codiceUnivocoLavorazione] || materiali[codiceUnivocoLavorazione].length === 0) {
            return;
        }
        
        // Incrementa il contatore di lavorazioni con materiali
        lavorazioniConMaterialiStampate++;
        
        // Crea la tabella per questa lavorazione
        const table = document.createElement('table');
        table.className = 'print-table print-materiali-table';
        
        // Intestazione tabella
        let tableHTML = `
            <thead>
                <tr>
                    <th colspan="5" class="print-category-header">
                        ${lavorazione.numero} - ${lavorazione.nome}
                        <span style="float: right; font-style: italic;">Quantità: ${lavorazione.quantita || '-'}</span>
                    </th>
                </tr>
                <tr>
                    <th style="width: 40%;">Materiale</th>
                    <th style="width: 10%;">Unità</th>
                    <th style="width: 15%;">Quantità</th>
                    <th style="width: 15%;">Prezzo Unitario</th>
                    <th style="width: 20%;">Prezzo Totale</th>
                </tr>
            </thead>
            <tbody>`;
        
        // Aggiungi le righe per ogni materiale, con prezzi vuoti
        materiali[codiceUnivocoLavorazione].forEach(materiale => {
            tableHTML += `
                <tr>
                    <td style="text-align: left;">${materiale.descrizione}</td>
                    <td style="text-align: center;">${materiale.unitaMisura}</td>
                    <td style="text-align: center;">${materiale.quantita || ''}</td>
                    <td></td>
                    <td></td>
                </tr>`;
        });
        
        tableHTML += `</tbody>`;
        
        table.innerHTML = tableHTML;
        printContentContainer.appendChild(table);
        
        // Verifica se ci sono altre lavorazioni con materiali da stampare
        let altreConMateriali = false;
        for (let i = index + 1; i < lavorazioniDaStampare.length; i++) {
            const codiceL = `cat${lavorazioniDaStampare[i].categoriaIndex}_${lavorazioniDaStampare[i].numero}`;
            if (materiali[codiceL] && materiali[codiceL].length > 0) {
                altreConMateriali = true;
                break;
            }
        }
        
        // Aggiungi un separatore di pagina se non è l'ultima lavorazione con materiali
        if (altreConMateriali) {
            const pageSeparator = document.createElement('div');
            pageSeparator.className = 'print-page-break';
            printContentContainer.appendChild(pageSeparator);
        }
    });
    
    // Se non ci sono lavorazioni con materiali, mostra un messaggio
    if (lavorazioniConMaterialiStampate === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'print-empty-state';
        emptyDiv.innerHTML = '<p>Nessun materiale disponibile per le categorie selezionate.</p>';
        printContentContainer.appendChild(emptyDiv);
    }
    
    // Aggiungi il riquadro per la firma
    aggiungiRiquadroFirma();
}

// Richiesta offerta - Tabelle categorie con prezzi vuoti
function generaStampaRichiestaOfferta(categorieSelezionate) {
    if (!printContentContainer) return;
    
    // Crea la tabella principale dell'offerta
    const table = document.createElement('table');
    table.className = 'print-table print-offerta-table';
    
    // Intestazione tabella
    let tableHTML = `
        <thead>
            <tr>
                <th style="width: 50%;">Lavorazione</th>
                <th style="width: 15%;">Quantità</th>
                <th style="width: 15%;">Prezzo Unitario</th>
                <th style="width: 20%;">Prezzo Totale</th>
            </tr>
        </thead>
        <tbody>`;
    
    // Filtra le categorie in base alla selezione
    const categorieDaStampare = categorieSelezionate
        ? categorie.filter((cat, index) => categorieSelezionate.includes(index))
        : categorie;
    
    // Aggiungi le righe raggruppate per categoria
    let totaleGenerale = 0;
    
    categorieDaStampare.forEach(categoria => {
        // Intestazione categoria
        tableHTML += `
            <tr>
                <td colspan="4" class="print-category-header">${categoria.nome}</td>
            </tr>`;
        
        // Righe per le lavorazioni
        let totaleCategoria = 0;
        
        categoria.lavorazioni.forEach(lavorazione => {
            const totaleVoce = (lavorazione.prezzoUnitarioRaw || parseEuroToNumber(lavorazione.prezzoUnitario) || 0) * 
                               (parseFloat(lavorazione.quantita) || 0);
            
            totaleCategoria += totaleVoce;
            
            tableHTML += `
                <tr>
                    <td style="text-align: left;">${lavorazione.numero} - ${lavorazione.nome}</td>
                    <td style="text-align: center;">${lavorazione.quantita || ''}</td>
                    <td></td>
                    <td></td>
                </tr>`;
        });
        
        // Totale categoria
        totaleGenerale += totaleCategoria;
        
        tableHTML += `
            <tr class="print-totale-row">
                <td colspan="3" style="text-align: right;"><strong>Totale ${categoria.nome}</strong></td>
                <td></td>
            </tr>`;
    });
    
    // Totale generale
    tableHTML += `
            <tr class="print-totale-row">
                <td colspan="3" style="text-align: right;"><strong>TOTALE GENERALE</strong></td>
                <td></td>
            </tr>
        </tbody>`;
    
    table.innerHTML = tableHTML;
    printContentContainer.appendChild(table);
    
    // Aggiungi il riquadro per la firma
    aggiungiRiquadroFirma();
}

// Costo materiali - Tabelle materiali con prezzi
function generaStampaCostoMateriali(categorieSelezionate) {
    if (!printContentContainer) return;
    
    // Ottieni tutte le lavorazioni
    const lavorazioni = getAllLavorazioni();
    
    // Filtra le lavorazioni in base alle categorie selezionate
    const lavorazioniDaStampare = categorieSelezionate && categorieSelezionate.length > 0
        ? lavorazioni.filter(lav => categorieSelezionate.includes(lav.categoriaIndex))
        : lavorazioni;
    
    // Contatore per tenere traccia di quante lavorazioni con materiali sono state stampate
    let lavorazioniConMaterialiStampate = 0;
    
    lavorazioniDaStampare.forEach((lavorazione, index) => {
        // Genera il codice univoco per questa lavorazione
        const codiceUnivocoLavorazione = `cat${lavorazione.categoriaIndex}_${lavorazione.numero}`;
        
        // Salta le lavorazioni che non hanno materiali
        if (!materiali[codiceUnivocoLavorazione] || materiali[codiceUnivocoLavorazione].length === 0) {
            return;
        }
        
        // Incrementa il contatore di lavorazioni con materiali
        lavorazioniConMaterialiStampate++;
        
        // Crea la tabella per questa lavorazione
        const table = document.createElement('table');
        table.className = 'print-table print-materiali-table';
        
        // Intestazione tabella
        let tableHTML = `
            <thead>
                <tr>
                    <th colspan="5" class="print-category-header">
                        ${lavorazione.numero} - ${lavorazione.nome}
                        <span style="float: right; font-style: italic;">Quantità: ${lavorazione.quantita || '-'}</span>
                    </th>
                </tr>
                <tr>
                    <th style="width: 40%;">Materiale</th>
                    <th style="width: 10%;">Unità</th>
                    <th style="width: 15%;">Quantità</th>
                    <th style="width: 15%;">Prezzo Unitario</th>
                    <th style="width: 20%;">Prezzo Totale</th>
                </tr>
            </thead>
            <tbody>`;
        
        // Calcola il totale dei materiali per questa lavorazione
        let totaleMateriali = 0;
        
        // Aggiungi le righe per ogni materiale
        materiali[codiceUnivocoLavorazione].forEach(materiale => {
            const prezzo = parseEuroToNumber(materiale.prezzo) || 0;
            const quantita = parseFloat(materiale.quantita) || 0;
            const totale = prezzo * quantita;
            
            totaleMateriali += totale;
            
            tableHTML += `
                <tr>
                    <td style="text-align: left;">${materiale.descrizione}</td>
                    <td style="text-align: center;">${materiale.unitaMisura}</td>
                    <td style="text-align: center;">${materiale.quantita || ''}</td>
                    <td style="text-align: right;">${formatCurrency(prezzo)}</td>
                    <td style="text-align: right;">${formatCurrency(totale)}</td>
                </tr>`;
        });
        
        // Aggiungi riga per il totale
        tableHTML += `
                <tr class="print-totale-row">
                    <td colspan="4" style="text-align: right;"><strong>Totale Materiali</strong></td>
                    <td style="text-align: right;"><strong>${formatCurrency(totaleMateriali)}</strong></td>
                </tr>
            </tbody>`;
        
        table.innerHTML = tableHTML;
        printContentContainer.appendChild(table);
        
        // Verifica se ci sono altre lavorazioni con materiali da stampare
        let altreConMateriali = false;
        for (let i = index + 1; i < lavorazioniDaStampare.length; i++) {
            const codiceL = `cat${lavorazioniDaStampare[i].categoriaIndex}_${lavorazioniDaStampare[i].numero}`;
            if (materiali[codiceL] && materiali[codiceL].length > 0) {
                altreConMateriali = true;
                break;
            }
        }
        
        // Aggiungi un separatore di pagina se non è l'ultima lavorazione con materiali
        if (altreConMateriali) {
            const pageSeparator = document.createElement('div');
            pageSeparator.className = 'print-page-break';
            printContentContainer.appendChild(pageSeparator);
        }
    });
    
    // Se non ci sono lavorazioni con materiali, mostra un messaggio
    if (lavorazioniConMaterialiStampate === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'print-empty-state';
        emptyDiv.innerHTML = '<p>Nessun materiale disponibile per le categorie selezionate.</p>';
        printContentContainer.appendChild(emptyDiv);
    }
    
    // Aggiungi il riquadro per la firma
    aggiungiRiquadroFirma();
}

// Offerta - Tabelle categorie con prezzi
function generaStampaOfferta(categorieSelezionate) {
    if (!printContentContainer) return;
    
    // Crea la tabella principale dell'offerta
    const table = document.createElement('table');
    table.className = 'print-table print-offerta-table';
    
    // Intestazione tabella
    let tableHTML = `
        <thead>
            <tr>
                <th style="width: 50%;">Lavorazione</th>
                <th style="width: 15%;">Quantità</th>
                <th style="width: 15%;">Prezzo Unitario</th>
                <th style="width: 20%;">Prezzo Totale</th>
            </tr>
        </thead>
        <tbody>`;
    
    // Filtra le categorie in base alla selezione
    const categorieDaStampare = categorieSelezionate
        ? categorie.filter((cat, index) => categorieSelezionate.includes(index))
        : categorie;
    
    // Aggiungi le righe raggruppate per categoria
    let totaleGenerale = 0;
    
    categorieDaStampare.forEach((categoria, categoriaIndex) => {
        // Ottieni l'indice originale (potrebbe essere diverso se ci sono categorie filtrate)
        const indexOriginale = categorie.findIndex(c => c.nome === categoria.nome);
        
        // Intestazione categoria
        tableHTML += `
            <tr>
                <td colspan="4" class="print-category-header">${categoria.nome}</td>
            </tr>`;
        
        // Righe per le lavorazioni
        let totaleCategoria = 0;
        
        categoria.lavorazioni.forEach(lavorazione => {
            const prezzoUnitario = lavorazione.prezzoUnitarioRaw || parseEuroToNumber(lavorazione.prezzoUnitario) || 0;
            const quantita = parseFloat(lavorazione.quantita) || 0;
            const totaleVoce = prezzoUnitario * quantita;
            
            totaleCategoria += totaleVoce;
            
            tableHTML += `
                <tr>
                    <td style="text-align: left;">${lavorazione.numero} - ${lavorazione.nome}</td>
                    <td style="text-align: center;">${lavorazione.quantita || ''}</td>
                    <td style="text-align: right;">${formatCurrency(prezzoUnitario)}</td>
                    <td style="text-align: right;">${formatCurrency(totaleVoce)}</td>
                </tr>`;
        });
        
        // Totale categoria
        totaleGenerale += totaleCategoria;
        
        tableHTML += `
            <tr class="print-totale-row">
                <td colspan="3" style="text-align: right;"><strong>Totale ${categoria.nome}</strong></td>
                <td style="text-align: right;"><strong>${formatCurrency(totaleCategoria)}</strong></td>
            </tr>`;
    });
    
    // Totale generale
    tableHTML += `
            <tr class="print-totale-row">
                <td colspan="3" style="text-align: right;"><strong>TOTALE GENERALE</strong></td>
                <td style="text-align: right;"><strong>${formatCurrency(totaleGenerale)}</strong></td>
            </tr>
        </tbody>`;
    
    table.innerHTML = tableHTML;
    printContentContainer.appendChild(table);
    
    // Aggiungi il riquadro per la firma
    aggiungiRiquadroFirma();
}

// Gestione operai - Tabelle squadre con categorie assegnate
function generaStampaGestioneOperai(squadreSelezionate) {
    if (!printContentContainer) return;
    
    // Ottieni le squadre
    const squadre = raggruppaPerSquadra();
    
    // Filtra le squadre se necessario
    const squadreKeys = squadreSelezionate || Object.keys(squadre);
    
    let squadreVuote = true;
    
    squadreKeys.forEach((squadraKey, squadraIndex) => {
        const squadra = squadre[squadraKey];
        
        if (!squadra || !squadra.operaiIds || squadra.operaiIds.length === 0) return;
        
        squadreVuote = false;
        
        // Crea l'intestazione della squadra
        const nomiOperai = squadra.operaiIds.map(id => {
            const operaio = operai.find(o => o.id === id);
            return operaio ? `${operaio.nome} ${operaio.cognome}` : 'Operaio sconosciuto';
        }).join(', ');
        
        const headerDiv = document.createElement('div');
        headerDiv.className = 'print-squadra-header';
        headerDiv.innerHTML = `<h2>Squadra: ${nomiOperai}</h2>`;
        printContentContainer.appendChild(headerDiv);
        
        // Crea la tabella per questa squadra
        const table = document.createElement('table');
        table.className = 'print-table print-squadra-table';
        
        // Intestazione tabella
        let tableHTML = `
            <thead>
                <tr>
                    <th style="width: 50%;">Categoria</th>
                    <th style="width: 15%;">Data Inizio</th>
                    <th style="width: 15%;">Data Fine</th>
                    <th style="width: 20%;">Durata (giorni)</th>
                </tr>
            </thead>
            <tbody>`;
        
        // Calcola la data di inizio e fine complessiva per la squadra
        let dataInizioSquadra = null;
        let dataFineSquadra = null;
        
        // Aggiungi le righe per ogni categoria assegnata a questa squadra
        squadra.categorie.forEach(categoria => {
            const dataInizio = categoria.dataInizio ? formatDate(categoria.dataInizio) : '-';
            const dataFine = categoria.dataFine ? formatDate(categoria.dataFine) : '-';
            const durata = (categoria.dataInizio && categoria.dataFine) ? 
                calcolaDurataGiorni(categoria.dataInizio, categoria.dataFine) : '-';
            
            // Aggiorna le date minima e massima per la squadra
            if (categoria.dataInizio) {
                const dataCategoria = new Date(categoria.dataInizio);
                if (!dataInizioSquadra || dataCategoria < dataInizioSquadra) {
                    dataInizioSquadra = dataCategoria;
                }
            }
            
            if (categoria.dataFine) {
                const dataCategoria = new Date(categoria.dataFine);
                if (!dataFineSquadra || dataCategoria > dataFineSquadra) {
                    dataFineSquadra = dataCategoria;
                }
            }
            
            tableHTML += `
                <tr>
                    <td style="text-align: left;">${categoria.nome}</td>
                    <td style="text-align: center;">${dataInizio}</td>
                    <td style="text-align: center;">${dataFine}</td>
                    <td style="text-align: center;">${durata}</td>
                </tr>`;
        });
        
        // Calcola la durata totale per la squadra
        let durataTotaleSquadra = '-';
        if (dataInizioSquadra && dataFineSquadra) {
            durataTotaleSquadra = calcolaDurataGiorni(
                dataInizioSquadra.toISOString().split('T')[0],
                dataFineSquadra.toISOString().split('T')[0]
            );
        }
        
        // Aggiungi la riga del totale con le date complessive
        tableHTML += `
                <tr class="print-totale-row">
                    <td style="text-align: left;"><strong>Totale Categorie: ${squadra.categorie.length}</strong></td>
                    <td style="text-align: center;"><strong>${dataInizioSquadra ? formatDate(dataInizioSquadra) : '-'}</strong></td>
                    <td style="text-align: center;"><strong>${dataFineSquadra ? formatDate(dataFineSquadra) : '-'}</strong></td>
                    <td style="text-align: center;"><strong>${durataTotaleSquadra}</strong></td>
                </tr>
            </tbody>`;
        
        table.innerHTML = tableHTML;
        printContentContainer.appendChild(table);
        
        // Aggiungi un separatore di pagina se non è l'ultima squadra
        if (squadraIndex < squadreKeys.length - 1) {
            const pageSeparator = document.createElement('div');
            pageSeparator.className = 'print-page-break';
            printContentContainer.appendChild(pageSeparator);
        }
    });
    
    // Se non ci sono squadre, mostra un messaggio
    if (squadreVuote) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'print-empty-state';
        emptyDiv.innerHTML = '<p>Non sono state assegnate squadre alle categorie.</p>';
        printContentContainer.appendChild(emptyDiv);
    }
    
    // Aggiungi il riquadro per la firma
    aggiungiRiquadroFirma();
}

// =============================================================================
// SEZIONE 5A: GESTIONE OPERAI - FUNZIONI PRINCIPALI
// =============================================================================

// Funzione per aggiornare la pagina di gestione operai
function aggiornaGestioneOperai() {
    const operaiContainer = document.getElementById('operaiContainer');
    if (!operaiContainer) return;
    
    // Pulisci il container
    operaiContainer.innerHTML = '';
    
    // Aggiungi il pulsante per la gestione dell'organico
    const organicoContainer = document.createElement('div');
    organicoContainer.className = 'operai-action-container';
    organicoContainer.innerHTML = `
        <button id="gestioneOrganico" class="operai-button">
            <img src="organico.png" width="18" height="18" class="button-icon" alt="Organico"> Gestione Organico
        </button>
    `;
    operaiContainer.appendChild(organicoContainer);
    
    // Se non ci sono operai, mostra un messaggio
    if (operai.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.textContent = 'Nessun operaio registrato. Utilizza "Gestione Organico" per aggiungere operai.';
        operaiContainer.appendChild(emptyState);
        
        // Aggiungi gli event listeners
        document.getElementById('gestioneOrganico').addEventListener('click', mostraModalOrganico);
        
        return;
    }
    
    // Raggruppa le categorie per squadra
    const squadre = raggruppaPerSquadra();
    
    // Se non ci sono squadre ma ci sono operai, mostra un messaggio
    if (Object.keys(squadre).length === 0) {
        const emptySquadreState = document.createElement('div');
        emptySquadreState.className = 'empty-state';
        emptySquadreState.textContent = 'Nessuna squadra definita. Assegna operai alle categorie dalla pagina "Categorie".';
        operaiContainer.appendChild(emptySquadreState);
    } else {
        // Crea una tabella per ogni squadra
        Object.keys(squadre).forEach(squadraKey => {
            const squadra = squadre[squadraKey];
            
            if (!squadra.operaiIds || squadra.operaiIds.length === 0) return;
            
            // Ottieni i nomi degli operai
            const nomiOperai = squadra.operaiIds.map(id => {
                const operaio = operai.find(o => o.id === id);
                return operaio ? `${operaio.nome} ${operaio.cognome}` : 'Operaio sconosciuto';
            }).join(', ');
            
            // Crea la sezione per questa squadra
            const squadraSection = document.createElement('div');
            squadraSection.className = 'squadra-section';
            
            // Header della squadra
            const squadraHeader = document.createElement('div');
            squadraHeader.className = 'squadra-header';
            squadraHeader.innerHTML = `<h3>Squadra: ${nomiOperai}</h3>`;
            
            // Crea la tabella per questa squadra
            const tableContainer = document.createElement('div');
            tableContainer.className = 'table-container';
            tableContainer.innerHTML = `
                <table class="squadra-table">
                    <thead>
                        <tr>
                            <th style="width: 40%;">Categoria</th>
                            <th style="width: 20%;">Data Inizio</th>
                            <th style="width: 20%;">Data Fine</th>
                            <th style="width: 20%;">Durata (giorni)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${squadra.categorie.map(categoria => {
                            const dataInizio = categoria.dataInizio || '';
                            const dataFine = categoria.dataFine || '';
                            let durata = '-';
                            
                            // Calcola la durata in giorni lavorativi se ci sono entrambe le date
                            if (categoria.dataInizio && categoria.dataFine) {
                                durata = calcolaDurataGiorniLavorativi(categoria.dataInizio, categoria.dataFine);
                            }
                            
                            return `
                            <tr data-categoria-index="${categoria.index}">
                                <td class="categoria-nome" data-categoria-index="${categoria.index}">${categoria.nome}</td>
                                <td class="text-center">
                                    <input type="date" class="date-input data-inizio-input" 
                                        value="${dataInizio}" 
                                        data-categoria-index="${categoria.index}">
                                </td>
                                <td class="text-center">
                                    <input type="date" class="date-input data-fine-input" 
                                        value="${dataFine}" 
                                        data-categoria-index="${categoria.index}">
                                </td>
                                <td class="text-center durata-cell">${durata}</td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            `;
            
            // Assembla la sezione completa
            squadraSection.appendChild(squadraHeader);
            squadraSection.appendChild(tableContainer);
            operaiContainer.appendChild(squadraSection);
        });
    }
    
    // Aggiungi gli event listeners
    document.getElementById('gestioneOrganico').addEventListener('click', mostraModalOrganico);
    
    // Aggiungi gli event listeners per i campi data
    aggiungiListenersDate();


   // Aggiungi event listener per navigare alla categoria quando si clicca sul nome
document.querySelectorAll('.categoria-nome').forEach(nomeCategoria => {
    nomeCategoria.addEventListener('click', (e) => {
        const categoriaIndex = e.target.dataset.categoriaIndex;
        
        // Cambia alla pagina categorie
        showPage('pageCategorie');
        
        // Recupera la sezione della categoria
        const categorySection = document.querySelector(`.category-section[data-category-index="${categoriaIndex}"]`);
        
        if (categorySection) {
            // Comprimi tutte le altre categorie
            document.querySelectorAll('.category-section').forEach(section => {
                const contentContainer = section.querySelector('.category-content');
                const toggleButton = section.querySelector('.toggle-category-btn img');
                
                if (section !== categorySection) {
                    if (contentContainer) {
                        contentContainer.style.display = 'none';
                        contentContainer.classList.add('collapsed');
                    }
                    if (toggleButton) {
                        toggleButton.style.transform = 'rotate(-90deg)';
                    }
                } else {
                    // Espandi la categoria corrente
                    if (contentContainer) {
                        contentContainer.style.display = 'block';
                        contentContainer.classList.remove('collapsed');
                    }
                    if (toggleButton) {
                        toggleButton.style.transform = 'rotate(0deg)';
                    }
                }
            });
            
            // Funzione per scorrere fino alla categoria
            function scrollToCategory() {
                // Aggiungi un piccolo offset per non coprire l'header
                const offset = 100; // pixel dall'alto
                const elementPosition = categorySection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
            
            // Chiamata alla funzione di scorrimento con un breve ritardo per assicurare il rendering
            setTimeout(scrollToCategory, 100);
        }
    });
}); 
    // Sincronizza le date con la pagina categorie
    sincronizzaDateConPageCategoria();
}

// Funzione per sincronizzare le date tra la pagina operai e la pagina categorie
function sincronizzaDateConPageCategoria() {
    console.log("Sincronizzazione date tra pagina operai e pagina categorie");
    
    // Per ogni categoria, aggiorna le date nella pagina categorie
    categorie.forEach((categoria, index) => {
        // Aggiorna solo se la categoria ha date o operai assegnati
        if (categoria.dataInizio || categoria.dataFine || (categoria.operaiAssegnati && categoria.operaiAssegnati.length > 0)) {
            aggiornaDateInCategorie(index);
            
            // Ricalcola anche le giornate lavorative
            aggiornaGiornateLavorative(index);
            
            // Se c'è una data di inizio ma manca la data di fine, prova a calcolarla
            if (categoria.dataInizio && !categoria.dataFine && categoria.numeroOperai) {
                const totaleImporti = calcolaTotaleCategoria(categoria, true);
                const giornateLavorative = calcolaGiornateMassime(
                    totaleImporti, 
                    categoria.numeroOperai, 
                    categoria.sconto
                );
                
                if (giornateLavorative !== '-') {
                    const dataFine = calcolaDataFineDaGiorni(categoria.dataInizio, giornateLavorative);
                    if (dataFine) {
                        categoria.dataFine = dataFine;
                        aggiornaDateInCategorie(index); // Aggiorna nuovamente con la nuova data
                    }
                }
            }
            
            // Aggiorna anche la durata
            if (categoria.dataInizio && categoria.dataFine) {
                aggiornaCalcoloDurata(index);
            }
        }
    });
    
    console.log("Sincronizzazione date completata");
}

// Funzione per mostrare il modal dell'organico
function mostraModalOrganico() {
    // Pulisci l'attuale contenuto del modal
    const modalContent = document.querySelector('#organicoModal .modal-content');
    modalContent.innerHTML = `
        <h3>Gestione Organico</h3>
        <div class="organico-container">
            <div class="operai-list-container">
                <table class="operai-table">
                    <thead>
                        <tr>
                            <th style="width: 30%;">Nome</th>
                            <th style="width: 50%;">Cognome</th>
                            <th style="width: 20%;">Azioni</th>
                        </tr>
                    </thead>
                    <tbody id="listaOperai">
                        <!-- Lista operai generata dinamicamente -->
                    </tbody>
                </table>
            </div>
        </div>
        <div class="modal-buttons">
            <button id="aggiungiNuovoOperaioBtn" class="add-operaio-btn">Aggiungi Nuovo Operaio</button>
            <button id="salvaOperaiBtn">Salva Elenco Operai</button>
            <button id="caricaOperaiBtn">Carica Elenco Operai</button>
            <input type="file" id="operaiFile" accept=".txt" style="display: none;">
            <button id="chiudiOrganicoBtn">Chiudi</button>
        </div>
    `;
    
    // Aggiorna la lista degli operai nel modal
    const listaOperaiContainer = document.getElementById('listaOperai');
    
    operai.forEach(operaio => {
        const operaioRow = document.createElement('tr');
        operaioRow.innerHTML = `
            <td>${operaio.nome}</td>
            <td>${operaio.cognome}</td>
            <td>
                <div class="operaio-actions">
                    <button class="edit-operaio-btn" data-id="${operaio.id}">
                        <img src="edit.png" width="16" height="16" alt="Modifica">
                    </button>
                    <button class="delete-operaio-btn" data-id="${operaio.id}">
                        <img src="x.png" width="16" height="16" alt="Elimina">
                    </button>
                </div>
            </td>
        `;
        listaOperaiContainer.appendChild(operaioRow);
    });
    
    // Aggiungi gli event listeners per i pulsanti di salvataggio e caricamento
    document.getElementById('salvaOperaiBtn').addEventListener('click', salvaElencoOperai);
    
    document.getElementById('caricaOperaiBtn').addEventListener('click', () => {
        document.getElementById('operaiFile').click();
    });

    document.getElementById('operaiFile').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            caricaElencoOperai(file);
            // Reset del valore per permettere di selezionare lo stesso file
            e.target.value = '';
        }
    });
    
    // Se non ci sono operai, mostra un messaggio
    if (operai.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="3" class="empty-state">
                Nessun operaio registrato. Aggiungi il primo operaio.
            </td>
        `;
        listaOperaiContainer.appendChild(emptyRow);
    }
    
    // Aggiungi gli event listeners per i pulsanti
    document.getElementById('aggiungiNuovoOperaioBtn').addEventListener('click', () => {
        hideModal(organicoModal);
        
        // Resetta i campi di input
        editOperaioNome.value = '';
        editOperaioCognome.value = '';
        currentOperaioId = null;
        
        // Imposta il titolo del modal
        document.querySelector('#editOperaioModal h3').textContent = 'Aggiungi Nuovo Operaio';
        
        // Aggiorna i testi dei pulsanti
        document.getElementById('annullaEditOperaioBtn').textContent = 'Annulla';
        document.getElementById('salvaEditOperaioBtn').textContent = 'Aggiungi';
        
        // Mostra il modal di modifica
        showModal(editOperaioModal);
    });
    
document.getElementById('salvaOperaiBtn').addEventListener('click', salvaElencoOperai);
    
    document.getElementById('caricaOperaiBtn').addEventListener('click', () => {
        document.getElementById('operaiFile').click();
    });

    document.getElementById('operaiFile').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            caricaElencoOperai(file);
            // Reset del valore per permettere di selezionare lo stesso file
            e.target.value = '';
        }
    });

    document.getElementById('chiudiOrganicoBtn').addEventListener('click', () => {
        hideModal(organicoModal);
    });
    
    // Aggiungi gli event listeners per i pulsanti di modifica ed eliminazione
    document.querySelectorAll('.edit-operaio-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const operaioId = e.currentTarget.dataset.id;
            const operaio = operai.find(o => o.id === operaioId);
            if (operaio) {
                editOperaioNome.value = operaio.nome;
                editOperaioCognome.value = operaio.cognome;
                currentOperaioId = operaioId;
                
                // Imposta il titolo del modal
                document.querySelector('#editOperaioModal h3').textContent = 'Modifica Operaio';
                
                // Aggiorna i testi dei pulsanti
                document.getElementById('annullaEditOperaioBtn').textContent = 'Annulla';
                document.getElementById('salvaEditOperaioBtn').textContent = 'Salva';
                
                // Nascondi il modal dell'organico e mostra quello di modifica
                hideModal(organicoModal);
                showModal(editOperaioModal);
            }
        });
    });
    
    document.querySelectorAll('.delete-operaio-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const operaioId = e.currentTarget.dataset.id;
            const operaio = operai.find(o => o.id === operaioId);
            if (operaio && confirm(`Sei sicuro di voler eliminare l'operaio ${operaio.nome} ${operaio.cognome}?`)) {
                // Rimuovi l'operaio dall'array
                operai = operai.filter(o => o.id !== operaioId);
                
                // Rimuovi l'operaio da tutte le categorie
                categorie.forEach(categoria => {
                    if (categoria.operaiAssegnati) {
                        categoria.operaiAssegnati = categoria.operaiAssegnati.filter(id => id !== operaioId);
                    }
                });
                
                // Aggiorna la visualizzazione
                mostraModalOrganico();
                aggiornaGestioneOperai();
            }
        });
    });
    

    // Mostra il modal
    showModal(organicoModal);
}

// Funzione per aggiungere un nuovo operaio
function aggiungiNuovoOperaio() {
    const nome = editOperaioNome.value.trim();
    const cognome = editOperaioCognome.value.trim();
    
    if (nome === '' || cognome === '') {
        alert('Inserisci nome e cognome dell\'operaio');
        return;
    }
    
    // Crea un nuovo operaio con ID univoco
    const nuovoOperaio = {
        id: generateUniqueId(),
        nome: nome,
        cognome: cognome
    };
    
    // Aggiungi l'operaio all'array
    operai.push(nuovoOperaio);
    
    // Nascondi il modal di modifica e mostra quello dell'organico
    hideModal(editOperaioModal);
    mostraModalOrganico();
    
    // Aggiorna la pagina operai
    aggiornaGestioneOperai();
}

// Funzione per salvare le modifiche a un operaio
function salvaModificheOperaio() {
    const nome = editOperaioNome.value.trim();
    const cognome = editOperaioCognome.value.trim();
    
    if (nome === '' || cognome === '') {
        alert('Inserisci nome e cognome dell\'operaio');
        return;
    }
    
    if (currentOperaioId) {
        // Modifica di un operaio esistente
        const operaio = operai.find(o => o.id === currentOperaioId);
        if (operaio) {
            operaio.nome = nome;
            operaio.cognome = cognome;
        }
    } else {
        // Aggiunta di un nuovo operaio
        aggiungiNuovoOperaio();
        return;
    }
    
    // Nascondi il modal di modifica e mostra quello dell'organico
    hideModal(editOperaioModal);
    mostraModalOrganico();
    
    // Aggiorna la pagina operai per riflettere le modifiche
    aggiornaGestioneOperai();
}

// Funzione per aggiungere event listeners ai campi data nella pagina gestione operai
function aggiungiListenersDate() {
    // Event listeners per i campi data inizio
    document.querySelectorAll('.data-inizio-input').forEach(input => {
        // Rimuovi eventuali listener precedenti per evitare duplicazioni
        const nuovoInput = input.cloneNode(true);
        input.parentNode.replaceChild(nuovoInput, input);
        
        nuovoInput.addEventListener('change', (e) => {
            const categoriaIndex = parseInt(e.target.dataset.categoriaIndex);
            const nuovaData = e.target.value;
            
            console.log(`Cambio data inizio per categoria ${categoriaIndex} a ${nuovaData}`);
            
            // Aggiorna la data nel modello dati
            if (categorie[categoriaIndex]) {
                categorie[categoriaIndex].dataInizio = nuovaData;
                
                // Calcola automaticamente la data di fine in base alle giornate lavorative
                if (nuovaData && categorie[categoriaIndex].numeroOperai) {
                    // Calcola il totale degli importi e le giornate lavorative
                    const totaleImporti = calcolaTotaleCategoria(categorie[categoriaIndex], true);
                    
                    const giornateLavorative = calcolaGiornateMassime(
                        totaleImporti, 
                        categorie[categoriaIndex].numeroOperai, 
                        categorie[categoriaIndex].sconto
                    );
                    
                    if (giornateLavorative !== '-') {
                        const dataFine = calcolaDataFineDaGiorni(nuovaData, giornateLavorative);
                        if (dataFine) {
                            categorie[categoriaIndex].dataFine = dataFine;
                            
                            // Aggiorna il campo data fine nella UI della pagina operai
                            const dataFineInput = document.querySelector(`.data-fine-input[data-categoria-index="${categoriaIndex}"]`);
                            if (dataFineInput) {
                                dataFineInput.value = dataFine;
                            }
                        }
                    }
                }
                
                // Aggiorna la durata
                aggiornaCalcoloDurata(categoriaIndex);
                
                // Forza l'aggiornamento delle date nella pagina categorie immediatamente
                aggiornaDateInCategorie(categoriaIndex);
                
                // Se la pagina categorie è visibile, aggiorna anche lì le date
                if (document.getElementById('pageCategorie').classList.contains('active')) {
                    aggiornaTabelleCategorie();
                }
            }
        });
    });
    
    // Event listeners per i campi data fine
    document.querySelectorAll('.data-fine-input').forEach(input => {
        // Rimuovi eventuali listener precedenti per evitare duplicazioni
        const nuovoInput = input.cloneNode(true);
        input.parentNode.replaceChild(nuovoInput, input);
        
        nuovoInput.addEventListener('change', (e) => {
            const categoriaIndex = parseInt(e.target.dataset.categoriaIndex);
            const nuovaData = e.target.value;
            
            console.log(`Cambio data fine per categoria ${categoriaIndex} a ${nuovaData}`);
            
            // Aggiorna la data nel modello dati
            if (categorie[categoriaIndex]) {
                categorie[categoriaIndex].dataFine = nuovaData;
                
                // Aggiorna la durata se esiste già una data di inizio
                if (categorie[categoriaIndex].dataInizio) {
                    aggiornaCalcoloDurata(categoriaIndex);
                }
                
                // Forza l'aggiornamento delle date nella pagina categorie immediatamente
                aggiornaDateInCategorie(categoriaIndex);
                
                // Se la pagina categorie è visibile, aggiorna anche lì le date
                if (document.getElementById('pageCategorie').classList.contains('active')) {
                    aggiornaTabelleCategorie();
                }
            }
        });
    });
}

// // Funzione per aggiornare le date nella pagina categorie
function aggiornaDateInCategorie(categoriaIndex) {
    if (!categorie[categoriaIndex]) return;
    
    const dataInizio = categorie[categoriaIndex].dataInizio;
    const dataFine = categorie[categoriaIndex].dataFine;
    
    // Usa selettori più precisi per trovare le righe delle date
    const categorySection = document.querySelector(`.category-section[data-category-index="${categoriaIndex}"]`);
    if (!categorySection) {
        console.log(`Sezione categoria con indice ${categoriaIndex} non trovata nel DOM`);
        return;
    }
    
    // Trova tutte le righe di tipo date-row
    const dateRows = categorySection.querySelectorAll('tr.date-row');
    
    // Aggiorna la data di inizio (prima riga date)
    if (dateRows.length > 0) {
        const dataInizioSpan = dateRows[0].querySelector('span');
        if (dataInizioSpan) {
            dataInizioSpan.textContent = dataInizio ? formatDate(dataInizio) : '-';
            console.log(`Aggiornata data inizio nella pagina categorie per categoria ${categoriaIndex}: ${dataInizio ? formatDate(dataInizio) : '-'}`);
        }
    }
    
    // Aggiorna la data di fine (seconda riga date)
    if (dateRows.length > 1) {
        const dataFineSpan = dateRows[1].querySelector('span');
        if (dataFineSpan) {
            dataFineSpan.textContent = dataFine ? formatDate(dataFine) : '-';
            console.log(`Aggiornata data fine nella pagina categorie per categoria ${categoriaIndex}: ${dataFine ? formatDate(dataFine) : '-'}`);
        }
    }
    
    // Aggiorna anche la visualizzazione della durata se entrambe le date sono presenti
    if (dataInizio && dataFine) {
        const giornateCell = categorySection.querySelector('.giornate-cell');
        if (giornateCell) {
            // Calcola le giornate massime
            const totaleImporti = calcolaTotaleCategoria(categorie[categoriaIndex], true);
            const giornateLavorative = calcolaGiornateMassime(totaleImporti, categorie[categoriaIndex].numeroOperai, 0);
            giornateCell.textContent = giornateLavorative;
        }
    }
}

// Funzione per aggiornare il calcolo della durata per una categoria
function aggiornaCalcoloDurata(categoriaIndex) {
    const dataInizio = categorie[categoriaIndex].dataInizio;
    const dataFine = categorie[categoriaIndex].dataFine;
    
    if (dataInizio && dataFine) {
        // Calcola la durata in giorni totali
        const durataTotale = calcolaDurataGiorni(dataInizio, dataFine);
        
        // Calcola la durata in giorni lavorativi
        const durataLavorativa = calcolaDurataGiorniLavorativi(dataInizio, dataFine);
        
        // Aggiorna la visualizzazione della durata nella pagina operai
        const durataCell = document.querySelector(`tr[data-categoria-index="${categoriaIndex}"] .durata-cell`);
        if (durataCell) {
            durataCell.textContent = durataLavorativa;
            durataCell.setAttribute('title', `Durata totale: ${durataTotale} giorni\nDurata lavorativa: ${durataLavorativa} giorni`);
        }
        
        // Aggiorna la visualizzazione anche nella pagina categorie
        // Trova la sezione della categoria
        const categorySection = document.querySelector(`.category-section[data-category-index="${categoriaIndex}"]`);
        if (categorySection) {
            // Cerca le righe delle date nella tabella
            const dateRows = categorySection.querySelectorAll('tr.date-row');
            if (dateRows.length >= 2) {
                // La terza riga dopo le date potrebbe contenere una cella per la durata
                const trDopo = dateRows[1].nextElementSibling;
                if (trDopo) {
                    const durataCellCategorie = trDopo.querySelector('td:nth-child(2)');
                    if (durataCellCategorie) {
                        durataCellCategorie.textContent = durataTotale;
                    }
                }
            }
        }
    }
}

// Funzione per calcolare la durata in giorni lavorativi tra due date
function calcolaDurataGiorniLavorativi(dataInizio, dataFine) {
    if (!dataInizio || !dataFine) return '-';
    
    // Converti le date in formato ISO se necessario
    const startISO = dataInizio.includes('-') ? dataInizio : parseItalianDate(dataInizio);
    const endISO = dataFine.includes('-') ? dataFine : parseItalianDate(dataFine);
    
    const start = new Date(startISO);
    const end = new Date(endISO);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return '-';
    
    // Calcola la Pasqua per entrambi gli anni, se diversi
    const annoInizio = start.getFullYear();
    const annoFine = end.getFullYear();
    
    // Elenco temporaneo delle festività per questo calcolo
    let festivitaTemp = [...festivitaItaliane];
    
    // Aggiungi Pasqua e Pasquetta per gli anni pertinenti
    if (annoInizio === annoFine) {
        const pasqua = calcolaPasqua(annoInizio);
        const pasquaMeseGiorno = `${String(pasqua.getMonth() + 1).padStart(2, '0')}-${String(pasqua.getDate()).padStart(2, '0')}`;
        
        const pasquetta = new Date(pasqua);
        pasquetta.setDate(pasqua.getDate() + 1);
        const pasquettaMeseGiorno = `${String(pasquetta.getMonth() + 1).padStart(2, '0')}-${String(pasquetta.getDate()).padStart(2, '0')}`;
        
        festivitaTemp.push(pasquaMeseGiorno, pasquettaMeseGiorno);
    } else {
        // Aggiungi per entrambi gli anni
        for (let anno = annoInizio; anno <= annoFine; anno++) {
            const pasqua = calcolaPasqua(anno);
            const pasquaMeseGiorno = `${anno}-${String(pasqua.getMonth() + 1).padStart(2, '0')}-${String(pasqua.getDate()).padStart(2, '0')}`;
            
            const pasquetta = new Date(pasqua);
            pasquetta.setDate(pasqua.getDate() + 1);
            const pasquettaMeseGiorno = `${anno}-${String(pasquetta.getMonth() + 1).padStart(2, '0')}-${String(pasquetta.getDate()).padStart(2, '0')}`;
            
            festivitaTemp.push(pasquaMeseGiorno, pasquettaMeseGiorno);
        }
    }
    
    // Conta i giorni lavorativi
    let giorniLavorativi = 0;
    let currentDate = new Date(start);
    
    // Includiamo sia il giorno di inizio che quello di fine
    while (currentDate <= end) {
        const giorno = currentDate.getDay();
        
        // Verifica se è un giorno lavorativo (non weekend e non festivo)
        if (giorno !== 0 && giorno !== 6) {  // Non domenica e non sabato
            const mese = String(currentDate.getMonth() + 1).padStart(2, '0');
            const giornoMese = String(currentDate.getDate()).padStart(2, '0');
            const dataFormattata = `${mese}-${giornoMese}`;
            
            // Verifica che non sia una festività
            if (!festivitaTemp.includes(dataFormattata)) {
                giorniLavorativi++;
            }
        }
        
        // Passa al giorno successivo
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return giorniLavorativi;
}

// Funzione per gestire l'assegnazione di operai a una categoria
function assegnaOperaiCategoria(categoriaIndex) {
    // Pulisci la lista di operai nel modal
    const listaOperaiAssegnazioneContainer = document.getElementById('listaOperaiAssegnazione');
    listaOperaiAssegnazioneContainer.innerHTML = '';
    
    // Salva il riferimento alla categoria corrente
    currentCategoryIndex = categoriaIndex;
    
    // Ottieni gli operai già assegnati alla categoria
    const operaiAssegnati = categorie[categoriaIndex].operaiAssegnati || [];
    
    // Aggiungi un checkbox per ogni operaio
    operai.forEach(operaio => {
        const operaioCheckbox = document.createElement('div');
        operaioCheckbox.className = 'operaio-checkbox';
        operaioCheckbox.innerHTML = `
            <label>
                <input type="checkbox" class="operaio-check" value="${operaio.id}" 
                    ${operaiAssegnati.includes(operaio.id) ? 'checked' : ''}>
                ${operaio.nome} ${operaio.cognome}
            </label>
        `;
        listaOperaiAssegnazioneContainer.appendChild(operaioCheckbox);
    });
    
    // Se non ci sono operai, mostra un messaggio
    if (operai.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.style.margin = '20px 0';
        emptyState.textContent = 'Nessun operaio disponibile. Aggiungi operai dalla pagina "Gestione Operai".';
        listaOperaiAssegnazioneContainer.appendChild(emptyState);
    }
    
    // Aggiorna il titolo del modal
    document.querySelector('#assegnaOperaiModal .modal-title').textContent = 
        `Assegna Operai a: ${categorie[categoriaIndex].nome}`;
    
    // Mostra il modal
    showModal(assegnaOperaiModal);
}

// Funzione per salvare l'assegnazione degli operai
function salvaAssegnazioneOperai() {
    // Ottieni tutti i checkbox selezionati
    const operaiChecked = document.querySelectorAll('.operaio-check:checked');
    const nuoviOperaiAssegnati = Array.from(operaiChecked).map(cb => cb.value);
    
    // Aggiorna la categoria con i nuovi operai assegnati
    if (categorie[currentCategoryIndex]) {
        categorie[currentCategoryIndex].operaiAssegnati = nuoviOperaiAssegnati;
    }
    
    // Nascondi il modal
    hideModal(assegnaOperaiModal);
    
    // Se siamo nella pagina operai, aggiorna la visualizzazione
    if (document.getElementById('pageOperai').classList.contains('active')) {
        aggiornaGestioneOperai();
    } else {
        // Altrimenti, aggiorna la tabella della categoria
        aggiornaTabelleCategorie();
    }
}

// =============================================================================
// SEZIONE 5B: GESTIONE OPERAI - INTERFACCIA E INIZIALIZZAZIONE
// =============================================================================

// Funzione per creare i modali necessari per la gestione degli operai
function creaModaliOperai() {
    // Crea il modal per la gestione dell'organico
const organicoModalElement = document.createElement('div');
organicoModalElement.id = 'organicoModal';
organicoModalElement.className = 'modal';
organicoModalElement.innerHTML = `
    <div class="modal-content">
        <h3>Gestione Organico</h3>
        <div class="organico-container">
            <div class="operai-list-container">
                <table class="operai-table">
                    <thead>
                        <tr>
                            <th style="width: 30%;">Nome</th>
                            <th style="width: 50%;">Cognome</th>
                            <th style="width: 20%;">Azioni</th>
                        </tr>
                    </thead>
                    <tbody id="listaOperai">
                        <!-- Lista operai generata dinamicamente -->
                    </tbody>
                </table>
            </div>
        </div>
        <div class="modal-buttons">
            <button id="aggiungiNuovoOperaioBtn" class="add-operaio-btn">Aggiungi Nuovo Operaio</button>
            <button id="salvaOperaiBtn">Salva Elenco Operai</button>
            <button id="caricaOperaiBtn">Carica Elenco Operai</button>
            <input type="file" id="operaiFile" accept=".txt" style="display: none;">
            <button id="chiudiOrganicoBtn">Chiudi</button>
        </div>
    </div>
`;
    document.body.appendChild(organicoModalElement);
    
    // Crea il modal per la modifica/aggiunta di un operaio
    const editOperaioModalElement = document.createElement('div');
    editOperaioModalElement.id = 'editOperaioModal';
    editOperaioModalElement.className = 'modal';
    editOperaioModalElement.innerHTML = `
        <div class="modal-content">
            <h3>Modifica Operaio</h3>
            <div class="form-row">
                <label for="editOperaioNome">Nome:</label>
                <input type="text" id="editOperaioNome">
            </div>
            <div class="form-row">
                <label for="editOperaioCognome">Cognome:</label>
                <input type="text" id="editOperaioCognome">
            </div>
            <div class="modal-buttons">
                <button id="annullaEditOperaioBtn">Annulla</button>
                <button id="salvaEditOperaioBtn">Salva</button>
            </div>
        </div>
    `;
    document.body.appendChild(editOperaioModalElement);
    
    // Crea il modal per l'assegnazione degli operai ad una categoria
    const assegnaOperaiModalElement = document.createElement('div');
    assegnaOperaiModalElement.id = 'assegnaOperaiModal';
    assegnaOperaiModalElement.className = 'modal';
    assegnaOperaiModalElement.innerHTML = `
        <div class="modal-content">
            <h3 class="modal-title">Assegna Operai alla Categoria</h3>
            <div class="operai-assegnazione-container">
                <div id="listaOperaiAssegnazione" class="lista-operai-assegnazione">
                    <!-- Lista operai generata dinamicamente -->
                </div>
            </div>
            <div class="modal-buttons">
                <button id="annullaAssegnaOperaiBtn">Annulla</button>
                <button id="salvaAssegnaOperaiBtn">Salva</button>
            </div>
        </div>
    `;
    document.body.appendChild(assegnaOperaiModalElement);
    
    // Salva riferimenti ai modali nelle variabili globali
    organicoModal = document.getElementById('organicoModal');
    editOperaioModal = document.getElementById('editOperaioModal');
    assegnaOperaiModal = document.getElementById('assegnaOperaiModal');
    
    // Salva riferimenti agli input nei modali
    editOperaioNome = document.getElementById('editOperaioNome');
    editOperaioCognome = document.getElementById('editOperaioCognome');
    
    // Event listeners per i modali
    document.getElementById('chiudiOrganicoBtn').addEventListener('click', () => {
        hideModal(organicoModal);
    });
    
    document.getElementById('aggiungiNuovoOperaioBtn').addEventListener('click', () => {
        hideModal(organicoModal);
        
        // Resetta i campi di input
        editOperaioNome.value = '';
        editOperaioCognome.value = '';
        currentOperaioId = null;
        
        // Imposta il titolo del modal
        document.querySelector('#editOperaioModal h3').textContent = 'Aggiungi Nuovo Operaio';
        
        // Aggiorna i testi dei pulsanti
        document.getElementById('annullaEditOperaioBtn').textContent = 'Annulla';
        document.getElementById('salvaEditOperaioBtn').textContent = 'Aggiungi';
        
        // Mostra il modal di modifica
        showModal(editOperaioModal);
    });
    
    document.getElementById('annullaEditOperaioBtn').addEventListener('click', () => {
        hideModal(editOperaioModal);
        showModal(organicoModal);
    });
    
    document.getElementById('salvaEditOperaioBtn').addEventListener('click', salvaModificheOperaio);
    
    document.getElementById('annullaAssegnaOperaiBtn').addEventListener('click', () => {
        hideModal(assegnaOperaiModal);
    });
    
    document.getElementById('salvaAssegnaOperaiBtn').addEventListener('click', salvaAssegnazioneOperai);
    
    // Chiudi modal cliccando fuori
    window.addEventListener('click', (e) => {
        if (e.target === organicoModal) {
            hideModal(organicoModal);
        }
        if (e.target === editOperaioModal) {
            hideModal(editOperaioModal);
        }
        if (e.target === assegnaOperaiModal) {
            hideModal(assegnaOperaiModal);
        }
    });
}



// Funzione per aggiungere la pagina di gestione operai
function creaContenitorePaginaOperai() {
    const pageOperai = document.createElement('div');
    pageOperai.id = 'pageOperai';
    pageOperai.className = 'page';
    
    const operaiContainer = document.createElement('div');
    operaiContainer.id = 'operaiContainer';
    
    pageOperai.appendChild(operaiContainer);
    
    // Aggiungi la pagina al container principale
    const content = document.getElementById('content');
    if (content) {
        content.appendChild(pageOperai);
    }
}

// Funzione per aggiungere il pulsante di navigazione verso la pagina operai
function aggiungiPulsanteNavOperai() {
    // Verifica se il pulsante esiste già per evitare duplicati
    if (document.getElementById('tabOperai')) {
        return; // Se il pulsante esiste già, non fare nulla
    }
    
// Funzione di diagnostica - aggiungi questa funzione dopo aggiungiPulsanteNavOperai
function diagnosticaOperai() {
    console.log('=== DIAGNOSTICA GESTIONE OPERAI ===');
    console.log('- tabOperaiBtn:', tabOperaiBtn ? 'DEFINITO' : 'NON DEFINITO');
    
    const pulsanteDOM = document.getElementById('tabOperai');
    console.log('- elemento #tabOperai nel DOM:', pulsanteDOM ? 'PRESENTE' : 'ASSENTE');
    
    const paginaDOM = document.getElementById('pageOperai');
    console.log('- elemento #pageOperai nel DOM:', paginaDOM ? 'PRESENTE' : 'ASSENTE');
    
    if (pulsanteDOM) {
        // Verifica se il pulsante ha un event listener
        const clonedButton = pulsanteDOM.cloneNode(true);
        pulsanteDOM.parentNode.replaceChild(clonedButton, pulsanteDOM);
        console.log('- Event listener rimosso e nuovo pulsante inserito');
        
        // Aggiungi un nuovo event listener direttamente
        clonedButton.addEventListener('click', function() {
            console.log('Click su Gestione Operai (nuovo listener)');
            const paginaOperai = document.getElementById('pageOperai');
            if (!paginaOperai) {
                console.error('Pagina #pageOperai non trovata, la creo dinamicamente');
                creaContenitorePaginaOperai();
            }
            showPage('pageOperai');
        });
        
        // Salva il riferimento al nuovo pulsante
        tabOperaiBtn = clonedButton;
    }
    
    console.log('================================');
}

    // Crea il pulsante per la pagina operai
    const tabOperaiBtnElement = document.createElement('button');
    tabOperaiBtnElement.id = 'tabOperai';
    tabOperaiBtnElement.className = 'nav-button';
    tabOperaiBtnElement.textContent = 'Gestione Operai';
    
    // Trova il punto di inserimento (dopo il pulsante offerta)
    const tabOffertaBtn = document.getElementById('tabOfferta');
    if (tabOffertaBtn && tabOffertaBtn.parentNode) {
        // Inserisci il nuovo pulsante dopo il pulsante offerta
        tabOffertaBtn.parentNode.insertBefore(tabOperaiBtnElement, tabOffertaBtn.nextSibling);
        
        // Salva il riferimento nella variabile globale
        tabOperaiBtn = document.getElementById('tabOperai');
        
        // Aggiungi event listener al nuovo pulsante
        tabOperaiBtn.addEventListener('click', () => showPage('pageOperai'));
    }
}

// Funzione di inizializzazione per la gestione operai
function inizializzaGestioneOperai() {
    // Crea i modali
    creaModaliOperai();
    
    // Aggiorna il modal di stampa
    aggiornaModalStampa();
    
    // Crea la pagina operai
    creaContenitorePaginaOperai();
    
    // Aggiungi il pulsante di navigazione
    aggiungiPulsanteNavOperai();
           
    // Inizializza la pagina operai
    aggiornaGestioneOperai();
}



// =============================================================================
// SEZIONE 6: MODIFICHE ALLE CATEGORIE PER SUPPORTO OPERAI
// =============================================================================

// Funzione per creare una nuova tabella di categoria con supporto operai
function creaNuovaTabella(categoria, index) {
    const categorySection = document.createElement('div');
categorySection.className = 'category-section';
categorySection.dataset.categoryIndex = index;
categorySection.setAttribute('draggable', 'false'); // Di default non è trascinabile (si attiva con dblclick)
categorySection.dataset.categoryOrder = index;
categorySection.title = "Doppio click sull'intestazione per attivare lo spostamento delle categorie";
    
    // Aggiungi discount alla categoria se non esiste
    if (typeof categoria.sconto === 'undefined') {
        categoria.sconto = 0;
    }

    // Header della categoria con nome, sconto e pulsanti di controllo
const categoryHeader = document.createElement('div');
categoryHeader.className = 'category-header no-print';
categoryHeader.setAttribute('draggable', 'false'); // Previene conflitti di drag & drop
categoryHeader.title = "Doppio click per cambiare modalità di trascinamento";
    categoryHeader.innerHTML = `
        <div class="category-title">
            <h3>${categoria.nome}</h3>
            <div class="discount-container">
                <label>Sconto (%): </label>
                <input type="number" min="0" max="100" step="0.1" class="input-sconto" 
                    data-category-index="${index}" 
                    value="${categoria.sconto || 0}"
                    style="width: 70px; text-align: right;">
            </div>
        </div>
        <div class="category-controls">
            <button class="assegna-operai-btn" data-index="${index}" title="Assegna Operai">
                <img src="user.png" width="24" height="24" alt="Assegna Operai">
            </button>
            <button class="toggle-category-btn" data-category="${index}" title="Espandi/Comprimi">
                <img src="down.png" width="24" height="24" alt="Espandi/Comprimi">
            </button>
            <img src="mod.png" class="modifica-riga" data-index="${index}" width="24" height="24" title="Modifica categoria">
            <img src="x.png" class="elimina-riga" data-index="${index}" width="24" height="24" title="Elimina categoria">
        </div>`.replace(/Ø/g, '&Oslash;');

    // Calcola il totale degli importi per la categoria
    let totaleImporti = 0;
    categoria.lavorazioni.forEach(lavorazione => {
        // Usa il valore raw se disponibile, altrimenti fallback al parsing
        if (lavorazione.importoManodoperaRaw !== undefined) {
            // Applica lo sconto a ciascuna voce
            const importoScontato = lavorazione.importoManodoperaRaw * (1 - (categoria.sconto / 100));
            lavorazione.importoManodoperaScontato = importoScontato;
            totaleImporti += importoScontato;
        } else if (lavorazione.importoManodopera) {
            try {
                const numero = parseEuroToNumber(lavorazione.importoManodopera);
                if (!isNaN(numero)) {
                    // Applica lo sconto a ciascuna voce
                    const importoScontato = numero * (1 - (categoria.sconto / 100));
                    lavorazione.importoManodoperaScontato = importoScontato;
                    totaleImporti += importoScontato;
                }
            } catch (error) {
                console.error('Errore nel calcolo del totale:', error);
            }
        }
    });

    // Il totale finale è già calcolato con lo sconto applicato a ciascuna voce
    const totalFormattato = formatCurrency(totaleImporti);

    // Container principale della tabella
    const tableContainer = document.createElement('div');
    tableContainer.className = 'table-container category-content';
    tableContainer.dataset.categoriaIndex = index;
    
    // Ottieni gli operai assegnati
const operaiAssegnati = categoria.operaiAssegnati || [];
// Conta gli operai assegnati
const numeroOperaiAssegnati = operaiAssegnati.length;
// Aggiorna il numero di operai nel modello dati se diverso
if (categoria.numeroOperai !== numeroOperaiAssegnati && numeroOperaiAssegnati > 0) {
    categoria.numeroOperai = numeroOperaiAssegnati;
}
// Ottieni i nomi degli operai assegnati
const nomiOperai = getNomiOperaiPerCategoria(index);
const operaiAssegnatiHTML = nomiOperai !== '-' 
    ? `<div class="operai-assegnati-container">Operai assegnati: <strong>${nomiOperai}</strong></div>` 
    : '';
    
    // Ottieni le date dalla gestione operai ma mostrali solo come testo, non come input
const dataInizio = categoria.dataInizio ? formatDate(categoria.dataInizio) : '-';
const dataFine = categoria.dataFine ? formatDate(categoria.dataFine) : '-';
let durata = '-';

// Calcola la durata in giorni lavorativi se ci sono entrambe le date
if (categoria.dataInizio && categoria.dataFine) {
    durata = calcolaDurataGiorniLavorativi(categoria.dataInizio, categoria.dataFine);
}
    
    tableContainer.innerHTML = `
        ${operaiAssegnatiHTML}
        <table class="category-table" style="table-layout: fixed !important;">
            <colgroup>
                <col style="width: 50% !important;">
                <col style="width: 15% !important;">
                <col style="width: 15% !important;">
                <col style="width: 10% !important;">
                <col style="width: 10% !important;">
            </colgroup>
            <thead>
                <tr class="category-name-header">
                        <th colspan="5" style="background-color: #f5f5f5; text-align: left; padding: 10px;">
                            <strong>${categoria.nome}</strong>
                        </th>
                    </tr>
                    <tr>
                        <th style="width: 50% !important;">Voce</th>
                        <th style="width: 15% !important;">Quantità</th>
                        <th class="no-print colonna-importo" style="width: 15% !important;">Importo Manodopera</th>
                        <th class="no-print" style="width: 10% !important;">Modifica</th>
                        <th class="no-print" style="width: 10% !important;">Edita</th>
                    </tr>
                </thead>
                <tbody>
                    ${categoria.lavorazioni.map((lavorazione, lavorazioneIndex) => {
                        // Assegna il codice univoco come attributo data
                        const codiceUnivoco = `cat${index}_${lavorazione.numero}`;
                        // Usa l'importo scontato se disponibile
                        const importoVisualizzato = lavorazione.importoManodoperaScontato ? 
                            formatCurrency(lavorazione.importoManodoperaScontato) : 
                            formatCurrency(parseEuroToNumber(lavorazione.importoManodopera));
                        
                        return `
<tr class="input-row" data-codice-univoco="${codiceUnivoco}">
                            <td class="lavorazione" style="width: 50% !important;">${lavorazione.nome}</td>
                            <td class="text-center" style="width: 15% !important; text-align: center;">
                                <span class="quantita-value">${lavorazione.quantita || ''}</span>
                            </td>
                            <td class="importo text-center no-print colonna-importo" style="width: 15% !important;">
                                <span class="importo-value">${importoVisualizzato}</span>
                            </td>
                            <td class="movimento-row no-print" style="width: 10% !important;">
    <div class="movement-buttons">
        
        <button class="elimina-voce" title="Elimina voce" data-category="${index}" data-lavorazione="${lavorazioneIndex}">
            <img src="elimina.png" width="16" height="16">
        </button>
        <button class="duplica-voce" title="Duplica voce" data-category="${index}" data-lavorazione="${lavorazioneIndex}">
            <img src="duplica.png" width="16" height="16">
        </button>
        <button class="cambia-categoria" title="Cambia categoria" data-category="${index}" data-lavorazione="${lavorazioneIndex}">
            <img src="cambia.png" width="16" height="16">
        </button>
    </div>
</td>
                            <td class="no-print text-center" style="width: 10% !important;">
                                <button class="edit-button" data-category="${index}" data-lavorazione="${lavorazioneIndex}" data-codice-univoco="${codiceUnivoco}" title="Modifica lavorazione">
                                    <img src="edit.png" width="16" height="16">
                                </button>
                            </td>
                        </tr>
                    `}).join('')}
                    <tr class="totale-row">
                        <td class="lavorazione" style="width: 50% !important;"><strong>TOTALE</strong></td>
                        <td class="text-center" style="width: 15% !important; text-align: center;">
                            <span class="percentuale-value"><strong>100%</strong></span>
                        </td>
                        <td class="importo text-center no-print colonna-importo" style="width: 15% !important;">
                            <span class="importo-value"><strong>${totalFormattato}</strong></span>
                        </td>
                        <td class="no-print" style="width: 10% !important;"></td>
                        <td class="no-print" style="width: 10% !important;"></td>
                    </tr>
                    <tr class="operai-row">
    <td class="lavorazione" style="width: 50% !important;"><strong>Numero operai</strong></td>
    <td class="text-center" style="width: 15% !important; text-align: center;">
        ${categoria.numeroOperai || numeroOperaiAssegnati || '-'}
    </td>
    <td class="no-print colonna-importo" style="width: 15% !important;"></td>
    <td class="no-print" style="width: 10% !important;"></td>
    <td class="no-print" style="width: 10% !important;"></td>
</tr>
                    <tr class="giornate-row">
                        <td class="lavorazione" style="width: 50% !important;"><strong>Giornate lavorative</strong></td>
                        <td class="text-center giornate-cell" style="width: 15% !important; text-align: center;" data-category-index="${index}">
                            ${calcolaGiornateMassime(totaleImporti, categoria.numeroOperai, 0)}
                        </td>
                        <td class="no-print colonna-importo" style="width: 15% !important;"></td>
                        <td class="no-print" style="width: 10% !important;"></td>
                        <td class="no-print" style="width: 10% !important;"></td>
                    </tr>
                    <tr class="date-row">
                        <td class="lavorazione" style="width: 50% !important;"><strong>Data inizio</strong></td>
                        <td class="text-center" style="width: 15% !important; text-align: center;">
                            <span>${dataInizio}</span>
                        </td>
                        <td class="no-print colonna-importo" style="width: 15% !important;"></td>
                        <td class="no-print" style="width: 10% !important;"></td>
                        <td class="no-print" style="width: 10% !important;"></td>
                    </tr>
                    <tr class="date-row">
                        <td class="lavorazione" style="width: 50% !important;"><strong>Data fine</strong></td>
                        <td class="text-center" style="width: 15% !important; text-align: center;">
                            <span>${dataFine}</span>
                        </td>
                        <td class="no-print colonna-importo" style="width: 15% !important;"></td>
                        <td class="no-print" style="width: 10% !important;"></td>
                        <td class="no-print" style="width: 10% !important;"></td>
                    </tr>
                    <tr class="note-row">
                        <td colspan="5">
                            <div class="note-container">
                                <div class="note-header">NOTE:</div>
                                <textarea class="note-input no-print" placeholder="Inserisci note...">${categoria.note || ''}</textarea>
                                <div class="note-content print-only">${categoria.note || ''}</div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>`;

    categorySection.appendChild(categoryHeader);
    categorySection.appendChild(tableContainer);
    return categorySection;
}

function aggiornaTabelleCategorie() {
    // Salva lo stato di espansione delle categorie prima dell'aggiornamento
    const statoCategorieEspanse = {};
    document.querySelectorAll('.category-section').forEach(categorySection => {
        const categoriaIndex = categorySection.dataset.categoryIndex;
        const contentContainer = categorySection.querySelector('.category-content');
        
        // Se l'elemento esiste, salva il suo stato di visualizzazione
        if (contentContainer) {
            statoCategorieEspanse[categoriaIndex] = 
                !contentContainer.classList.contains('collapsed') && 
                contentContainer.style.display !== 'none';
        }
    });

    // Pulisci il container delle categorie
    categorieContainer.innerHTML = '';

    // Ricostruisci le tabelle delle categorie
    categorie.forEach((categoria, index) => {
        const nuovaTabella = creaNuovaTabella(categoria, index);
        categorieContainer.appendChild(nuovaTabella);
    });

    // Ripristina lo stato di espansione delle categorie
    document.querySelectorAll('.category-section').forEach(categorySection => {
        const categoriaIndex = categorySection.dataset.categoryIndex;
        const contentContainer = categorySection.querySelector('.category-content');
        const toggleButton = categorySection.querySelector('.toggle-category-btn img');

        // Se lo stato era salvato per questa categoria
        if (statoCategorieEspanse.hasOwnProperty(categoriaIndex)) {
            if (statoCategorieEspanse[categoriaIndex]) {
                // Categoria espansa
                if (contentContainer) {
                    contentContainer.style.display = 'block';
                    contentContainer.classList.remove('collapsed');
                }
                if (toggleButton) {
                    toggleButton.style.transform = 'rotate(0deg)';
                }
            } else {
                // Categoria compressa
                if (contentContainer) {
                    contentContainer.style.display = 'none';
                    contentContainer.classList.add('collapsed');
                }
                if (toggleButton) {
                    toggleButton.style.transform = 'rotate(-90deg)';
                }
            }
        }
    });

    // Aggiungi event listeners per gli input di sconto
    document.querySelectorAll('.input-sconto').forEach(input => {
        input.addEventListener('input', gestisciCambioSconto);
    });
    
    // Aggiungi gli altri event listeners
    aggiungiGestioneEliminazione();
    aggiungiGestioneModifica();
    aggiungiGestioneNote();
    aggiungiGestioneModificaLavorazione();
    
    // Aggiungi gestione per minimizzare/espandere le categorie
    aggiungiGestioneToggleCategorie();
    aggiungiGestioneVociLavorazioni();
    
    // Aggiungi gestione per i pulsanti di assegnazione operai
    aggiungiGestioneAssegnazioneOperai();
    
    // Aggiungi gestione per il drag & drop alternato (lavorazioni/categorie)
    aggiungiGestioneDragDropAlternato();
    
    // Riattiva la modalità categorie se era attiva prima dell'aggiornamento
    if (dragDropMode === 'categorie' && dragDropModeActive) {
        setTimeout(() => {
            attivaModalitaCategorie();
        }, 100);
    }

    // Aggiorna anche le altre pagine, ma solo se sono visibili
    if (document.getElementById('pageMateriali').classList.contains('active')) {
        aggiornaTabelleMateriali();
    }
    
    if (document.getElementById('pageOfferta').classList.contains('active')) {
        aggiornaOfferta();
    }
    
    if (document.getElementById('pageOperai').classList.contains('active')) {
        aggiornaGestioneOperai();
    }
}

// Funzione per aggiungere la gestione dell'assegnazione operai
function aggiungiGestioneAssegnazioneOperai() {
    document.querySelectorAll('.assegna-operai-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const categoriaIndex = parseInt(e.currentTarget.dataset.index);
            assegnaOperaiCategoria(categoriaIndex);
        });
    });
}

// Funzione per espandere tutte le sezioni nella pagina dei materiali
function espandiTuttiMateriali() {
    // Espandi tutte le categorie
    document.querySelectorAll('.categoria-materiali-container').forEach(container => {
        container.classList.remove('collapsed');
        container.style.display = 'block';
        
        const toggleButton = container.previousElementSibling.querySelector('.toggle-categoria-btn img');
        if (toggleButton) {
            toggleButton.style.transform = 'rotate(0deg)';
        }
    });
    
    // Espandi tutte le sezioni dei materiali
    document.querySelectorAll('.materiali-content').forEach(contentContainer => {
        contentContainer.classList.remove('collapsed');
        contentContainer.style.display = 'block';
    });
}

// Funzione per comprimere tutte le sezioni nella pagina dei materiali
function comprimiTuttiMateriali() {
    // Comprimi tutte le categorie
    document.querySelectorAll('.categoria-materiali-container').forEach(container => {
        container.classList.add('collapsed');
        container.style.display = 'none';
        
        const toggleButton = container.previousElementSibling.querySelector('.toggle-categoria-btn img');
        if (toggleButton) {
            toggleButton.style.transform = 'rotate(-90deg)';
        }
    });
    
    // Comprimi tutte le sezioni dei materiali
    document.querySelectorAll('.materiali-content').forEach(contentContainer => {
        contentContainer.classList.add('collapsed');
        contentContainer.style.display = 'none';
    });
}

// Funzione per la gestione dell'espansione/minimizzazione delle categorie
function aggiungiGestioneToggleCategorie() {
    // Prima rimuovi gli event listeners esistenti clonando i pulsanti
    document.querySelectorAll('.toggle-category-btn').forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
    });
    
    // Aggiungi i nuovi event listeners
    document.querySelectorAll('.toggle-category-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const categoryIndex = e.currentTarget.dataset.category;
            const categorySection = e.currentTarget.closest('.category-section');
            const contentContainer = categorySection.querySelector('.category-content');
            
            if (contentContainer.style.display === 'none') {
                // Espandi la categoria
                contentContainer.style.display = 'block';
                contentContainer.classList.remove('collapsed');
                e.currentTarget.querySelector('img').style.transform = 'rotate(0deg)';
            } else {
                // Minimizza la categoria
                contentContainer.style.display = 'none';
                contentContainer.classList.add('collapsed');
                e.currentTarget.querySelector('img').style.transform = 'rotate(-90deg)';
            }
            
            // Previeni la propagazione dell'evento
            e.stopPropagation();
        });
    });
}

// Funzione per gestire il drag & drop delle categorie
function aggiungiGestioneDragDropCategorie() {
    // Questa funzione è mantenuta per retrocompatibilità
    // L'attivazione effettiva del drag&drop per categorie avviene in attivaModalitaCategorie()
    console.log('La gestione drag&drop delle categorie è ora controllata da aggiungiGestioneDragDropAlternato');
    
    // Previeni il drag & drop sui controlli interni alle categorie
    function preveniDragDropSuiControlli() {
        // Aggiungi event listener per fermare la propagazione dell'evento dragstart
        document.querySelectorAll('.category-controls, .input-sconto, .note-input, button, input').forEach(element => {
            element.addEventListener('dragstart', (e) => {
                e.stopPropagation();
            });
            
            element.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
    }
    
    // Chiama la funzione per prevenire il drag sui controlli
    preveniDragDropSuiControlli();
}
// Funzioni per gestire gli eventi di drag & drop delle categorie
let draggedCategory = null;

function handleDragStart(e) {
    // Salva un riferimento alla categoria che si sta spostando
    draggedCategory = this;
    this.classList.add('dragging');
    
    // Salva i dati necessari per l'operazione di drag
    e.dataTransfer.setData('text/plain', this.dataset.categoryIndex);
    
    // Imposta un'immagine di trascinamento semi-trasparente
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault(); // Necessario per permettere il drop
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    this.classList.add('drag-over');
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    // Evita l'azione predefinita del browser (aprire come link per alcuni elementi)
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    // Non fare nulla se si trascina su se stessi
    if (draggedCategory === this) {
        return false;
    }
    
    // Salva il riferimento agli indici delle categorie
    const sourceIndex = parseInt(draggedCategory.dataset.categoryIndex);
    const targetIndex = parseInt(this.dataset.categoryIndex);
    
    // Salva lo stato di espansione di tutte le categorie prima di riordinare
    const statoCategorieEspanse = salvaStatoCategorie();
    
    // Riordina le categorie nell'array
    const [movedCategory] = categorie.splice(sourceIndex, 1);
    categorie.splice(targetIndex, 0, movedCategory);
    
    // Aggiorna i materiali con i nuovi indici delle categorie
    aggiornaIndiciMaterialiDopoRiordino(sourceIndex, targetIndex);
    
    // Aggiorna tutte le tabelle
    aggiornaTabelleCategorie();

    // Ripristina lo stato di espansione delle categorie
    setTimeout(() => {
        ripristinaStatoCategorie(statoCategorieEspanse);
        
        // Riaggiunge gli event listeners ai pulsanti toggle dopo il ripristino
        aggiungiGestioneToggleCategorie();
        
        // Forza la riattivazione della modalità categorie senza controllare lo stato precedente
        dragDropMode = 'categorie';
        dragDropModeActive = true;
        
        // Attiva il drag&drop per tutte le categorie
        document.querySelectorAll('.category-section').forEach(section => {
            section.setAttribute('draggable', 'true');
            section.classList.add('draggable-category');
            
            // Aggiungi event listeners per il drag&drop delle categorie
            section.addEventListener('dragstart', handleDragStart);
            section.addEventListener('dragover', handleDragOver);
            section.addEventListener('dragenter', handleDragEnter);
            section.addEventListener('dragleave', handleDragLeave);
            section.addEventListener('drop', handleDrop);
            section.addEventListener('dragend', handleDragEnd);
        });
        
        // Mantieni la notifica persistente o aggiungila se non esiste
        let notificaEsistente = document.querySelector('.notification.persistent');
        if (!notificaEsistente) {
            notificaEsistente = mostraNotifica('Modalità spostamento categorie attiva - clicca di nuovo per disattivare', 'persistent', 0);
            notificaEsistente.classList.add('persistent');
        }
        
        // Assicurati che l'interfaccia rifletta visivamente lo stato attuale
        aggiornaVisualizzazioneModalitaDragDrop();
        
    }, 100);
    
    // Aggiorna anche le altre pagine se necessario
    if (document.getElementById('pageMateriali').classList.contains('active')) {
        aggiornaTabelleMateriali();
    }
    
    if (document.getElementById('pageOfferta').classList.contains('active')) {
        aggiornaOfferta();
    }
    
    if (document.getElementById('pageOperai').classList.contains('active')) {
        aggiornaGestioneOperai();
    }
    
    this.classList.remove('drag-over');
    return false;
}

function handleDragEnd(e) {
    // Rimuovi le classi di drag & drop da tutti gli elementi
    document.querySelectorAll('.category-section').forEach(section => {
        section.classList.remove('dragging', 'drag-over');
    });
}

// Funzione per aggiungere la gestione del drag&drop con modalità alternata
function aggiungiGestioneDragDropAlternato() {
    // Inizializza con la modalità lavorazione attiva di default
    attivaModalitaLavorazioni();
    
    // Aggiungi event listeners alle intestazioni delle categorie per il toggle della modalità
    document.querySelectorAll('.category-header').forEach(header => {
        header.addEventListener('dblclick', (e) => {
            // Ignora se il dblclick è stato su un elemento interattivo dentro l'header
            if (e.target.closest('button, input')) {
                return;
            }
            
            // Toggle della modalità in base allo stato attuale
            if (dragDropMode === 'categorie' && dragDropModeActive) {
                attivaModalitaLavorazioni();
            } else {
                attivaModalitaCategorie();
            }
            
            // Previeni la propagazione dell'evento
            e.stopPropagation();
        });
    });
}

// Funzione per attivare la modalità lavorazioni
function attivaModalitaLavorazioni() {
    dragDropMode = 'lavorazioni';
    dragDropModeActive = false; // Reset del flag di attivazione
    
    // Disattiva drag&drop per le categorie
    document.querySelectorAll('.category-section').forEach(section => {
        section.setAttribute('draggable', 'false');
        section.classList.remove('draggable-category');
        
        // Rimuovi tutti gli event listener di drag&drop delle categorie
        section.removeEventListener('dragstart', handleDragStart);
        section.removeEventListener('dragover', handleDragOver);
        section.removeEventListener('dragenter', handleDragEnter);
        section.removeEventListener('dragleave', handleDragLeave);
        section.removeEventListener('drop', handleDrop);
        section.removeEventListener('dragend', handleDragEnd);
    });
    
    // Attiva drag&drop per le lavorazioni
    document.querySelectorAll('.input-row').forEach(row => {
        row.setAttribute('draggable', 'true');
        row.classList.add('draggable-row');
        
        // Aggiungi event listeners per il drag&drop delle lavorazioni
        row.addEventListener('dragstart', dragStart);
        row.addEventListener('dragover', dragOver);
        row.addEventListener('dragenter', dragEnter);
        row.addEventListener('dragleave', dragLeave);
        row.addEventListener('drop', drop);
        row.addEventListener('dragend', dragEnd);
    });
    
    // Rimuovi la notifica persistente
    document.querySelectorAll('.notification.persistent').forEach(notifica => {
        notifica.classList.remove('visible');
        
        // Rimuovi l'elemento dopo che la transizione è completata
        setTimeout(() => {
            notifica.remove();
        }, 300);
    });
    
    // Aggiorna visivamente l'interfaccia
    aggiornaVisualizzazioneModalitaDragDrop();
}

// Funzione per attivare la modalità categorie
function attivaModalitaCategorie() {
    dragDropMode = 'categorie';
    dragDropModeActive = true; // Imposta sempre a true quando attiviamo questa modalità
    
    // Disattiva drag&drop per le lavorazioni
    document.querySelectorAll('.input-row').forEach(row => {
        row.setAttribute('draggable', 'false');
        row.classList.remove('draggable-row');
        
        // Rimuovi tutti gli event listener di drag&drop delle lavorazioni
        row.removeEventListener('dragstart', dragStart);
        row.removeEventListener('dragover', dragOver);
        row.removeEventListener('dragenter', dragEnter);
        row.removeEventListener('dragleave', dragLeave);
        row.removeEventListener('drop', drop);
        row.removeEventListener('dragend', dragEnd);
    });
    
    // Attiva drag&drop per le categorie
    document.querySelectorAll('.category-section').forEach(section => {
        section.setAttribute('draggable', 'true');
        section.classList.add('draggable-category');
        
        // Aggiungi event listeners per il drag&drop delle categorie
        section.addEventListener('dragstart', handleDragStart);
        section.addEventListener('dragover', handleDragOver);
        section.addEventListener('dragenter', handleDragEnter);
        section.addEventListener('dragleave', handleDragLeave);
        section.addEventListener('drop', handleDrop);
        section.addEventListener('dragend', handleDragEnd);
    });
    
    // Rimuovi eventuali notifiche persistenti precedenti
    document.querySelectorAll('.notification.persistent').forEach(notifica => {
        notifica.remove();
    });
    
    // Mostra una notifica persistente che rimarrà visibile fino alla disattivazione
    const notifica = mostraNotifica('Modalità spostamento categorie attiva - clicca di nuovo per disattivare', 'persistent', 0);
    notifica.classList.add('persistent');
    
    // Aggiorna visivamente l'interfaccia
    aggiornaVisualizzazioneModalitaDragDrop();
}
// Funzione per aggiornare visivamente l'interfaccia utente in base alla modalità drag&drop
function aggiornaVisualizzazioneModalitaDragDrop() {
    // Aggiunge o rimuove classi CSS per indicare visivamente la modalità attuale
    document.querySelectorAll('.category-section').forEach(section => {
        if (dragDropMode === 'categorie') {
            section.classList.add('mode-category-drag');
            section.querySelector('.category-header').classList.add('drag-category-active');
            
            // Aggiungi classe per indicare se è attivata permanentemente
            if (dragDropModeActive) {
                section.classList.add('drag-category-active-permanent');
                section.querySelector('.category-header').classList.add('drag-category-active-permanent');
            } else {
                section.classList.remove('drag-category-active-permanent');
                section.querySelector('.category-header').classList.remove('drag-category-active-permanent');
            }
        } else {
            section.classList.remove('mode-category-drag');
            section.classList.remove('drag-category-active-permanent');
            section.querySelector('.category-header').classList.remove('drag-category-active');
            section.querySelector('.category-header').classList.remove('drag-category-active-permanent');
        }
    });
    
    document.querySelectorAll('.input-row').forEach(row => {
        if (dragDropMode === 'lavorazioni') {
            row.classList.add('mode-lavorazioni-drag');
        } else {
            row.classList.remove('mode-lavorazioni-drag');
        }
    });
    
    // Aggiungi gli stili CSS necessari se non esistono già
    aggiungiStiliCSSPerModalitaDragDrop();
}

// Funzione per aggiungere gli stili CSS necessari per le indicazioni visive
function aggiungiStiliCSSPerModalitaDragDrop() {
    // Verifica se gli stili sono già stati aggiunti
    if (!document.getElementById('dragdrop-mode-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'dragdrop-mode-styles';
        styleElement.textContent = `
            /* Stili per la modalità categorie */
            .mode-category-drag {
                position: relative;
                outline: none;
                transition: all 0.2s ease;
            }
            
            .mode-category-drag:hover {
                box-shadow: 0 0 10px rgba(26, 41, 128, 0.3);
            }
            
            .drag-category-active {
                background-color: #1a2980 !important;
                cursor: grab;
            }
            
            /* Stile speciale per modalità attivata permanentemente */
            .drag-category-active-permanent {
                border-left: 4px solid #db0d0d !important;
            }
            
            .drag-category-active .category-title h3 {
                color: white;
            }
            
            /* Stili per la modalità lavorazioni */
            .mode-lavorazioni-drag {
                cursor: grab;
                position: relative;
                transition: all 0.2s ease;
            }
            
            .mode-lavorazioni-drag:hover {
                background-color: #f5f9ff;
            }
            
            /* Stili per gli elementi durante il trascinamento */
            .dragging {
                opacity: 0.5;
                cursor: grabbing;
            }
            
            .drag-over {
                border: 2px dashed #1a2980;
            }
        `;
        document.head.appendChild(styleElement);
    }
}

// Funzione per aggiornare gli indici dei materiali dopo il riordino delle categorie
function aggiornaIndiciMaterialiDopoRiordino(sourceIndex, targetIndex) {
    // Creiamo una copia dell'oggetto materiali
    const materialiCopia = JSON.parse(JSON.stringify(materiali));
    const nuoviMateriali = {};
    
    // Determina la direzione dello spostamento
    const spostamentoVerso = sourceIndex < targetIndex ? 'giu' : 'su';
    
    // Itera su tutte le chiavi dei materiali
    Object.keys(materiali).forEach(chiave => {
        // Estrai l'indice della categoria dalla chiave (formato: "catX_Y")
        const match = chiave.match(/^cat(\d+)_(.+)$/);
        if (match) {
            const catIndex = parseInt(match[1]);
            const lavorazioneId = match[2];
            let nuovoCatIndex = catIndex;
            
            // Aggiorna l'indice in base alla direzione dello spostamento
            if (spostamentoVerso === 'giu') {
                // Spostamento verso il basso
                if (catIndex === sourceIndex) {
                    // La categoria spostata
                    nuovoCatIndex = targetIndex;
                } else if (catIndex > sourceIndex && catIndex <= targetIndex) {
                    // Categorie che devono essere spostate in su
                    nuovoCatIndex = catIndex - 1;
                }
            } else {
                // Spostamento verso l'alto
                if (catIndex === sourceIndex) {
                    // La categoria spostata
                    nuovoCatIndex = targetIndex;
                } else if (catIndex >= targetIndex && catIndex < sourceIndex) {
                    // Categorie che devono essere spostate in giù
                    nuovoCatIndex = catIndex + 1;
                }
            }
            
            // Crea la nuova chiave e assegna i materiali
            const nuovaChiave = `cat${nuovoCatIndex}_${lavorazioneId}`;
            nuoviMateriali[nuovaChiave] = materialiCopia[chiave];
        }
    });
    
    // Aggiorna l'oggetto materiali con i nuovi indici
    materiali = nuoviMateriali;
}

// Funzione per preservare la modalità drag&drop durante l'aggiornamento
function preservaModalitaDragDrop() {
    // Se la modalità categorie è attiva
    if (dragDropMode === 'categorie' && dragDropModeActive) {
        // Salva la notifica persistente esistente
        const notificaEsistente = document.querySelector('.notification.persistent');
        
        // Riattiva la modalità categorie ma senza mostrare una nuova notifica
        document.querySelectorAll('.category-section').forEach(section => {
            section.setAttribute('draggable', 'true');
            section.classList.add('draggable-category');
            section.classList.add('mode-category-drag');
            
            // Aggiungi la classe visiva per l'intestazione attiva
            const header = section.querySelector('.category-header');
            if (header) {
                header.classList.add('drag-category-active');
            }
            
            // Aggiungi event listeners per il drag&drop delle categorie
            section.addEventListener('dragstart', handleDragStart);
            section.addEventListener('dragover', handleDragOver);
            section.addEventListener('dragenter', handleDragEnter);
            section.addEventListener('dragleave', handleDragLeave);
            section.addEventListener('drop', handleDrop);
            section.addEventListener('dragend', handleDragEnd);
        });
    }
}

/**
 * Gestisce il cambio dello sconto per una categoria
 * @param {Event} e - Evento di input
 */
function gestisciCambioSconto(e) {
    const categoryIndex = parseInt(e.target.dataset.categoryIndex);
    let sconto = parseFloat(e.target.value.replace(',', '.')) || 0;
    
    // Controlla se il valore è valido
    if (isNaN(sconto) || sconto < 0 || sconto > 100) {
        alert('Lo sconto deve essere un numero compreso tra 0 e 100');
        e.target.value = categorie[categoryIndex].sconto || 0;
        return;
    }
    
    // Arrotonda a 2 decimali
    sconto = Math.round(sconto * 100) / 100;
    
    // Aggiorna il valore dello sconto nella categoria
    categorie[categoryIndex].sconto = sconto;
    
    try {
        // Applica lo sconto a tutte le voci e calcola il nuovo totale
        const totaleRicalcolato = applicaScontoAlleVoci(categorie[categoryIndex]);
        
        // Aggiorna l'interfaccia utente
        aggiornaInterfacciaDopoSconto(categoryIndex, totaleRicalcolato, e.target);
        
    } catch (error) {
        console.error('Errore durante l\'applicazione dello sconto:', error);
        alert('Si è verificato un errore durante il calcolo dello sconto');
    }
}

/**
 * Aggiorna l'interfaccia dopo un cambio di sconto
 * @param {number} categoryIndex - Indice della categoria
 * @param {number} totaleRicalcolato - Totale ricalcolato dopo lo sconto
 * @param {HTMLElement} sourceElement - Elemento che ha innescato l'aggiornamento
 */
function aggiornaInterfacciaDopoSconto(categoryIndex, totaleRicalcolato, sourceElement) {
    // Trova la sezione della categoria
    const categorySection = sourceElement ? 
        sourceElement.closest('.category-section') : 
        document.querySelector(`.category-section[data-category-index="${categoryIndex}"]`);
    
    if (!categorySection) return;
    
    // Aggiorna tutti gli importi delle voci con lo sconto applicato
    const lavorazioniRows = categorySection.querySelectorAll('.input-row');
    lavorazioniRows.forEach((row, index) => {
        if (index >= categorie[categoryIndex].lavorazioni.length) return;
        
        const lavorazione = categorie[categoryIndex].lavorazioni[index];
        const importCell = row.querySelector('.importo-value');
        
        if (importCell && lavorazione) {
            // Aggiorna il valore visualizzato con lo sconto applicato
            importCell.textContent = lavorazione.importoManodoperaScontato ? 
                formatCurrency(lavorazione.importoManodoperaScontato) : 
                formatCurrency(parseEuroToNumber(lavorazione.importoManodopera));
        }
    });
    
    // Aggiorna il totale visualizzato
    const totalElement = categorySection.querySelector('.totale-row .importo-value');
    if (totalElement) {
        totalElement.innerHTML = `<strong>${formatCurrency(totaleRicalcolato)}</strong>`;
    }
    
    // Verifica se il numero di operai deve essere aggiornato in base agli operai assegnati
    const categoria = categorie[categoryIndex];
    const operaiAssegnati = categoria.operaiAssegnati || [];
    const numeroOperaiAssegnati = operaiAssegnati.length;
    if (numeroOperaiAssegnati > 0 && categoria.numeroOperai !== numeroOperaiAssegnati) {
        // Aggiorna il valore nel modello dati
        categoria.numeroOperai = numeroOperaiAssegnati;
        
        // Aggiorna la visualizzazione
        const inputOperai = categorySection.querySelector('.input-operai');
        if (inputOperai) {
            inputOperai.value = numeroOperaiAssegnati;
        }
        
        const spanOperai = categorySection.querySelector('.operai-row .print-only');
        if (spanOperai) {
            spanOperai.textContent = numeroOperaiAssegnati;
        }
    }

    // Aggiorna le giornate lavorative
    aggiornaGiornateLavorative(categoryIndex);
    
    // Aggiorna anche l'offerta se visibile
    if (document.getElementById('pageOfferta').classList.contains('active')) {
        aggiornaOfferta();
    }
}

// Modifica la funzione di caricamento progetto per supportare operai
function caricaProgetto(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            // Analizza il contenuto JSON del file
            const datiProgetto = JSON.parse(e.target.result);
            
            // Ripristina i dati del progetto
            categorie = datiProgetto.categorie || [];
            materiali = datiProgetto.materiali || {};
            valoreManodoperaInput.value = datiProgetto.valoreManodopera || '';
            
            // Ripristina i dati degli operai se presenti
            operai = datiProgetto.operai || [];
            
            // Aggiorna l'interfaccia
            aggiornaTabelleCategorie();
            
            // Passa alla pagina categorie
            showPage('pageCategorie');
            
            alert('Progetto caricato con successo!');
        } catch (error) {
            console.error('Errore durante il caricamento del progetto:', error);
            alert('Errore durante il caricamento del progetto. Verifica che il file sia nel formato corretto.');
        }
    };
    
    reader.onerror = function() {
        alert('Errore durante la lettura del file.');
    };
    
    reader.readAsText(file);
}

// Modifica la funzione di salvataggio progetto per includere operai
function salvaProgetto() {
    // Crea un oggetto con tutti i dati da salvare
    const datiProgetto = {
        categorie: categorie,
        materiali: materiali,
        valoreManodopera: valoreManodoperaInput.value,
        operai: operai
    };
    
    // Converti l'oggetto in stringa JSON
    const contenutoFile = JSON.stringify(datiProgetto, null, 2);
    
    // Crea un blob e un URL per il download
    const blob = new Blob([contenutoFile], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Crea un elemento <a> per scaricare il file
    const a = document.createElement('a');
    a.href = url;
    a.download = 'progetto_cantiere.json';
    document.body.appendChild(a);
    a.click();
    
    // Pulisci
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Funzione per gestire l'eliminazione delle categorie
function aggiungiGestioneEliminazione() {
    document.querySelectorAll('.elimina-riga').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            if (confirm(`Sei sicuro di voler eliminare la categoria "${categorie[index].nome}"?`)) {
                // Prima di eliminare la categoria, rimuovi i materiali associati
                categorie[index].lavorazioni.forEach(lavorazione => {
                    const codiceUnivoco = `cat${index}_${lavorazione.numero}`;
                    delete materiali[codiceUnivoco];
                });
                
                categorie.splice(index, 1);
                aggiornaTabelleCategorie();
            }
        });
    });
}

// Funzione per gestire la modifica del nome della categoria
function aggiungiGestioneModifica() {
    document.querySelectorAll('.modifica-riga').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            const nuovoNome = prompt('Inserisci il nuovo nome della categoria:', categorie[index].nome);
            if (nuovoNome && nuovoNome.trim() !== '') {
                categorie[index].nome = nuovoNome.trim();
                aggiornaTabelleCategorie();
            }
        });
    });
}

// Funzione per gestire le note delle categorie
function aggiungiGestioneNote() {
    // Event listener per modificare le note
    document.querySelectorAll('.note-input').forEach((input, index) => {
        input.addEventListener('change', (e) => {
            const categorySection = e.target.closest('.category-section');
            const categoryIndex = parseInt(categorySection.dataset.categoryIndex);
            
            categorie[categoryIndex].note = e.target.value;
            
            // Aggiorna anche il contenuto di stampa
            const noteContent = categorySection.querySelector('.note-content');
            if (noteContent) {
                noteContent.textContent = e.target.value;
            }
        });
    });
}

// Funzione per gestire il drag&drop delle lavorazioni
function aggiungiGestioneSpostamento() {
    // Questa funzione è mantenuta per retrocompatibilità
    // L'attivazione effettiva del drag&drop per lavorazioni avviene in attivaModalitaLavorazioni()
    console.log('La gestione drag&drop delle lavorazioni è ora controllata da aggiungiGestioneDragDropAlternato');
}
// Funzioni di supporto per il drag&drop
function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.codiceUnivoco);
    e.target.classList.add('dragging');
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
    e.target.closest('tr').classList.add('drag-over');
}

function dragLeave(e) {
    e.target.closest('tr').classList.remove('drag-over');
}

function drop(e) {
    e.preventDefault();
    const draggedRowCodiceUnivoco = e.dataTransfer.getData('text/plain');
    const targetRow = e.target.closest('tr');
    const targetCodiceUnivoco = targetRow.dataset.codiceUnivoco;
    
    // Ottieni gli indici della categoria e delle lavorazioni
    const draggedRow = document.querySelector(`tr[data-codice-univoco="${draggedRowCodiceUnivoco}"]`);
    const categorySection = draggedRow.closest('.category-section');
    const categoryIndex = parseInt(categorySection.dataset.categoryIndex);
    
    const draggedRowIndex = Array.from(categorySection.querySelectorAll('.input-row')).indexOf(draggedRow);
    const targetRowIndex = Array.from(categorySection.querySelectorAll('.input-row')).indexOf(targetRow);
    
    // Salva lo stato di espansione di tutte le categorie prima dell'aggiornamento
    const statoCategorieEspanse = salvaStatoCategorie();
    
    // Sposta la lavorazione nell'array
    const lavorazioni = categorie[categoryIndex].lavorazioni;
    const [removed] = lavorazioni.splice(draggedRowIndex, 1);
    lavorazioni.splice(targetRowIndex, 0, removed);
    
    // Aggiorna i materiali associati
    const draggedLavorazioneNumero = removed.numero;
    const targetLavorazioneNumero = lavorazioni[targetRowIndex].numero;
    
    // Gestisci i codici univoci per i materiali
    const draggedLavorazioneVecchioCodice = `cat${categoryIndex}_${draggedLavorazioneNumero}`;
    
    // Crea un backup temporaneo dei materiali se necessario
    if (materiali[draggedLavorazioneVecchioCodice]) {
        // Crea un nome temporaneo unico
        const tempKey = `temp_${Date.now()}_${draggedLavorazioneVecchioCodice}`;
        materiali[tempKey] = materiali[draggedLavorazioneVecchioCodice];
        delete materiali[draggedLavorazioneVecchioCodice];
        
        // Dopo aver spostato la lavorazione, aggiorna il codice univoco nei materiali
        materiali[`cat${categoryIndex}_${draggedLavorazioneNumero}`] = materiali[tempKey];
        delete materiali[tempKey];
    }
    
    // Aggiorna le tabelle
    aggiornaTabelleCategorie();
    
    // Ripristina lo stato di espansione delle categorie
    ripristinaStatoCategorie(statoCategorieEspanse);
    
    targetRow.classList.remove('drag-over');
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.drag-over').forEach(row => {
        row.classList.remove('drag-over');
    });
   
    // Event listener per spostare in basso
    document.querySelectorAll('.sposta-giu').forEach(button => {
        button.addEventListener('click', (e) => {
            const categoryIndex = parseInt(e.currentTarget.dataset.category);
            const lavorazioneIndex = parseInt(e.currentTarget.dataset.lavorazione);
            
            if (lavorazioneIndex < categorie[categoryIndex].lavorazioni.length - 1) {
                // Prima di scambiare le lavorazioni, aggiorna i codici univoci dei materiali
                const lavorazioneCorrente = categorie[categoryIndex].lavorazioni[lavorazioneIndex];
                const lavorazioneSotto = categorie[categoryIndex].lavorazioni[lavorazioneIndex + 1];
                
                const codiceCorrenteVecchio = `cat${categoryIndex}_${lavorazioneCorrente.numero}`;
                const codiceSottoVecchio = `cat${categoryIndex}_${lavorazioneSotto.numero}`;
                
                // Scambia la lavorazione corrente con quella sotto
                const temp = categorie[categoryIndex].lavorazioni[lavorazioneIndex];
                categorie[categoryIndex].lavorazioni[lavorazioneIndex] = categorie[categoryIndex].lavorazioni[lavorazioneIndex + 1];
                categorie[categoryIndex].lavorazioni[lavorazioneIndex + 1] = temp;
                
                // Aggiorna i materiali con i nuovi codici univoci
                const materialiCorrente = materiali[codiceCorrenteVecchio];
                const materialiSotto = materiali[codiceSottoVecchio];
                
                // Elimina i vecchi riferimenti
                delete materiali[codiceCorrenteVecchio];
                delete materiali[codiceSottoVecchio];
                
                // Crea i nuovi riferimenti
                if (materialiCorrente && materialiCorrente.length > 0) {
                    materiali[codiceSottoVecchio] = materialiCorrente;
                }
                
                if (materialiSotto && materialiSotto.length > 0) {
                    materiali[codiceCorrenteVecchio] = materialiSotto;
                }
                
                // Aggiorna le tabelle
                aggiornaTabelleCategorie();
            }
        });
    });
}

// Funzione per aggiungere la gestione di eliminazione, duplicazione e cambio categoria delle lavorazioni
function aggiungiGestioneVociLavorazioni() {
    // Elimina singola voce
    document.querySelectorAll('.elimina-voce').forEach(button => {
        button.addEventListener('click', (e) => {
            const categoryIndex = parseInt(e.currentTarget.dataset.category);
            const lavorazioneIndex = parseInt(e.currentTarget.dataset.lavorazione);
            
            if (confirm('Sei sicuro di voler eliminare questa lavorazione?')) {
                // Rimuovi la lavorazione
                const lavorazione = categorie[categoryIndex].lavorazioni[lavorazioneIndex];
                const codiceUnivoco = `cat${categoryIndex}_${lavorazione.numero}`;
                
                // Rimuovi i materiali associati
                delete materiali[codiceUnivoco];
                
                // Rimuovi la lavorazione
                categorie[categoryIndex].lavorazioni.splice(lavorazioneIndex, 1);
                
                // Aggiorna le tabelle
                aggiornaTabelleCategorie();
            }
        });
    });

    // Duplica singola voce
    document.querySelectorAll('.duplica-voce').forEach(button => {
        button.addEventListener('click', (e) => {
            const categoryIndex = parseInt(e.currentTarget.dataset.category);
            const lavorazioneIndex = parseInt(e.currentTarget.dataset.lavorazione);
            
            const lavorazioneDuplicata = JSON.parse(JSON.stringify(categorie[categoryIndex].lavorazioni[lavorazioneIndex]));
            
            // Modifica il numero per renderlo unico
            const ultimoNumero = categorie[categoryIndex].lavorazioni.reduce((max, lav) => 
                Math.max(max, parseInt(lav.numero)), 0);
            lavorazioneDuplicata.numero = (ultimoNumero + 1).toString();
            
            // Aggiungi la lavorazione duplicata
            categorie[categoryIndex].lavorazioni.splice(lavorazioneIndex + 1, 0, lavorazioneDuplicata);
            
            // Aggiorna i materiali
            const vecchioCodice = `cat${categoryIndex}_${lavorazioneDuplicata.numero}`;
            const nuovoCodice = `cat${categoryIndex}_${ultimoNumero + 1}`;
            
            if (materiali[vecchioCodice]) {
                materiali[nuovoCodice] = JSON.parse(JSON.stringify(materiali[vecchioCodice]));
            }
            
            // Aggiorna le tabelle
            aggiornaTabelleCategorie();
        });
    });

    // Cambia categoria
    document.querySelectorAll('.cambia-categoria').forEach(button => {
        button.addEventListener('click', (e) => {
            const categoryIndex = parseInt(e.currentTarget.dataset.category);
            const lavorazioneIndex = parseInt(e.currentTarget.dataset.lavorazione);
            
            // Crea un modal di selezione categoria
            const modalCambioCategoria = document.createElement('div');
            modalCambioCategoria.id = 'cambio-categoria-modal';
            modalCambioCategoria.className = 'modal';
            modalCambioCategoria.innerHTML = `
                <div class="modal-content">
                    <h3>Seleziona nuova categoria</h3>
                    <select id="nuova-categoria">
                        ${categorie.map((cat, index) => 
                            index !== categoryIndex ? 
                            `<option value="${index}">${cat.nome}</option>` : ''
                        ).join('')}
                    </select>
                    <div class="modal-buttons">
                        <button id="annulla-cambio-categoria">Annulla</button>
                        <button id="conferma-cambio-categoria">Conferma</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modalCambioCategoria);
            showModal(modalCambioCategoria);
            
            document.getElementById('annulla-cambio-categoria').addEventListener('click', () => {
                hideModal(modalCambioCategoria);
                modalCambioCategoria.remove();
            });
            
            document.getElementById('conferma-cambio-categoria').addEventListener('click', () => {
                const nuovaCategoriaIndex = parseInt(document.getElementById('nuova-categoria').value);
                
                // Sposta la lavorazione
                const lavorazione = categorie[categoryIndex].lavorazioni.splice(lavorazioneIndex, 1)[0];
                
                // Sposta i materiali
                const vecchioCodice = `cat${categoryIndex}_${lavorazione.numero}`;
                const nuovoCodice = `cat${nuovaCategoriaIndex}_${lavorazione.numero}`;
                
                if (materiali[vecchioCodice]) {
                    materiali[nuovoCodice] = materiali[vecchioCodice];
                    delete materiali[vecchioCodice];
                }
                
                // Aggiungi alla nuova categoria
                categorie[nuovaCategoriaIndex].lavorazioni.push(lavorazione);
                
                // Aggiorna le tabelle
                aggiornaTabelleCategorie();
                
                // Chiudi il modal
                hideModal(modalCambioCategoria);
                modalCambioCategoria.remove();
            });
        });
    });
}

// Funzione per completare la gestione dell'editazione delle lavorazioni
function aggiungiGestioneModificaLavorazione() {
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const categoryIndex = parseInt(e.currentTarget.dataset.category);
            const lavorazioneIndex = parseInt(e.currentTarget.dataset.lavorazione);
            const codiceUnivoco = e.currentTarget.dataset.codiceUnivoco;
            
            // Salva gli indici correnti
            currentCategoryIndex = categoryIndex;
            currentLavorazioneIndex = lavorazioneIndex;
            currentCodiceUnivoco = codiceUnivoco;
            
            // Recupera i dati della lavorazione
            const lavorazione = categorie[categoryIndex].lavorazioni[lavorazioneIndex];
            
            // Popola il form
            editNumero.value = lavorazione.numero || '';
            editTariffa.value = lavorazione.tariffa || '';
            editNome.value = lavorazione.nome || '';
            editQuantita.value = lavorazione.quantita || '';
            editImportoManodopera.value = lavorazione.importoManodopera || '';
            editPrezzoUnitario.value = lavorazione.prezzoUnitario || '';
            editPercentualeMO.value = lavorazione.percentualeMO || '';
            
            // Mostra il modal
            showModal(modificaLavorazioneModal);
        });
    });
}

// Funzione per gestire la modifica di una lavorazione
function salvaLavorazioneModificata() {
    // Verifica che ci siano indici di categoria e lavorazione validi
    if (currentCategoryIndex === null || currentLavorazioneIndex === null) return;
    
    // Recupera i dati dal form
const lavorazioneDati = {
    numero: editNumero.value,
    tariffa: editTariffa.value,
    nome: editNome.value,
    quantita: editQuantita.value,
    importoManodopera: editImportoManodopera.value,
    importoManodoperaRaw: parseEuroToNumber(editImportoManodopera.value),
    prezzoUnitario: editPrezzoUnitario.value,
    prezzoUnitarioRaw: parseEuroToNumber(editPrezzoUnitario.value),
    percentualeMO: editPercentualeMO.value
};

// Recupera la lavorazione attuale
const lavorazioneAttuale = categorie[currentCategoryIndex].lavorazioni[currentLavorazioneIndex];

// Calcola i codici univoci vecchio e nuovo utilizzando la variabile corretta
const vecchioCodice = currentMaterialeVoce || `cat${currentCategoryIndex}_${lavorazioneAttuale.numero}`;
const nuovoCodice = `cat${currentCategoryIndex}_${lavorazioneDati.numero}`;

// Se il numero è cambiato, dobbiamo spostare i materiali associati
if (vecchioCodice !== nuovoCodice && materiali[vecchioCodice]) {
    materiali[nuovoCodice] = materiali[vecchioCodice];
    delete materiali[vecchioCodice];
}

// Aggiorna la lavorazione nel modello dati
categorie[currentCategoryIndex].lavorazioni[currentLavorazioneIndex] = lavorazioneDati;

// Applica lo sconto alla lavorazione aggiornata
const sconto = categorie[currentCategoryIndex].sconto || 0;
lavorazioneDati.importoManodoperaScontato = lavorazioneDati.importoManodoperaRaw * (1 - (sconto / 100));

// Aggiorna le tabelle
aggiornaTabelleCategorie();

// Nascondi il modal
hideModal(modificaLavorazioneModal);
}

/**
 * Aggiorna il calcolo e la visualizzazione delle giornate lavorative per una categoria
 * @param {number} categoryIndex - Indice della categoria da aggiornare
 */
function aggiornaGiornateLavorative(categoryIndex) {
    const categoria = categorie[categoryIndex];
    if (!categoria) {
        console.error(`Categoria con indice ${categoryIndex} non trovata`);
        return;
    }
    
    // Cerca la cella delle giornate nel DOM
    const giornateCell = document.querySelector(`.giornate-cell[data-category-index="${categoryIndex}"]`);
    if (!giornateCell) {
        console.warn(`Cella giornate per categoria ${categoryIndex} non trovata nel DOM`);
        return;
    }
    
    try {
        // Calcola il totale considerando lo sconto già applicato
        let totaleImporti = 0;
        
        // Usiamo un metodo più affidabile per calcolare il totale
        categoria.lavorazioni.forEach(lavorazione => {
            // Prendiamo il valore già scontato se disponibile
            if (lavorazione.importoManodoperaScontato !== undefined) {
                totaleImporti += lavorazione.importoManodoperaScontato;
            } 
            // Altrimenti calcoliamo lo sconto al momento
            else {
                // Determina l'importo base
                let importoBase = 0;
                if (lavorazione.importoManodoperaRaw !== undefined) {
                    importoBase = lavorazione.importoManodoperaRaw;
                } else if (lavorazione.importoManodopera) {
                    importoBase = parseEuroToNumber(lavorazione.importoManodopera);
                }
                
                // Calcola l'importo scontato e somma al totale
                if (importoBase > 0) {
                    const risultato = calcolaImporti({
                        importoBase: importoBase,
                        sconto: categoria.sconto || 0
                    });
                    totaleImporti += risultato.importoScontato;
                }
            }
        });
        
        // Calcola le giornate lavorative
        const costoGiornaliero = parseEuroToNumber(valoreManodoperaInput.value);
        const numeroOperai = parseInt(categoria.numeroOperai) || 0;
        
        let giornateLavorative = '-';
        if (numeroOperai > 0 && costoGiornaliero > 0) {
            giornateLavorative = Math.floor(totaleImporti / (numeroOperai * costoGiornaliero));
            giornateLavorative = giornateLavorative > 0 ? giornateLavorative : '-';
        }
        
        // Aggiorna il testo nella cella
        giornateCell.textContent = giornateLavorative;
        
        // Aggiorna automaticamente la data di fine se possibile
        if (categoria.dataInizio && numeroOperai > 0 && giornateLavorative !== '-') {
            const dataFine = calcolaDataFineDaGiorni(categoria.dataInizio, giornateLavorative);
            if (dataFine) {
                categoria.dataFine = dataFine;
                
                // Aggiorna la visualizzazione della data di fine con una selezione più precisa
                const dataFineRow = document.querySelector(`.category-section[data-category-index="${categoryIndex}"] .date-row:nth-of-type(2)`);
                if (dataFineRow) {
                    const dataFineSpan = dataFineRow.querySelector('span');
                    if (dataFineSpan) {
                        dataFineSpan.textContent = formatDate(dataFine);
                    }
                }
                
                // Aggiorna anche nella pagina operai se è visibile
                if (document.getElementById('pageOperai').classList.contains('active')) {
                    const dataFineInput = document.querySelector(`.data-fine-input[data-categoria-index="${categoryIndex}"]`);
                    if (dataFineInput) {
                        dataFineInput.value = dataFine;
                    }
                }
            }
        }
    } catch (error) {
        console.error('Errore nel calcolo delle giornate lavorative:', error);
        giornateCell.textContent = 'Errore';
    }
}

// Funzione per gestire l'assegnazione di operai a una categoria
function assegnaOperaiCategoria(categoriaIndex) {
// Pulisci la lista di operai nel modal
const listaOperaiAssegnazioneContainer = document.getElementById('listaOperaiAssegnazione');
listaOperaiAssegnazioneContainer.innerHTML = '';

// Salva il riferimento alla categoria corrente
currentCategoryIndex = categoriaIndex;

// Ottieni gli operai già assegnati alla categoria
const operaiAssegnati = categorie[categoriaIndex].operaiAssegnati || [];

// Aggiungi un checkbox per ogni operaio
operai.forEach(operaio => {
    const operaioCheckbox = document.createElement('div');
    operaioCheckbox.className = 'operaio-checkbox';
    operaioCheckbox.innerHTML = `
        <label style="display: flex;">
            <input type="checkbox" class="operaio-check" value="${operaio.id}" 
                ${operaiAssegnati.includes(operaio.id) ? 'checked' : ''} style="width: 10%;">
            <span class="checkbox-label" style="width: 90%;">${operaio.nome} ${operaio.cognome}</span>
        </label>
    `;
    listaOperaiAssegnazioneContainer.appendChild(operaioCheckbox);
});

// Se non ci sono operai, mostra un messaggio
if (operai.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.style.margin = '20px 0';
    emptyState.textContent = 'Nessun operaio disponibile. Aggiungi operai dalla pagina "Gestione Operai".';
    listaOperaiAssegnazioneContainer.appendChild(emptyState);
}

// Aggiorna il titolo del modal
document.querySelector('#assegnaOperaiModal .modal-title').textContent = 
    `Assegna Operai a: ${categorie[categoriaIndex].nome}`;

// Mostra il modal
showModal(assegnaOperaiModal);
}

// Funzione per salvare l'assegnazione degli operai
function salvaAssegnazioneOperai() {
    // Ottieni tutti i checkbox selezionati
    const operaiChecked = document.querySelectorAll('.operaio-check:checked');
    const nuoviOperaiAssegnati = Array.from(operaiChecked).map(cb => cb.value);

// Funzione per aggiornare dinamicamente il modal dell'organico con i pulsanti di gestione file
function aggiornaModalOrganico() {
    // Verifica se il modal esiste già
    const modalContent = document.querySelector('#organicoModal .modal-buttons');
    if (modalContent) {
        // Controlla se i pulsanti sono già presenti
        if (!document.getElementById('salvaOperaiBtn')) {
            // Crea e inserisci i nuovi pulsanti
            const salvaBtn = document.createElement('button');
            salvaBtn.id = 'salvaOperaiBtn';
            salvaBtn.textContent = 'Salva Elenco Operai';
            salvaBtn.addEventListener('click', salvaElencoOperai);
            
            const caricaBtn = document.createElement('button');
            caricaBtn.id = 'caricaOperaiBtn';
            caricaBtn.textContent = 'Carica Elenco Operai';
            caricaBtn.addEventListener('click', () => {
                document.getElementById('operaiFile').click();
            });
            
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.id = 'operaiFile';
            fileInput.accept = '.txt';
            fileInput.style.display = 'none';
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    caricaElencoOperai(file);
                    e.target.value = '';
                }
            });
            
            // Ottieni il pulsante "Chiudi"
            const chiudiBtn = document.getElementById('chiudiOrganicoBtn');
            
            // Inserisci i nuovi elementi prima del pulsante "Chiudi"
            modalContent.insertBefore(salvaBtn, chiudiBtn);
            modalContent.insertBefore(caricaBtn, chiudiBtn);
            modalContent.insertBefore(fileInput, chiudiBtn);
            
            console.log('Pulsanti aggiunti dinamicamente al modal organico');
        }
    }
}

    // Aggiorna la categoria con i nuovi operai assegnati
    if (categorie[currentCategoryIndex]) {
        const vecchioNumeroOperai = categorie[currentCategoryIndex].numeroOperai || 0;
        categorie[currentCategoryIndex].operaiAssegnati = nuoviOperaiAssegnati;
        
        // Aggiorna automaticamente il numero di operai in base a quelli assegnati
        categorie[currentCategoryIndex].numeroOperai = nuoviOperaiAssegnati.length;
        console.log(`Aggiornato numero operai per categoria ${currentCategoryIndex} a ${nuoviOperaiAssegnati.length}`);
        
        // Se ci sono operai assegnati ma non ci sono date impostate, imposta la data di inizio a oggi
        if (nuoviOperaiAssegnati.length > 0) {
            const oldDataInizio = categorie[currentCategoryIndex].dataInizio;
            
            // Se non c'è data di inizio o il numero di operai è cambiato, imposta/ricalcola le date
            if (!oldDataInizio || vecchioNumeroOperai !== nuoviOperaiAssegnati.length) {
                // Imposta la data di inizio al giorno lavorativo successivo se non esiste
                let dataInizio;
                if (!oldDataInizio) {
                    dataInizio = getDataOggiISO();
                    let dataInizioObj = new Date(dataInizio);
                    
                    // Assicura che la data di inizio sia un giorno lavorativo
                    while (!isGiornoLavorativo(dataInizioObj)) {
                        dataInizioObj.setDate(dataInizioObj.getDate() + 1);
                    }
                    
                    // Formatta la data in ISO
                    dataInizio = dataInizioObj.toISOString().split('T')[0];
                    
                    // Assegna la data
                    categorie[currentCategoryIndex].dataInizio = dataInizio;
                } else {
                    dataInizio = oldDataInizio;
                }
                
                // Calcola la data di fine usando il numero di operai aggiornato
                const totaleImporti = calcolaTotaleCategoria(categorie[currentCategoryIndex], true);
                
                const giornateLavorative = calcolaGiornateMassime(
                    totaleImporti, 
                    categorie[currentCategoryIndex].numeroOperai, 
                    categorie[currentCategoryIndex].sconto
                );
                
                if (giornateLavorative !== '-') {
                    const dataFine = calcolaDataFineDaGiorni(dataInizio, giornateLavorative);
                    if (dataFine) {
                        categorie[currentCategoryIndex].dataFine = dataFine;
                    }
                }
                
                // Aggiorna le date nella pagina categorie
                aggiornaDateInCategorie(currentCategoryIndex);
            }
        }
    }

    // Nascondi il modal
    hideModal(assegnaOperaiModal);

    // Se siamo nella pagina operai, aggiorna la visualizzazione
    if (document.getElementById('pageOperai').classList.contains('active')) {
        aggiornaGestioneOperai();
    } else {
        // Altrimenti, aggiorna la tabella della categoria
        aggiornaTabelleCategorie();
    }
    
    // Aggiorna l'offerta se è visibile
    if (document.getElementById('pageOfferta').classList.contains('active')) {
        aggiornaOfferta();
    }
}

// Funzione per salvare l'elenco degli operai in un file .txt
function salvaElencoOperai() {
    if (operai.length === 0) {
        alert('Non ci sono operai da salvare.');
        return;
    }

    // Prepariamo il contenuto del file
    let contenuto = '';
    operai.forEach(operaio => {
        contenuto += `${operaio.nome}|${operaio.cognome}|${operaio.id}\n`;
    });

    // Salva in localStorage per caricamento automatico alla prossima apertura
    localStorage.setItem('operai_list', JSON.stringify(operai));
    console.log('Operai salvati in localStorage:', operai);

    // Creiamo un blob e un URL per il download
    const blob = new Blob([contenuto], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // Creiamo un elemento <a> per il download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'elenco_operai.txt';
    document.body.appendChild(a);
    a.click();

    // Puliamo
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    mostraNotifica('Elenco operai salvato con successo!', 'success', 2000);
}

// Funzione per caricare l'elenco degli operai da un file .txt
function caricaElencoOperai(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            console.log('File caricato, dimensione:', e.target.result.length, 'caratteri');
            const contenuto = e.target.result;
            const righe = contenuto.split('\n');
            
            console.log('Righe nel file:', righe.length);
            
            // Array temporaneo per i nuovi operai
            let nuoviOperai = [];
            
            righe.forEach((riga, index) => {
                riga = riga.trim();
                if (riga) {
                    console.log(`Elaborazione riga ${index + 1}:`, riga);
                    const parti = riga.split('|');
                    if (parti.length >= 2) {
                        const operaio = {
                            nome: parti[0],
                            cognome: parti[1],
                            id: parti[2] || generateUniqueId() // Usa l'ID se presente, altrimenti ne genera uno nuovo
                        };
                        console.log('Operaio elaborato:', operaio);
                        nuoviOperai.push(operaio);
                    } else {
                        console.warn(`Riga ${index + 1} non contiene dati separati da '|':`, riga);
                    }
                }
            });
            
            if (nuoviOperai.length > 0) {
                // Chiedi conferma per sovrascrivere o aggiungere
                if (operai.length > 0) {
                    const scelta = confirm('Vuoi aggiungere i nuovi operai a quelli esistenti o sostituirli?\nClicca OK per aggiungere, Annulla per sostituire.');
                    
                    if (scelta) {
                        // Aggiungi i nuovi operai, evitando duplicati (basati su nome+cognome)
                        nuoviOperai.forEach(nuovoOperaio => {
                            const esiste = operai.some(op => 
                                op.nome === nuovoOperaio.nome && op.cognome === nuovoOperaio.cognome);
                            
                            if (!esiste) {
                                operai.push(nuovoOperaio);
                            }
                        });
                    } else {
                        // Sostituisci completamente
                        operai = nuoviOperai;
                    }
                } else {
                    // Nessun operaio esistente, assegna direttamente
                    operai = nuoviOperai;
                }
                
                // Salva anche in localStorage
                localStorage.setItem('operai_list', JSON.stringify(operai));
                console.log('Operai salvati in localStorage dopo caricamento file:', operai);
                
                // Aggiorna la visualizzazione
                aggiornaGestioneOperai();
                mostraModalOrganico();
                
                mostraNotifica(`Caricati ${nuoviOperai.length} operai con successo!`, 'success', 2000);
            } else {
                alert('Nessun operaio trovato nel file selezionato.');
            }
        } catch (error) {
            console.error('Errore durante il caricamento degli operai:', error);
            alert('Errore durante il caricamento del file. Verifica che il formato sia corretto.');
        }
    };
    
    reader.onerror = function(error) {
        console.error('Errore FileReader:', error);
        alert('Errore durante la lettura del file.');
    };
    
    console.log('Avvio lettura file:', file.name, 'dimensione:', file.size, 'bytes');
    reader.readAsText(file, 'UTF-8');
}

// Funzione per verificare e caricare il file operai all'avvio
function caricaElencoOperaiAllAvvio() {
    console.log('Tentativo di caricamento elenco operai all\'avvio...');
    
    // Prima prova a caricare dal localStorage
    const savedOperaiList = localStorage.getItem('operai_list');
    if (savedOperaiList) {
        try {
            const operaiData = JSON.parse(savedOperaiList);
            operai = operaiData;
            console.log('Elenco operai caricato dal localStorage:', operai);
            mostraNotifica('Elenco operai caricato correttamente', 'success', 2000);
            aggiornaGestioneOperai();
            return;
        } catch (error) {
            console.error('Errore durante il caricamento degli operai dal localStorage:', error);
        }
    }
    
    // Se non è disponibile nel localStorage, prova con fetch
    console.log('Tentativo di caricamento da file elenco_operai.txt...');
    fetch('elenco_operai.txt')
        .then(response => {
            console.log('Risposta fetch:', response.status, response.statusText);
            if (response.ok) {
                return response.text();
            }
            throw new Error('File non trovato');
        })
        .then(text => {
            console.log('Contenuto del file:', text);
            // Elabora direttamente il testo anziché creare un blob
            if (text.trim()) {
                const righe = text.split('\n');
                let nuoviOperai = [];
                
                righe.forEach(riga => {
                    riga = riga.trim();
                    if (riga) {
                        const parti = riga.split('|');
                        if (parti.length >= 2) {
                            const operaio = {
                                nome: parti[0],
                                cognome: parti[1],
                                id: parti[2] || generateUniqueId()
                            };
                            nuoviOperai.push(operaio);
                        }
                    }
                });
                
                if (nuoviOperai.length > 0) {
                    operai = nuoviOperai;
                    console.log('Operai caricati da file:', operai);
                    // Salva anche in localStorage
                    localStorage.setItem('operai_list', JSON.stringify(operai));
                    mostraNotifica(`Caricati ${nuoviOperai.length} operai con successo!`, 'success', 2000);
                    aggiornaGestioneOperai();
                }
            }
        })
        .catch(error => {
            console.log('File elenco operai non trovato o errore di caricamento:', error);
        });
}

// =============================================================================
// SEZIONE 7: AGGIORNAMENTO DELL'INIZIALIZZAZIONE
// =============================================================================

// Aggiornamento della funzione di inizializzazione principale dell'applicazione
document.addEventListener('DOMContentLoaded', function() {
    // Inizializza il riferimento ai container di stampa esistenti nell'HTML
    printContainer = document.getElementById('printContainer');
    printContentContainer = document.getElementById('printContentContainer');
    
    // Assicurati che i container di stampa siano nascosti all'inizio
    if (printContainer) {
        printContainer.style.display = 'none';
    }    
    // Inizializza le strutture dati
    if (!window.categorie) window.categorie = [];
    if (!window.materiali) window.materiali = {};
    if (!window.operai) window.operai = [];
    
    // Inizializza la gestione degli operai
    inizializzaGestioneOperai();
    // Tenta di caricare automaticamente il file degli operai all'avvio
    caricaElencoOperaiAllAvvio();

    // Inizializza la pagina categorie come pagina iniziale
    showPage('pageCategorie');
    
    // Assicura che gli elementi di stampa residui siano rimossi (in caso di ricarica della pagina)
    cleanupPrintElements();
    
    // Carica eventuali dati salvati localmente
    const savedData = localStorage.getItem('progetto_cantiere_data');
    if (savedData) {
        try {
            const datiSalvati = JSON.parse(savedData);
            if (datiSalvati.categorie && datiSalvati.categorie.length > 0) {
                const caricaDatiSalvati = confirm('È stato trovato un progetto salvato localmente. Vuoi caricarlo?');
                if (caricaDatiSalvati) {
                    categorie = datiSalvati.categorie || [];
                    materiali = datiSalvati.materiali || {};
                    operai = datiSalvati.operai || [];
                    valoreManodoperaInput.value = datiSalvati.valoreManodopera || '';
                    aggiornaTabelleCategorie();
                }
            }
        } catch (error) {
            console.error('Errore durante il caricamento dei dati salvati:', error);
        }
    }
    
    // Auto-salvataggio periodico
    setInterval(() => {
        if (categorie.length > 0) {
            const datiProgetto = {
                categorie: categorie,
                materiali: materiali,
                operai: operai,
                valoreManodopera: valoreManodoperaInput.value
            };
            localStorage.setItem('progetto_cantiere_data', JSON.stringify(datiProgetto));
        }
    }, 60000); // Salva ogni minuto
    
     // Aggiungi event listeners per i pulsanti di navigazione principali
    tabCategorieBtn.addEventListener('click', () => showPage('pageCategorie'));
    tabMaterialiBtn.addEventListener('click', () => showPage('pageMateriali'));
    tabOffertaBtn.addEventListener('click', () => showPage('pageOfferta'));
    
    // Rimuovi il duplicato del pulsante "Gestione Operai" dalla barra di navigazione
    // Questo non è necessario perché creiamo il pulsante dinamicamente in aggiungiPulsanteNavOperai()
    
    // Aggiungi event listeners per il caricamento di categorie
    aggiungiCategoriaBtn.addEventListener('click', () => {
    // Aggiungi un tooltip o messaggistica per informare l'utente che può selezionare più file
    const tooltipElement = document.createElement('div');
    tooltipElement.className = 'tooltip';
    tooltipElement.textContent = 'Puoi selezionare più file CSV per caricare categorie multiple';
    tooltipElement.style.position = 'absolute';
    tooltipElement.style.left = (aggiungiCategoriaBtn.getBoundingClientRect().left + window.scrollX) + 'px';
    tooltipElement.style.top = (aggiungiCategoriaBtn.getBoundingClientRect().bottom + window.scrollY + 5) + 'px';
    tooltipElement.style.padding = '8px 12px';
    tooltipElement.style.backgroundColor = 'rgba(26, 41, 128, 0.9)';
    tooltipElement.style.color = 'white';
    tooltipElement.style.borderRadius = '4px';
    tooltipElement.style.zIndex = '1000';
    tooltipElement.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    tooltipElement.style.transition = 'opacity 0.3s ease';
    document.body.appendChild(tooltipElement);
    
    // Nascondi il tooltip dopo 3 secondi
    setTimeout(() => {
        tooltipElement.style.opacity = '0';
        setTimeout(() => {
            tooltipElement.remove();
        }, 300);
    }, 3000);
    
    // Apri il selettore file
    categoriaFileInput.click();
});

// Event listener per il pulsante Aggiungi categorie XPWE
aggiungiCategoriaXPWEBtn.addEventListener('click', () => {
    // Aggiungi un tooltip per informare l'utente
    const tooltipElement = document.createElement('div');
    tooltipElement.className = 'tooltip';
    tooltipElement.textContent = 'Puoi selezionare più file XPWE per caricare categorie multiple';
    tooltipElement.style.position = 'absolute';
    tooltipElement.style.left = (aggiungiCategoriaXPWEBtn.getBoundingClientRect().left + window.scrollX) + 'px';
    tooltipElement.style.top = (aggiungiCategoriaXPWEBtn.getBoundingClientRect().bottom + window.scrollY + 5) + 'px';
    tooltipElement.style.padding = '8px 12px';
    tooltipElement.style.backgroundColor = 'rgba(26, 41, 128, 0.9)';
    tooltipElement.style.color = 'white';
    tooltipElement.style.borderRadius = '4px';
    tooltipElement.style.zIndex = '1000';
    tooltipElement.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    tooltipElement.style.transition = 'opacity 0.3s ease';
    document.body.appendChild(tooltipElement);
    
    // Nascondi il tooltip dopo 3 secondi
    setTimeout(() => {
        tooltipElement.style.opacity = '0';
        setTimeout(() => {
            tooltipElement.remove();
        }, 300);
    }, 3000);
    
    // Apri il selettore file
    categoriaFileXPWEInput.click();
});

    // Nuovo codice
categoriaFileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
        // Salva lo stato attuale delle categorie espanse
        const statoCategorieEspanse = salvaStatoCategorie();
        
        // Processa tutti i file in sequenza
        processaMultipleCategorie(files)
            .then(() => {
                // Ripristina lo stato delle categorie espanse
                setTimeout(() => {
                    ripristinaStatoCategorie(statoCategorieEspanse);
                }, 100);
                
                // Reset del valore per permettere di selezionare gli stessi file
                categoriaFileInput.value = '';
            });
    }
});

// Event listener per i file XPWE
categoriaFileXPWEInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
        // Salva lo stato attuale delle categorie espanse
        const statoCategorieEspanse = salvaStatoCategorie();
        
        // Processa tutti i file XPWE in sequenza
        processaMultipleCategorieXPWE(files)
            .then(() => {
                // Ripristina lo stato delle categorie espanse
                setTimeout(() => {
                    ripristinaStatoCategorie(statoCategorieEspanse);
                }, 100);
                
                // Reset del valore per permettere di selezionare gli stessi file
                categoriaFileXPWEInput.value = '';
            });
    }
});

    // Event listeners per il valore della manodopera
    salvaValoreBtn.addEventListener('click', () => {
        let valore = parseFloat(valoreManodoperaInput.value.replace(/\./g, '').replace(/,/, '.'));
        if (!isNaN(valore)) {
            valoreManodoperaInput.value = formatCurrency(valore);
            // Aggiorna le giornate lavorative per tutte le categorie
            categorie.forEach((categoria, index) => {
                aggiornaGiornateLavorative(index);
            });
        } else {
            alert("Inserisci un numero valido.");
        }
    });

    cancellaValoreBtn.addEventListener('click', () => {
        valoreManodoperaInput.value = '';
    });

    // Eventi per la gestione del progetto
    salvaProgettoBtn.addEventListener('click', salvaProgetto);

    caricaProgettoBtn.addEventListener('click', () => {
        progettoFileInput.click();
    });

    progettoFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            caricaProgetto(file);
            // Reset del valore per permettere di selezionare lo stesso file
            progettoFileInput.value = '';
        }
    });

    // Eventi per la stampa
    stampaButton.addEventListener('click', () => {
        showModal(titoloModal);
        titoloInput.value = '';
        clienteInput.value = '';
        titoloInput.focus();
    });

    annullaTitoloBtn.addEventListener('click', () => {
        hideModal(titoloModal);
    });

    // Eventi per il modal di modifica lavorazione
    salvaModificaBtn.addEventListener('click', salvaLavorazioneModificata);
    annullaModificaBtn.addEventListener('click', () => hideModal(modificaLavorazioneModal));

    // Eventi per il modal di modifica materiale
    salvaModificaMaterialeBtn.addEventListener('click', salvaMaterialeModificato);
    annullaModificaMaterialeBtn.addEventListener('click', () => hideModal(modificaMaterialeModal));

    // Gestisci tasto Enter per il titolo di stampa
    titoloInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            clienteInput.focus();
        }
    });

    clienteInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            stampaOrganizzazioneBtn.click();
        }
    });

    // Chiudi modal cliccando fuori
    window.addEventListener('click', (e) => {
        if (e.target === titoloModal) {
            hideModal(titoloModal);
        }
        
        // Aggiungi i nuovi modal per gli operai
        if (e.target === organicoModal) {
            hideModal(organicoModal);
        }
        if (e.target === editOperaioModal) {
            hideModal(editOperaioModal);
        }
        if (e.target === assegnaOperaiModal) {
            hideModal(assegnaOperaiModal);
        }
    });

    // Aggiungi effetti di feedback visivo per i pulsanti
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = '';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });
    
    // Gestione del ridimensionamento della finestra
    window.addEventListener('resize', () => {
        // Adatta l'interfaccia per diverse dimensioni dello schermo
        const isMobile = window.innerWidth < 768;
        document.body.classList.toggle('mobile-view', isMobile);
    });
    
    // Esegui un controllo iniziale della dimensione dello schermo
    if (window.innerWidth < 768) {
        document.body.classList.add('mobile-view');
    }
    
    // Nascondi l'indicatore di caricamento
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
    
    // Fix diretto per il pulsante Gestione Operai
    setTimeout(function() {
        const tabOperaiElement = document.getElementById('tabOperai');
        if (tabOperaiElement) {
            console.log('Fix diretto al pulsante Gestione Operai');
            
            // Rimuovi tutti gli event listener esistenti
            const nuovoPulsante = tabOperaiElement.cloneNode(true);
            tabOperaiElement.parentNode.replaceChild(nuovoPulsante, tabOperaiElement);
            
            // Aggiungi un nuovo event listener con funzionalità ridotta
            nuovoPulsante.addEventListener('click', function(e) {
                console.log('Click su Gestione Operai (event listener diretto)');
                
                // Nascondi tutte le pagine
                document.querySelectorAll('.page').forEach(p => {
                    p.classList.remove('active');
                    p.style.display = 'none';
                });
                
                // Verifica l'esistenza della pagina pageOperai
                let pageOperai = document.getElementById('pageOperai');
                if (!pageOperai) {
                    console.log('Pagina pageOperai non trovata, la creo ora');
                    pageOperai = document.createElement('div');
                    pageOperai.id = 'pageOperai';
                    pageOperai.className = 'page';
                    
                    const operaiContainer = document.createElement('div');
                    operaiContainer.id = 'operaiContainer';
                    
                    pageOperai.appendChild(operaiContainer);
                    document.getElementById('content').appendChild(pageOperai);
                }
                
                // Mostra la pagina pageOperai
                pageOperai.classList.add('active');
                pageOperai.style.display = 'block';
                
                // Rimuovi active da tutti i pulsanti di navigazione
                document.querySelectorAll('.nav-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Aggiungi active al pulsante Gestione Operai
                nuovoPulsante.classList.add('active');
                
                // Aggiorna il contenuto della pagina operai
                aggiornaGestioneOperai();
                
                // Previeni eventi default o bubbling se necessario
                e.preventDefault();
                e.stopPropagation();
            });
            
            // Aggiorna il riferimento globale
            tabOperaiBtn = nuovoPulsante;
        } else {
            console.error('Pulsante Gestione Operai non trovato nel DOM');
        }
    }, 1000);
});

// =============================================================================
// SEZIONE 8: GESTIONE MATERIALI
// =============================================================================

// Funzione per creare una tabella di materiali per una voce di lavorazione
function creaTabellaMaterialiPerLavorazione(lavorazione, voceIndex, categoriaIndex) {
    // Genera il codice univoco per questa lavorazione
    const codiceUnivocoLavorazione = `cat${categoriaIndex}_${lavorazione.numero}`;
    
    // Prepara l'array di materiali per questa lavorazione, se non esiste
    if (!materiali[codiceUnivocoLavorazione]) {
        materiali[codiceUnivocoLavorazione] = [];
    }
    
    const materialiSection = document.createElement('div');
    materialiSection.className = 'materiali-section';
    materialiSection.dataset.voceIndex = voceIndex;
    materialiSection.dataset.categoriaIndex = categoriaIndex;
    materialiSection.dataset.codiceUnivoco = codiceUnivocoLavorazione;
    
    // Controlla se questa sezione ha materiali
    const hasMateriali = materiali[codiceUnivocoLavorazione] && materiali[codiceUnivocoLavorazione].length > 0;
    
    // Aggiungi una classe se non ci sono materiali per aiutare con il filtraggio in stampa
    if (!hasMateriali) {
        materialiSection.classList.add('empty-materials');
    }
    
    // Header della sezione materiali - rimosso il testo "Quantità:" lasciando solo il valore
    const materialiHeader = document.createElement('div');
    materialiHeader.className = 'materiali-header';
    
    // Assicurati che il testo non sia troncato e che i caratteri speciali siano visualizzati correttamente
    const nomeFormattato = lavorazione.nome.replace(/Ø/g, '&Oslash;');
    materialiHeader.innerHTML = `
        <h3>${lavorazione.numero} - ${nomeFormattato}</h3>
        <div>${lavorazione.quantita}</div>`;
    
    // Corpo della tabella di materiali
    const tableContainer = document.createElement('div');
    tableContainer.className = 'table-container materiali-content';
    tableContainer.dataset.voceIndex = voceIndex;
    
    // Calcola il totale dei materiali
    let totaleMateriali = 0;
    materiali[codiceUnivocoLavorazione].forEach(materiale => {
        const prezzo = parseEuroToNumber(materiale.prezzo) || 0;
        const quantita = parseFloat(materiale.quantita) || 0;
        totaleMateriali += prezzo * quantita;
    });
    
    tableContainer.innerHTML = `
        <table class="materiali-table">
            <thead>
                <tr>
                    <th style="width: 45%;">Descrizione</th>
                    <th style="width: 12%;">Quantità</th>
                    <th style="width: 13%;">Unità Misura</th>
                    <th style="width: 15%;" class="prezzo-unitario-col">Prezzo Unit.</th>
                    <th style="width: 15%;" class="prezzo-totale-col">Totale</th>
                    <th class="no-print" style="width: 10%;">Azioni</th>
                </tr>
            </thead>
            <tbody>
                ${materiali[codiceUnivocoLavorazione].map((materiale, index) => {
                    const prezzoNum = parseEuroToNumber(materiale.prezzo) || 0;
                    const quantitaNum = parseFloat(materiale.quantita) || 0;
                    const totale = prezzoNum * quantitaNum;
                    
                    return `
                    <tr>
                        <td>${materiale.descrizione}</td>
                        <td class="text-center">${materiale.quantita}</td>
                        <td class="text-center">${materiale.unitaMisura}</td>
                        <td class="prezzo-cell prezzo-unitario-cell">${formatCurrency(prezzoNum)}</td>
                        <td class="prezzo-cell prezzo-totale-cell">${formatCurrency(totale)}</td>
                        <td class="no-print text-center">
                            <button class="edit-material-button" data-voce="${codiceUnivocoLavorazione}" data-index="${index}">
                                <img src="edit.png" width="16" height="16" title="Modifica materiale">
                            </button>
                            <button class="delete-material-button" data-voce="${codiceUnivocoLavorazione}" data-index="${index}">
                                <img src="x.png" width="16" height="16" title="Elimina materiale">
                            </button>
                        </td>
                    </tr>
                    `;
                }).join('')}
                <tr class="totale-materiali-row">
                    <td><strong>Totale Materiali</strong></td>
                    <td colspan="3"></td>
                    <td class="prezzo-cell prezzo-totale-cell"><strong>${formatCurrency(totaleMateriali)}</strong></td>
                    <td class="no-print"></td>
                </tr>
            </tbody>
        </table>`;
    
    // Aggiungi pulsante per aggiungere nuovi materiali
    const addButtonContainer = document.createElement('div');
    addButtonContainer.className = 'materiali-add-row no-print';
    addButtonContainer.innerHTML = `
        <button class="add-material-button" data-voce="${codiceUnivocoLavorazione}">
            <i class="plus-icon">+</i> Aggiungi Materiale
        </button>`;
    
    // Assembla la sezione completa
    materialiSection.appendChild(materialiHeader);
    materialiSection.appendChild(tableContainer);
    materialiSection.appendChild(addButtonContainer);
    
    return materialiSection;
}

function aggiornaTabelleMateriali() {
    // Salva lo stato di espansione delle categorie
    const statoCategorieEspanse = {};
    const statoMaterialiEspansi = {};

    // Salva lo stato delle categorie
    document.querySelectorAll('.categoria-materiali-container').forEach(container => {
        const categoriaIndex = container.dataset.categoriaIndex;
        statoCategorieEspanse[categoriaIndex] = {
            collapsed: container.classList.contains('collapsed'),
            display: container.style.display
        };
    });

    // Salva lo stato dei materiali
    document.querySelectorAll('.materiali-content').forEach(contentContainer => {
        const materialiSection = contentContainer.closest('.materiali-section');
        const voceIndex = materialiSection.dataset.voceIndex;
        const categoriaIndex = materialiSection.dataset.categoriaIndex;
        
        const chiave = `${categoriaIndex}_${voceIndex}`;
        statoMaterialiEspansi[chiave] = {
            collapsed: contentContainer.classList.contains('collapsed'),
            display: contentContainer.style.display
        };
    });

    // Il resto della funzione rimane invariato
    materialiContainer.innerHTML = '';
    
    if (categorie.length === 0) {
        materialiContainer.innerHTML = '<div class="empty-state">Nessuna lavorazione disponibile. Aggiungi delle categorie prima.</div>';
        return;
    }
    
    // Itera sulle categorie rispettando l'ordine attuale
categorie.forEach((categoria, categoriaIndex) => {
        // Crea un header per la categoria
        const categoriaHeader = document.createElement('div');
        categoriaHeader.className = 'categoria-materiali-header';
        
        categoriaHeader.innerHTML = `
            <div class="categoria-header-content">
                <h3>${categoria.nome}</h3>
                <button class="toggle-categoria-btn" data-categoria="${categoriaIndex}">
                    <img src="down.png" width="16" height="16" alt="Espandi/Comprimi">
                </button>
            </div>`;
        materialiContainer.appendChild(categoriaHeader);
        
        // Container per le lavorazioni di questa categoria
        const lavorazioniContainer = document.createElement('div');
        lavorazioniContainer.className = 'categoria-materiali-container';
        lavorazioniContainer.dataset.categoriaIndex = categoriaIndex;

        // Ripristina lo stato precedente della categoria
        if (statoCategorieEspanse[categoriaIndex]) {
            if (statoCategorieEspanse[categoriaIndex].collapsed) {
                lavorazioniContainer.classList.add('collapsed');
            }
            if (statoCategorieEspanse[categoriaIndex].display) {
                lavorazioniContainer.style.display = statoCategorieEspanse[categoriaIndex].display;
            }
        }
        
        // Verifica se la categoria ha lavorazioni
        if (categoria.lavorazioni.length === 0) {
            lavorazioniContainer.innerHTML = '<div class="empty-state">Questa categoria non ha lavorazioni.</div>';
        } else {
            // Crea una tabella di materiali per ogni lavorazione in questa categoria
            categoria.lavorazioni.forEach((lavorazione, lavorazioneIndex) => {
                // Aggiungi riferimento alla categoria per mantenere coerenza con implementazione precedente
                lavorazione.categoriaName = categoria.nome;
                lavorazione.categoriaIndex = categoriaIndex;
                
                const tabellaMateriali = creaTabellaMaterialiPerLavorazione(lavorazione, lavorazioneIndex, categoriaIndex);
                
                // Ripristina lo stato precedente del materiale
                const chiave = `${categoriaIndex}_${lavorazioneIndex}`;
                if (statoMaterialiEspansi[chiave]) {
                    const materialiContent = tabellaMateriali.querySelector('.materiali-content');
                    if (statoMaterialiEspansi[chiave].collapsed) {
                        materialiContent.classList.add('collapsed');
                    }
                    if (statoMaterialiEspansi[chiave].display) {
                        materialiContent.style.display = statoMaterialiEspansi[chiave].display;
                    }
                }
                
                lavorazioniContainer.appendChild(tabellaMateriali);
            });
        }
        
        materialiContainer.appendChild(lavorazioniContainer);
        
        // Aggiungi un separatore tra categorie
        if (categoriaIndex < categorie.length - 1) {
            const separatore = document.createElement('div');
            separatore.className = 'categoria-separatore';
            materialiContainer.appendChild(separatore);
        }
    });
    
    // Aggiungi event listeners per i pulsanti di materiali
    aggiungiGestioneMateriali();
    aggiungiGestioneToggleCategorieInMateriali();
}
// Funzione per gestire l'espansione/compressione delle categorie nei materiali
function aggiungiGestioneToggleCategorieInMateriali() {
    document.querySelectorAll('.toggle-categoria-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const categoriaIndex = e.currentTarget.dataset.categoria;
            const container = e.currentTarget.closest('.categoria-materiali-header').nextElementSibling;
            
            // Utilizziamo una classe CSS invece di impostare direttamente lo stile display
            if (container.classList.contains('collapsed')) {
                container.classList.remove('collapsed');
                container.style.display = 'block'; // Manteniamo per retrocompatibilità
                e.currentTarget.querySelector('img').style.transform = 'rotate(0deg)';
            } else {
                container.classList.add('collapsed');
                container.style.display = 'none'; // Manteniamo per retrocompatibilità
                e.currentTarget.querySelector('img').style.transform = 'rotate(-90deg)';
            }
            
            // Previeni la propagazione dell'evento
            e.stopPropagation();
        });
    });
    


    // Gestisci anche il toggle per le singole voci di materiali
    document.querySelectorAll('.materiali-header').forEach(header => {
        header.addEventListener('click', (e) => {
            // Evita di attivare il toggle se si sta cliccando su un altro elemento interattivo
            if (e.target.closest('button')) return;
            
            const materialiSection = e.currentTarget.closest('.materiali-section');
            const contentContainer = materialiSection.querySelector('.materiali-content');
            
            // Utilizziamo una classe CSS invece di impostare direttamente lo stile display
            if (contentContainer.classList.contains('collapsed')) {
                contentContainer.classList.remove('collapsed');
                contentContainer.style.display = 'block'; // Manteniamo per retrocompatibilità
            } else {
                contentContainer.classList.add('collapsed');
                contentContainer.style.display = 'none'; // Manteniamo per retrocompatibilità
            }
        });
        
        // Aggiungi il cursor pointer per indicare che l'header è cliccabile
        header.style.cursor = 'pointer';
    });
    
    // Aggiungi la seguente regola CSS dinamicamente
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .collapsed {
            display: none !important;
        }
    `;
    document.head.appendChild(styleElement);
}

// Funzione per gestire i pulsanti relativi ai materiali
function aggiungiGestioneMateriali() {
    // Event listener per aggiungere un nuovo materiale
    document.querySelectorAll('.add-material-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const voce = e.currentTarget.dataset.voce;
            
            // Prepara per l'aggiunta di un nuovo materiale
            currentMaterialeVoce = voce;
            currentMaterialeIndex = null;
            
            // Resetta il form
            editMaterialeDescrizione.value = '';
            editMaterialeQuantita.value = '';
            editMaterialeUM.value = '';
            editMaterialePrezzo.value = '';
            
            // Mostra il modal
            showModal(modificaMaterialeModal);
        });
    });
    
    // Event listener per modificare un materiale esistente
    document.querySelectorAll('.edit-material-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const voce = e.currentTarget.dataset.voce;
            const index = parseInt(e.currentTarget.dataset.index);
            
            // Memorizza quale materiale stiamo modificando
            currentMaterialeVoce = voce;
            currentMaterialeIndex = index;
            
            // Recupera i dati del materiale
            const materiale = materiali[voce][index];
            
            // Popola il form con i dati esistenti
            editMaterialeDescrizione.value = materiale.descrizione || '';
            editMaterialeQuantita.value = materiale.quantita || '';
            editMaterialeUM.value = materiale.unitaMisura || '';
            editMaterialePrezzo.value = materiale.prezzo || '';
            
            // Mostra il modal
            showModal(modificaMaterialeModal);
        });
    });
    
    // Event listener per eliminare un materiale
    document.querySelectorAll('.delete-material-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const voce = e.currentTarget.dataset.voce;
            const index = parseInt(e.currentTarget.dataset.index);
            
            if (confirm('Sei sicuro di voler eliminare questo materiale?')) {
                // Rimuovi il materiale dall'array
                materiali[voce].splice(index, 1);
                
                // Aggiorna le tabelle
                aggiornaTabelleMateriali();
                // Aggiorna l'offerta solo se visibile
                if (document.getElementById('pageOfferta').classList.contains('active')) {
                    aggiornaOfferta();
                }
            }
        });
    });
}

// Funzione per salvare le modifiche a un materiale
function salvaMaterialeModificato() {
    // Verifica che ci sia una voce selezionata
    if (!currentMaterialeVoce) return;
    
    // Crea o recupera l'array dei materiali per questa voce
    if (!materiali[currentMaterialeVoce]) {
        materiali[currentMaterialeVoce] = [];
    }
    
    // Prepara l'oggetto materiale con i dati del form
    const materialeDati = {
        descrizione: editMaterialeDescrizione.value,
        quantita: editMaterialeQuantita.value,
        unitaMisura: editMaterialeUM.value,
        prezzo: editMaterialePrezzo.value
    };
    
    // Se stiamo modificando un materiale esistente, sostituiscilo
    if (currentMaterialeIndex !== null) {
        materiali[currentMaterialeVoce][currentMaterialeIndex] = materialeDati;
    } 
    // Altrimenti aggiungi un nuovo materiale
    else {
        materiali[currentMaterialeVoce].push(materialeDati);
    }
    
    // Aggiorna le tabelle
    aggiornaTabelleMateriali();
    // Aggiorna l'offerta solo se visibile
    if (document.getElementById('pageOfferta').classList.contains('active')) {
        aggiornaOfferta();
    }
    
    // Nascondi il modal
    hideModal(modificaMaterialeModal);
}

// =============================================================================
// SEZIONE 9: GESTIONE OFFERTA
// =============================================================================

// Funzione per aggiornare la tabella dell'offerta
function aggiornaOfferta() {
    offertaContainer.innerHTML = '';
    
    // Ottieni le voci di lavorazione raggruppate per categoria
    const lavorazioniPerCategoria = {};
    let categorieOrdinate = [];
    
    categorie.forEach((categoria, categoriaIndex) => {
        categorieOrdinate.push({
            index: categoriaIndex,
            nome: categoria.nome
        });
        
        lavorazioniPerCategoria[categoriaIndex] = categoria.lavorazioni.map(lavorazione => ({
            ...lavorazione,
            categoriaName: categoria.nome,
            categoriaIndex: categoriaIndex // Aggiungi l'indice della categoria per il codice univoco
        }));
    });
    
    if (categorieOrdinate.length === 0) {
        offertaContainer.innerHTML = '<div class="empty-state">Nessuna lavorazione disponibile. Aggiungi delle categorie prima.</div>';
        return;
    }
    
    // Crea la tabella dell'offerta
    const offertaTable = document.createElement('div');
    offertaTable.className = 'offerta-container';
    
    // Header dell'offerta con colore blu scuro
    const offertaHeader = document.createElement('div');
    offertaHeader.className = 'offerta-header';
    offertaHeader.innerHTML = '<h2>Riepilogo Offerta</h2>';
    
    // Corpo della tabella
    let totaleOfferta = 0;
    
    const tableContainer = document.createElement('div');
    tableContainer.className = 'table-container';
    
    // Prepara l'HTML iniziale della tabella
    let tableHTML = `
        <table class="offerta-table">
            <thead>
                <tr>
                    <th style="width: 6%;">N.</th>
                    <th class="lavorazione-col" style="width: 38%;">Descrizione Lavorazione</th>
                    <th class="quantita-col" style="width: 8%;">Quantità</th>
                    <th class="prezzo-col manodopera-col" style="width: 12%;">Manodopera</th>
                    <th class="prezzo-col materiali-col" style="width: 12%;">Materiali</th>
                    <th class="prezzo-col prezzo-unitario-col" style="width: 12%;">Prezzo Unit.</th>
                    <th class="prezzo-col totale-col" style="width: 12%;">Totale</th>
                </tr>
            </thead>
            <tbody>`;
    
    // Aggiungi le righe raggruppate per categoria con un'intestazione per ciascuna categoria
    categorieOrdinate.forEach(categoria => {
        const lavorazioni = lavorazioniPerCategoria[categoria.index] || [];
        
        if (lavorazioni.length > 0) {
            // Ottieni gli operai assegnati alla categoria e le date
            const nomiOperai = getNomiOperaiPerCategoria(categoria.index);
            const dataInizio = categorie[categoria.index].dataInizio ? formatDate(categorie[categoria.index].dataInizio) : '-';
            const dataFine = categorie[categoria.index].dataFine ? formatDate(categorie[categoria.index].dataFine) : '-';
            
            // Informazioni sugli operai e date per la categoria
            const operaiEDateInfo = nomiOperai !== '-' ? 
                `<div class="categoria-info">
                    <span>Squadra: ${nomiOperai}</span> | 
                    <span>Date: ${dataInizio} - ${dataFine}</span>
                </div>` : '';
            
            // Aggiungi la riga colorata per l'intestazione della categoria
            tableHTML += `
                <tr class="categoria-header-row">
                    <td colspan="7">
                        ${categoria.nome}
                        ${operaiEDateInfo}
                    </td>
                </tr>`;
            
            // Aggiungi le lavorazioni di questa categoria
            let totaleCategoriaCorrente = 0;
            
            lavorazioni.forEach(lavorazione => {
                // Genera il codice univoco per questa lavorazione
                const codiceUnivocoLavorazione = `cat${lavorazione.categoriaIndex}_${lavorazione.numero}`;
                
                // Calcola il costo manodopera considerando lo sconto
                const sconto = categorie[categoria.index].sconto || 0;
                let costoManodopera = 0;
                
                if (lavorazione.importoManodoperaScontato !== undefined) {
                    costoManodopera = lavorazione.importoManodoperaScontato;
                } else if (lavorazione.importoManodoperaRaw !== undefined) {
                    costoManodopera = lavorazione.importoManodoperaRaw * (1 - (sconto / 100));
                } else {
                    costoManodopera = parseEuroToNumber(lavorazione.importoManodopera) * (1 - (sconto / 100)) || 0;
                }
                
                // Calcola il costo materiali usando il codice univoco
                let costoMateriali = 0;
                if (materiali[codiceUnivocoLavorazione]) {
                    materiali[codiceUnivocoLavorazione].forEach(materiale => {
                        const prezzo = parseEuroToNumber(materiale.prezzo) || 0;
                        const quantita = parseFloat(materiale.quantita) || 0;
                        costoMateriali += prezzo * quantita;
                    });
                }
                
                // Calcola il totale per questa voce
                const totaleVoce = costoManodopera + costoMateriali;
                totaleCategoriaCorrente += totaleVoce;
                totaleOfferta += totaleVoce;
                
                // Calcola il prezzo unitario in base alla quantità
                let prezzoUnitario = 0;
                const quantita = parseFloat(lavorazione.quantita) || 0;
                if (quantita > 0) {
                    // Calcola il prezzo unitario e arrotonda a 2 decimali
                    prezzoUnitario = Math.round((totaleVoce / quantita) * 100) / 100;
                }
                
                tableHTML += `
                <tr data-codice-univoco="${codiceUnivocoLavorazione}">
                    <td class="text-center">${lavorazione.numero}</td>
                    <td class="lavorazione-col">${lavorazione.nome}</td>
                    <td class="text-center quantita-col">${lavorazione.quantita || '-'}</td>
                    <td class="prezzo-col manodopera-col">${formatCurrency(costoManodopera)}</td>
                    <td class="prezzo-col materiali-col">${formatCurrency(costoMateriali)}</td>
                    <td class="prezzo-col prezzo-unitario-col">${formatCurrency(prezzoUnitario)}</td>
                    <td class="prezzo-col totale-col">${formatCurrency(totaleVoce)}</td>
                </tr>`;
                
                // Aggiorna il prezzo unitario nel modello dati della lavorazione
                const categoriaRef = categorie[categoria.index];
                const lavorazioneIndex = categoriaRef.lavorazioni.findIndex(l => l.numero === lavorazione.numero);
                if (lavorazioneIndex !== -1) {
                    categoriaRef.lavorazioni[lavorazioneIndex].prezzoUnitario = formatCurrency(prezzoUnitario);
                    categoriaRef.lavorazioni[lavorazioneIndex].prezzoUnitarioRaw = prezzoUnitario;
                }
            });
            
            // Aggiungi il totale della categoria
            tableHTML += `
                <tr class="totale-row">
                    <td colspan="6" style="text-align: right;"><strong>Totale ${categoria.nome}</strong></td>
                    <td class="prezzo-col totale-col"><strong>${formatCurrency(totaleCategoriaCorrente)}</strong></td>
                </tr>`;
        }
    });
    
    // Aggiungi la riga del totale complessivo
    tableHTML += `
            <tr class="totale-row">
                <td colspan="6" style="text-align: right;"><strong>TOTALE OFFERTA</strong></td>
                <td class="prezzo-col totale-col"><strong>${formatCurrency(totaleOfferta)}</strong></td>
            </tr>
        </tbody>
    </table>`;
    
    // Inserisci l'HTML della tabella nel container
    tableContainer.innerHTML = tableHTML;
    
    // Assembla la tabella completa
    offertaTable.appendChild(offertaHeader);
    offertaTable.appendChild(tableContainer);
    
    // Aggiungi la tabella al container
    offertaContainer.appendChild(offertaTable);
    
    // Aggiungi event listeners per le righe della tabella offerta
    document.querySelectorAll('.categoria-header-row').forEach(row => {
        const categoriaIndex = parseInt(row.querySelectorAll('td')[0].dataset.categoriaIndex);
        if (!isNaN(categoriaIndex)) {
            row.addEventListener('click', () => {
                // Trova tutte le righe di questa categoria
                const categoriaRows = document.querySelectorAll(`tr[data-categoria-index="${categoriaIndex}"]`);
                categoriaRows.forEach(catRow => {
                    if (catRow.style.display === 'none') {
                        catRow.style.display = 'table-row';
                    } else {
                        catRow.style.display = 'none';
                    }
                });
            });
            
            // Aggiungi il cursor pointer per indicare che l'header è cliccabile
            row.style.cursor = 'pointer';
        }
    });
}

// Funzione per caricamento CSV Categoria
function caricaCategoriaCSV(file) {
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
        reader.onload = function(e) {
            try {
                const csvData = e.target.result;
                elaboraCategoriaCSV(csvData, file.name);
                resolve();
            } catch (error) {
                console.error("Errore completo:", error);
                alert('Errore durante l\'elaborazione del file categoria: ' + error.message);
                reject(error);
            }
        };

        reader.onerror = function() {
            alert('Errore durante la lettura del file categoria.');
            reject(new Error('Errore di lettura del file'));
        };

        reader.readAsText(file, 'CP1252');
    });
}

// Funzione per processare più file XPWE in sequenza
async function processaMultipleCategorieXPWE(files) {
    // Converti la collection files in un array
    const filesArray = Array.from(files);
    
    // Conteggio dei file da elaborare
    const totalFiles = filesArray.length;
    let filesProcessed = 0;
    
    // Mostra una notifica di caricamento
    mostraNotifica(`Elaborazione di ${totalFiles} file XPWE in corso...`, 'info', 60000);
    
    try {
        // Processa tutti i file in sequenza
        for (const file of filesArray) {
            await new Promise((resolve) => {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    try {
                        const xmlData = e.target.result;
                        elaboraCategoriaXPWE(xmlData, file.name);
                        
                        // Aggiorna il conteggio dei file processati
                        filesProcessed++;
                        const progressCount = document.querySelector('.progress-count');
                        if (progressCount) {
                            progressCount.textContent = `${filesProcessed}/${totalFiles} completati`;
                        }
                        
                        resolve();
                    } catch (error) {
                        console.error("Errore durante l'elaborazione del file XPWE:", file.name, error);
                        alert(`Errore durante l'elaborazione del file XPWE ${file.name}: ${error.message}`);
                        resolve(); // Continua con il prossimo file anche in caso di errore
                    }
                };
                
                reader.onerror = function() {
                    console.error("Errore durante la lettura del file XPWE:", file.name);
                    alert(`Errore durante la lettura del file XPWE ${file.name}`);
                    resolve(); // Continua con il prossimo file anche in caso di errore
                };
                
                reader.readAsText(file, 'UTF-8');
            });
        }
        
        // Aggiorna le tabelle dopo aver processato tutti i file
        aggiornaTabelleCategorie();
        
        // Passa alla pagina categorie
        showPage('pageCategorie');
        
        // Mostra una notifica di successo che si chiude automaticamente dopo 2 secondi
        mostraNotifica(`${filesProcessed} categorie XPWE caricate con successo!`, 'success', 2000);
    } catch (error) {
        console.error("Errore durante il processamento multiplo XPWE:", error);
        // Mostra una notifica di errore
        mostraNotifica("Si è verificato un errore durante il caricamento delle categorie XPWE", 'error', 4000);
    } finally {
        // Nascondi tutte le notifiche di caricamento precedenti
        document.querySelectorAll('.notification.info').forEach(notifica => {
            notifica.classList.remove('visible');
            setTimeout(() => notifica.remove(), 300);
        });
    }
}

// Funzione per elaborazione XPWE
function elaboraCategoriaXPWE(xmlData, fileName) {
    try {
        // Analizza il file XML
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlData, "text/xml");
        
        // Verifica se è un file XPWE valido
        if (!xmlDoc.querySelector('PweDocumento')) {
            throw new Error("Il file non sembra essere un file XPWE valido");
        }
        
        // Estrai gli elementi WBS
        const wbsItems = xmlDoc.querySelectorAll('DGWBSItem');
        if (!wbsItems || wbsItems.length === 0) {
            throw new Error("Nessuna categoria WBS trovata nel file");
        }
        
        // Estrai le lavorazioni (voci) dal file
        const epItems = xmlDoc.querySelectorAll('EPItem');
        if (!epItems || epItems.length === 0) {
            console.warn("Nessuna lavorazione trovata nel file");
        }
        
        // Mappa delle lavorazioni per codice
        const lavorazioniMap = {};
        epItems.forEach(epItem => {
            const numero = epItem.querySelector('Tariffa')?.textContent || '';
            const tariffa = epItem.querySelector('Articolo')?.textContent || '';
            const nome = epItem.querySelector('DesEstesa')?.textContent || epItem.querySelector('DesRidotta')?.textContent || '';
            const unita = epItem.querySelector('UnMisura')?.textContent || '';
            const prezzo = parseFloat(epItem.querySelector('Prezzo1')?.textContent || '0');
            const percentualeMO = parseFloat(epItem.querySelector('IncMDO')?.textContent || '0');
            
            lavorazioniMap[numero] = {
                numero,
                tariffa,
                nome,
                unita,
                prezzoUnitario: formatCurrency(prezzo),
                prezzoUnitarioRaw: prezzo,
                percentualeMO: percentualeMO.toString()
            };
        });
        
        // Elabora gli elementi WBS
        // Saltiamo il primo elemento che di solito è il nodo radice WBS
        for (let i = 1; i < wbsItems.length; i++) {
            const wbsItem = wbsItems[i];
            const titolo = wbsItem.querySelector('TITOLO')?.textContent;
            const codice = wbsItem.querySelector('CODICE')?.textContent;
            
            // Salta gli elementi WBS senza codice o con titolo <NON assegnata>
            if (!codice || titolo === '<NON assegnata>') {
                continue;
            }
            
            // Estrai il nome della categoria - usa solo il titolo senza aggiungere il codice
let nomeCategoria = titolo;
            
            // Verifica se esiste già una categoria con lo stesso nome
            let counter = 1;
            let nomeUnivoco = nomeCategoria;
            while (categorie.some(cat => cat.nome === nomeUnivoco)) {
                nomeUnivoco = `${nomeCategoria} (${counter})`;
                counter++;
            }
            
            // Crea la nuova categoria
            const nuovaCategoria = {
                nome: nomeUnivoco,
                lavorazioni: [],
                sconto: 0,
                note: ''
            };
            
            // Aggiungi la categoria all'array delle categorie
            categorie.push(nuovaCategoria);
            const categoriaIndex = categorie.length - 1;
            
            // Trova le voci di computo associate a questa WBS
            const vociComputo = xmlDoc.querySelectorAll('VCItem');
            vociComputo.forEach(vcItem => {
                const codiceWBS = vcItem.querySelector('CodiceWBS')?.textContent;
                
                if (codiceWBS === codice) {
                    const idEP = vcItem.querySelector('IDEP')?.textContent;
                    const quantitaVoce = vcItem.querySelector('Quantita')?.textContent || '';
                    
                    // Trova l'EP corrispondente per recuperare i dettagli
                    const epItem = Array.from(epItems).find(ep => {
                        const epId = ep.getAttribute('ID');
                        return epId === idEP;
                    });
                    
                    if (epItem) {
                        const numero = epItem.querySelector('Tariffa')?.textContent || '';
                        const tariffa = epItem.querySelector('Articolo')?.textContent || '';
                        const nome = epItem.querySelector('DesEstesa')?.textContent || epItem.querySelector('DesRidotta')?.textContent || '';
                        const unita = epItem.querySelector('UnMisura')?.textContent || '';
                        const prezzo = parseFloat(epItem.querySelector('Prezzo1')?.textContent || '0');
                        const percentualeMO = parseFloat(epItem.querySelector('IncMDO')?.textContent || '0');
                        
                        // Calcola l'importo manodopera unitario in base al prezzo e percentuale
const importoManodoperaUnitarioRaw = prezzo * (percentualeMO / 100);
                        
// Calcola l'importo manodopera totale moltiplicando per la quantità
const quantitaNumerica = parseFloat(quantitaVoce.replace(',', '.')) || 0;
const importoManodoperaRaw = importoManodoperaUnitarioRaw * quantitaNumerica;

// Aggiungi lavorazione alla categoria
nuovaCategoria.lavorazioni.push({
    numero,
    tariffa,
    nome,
    quantita: quantitaVoce,
    prezzoUnitario: formatCurrency(prezzo),
    prezzoUnitarioRaw: prezzo,
    importoManodopera: formatCurrency(importoManodoperaRaw),
    importoManodoperaRaw: importoManodoperaRaw,
    percentualeMO: percentualeMO.toString()
});
                        
                        // Inizializza l'array dei materiali per questa lavorazione
                        const codiceUnivoco = `cat${categoriaIndex}_${numero}`;
                        materiali[codiceUnivoco] = [];
                    }
                }
            });
            
            // Se non sono state trovate voci per questa WBS, verifica nelle misurazioni
            if (nuovaCategoria.lavorazioni.length === 0) {
                // Cerca tra tutti gli elementi EPItem e verifica se corrispondono al codice WBS
                epItems.forEach(epItem => {
                    const itemCodiceWBS = epItem.querySelector('CodiceWBSCAP')?.textContent;
                    if (itemCodiceWBS === codice) {
                        const numero = epItem.querySelector('Tariffa')?.textContent || '';
                        const tariffa = epItem.querySelector('Articolo')?.textContent || '';
                        const nome = epItem.querySelector('DesEstesa')?.textContent || epItem.querySelector('DesRidotta')?.textContent || '';
                        const unita = epItem.querySelector('UnMisura')?.textContent || '';
                        const prezzo = parseFloat(epItem.querySelector('Prezzo1')?.textContent || '0');
                        const percentualeMO = parseFloat(epItem.querySelector('IncMDO')?.textContent || '0');
                        
                        // Cerca la quantità nelle misurazioni
                        let quantita = '';
                        const misurazioni = xmlDoc.querySelectorAll(`VCItem`);
                        for (const mis of misurazioni) {
                            const misIdEP = mis.querySelector('IDEP')?.textContent;
                            const misEpItem = Array.from(epItems).find(ep => ep.getAttribute('ID') === misIdEP);
                            if (misEpItem && misEpItem.querySelector('Tariffa')?.textContent === numero) {
                                quantita = mis.querySelector('Quantita')?.textContent || '';
                                break;
                            }
                        }
                        
                        // Calcola l'importo manodopera unitario in base al prezzo e percentuale
const importoManodoperaUnitarioRaw = prezzo * (percentualeMO / 100);
                        
// Calcola l'importo manodopera totale moltiplicando per la quantità
const quantitaNumerica = parseFloat(quantita.replace(',', '.')) || 0;
const importoManodoperaRaw = importoManodoperaUnitarioRaw * quantitaNumerica;

// Aggiungi lavorazione alla categoria
nuovaCategoria.lavorazioni.push({
    numero,
    tariffa,
    nome,
    quantita,
    prezzoUnitario: formatCurrency(prezzo),
    prezzoUnitarioRaw: prezzo,
    importoManodopera: formatCurrency(importoManodoperaRaw),
    importoManodoperaRaw: importoManodoperaRaw,
    percentualeMO: percentualeMO.toString()
});
                        
                        // Inizializza l'array dei materiali per questa lavorazione
                        const codiceUnivoco = `cat${categoriaIndex}_${numero}`;
                        materiali[codiceUnivoco] = [];
                    }
                });
            }
            
            // Se ancora non ci sono lavorazioni, aggiungiamo una lavorazione vuota
            if (nuovaCategoria.lavorazioni.length === 0) {
                nuovaCategoria.lavorazioni.push({
                    numero: '1',
                    tariffa: '',
                    nome: 'Nuova lavorazione',
                    quantita: '',
                    prezzoUnitario: '0,00 €',
                    prezzoUnitarioRaw: 0,
                    importoManodopera: '0,00 €',
                    importoManodoperaRaw: 0,
                    percentualeMO: '0'
                });
                
                // Inizializza l'array dei materiali
                const codiceUnivoco = `cat${categoriaIndex}_1`;
                materiali[codiceUnivoco] = [];
            }
        }
        
        // Aggiorna le tabelle
        aggiornaTabelleCategorie();
        aggiornaTabelleMateriali();
        
        // Passa alla pagina categorie
        showPage('pageCategorie');
        
        // Notifica all'utente
        mostraNotifica(`Categorie caricate con successo da ${fileName}!`, 'success', 2000);
        
    } catch (error) {
        console.error('Errore durante l\'elaborazione del file XPWE:', error);
        alert(`Errore durante l'elaborazione del file XPWE: ${error.message}`);
    }
}

// Funzione per processare più file CSV in sequenza
async function processaMultipleCategorie(files) {
    // Converti la collection files in un array
    const filesArray = Array.from(files);
    
    // Conteggio dei file da elaborare
    const totalFiles = filesArray.length;
    let filesProcessed = 0;
    
    // Mostra una notifica di caricamento
mostraNotifica(`Elaborazione di ${totalFiles} file in corso...`, 'info', 60000);
    
    try {
        // Processa tutti i file in sequenza
        for (const file of filesArray) {
            await new Promise((resolve) => {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    try {
                        const csvData = e.target.result;
                        elaboraCategoriaCSV(csvData, file.name);
                        
                        // Aggiorna il conteggio dei file processati
                        filesProcessed++;
                        const progressCount = loadingIndicator.querySelector('.progress-count');
                        if (progressCount) {
                            progressCount.textContent = `${filesProcessed}/${totalFiles} completati`;
                        }
                        
                        resolve();
                    } catch (error) {
                        console.error("Errore durante l'elaborazione del file:", file.name, error);
                        alert(`Errore durante l'elaborazione del file ${file.name}: ${error.message}`);
                        resolve(); // Continua con il prossimo file anche in caso di errore
                    }
                };
                
                reader.onerror = function() {
                    console.error("Errore durante la lettura del file:", file.name);
                    alert(`Errore durante la lettura del file ${file.name}`);
                    resolve(); // Continua con il prossimo file anche in caso di errore
                };
                
                reader.readAsText(file, 'CP1252');
            });
        }
        
        // Aggiorna le tabelle dopo aver processato tutti i file
aggiornaTabelleCategorie();

// Passa alla pagina categorie
showPage('pageCategorie');

// Mostra una notifica di successo che si chiude automaticamente dopo 2 secondi
mostraNotifica(`${filesProcessed} categorie caricate con successo!`, 'success', 2000);
    } catch (error) {
    console.error("Errore durante il processamento multiplo:", error);
    // Mostra una notifica di errore
    mostraNotifica("Si è verificato un errore durante il caricamento delle categorie", 'error', 4000);
} finally {
    // Nascondi tutte le notifiche di caricamento precedenti
    document.querySelectorAll('.notification.info').forEach(notifica => {
        notifica.classList.remove('visible');
        setTimeout(() => notifica.remove(), 300);
    });
}
}

// Funzione per elaborazione CSV Categoria
function elaboraCategoriaCSV(csvData, fileName) {
    Papa.parse(csvData, {
        delimiter: ";",
        encoding: "CP1252",
        skipEmptyLines: 'greedy',
        complete: function(results) {
            if (results.errors.length > 0) {
                console.log("Errori nel parsing:", results.errors);
                mostraNotifica('Errori nel parsing del file CSV della categoria', 'error', 3000);
                return;
            }

            // Estrai il nome della categoria dal nome del file (rimuovendo qualsiasi estensione)
            // Utilizza una regex per rimuovere tutto dopo l'ultimo punto
            const nomeCategoriaBase = fileName.replace(/\.[^/.]+$/, "");
            let nomeCategoria = nomeCategoriaBase;
            
            // Verifica se esiste già una categoria con lo stesso nome
            let counter = 1;
            while (categorie.some(cat => cat.nome === nomeCategoria)) {
                nomeCategoria = `${nomeCategoriaBase} (${counter})`;
                counter++;
            }
            
            // Crea la nuova categoria
            const nuovaCategoria = {
                nome: nomeCategoria,
                lavorazioni: [],
                sconto: 0,
                note: ''
            };
            
            const righe = results.data;
            console.log("Righe caricate:", righe);

            // Indice della categoria per i codici univoci
            const categoriaIndex = categorie.length; // L'indice sarà quello della nuova categoria
            
          // Elabora le righe del CSV per estrarre le lavorazioni
            for (let i = 2; i < righe.length; i++) {
                const riga = righe[i];
                
                if (riga && riga.length > 0 && riga[0]) {
                    const risultato = estraiNumeroECodice(riga[0]);
                    
                    if (risultato) {
                        const rigaSuccessiva = righe[i + 1];
                        let quantita = '';
                        
                        // Estrai e normalizza la quantità
                        if (rigaSuccessiva && rigaSuccessiva[2]) {
                            quantita = normalizzaQuantita(rigaSuccessiva[2]);
                        }
                        
                        // Cerca il suffisso nella riga che contiene "SOMMANO"
                        if (rigaSuccessiva && rigaSuccessiva[1] && rigaSuccessiva[1].trim().startsWith('SOMMANO')) {
                            const suffisso = rigaSuccessiva[1].trim().replace('SOMMANO', '').trim();
                            if (quantita && suffisso) {
                                // Evita di aggiungere lo stesso suffisso due volte
                                if (!quantita.includes(suffisso)) {
                                    quantita = `${quantita} ${suffisso}`;
                                }
                            }
                        }
                        
                        // Cerca il suffisso nella riga che contiene "SOMMANO"
                        if (rigaSuccessiva && rigaSuccessiva[1] && rigaSuccessiva[1].trim().startsWith('SOMMANO')) {
                            const suffisso = rigaSuccessiva[1].trim().replace('SOMMANO', '').trim();
                            if (quantita && suffisso) {
                                // Evita di aggiungere lo stesso suffisso due volte
                                if (!quantita.includes(suffisso)) {
                                    quantita = `${quantita} ${suffisso}`;
                                }
                            }
                        }
                        
                        // Estrai i valori necessari con maggiore robustezza
                        let prezzoUnitario = '0';
                        let prezzoUnitarioRaw = 0;
                        let offerta = '0';
                        let offertaRaw = 0;
                        let costoMO = '0';
                        let costoMORaw = 0;
                        let percentualeMO = '0';
                        
                        if (rigaSuccessiva) {
                            // Debug delle colonne
                            console.log(`Riga ${i+1}, colonne:`, rigaSuccessiva);
                            
                            // Prezzo unitario (colonna 3)
                            if (rigaSuccessiva[3]) {
                                const prezzoRaw = rigaSuccessiva[3].trim();
                                prezzoUnitarioRaw = parseEuroToNumber(prezzoRaw);
                                
                                if (!isNaN(prezzoUnitarioRaw)) {
                                    prezzoUnitario = prezzoUnitarioRaw.toLocaleString('it-IT', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    });
                                }
                            }
                            
                            // Offerta (colonna 4)
                            if (rigaSuccessiva[4]) {
                                const offertaRawStr = rigaSuccessiva[4].trim();
                                offertaRaw = parseEuroToNumber(offertaRawStr);
                                
                                if (!isNaN(offertaRaw)) {
                                    offerta = offertaRaw.toLocaleString('it-IT', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    });
                                }
                            }
                            
                            // Costo manodopera (colonna 5)
                            if (rigaSuccessiva[5]) {
                                const costoMORawStr = rigaSuccessiva[5].trim();
                                costoMORaw = parseEuroToNumber(costoMORawStr);
                                
                                if (!isNaN(costoMORaw)) {
                                    costoMO = costoMORaw.toLocaleString('it-IT', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    });
                                }
                            }
                            
                            // Percentuale MO (colonna 6)
                            if (rigaSuccessiva[6]) {
                                percentualeMO = rigaSuccessiva[6].trim().replace(/[^\d,-]/g, '').replace(',', '.');
                            }
                        }
                        
                        // Aggiungi la lavorazione alla categoria
                        nuovaCategoria.lavorazioni.push({
                            numero: risultato.numero,
                            tariffa: risultato.codice,
                            nome: riga[1] ? riga[1].trim() : '',
                            quantita: quantita,
                            prezzoUnitario: prezzoUnitario,
                            prezzoUnitarioRaw: prezzoUnitarioRaw,
                            offerta: offerta,
                            offertaRaw: offertaRaw,
                            importoManodopera: costoMO,
                            importoManodoperaRaw: costoMORaw,
                            percentualeMO: percentualeMO
                        });

                        // Inizializza l'array dei materiali per questa lavorazione con codice univoco
                        const codiceUnivocoLavorazione = `cat${categoriaIndex}_${risultato.numero}`;
                        materiali[codiceUnivocoLavorazione] = [];
                    }
                }
            }
            
            // Aggiungi la categoria all'array delle categorie
            categorie.push(nuovaCategoria);
            
            // Aggiorna le tabelle delle categorie
            aggiornaTabelleCategorie();
            
	    // Aggiorna anche le tabelle dei materiali
            aggiornaTabelleMateriali();

            // Passa alla pagina categorie
            showPage('pageCategorie');
            
            // Notifica all'utente con messaggio non bloccante
mostraNotifica(`Categoria "${nomeCategoria}" caricata con successo!`, 'success', 2000);
        },
        error: function(error) {
            console.error('Errore durante il parsing:', error);
            mostraNotifica('Errore durante il parsing del CSV: ' + error.message, 'error', 3000);
        }
    });
}