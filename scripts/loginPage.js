
async function loginWithAccount() {
    await setUsersAmount();
    checkForExistingAccount()
}

async function checkForExistingAccount() {
    for (let indexAcconts = 1; indexAcconts <= UsersAmountViaId; indexAcconts++) {
    let response = await fetch(BASE_URL + `User/${indexAcconts}.json`);
    responseToJson = await response.json();
        if (responseToJson.mail == document.getElementById("emailLogin").value && responseToJson.password == document.getElementById("passwordLogin").value) {
            openAccount(indexAcconts)   
        } 
    }
}


