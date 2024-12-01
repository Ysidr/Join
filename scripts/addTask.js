
async function createTask() {
    toDoTaskCount++;
    getNewTaskInfo()
    await putTaskToServer();
    await setToDoTaskCount();
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
    if (document.getElementById("contactSelector").value != "basicText") {
        newAssigned = document.getElementById("contactSelector").value;
        return newAssigned
    }else{
        newAssigned = "";
        return newAssigned
    }
}

function getPriority() {
    if (document.getElementById("high").checked) {
        newPrio = "high";
        return newPrio;
    } else if (document.getElementById("medium").checked) {
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
        "priority": newPrio,
        "category": newCategory,
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