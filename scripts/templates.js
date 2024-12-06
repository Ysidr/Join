//Render Task Counts for Summary functions

function renderToDo() {
    document.getElementById("toDoCount").innerHTML =
        `<h1 class="taskAmount">${toDoTaskCount}</h1>`
}
function renderDone() {
    document.getElementById("doneCount").innerHTML =
        `<h1 class="taskAmount">${doneTaskCount}</h1>`
}
function renderUrgent() {
    document.getElementById("urgentTasks").innerHTML =
        `<h1 class="taskAmount">${urgentAmount}</h1>`
}
function renderAllTasks() {
    document.getElementById("allTasks").innerHTML =
        `<h1 class="taskAmount">${toDoTaskCount + awaitFeedbackTaskCount + doneTaskCount + inProgressTaskCount}</h1>`
}
function renderInProgress() {
    document.getElementById("inProgressTasks").innerHTML =
        `<h1 class="taskAmount">${inProgressTaskCount}</h1>`
}
function renderAwaitFeedback() {
    document.getElementById("awaitFeedbackTasks").innerHTML =
        `<h1 class="taskAmount">${awaitFeedbackTaskCount}</h1>`
}

//Render Contacts in Add Task functions

function resetContactList() {
    document.getElementById("openContactsDiv").innerHTML =
        `<div class="singleContact">
                    <input type="checkbox" id="vehicle1" value="basicText">
                    <label for="vehicle1">Select contacts to assign</label><br>
                </div>`
}

function renderContact(responseToJson, indexContactWithLetter) {
    document.getElementById("openContactsDiv").innerHTML +=
        `<div class="singleContact" id="${responseToJson[indexContactWithLetter].name}">
                    <input type="checkbox" id="${responseToJson[indexContactWithLetter].name}" value="${responseToJson[indexContactWithLetter].name}" onclick="contactSelected('${responseToJson[indexContactWithLetter].name}')">
                    <label for="${responseToJson[indexContactWithLetter].name}" onclick="contactSelected('${responseToJson[indexContactWithLetter].name}', '${responseToJson[indexContactWithLetter].bgColor}')">${responseToJson[indexContactWithLetter].name}</label><br>
                </div>`
    if (selectedContatct.includes(responseToJson[indexContactWithLetter].name)) {
        document.getElementById(responseToJson[indexContactWithLetter].name).classList.add("selectedContact")
    }
}

//Render tasks in Board functions

function renderTasksinBoard(responseToJson) {
    document.getElementById(currentlyRenderingTasks+"Tasks").innerHTML +=
        `<div class="singleTaskBoard" onclick="toggleNoteDetails("${responseToJson.title}")">
                    <div class="category" id="divCategory${responseToJson.title}">
                    </div>
                    <div class="textSingleTask">
                        <p class="titleSingleCard">${responseToJson.title}</p>
                        <p class="descriptionSingleCard">${responseToJson.description}</p>
                    </div>
                    <div class="subtasksSingleCard" id="${responseToJson.title}">
                        
                    </div>
                    <div class="bottomDivSingleCard">
                        <div class="addedContactsSingleCard" id="contacts${responseToJson.title}"></div>
                        <div id="prioImg${responseToJson.title}" class="prioImg">
                        </div>
                    </div>
                </div>`
}

function renderSubtasks(responseToJson) {
    document.getElementById(responseToJson.title).innerHTML =
        `<div class="subtaskProgressBar"></div>
                        <div class="subtaskCountSingleCard">
                            <p class="amountSubtaskSingleCard">/${responseToJson.subtasks.length}</p>
                            <p class="subtaskTextSingleCard">Subtasks</p>
                        </div>`

}

function renderCategoryTechnical(getCurrentTask) {
    document.getElementById(`divCategory${getCurrentTask.title}`).innerHTML = 
    `<p class="categorySingleCard" id="category${getCurrentTask.title}">Technical Task</p>`
}

function renderCategoryUser(getCurrentTask) {
document.getElementById(`divCategory${getCurrentTask.title}`).innerHTML = `<p class="categorySingleCard" id="category${getCurrentTask.title}">User Story</p>`
}

function renderInitials(firstInitial, lastInitial, title, currentTask, index) {
    document.getElementById(`contacts${title}`).innerHTML += `<p class="addedUserInitials" style="background-color: ${currentTask.assignedBgColor[index]};" >${firstInitial}${lastInitial}</p>`
}

function renderDetails() {
    document.getElementById("detailCategory").innerHTML = `<p class="pDetailCategory">${responseToJson.category}</p>`
}

function getContactsTemplate(){
    return /*html*/`
                <div class="flex">
                    <div class="contacts">
                        <div class="contact-div">
                            <button class="btnGray" onclick="renderAddContactForm()">Add new contact <img src="assets/icons/person_add.png" alt=""></button>
                        </div>
                        <div class="showContacts" id="showContacts" ></div>
                    </div>
                    <div class="contact-container">
                        <div class="padding">
                            <div class="headline-container">
                                <h1>Contacts</h1>
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
                            <div class="flex justify-end mt-8">
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
                <div id="editContactForm" class="newContactForm hidden" onclick="cancelCreateContact()">
                    <div class="new-contact-container" onclick="event.stopPropagation()">
                        <div class="bg-main">
                            <div class="join-contact-container">
                                <img src="assets/icons/Capa 1.png" alt="">
                            </div>
                            <div class="join-contact-container">
                                <h2>Edit Contact</h2>
                                <p class="border-bottom"></p>
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
                                        <input type="text" id="editContactName" placeholder="Name">
                                        <img src="assets/icons/person.png" alt="">
                                    </div>
                                    <div class="input-container">
                                        <input type="email" id="editContactEmail" placeholder="Email">
                                        <img src="assets/icons/mail.svg" alt="">
                                    </div>
                                    <div class="input-container">
                                        <input type="tel" id="editContactPhone" placeholder="Phone">
                                        <img src="assets/icons/call.png" alt="">
                                    </div>
                                    <div class="new-contact-button-container">
                                    <div class="cancel cursor-pointer" onclick="deleteContact()">
                                        <button>Delete</button>
                                    </div>
                                    <div class="create btnGray" onclick="saveEditedContact()">
                                    <button>Save</button>
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

function getloadContactsTemplate(contact , initials){
    return /*html*/`
                <div class="contact-item" onclick="displayContactInfo('${contact.name}', '${contact.email}', '${contact.phone}', '${initials}', '${contact.bgColor}')">
                    <div class="initials" style="background-color: ${contact.bgColor};">${initials}</div>
                    <div>
                        <p><strong>${contact.name}</strong><br></p><p class="email">${contact.email}</p>
                    </div>
                </div>`;
}

function getDisplayContactInfoTemplate(name, email, phone, initials, bgColor){
    return /*html*/`
                <div class="contact-info-container">
                    <div class="flex gap-8">
                        <div class="initials" style="background-color: ${bgColor};">${initials}</div>
                        <div>
                            <h2>${name}</h2>
                            <div class="flex gap-8 pt-4">
                                <button class="flex" onclick="editContact('${email}')"><img src="assets/icons/edit.png" alt=""> Edit</button>
                                <button class="flex" onclick="deleteContact('${email}')"><img src="assets/icons/delete.png" alt=""> Delete</button>
                            </div>
                        </div>                   
                    </div>                    

                </div>
                <div class="my-8"><h3>Contact Information</h3></div>
                <div class="flex flex-col gap-4">
                    <h5><strong>Email</strong></h5>
                    <a href="mailto:${email}" class="email">${email}</a>
                    <h5><strong>Phone</strong></h5>
                    <a href="tel:${phone}">${phone}</a>
                </div>`;
}
