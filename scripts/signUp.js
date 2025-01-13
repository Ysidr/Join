/**
 * Collects new account data from input fields and processes it for account creation.
 * Checks if the email is already in use before proceeding.
 * @async
 * @function addAccountData
 * @returns {Promise<void>}
 */
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

/**
 * Retrieves the total number of registered users from the server and updates the `UsersAmountViaId` variable.
 * @async
 * @function setUsersAmount
 * @returns {Promise<number>} - The total number of users.
 */
async function setUsersAmount() {
    let response = await fetch(BASE_URL + "UserAmount.json");
    let responseToJson = await response.json();
    UsersAmountViaId = responseToJson;
    return UsersAmountViaId;
}

/**
 * Checks if the provided email address already exists in the user database.
 * If the email is not in use, proceeds to post the account data.
 * @async
 * @function checkForMailAdress
 * @param {Object} data - The account data to be checked.
 * @param {string} data.name - The name of the user.
 * @param {string} data.mail - The email of the user.
 * @param {string} data.password - The password of the user.
 * @returns {Promise<void>}
 */
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

/**
 * Posts the account data to the server if the email is not already in use.
 * Displays an alert if the email exists, otherwise continues the account creation process.
 * @async
 * @function postAccoundData
 * @param {Object} data - The account data to be posted.
 * @returns {Promise<void>}
 */
async function postAccoundData(data) {
    if (mailIsUsed === true) {
        alert("The email already exists.");
        mailIsUsed = false;
    } else {
        checkAndPutToServer(data);
        mailIsUsed = false;
    }
}

/**
 * Validates the password confirmation and sends the account data to the server.
 * Redirects to a success page if passwords match, or displays an alert if they do not.
 * @async
 * @function checkAndPutToServer
 * @param {Object} data - The account data to be validated and sent to the server.
 * @returns {Promise<void>}
 */
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

/**
 * Sends account data to the server for the newly created user.
 * @async
 * @function putToServer
 * @param {Object} data - The account data to be sent.
 * @returns {Promise<Object>} - The server's response after storing the account data.
 */
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

/**
 * Updates the total number of registered users on the server.
 * @async
 * @function putUserAmountToServer
 * @returns {Promise<Object>} - The server's response after updating the user count.
 */
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

/**
 * Validates the entire sign-up form.
 * @function validateSignUpForm
 * @returns {void}
 */
function validateSignUpForm() {
    const nameInput = document.getElementById("nameInput");
    const emailInput = document.getElementById("mailInput");
    const passwordInput = document.getElementById("passwordInput");
    const confirmInput = document.getElementById("confirmInput");
    const checkbox = document.getElementById("checkbox");
    
    let isValid = true;
    
    isValid &= validateName(nameInput);
    isValid &= validateEmail(emailInput);
    isValid &= validatePassword(passwordInput);
    isValid &= validateConfirmPassword(passwordInput, confirmInput);
    isValid &= validateCheckbox(checkbox);

    if (isValid) {
        addAccountData();
    }
}

/**
 * Validates the name input field.
 * @function validateName
 * @param {HTMLInputElement} input - The name input element
 * @returns {boolean} - True if valid, false otherwise
 */
function validateName(input) {
    if (!input.value.trim()) {
        markInvalid(input, "Please enter your name");
        return false;
    }
    markValid(input);
    return true;
}

/**
 * Validates the email input field.
 * @function validateEmail
 * @param {HTMLInputElement} input - The email input element
 * @returns {boolean} - True if valid, false otherwise
 */
function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!input.value.trim()) {
        markInvalid(input, "Please enter your email");
        return false;
    } else if (!emailRegex.test(input.value.trim())) {
        markInvalid(input, "Please enter a valid email address");
        return false;
    }
    markValid(input);
    return true;
}

/**
 * Validates the password input field.
 * @function validatePassword
 * @param {HTMLInputElement} input - The password input element
 * @returns {boolean} - True if valid, false otherwise
 */
function validatePassword(input) {
    if (!input.value.trim()) {
        markInvalid(input, "Please enter a password");
        return false;
    } else if (input.value.length < 6) {
        markInvalid(input, "Password must be at least 6 characters");
        return false;
    }
    markValid(input);
    return true;
}

/**
 * Validates that the confirmation password matches the original password.
 * @function validateConfirmPassword
 * @param {HTMLInputElement} passwordInput - The original password input
 * @param {HTMLInputElement} confirmInput - The confirmation password input
 * @returns {boolean} - True if valid, false otherwise
 */
function validateConfirmPassword(passwordInput, confirmInput) {
    if (!confirmInput.value) {
        markInvalid(confirmInput, "Please confirm your password");
        return false;
    } else if (passwordInput.value !== confirmInput.value) {
        markInvalid(confirmInput, "Passwords do not match");
        return false;
    }
    markValid(confirmInput);
    return true;
}

/**
 * Validates the privacy policy checkbox.
 * @function validateCheckbox
 * @param {HTMLInputElement} checkbox - The checkbox element
 * @returns {boolean} - True if checked, false otherwise
 */
function validateCheckbox(checkbox) {
    if (!checkbox.checked) {
        checkbox.classList.add("invalid");
        return false;
    }
    checkbox.classList.remove("invalid");
    return true;
}

/**
 * Initializes password validation event listeners
 */
document.addEventListener('DOMContentLoaded', function() {
    const confirmInput = document.getElementById('confirmInput');
    const passwordInput = document.getElementById('passwordInput');

    confirmInput.addEventListener('keyup', () => validatePasswordMatch());
    passwordInput.addEventListener('keyup', () => validatePasswordMatch());
});

/**
 * Validates password match in real-time
 * @function validatePasswordMatch
 * @returns {void}
 */
function validatePasswordMatch() {
    const passwordInput = document.getElementById('passwordInput');
    const confirmInput = document.getElementById('confirmInput');
    
    if (!confirmInput.value) {
        confirmInput.classList.remove('match', 'mismatch');
        return;
    }

    if (passwordInput.value === confirmInput.value) {
        confirmInput.classList.remove('mismatch');
        confirmInput.classList.add('match');
        confirmInput.setCustomValidity('');
    } else {
        confirmInput.classList.remove('match');
        confirmInput.classList.add('mismatch');
        confirmInput.setCustomValidity('Passwords do not match');
    }
}