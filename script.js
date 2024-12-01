const BASE_URL = "https://join-7cb80-default-rtdb.europe-west1.firebasedatabase.app/";

let UsersAmountViaId = 0;
let taskCount = 0;

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
