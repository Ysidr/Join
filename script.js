const BASE_URL = "https://join-7cb80-default-rtdb.europe-west1.firebasedatabase.app/";

let UsersAmountViaId = 0;

let mailIsUsed = false;

let isGuestAccount = false;

accountExists = false;

function openAccount(indexAcconts) {
    window.location.href = "startseite.html";
}

function openGuestAccount() {
    isGuestAccount = true;
    window.location.href = "startseite.html";
}