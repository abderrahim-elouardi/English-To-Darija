document.addEventListener("DOMContentLoaded",()=>{

const startSpeech = document.getElementById("recordBtn");
const result = document.getElementById("originalText");

// Compatibilité navigateur
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = "en-US"; // anglais (États-Unis)
recognition.continuous = false;
recognition.interimResults = false;

startSpeech.onclick = () => {
    recognition.start();
    recordBtn.classList.add('recording');
    recordBtn.textContent = '🎤 Enregistrement en cours...';
    originalText.style.color = '#667eea';
};

recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;    
    result.innerText = text;
    recordBtn.classList.remove('recording');
    recordBtn.innerHTML = '<span class="icon">🎙️</span>Démarrer l\'enregistrement';
    originalText.style.color = '#333';
};

recognition.onerror = (event) => {
    console.error("Erreur :", event.error);
};

transformBtn.addEventListener('click', async function() {
    const textToTranslate = result.value;
    
    try {
        const url = `http://localhost:8080/English-To-Darija-Traducter-1.0-SNAPSHOT/api/translate?originalText=${textToTranslate}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Erreur réseau ou API');

        const data = await response.json();
        
        document.getElementById('transformedText').innerText = data.darijaText

    } catch (error) {
        console.error('Erreur:', error);
        resultatDiv.innerText = "Erreur lors de la traduction.";
        resultatDiv.style.color = "red";
    }

    async function getSelectedTextFromWebPage() {
    try {
        // 1. On cherche l'onglet actif de la fenêtre de navigation (celle qui a le focus juste avant)
        const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

        if (!tab) return "Aucun onglet trouvé";

        // 2. On injecte le script pour récupérer la sélection de l'utilisateur
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => window.getSelection().toString()
        });

        // 3. On extrait le texte
        const text = results[0].result;
        return text ? text : "Aucun texte sélectionné";

    } catch (error) {
        console.error("Erreur de récupération:", error);
        return "Erreur technique";
    }


    
}


});        

})