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

function findContactByEmail(contacts, contactEmail) {
    const letters = Object.keys(contacts);
    for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        const contactGroup = contacts[letter];
        const foundContact = contactGroup.find(c => c.email === contactEmail);
        if (foundContact) return foundContact;
    }
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

function validateForm() {
    let isValid = true;
    isValid &= validateName("newContactName");
    isValid &= validateEmail("newContactEmail");
    isValid &= validatePhone("newContactPhone");

    if (isValid) {
        createContact();
    }
}

function validateEditForm() {
    let isValid = true;
    isValid &= validateName("editContactName");
    isValid &= validateEmail("editContactEmail");
    isValid &= validatePhone("editContactPhone");

    if (isValid) {
        saveEditedContact();
    }
}

function validateName(inputId) {
    const nameInput = document.getElementById(inputId);
    if (!nameInput.value.trim()) {
        markInvalid(nameInput, "Name is required");
        return false;
    } else {
        markValid(nameInput);
        return true;
    }
}

function validateEmail(inputId) {
    const emailInput = document.getElementById(inputId);
    const emailValue = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValue) {
        markInvalid(emailInput, "Email is required");
        return false;
    } else if (!emailRegex.test(emailValue)) {
        markInvalid(emailInput, "Email must be in a valid format");
        return false;
    } else {
        markValid(emailInput);
        return true;
    }
}

function validatePhone(inputId) {
    const phoneInput = document.getElementById(inputId);
    const phoneValue = phoneInput.value.trim();
    const phoneRegex = /^[0-9]+$/;
    const startsWithValid = phoneValue.startsWith("0") || phoneValue.startsWith("+");
    if (!phoneValue) {
        markInvalid(phoneInput, "Phone number is required");
        return false;
    } else if (!phoneRegex.test(phoneValue) || !startsWithValid) {
        markInvalid(phoneInput, "Phone number must start with '0' or '+' and contain only numbers");
        return false;
    } else {
        markValid(phoneInput);
        return true;
    }
}

function markInvalid(input, message) {
    input.value = "";
    input.placeholder = message;
    input.classList.add("invalid", "error-message");
}

function markValid(input) {
    input.placeholder = "";
    input.classList.remove("invalid", "error-message");
}