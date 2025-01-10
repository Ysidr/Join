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
async function deleteTaskFromBoard(allTasksIndex) {
    allCurrentTasksObj.splice(allTasksIndex, 1);
    await addDNone("taskDetailSection");
    resetAllBoards();
    await getTasks();
    await updateAndUploadAllTaskCounts()

}

/**
 * Opens the task editor to edit the details of a specific task.
 * @async
 * @param {number} allTasksIndex - The index of the specific task within the category.
 */
async function editTaskInBoard(allTasksIndex) {
    await addTaskInBoard();
    await waitForElement("#titleInput");
    let specificObject = allCurrentTasksObj[allTasksIndex];
    renderNoteToEdit(specificObject, allTasksIndex);
}

/**
 * Waits for an element to be available in the DOM.
 * @param {string} selector - The CSS selector of the element to wait for.
 * @returns {Promise<void>} A promise that resolves when the element is available.
 */
function waitForElement(selector) {
    return new Promise((resolve) => {
        const observer = new MutationObserver((mutations) => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });
}

/**
 * Updates the task data and uploads the changes to the server.
 * @async
 * @param {number} indexTaskFields - The index of the task category.
 * @param {number} indexTaskCount - The index of the specific task within the category.
 */
async function updateTask(allTasksIndex) {
    getNewTaskInfo();
    await putEditedTaskToServer(allTasksIndex);
    await getTasks();
    document.getElementById("taskDetailSection").classList.add("d-none");
    toggleNoteDetails(allTasksIndex);
    document.getElementById("AddTaskSection").classList.add("d-none");
}

/**
 * Sends the edited task data to the server to update the task.
 * @async
 * @param {string} TaskFieldName - The name of the task field.
 * @param {number} indexTaskCount - The index of the specific task within the category.
 * @returns {Promise<Object>} The response from the server after the PUT request.
 */
async function putEditedTaskToServer(allTasksIndex) {
    let response = await fetch(BASE_URL + `Tasks/${allTasksIndex}.json`, {
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
    return
}

/**
 * Sends the current task data to the server.
 * @async
 * @returns {Promise<Object>} The server's response.
 */
async function putAllTasksToServer() {
    event.stopPropagation();
    let response = await fetch(BASE_URL + `Tasks.json`, {
        method: "put",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(allCurrentTasksObj)
    });
    return responseToJson = await response.json();
}