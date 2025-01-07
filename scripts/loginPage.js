currentAccountName = "";
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
            let userName = responseToJson.name
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
 * Displays a greeting message based on the current time of day.
 * @function getGreeting
 */
function getGreeting(userName) {
    const now = new Date();
    const hour = now.getHours();
    const greetingElement = document.getElementById('greeting');
    let comma = "";
    if (userName!= undefined) {
        currentAccountName = userName;
    }

    if (userName != "") {
        comma = ",";
    }
    if (greetingElement) {
        checkForGreeting(comma, hour, greetingElement);
    }
}

/**
 * Determines and sets the appropriate greeting message based on the time of day.
 * @function checkForGreeting
 * @param {string} comma - A comma separator if the user name exists.
 * @param {number} hour - The current hour of the day.
 * @param {HTMLElement} greetingElement - The HTML element where the greeting is displayed.
 */
function checkForGreeting(comma, hour, greetingElement) {
    if (hour >= 6 && hour < 12) {
        greetingElement.innerHTML = `Good morning${comma}`;
    } else if (hour >= 12 && hour < 18) {
        greetingElement.innerHTML = `Good afternoon${comma}`;
    } else if (hour >= 18 && hour < 24) {
        greetingElement.innerHTML = `Good evening${comma}`;
    } else {
        greetingElement.innerHTML = `Good night${comma}`;
    }
}

function getGreetingGuest() {
    const now = new Date();
    const hour = now.getHours();
    const greetingElement = document.getElementById('greeting');
    let comma = "";
    if (greetingElement) {
        checkForGreetingGuest(hour, greetingElement);
    }
}

/**
 * Determines and sets the appropriate greeting message based on the time of day.
 * @function checkForGreeting
 * @param {string} comma - A comma separator if the user name exists.
 * @param {number} hour - The current hour of the day.
 * @param {HTMLElement} greetingElement - The HTML element where the greeting is displayed.
 */
function checkForGreetingGuest(hour, greetingElement) {
    if (hour >= 6 && hour < 12) {
        greetingElement.innerHTML = `Good morning`;
    } else if (hour >= 12 && hour < 18) {
        greetingElement.innerHTML = `Good afternoon`;
    } else if (hour >= 18 && hour < 24) {
        greetingElement.innerHTML = `Good evening`;
    } else {
        greetingElement.innerHTML = `Good night`;
    }
}

function validateLoginForm() {
    const emailInput = document.getElementById("emailLogin");
    const passwordInput = document.getElementById("passwordLogin");
    let isValid = true;
    isValid &= validateEmail(emailInput);
    isValid &= validatePassword(passwordInput);
    if (isValid) {
        loginWithAccount();
    }
}

function validateEmail(input) {
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




