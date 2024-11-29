function renderContacts() {
    const contactsContainer = document.getElementById("contacts");
    contactsContainer.innerHTML = /*html*/ `
    <div class="flex">
        <div class="contacts">
            <div>
                <button class="btnGray" onclick="renderAddContactForm()">Add new contact <img src="assets/icons/person_add.png" alt=""></button>
            </div>
            <div class="showContacts" id="showContacts"></div>
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
    <div id="newContact" class="newContact-hidden"></div>
    `;
}

async function initializeContacts() {
    try {
        const response = await fetch(BASE_URL + "Contacts.json");
        const contacts = await response.json();
        if (!contacts) {
            console.log("Keine Kontakte gefunden. Initialisiere Standardkontakte...");
            await seedContacts();
        }
    } catch (error) {
        console.error("Fehler bei der Initialisierung der Kontakte:", error);
    }
}

async function seedContacts() {
    const initialContacts = {
        A: [
            { name: "Alice Johnson", email: "alice@example.com", phone: "+491234567890" },
            { name: "Aaron Smith", email: "aaron@example.com", phone: "+491234567891" }
        ],
        B: [
            { name: "Brian Davis", email: "brian@example.com", phone: "+491234567892" }
        ],
        C: [
            { name: "Claire Wilson", email: "claire@example.com", phone: "+491234567893" },
            { name: "Carl Becker", email: "carl@example.com", phone: "+491234567894" }
        ],
        D: [
            { name: "Diana Lopez", email: "diana@example.com", phone: "+491234567895" }
        ],
        E: [
            { name: "Edward Carter", email: "edward@example.com", phone: "+491234567896" }
        ]
    };
    await fetch(BASE_URL + "Contacts.json", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(initialContacts),
    });
}

async function loadContacts() {
    try {
        const response = await fetch(BASE_URL + "Contacts.json");
        const contacts = await response.json();
        if (!contacts) {
            console.error("Keine Kontakte zum Laden gefunden!");
            return;
        }
        const contactContainer = document.getElementById("showContacts");
        contactContainer.innerHTML = "";
        Object.keys(contacts).sort().forEach((letter) => {
            const contactGroup = contacts[letter];
            const letterSection = document.createElement("div");
            letterSection.classList.add("contact-letter-section");
            letterSection.innerHTML = `<h2>${letter}</h2>`;
            contactContainer.appendChild(letterSection);

            contactGroup.forEach((contact, index) => {
                const contactItem = document.createElement("div");
                contactItem.classList.add("contact-item");
                contactItem.onclick = () => displayContactInfo(contact);
                contactItem.innerHTML = `
                    <div class="contact-details">
                        <p><strong>${contact.name}</strong></p>
                        <p>${contact.email}</p>
                    </div>
                `;
                letterSection.appendChild(contactItem);
            });
        });
    } catch (error) {
        console.error("Fehler beim Laden der Kontakte:", error);
    }
}

function displayContactInfo(contact) {
    const contactInfoContainer = document.getElementById("contactInfo");
    const initials = contact.name.split(" ").map(namePart => namePart[0]).join("");
    contactInfoContainer.innerHTML = /*html*/ `
        <div>
            <h2>${contact.name} (${initials})</h2>
            <div class="flex gap-8">
                <button class="flex"><img src="assets/icons/edit.png" alt=""> Edit</button>
                <button class="flex"><img src="assets/icons/delete.png" alt=""> Delete</button>
            </div>
        </div>
        <p>Contact Information</p>
        <div>
            <h5>Email</h5>
            <a href="mailto:${contact.email}">${contact.email}</a>
        </div>
        <div>
            <h5>Phone</h5>
            <a href="tel:${contact.phone}">${contact.phone}</a>
        </div>
    `;
}

(async function main() {
    renderContacts();
    await initializeContacts();
    await loadContacts();
})();
