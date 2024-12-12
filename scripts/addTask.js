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
    let subtaskText = `<p class="addedSubtask">- ${subtaskName}</p>`;
    let deleteImg = `<img src="./assets/icons/delete.svg" alt="Delete" class="delete-icon" onclick="deleteSubtask('${subtaskName}')">`;
    let editImg = `<img src="./assets/icons/pencilSmall.svg" alt="Edit" class="edit-icon">`;
    subtaskContainer.innerHTML = subtaskText + deleteImg + editImg;
    document.getElementById("addedSubtasks").appendChild(subtaskContainer);
    addedSubtasks.push(subtaskName);
    addedSubtaskDone.push(false)
    document.getElementById("subtaskInput").value = "";
}

function deleteSubtask(subtaskName) {
    let index = addedSubtasks.indexOf(subtaskName);
    addedSubtasks.splice(index, 1);
    addedSubtaskDone.splice(index, 1);
    renderallSubtasks()
}

function renderallSubtasks() {
    document.getElementById("addedSubtasks").innerHTML = "";
    for (let indexAllSubtasks = 0; indexAllSubtasks < addedSubtasks.length; indexAllSubtasks++) {
        let subtaskContainer = document.createElement('div');
        subtaskContainer.classList.add('addedSubtaskContainer');
        subtaskContainer.id = `subtask-${addedSubtasks[indexAllSubtasks]}`;
        let subtaskText = `<p class="addedSubtask">- ${addedSubtasks[indexAllSubtasks]}</p>`;
        let deleteImg = `<img src="./assets/icons/delete.svg" alt="Delete" class="delete-icon" onclick="deleteSubtask('${addedSubtasks[indexAllSubtasks]}')">`;
        let editImg = `<img src="./assets/icons/pencilSmall.svg" alt="Edit" class="edit-icon">`;
        subtaskContainer.innerHTML = subtaskText + deleteImg + editImg;
        document.getElementById("addedSubtasks").appendChild(subtaskContainer);

    }
}

function clearInuptField() {
    document.getElementById("subtaskInput").value = "";
}

