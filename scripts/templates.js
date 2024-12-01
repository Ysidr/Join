function renderToDo() {
    document.getElementById("toDoCount").innerHTML= 
    `<h1 class="taskAmount">${toDoTaskCount}</h1>`
}
function renderDone() {
    document.getElementById("doneCount").innerHTML= 
    `<h1 class="taskAmount">${doneTaskCount}</h1>`
}
function renderUrgent() {
    document.getElementById("urgentTasks").innerHTML= 
    `<h1 class="taskAmount">${urgentAmount}</h1>`
}
function renderAllTasks() {
    document.getElementById("allTasks").innerHTML= 
    `<h1 class="taskAmount">${toDoTaskCount + awaitFeedbackTaskCount + doneTaskCount + inProgressTaskCount}</h1>`
}
function renderInProgress() {
    document.getElementById("inProgressTasks").innerHTML= 
    `<h1 class="taskAmount">${inProgressTaskCount}</h1>`
}
function renderAwaitFeedback() {
    document.getElementById("awaitFeedbackTasks").innerHTML= 
    `<h1 class="taskAmount">${awaitFeedbackTaskCount}</h1>`
}