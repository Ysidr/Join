function renderContacts() {
    const contactsContainer = document.getElementById("contacts");
    contactsContainer.innerHTML = /*html*/`
    <div class="flex">
        <div class="contacts">
            <button class="btnGray">Add new contact <img src="assets/icons/person_add.png" alt=""></button>
        </div>
        <div class="contact-container">
            <div>
                <div class="headline-container">
                    <h1 class="headline">Contacts</h1>
                    <span>
                        <p>Better with a team</p>
                    </span>
                </div>
                <div>
                    <div>
                        <h2>Name</h2>
                        <div class="flex gap-8">
                            <button class="flex"><img src="assets/icons/edit.png" alt=""> Edit</button>
                            <button class="flex"><img src="assets/icons/delete.png" alt=""> Delete</button>
                        </div>

                    </div>
                    <p>Contact Information</p>
                    <div>
                        <h5>Email</h5>
                        <a href="mailto:test">test</a>
                    </div>
                    <div>
                        <h5>Phone</h5>
                        <a href="tel:+4912346545">+4912346545</a>
                    </div>
                </div>
            </div>

        </div>

    </div>
`;
}

renderContacts();

