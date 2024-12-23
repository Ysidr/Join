/**
 * Renders the count of tasks in the "To Do" section.
 */
function renderToDo() {
    document.getElementById("toDoCount").innerHTML =
        `<h1 class="taskAmount">${toDoTaskCount}</h1>`
}

/**
 * Renders the count of tasks in the "Done" section.
 */
function renderDone() {
    document.getElementById("doneCount").innerHTML =
        `<h1 class="taskAmount">${doneTaskCount}</h1>`
}

/**
 * Renders the count of tasks in the "Urgent" section.
 */
function renderUrgent() {
    document.getElementById("urgentTasks").innerHTML =
        `<h1 class="taskAmount">${urgentAmount}</h1>`
}

/**
 * Renders the total count of all tasks across different categories.
 */
function renderAllTasks() {
    document.getElementById("allTasks").innerHTML =
        `<h1 class="taskAmount">${TaskCount}</h1>`
}

/**
 * Renders the count of tasks in the "In Progress" section.
 */
function renderInProgress() {
    document.getElementById("inProgressTasks").innerHTML =
        `<h1 class="taskAmount">${inProgressTaskCount}</h1>`
}

/**
 * Renders the count of tasks awaiting feedback.
 */
function renderAwaitFeedback() {
    document.getElementById("awaitFeedbackTasks").innerHTML =
        `<h1 class="taskAmount">${awaitFeedbackTaskCount}</h1>`
}

/**
 * Renders the closest deadline date in a formatted way (DD-MM-YYYY).
 */
function renderClosestDate() {
    let s = nextDeadline;
    const niceDisplayOfDate = s.split('-').reverse().join('-');
    document.getElementById("Date").innerHTML = `<h2>${niceDisplayOfDate}</h2>`
}