/**
 * Renders the count of tasks in the "To Do" section.
 */
function renderToDo() {
    document.getElementById("toDoCount").innerHTML =
        `<h1 class="taskAmount">${toDoTaskCount}</h1>`
}

/**
 * Renders the count of tasks in the "Done" section.
 */
function renderDone() {
    document.getElementById("doneCount").innerHTML =
        `<h1 class="taskAmount">${doneTaskCount}</h1>`
}

/**
 * Renders the count of tasks in the "Urgent" section.
 */
function renderUrgent() {
    document.getElementById("urgentTasks").innerHTML =
        `<h1 class="taskAmount">${urgentAmount}</h1>`
}

/**
 * Renders the total count of all tasks across different categories.
 */
function renderAllTasks() {
    document.getElementById("allTasks").innerHTML =
        `<h1 class="taskAmount">${TaskCount}</h1>`
}

/**
 * Renders the count of tasks in the "In Progress" section.
 */
function renderInProgress() {
    document.getElementById("inProgressTasks").innerHTML =
        `<h1 class="taskAmount">${inProgressTaskCount}</h1>`
}

/**
 * Renders the count of tasks awaiting feedback.
 */
function renderAwaitFeedback() {
    document.getElementById("awaitFeedbackTasks").innerHTML =
        `<h1 class="taskAmount">${awaitFeedbackTaskCount}</h1>`
}

/**
 * Renders the closest deadline date in a formatted way (DD-MM-YYYY).
 */
function renderClosestDate() {
    let s = nextDeadline;
    const niceDisplayOfDate = s.split('-').reverse().join('-');
    document.getElementById("Date").innerHTML = `<h2>${niceDisplayOfDate}</h2>`
}

/**
 * Resets the contact list in the "Add Task" section to its default state.
 */
function resetContactList() {
    document.getElementById("openContactsDiv").innerHTML =
        `<div class="singleContact">
                    <input type="checkbox" name="namevehicle1" id="vehicle1" value="basicText">
                    <label for="vehicle1">Select contacts to assign</label><br>
                </div>`
}

/**
 * Renders individual contacts in the "Add Task" section.
 * @param {Object} responseToJson - The JSON response containing the contact data.
 * @param {number} indexContactWithLetter - The index of the contact in the response data.
 */
function renderContact(responseToJson, indexContactWithLetter) {
    let name = responseToJson[indexContactWithLetter].name;
    let color = responseToJson[indexContactWithLetter].bgColor;
    if (selectedContatct.includes(name)) {
        document.getElementById("openContactsDiv").innerHTML +=
            `<div class="singleContact selectedContact" id="${name}">
            <input type="checkbox" name="${name}" id="ID${name}" value="${name}" onclick="contactSelected('${name}', '${color}')" checked>
             <label for="ID${name}">${name}</label><br>
        </div>`
    } else {
        document.getElementById("openContactsDiv").innerHTML +=
            `<div class="singleContact" id="${name}">
            <input type="checkbox" name="${name}" id="ID${name}" value="${name}" onclick="contactSelected('${name}', '${color}')">
             <label for="ID${name}">${name}</label><br>
        </div>`
    }
}

/**
 * Renders a task in the board view.
 * @param {Object} responseToJson - The JSON response containing the task data.
 * @param {number} indexTaskFields - The index of the task's field in the response data.
 * @param {number} indexTaskCount - The index of the task in the response data.
 */
function renderTasksinBoard(responseToJson, allTasksIndex) {
    document.getElementById(currentlyRenderingTasks + "Tasks").innerHTML +=
        `<span class="singleTaskBoard" id="singleTaskBoard${responseToJson.title}" draggable="true" onclick="toggleNoteDetails('${allTasksIndex}')" ondragstart="dragstartHandler(event)">
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
            <button class="moveTaskButton" onclick="showMoveOptions(event, '${responseToJson.title}')">→</button>
            <div class="moveOptions d-none" id="moveOptions${responseToJson.title}">
                <button onclick="moveTask('${responseToJson.title}', 'ToDoTasks')">To Do</button>
                <button onclick="moveTask('${responseToJson.title}', 'InProgressTasks')">In Progress</button>
                <button onclick="moveTask('${responseToJson.title}', 'AwaitFeedbackTasks')">Await Feedback</button>
                <button onclick="moveTask('${responseToJson.title}', 'DoneTasks')">Done</button>
            </div>
        </span>`;
}


/**
 * Renders subtasks for a specific task.
 * @param {Object} responseToJson - The JSON response containing the task data with subtasks.
 */
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

/**
 * Renders a "Technical Task" category for a task.
 * @param {Object} getCurrentTask - The task object.
 */
function renderCategoryTechnical(getCurrentTask) {
    document.getElementById(`divCategory${getCurrentTask.title}`).innerHTML =
        `<p class="categorySingleCard" id="category${getCurrentTask.title}">Technical Task</p>`
}

/**
 * Renders a "User Story" category for a task.
 * @param {Object} getCurrentTask - The task object.
 */
function renderCategoryUser(getCurrentTask) {
    document.getElementById(`divCategory${getCurrentTask.title}`).innerHTML = `<p class="categorySingleCard" id="category${getCurrentTask.title}">User Story</p>`
}

/**
 * Renders the initials of a contact assigned to a task.
 * @param {string} firstInitial - The first initial of the contact's name.
 * @param {string} lastInitial - The last initial of the contact's name.
 * @param {string} title - The task's title.
 * @param {Object} currentTask - The current task object.
 * @param {number} index - The index of the assigned contact.
 */
function renderInitials(firstInitial, lastInitial, title, currentTask, index) {
    document.getElementById(`contacts${title}`).innerHTML += `<p class="addedUserInitials" style="background-color: ${currentTask.assignedBgColor[index]};" >${firstInitial}${lastInitial}</p>`
}

/**
 * Renders task details in the details view.
 * @param {number} indexTaskFields - The index of the task's field in the task data.
 * @param {number} indexTaskCount - The index of the task.
 */
function renderDetails(allTasksIndex) {
    document.getElementById("detailContacts").innerHTML = "";
    document.getElementById("detailSubtasks").innerHTML = "";
    let specificObject = allCurrentTasksObj[allTasksIndex];
    if (specificObject.category == "user") {
        document.getElementById("detailCategory").innerHTML = `<p class="pDetailCategory" style="background-color: #0038FF">User Story</p>`
    } else {
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
    <button onclick="deleteTaskFromBoard('${allTasksIndex}')"> <img src="./assets/icons/delete.svg" alt=""></button>
            <div class="detailBtnSeperator"></div>
            <button onclick="editTaskInBoard('${allTasksIndex}')" ><img src="./assets/icons/pencilSmall.svg" alt=""></button>`
}


/**
 * Generates the HTML template for displaying a contact in a contact list.
 * The contact's initials, name, email, and background color are dynamically inserted into the template.
 * 
 * @param {Object} contact - The contact object containing the details (name, email, phone, bgColor).
 * @param {string} initials - The initials of the contact to be displayed.
 * @returns {string} The HTML template for a contact item.
 */
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

/**s
 * Generates the HTML template for displaying detailed information of a contact.
 * This template includes options to edit or delete the contact, as well as the contact's email and phone number.
 * 
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} initials - The initials of the contact.
 * @param {string} bgColor - The background color of the contact's initials.
 * @returns {string} The HTML template for contact details.
 */
function getContactInfoTemplate(name, email, phone, initials, bgColor) {
    return `
        <div class="contact-info-container">
            <div class="flex gap-8 items-center">
                <div class="initials contact-details-img" style="background-color: ${bgColor};">${initials}</div>
                <div>
                    <h2>${name}</h2>
                    <div class="reesponsive-detail-contact-button">
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
        </div>
        <div>
            <div class="responsive-contact-buttons">
               <button class="flex" onclick="showOtherButtons()"><img src="./assets/icons/Menu Contact options.svg" alt=""></button>
            <div class="responsive-contact-button-Div d-none" id="responsive-contact-buttons">
                <button class="flex" onclick="editContact('${email}')"><img src="assets/icons/edit.png" alt=""> Edit</button>
                <button class="flex" onclick="deleteContact('${email}')"><img src="assets/icons/delete.png" alt=""> Delete</button>
                </div>
            </div>
        </div>`;
}

/**
 * Updates the UI with buttons for deleting or saving the edited contact.
 * 
 * @param {string} contactEmail - The email of the contact being edited.
 */
function getCurrentMailForButtons(contactEmail) {
    document.getElementById("new-contact-button-container").innerHTML = ` <div class="cancel cursor-pointer" data-email="${contactEmail}" onclick="deleteContact('${contactEmail}')">
                            <button>Delete</button>
                        </div>
                        <div class="create btnGray" onclick="saveEditedContact()">
                        <button>Save</button>
                            <img src="assets/icons/check.png" alt="">
                        </div>`
}

/**
 * Resets all task boards to their default state with no tasks displayed.
 * This function clears the contents of all task categories (In Progress, To Do, Done, Await Feedback).
 */
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

/**
 * Clears the values in all input fields related to task creation.
 * It also resets various task-related state variables, preparing the UI for a new task.
 */
function clearInputs() {
    document.getElementById("titleInput").value = "";
    document.getElementById("descriptionInput").value = "";
    document.getElementById("subtaskInput").value = "";
    document.getElementById("dateIput").value = "";
    document.getElementById("categorytSelector").value = "";
    document.getElementById("addedSubtasks").innerHTML = "";
    document.getElementById("showAddedContacts").innerHTML = "";
    firstLetters = [];
    selectedContatct = [];
    selectedContatctBgColor = [];
    addedSubtasks = [];
    addedSubtaskDone = [];
    newAssigned = "";
    newAssignedBgColor = "";
    newPrio = "";
    newCategory = "";
    newTaskData = {};
    document.getElementById("openContactsDiv").classList.add("d-none");
}

/**
 * Adds a new subtask to the task creation UI.
 * The subtask is displayed with options to delete or edit it.
 * 
 * @throws {Error} If the subtask name is empty or only consists of spaces.
 */
function addSubtask() {
    let subtaskName = document.getElementById("subtaskInput").value.trim();
    if (subtaskName === "") return;
    let subtaskContainer = document.createElement('div');
    subtaskContainer.classList.add('addedSubtaskContainer');
    subtaskContainer.id = `subtask-${subtaskName}`;

    let subtaskText = document.createElement('p');
    subtaskText.classList.add('addedSubtask');
    subtaskText.textContent = `- ${subtaskName}`;

    let deleteImg = document.createElement('img');
    deleteImg.src = "./assets/icons/delete.svg";
    deleteImg.alt = "Delete";
    deleteImg.classList.add('delete-icon');
    deleteImg.onclick = () => deleteSubtask(subtaskName);

    let editImg = document.createElement('img');
    editImg.src = "./assets/icons/pencilSmall.svg";
    editImg.alt = "Edit";
    editImg.classList.add('edit-icon');
    editImg.onclick = () => editSubtask(subtaskContainer, subtaskName);

    subtaskContainer.appendChild(subtaskText);
    subtaskContainer.appendChild(deleteImg);
    subtaskContainer.appendChild(editImg);

    document.getElementById("addedSubtasks").appendChild(subtaskContainer);
    addedSubtasks.push(subtaskName);
    addedSubtaskDone.push(false);
    document.getElementById("subtaskInput").value = "";
}

/**
 * Saves the updated name for an existing subtask after editing.
 * 
 * @param {HTMLElement} subtaskContainer - The container of the subtask to be updated.
 * @param {string} newName - The new name for the subtask.
 * @param {string} oldName - The original name of the subtask.
 */
function saveSubtask(subtaskContainer, newName, oldName) {
    let index = addedSubtasks.indexOf(oldName);
    if (index !== -1) {
        addedSubtasks[index] = newName;
    }
    subtaskContainer.innerHTML = "";

    let subtaskText = document.createElement('p');
    subtaskText.classList.add('addedSubtask');
    subtaskText.textContent = `- ${newName}`;

    let deleteImg = document.createElement('img');
    deleteImg.src = "./assets/icons/delete.svg";
    deleteImg.alt = "Delete";
    deleteImg.classList.add('delete-icon');
    deleteImg.onclick = () => deleteSubtask(newName);

    let editImg = document.createElement('img');
    editImg.src = "./assets/icons/pencilSmall.svg";
    editImg.alt = "Edit";
    editImg.classList.add('edit-icon');
    editImg.onclick = () => editSubtask(subtaskContainer, newName);

    subtaskContainer.appendChild(subtaskText);
    subtaskContainer.appendChild(deleteImg);
    subtaskContainer.appendChild(editImg);
}

/**
 * Renders all the added subtasks to the UI for a specific task.
 * Each subtask is displayed with options to delete or edit it.
 */
function renderAllSubtasks() {
    let container = document.getElementById("addedSubtasks");
    container.innerHTML = "";
    addedSubtasks.forEach(subtask => {
        let subtaskContainer = document.createElement('div');
        subtaskContainer.classList.add('addedSubtaskContainer');
        subtaskContainer.id = `subtask-${subtask}`;

        let subtaskText = document.createElement('p');
        subtaskText.classList.add('addedSubtask');
        subtaskText.textContent = `- ${subtask}`;

        let deleteImg = document.createElement('img');
        deleteImg.src = "./assets/icons/delete.svg";
        deleteImg.alt = "Delete";
        deleteImg.classList.add('delete-icon');
        deleteImg.onclick = () => deleteSubtask(subtask);

        let editImg = document.createElement('img');
        editImg.src = "./assets/icons/pencilSmall.svg";
        editImg.alt = "Edit";
        editImg.classList.add('edit-icon');
        editImg.onclick = () => editSubtask(subtaskContainer, subtask);

        subtaskContainer.appendChild(subtaskText);
        subtaskContainer.appendChild(deleteImg);
        subtaskContainer.appendChild(editImg);

        container.appendChild(subtaskContainer);
    });
}

/**
 * Fills in the task input fields with the details of a specific task that is being edited.
 * This includes the task's title, description, date, subtasks, and category.
 * 
 * @param {Object} specificObject - The task object containing the data to be rendered.
 * @param {number} indexTaskFields - The index of the task in the list of fields.
 * @param {number} indexTaskCount - The index of the task in the list of tasks.
 */
function renderNoteToEdit(specificObject, indexTaskFields, indexTaskCount) {
    document.getElementById("titleInput").value = specificObject.title;
    document.getElementById("descriptionInput").value = specificObject.description;
    document.getElementById("dateIput").value = specificObject.date;
    if (specificObject.assigned.length > 0) {
        selectedContatct = specificObject.assigned;
        selectedContatctBgColor = specificObject.assignedBgColor;
    } else {
        selectedContatct = []
        selectedContatctBgColor = [];
    }
    getInitialsOfAddedUser();
    document.getElementById(`ID${specificObject.priority}`).checked = true;
    if (specificObject.subtasks) {
        addedSubtasks = specificObject.subtasks.addedTask
        addedSubtaskDone = specificObject.subtasks.subtasksDone
        renderAllSubtasks()
    }
    if (specificObject.category = "technical") {
        document.getElementById("categorytSelector").selectedIndex = 1;
    } else {
        document.getElementById("categorytSelector").selectedIndex = 2;
    }
    document.getElementById("addTasksBtn").innerHTML = `<button class="btnClear clearBtn" onclick="cancelEdit()">Cancel</button>
    <button class="btnGray" onclick="updateTask('${indexTaskFields}', '${indexTaskCount}')">Update Task</button>`
}