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
                <div class="contact-div">
                    <button class="btnGray" onclick="renderAddContactForm()">Add new contact <img src="assets/icons/person_add.png" alt=""></button>
                </div>
                <div class="showContacts" id="showContacts"></div>
            </div>
            <div class="contact-container">
                <div class="padding">
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
        <div id="newContactForm" class="newContactForm hidden" onclick="cancelCreateContact()">
            <div class="new-contact-container" onclick="event.stopPropagation()">
                <div class="bg-main">
                    <div class="join-contact-container">
                        <img src="assets/icons/Capa 1.png" alt="">
                    </div>
                    <div class="join-contact-container">
                        <h2>Add Contact</h2>
                        <p>Tasks are better with a team!</p>
                    </div>
                </div>
                <div class="bg-white">
                    <div class="flex justify-end m-8">
                        <div class="cursor-pointer">
                            <img src="assets/icons/Vector.png" alt="" onclick="cancelCreateContact()">
                        </div>
                    </div>
                    <div class="flex margin gap-24 items-center">
                        <div>
                            <img src="assets/icons/Group13.png" alt="">
                        </div>
                        <div class="contact-inuptfield-container">
                            <div class="input-container">
                                <input type="text" id="newContactName" placeholder="Name">
                                <img src="assets/icons/person.png" alt="">
                            </div>
                            <div class="input-container">
                                <input type="email" id="newContactEmail" placeholder="Email">
                                <img src="assets/icons/mail.svg" alt="">
                            </div>
                            <div class="input-container">
                                <input type="tel" id="newContactPhone" placeholder="Phone">
                                <img src="assets/icons/call.png" alt="">
                            </div>
                            <div class="new-contact-button-container">
                            <div class="cancel cursor-pointer" onclick="cancelCreateContact()">
                                <button>Cancel</button>
                                <img src="assets/icons/Vector.png" alt="">
                            </div>
                            <div class="create btnGray" onclick="createContact()">
                                <button>Create Contact</button>
                                <img src="assets/icons/check.png" alt="">
                            </div>
                        </div>
                        </div>

                    </div>
                    <div>

                    </div>
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
        let letterHTML = `<div class="contact-letter-section"><h2 class="letter-border">${letter}</h2>`;            
        for (let j = 0; j < contacts[letter].length; j++) {
            const contact = contacts[letter][j];
            const initials = getInitials(contact.name);
            const bgColor = getRandomColor();
            letterHTML += /*html*/`
                    <div class="contact-item" onclick="displayContactInfo('${contact.name}', '${contact.email}', '${contact.phone}', '${initials}', '${bgColor}')">
                        <div class="initials" style="background-color: ${bgColor};">${initials}</div>
                        <div>
                            <p><strong>${contact.name}</strong><br>${contact.email}</p>
                        </div>
                    </div>
            `;
        }            
        letterHTML += '</div>';
        contactContainer.innerHTML += letterHTML;
    }
}

function getInitials(name) {
    const nameParts = name.split(' ');
    let initials = '';
    for (let i = 0; i < nameParts.length; i++) {
        initials += nameParts[i][0];
    }
    return initials.toUpperCase();
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

async function displayContactInfo(name, email, phone, initials, bgColor) {
    const contactInfoContainer = document.getElementById("contactInfo");
    contactInfoContainer.innerHTML = /*html*/`
                <div class="contact-info-container">
                    <div class="flex gap-8">
                        <div class="initials" style="background-color: ${bgColor};">${initials}</div>
                        <div>
                            <h2 class="text-4xl">${name}</h2>
                            <div class="flex gap-8 pt-4">
                                <button class="flex"><img src="assets/icons/edit.png" alt=""> Edit</button>
                                <button class="flex" onclick="deleteContact('${email}')"><img src="assets/icons/delete.png" alt=""> Delete</button>
                            </div>
                        </div>
                        
                    </div>                    

                </div>
                <div class="my-8">Contact Information</div>
                <div class="flex flex-col gap-4">
                    <h5><strong>Email</strong></h5>
                    <a href="mailto:${email}">${email}</a>
                    <h5><strong>Phone</strong></h5>
                    <a href="tel:${phone}">${phone}</a>
                </div>`;
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
