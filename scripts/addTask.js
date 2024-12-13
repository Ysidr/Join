let firstLetters = [];
let selectedContatct = [];
let selectedContatctBgColor = [];
let addedSubtasks = [];
let addedSubtaskDone = [];

function initAddTask() {
    clearInputs()
}
async function getContacts() {
    resetContactList()
    let response = await fetch(BASE_URL + "Contacts.json");
    responseToJson = await response.json();
    firstLetters = Object.keys(responseToJson);
    for (let indexContactLetters = 0; indexContactLetters < firstLetters.length; indexContactLetters++) {
        await getContactsWithThisLetter(indexContactLetters);
    }
    document.getElementById("openContactsDiv").classList.toggle("d-none")
}

async function getContactsWithThisLetter(indexContactLetters) {
    let response = await fetch(BASE_URL + `Contacts/${firstLetters[indexContactLetters]}.json`);
    responseToJson = await response.json();
    for (let indexContactWithLetter = 0; indexContactWithLetter < responseToJson.length; indexContactWithLetter++) {
        renderContact(responseToJson, indexContactWithLetter);
    }
}

async function createTask() {
    toDoTaskCount++;
    getNewTaskInfo()
    await putTaskToServer();
    await setToDoTaskCount();
    resetAllVars();
    reloadPage();
}

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

function getAddedContacts() {
    if (selectedContatct.length != 0) {
        newAssigned = selectedContatct;
        newAssignedBgColor = selectedContatctBgColor;
        return newAssigned
    } else {
        newAssigned = "";
        newAssignedBgColor = "";
        return newAssigned
    }
}

function getPriority() {
    if (document.getElementById("IDhigh").checked) {
        newPrio = "high";
        return newPrio;
    } else if (document.getElementById("IDmedium").checked) {
        newPrio = "medium";
        return newPrio;
    } else {
        newPrio = "low";
        return newPrio;
    }
}

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
    };
    return newTaskData;
}

async function putTaskToServer() {
    let response = await fetch(BASE_URL + `Tasks/ToDo/${toDoTaskCount}.json`,
        {
            method: "put",
            header: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTaskData)
        });
    return responseToJson = await response.json();
}

async function setToDoTaskCount() {
    let response = await fetch(BASE_URL + `TaskCounts/ToDoTaskCount/.json`,
        {
            method: "put",
            header: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(toDoTaskCount)
        });
    return responseToJson = await response.json();
}

function contactSelected(name, bgColor) {
    if (selectedContatct.includes(name)) {
        let index = selectedContatct.indexOf(name)
        selectedContatct.splice(index, 1);
        selectedContatctBgColor.splice(index, 1);
        console.log(selectedContatct);

    } else {
        selectedContatct.push(name);
        selectedContatctBgColor.push(bgColor);
        console.log(selectedContatct);

    }
    document.getElementById(name).classList.toggle("selectedContact")
    document.getElementById("showAddedContacts").innerHTML = "";
    getInitialsOfAddedUser()
}
function getInitialsOfAddedUser() {
    for (let index = 0; index < selectedContatct.length; index++) {
        const nameParts = selectedContatct[index].split(' ');
        const firstInitial = nameParts[0]?.charAt(0).toUpperCase();
        const lastInitial = nameParts[1]?.charAt(0).toUpperCase();
        document.getElementById("showAddedContacts").innerHTML += `<p class= "addedUserInitials" style="background-color: ${selectedContatctBgColor[index]};" >${firstInitial}${lastInitial}</p>`
    }
}


function resetAllVars() {
    firstLetters = [];
    selectedContatct = [];
    addedSubtasks = [];
}

async function reloadPage() {
    document.getElementById("main-content").innerHTML = `<div class="addedTaskToBoardBtn"><p>Task added to board</p> <img src="./assets/icons/Vector.svg" alt=""></div>`
    console.log(1);
    await new Promise(r => setTimeout(r, 2000));
    loadPage('board')
}

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
}

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

// Funktion zum Löschen von Subtasks
function deleteSubtask(subtaskName) {
    let index = addedSubtasks.indexOf(subtaskName);
    addedSubtasks.splice(index, 1);
    addedSubtaskDone.splice(index, 1);
    renderAllSubtasks();
}

// Funktion zum Bearbeiten von Subtasks
function editSubtask(subtaskContainer, oldName) {
    let editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = oldName;
    editInput.classList.add('editSubtaskInput');

    subtaskContainer.innerHTML = "";

    let saveButton = document.createElement('button');
    saveButton.textContent = 'Speichern';
    saveButton.onclick = () => saveSubtask(subtaskContainer, editInput.value, oldName);

    subtaskContainer.appendChild(editInput);
    subtaskContainer.appendChild(saveButton);
}

// Funktion zum Speichern eines bearbeiteten Subtasks
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

// Funktion zum Neurendern aller Subtasks
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


function clearInuptField() {
    document.getElementById("subtaskInput").value = "";
}

