document.addEventListener("DOMContentLoaded", async () => {
    await initSummary();
});

async function initSummary() {
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

function getGreeting() {
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 6 && hour < 12) {
        document.getElementById('greeting').innerHTML = 'Good morning,';
    } else if (hour >= 12 && hour < 18) {
        document.getElementById('greeting').innerHTML = 'Good afternoon,';
    } else {
        document.getElementById('greeting').innerHTML = 'Good evening,';
    }
}
getGreeting();

async function checkToDo() {
    let response = await fetch(BASE_URL + `Tasks/ToDo.json`);
    responseToJson = await response.json();
    if (responseToJson != null) {
        for (let indexIterate1Task = 1; indexIterate1Task < responseToJson.length; indexIterate1Task++) {
            if (responseToJson[indexIterate1Task].priority == "high") {
                urgentAmount++
                urgentAmountDeadlines.push(responseToJson[indexIterate1Task].date)
            }
        }
    }

}
async function checkAwait() {
    let response = await fetch(BASE_URL + `Tasks/AwaitFeedback.json`);
    responseToJson = await response.json();
    if (responseToJson != null) {
        for (let indexIterate1Task = 1; indexIterate1Task < responseToJson.length; indexIterate1Task++) {
            if (responseToJson[indexIterate1Task].priority == "high") {
                urgentAmount++
                urgentAmountDeadlines.push(responseToJson[indexIterate1Task].date)

            }
        }
    }
}
async function checkInProgress() {
    let response = await fetch(BASE_URL + `Tasks/InProgress.json`);
    responseToJson = await response.json();
    if (responseToJson != null) {
        for (let indexIterate1Task = 1; indexIterate1Task < responseToJson.length; indexIterate1Task++) {
            if (responseToJson[indexIterate1Task].priority == "high") {
                urgentAmount++
                urgentAmountDeadlines.push(responseToJson[indexIterate1Task].date)

            }
        }
    }
}