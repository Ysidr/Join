/**
 * Loads all contacts from the server and displays them on the page.
 * @async
 * @function loadAll
 * @returns {Promise<void>}
 */
async function loadAll() {
    await loadContacts();
}

/**
 * Fetches the contacts from the server and organizes them by their first letter.
 * Then, it loads and displays each contact group.
 * @async
 * @function loadContacts
 * @returns {Promise<void>}
 */
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

/**
 * Generates and appends HTML for each contact group based on the first letter of the contact names.
 * @function loadContactsSecondFunction
 * @param {string} letter - The first letter of the contact group.
 * @param {Array} contactsForLetter - The contacts under the specific letter group.
 * @param {HTMLElement} contactContainer - The container element where contacts will be displayed.
 * @returns {void}
 */
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

/**
 * Hides the "new contact" and "edit contact" forms.
 * @async
 * @function cancelCreateContact
 * @returns {Promise<void>}
 */
async function cancelCreateContact() {
    const newContactForm = document.getElementById("newContactForm");
    const editContactForm = document.getElementById("editContactForm");
    if (newContactForm) newContactForm.classList.add("d-none");
    if (editContactForm) editContactForm.classList.add("d-none");
}

/**
 * Displays the "new contact" form and applies a blur background.
 * @async
 * @function renderAddContactForm
 * @returns {Promise<void>}
 */
async function renderAddContactForm() {
    if (window.innerWidth < 1351) {
        document.getElementById("new-contact-container").classList.remove("aninmation");
        document.getElementById("new-contact-container").classList.add("aninmationTopDow");
    }else{
        document.getElementById("new-contact-container").classList.add("aninmation");
        document.getElementById("new-contact-container").classList.remove("aninmationTopDow");
    }
    const newContactForm = document.getElementById("newContactForm");
    newContactForm.classList.remove("d-none");
    newContactForm.classList.add("bg-blur");
}

/**
 * Creates a new contact and saves it to the server after validation.
 * @async
 * @function createContact
 * @returns {Promise<void>}
 */
async function createContact() {
    const name = getName();
    const email = getEmail();
    const phone = getPhone();
    const bgColor = getRandomColor();

    if (!isValidForm(name, email, phone)) return;

    const contact = createContactObject(name, email, phone, bgColor);
    const firstLetter = getFirstLetter(name);

    try {
        const contacts = await fetchContacts();
        await saveContact(firstLetter, contacts, contact);
        resetForm();
        await loadContacts();
        cancelCreateContact();
    } catch (error) {
        console.error("Error while adding the contact:", error);
    }
}

function getName() {
    return document.getElementById("newContactName").value;
}

function getEmail() {
    return document.getElementById("newContactEmail").value;
}

function getPhone() {
    return document.getElementById("newContactPhone").value;
}

function getFirstLetter(name) {
    return name.charAt(0).toUpperCase();
}

function isValidForm(name, email, phone) {
    if (!name || !email || !phone) {
        alert("Please fill in all fields.");
        return false;
    }
    return true;
}

function createContactObject(name, email, phone, bgColor) {
    return { name, email, phone, bgColor };
}

async function fetchContacts() {
    const response = await fetch(BASE_URL + "Contacts.json");
    const contacts = await response.json();
    return contacts || {};
}

async function saveContact(firstLetter, contacts, contact) {
    if (!contacts[firstLetter]) {
        contacts[firstLetter] = [];
    }
    contacts[firstLetter].push(contact);

    await fetch(BASE_URL + "Contacts.json", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contacts),
    });
}

function resetForm() {
    document.getElementById("newContactName").value = "";
    document.getElementById("newContactEmail").value = "";
    document.getElementById("newContactPhone").value = "";
}


/**
 * Retrieves the initials of a contact's name.
 * @function getInitials
 * @param {string} name - The full name of the contact.
 * @returns {string} The initials of the contact's name.
 */
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

/**
 * Generates a random color in hexadecimal format.
 * @function getRandomColor
 * @returns {string} A random hex color code.
 */
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * Displays detailed information of a contact in a modal-like container.
 * @async
 * @function displayContactInfo
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} initials - The initials of the contact.
 * @param {string} bgColor - The background color for the contact display.
 * @returns {Promise<void>}
 */
async function displayContactInfo(name, email, phone, initials, bgColor) {
    const contactInfoContainer = document.getElementById("contactInfo");
    const contactContainer = document.getElementById("contactContainer");
    
    if (!contactInfoContainer) {
        console.log("Contact info container not found.");
        return;
    }

    // Wenn der Kontakt gelöscht wurde, den Container leeren
    if (!name) {
        contactInfoContainer.innerHTML = "<p>Contact has been deleted.</p>";
    } else {
        contactInfoContainer.innerHTML = getContactInfoTemplate(name, email, phone, initials, bgColor);
    }
    
    contactContainer.classList.toggle("mobil-hidden");
}

/**
 * Closes the contact information modal.
 * @function closeContactInfo
 * @returns {void}
 */
function closeContactInfo() {
    const contactContainer = document.getElementById("contactContainer");
    contactContainer.classList.toggle("mobil-hidden");
}

/**
 * Edits an existing contact's information.
 * @async
 * @function editContact
 * @param {string} contactEmail - The email of the contact to be edited.
 * @returns {Promise<void>}
 */
async function editContact(contactEmail) {
    handleEditFormAnimation();
    const contacts = await fetchContacts();
    if (!contacts) return;

    const foundContact = findContactByEmail(contacts, contactEmail);
    if (!foundContact) return;

    populateEditForm(foundContact);
    setupEditFormOverlay(foundContact, contactEmail);
}

function handleEditFormAnimation() {
    const editForm = document.getElementById("new-contact-containerEdit");
    if (window.innerWidth < 1351) {
        editForm.classList.remove("aninmation");
        editForm.classList.add("aninmationTopDow");
    } else {
        editForm.classList.add("aninmation");
        editForm.classList.remove("aninmationTopDow");
    }
}

async function fetchContacts() {
    const response = await fetch(BASE_URL + "Contacts.json");
    const contacts = await response.json();
    if (!contacts) {
        console.log("No contacts found in Firebase.");
        return null;
    }
    return contacts;
}

function findContactByEmail(contacts, contactEmail) {
    const letters = Object.keys(contacts);
    for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        const contactGroup = contacts[letter];
        const foundContact = contactGroup.find(c => c.email === contactEmail);
        if (foundContact) return foundContact;
    }
    console.log("Contact not found.");
    return null;
}

function populateEditForm(foundContact) {
    const nameInput = document.getElementById("editContactName");
    const emailInput = document.getElementById("editContactEmail");
    const phoneInput = document.getElementById("editContactPhone");
    if (nameInput && emailInput && phoneInput) {
        nameInput.value = foundContact.name;
        emailInput.value = foundContact.email;
        phoneInput.value = foundContact.phone;
    }
}

function setupEditFormOverlay(foundContact, contactEmail) {
    const editContactForm = document.getElementById("editContactForm");
    if (editContactForm) {
        editContactForm.classList.remove("d-none");
        editContactForm.classList.add("bg-blur");
        editContactForm.dataset.bgColor = foundContact.bgColor;
    }
    editContactForm.dataset.currentEmail = contactEmail;
    getCurrentMailForButtons(contactEmail);
}


/**
 * Saves the edited contact details back to the server.
 * @async
 * @function saveEditedContact
 * @returns {Promise<void>}
 */
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
    displayContactInfo(name, email, phone, name.charAt(0).toUpperCase(), bgColor);
}

/**
 * Collects the edited contact data from the form.
 * @function getEditedContactInputs
 * @returns {Object} The edited contact's name, email, phone, bgColor, and currentEmail.
 */
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

/**
 * Fetches all contacts from the server.
 * @async
 * @function fetchContacts
 * @returns {Promise<Object>} The contacts object from the server.
 */
async function fetchContacts() {
    const response = await fetch(BASE_URL + "Contacts.json");
    const contacts = await response.json();
    if (!contacts) {
        console.log("No contacts found in Firebase.");
        return null;
    }
    return contacts;
}

/**
 * Determines the old and new letter groups based on the edited contact's information.
 * @function getLetterGroups
 * @param {Object} contacts - The contacts object grouped by letters.
 * @param {string} newName - The new name of the contact.
 * @param {string} currentEmail - The current email of the contact.
 * @returns {Object} An object containing the old and new letter groups.
 */
function getLetterGroups(contacts, newName, currentEmail) {
    const oldLetter = findCurrentLetter(contacts, currentEmail);
    const newLetter = newName.charAt(0).toUpperCase();
    return { oldLetter, newLetter };
}

/**
 * Finds the current letter group for the contact with the specified email.
 * @function findCurrentLetter
 * @param {Object} contacts - The contacts object grouped by letters.
 * @param {string} currentEmail - The email of the contact.
 * @returns {string} The letter group where the contact belongs.
 */
function findCurrentLetter(contacts, currentEmail) {
    return Object.keys(contacts).find(letter =>
        contacts[letter]?.some(c => c.email === currentEmail)
    );
}

/**
 * Modifies the contacts object by removing the old contact and adding the updated contact.
 * @function modifyContacts
 * @param {Object} contacts - The contacts object grouped by letters.
 * @param {Object} updatedContact - The updated contact object.
 * @param {string} oldLetter - The old letter group of the contact.
 * @param {string} newLetter - The new letter group of the contact.
 * @param {string} currentEmail - The current email of the contact.
 * @returns {void}
 */
function modifyContacts(contacts, updatedContact, oldLetter, newLetter, currentEmail) {
    removeFromOldGroup(contacts, oldLetter, currentEmail);
    addToNewGroup(contacts, newLetter, updatedContact);
}

/**
 * Removes a contact from its old letter group.
 * @function removeFromOldGroup
 * @param {Object} contacts - The contacts object grouped by letters.
 * @param {string} oldLetter - The old letter group of the contact.
 * @param {string} currentEmail - The email of the contact to be removed.
 * @returns {void}
 */
function removeFromOldGroup(contacts, oldLetter, currentEmail) {
    contacts[oldLetter] = contacts[oldLetter].filter(c => c.email !== currentEmail);
    if (!contacts[oldLetter].length) delete contacts[oldLetter];
}

/**
 * Adds a contact to its new letter group.
 * @function addToNewGroup
 * @param {Object} contacts - The contacts object grouped by letters.
 * @param {string} newLetter - The new letter group of the contact.
 * @param {Object} updatedContact - The updated contact to be added.
 * @returns {void}
 */
function addToNewGroup(contacts, newLetter, updatedContact) {
    if (!contacts[newLetter]) contacts[newLetter] = [];
    contacts[newLetter].push(updatedContact);
}

/**
 * Saves the updated contacts object to the server.
 * @async
 * @function saveContacts
 * @param {Object} contacts - The contacts object to be saved.
 * @returns {Promise<void>}
 */
async function saveContacts(contacts) {
    await fetch(BASE_URL + "Contacts.json", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contacts),
    });
}

/**
 * Finalizes the contact editing process by hiding the edit form and reloading the contacts.
 * @function finalizeContactEditing
 * @param {Object} updatedContact - The updated contact that has been edited.
 * @returns {void}
 */
function finalizeContactEditing(updatedContact) {
    document.getElementById("editContactForm").classList.add("d-none");
    loadContacts();
    displayContactInfo(
        updatedContact.name,
        updatedContact.email,
        updatedContact.phone,
        getInitials(updatedContact.name),
        updatedContact.bgColor
    );
}

/**
 * Deletes a contact based on the provided email.
 * @async
 * @function deleteContact
 * @param {string} contactEmail - The email of the contact to be deleted.
 * @returns {Promise<void>}
 */
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
    displayContactInfo(null, null, null, null, null);
    loadAll();
}

async function addNewContactContainer() {
    document.getElementById("main-content").innerHTML = `<div class="addedContact"><p>Contact succesfully created</p> <img src="./assets/icons/Vector.svg" alt=""></div>`;
    await new Promise(r => setTimeout(r, 2000));
    loadPage('contacts');
}

/**
 * The main function that runs when the page is loaded. It initiates the loading of all contacts.
 * @async
 * @function main
 * @returns {Promise<void>}
 */
(async function main() {
    await loadAll();
})();

function showOtherButtons() {
    document.getElementById("responsive-contact-buttons").classList.toggle("d-none")
}

function validateForm() {
    let isValid = true;
    if (!validateName()) isValid = false;
    if (!validateEmail()) isValid = false;
    if (!validatePhone()) isValid = false;
    if (isValid) {
        createContact();
    }
}

function validateName() {
    const nameInput = document.getElementById("newContactName");
    const isValid = nameInput.value.trim() !== "";
    markField(nameInput, isValid);
    return isValid;
}

function validateEmail() {
    const emailInput = document.getElementById("newContactEmail");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(emailInput.value.trim());
    markField(emailInput, isValid);
    return isValid;
}

function validatePhone() {
    const phoneInput = document.getElementById("newContactPhone");
    const phoneRegex = /^[0-9]+$/;
    const isValid = phoneRegex.test(phoneInput.value.trim());
    markField(phoneInput, isValid);
    return isValid;
}

function markField(inputElement, isValid) {
    const container = inputElement.parentElement;
    if (isValid) {
        container.classList.remove("invalid");
    } else {
        container.classList.add("invalid");
    }
}
