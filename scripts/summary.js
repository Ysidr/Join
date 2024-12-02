
async function initSummary() {
    console.log(currentTime);
    
    await updateAllTaskCounts();
    displayCounts();
}

async function updateAllTaskCounts() {
    await updateToDoTaskCount()
    await updateAwaitFeedbackTaskCount()
    await updateDoneTaskCount()
    await updateInProgressTaskCount()
    await getUrgentAmount()
}

function displayCounts() {
    renderToDo()
    renderDone()
    renderUrgent()
    renderAllTasks()
    renderInProgress()
    renderAwaitFeedback()
}

async function getUrgentAmount() {
    urgentAmount = 0;
    await checkToDo()
    await checkAwait()
    await checkInProgress()
}

async function checkToDo() {
    let response = await fetch(BASE_URL + `Tasks/ToDo.json`);
    responseToJson = await response.json();
    for (let indexIterate1Task = 1; indexIterate1Task < responseToJson.length; indexIterate1Task++) {
        if (responseToJson[indexIterate1Task].priority == "high") {
            urgentAmount++
        }
    }

}
async function checkAwait() {
    let response = await fetch(BASE_URL + `Tasks/AwaitFeedback.json`);
    responseToJson = await response.json();
    for (let indexIterate1Task = 1; indexIterate1Task < responseToJson.length; indexIterate1Task++) {
        if (responseToJson[indexIterate1Task].priority == "high") {
            urgentAmount++
        }
    }
}
async function checkInProgress() {
    let response = await fetch(BASE_URL + `Tasks/InProgress.json`);
    responseToJson = await response.json();
    for (let indexIterate1Task = 1; indexIterate1Task < responseToJson.length; indexIterate1Task++) {
        if (responseToJson[indexIterate1Task].priority == "high") {
            urgentAmount++
        }
    }
}