//Render Task Counts for Summary functions

function renderToDo() {
    document.getElementById("toDoCount").innerHTML =
        `<h1 class="taskAmount">${toDoTaskCount}</h1>`
}
function renderDone() {
    document.getElementById("doneCount").innerHTML =
        `<h1 class="taskAmount">${doneTaskCount}</h1>`
}
function renderUrgent() {
    document.getElementById("urgentTasks").innerHTML =
        `<h1 class="taskAmount">${urgentAmount}</h1>`
}
function renderAllTasks() {
    document.getElementById("allTasks").innerHTML =
        `<h1 class="taskAmount">${toDoTaskCount + awaitFeedbackTaskCount + doneTaskCount + inProgressTaskCount}</h1>`
}
function renderInProgress() {
    document.getElementById("inProgressTasks").innerHTML =
        `<h1 class="taskAmount">${inProgressTaskCount}</h1>`
}
function renderAwaitFeedback() {
    document.getElementById("awaitFeedbackTasks").innerHTML =
        `<h1 class="taskAmount">${awaitFeedbackTaskCount}</h1>`
}

//Render Contacts in Add Task functions

function resetContactList() {
    document.getElementById("openContactsDiv").innerHTML =
        `<div class="singleContact">
                    <input type="checkbox" id="vehicle1" value="basicText">
                    <label for="vehicle1">Select contacts to assign</label><br>
                </div>`
}

function renderContact(responseToJson, indexContactWithLetter) {
    document.getElementById("openContactsDiv").innerHTML +=
        `<div class="singleContact" id="${responseToJson[indexContactWithLetter].name}">
                    <input type="checkbox" id="${responseToJson[indexContactWithLetter].name}" value="${responseToJson[indexContactWithLetter].name}" onclick="contactSelected('${responseToJson[indexContactWithLetter].name}')">
                    <label for="${responseToJson[indexContactWithLetter].name}" onclick="contactSelected('${responseToJson[indexContactWithLetter].name}', '${responseToJson[indexContactWithLetter].bgColor}')">${responseToJson[indexContactWithLetter].name}</label><br>
                </div>`
    if (selectedContatct.includes(responseToJson[indexContactWithLetter].name)) {
        document.getElementById(responseToJson[indexContactWithLetter].name).classList.add("selectedContact")
    }
}

//Render tasks in Board functions

function renderTasksinBoard(responseToJson) {
    document.getElementById(currentlyRenderingTasks+"Tasks").innerHTML +=
        `<div class="singleTaskBoard">
                    <div class="category" id="divCategory${responseToJson.title}">
                    </div>
                    <div class="textSingleTask">
                        <p class="titleSingleCard">${responseToJson.title}</p>
                        <p class="descriptionSingleCard">${responseToJson.description}</p>
                    </div>
                    <div class="subtasksSingleCard" id="${responseToJson.title}">
                        
                    </div>
                    <div class="bottomDivSingleCard">
                        <div class="addedContactsSingleCard" id="contacts${responseToJson.title}"></div>
                        <div id="prioImg${responseToJson.title}" class="prioImg">
                        </div>
                    </div>
                </div>`
}

function renderSubtasks(responseToJson) {
    document.getElementById(responseToJson.title).innerHTML =
        `<div class="subtaskProgressBar"></div>
                        <div class="subtaskCountSingleCard">
                            <p class="amountSubtaskSingleCard">/${responseToJson.subtasks.length}</p>
                            <p class="subtaskTextSingleCard">Subtasks</p>
                        </div>`

}

function renderCategoryTechnical(getCurrentTask) {
    document.getElementById(`divCategory${getCurrentTask.title}`).innerHTML = 
    `<p class="categorySingleCard" id="category${getCurrentTask.title}">Technical Task</p>`
}

function renderCategoryUser(getCurrentTask) {
document.getElementById(`divCategory${getCurrentTask.title}`).innerHTML = `<p class="categorySingleCard" id="category${getCurrentTask.title}">User Story</p>`
}

function renderInitials(firstInitial, lastInitial, title, currentTask, index) {
    document.getElementById(`contacts${title}`).innerHTML += `<p class="addedUserInitials" style="background-color: ${currentTask.assignedBgColor[index]};" >${firstInitial}${lastInitial}</p>`
}




