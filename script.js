const BASE_URL = "https://join-7cb80-default-rtdb.europe-west1.firebasedatabase.app/";

let UsersAmountViaId = 1;

let mailIsUsed = false;

// Dynamisches Laden der Seiten
const content = document.getElementById("content");
const navbarLinks = document.querySelectorAll("[data-page]");

// Event für Navigation auslesen
for (let i = 0; i < navbarLinks.length; i++) {
    const link = navbarLinks[i];
    link.onclick = async () => {
        const page = link.dataset.page; // Name der Seite auslesen
        await loadPage(page);
    };
}

// Seite dynamisch laden
async function loadPage(page) {
    try {
        // HTML der Seite laden
        const response = await fetch(`./${page}.html`);
        if (response.ok) {
            const html = await response.text();
            content.innerHTML = html;

            // Dynamisches Laden des JS
            await loadScript(`./scripts/${page}.js`);
            console.log(`${page} geladen.`);
        } else {
            console.log(`Fehler: ${response.status}`);
            content.innerHTML = `<p>Seite ${page} konnte nicht geladen werden.</p>`;
        }
    } catch (error) {
        console.log("Fehler beim Laden:", error);
        content.innerHTML = `<p>Ein Fehler ist aufgetreten: ${error.message}</p>`;
    }
}

// Externes Skript laden
async function loadScript(scriptPath) {
    try {
        const script = document.createElement("script");
        script.src = scriptPath;
        document.body.appendChild(script);
    } catch (error) {
        console.log("Fehler beim Laden des Skripts:", error);
    }
}

// Initialisierung starten (Login oder Startseite)
async function init() {
    const isLoggedIn = await checkLoginStatus();
    if (isLoggedIn) {
        await loadPage("startseite"); // Startseite laden
    } else {
        await loadPage("login"); // Login-Seite laden
    }
}

// Dummy: Login-Status prüfen
async function checkLoginStatus() {
    return new Promise((resolve) => {
        setTimeout(() => resolve(false), 500); // Simuliert ausgeloggten Zustand
    });
}

// Initialisierung beim Laden der Seite
init();

