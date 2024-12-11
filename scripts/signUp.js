async function addAccountData() {
    await setUsersAmount();
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
    let responseToJson = await response.json();
    UsersAmountViaId = responseToJson;
    return UsersAmountViaId;
}

async function checkForMailAdress(data) {
    for (let indexUserCount = 1; indexUserCount <= UsersAmountViaId; indexUserCount++) {
        let response = await fetch(BASE_URL + `User/${indexUserCount}.json`);
        let responseToJson = await response.json();
        if (responseToJson.mail === document.getElementById("mailInput").value) {
            mailIsUsed = true;
        }
    }
    postAccoundData(data);
}

async function postAccoundData(data) {
    if (mailIsUsed === true) {
        alert("Die Email existiert bereits.");
        mailIsUsed = false;
    } else {
        checkAndPutToServer(data);
        mailIsUsed = false;
    }
}

async function checkAndPutToServer(data) {
    if (document.getElementById("passwordInput").value === document.getElementById("confirmInput").value) {
        UsersAmountViaId++;
        await putToServer(data);
        await putUserAmountToServer();
        window.location.href = "succesfulNewAccount.html";
    } else {
        alert("Passwords do not match.");
    }
}

async function putToServer(data) {
    let response = await fetch(BASE_URL + `User/${UsersAmountViaId}.json`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}

async function putUserAmountToServer() {
    let response = await fetch(BASE_URL + `UserAmount/.json`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(UsersAmountViaId)
    });
    return await response.json();
}
