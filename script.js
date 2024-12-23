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

async function openAccount(indexAcconts, userName) {
    sessionStorage.setItem('loggedInUserId', indexAcconts);
    sessionStorage.setItem('isGuestAccount', 'false');
    if (window.innerWidth < 1101) {
        document.body.innerHTML = `<div class="greetingPopUp"><div class="greeting" id="greeting"></div> <div class="userNamePopUp" id="userNamePopUp">${userName}</div>`;
        getGreeting(userName)
        await new Promise(r => setTimeout(r, 2000));


    }
    window.location.href = "startseite.html"; 1100
}

async function openGuestAccount() {
    isGuestAccount = true;
    sessionStorage.setItem('isGuestAccount', 'true');
    if (window.innerWidth < 1101) {
        document.body.innerHTML = `<div class="greetingPopUp">Du Hund, mach dir nen Account<div class="greeting" id="greeting"></div></div>`;
        getGreetingGuest()
        await new Promise(r => setTimeout(r, 2000));


    }
    window.location.href = "startseite.html";
}



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


async function checkForPage() {
    if (document.getElementById("main-content") != undefined) {
        loadPage('summary')
    } else {
        history.back()
    }
}

