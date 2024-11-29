function renderContacts() {
    const contactsContainer = document.getElementById("contacts");
    contactsContainer.innerHTML = /*html*/`
    <div class="flex">
        <div class="contacts">
            <button class="btnGray">Add new contact <img src="assets/icons/person_add.png" alt=""></button>
        </div>
        <div class="contact-container">
            <h1 class="headline">Contacts</h1>
            <span>
                <p>Better with a team</p>
            </span>
        </div>
    </div>
`;
}

// Automatisch laden
renderContacts();
