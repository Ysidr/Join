async function loadUserInitials() {
    try {
        const user = await fetchUserFromFirebase();
        const initials = getInitials(user.firstName, user.lastName);
        document.getElementById('user-initials').innerHTML = initials;
    } catch (error) {
        console.error('Fehler beim Laden der Benutzerdaten:', error);
        document.getElementById('user-initials').innerHTML = 'G';
    }
}

function getInitials(firstName, lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
}

async function fetchUserFromFirebase() {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ firstName: 'Max', lastName: 'Mustermann' }), 500);
    });
}

loadUserInitials();

const content = document.getElementById("content");
const navbarLinks = document.querySelectorAll("[data-page]");

navbarLinks.forEach(link => {
    link.onclick = async (event) => {
        event.preventDefault();
        const page = link.dataset.page;
        await loadPage(page);
    };
});

async function loadPage(page) {
    try {
        const response = await fetch(`./${page}.html`);
        if (response.ok) {
            const html = await response.text();
            content.innerHTML = html;
            await loadScript(`./scripts/${page}.js`);
            console.log(`Seite ${page} erfolgreich geladen.`);
        } else {
            console.log(`Fehler beim Laden von ${page}: ${response.status}`);
            content.innerHTML = `<p>Seite ${page} konnte nicht geladen werden.</p>`;
        }
    } catch (error) {
        console.error(`Fehler beim Laden der Seite ${page}:`, error);
        content.innerHTML = `<p>Ein Fehler ist aufgetreten: ${error.message}</p>`;
    }
}

async function loadScript(scriptPath) {
    try {
        const script = document.createElement("script");
        script.src = scriptPath;
        script.defer = true;
        document.body.appendChild(script);
    } catch (error) {
        console.error(`Fehler beim Laden des Skripts ${scriptPath}:`, error);
    }
}

(async function initStartPage() {
    await loadPage("summary");
})();
