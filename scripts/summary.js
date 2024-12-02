document.addEventListener("DOMContentLoaded", async () => {
    await initSummary();
});

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

function getGreeting() {
    const now = new Date();
    const hour = now.getHours();
    let greeting = '';
    if (hour >= 6 && hour < 12) {
        greeting = 'Good morning';
    } else if (hour >= 12 && hour < 18) {
        greeting = 'Good day';
    } else {
        greeting = 'Good evening';
    }
    const greetingElement = document.getElementById('greeting');
    if (greetingElement) {
        greetingElement.innerHTML = greeting;
    } else {
        console.log(greeting);
    }
}
getGreeting();

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