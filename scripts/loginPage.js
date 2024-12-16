/**
 * Initializes the login page by starting the logo animation and retrieving the user count from the server.
 * @async
 * @function initLogin
 * @returns {Promise<void>}
 */
async function initLogin() {
    logoSlideIn();
    await getUserCount();
}

/**
 * Animates the logo on the login page and fades out the container after the animation ends.
 * @function logoSlideIn
 * @returns {void}
 */
function logoSlideIn() {
    const logoContainer = document.getElementById('logoAnimationContainer');
    const animatedLogo = document.getElementById('animatedLogo');
    animatedLogo.addEventListener('animationend', () => {
        logoContainer.classList.add('fade-out');
    });
}

/**
 * Fetches the total number of users from the server and updates the `UsersAmountViaId` variable.
 * @async
 * @function getUserCount
 * @returns {Promise<void>}
 */
async function getUserCount() {
    let response = await fetch(BASE_URL + `User.json`);
    responseToJson = await response.json();
    let localUserCount = 0;
    for (let indexUserCount = 1; indexUserCount < responseToJson.length; indexUserCount++) {
        localUserCount++;
    }
    UsersAmountViaId = localUserCount;
}

/**
 * Initiates the login process by retrieving the user count and checking for an existing account.
 * @async
 * @function loginWithAccount
 * @returns {Promise<void>}
 */
async function loginWithAccount() {
    await setUsersAmount();
    checkForExistingAccount();
}

/**
 * Checks the login credentials against the registered accounts on the server.
 * If a match is found, the corresponding account is opened.
 * @async
 * @function checkForExistingAccount
 * @returns {Promise<void>}
 */
async function checkForExistingAccount() {
    for (let indexAcconts = 1; indexAcconts <= UsersAmountViaId; indexAcconts++) {
        let response = await fetch(BASE_URL + `User/${indexAcconts}.json`);
        responseToJson = await response.json();
        if (
            responseToJson.mail == document.getElementById("emailLogin").value &&
            responseToJson.password == document.getElementById("passwordLogin").value
        ) {
            openAccount(indexAcconts);   
        }
    }
}

/**
 * Redirects the user to the sign-up page.
 * @function goToSignUp
 * @returns {void}
 */
function goToSignUp() {
    window.location.href = "signUp.html";
}