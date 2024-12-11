async function loadAll() {
    await loadContacts();
}

async function loadContacts() {
    const response = await fetch(BASE_URL + "Contacts.json");
    const contacts = await response.json();
    const contactContainer = document.getElementById("showContacts");
    if (!contactContainer) return;    
    contactContainer.innerHTML = "";
    const letters = Object.keys(contacts).sort();    
    for (let i = 0; i < letters.length; i++) {
        loadContactsSecondFunction(letters[i], contacts[letters[i]], contactContainer);
    }
}

function loadContactsSecondFunction(letter, contactsForLetter, contactContainer) {
    let letterHTML = `<div class="contact-letter-section"><h2 class="letter-border">${letter}</h2>`;  
    for (let j = 0; j < contactsForLetter.length; j++) {
        const contact = contactsForLetter[j];
        const initials = getInitials(contact.name);
        letterHTML += getLoadContactTemplate(contact, initials);
    }
    letterHTML += '</div>';
    contactContainer.innerHTML += letterHTML;
}

async function cancelCreateContact() {
    const newContactForm = document.getElementById("newContactForm");
    const editContactForm = document.getElementById("editContactForm");
    if (newContactForm) newContactForm.classList.add("hidden");
    if (editContactForm) editContactForm.classList.add("hidden");
}

async function renderAddContactForm() {
    const newContactForm = document.getElementById("newContactForm");
    newContactForm.classList.remove("hidden");
    newContactForm.classList.add("bg-blur");
}

async function createContact() {
    const nameInput = document.getElementById("newContactName");
    const emailInput = document.getElementById("newContactEmail");
    const phoneInput = document.getElementById("newContactPhone");
    const name = nameInput.value;
    const email = emailInput.value;
    const phone = phoneInput.value;
    const bgColor = getRandomColor();    
    if (!name || !email || !phone) {
        alert("Please fill in all fields.");
        return;
    }    
    const contact = { name, email, phone, bgColor};
    const firstLetter = name.charAt(0).toUpperCase();
    try {
        const response = await fetch(BASE_URL + "Contacts.json");
        const contacts = await response.json();
        if (!contacts) {
            contacts = {};
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
        nameInput.value = "";
        emailInput.value = "";
        phoneInput.value = "";
    } catch (error) {
        console.error("Error while adding the contact:", error);
    }
}

function getInitials(name) {
    if (currentUserName == "") {
        currentUserName = name;
    }
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
    if (!contactInfoContainer) {
        console.log("Contact info container not found.");
        return;
    }
    contactInfoContainer.innerHTML = getContactInfoTemplate(name, email, phone, initials, bgColor);
}

async function editContact(contactEmail) {
    const response = await fetch(BASE_URL + "Contacts.json");
    const contacts = await response.json();
    if (!contacts) {
        console.log("No contacts found in Firebase.");
        return;
    }
    const letters = Object.keys(contacts);
    let foundContact = null;
    for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        const contactGroup = contacts[letter];
        foundContact = contactGroup.find(c => c.email === contactEmail);
        if (foundContact) break;
    }
    if (!foundContact) {
        console.log("Contact not found.");
        return;
    }
    const nameInput = document.getElementById("editContactName");
    const emailInput = document.getElementById("editContactEmail");
    const phoneInput = document.getElementById("editContactPhone");
    if (nameInput && emailInput && phoneInput) {
        nameInput.value = foundContact.name;
        emailInput.value = foundContact.email;
        phoneInput.value = foundContact.phone;
    }
    const editContactForm = document.getElementById("editContactForm");
    if (editContactForm) {
        editContactForm.classList.remove("hidden");
        editContactForm.classList.add("bg-blur");
        editContactForm.dataset.bgColor = foundContact.bgColor;
    }

    editContactForm.dataset.currentEmail = contactEmail;
    await getCurrentMailForButtons(contactEmail)
}



async function saveEditedContact() {
    const { name, email, phone, currentEmail, bgColor } = getEditedContactInputs();
    if (!name || !email || !phone || !currentEmail) {
        alert("Please fill in all fields.");
        return;
    }
    const contacts = await fetchContacts();
    if (!contacts) return console.log("No contacts found in Firebase.");
    const updatedContact = { name, email, phone, bgColor };
    const { oldLetter, newLetter } = getLetterGroups(contacts, name, currentEmail);
    modifyContacts(contacts, updatedContact, oldLetter, newLetter, currentEmail);
    await saveContacts(contacts);
    finalizeContactEditing(updatedContact);
}

function getEditedContactInputs() {
    const form = document.getElementById("editContactForm");
    return {
        name: document.getElementById("editContactName")?.value.trim(),
        email: document.getElementById("editContactEmail")?.value.trim(),
        phone: document.getElementById("editContactPhone")?.value.trim(),
        bgColor: form?.dataset.bgColor,
        currentEmail: form?.dataset.currentEmail,
    };
}

async function fetchContacts() {
    const response = await fetch(BASE_URL + "Contacts.json");
    return response.json() || {};
}

function getLetterGroups(contacts, newName, currentEmail) {
    const oldLetter = findCurrentLetter(contacts, currentEmail);
    const newLetter = newName.charAt(0).toUpperCase();
    return { oldLetter, newLetter };
}

function findCurrentLetter(contacts, currentEmail) {
    return Object.keys(contacts).find(letter =>
        contacts[letter]?.some(c => c.email === currentEmail)
    );
}

function modifyContacts(contacts, updatedContact, oldLetter, newLetter, currentEmail) {
    removeFromOldGroup(contacts, oldLetter, currentEmail);
    addToNewGroup(contacts, newLetter, updatedContact);
}

function removeFromOldGroup(contacts, oldLetter, currentEmail) {
    contacts[oldLetter] = contacts[oldLetter].filter(c => c.email !== currentEmail);
    if (!contacts[oldLetter].length) delete contacts[oldLetter];
}

function addToNewGroup(contacts, newLetter, updatedContact) {
    if (!contacts[newLetter]) contacts[newLetter] = [];
    contacts[newLetter].push(updatedContact);
}

async function saveContacts(contacts) {
    await fetch(BASE_URL + "Contacts.json", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contacts),
    });
}

function finalizeContactEditing(updatedContact) {
    const form = document.getElementById("editContactForm");
    form.classList.add("hidden");
    loadContacts();
    displayContactInfo(
        updatedContact.name,
        updatedContact.email,
        updatedContact.phone,
        getInitials(updatedContact.name),
        updatedContact.bgColor
    );
}

async function deleteContact(contactEmail) {
    const response = await fetch(BASE_URL + "Contacts.json");
    const contacts = await response.json();
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
    loadAll()
}

(async function main() {
    await loadAll();
})();

