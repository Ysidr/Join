/** 
 * An array containing page names that require scripts to be dynamically loaded.
 * @constant {string[]}
 */
const pagesWithScripts = ["summary", "addTask", "board", "contacts"];

/**
 * Stores the current user's name.
 * @type {string}
 */
let currentUserName = "";

/**
 * Loads user data when the page is fully loaded.
 * @event window#onload
 */
window.onload = loadUserData;

/**
 * The main content container for dynamically loaded pages.
 * @type {HTMLElement}
 */
const content = document.getElementById("main-content");

/**
 * Array of navigation bar link elements for handling page navigation.
 * @type {HTMLElement[]}
 */
const navbarLinks = [
    document.getElementById("summaryLink"),
    document.getElementById("addTaskLink"),
    document.getElementById("boardLink"),
    document.getElementById("contactsLink"),
    document.getElementById("privacyPolicy"),
    document.getElementById("legalNotice"),
    document.getElementById("help"),
    document.getElementById("index")
];

/**
 * Loads user data and displays the user's initials. If no user data is found, defaults to "G".
 * @async
 * @function loadUserData
 * @returns {Promise<void>}
 */
async function loadUserData() {
    const isGuest = sessionStorage.getItem('isGuestAccount') === 'true';
    if (isGuest) {
        document.getElementById('user-initials').textContent = 'G';
        return;
    }
    const userId = sessionStorage.getItem('loggedInUserId');
    if (!userId) return;
    try {
        const userData = await fetchUserFromFirebase(userId);
        const initials = getInitials(userData.name);
        document.getElementById('user-initials').textContent = initials;
    } catch (error) {
        console.error('Error loading user data:', error);
        document.getElementById('user-initials').textContent = 'G';
    }
}

/**
 * Fetches user data from Firebase based on the given user ID.
 * @async
 * @function fetchUserFromFirebase
 * @param {string} userId - The ID of the user to fetch data for.
 * @returns {Promise<Object>} - A promise resolving to the user data.
 * @throws Will throw an error if the user data cannot be retrieved.
 */
async function fetchUserFromFirebase(userId) {
    const response = await fetch(`${BASE_URL}User/${userId}.json`);
    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }
    const userData = await response.json();
    return userData;
}

/**
 * Extracts the initials from a user's full name.
 * @function getInitials
 * @param {string} name - The full name of the user.
 * @returns {string} - The initials of the user, or "G" if the name is not provided.
 */
function getInitials(name) {
    if (!name) return 'G';
    const nameParts = name.split(' ');
    const firstInitial = nameParts[0]?.charAt(0).toUpperCase();
    const lastInitial = nameParts[1]?.charAt(0).toUpperCase();
    return firstInitial + (lastInitial || '');
}

/**
 * Dynamically loads a page, including its HTML, CSS, and optional script.
 * @async
 * @function loadPage
 * @param {string} page - The name of the page to load.
 * @returns {Promise<void>}
 */

function setActiveLink(event, page) {
    event.preventDefault();
    const links = document.querySelectorAll('.nav-container a, .flex a');
    links.forEach(link => link.classList.remove('active'));
    event.currentTarget.classList.add('active');
    loadPage(page);
}

async function loadPage(page) {
    try {
        await loadHtml(page);
        await loadCss(page);
        await loadScript(page);
        checkForLoadedPage(page);
    } catch (error) {
        content.innerHTML = `<p>An error occurred: ${error.message}</p>`;
    }
}

/**
 * Checks the page being loaded and initializes its specific functionality if applicable.
 * @function checkForLoadedPage
 * @param {string} page - The name of the page being loaded.
 */
function checkForLoadedPage(page) {
    if (page === "summary" && typeof initSummary === "function") {
        initSummary();
    }
    if (page === "board" && typeof initBoards === "function") {
        initBoards();
    }
    if (page === "addTask" && typeof initAddTask === "function") {
        initAddTask();
    }
}

/**
 * Loads the HTML content of a page into the main content container.
 * @async
 * @function loadHtml
 * @param {string} page - The name of the page whose HTML is to be loaded.
 * @returns {Promise<void>}
 * @throws Will throw an error if the HTML file cannot be loaded.
 */
async function loadHtml(page) {
    const response = await fetch(`${page}.html`);
    if (response.ok) {
        const html = await response.text();
        content.innerHTML = html;
    } else {
        throw new Error(`Failed to load page ${page}.html`);
    }
}

/**
 * Dynamically loads the CSS file for a specific page.
 * @async
 * @function loadCss
 * @param {string} page - The name of the page whose CSS is to be loaded.
 * @returns {Promise<void>}
 */
async function loadCss(page) {
    const cssResponse = await fetch(`./styles/${page}.css`);
    if (cssResponse.ok) {
        const dynamicCss = document.getElementById("dynamic-css");
        if (dynamicCss) {
            dynamicCss.href = `./styles/${page}.css`;
        } else {
            document.head.innerHTML += `<link id="dynamic-css" rel="stylesheet" href="./styles/${page}.css">`;
        }
    }
}

/**
 * Dynamically loads and executes the JavaScript file for a specific page, if required.
 * @async
 * @function loadScript
 * @param {string} page - The name of the page whose script is to be loaded.
 * @returns {Promise<void>}
 */
async function loadScript(page) {
    try {
        if (!pagesWithScripts.includes(page)) {
            return;
        }
        const scriptUrl = `./scripts/${page}.js`;
        const scriptResponse = await fetch(scriptUrl);
        if (scriptResponse.ok) {
            const scriptText = await scriptResponse.text();
            eval(scriptText);
        }
    } catch (error) {
        console.error(`Error loading JS for ${page}:`, error);
    }
}

/**
 * Initializes page navigation by adding event listeners to navigation links.
 * @function navbarLinks#forEach
 */
navbarLinks.forEach((link) => {
    if (link) {
        link.onclick = function (event) {
            event.preventDefault();
            const page = this.dataset.page;
            loadPage(page);
        };
    }
});

/**
 * Immediately invoked function expression (IIFE) to load the initial start page.
 * @async
 * @function initStartPage
 * @returns {Promise<void>}
 */
(async function initStartPage() {
    await loadPage("summary");
})();

/**
 * Toggles the visibility of the menu container by adding or removing a 'hidden' class.
 * @function toggleMenu
 */
function toggleMenu() {
    const menu = document.getElementById('menu-container');
    menu.classList.toggle('d-none');
}

/**
 * Handles the click event for a menu link.
 * Hides the menu container and loads the corresponding page.
 * @param {string} page - The name of the page to load.
 */
function handleLinkClick(page) {
    loadPage(page);
    toggleMenu();
}

/**
 * Handles the logout action by redirecting to the index page.
 */
function handleLogout() {
    window.location.href = 'index.html';
    toggleMenu();
}
