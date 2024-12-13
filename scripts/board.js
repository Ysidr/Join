let currentlyRenderingTasks = "";
let allCurrentTasksObj = {};
let currentSearchInBoard = "";
let taskFieldIndexOfMoved = 0;
let taskIndexOfMoved = 0;


async function initBoards() {
    await getToDoTasks();
}


async function addDNone(id) {
    if (id == `taskDetailSection`) {
        await putAllTasksToServer()
    }
    document.getElementById(id).classList.add("d-none")
}


async function putAllTasksToServer() {
    let response = await fetch(BASE_URL + `Tasks.json`,
        {
            method: "put",
            header: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(allCurrentTasksObj)
        });
    return responseToJson = await response.json();
}

async function getToDoTasks() {
    let response = await fetch(BASE_URL + `Tasks.json`);
    responseToJson = await response.json();
    allCurrentTasksObj = responseToJson;
    for (let indexTaskFields = 0; indexTaskFields < Object.keys(responseToJson).length; indexTaskFields++) {
        currentlyRenderingTasks = Object.keys(responseToJson)[indexTaskFields];
        document.getElementById(currentlyRenderingTasks + "Tasks").innerHTML = "";
        for (let indexTaskCount = 1; indexTaskCount < Object.values(responseToJson)[indexTaskFields].length; indexTaskCount++) {
            let currentTask = Object.values(Object.values(responseToJson)[indexTaskFields])[indexTaskCount];
            let taskTitle = currentTask.title.toLocaleLowerCase();
            let searchTask = currentSearchInBoard.toLocaleLowerCase();
            if (currentSearchInBoard === "" || taskTitle.includes(searchTask)) {
                renderTasksinBoard(currentTask, indexTaskFields, indexTaskCount);
                checkForSubtasks(currentTask);
                checkForCategory(currentTask);
                checkForImportance(currentTask);
                checkForAddedUsers(currentTask);
            }
        }
    }
}


function checkForAddedUsers(getCurrentTask) {
    if (getCurrentTask.assigned.length != 0) {
        for (let indexAddedUsers = 0; indexAddedUsers < getCurrentTask.assigned.length; indexAddedUsers++) {
            getInitialsOfAddedUsers(getCurrentTask, indexAddedUsers, getCurrentTask.title)
        }
    }
}

function getInitialsOfAddedUsers(currentTask, index, title) {
    if (!currentTask.assigned[index]) return 'G';
    const nameParts = currentTask.assigned[index].split(' ');
    const firstInitial = nameParts[0]?.charAt(0).toUpperCase();
    const lastInitial = nameParts[1]?.charAt(0).toUpperCase();
    renderInitials(firstInitial, lastInitial, title, currentTask, index);

}

function checkForImportance(getCurrentTask) {
    if (getCurrentTask.priority == "high") {
        document.getElementById(`prioImg${getCurrentTask.title}`).innerHTML = `<img src="./assets/icons/Priority symbol high.svg" alt="">`
    } else if (getCurrentTask.priority == "medium") {
        document.getElementById(`prioImg${getCurrentTask.title}`).innerHTML = `<img src="./assets/icons/Priority symbol medium.svg" alt="">`
    } else {
        document.getElementById(`prioImg${getCurrentTask.title}`).innerHTML = `<img src="./assets/icons/Priority symbol low.svg" alt="">`
    }
}


function checkForCategory(getCurrentTask) {
    if (getCurrentTask.category == "technical") {
        renderCategoryTechnical(getCurrentTask);
        document.getElementById(`category${getCurrentTask.title}`).classList.add("lightBlueBackground");
    } else {
        renderCategoryUser(getCurrentTask);
        document.getElementById(`category${getCurrentTask.title}`).classList.add("blueBackground");
    }
}

function checkForSubtasks(getCurrentTask) {
    if (getCurrentTask.subtasks != undefined) {
        renderSubtasks(getCurrentTask);
    }
}

//Detailed Window functions

function toggleNoteDetails(indexTaskFields, indexTaskCount) {
    document.getElementById("taskDetailSection").classList.toggle("d-none");
    renderDetails(indexTaskFields, indexTaskCount);
}

function subtaskSelected(indexTaskFields, indexTaskCount, indexAddedSubtasks) {
    let responseToJson = Object.values(Object.values(allCurrentTasksObj)[indexTaskFields])[indexTaskCount];
    if (responseToJson.subtasks.subtasksDone[indexAddedSubtasks] == true) {
        responseToJson.subtasks.subtasksDone[indexAddedSubtasks] = false;
        renderSubtasks(responseToJson);
    } else {
        responseToJson.subtasks.subtasksDone[indexAddedSubtasks] = true;
        renderSubtasks(responseToJson);
    }
}

//Search for Tasks


function searchTasksInBoard() {
    currentSearchInBoard = document.getElementById("boardHeaderSearch").value;
    getToDoTasks()
    document.getElementById("boardHeaderSearch").value = "";

}

function dragstartHandler(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
}

function dragoverHandler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
}

async function dropHandler(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text/plain");
    const droppedElement = document.getElementById(data);
    let changedToID = ev.currentTarget.id.slice(0, ev.currentTarget.id.length - 5)
    ev.currentTarget.appendChild(droppedElement);
    await changeToDropOffJson(data, changedToID)
}

async function changeToDropOffJson(data, changedToID) {
    let titleMoved = data.toString()
    titleMoved = titleMoved.slice(15)
    getCurrentMovedTask(titleMoved, changedToID)


}

async function getCurrentMovedTask(titleMoved, changedToID) {
    for (let indexTaskFields = 0; indexTaskFields < Object.keys(allCurrentTasksObj).length; indexTaskFields++) {
        for (let indexTaskCount = 1; indexTaskCount < Object.values(allCurrentTasksObj)[indexTaskFields].length; indexTaskCount++) {
            if (Object.values(Object.values(allCurrentTasksObj)[indexTaskFields])[indexTaskCount].title == titleMoved) {
                let currentChangedObject = Object.values(Object.values(allCurrentTasksObj)[indexTaskFields])[indexTaskCount]
                taskFieldIndexOfMoved = indexTaskFields;
                taskIndexOfMoved = indexTaskCount;
                changeTaskFields(currentChangedObject, changedToID)
            }
        }
    }
}

async function changeTaskFields(currentChangedObject, changedToID) {
    Object.values(allCurrentTasksObj)[taskFieldIndexOfMoved].splice(taskIndexOfMoved, 1);
    if (allCurrentTasksObj[changedToID] == undefined) {
        allCurrentTasksObj[changedToID] = [null];
    }
    allCurrentTasksObj[changedToID].push(currentChangedObject)
    await putAllTasksToServer()
    resetAllBoards();
    await getToDoTasks();
    await updateAndUploadAllTaskCounts()
}


function addTaskInBoard() {
    // Clear any existing content in the task section
    const taskSection = document.getElementById("AddTaskInBoardMain");
    taskSection.innerHTML = '';

    // Dynamisch HTML laden
    fetch('./addTask.html')
        .then(response => response.text())
        .then(html => {
            taskSection.innerHTML = html;

            // Dynamisch CSS einfügen
            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = './styles/addTask.css';
            document.head.appendChild(cssLink);

            // Dynamisch JS einfügen
            const script = document.createElement('script');
            script.src = './scripts/addTask.js';
            document.body.appendChild(script);

            // Anzeige der AddTaskSection sicherstellen
            document.getElementById("AddTaskSection").classList.remove("d-none");
        })
        .catch(err => console.error('Error loading addTask.html:', err));
}


async function deleteTaskFromBoard(indexTaskFields, indexTaskCount) {
    Object.values(allCurrentTasksObj)[indexTaskFields].splice(indexTaskCount, 1);
    await addDNone("taskDetailSection");
    resetAllBoards();
    await getToDoTasks();
    await updateAndUploadAllTaskCounts()

}

async function updateAndUploadAllTaskCounts() {
    await updateAllTaskCounts()
    await uploadAllTaskCounts()
}

async function uploadAllTaskCounts() {
    await setToDoTaskCount()
    await setAwaitFeedbackTaskCount()
    await setDoneTaskCount()
    await setInProgressTaskCount()
}

async function setAwaitFeedbackTaskCount() {
    let response = await fetch(BASE_URL + `TaskCounts/AwaitFeedbackTaskCount/.json`,
        {
            method: "put",
            header: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(awaitFeedbackTaskCount)
        });
    return responseToJson = await response.json();
}

async function setDoneTaskCount() {
    let response = await fetch(BASE_URL + `TaskCounts/DoneTaskCount/.json`,
        {
            method: "put",
            header: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(doneTaskCount)
        });
    return responseToJson = await response.json();
}

async function setInProgressTaskCount() {
    let response = await fetch(BASE_URL + `TaskCounts/InProgressTaskCount/.json`,
        {
            method: "put",
            header: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(inProgressTaskCount)
        });
    return responseToJson = await response.json();
}

async function editTaskInBoard(indexTaskFields, indexTaskCount) {
    await addTaskInBoard()
    await new Promise(r => setTimeout(r, 20));
    let objectAllTasks = Object.values(allCurrentTasksObj)[indexTaskFields];
    let specificObject = Object.values(objectAllTasks)[indexTaskCount];
    renderNoteToEdit(specificObject)
}

function renderNoteToEdit(specificObject, indexTaskFields, indexTaskCount) {
    document.getElementById("titleInput").value = specificObject.title;
    document.getElementById("descriptionInput").value = specificObject.description;
    document.getElementById("dateIput").value = specificObject.date;
    selectedContatct = specificObject.assigned;
    selectedContatctBgColor = specificObject.assignedBgColor;
    getInitialsOfAddedUser();
    document.getElementById(`ID${specificObject.priority}`).checked = true;
    addedSubtasks = specificObject.subtasks.addedTask
    addedSubtaskDone = specificObject.subtasks.subtasksDone
    renderAllSubtasks()
    document.getElementById("categorytSelector").value = `${specificObject.category}+Story`
    document.getElementById("addTaskBtn").innerHTML = `<button class="btnClear clearBtn" onclick="clearInputs()">Cancel</button>
    <button class="btnGray" onclick="updateTask(${indexTaskFields, indexTaskCount})">Update Task</button>`
    updateTask(indexTaskFields, indexTaskCount)
}

function updateTask(indexTaskFields, indexTaskCount) {
    getNewTaskInfo()
    allCurrentTasksObj[indexTaskFields].put(indexTaskCount, newTaskData)

}
