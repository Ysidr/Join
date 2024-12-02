document.addEventListener("DOMContentLoaded", async () => {
    renderContacts();
    await loadContacts();
});

async function renderContacts() {
    const contactsContainer = document.getElementById("contacts");
    if (contactsContainer) {
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
            contactGroup.forEach((contact) => {
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
    }catch (error) {
        console.log("Fehler beim Laden der Kontakte:", error);
    }
}

async function displayContactInfo(contact) {
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
    await loadContacts();
})();
