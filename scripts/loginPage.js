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
            let userName = responseToJson.name;
            sessionStorage.setItem('currentAccountName', userName); // Speichern des Benutzernamens
            openAccount(indexAcconts, userName);
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

/**
 * Validates the entire login form by checking email and password fields.
 * @function validateLoginForm
 * @returns {void}
 */
function validateLoginForm() {
    const emailInput = document.getElementById("emailLogin");
    const passwordInput = document.getElementById("passwordLogin");
    let isValid = true;
    isValid &= validateEmailLogin(emailInput);
    isValid &= validatePassword(passwordInput);
    if (isValid) {
        loginWithAccount();
    }
}

/**
 * Validates the email input field for the login form.
 * @function validateEmailLogin
 * @param {HTMLInputElement} input - The email input element to validate
 * @returns {boolean} True if email is valid, false otherwise
 */
function validateEmailLogin(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!input.value.trim()) {
        markInvalid(input, "Email is required");
        return false;
    } else if (!emailRegex.test(input.value.trim())) {
        markInvalid(input, "Email must be in a valid format");
        return false;
    } else {
        markValid(input);
        return true;
    }
}

/**
 * Validates the password input field.
 * @function validatePassword
 * @param {HTMLInputElement} input - The password input element to validate
 * @returns {boolean} True if password is valid, false otherwise
 */
function validatePassword(input) {
    if (!input.value.trim()) {
        markInvalid(input, "Password is required");
        return false;
    } else if (input.value.trim().length < 6) {
        markInvalid(input, "Password must be at least 6 characters long");
        return false;
    } else {
        markValid(input);
        return true;
    }
}




