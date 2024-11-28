
async function addAccountData() {
    await setUsersAmount()
    let nameOfNewUser = document.getElementById("nameInput").value;
    let mailOfNewUser = document.getElementById("mailInput").value;
    let passwordOfNewUser = document.getElementById("passwordInput").value;
    let data = {
        "name": nameOfNewUser,
        "mail": mailOfNewUser,
        "password": passwordOfNewUser
    };
    mailIsUsed = false;
    checkForMailAdress(data);
}

async function setUsersAmount() {
    let response = await fetch(BASE_URL + "UserAmount.json");
    responseToJson = await response.json();
    UsersAmountViaId = responseToJson;
    return UsersAmountViaId
}

async function checkForMailAdress(data) {
    for (let indexUserCount = 1; indexUserCount <= UsersAmountViaId; indexUserCount++) {
        let response = await fetch(BASE_URL + `User/${indexUserCount}.json`);
        responseToJson = await response.json();
        if (UsersAmountViaId != 0) {
            if (responseToJson.mail == document.getElementById("mailInput").value) {
                mailIsUsed = true;
            }
        }
    }
    postAccoundData(data);
}

async function postAccoundData(data) {
    if (mailIsUsed == true) {
        loginToAccountMessage()
        mailIsUsed = false;
    } else {
        checkAndputToServer(data)
        mailIsUsed = false;
    }
}

async function checkAndputToServer(data) {
    if (document.getElementById("passwordInput").value == document.getElementById("confirmInput")) {
        UsersAmountViaId++;
        putToServer(data);
        putUserAmonutToServer()
        return responseToJson = await response.json();
    } else {
        passwordsAreDifferent();
    }
}

async function putToServer(data) {
    let response = await fetch(BASE_URL + `User/${UsersAmountViaId}.json`,
        {
            method: "put",
            header: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
}

async function putUserAmonutToServer() {
    let response = await fetch(BASE_URL + `UserAmount/.json`,
        {
            method: "put",
            header: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(UsersAmountViaId)
        });
    return responseToJson = await response.json();
}
