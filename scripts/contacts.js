async function loadAll() {
    renderContacts();
    await loadContacts();
}

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
    const response = await fetch(BASE_URL + "Contacts.json");
    const contacts = await response.json();

    if (!contacts) {
        console.log("Keine Kontakte zum Laden gefunden!");
        return;
    }

    const contactContainer = document.getElementById("showContacts");
    if (!contactContainer) return;
    contactContainer.innerHTML = "";        
    const letters = Object.keys(contacts).sort();

    for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        let letterHTML = `<div class="contact-letter-section"><h2>${letter}</h2>`;            
        for (let j = 0; j < contacts[letter].length; j++) {
            const contact = contacts[letter][j];
            letterHTML += `
                <div class="contact-item" onclick="displayContactInfo('${contact.name}', '${contact.email}', '${contact.phone}')">
                    <p><strong>${contact.name}</strong><br>${contact.email}</p>
                </div>
            `;
        }            
        letterHTML += '</div>';
        contactContainer.innerHTML += letterHTML;
    }
}

async function displayContactInfo(name, email, phone) {
    const contactInfoContainer = document.getElementById("contactInfo");
    let initials = '';
    const nameParts = name.split(' ');
    for (let i = 0; i < nameParts.length; i++) {
        initials += nameParts[i][0];
    }
    contactInfoContainer.innerHTML = /*html*/`
                <div>
                    <h2>${name} (${initials})</h2>
                    <div class="flex gap-8">
                        <button class="flex"><img src="assets/icons/edit.png" alt=""> Edit</button>
                        <button class="flex" onclick="deleteContact('${email}')"><img src="assets/icons/delete.png" alt=""> Delete</button>
                    </div>
                </div>
                <p>Contact Information</p>
                <div>
                    <h5>Email</h5>
                    <p><strong>${email}</strong></p>
                </div>
                <div>
                    <h5>Phone</h5>
                    <p><strong>${phone}</strong></p>
                </div>
    `;
}

async function deleteContact(contactEmail) {
    const response = await fetch(BASE_URL + "Contacts.json");
    const contacts = await response.json();
    if (!contacts) {
        console.log("Keine Kontakte in Firebase.");
        return;
    }
    const letters = Object.keys(contacts);
    for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        const contactGroup = contacts[letter];
        const index = contactGroup.findIndex(contact => contact.email === contactEmail);
        
        if (index !== -1) {
            contactGroup.splice(index, 1);
            break;
        }
    }
    await fetch(BASE_URL + "Contacts.json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(contacts),
    });
    loadContacts();
}


(async function main() {
    await loadAll();
})();
