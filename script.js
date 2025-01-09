const BASE_URL = "https://join-7cb80-default-rtdb.europe-west1.firebasedatabase.app/";
let UsersAmountViaId = 0;
let currentTime = new Date()
let currentDraggedId;
let toDoTaskCount = 0;
let awaitFeedbackTaskCount = 0;
let doneTaskCount = 0;
let inProgressTaskCount = 0;
let urgentAmount = 0;
let urgentAmountDeadlines = [];
let nextDeadline = "";
let mailIsUsed = false;
let isGuestAccount = false;
accountExists = false;
let newAssigned = "";
let newAssignedBgColor = "";
let newPrio = "";
let newCategory = "";
let newTaskData = {};

/**
 * Initializes the task creation process by clearing the input fields.
 * @function stopEventBubbling
 * 
 */
function stopEventBubbling(event) {
    event.stopPropagation()
}

/**
 * Opens a new account session after successful login.
 * @async
 * @function openAccount
 * @param {number} indexAcconts - The user's account index
 * @param {string} userName - The user's name
 * @returns {Promise<void>}
 */
async function openAccount(indexAcconts, userName) {
    sessionStorage.setItem('loggedInUserId', indexAcconts);
    sessionStorage.setItem('currentAccountName', userName);
    sessionStorage.setItem('isGuestAccount', 'false');    
    if (window.innerWidth < 1101) {
        try {
            document.body.innerHTML = `
                <div class="greetingPopUp">
                    <div class="greeting" id="greeting"></div>
                    <div class="userNamePopUp">${userName}</div>
                </div>`;
            const greetingElement = document.getElementById('greeting');
            setGreetingMessage(greetingElement);
            await new Promise(r => setTimeout(r, 2000));
        } catch (error) {
            console.error('Error in greeting:', error);
        }
    }
    window.location.href = "startseite.html";
}

/**
 * Sets the appropriate greeting message based on the time of day.
 * @function setGreetingMessage
 * @param {HTMLElement} greetingElement - The element where the greeting will be displayed
 * @returns {void}
 */
function setGreetingMessage(greetingElement) {
    const hour = new Date().getHours();
    let greeting = '';    
    if (hour >= 6 && hour < 12) greeting = 'Good morning';
    else if (hour >= 12 && hour < 18) greeting = 'Good afternoon';
    else if (hour >= 18 && hour < 24) greeting = 'Good evening';
    else greeting = 'Good night';    
    greetingElement.textContent = greeting;
}

/**
 * Opens a guest account session.
 * @async
 * @function openGuestAccount
 * @returns {Promise<void>}
 */
async function openGuestAccount() {
    sessionStorage.setItem('isGuestAccount', 'true');
    sessionStorage.removeItem('currentAccountName');    
    if (window.innerWidth < 1101) {
        try {
            document.body.innerHTML = `
                <div class="greetingPopUp">
                    <div class="greeting" id="greeting"></div>
                </div>`;
            const greetingElement = document.getElementById('greeting');
            setGreetingMessage(greetingElement);
            await new Promise(r => setTimeout(r, 2000));
        } catch (error) {
            console.error('Error in greeting:', error);
        }
    }
    window.location.href = "startseite.html";
}

/**
 * Updates the counts of all task categories.
 * @async
 * @function updateTaskCount
 * @returns {Promise<void>}
 */
async function updateTaskCount() {
    TaskCount = 0;
    toDoTaskCount = 0;
    awaitFeedbackTaskCount = 0;
    doneTaskCount = 0;
    inProgressTaskCount = 0;
    urgentAmount = 0;
    let urgentAmountDeadlines = [];
    try {
        const response = await fetch(`${BASE_URL}Tasks.json`);
        const tasks = await response.json();
        if (tasks) {
            for (const task of Object.values(tasks).slice(1)) {
                TaskCount++;
                switch (task.progress) {
                    case "ToDo":
                        toDoTaskCount++;
                        break;
                    case "InProgress":
                        inProgressTaskCount++;
                        break;
                    case "AwaitFeedback":
                        awaitFeedbackTaskCount++;
                        break;
                    case "Done":
                        doneTaskCount++;
                        break;
                }
                if (task.priority === "high") {
                    urgentAmount++;
                    checkForUrgent(tasks, urgentAmountDeadlines);                }
            }
        }
    } catch (error) {
        console.error("Error updating task count:", error);
    }
}

/**
 * Checks which page is currently loaded and handles navigation accordingly.
 * @async
 * @function checkForPage
 * @returns {Promise<void>}
 */
async function checkForPage() {
    if (document.getElementById("main-content") != undefined) {
        loadPage('summary')
    } else {
        history.back()
    }
}

/**
 * Marks an input field as invalid with an error message.
 * @function markInvalid
 * @param {HTMLInputElement} input - The input element to mark as invalid
 * @param {string} message - The error message to display
 * @returns {void}
 */
function markInvalid(input, message) {
    input.value = "";
    input.placeholder = message;
    input.classList.add("invalid", "error-message");
}

/**
 * Marks an input field as valid by removing error styling.
 * @function markValid
 * @param {HTMLInputElement} input - The input element to mark as valid
 * @returns {void}
 */
function markValid(input) {
    input.placeholder = "";
    input.classList.remove("invalid", "error-message");
}