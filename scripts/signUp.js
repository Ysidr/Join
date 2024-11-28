
function addAccountData() {
    setUsersAmount()
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
    let response = await fetch(BASE_URL + `UserAmount/.json`);
        responseToJson = await response.json();
        UsersAmountViaId = responseToJson;
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
    }else{
        putToServer(data)
        mailIsUsed = false;
    }
}

async function putToServer(data) {
    UsersAmountViaId++;
    let response = await fetch(BASE_URL + `User/${UsersAmountViaId}.json`,
        {
            method: "put",
            header: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        putUserAmonutToServer()
    return responseToJson = await response.json();
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
