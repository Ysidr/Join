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
    document.getElementById(name).selected = true

    getInitialsOfAddedUser()
}

function getInitialsOfAddedUser() {
    document.getElementById("showAddedContacts").innerHTML = "";
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

function clearInuptField() {
    document.getElementById("subtaskInput").value = "";
}

