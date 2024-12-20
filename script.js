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
    toDoTaskCount = 0;
    awaitFeedbackTaskCount = 0;
    doneTaskCount = 0;
    inProgressTaskCount = 0;
    urgentAmount = 0;
    let response = await fetch(BASE_URL + `Tasks.json`);
    responseToJson = await response.json();
    let localTaskCount = 0;
    if (responseToJson != null) {
        for (let indexUserCount = 1; indexUserCount < responseToJson.length; indexUserCount++) {
            localTaskCount++;
            const tasksArray = Object.values(responseToJson);
            toDoTaskCount = tasksArray.filter(task => task.status === "To-Do").length;
        }
    }
    TaskCount = localTaskCount;
}

async function checkForPage() {
    if (document.getElementById("main-content") != undefined) {
        loadPage('summary')
    } else {
        history.back()
    }
}


