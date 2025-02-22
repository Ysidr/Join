addedSubtasks = [];
addedSubtaskDone = [];

/**
 * Initializes the task creation process by clearing the input fields.
 * @function initAddTask
 * @returns {void}
 */
function initAddTask() {
    clearInputs();
    setMinDate(); // Set the minimum date when initializing the task creation
}

/**
 * Sets the minimum date for the date input field to today's date.
 * @function setMinDate
 * @returns {void}
 */
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById("dateIput").setAttribute('min', today);
}

/**
 * Fetches the contacts from the server and organizes them by their first letter.
 * Resets the contact list before fetching.
 * @function getContacts
 * @returns {void}
 */
function getContacts() {
    resetContactList();
    fetch(BASE_URL + "Contacts.json")
        .then(response => response.json())
        .then(responseToJson => {
            firstLetters = Object.keys(responseToJson);
            firstLetters.forEach((letter, index) => getContactsWithThisLetter(index));
            const openContactsDiv = document.getElementById("openContactsDiv");
            if (openContactsDiv) {
                openContactsDiv.classList.toggle("d-none");
            }
        });
}

/**
 * Fetches and renders the contacts for a specific letter group.
 * @async
 * @function getContactsWithThisLetter
 * @param {number} indexContactLetters - The index of the letter group.
 * @returns {Promise<void>}
 */
async function getContactsWithThisLetter(indexContactLetters) {
    let response = await fetch(BASE_URL + `Contacts/${firstLetters[indexContactLetters]}.json`);
    responseToJson = await response.json();
    for (let indexContactWithLetter = 0; indexContactWithLetter < responseToJson.length; indexContactWithLetter++) {
        renderContact(responseToJson, indexContactWithLetter);
    }
}

/**
 * Creates a new task by gathering all the necessary information and saving it to the server.
 * Updates the task count and reloads the page.
 * @async
 * @function createTask
 * @returns {Promise<void>}
 */
async function createTask() {
    await updateTaskCount();
    TaskCount++
    getNewTaskInfo();
    await putTaskToServer();
    await setTaskCount();
    resetAllVars();
    reloadPage();
}

/**
 * Gathers the information for a new task from the input fields.
 * @function getNewTaskInfo
 * @returns {Object} The gathered task data.
 */
function getNewTaskInfo() {
    let newTitle = document.getElementById("titleInput").value;
    let newDescription = document.getElementById("descriptionInput").value;
    let newDate = document.getElementById("dateIput").value;
    getCategory();
    getPriority();
    getAddedContacts();
    gatherAllTaskData(newTitle, newDescription, newDate);
    return newTaskData;
}

/**
 * Retrieves the selected contacts for the task.
 * @function getAddedContacts
 * @returns {Array} An array of selected contacts or an empty string if none are selected.
 */
function getAddedContacts() {
    if (selectedContatct.length != 0) {
        newAssigned = selectedContatct;
        newAssignedBgColor = selectedContatctBgColor;
        return newAssigned;
    } else {
        newAssigned = "";
        newAssignedBgColor = "";
        return newAssigned;
    }
}

/**
 * Retrieves the selected priority for the task.
 * @function getPriority
 * @returns {string} The priority of the task, which could be 'high', 'medium', or 'low'.
 */
function getPriority() {
    if (document.getElementById("IDhigh").checked) {
        newPrio = "high";
    } else if (document.getElementById("IDmedium").checked) {
        newPrio = "medium";
    } else {
        newPrio = "low";
    }
    return newPrio;
}

/**
 * Retrieves the selected category for the task.
 * @function getCategory
 * @returns {string} The category of the task, which could be 'technical' or 'user'.
 */
function getCategory() {
    if (document.getElementById("categorytSelector").value == "technicalTask") {
        newCategory = "technical";
        return newCategory;
    } else if (document.getElementById("categorytSelector").value == "userStory") {
        newCategory = "user";
        return newCategory;
    } else {
        selectCategoryErr();
    }
}

/**
 * Gathers all the data for the new task into an object.
 * @function gatherAllTaskData
 * @param {string} newTitle - The title of the new task.
 * @param {string} newDescription - The description of the new task.
 * @param {string} newDate - The due date of the new task.
 * @returns {Object} The task data object.
 */
function gatherAllTaskData(newTitle, newDescription, newDate) {
    newTaskData = {
        "title": newTitle,
        "description": newDescription,
        "date": newDate,
        "assigned": newAssigned,
        "assignedBgColor": newAssignedBgColor,
        "priority": newPrio,
        "category": newCategory,
        "subtasks": {
            "addedTask": addedSubtasks,
            "subtasksDone": addedSubtaskDone,
        },
        "progress": "ToDo"
    };
    return newTaskData;
}

/**
 * Sends the new task data to the server and stores it.
 * @async
 * @function putTaskToServer
 * @returns {Promise<Object>} The response from the server after storing the task.
 */
async function putTaskToServer() {
    let response = await fetch(BASE_URL + `Tasks/${TaskCount}.json`, {
        method: "put",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newTaskData)
    });
    return responseToJson = await response.json();
}

/**
 * Updates the task count for the 'ToDo' tasks on the server.
 * @async
 * @function setToDoTaskCount
 * @returns {Promise<Object>} The response from the server after updating the task count.
 */
async function setTaskCount() {
    let response = await fetch(BASE_URL + `TaskCounts/TaskCount/.json`, {
        method: "put",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(TaskCount)
    });
    return responseToJson = await response.json();
}

/**
 * Toggles the selection of a contact. Adds or removes the contact from the selected list.
 * @function contactSelected
 * @param {string} name - The name of the selected contact.
 * @param {string} bgColor - The background color of the contact.
 * @returns {void}
 */
function contactSelected(name, bgColor) {
    if (selectedContatct.includes(name)) {
        let index = selectedContatct.indexOf(name);
        selectedContatct.splice(index, 1);
        selectedContatctBgColor.splice(index, 1);
    } else {
        selectedContatct.push(name);
        selectedContatctBgColor.push(bgColor);
    }
    document.getElementById(name).classList.toggle("selectedContact");
    getInitialsOfAddedUser();
}

/**
 * Updates the display of selected contacts' initials.
 * @function getInitialsOfAddedUser
 * @returns {void}
 */
function getInitialsOfAddedUser() {
    const container = document.getElementById("showAddedContacts");
    container.innerHTML = "";
    const maxVisibleContacts = 4;
    const extraContacts = selectedContatct.length - maxVisibleContacts;

    for (let index = 0; index < Math.min(selectedContatct.length, maxVisibleContacts); index++) {
        const nameParts = selectedContatct[index].split(' ');
        const firstInitial = nameParts[0]?.charAt(0).toUpperCase();
        const lastInitial = nameParts[1]?.charAt(0).toUpperCase();
        container.innerHTML += `<p class="addedUserInitials" style="background-color: ${selectedContatctBgColor[index]};">${firstInitial}${lastInitial}</p>`;
    }

    if (extraContacts > 0) {
        container.innerHTML += `<p class="addedUserInitials">+${extraContacts}</p>`;
    }
}

/**
 * Resets all the variables related to task creation.
 * @function resetAllVars
 * @returns {void}
 */
function resetAllVars() {
    firstLetters = [];
    selectedContatct = [];
    addedSubtasks = [];
}

/**
 * Reloads the page after a task is added to the board.
 * @async
 * @function reloadPage
 * @returns {Promise<void>}
 */
async function reloadPage() {
    document.getElementById("main-content").innerHTML = `<div class="addedTaskToBoardBtn"><p>Task added to board</p> <img src="./assets/icons/Vector.svg" alt=""></div>`;
    await new Promise(r => setTimeout(r, 2000));
    loadPage('board');
}

/**
 * Deletes a subtask from the task list.
 * @function deleteSubtask
 * @param {string} subtaskName - The name of the subtask to be deleted.
 * @returns {void}
 */
function deleteSubtask(subtaskName) {
    let index = addedSubtasks.indexOf(subtaskName);
    addedSubtasks.splice(index, 1);
    addedSubtaskDone.splice(index, 1);
    renderAllSubtasks();
}

/**
 * Edits an existing subtask by allowing the user to change its name.
 * @function editSubtask
 * @param {HTMLElement} subtaskContainer - The container where the subtask is displayed.
 * @param {string} oldName - The current name of the subtask.
 * @returns {void}
 */
function editSubtask(subtaskContainer, oldName) {
    let editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = oldName;
    editInput.classList.add('editSubtaskInput');
    subtaskContainer.innerHTML = "";
    let saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.onclick = () => saveSubtask(subtaskContainer, editInput.value, oldName);
    subtaskContainer.appendChild(editInput);
    subtaskContainer.appendChild(saveButton);
}

/**
 * Clears the input field for adding a subtask.
 * @function clearInuptField
 * @returns {void}
 */
function clearInuptField() {
    document.getElementById("subtaskInput").value = "";
    document.getElementById("clearSubtaskBtn").classList.add('d-none');
}

/**
 * Validates the task form fields before creating a new task.
 * @function validateTask
 * @returns {void}
 */
function validateTask() {
    let isValid = true;
    isValid &= validateTitle("titleInput");
    isValid &= validateDate("dateIput");
    isValid &= validateCategory("categorytSelector");

    if (isValid) {
        createTask();
    }
}

/**
 * Validates the title input field.
 * @function validateTitle
 * @param {string} inputId - The ID of the title input field.
 * @returns {boolean} True if the title is valid, false otherwise.
 */
function validateTitle(inputId) {
    const titleInput = document.getElementById(inputId);
    const titleValidation = document.getElementById("titleValidationMessage");
    if (!titleInput.value.trim()) {
        titleValidation.textContent = "* Please enter a title";
        titleValidation.style.color = "red";
        return false;
    } else {
        titleValidation.textContent = "*";
        titleValidation.style.color = ""; // zurück zur ursprünglichen Farbe
        return true;
    }
}

/**
 * Validates the date input field.
 * @function validateDate
 * @param {string} inputId - The ID of the date input field.
 * @returns {boolean} True if the date is valid, false otherwise.
 */
function validateDate(inputId) {
    const dateInput = document.getElementById(inputId);
    const dateValidation = document.getElementById("dateValidationMessage");
    const today = new Date().toISOString().split('T')[0];
    
    if (!dateInput.value || dateInput.value < today) {
        dateValidation.textContent = "* Please select a future date";
        dateValidation.style.color = "red";
        return false;
    } else {
        dateValidation.textContent = "*";
        dateValidation.style.color = "";
        return true;
    }
}

/**
 * Validates the category input field.
 * @function validateCategory
 * @param {string} inputId - The ID of the category input field.
 * @returns {boolean} True if the category is valid, false otherwise.
 */
function validateCategory(inputId) {
    const categoryInput = document.getElementById(inputId);
    const categoryValidation = document.getElementById("categoryValidationMessage");
    if (categoryInput.value !== "technicalTask" && categoryInput.value !== "userStory") {
        categoryValidation.textContent = "* Please select Technical Task or User Story";
        categoryValidation.style.color = "red";
        return false;
    } else {
        categoryValidation.textContent = "*";
        categoryValidation.style.color = "";
        return true;
    }
}

function toggleAddSubtaskButton() {
    const input = document.getElementById('subtaskInput');
    const addButton = document.getElementById('addSubtaskButton');
    
    addButton.classList.toggle('d-none', !input.value.trim());
}

function toggleClearButton() {
    const input = document.getElementById('subtaskInput');
    const clearButton = document.getElementById('clearSubtaskBtn');    
    clearButton.classList.toggle('d-none', !input.value.trim());
}

document.addEventListener('click', function(event) {
    const openContactsDiv = document.getElementById('openContactsDiv');
    const contactSelector = document.getElementById('contactSelector');
    if (openContactsDiv && contactSelector && !contactSelector.contains(event.target) && !openContactsDiv.contains(event.target)) {
        openContactsDiv.classList.add('d-none');
    }
});