async function initSummary() {
    await updateAllTaskCounts();
    displayCounts();
}

async function updateAllTaskCounts() {
    await updateToDoTaskCount()
    await updateAwaitFeedbackTaskCount()
    await updateDoneTaskCount()
    await updateInProgressTaskCount()
}

function displayCounts() {
    renderToDo()
    renderDone()
    //renderUrgent()
    renderAllTasks()
    renderInProgress()
    renderAwaitFeedback()
}