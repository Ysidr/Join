/**
 * Renders a task in the board view.
 * @param {Object} responseToJson - The JSON response containing the task data.
 * @param {number} indexTaskFields - The index of the task's field in the response data.
 * @param {number} indexTaskCount - The index of the task in the response data.
 */
function renderTasksinBoard(responseToJson, allTasksIndex) {
    document.getElementById(currentlyRenderingTasks + "Tasks").innerHTML +=
        `<span class="singleTaskBoard" id="singleTaskBoard${responseToJson.title}" draggable="true" onclick="toggleNoteDetails('${allTasksIndex}')" ondragstart="dragstartHandler(event)">
            <div class="category" id="divCategory${responseToJson.title}"></div>
            <div class="textSingleTask">
                <p class="titleSingleCard">${responseToJson.title}</p>
                <p class="descriptionSingleCard">${responseToJson.description}</p>
            </div>
            <div class="subtasksSingleCard" id="${responseToJson.title}"></div>
            <div class="bottomDivSingleCard">
                <div class="addedContactsSingleCard" id="contacts${responseToJson.title}"></div>
                <div id="prioImg${responseToJson.title}" class="prioImg"></div>
            </div>
            <button class="moveTaskButton" onclick="moveButtonClick(event, '${responseToJson.title}')">→</button>
            <div class="moveOptions d-none" id="moveOptions${responseToJson.title}">
                <button onclick="moveTask('${responseToJson.title}', 'ToDoTasks')">To Do</button>
                <button onclick="moveTask('${responseToJson.title}', 'InProgressTasks')">In Progress</button>
                <button onclick="moveTask('${responseToJson.title}', 'AwaitFeedbackTasks')">Await Feedback</button>
                <button onclick="moveTask('${responseToJson.title}', 'DoneTasks')">Done</button>
            </div>
        </span>`;
}

function moveButtonClick (event, title){
    event.stopPropagation();
    document.getElementById(`moveOptions${title}`).classList.toggle("d-none");
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
    const container = document.getElementById(`contacts${title}`);
    const maxVisibleContacts = 3; // Ändere die Anzahl der sichtbaren Kontakte auf 3
    const extraContacts = currentTask.assigned.length - maxVisibleContacts;

    if (index < maxVisibleContacts) {
        container.innerHTML += `<p class="addedUserInitials" style="background-color: ${currentTask.assignedBgColor[index]};">${firstInitial}${lastInitial}</p>`;
    }

    if (index === maxVisibleContacts && extraContacts > 0) {
        container.innerHTML += `<p class="addedUserInitials">+${extraContacts}</p>`;
    }
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
                document.getElementById("detailSubtasks").innerHTML += `<div class="subtaskDetailDiv"><input type="checkbox" id="checkboxSubtask${specificObject.subtasks.addedTask[indexAddedSubtasks]}" checked onclick="subtaskSelected('${allTasksIndex}' , '${indexAddedSubtasks}')">
            <label for="checkboxSubtask${specificObject.subtasks.addedTask[indexAddedSubtasks]}">${specificObject.subtasks.addedTask[indexAddedSubtasks]}</label></div>`
            } else {
                document.getElementById("detailSubtasks").innerHTML += `<div class="subtaskDetailDiv"><input type="checkbox" id="checkboxSubtask${specificObject.subtasks.addedTask[indexAddedSubtasks]}" onclick="subtaskSelected('${allTasksIndex}' , '${indexAddedSubtasks}')">
            <label for="checkboxSubtask${specificObject.subtasks.addedTask[indexAddedSubtasks]}">${specificObject.subtasks.addedTask[indexAddedSubtasks]}</label></div>`
            }
        }
    }
    document.getElementById("detailBtns").innerHTML = `
    <button onclick="deleteTaskFromBoard('${allTasksIndex}')" class="flex"> <img src="./assets/icons/delete.svg" alt="">Delete</button>
            <div class="detailBtnSeperator"></div>
            <button onclick="editTaskInBoard('${allTasksIndex}')" class="flex"><img src="./assets/icons/pencilSmall.svg" alt="">Edit</button>`
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
async function renderNoteToEdit(specificObject, allTasksIndex) {
    // Ensure the div is rendered first
    await new Promise(resolve => setTimeout(resolve, 100));

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
    <button class="btnGray" onclick="updateTask('${allTasksIndex}')">Update Task</button>`
}

/**
 * Cancels the task edit and closes the task editor section.
 */
function cancelEdit() {
    document.getElementById("AddTaskSection").classList.add("d-none");
    document.getElementById("taskDetailSection").classList.add("d-none");
    return;
}