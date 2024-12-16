let currentlyRenderingTasks = "";
let allCurrentTasksObj = {};
let currentSearchInBoard = "";
let taskFieldIndexOfMoved = 0;
let taskIndexOfMoved = 0;


/**
 * Initializes the task boards by fetching the To-Do tasks.
 * @async
 */
async function initBoards() {
    await getToDoTasks();
}

/**
 * Hides an HTML element with the specified id.
 * @param {string} id - The id of the element to be hidden.
 * @async
 */
async function addDNone(id) {
    if (id == `taskDetailSection`) {
        await putAllTasksToServer();
    }
    document.getElementById(id).classList.add("d-none");
}

/**
 * Sends the current task data to the server.
 * @async
 * @returns {Promise<Object>} The server's response.
 */
async function putAllTasksToServer() {
    let response = await fetch(BASE_URL + `Tasks.json`, {
        method: "put",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(allCurrentTasksObj)
    });
    return responseToJson = await response.json();
}

/**
 * Fetches the tasks marked as 'To-Do' and renders them on the board.
 * @async
 */
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
                checkEverythingInTask(currentTask, indexTaskFields, indexTaskCount);
            }
        }
    }
}

/**
 * Performs checks on various attributes of a task (subtasks, category, importance, assigned users) and renders them.
 * @param {Object} currentTask - The task object to be checked.
 * @param {number} indexTaskFields - The index of the task field.
 * @param {number} indexTaskCount - The index of the task count.
 */
function checkEverythingInTask(currentTask, indexTaskFields, indexTaskCount) {
    renderTasksinBoard(currentTask, indexTaskFields, indexTaskCount);
    checkForSubtasks(currentTask);
    checkForCategory(currentTask);
    checkForImportance(currentTask);
    checkForAddedUsers(currentTask);
}

/**
 * Renders the initials of the users assigned to a task.
 * @param {Object} getCurrentTask - The task object containing assigned users.
 */
function checkForAddedUsers(getCurrentTask) {
    if (getCurrentTask.assigned.length !== 0) {
        for (let indexAddedUsers = 0; indexAddedUsers < getCurrentTask.assigned.length; indexAddedUsers++) {
            getInitialsOfAddedUsers(getCurrentTask, indexAddedUsers, getCurrentTask.title);
        }
    }
}

/**
 * Retrieves and renders the initials of an assigned user.
 * @param {Object} currentTask - The task object containing the assigned user.
 * @param {number} index - The index of the assigned user.
 * @param {string} title - The title of the task.
 */
function getInitialsOfAddedUsers(currentTask, index, title) {
    if (!currentTask.assigned[index]) return 'G';
    const nameParts = currentTask.assigned[index].split(' ');
    const firstInitial = nameParts[0]?.charAt(0).toUpperCase();
    const lastInitial = nameParts[1]?.charAt(0).toUpperCase();
    renderInitials(firstInitial, lastInitial, title, currentTask, index);
}

/**
 * Renders the priority of the task based on its importance level.
 * @param {Object} getCurrentTask - The task object to check the priority.
 */
function checkForImportance(getCurrentTask) {
    if (getCurrentTask.priority == "high") {
        document.getElementById(`prioImg${getCurrentTask.title}`).innerHTML = `<img src="./assets/icons/Priority symbol high.svg" alt="">`;
    } else if (getCurrentTask.priority == "medium") {
        document.getElementById(`prioImg${getCurrentTask.title}`).innerHTML = `<img src="./assets/icons/Priority symbol medium.svg" alt="">`;
    } else {
        document.getElementById(`prioImg${getCurrentTask.title}`).innerHTML = `<img src="./assets/icons/Priority symbol low.svg" alt="">`;
    }
}

/**
 * Renders the category of the task (either technical or user).
 * @param {Object} getCurrentTask - The task object to check the category.
 */
function checkForCategory(getCurrentTask) {
    if (getCurrentTask.category == "technical") {
        renderCategoryTechnical(getCurrentTask);
        document.getElementById(`category${getCurrentTask.title}`).classList.add("lightBlueBackground");
    } else {
        renderCategoryUser(getCurrentTask);
        document.getElementById(`category${getCurrentTask.title}`).classList.add("blueBackground");
    }
}

/**
 * Renders the subtasks of the task if any exist.
 * @param {Object} getCurrentTask - The task object containing the subtasks.
 */
function checkForSubtasks(getCurrentTask) {
    if (getCurrentTask.subtasks !== undefined) {
        renderSubtasks(getCurrentTask);
    }
}

/**
 * Toggles the visibility of the task detail section and renders the task details.
 * @param {number} indexTaskFields - The index of the task field.
 * @param {number} indexTaskCount - The index of the task count.
 */
function toggleNoteDetails(indexTaskFields, indexTaskCount) {
    document.getElementById("taskDetailSection").classList.toggle("d-none");
    renderDetails(indexTaskFields, indexTaskCount);
}

/**
 * Marks a subtask as selected or deselected.
 * @param {number} indexTaskFields - The index of the task field.
 * @param {number} indexTaskCount - The index of the task count.
 * @param {number} indexAddedSubtasks - The index of the subtask.
 */
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

/**
 * Searches for tasks within the board based on the provided search input.
 */
function searchTasksInBoard() {
    currentSearchInBoard = document.getElementById("boardHeaderSearch").value;
    getToDoTasks();
    document.getElementById("boardHeaderSearch").value = "";
}

/**
 * Handles the dragstart event when a task is being dragged.
 * @param {DragEvent} ev - The drag event.
 */
function dragstartHandler(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
}

/**
 * Handles the dragover event to allow dropping of tasks.
 * @param {DragEvent} ev - The drag event.
 */
function dragoverHandler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
}

/**
 * Handles the drop event when a task is dropped on a new board section.
 * @param {DragEvent} ev - The drop event.
 * @async
 */
async function dropHandler(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text/plain");
    const droppedElement = document.getElementById(data);
    let changedToID = ev.currentTarget.id.slice(0, ev.currentTarget.id.length - 5);
    ev.currentTarget.appendChild(droppedElement);
    await changeToDropOffJson(data, changedToID);
}

/**
 * Updates the task's position based on where it was dropped.
 * @async
 * @param {string} data - The ID of the task being moved.
 * @param {string} changedToID - The ID of the target section where the task is dropped.
 */
async function changeToDropOffJson(data, changedToID) {
    let titleMoved = data.toString();
    titleMoved = titleMoved.slice(15);
    getCurrentMovedTask(titleMoved, changedToID);
}

/**
 * Retrieves the task being moved and updates its position in the data.
 * @async
 * @param {string} titleMoved - The title of the moved task.
 * @param {string} changedToID - The ID of the target section where the task is dropped.
 */
async function getCurrentMovedTask(titleMoved, changedToID) {
    for (let indexTaskFields = 0; indexTaskFields < Object.keys(allCurrentTasksObj).length; indexTaskFields++) {
        for (let indexTaskCount = 1; indexTaskCount < Object.values(allCurrentTasksObj)[indexTaskFields].length; indexTaskCount++) {
            if (Object.values(Object.values(allCurrentTasksObj)[indexTaskFields])[indexTaskCount].title == titleMoved) {
                let currentChangedObject = Object.values(Object.values(allCurrentTasksObj)[indexTaskFields])[indexTaskCount];
                taskFieldIndexOfMoved = indexTaskFields;
                taskIndexOfMoved = indexTaskCount;
                changeTaskFields(currentChangedObject, changedToID);
            }
        }
    }
}

/**
 * Updates the task data after it has been moved to a new section.
 * @async
 * @param {Object} currentChangedObject - The task object to be updated.
 * @param {string} changedToID - The target section ID where the task is dropped.
 */
async function changeTaskFields(currentChangedObject, changedToID) {
    Object.values(allCurrentTasksObj)[taskFieldIndexOfMoved].splice(taskIndexOfMoved, 1);
    if (allCurrentTasksObj[changedToID] == undefined) {
        allCurrentTasksObj[changedToID] = [null];
    }
    allCurrentTasksObj[changedToID].push(currentChangedObject);
    await putAllTasksToServer();
    resetAllBoards();
    await getToDoTasks();
    await updateAndUploadAllTaskCounts();
}

/**
 * Adds a new task to the board by displaying the task creation form.
 */
function addTaskInBoard() {
    const taskSection = document.getElementById("AddTaskInBoardMain");
    taskSection.innerHTML = '';
    selectedContatct = [];
    selectedContatctBgColor = [];

    fetch('./addTask.html')
        .then(response => response.text())
        .then(html => {
            taskSection.innerHTML = html;
            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = './styles/addTask.css';
            document.head.appendChild(cssLink);
            const script = document.createElement('script');
            script.src = './scripts/addTask.js';
            document.body.appendChild(script);
            document.getElementById("AddTaskSection").classList.remove("d-none");
        })
        .catch(err => console.error('Error loading addTask.html:', err));
}

/**
 * Deletes a task from the board.
 * @async
 * @param {number} indexTaskFields - The index of the task field.
 * @param {number} indexTaskCount - The index of the task count.
 */
async function deleteTaskFromBoard(indexTaskFields, indexTaskCount) {
    Object.values(allCurrentTasksObj)[indexTaskFields].splice(indexTaskCount, 1);
    await addDNone("taskDetailSection");
    resetAllBoards();
    await getToDoTasks();
    await updateAndUploadAllTaskCounts()

}

/**
 * Updates and uploads all task counts, including counts for To-Do, Awaiting Feedback, Done, and In Progress tasks.
 * @async
 */
async function updateAndUploadAllTaskCounts() {
    await updateAllTaskCounts();
    await uploadAllTaskCounts();
}

/**
 * Uploads the task counts for To-Do, Awaiting Feedback, Done, and In Progress categories to the server.
 * @async
 */
async function uploadAllTaskCounts() {
    await setToDoTaskCount();
    await setAwaitFeedbackTaskCount();
    await setDoneTaskCount();
    await setInProgressTaskCount();
}

/**
 * Sets the count of tasks in the "Awaiting Feedback" category and uploads it to the server.
 * @async
 * @returns {Promise<Object>} The response from the server after the PUT request.
 */
async function setAwaitFeedbackTaskCount() {
    let response = await fetch(BASE_URL + `TaskCounts/AwaitFeedbackTaskCount/.json`, {
        method: "put",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(awaitFeedbackTaskCount),
    });
    return responseToJson = await response.json();
}

/**
 * Sets the count of tasks in the "Done" category and uploads it to the server.
 * @async
 * @returns {Promise<Object>} The response from the server after the PUT request.
 */
async function setDoneTaskCount() {
    let response = await fetch(BASE_URL + `TaskCounts/DoneTaskCount/.json`, {
        method: "put",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(doneTaskCount),
    });
    return responseToJson = await response.json();
}

/**
 * Sets the count of tasks in the "In Progress" category and uploads it to the server.
 * @async
 * @returns {Promise<Object>} The response from the server after the PUT request.
 */
async function setInProgressTaskCount() {
    let response = await fetch(BASE_URL + `TaskCounts/InProgressTaskCount/.json`, {
        method: "put",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(inProgressTaskCount),
    });
    return responseToJson = await response.json();
}

/**
 * Updates the task information with the new data.
 * @param {number} indexTaskFields - The index of the task category.
 * @param {number} indexTaskCount - The index of the specific task within the category.
 */
function updateTask(indexTaskFields, indexTaskCount) {
    getNewTaskInfo();
    allCurrentTasksObj[indexTaskFields].put(indexTaskCount, newTaskData);
}

/**
 * Opens the task editor to edit the details of a specific task.
 * @async
 * @param {number} indexTaskFields - The index of the task category.
 * @param {number} indexTaskCount - The index of the specific task within the category.
 */
async function editTaskInBoard(indexTaskFields, indexTaskCount) {
    await addTaskInBoard();
    await new Promise(r => setTimeout(r, 20));
    let objectAllTasks = Object.values(allCurrentTasksObj)[indexTaskFields];
    let specificObject = Object.values(objectAllTasks)[indexTaskCount];
    renderNoteToEdit(specificObject, indexTaskFields, indexTaskCount);
}

/**
 * Updates the task data and uploads the changes to the server.
 * @async
 * @param {number} indexTaskFields - The index of the task category.
 * @param {number} indexTaskCount - The index of the specific task within the category.
 */
async function updateTask(indexTaskFields, indexTaskCount) {
    getNewTaskInfo();
    let TaskFieldName = Object.keys(allCurrentTasksObj)[indexTaskFields];
    await putEditedTaskToServer(TaskFieldName, indexTaskCount);
    await getToDoTasks();
    document.getElementById("taskDetailSection").classList.add("d-none");
    toggleNoteDetails(indexTaskFields, indexTaskCount);
    document.getElementById("AddTaskSection").classList.add("d-none");
}

/**
 * Sends the edited task data to the server to update the task.
 * @async
 * @param {string} TaskFieldName - The name of the task field.
 * @param {number} indexTaskCount - The index of the specific task within the category.
 * @returns {Promise<Object>} The response from the server after the PUT request.
 */
async function putEditedTaskToServer(TaskFieldName, indexTaskCount) {
    let response = await fetch(BASE_URL + `Tasks/${TaskFieldName}/${indexTaskCount}.json`, {
        method: "put",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newTaskData),
    });
    return responseToJson = await response.json();
}

/**
 * Cancels the task edit and closes the task editor section.
 */
function cancelEdit() {
    document.getElementById("AddTaskSection").classList.add("d-none");
}