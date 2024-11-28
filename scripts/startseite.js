async function loadUserInitials() {
    try {
        // Beispiel: Abfrage von Firebase
        const user = await fetchUserFromFirebase(); // Benutzerobjekt aus Firebase
        const initials = getInitials(user.firstName, user.lastName);
        document.getElementById('user-initials').innerHTML = initials;
    } catch (error) {
        console.error('Fehler beim Laden der Benutzerdaten:', error);
        document.getElementById('user-initials').innerHTML = 'G'; // Fallback für Gast
    }
}

// Hilfsfunktion: Initialen aus Vor- und Nachname extrahieren
function getInitials(firstName, lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
}

// Dummy-Funktion: Simuliert den Firebase-Aufruf
async function fetchUserFromFirebase() {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ firstName: 'Max', lastName: 'Mustermann' }), 500);
    });
}

// Initialen laden, z. B. beim Laden der Seite
loadUserInitials();
