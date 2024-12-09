async function initLogin() {
    logoSlideIn();
    await getUserCount()
}

function logoSlideIn() {
    const logoContainer = document.getElementById('logoAnimationContainer');
    const animatedLogo = document.getElementById('animatedLogo');

    // Nach Abschluss der Bewegung: Verblassen des Containers
    animatedLogo.addEventListener('animationend', () => {
        logoContainer.classList.add('fade-out');
    });
}

async function getUserCount() {
    let response = await fetch(BASE_URL + `User.json`);
    responseToJson = await response.json();
    let localUserCount = 0;
    for (let indexUserCount = 1; indexUserCount < responseToJson.length; indexUserCount++) {
        localUserCount++;
    }
    UsersAmountViaId = localUserCount;
}

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

function goToSignUp() {
    window.location.href = "signUp.html";
}


