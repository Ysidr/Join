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

function renderTasksinBoard(responseToJson, indexTaskFields, indexTaskCount) {
    document.getElementById(currentlyRenderingTasks + "Tasks").innerHTML +=
        `<div class="singleTaskBoard" onclick="toggleNoteDetails('${indexTaskFields}', '${indexTaskCount}')">
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
    let doneCount = 0;
    for (let indexSubtasks = 0; indexSubtasks < responseToJson.subtasks.addedTask.length; indexSubtasks++) {
        if (responseToJson.subtasks.subtasksDone[indexSubtasks]== true) {
            doneCount++;
        }  
    }
    const totalSubtasks = responseToJson.subtasks.addedTask.length;
    const progressPercentage = (doneCount / totalSubtasks) * 100;
    document.getElementById(responseToJson.title).innerHTML =
        `<div class="subtaskProgressBar">
                            <div class="subtaskProgressBarInner" style="width: ${progressPercentage}%;"></div>
</div>
                        <div class="subtaskCountSingleCard">
                            <p class="amountSubtaskSingleCard">${doneCount}/${responseToJson.subtasks.addedTask.length}</p>
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

function renderDetails(indexTaskFields, indexTaskCount) {
    document.getElementById("detailContacts").innerHTML = "";
    document.getElementById("detailSubtasks").innerHTML = "";
    let objectAllTasks = Object.values(allCurrentTasksObj)[indexTaskFields];
    let specificObject = Object.values(objectAllTasks)[indexTaskCount];
    document.getElementById("detailCategory").innerHTML = `<p class="pDetailCategory">${specificObject.category}</p>`
    document.getElementById("detailHeader").innerHTML = `<h1 class="hTitleCategory">${specificObject.title}</h1>`
    document.getElementById("detailDetails").innerHTML = `<p>${specificObject.description}</p>`
    document.getElementById("detailDate").innerHTML = `<p>Due date:</p><p>${specificObject.date}</p>`
    document.getElementById("detailPrio").innerHTML = `<p>Priority:</p><p>${specificObject.priority}</p>`
    if (specificObject.assigned != null) {
        for (let indexAddedContacts = 0; indexAddedContacts < specificObject.assigned.length; indexAddedContacts++) {
            document.getElementById("detailContacts").innerHTML += `<p class="detailSingleContact" style="background-color:${specificObject.assignedBgColor[indexAddedContacts]};">${specificObject.assigned[indexAddedContacts]}</p>`
        }
    }
    if (specificObject.subtasks != null) {
        for (let indexAddedSubtasks = 0; indexAddedSubtasks < specificObject.subtasks.addedTask.length; indexAddedSubtasks++) {
            if (specificObject.subtasks.subtasksDone[indexAddedSubtasks] == true) {
                document.getElementById("detailSubtasks").innerHTML += `<input type="checkbox" id="checkboxSubtask${specificObject.subtasks.addedTask[indexAddedSubtasks]}" checked onclick="subtaskSelected('${indexTaskFields}', '${indexTaskCount}' , '${indexAddedSubtasks}')">
            <label for="checkboxSubtask${specificObject.subtasks.addedTask[indexAddedSubtasks]}">${specificObject.subtasks.addedTask[indexAddedSubtasks]}</label>`
            } else {
                document.getElementById("detailSubtasks").innerHTML += `<input type="checkbox" id="checkboxSubtask${specificObject.subtasks.addedTask[indexAddedSubtasks]}" onclick="subtaskSelected('${indexTaskFields}', '${indexTaskCount}' , '${indexAddedSubtasks}')">
            <label for="checkboxSubtask${specificObject.subtasks.addedTask[indexAddedSubtasks]}">${specificObject.subtasks.addedTask[indexAddedSubtasks]}</label>`
            }
        }
    }
}
