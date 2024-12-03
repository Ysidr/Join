window.onload = loadUserData;
const content = document.getElementById("main-content");
const navbarLinks = [
    document.getElementById("summaryLink"),
    document.getElementById("addTaskLink"),
    document.getElementById("boardLink"),
    document.getElementById("contactsLink"),
    document.getElementById("privacyPolicy"),
    document.getElementById("legalNotice"),
    document.getElementById("help"),
    document.getElementById("login")
];

async function loadUserData() {
    const isGuest = sessionStorage.getItem('isGuestAccount') === 'true';
    if (isGuest) {
        document.getElementById('user-initials').textContent = 'G';
        return;
    }
    const userId = sessionStorage.getItem('loggedInUserId');
    if (!userId) return;
    try {
        const userData = await fetchUserFromFirebase(userId);
        const initials = getInitials(userData.name);
        document.getElementById('user-initials').textContent = initials;
    } catch (error) {
        console.error('Fehler beim Laden der Benutzerdaten:', error);
        document.getElementById('user-initials').textContent = 'G';
    }
}

async function fetchUserFromFirebase(userId) {
    const response = await fetch(`${BASE_URL}User/${userId}.json`);
    if (!response.ok) {
        throw new Error('Benutzerdaten konnten nicht abgerufen werden');
    }
    const userData = await response.json();
    return userData;
}

function getInitials(name) {
    if (!name) return 'G';
    const nameParts = name.split(' ');
    const firstInitial = nameParts[0]?.charAt(0).toUpperCase();
    const lastInitial = nameParts[1]?.charAt(0).toUpperCase();
    return firstInitial + (lastInitial || '');
}

async function loadPage(page) {
    try {
        const response = await fetch(`${page}.html`);
        if (response.ok) {
            const html = await response.text();
            content.innerHTML = html;
            console.log(`Seite ${page}.html erfolgreich geladen.`);
        } else {
            content.innerHTML = `<p>Seite ${page} konnte nicht geladen werden.</p>`;
            return;
        }
        const dynamicCss = document.getElementById("dynamic-css");
        if (dynamicCss) {
            dynamicCss.href = `./styles/${page}.css`;
        } else {
            document.head.innerHTML += `<link id="dynamic-css" rel="stylesheet" href="./styles/${page}.css">`;
        }
        const scriptResponse = await fetch(`./scripts/${page}.js`);
        if (scriptResponse.ok) {
            const scriptText = await scriptResponse.text();
            eval(scriptText);
        }
    } catch (error) {
        content.innerHTML = `<p>Ein Fehler ist aufgetreten: ${error.message}</p>`;
    }
}

navbarLinks.forEach((link) => {
    if (link) {
        link.onclick = function (event) {
            event.preventDefault();
            const page = this.dataset.page;
            loadPage(page);
        };
    }
});

(async function initStartPage() {
    await loadPage("summary");
})();

function toggleMenu() {
    const menu = document.getElementById('menu-container');
    menu.classList.toggle('hidden');
}

