let currentlyRenderingTasks = "";
let allCurrentTasksObj = {};
let currentSearchInBoard = "";

async function initBoards() {
    await getToDoTasks();
}


function addDNone(id) {
    document.getElementById(id).classList.add("d-none")
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
    }else{
        responseToJson.subtasks.subtasksDone[indexAddedSubtasks] = true;
    renderSubtasks(responseToJson);
    }
}

//Search for Tasks


function searchTasksInBoard() {
    currentSearchInBoard = document.getElementById("boardHeaderSearch").value;
    getToDoTasks()
}

//drag and drop

function dragstartHandler(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id); // Setze die ID
    console.log("Dragging:", ev.target.id);
}

function dragoverHandler(ev) {
    ev.preventDefault(); // Erlaubt das Droppen
    ev.dataTransfer.dropEffect = "move";
}

function dropHandler(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text/plain");
    const droppedElement = document.getElementById(data);
    console.log("Dropped:", droppedElement, "Into:", ev.target.id);
    if (droppedElement) {
        ev.target.appendChild(droppedElement);
    }
}

