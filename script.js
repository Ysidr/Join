const BASE_URL = "https://join-7cb80-default-rtdb.europe-west1.firebasedatabase.app/";

let UsersAmountViaId = 0;

let toDoTaskCount = 0;
let awaitFeedbackTaskCount = 0;
let doneTaskCount = 0;
let inProgressTaskCount = 0;
let urgentAmount = 0;


let mailIsUsed = false;

let isGuestAccount = false;

accountExists = false;

let newAssigned = "";
let newPrio = "";
let newCategory = "";
let newTaskData = {};

function openAccount(indexAcconts) {
    sessionStorage.setItem('loggedInUserId', indexAcconts);
    sessionStorage.setItem('isGuestAccount', 'false');
    window.location.href = "startseite.html";
}

function openGuestAccount() {
    isGuestAccount = true;
    sessionStorage.setItem('isGuestAccount', 'true');
    window.location.href = "startseite.html";
}



async function updateToDoTaskCount() {
    let response = await fetch(BASE_URL + `Tasks/ToDo.json`);
    responseToJson = await response.json();
    let localTaskCount = 0;
    if (responseToJson != null) {
        for (let indexUserCount = 1; indexUserCount < responseToJson.length; indexUserCount++) {
            localTaskCount++;
        }
    }
    toDoTaskCount = localTaskCount;
}
async function updateAwaitFeedbackTaskCount() {
    let response = await fetch(BASE_URL + `Tasks/AwaitFeedback.json`);
    responseToJson = await response.json();
    let localTaskCount = 0;
    if (responseToJson != null) {
        for (let indexUserCount = 1; indexUserCount < responseToJson.length; indexUserCount++) {
            localTaskCount++;
        }
    }
    AwaitFeedbackTaskCount = localTaskCount;
}
async function updateDoneTaskCount() {
    let response = await fetch(BASE_URL + `Tasks/Done.json`);
    responseToJson = await response.json();
    let localTaskCount = 0;
    if (responseToJson != null) {
        for (let indexUserCount = 1; indexUserCount < responseToJson.length; indexUserCount++) {
            localTaskCount++;
        }
    }
    DoneTaskCount = localTaskCount;
}
async function updateInProgressTaskCount() {
    let response = await fetch(BASE_URL + `Tasks/InProgress.json`);
    responseToJson = await response.json();
    let localTaskCount = 0;
    if (responseToJson != null) {
        for (let indexUserCount = 1; indexUserCount < responseToJson.length; indexUserCount++) {
            localTaskCount++;
        }
    }
    InProgressTaskCount = localTaskCount;
}
