async function renderContacts() {
    const contactsContainer = document.getElementById("contacts");
    if (contactsContainer) {
        contactsContainer.innerHTML = /*html*/ `
        <div class="flex">
            <div class="contacts">
                <div>
                    <button class="btnGray" onclick="renderAddContactForm()">Add new contact <img src="assets/icons/person_add.png" alt=""></button>
                </div>
                <div class="showContacts" id="showContacts"></div> <!-- Sicherstellen, dass dieses Element erstellt wird -->
            </div>
            <div class="contact-container">
                <div>
                    <div class="headline-container">
                        <h1 class="headline">Contacts</h1>
                        <span>
                            <p>Better with a team</p>
                        </span>
                    </div>
                    <div id="contactInfo"></div>
                </div>
            </div>
        </div>
        <div id="newContactForm" class="hidden" onclick="cancelCreateContact()">
            <div class="flex" onclick="event.stopPropagation()">
                <div class="bg-main ">
                    <img src="assets/icons/Capa 1.png" alt="">
                    <h3>Add contact</h3>
                    <p>Tasks are better with a team!</p>
                    <span></span>
                </div>
                <div class="bg-white">
                    <input type="text" id="newContactName" placeholder="Name">
                    <input type="email" id="newContactEmail" placeholder="Email">
                    <input type="tel" id="newContactPhone" placeholder="Phone">
                    <button onclick="createContact()">Create</button>
                    <button onclick="cancelCreateContact()">Cancel</button>
                </div>
            </div>
        </div>
        `;
    }
}

async function renderAddContactForm() {
    const newContactForm = document.getElementById("newContactForm");
    newContactForm.classList.remove("hidden");
    newContactForm.classList.add("bg-blur");
}

async function cancelCreateContact() {
    const newContactForm = document.getElementById("newContactForm");
    newContactForm.classList.add("hidden");
}

async function createContact() {
    const name = document.getElementById("newContactName").value;
    const email = document.getElementById("newContactEmail").value;
    const phone = document.getElementById("newContactPhone").value;
    if (!name || !email || !phone) {
        alert("Please fill in all fields.");
        return;
    }
    const contact = { name, email, phone };
    const firstLetter = name.charAt(0).toUpperCase();
    try {
        const response = await fetch(BASE_URL + "Contacts.json");
        const contacts = await response.json();
        if (!contacts) {
            console.log("Keine Kontakte in Firebase.");
        }
        if (!contacts[firstLetter]) {
            contacts[firstLetter] = [];
        }
        contacts[firstLetter].push(contact);
        await fetch(BASE_URL + "Contacts.json", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contacts),
        });
        await loadContacts();
        cancelCreateContact();
    } catch (error) {
        console.error("Fehler beim Hinzufügen des Kontakts:", error);
    }
}

async function loadContacts() {
    try {
        const response = await fetch(BASE_URL + "Contacts.json");
        const contacts = await response.json();
        if (!contacts) return;
        const contactContainer = document.getElementById("showContacts");
        if (!contactContainer) return;
        contactContainer.innerHTML = "";
        const letters = Object.keys(contacts).sort();

        for (let i = 0; i < letters.length; i++) {
            const letter = letters[i];
            let letterHTML = `<div class="contact-letter-section"><h2>${letter}</h2>`;
            for (let j = 0; j < contacts[letter].length; j++) {
                const contact = contacts[letter][j];
                
                // Direkt das Kontaktobjekt an den Event-Handler übergeben
                letterHTML += `
                    <div class="contact-item" onclick="displayContactInfo(${JSON.stringify(contact)})">
                        <p><strong>${contact.name}</strong><br>${contact.email}</p>
                    </div>
                `;
            }
            letterHTML += '</div>';
            contactContainer.innerHTML += letterHTML;
        }

    } catch (error) {
        console.error("Fehler beim Laden der Kontakte:", error);
    }
}

async function displayContactInfo(contact) {
    const contactInfoContainer = document.getElementById("contactInfo");

    // Initialen berechnen
    let initials = '';
    const nameParts = contact.name.split(' ');
    for (let i = 0; i < nameParts.length; i++) {
        initials += nameParts[i][0]; // Nimmt den ersten Buchstaben jedes Namens
    }

    // HTML-Inhalt für die Anzeige des Kontakts erstellen
    contactInfoContainer.innerHTML = /*html*/ `
        <div>
            <h2>${contact.name} (${initials})</h2>  <!-- Anzeige des Namens und der Initialen -->
            <div class="flex gap-8">
                <button class="flex"><img src="assets/icons/edit.png" alt=""> Edit</button>
                <button class="flex"><img src="assets/icons/delete.png" alt=""> Delete</button>
            </div>
        </div>
        <p>Contact Information</p>
        <div>
            <h5>Email</h5>
            <p><strong>${contact.email}</strong></p>  <!-- Anzeige der E-Mail -->
        </div>
        <div>
            <h5>Phone</h5>
            <p><strong>${contact.phone}</strong></p>  <!-- Anzeige der Telefonnummer -->
        </div>
    `;
}



(async function main() {
    renderContacts();
    await loadContacts();
})();