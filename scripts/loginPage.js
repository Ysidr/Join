function loginWithAccount() {
    fetchAccountAmounts()
    checkForExistingAccount()
}

async function fetchAccountAmounts() {
    let response = await fetch("https://join-7cb80-default-rtdb.europe-west1.firebasedatabase.app/UserAmount/.json");
    responseToJson = await response.json();
    UsersAmountViaId = responseToJson;
}

async function checkForExistingAccount() {
    for (let indexAcconts = 0; indexAcconts <= UsersAmountViaId; indexAcconts++) {
        console.log("success");
        
        
    }
}