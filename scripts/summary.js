/**
 * Initializes the summary section by updating task counts, displaying them, and showing greeting and user name.
 * @async
 * @function initSummary
 * @returns {Promise<void>}
 */
async function initSummary() {
    await updateAllTaskCounts();
    displayCounts();
    getGreeting();
    getAndDisplayName();
}

/**
 * Updates all task counts including To-Do, Await Feedback, Done, In Progress, and Urgent amounts.
 * @async
 * @function updateAllTaskCounts
 * @returns {Promise<void>}
 */
async function updateAllTaskCounts() {
    await updateTaskCount();
}

/**
 * Displays all task counts and renders corresponding sections on the UI.
 * @function displayCounts
 */
function displayCounts() {
    renderToDo();
    renderDone();
    renderUrgent();
    renderAllTasks();
    renderInProgress();
    renderAwaitFeedback();
    renderClosestDate();
}

/**
 * Displays the current user's name in the summary section.
 * @function getAndDisplayName
 */
function getAndDisplayName() {
    document.getElementById("userNameSummary").innerHTML = `${currentUserName}`;
}

/**
 * Displays a greeting message based on the current time of day.
 * @function getGreeting
 */
function getGreeting() {
    const now = new Date();
    const hour = now.getHours();
    const greetingElement = document.getElementById('greeting');
    let comma = "";

    if (currentUserName != "") {
        comma = ",";
    }
    if (greetingElement) {
        checkForGreeting(comma, hour, greetingElement);
    }
}

/**
 * Determines and sets the appropriate greeting message based on the time of day.
 * @function checkForGreeting
 * @param {string} comma - A comma separator if the user name exists.
 * @param {number} hour - The current hour of the day.
 * @param {HTMLElement} greetingElement - The HTML element where the greeting is displayed.
 */
function checkForGreeting(comma, hour, greetingElement) {
    if (hour >= 6 && hour < 12) {
        greetingElement.innerHTML = `Good morning${comma}`;
    } else if (hour >= 12 && hour < 18) {
        greetingElement.innerHTML = `Good afternoon${comma}`;
    } else if (hour >= 18 && hour < 24) {
        greetingElement.innerHTML = `Good evening${comma}`;
    } else {
        greetingElement.innerHTML = `Good night${comma}`;
    }
}

/**
 * Checks for urgent tasks in the "To-Do" category and updates the urgent task amount and deadlines.
 * @async
 * @function checkToDo
 * @returns {Promise<void>}
 */
async function checkToDo() {
    let response = await fetch(BASE_URL + `Tasks/ToDo.json`);
    let responseToJson = await response.json();
    if (responseToJson != null) {
        let urgentAmountDeadlines = [];
        checkForUrgent(responseToJson, urgentAmountDeadlines);
    }
}

/**
 * Scans tasks for high-priority ("urgent") tasks and updates the urgent count and the closest deadline.
 * @function checkForUrgent
 * @param {Object[]} responseToJson - Array of task objects retrieved from the server.
 * @param {string[]} urgentAmountDeadlines - Array to store the deadlines of urgent tasks.
 */
function checkForUrgent(responseToJson, urgentAmountDeadlines) {
    for (let indexIterate1Task = 1; indexIterate1Task < responseToJson.length; indexIterate1Task++) {
        if (responseToJson[indexIterate1Task] != undefined) {
            if (responseToJson[indexIterate1Task].priority == "high") {
                urgentAmountDeadlines.push(responseToJson[indexIterate1Task].date);
            }
        }
    }
    urgentAmountDeadlines.sort((a, b) => {
        return new Date(a) - new Date(b);
    });

    if (urgentAmountDeadlines.length > 0) {
        nextDeadline = urgentAmountDeadlines[0];
    }
}

/**
 * Checks for urgent tasks in the "Await Feedback" category and updates the urgent task amount and deadlines.
 * @async
 * @function checkAwait
 * @returns {Promise<void>}
 */
async function checkAwait() {
    let response = await fetch(BASE_URL + `Tasks/AwaitFeedback.json`);
    let responseToJson = await response.json();
    if (responseToJson != null) {
        let urgentAmountDeadlines = [];
        for (let indexIterate1Task = 1; indexIterate1Task < responseToJson.length; indexIterate1Task++) {
            if (responseToJson[indexIterate1Task].priority == "high") {
                urgentAmount++;
                urgentAmountDeadlines.push(responseToJson[indexIterate1Task].date);
            }
        }
        urgentAmountDeadlines.sort((a, b) => {
            return new Date(a) - new Date(b);
        });
    }
}

/**
 * Checks for urgent tasks in the "In Progress" category and updates the urgent task amount and deadlines.
 * @async
 * @function checkInProgress
 * @returns {Promise<void>}
 */
async function checkInProgress() {
    let response = await fetch(BASE_URL + `Tasks/InProgress.json`);
    let responseToJson = await response.json();
    if (responseToJson != null) {
        let urgentAmountDeadlines = [];
        for (let indexIterate1Task = 1; indexIterate1Task < responseToJson.length; indexIterate1Task++) {
            if (responseToJson[indexIterate1Task].priority == "high") {
                urgentAmount++;
                urgentAmountDeadlines.push(responseToJson[indexIterate1Task].date);
            }
        }
        urgentAmountDeadlines.sort((a, b) => {
            return new Date(a) - new Date(b);
        });
    }
}