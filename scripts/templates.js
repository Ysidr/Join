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
function renderClosestDate() {
    let s = nextDeadline;
    const niceDisplayOfDate = s.split('-').reverse().join('-');
    document.getElementById("Date").innerHTML = `<h2>${niceDisplayOfDate}</h2>`
}

//Render Contacts in Add Task functions

function resetContactList() {
    document.getElementById("openContactsDiv").innerHTML =
        `<div class="singleContact">
                    <input type="checkbox" name="namevehicle1" id="vehicle1" value="basicText">
                    <label for="vehicle1">Select contacts to assign</label><br>
                </div>`
}

function renderContact(responseToJson, indexContactWithLetter) {
    let name = responseToJson[indexContactWithLetter].name;
    let color = responseToJson[indexContactWithLetter].bgColor;
    document.getElementById("openContactsDiv").innerHTML +=
        `<div class="singleContact" id="${name}">
            <input type="checkbox" name="${name}" id="ID${name}" value="${name}" onclick="contactSelected('${name}', '${color}')">
             <label for="ID${name}">${name}</label><br>
        </div>`
    if (selectedContatct.includes(name)) {
        document.getElementById(name).classList.add("selectedContact")
    }
}

//Render tasks in Board functions

function renderTasksinBoard(responseToJson, indexTaskFields, indexTaskCount) {
    document.getElementById(currentlyRenderingTasks + "Tasks").innerHTML +=
        `<span class="singleTaskBoard" id="singleTaskBoard${responseToJson.title}" draggable="true" onclick="toggleNoteDetails('${indexTaskFields}', '${indexTaskCount}')" ondragstart="dragstartHandler(event)">
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
                <div id="prioImg${responseToJson.title}" class="prioImg"></div>
            </div>
        </span>`;
}

function renderSubtasks(responseToJson) {
    let doneCount = 0;
    for (let indexSubtasks = 0; indexSubtasks < responseToJson.subtasks.addedTask.length; indexSubtasks++) {
        if (responseToJson.subtasks.subtasksDone[indexSubtasks] == true) {
            doneCount++;
        }
    }
    const totalSubtasks = responseToJson.subtasks.addedTask.length;
    const progressPercentage = (doneCount / totalSubtasks) * 100;
    document.getElementById(responseToJson.title).innerHTML =
        `<div class="subtaskProgressBar">
                            <div class="subtaskProgressBarInner" style="width: ${progressPercentage}%;"></div>
                            </div>
                            <div class="subtaskCountSingleCard">
                                <p class="amountSubtaskSingleCard">${doneCount}/${responseToJson.subtasks.addedTask.length}</p>
                                <p class="subtaskTextSingleCard">Subtasks</p>
                            </div>`;

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

function renderDetails(indexTaskFields, indexTaskCount) {
    document.getElementById("detailContacts").innerHTML = "";
    document.getElementById("detailSubtasks").innerHTML = "";
    let objectAllTasks = Object.values(allCurrentTasksObj)[indexTaskFields];
    let specificObject = Object.values(objectAllTasks)[indexTaskCount];
    if (specificObject.category == "user") {
        document.getElementById("detailCategory").innerHTML = `<p class="pDetailCategory" style="background-color: #0038FF">User Story</p>`
    }else{
        document.getElementById("detailCategory").innerHTML = `<p class="pDetailCategory" style="background-color: #1FD7C1">Technical Task</p>`
    }
    document.getElementById("detailHeader").innerHTML = `<h1 class="hTitleCategory">${specificObject.title}</h1>`
    document.getElementById("detailDetails").innerHTML = `<p>${specificObject.description}</p>`
    document.getElementById("detailDate").innerHTML = `<p>Due date:</p><p>${specificObject.date}</p>`
    document.getElementById("detailPrio").innerHTML = `<p>Priority:</p><p>${specificObject.priority}</p>`
    if (specificObject.assigned != null) {
        for (let indexAddedContacts = 0; indexAddedContacts < specificObject.assigned.length; indexAddedContacts++) {
            const nameParts = specificObject.assigned[indexAddedContacts].split(' ');
            const firstInitial = nameParts[0]?.charAt(0).toUpperCase();
            const lastInitial = nameParts[1]?.charAt(0).toUpperCase();
            document.getElementById("detailContacts").innerHTML += `<div class="divSingleContactDetail"><p class="detailSingleContact" style="background-color:${specificObject.assignedBgColor[indexAddedContacts]};">${firstInitial}${lastInitial}</p> <p>${specificObject.assigned[indexAddedContacts]}</p> </div>`
        }
    }
    if (specificObject.subtasks != null) {
        for (let indexAddedSubtasks = 0; indexAddedSubtasks < specificObject.subtasks.addedTask.length; indexAddedSubtasks++) {
            if (specificObject.subtasks.subtasksDone[indexAddedSubtasks] == true) {
                document.getElementById("detailSubtasks").innerHTML += `<div class="subtaskDetailDiv"><input type="checkbox" id="checkboxSubtask${specificObject.subtasks.addedTask[indexAddedSubtasks]}" checked onclick="subtaskSelected('${indexTaskFields}', '${indexTaskCount}' , '${indexAddedSubtasks}')">
            <label for="checkboxSubtask${specificObject.subtasks.addedTask[indexAddedSubtasks]}">${specificObject.subtasks.addedTask[indexAddedSubtasks]}</label></div>`
            } else {
                document.getElementById("detailSubtasks").innerHTML += `<div class="subtaskDetailDiv"><input type="checkbox" id="checkboxSubtask${specificObject.subtasks.addedTask[indexAddedSubtasks]}" onclick="subtaskSelected('${indexTaskFields}', '${indexTaskCount}' , '${indexAddedSubtasks}')">
            <label for="checkboxSubtask${specificObject.subtasks.addedTask[indexAddedSubtasks]}">${specificObject.subtasks.addedTask[indexAddedSubtasks]}</label></div>`
            }
        }
    }
    document.getElementById("detailBtns").innerHTML = `
    <button onclick="deleteTaskFromBoard('${indexTaskFields}', '${indexTaskCount}')"> <img src="./assets/icons/delete.svg" alt=""></button>
            <div class="detailBtnSeperator"></div>
            <button onclick="editTaskInBoard('${indexTaskFields}', '${indexTaskCount}')" ><img src="./assets/icons/pencilSmall.svg" alt=""></button>`
}


function getLoadContactTemplate(contact, initials) {
    return `
        <div class="contact-item" onclick="displayContactInfo('${contact.name}', '${contact.email}', '${contact.phone}', '${initials}', '${contact.bgColor}')">
            <div class="initials" style="background-color: ${contact.bgColor};">${initials}</div>
            <div>
                <p><strong>${contact.name}</strong><br></p><p class="email">${contact.email}</p>
            </div>
        </div>
    `;
}

function getContactInfoTemplate(name, email, phone, initials, bgColor) {
    return `
        <div class="contact-info-container">
            <div class="flex gap-8 items-center">
                <div class="initials contact-details-img" style="background-color: ${bgColor};">${initials}</div>
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
            <a href="tel:${phone}" class="phone-number">${phone}</a>
        </div>`;
}


function getCurrentMailForButtons(contactEmail) {
    document.getElementById("new-contact-button-container").innerHTML = ` <div class="cancel cursor-pointer" data-email="${contactEmail}" onclick="deleteContact('${contactEmail}')">
                            <button>Delete</button>
                        </div>
                        <div class="create btnGray" onclick="saveEditedContact()">
                        <button>Save</button>
                            <img src="assets/icons/check.png" alt="">
                        </div>`
}

function resetAllBoards() {
    document.getElementById("InProgressTasks").innerHTML = `<div class="singleTaskBoard defaultNoTasks">
                <p class="noCurrentTasksText">No tasks In Progress</p>
            </div>`
    document.getElementById("ToDoTasks").innerHTML = `<div class="singleTaskBoard defaultNoTasks">
                <p class="noCurrentTasksText">No tasks In Progress</p>
            </div>`
    document.getElementById("DoneTasks").innerHTML = `<div class="singleTaskBoard defaultNoTasks">
                <p class="noCurrentTasksText">No tasks In Progress</p>
            </div>`
    document.getElementById("AwaitFeedbackTasks").innerHTML = `<div class="singleTaskBoard defaultNoTasks">
                <p class="noCurrentTasksText">No tasks In Progress</p>
            </div>`
}
