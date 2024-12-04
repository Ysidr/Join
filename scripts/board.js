let currentlyRenderingTasks = "";

async function initBoards() {
    await getToDoTasks();
}

async function getToDoTasks() {
    let response = await fetch(BASE_URL + `Tasks.json`);
    responseToJson = await response.json();
    for (let indexTaskFields = 0; indexTaskFields < Object.keys(responseToJson).length; indexTaskFields++) {
        currentlyRenderingTasks = Object.keys(responseToJson)[indexTaskFields]
        document.getElementById(Object.keys(responseToJson)[indexTaskFields] + "Tasks").innerHTML = "";
        for (let indexTaskCount = 1; indexTaskCount < Object.values(responseToJson)[indexTaskFields].length; indexTaskCount++) {
            let getCurrentTask = Object.values(Object.values(responseToJson)[indexTaskFields])[indexTaskCount];
            renderTasksinBoard(getCurrentTask);
            checkForSubtasks(getCurrentTask);
            checkForCategory(getCurrentTask);
            checkForImportance(getCurrentTask);
            checkForAddedUsers(getCurrentTask);
        }
    }


}

function checkForAddedUsers(getCurrentTask) {
    for (let AddedUsers = 0; AddedUsers < getCurrentTask.users.length; AddedUsers++) {
        getInitialsOfAddedUsers(getCurrentTask.users[indexAddedUsers])

    }
}

function getInitialsOfAddedUsers(name) {
    if (!name) return 'G';
    const nameParts = name.split(' ');
    const firstInitial = nameParts[0]?.charAt(0).toUpperCase();
    const lastInitial = nameParts[1]?.charAt(0).toUpperCase();
    renderInitials(firstInitial, lastInitial, name);

}

function checkForImportance(getCurrentTask) {
    if (getCurrentTask.priority == "high") {
        document.getElementById(`prioImg${getCurrentTask.title}`).innerHTML = `<img src="./assets/icons/Priority symbol high.svg" alt="">`
    } else if (getCurrentTask.priority == "medium") {
        document.getElementById(`prioImg${getCurrentTask.title}`).innerHTML = `<img src="./assets/icons/Priority symbol medium.svg" alt="">`
    } else {
        document.getElementById(`prioImg${getCurrentTask.title}`).innerHTML = `<img src="./assets/icons/Priority symbol low.svg" alt="">`
    }
}


function checkForCategory(getCurrentTask) {
    if (getCurrentTask.category == "technical") {
        renderCategoryTechnical(getCurrentTask);
        document.getElementById(`category${getCurrentTask.title}`).classList.add("lightBlueBackground");
    } else {
        renderCategoryUser(getCurrentTask);
        document.getElementById(`category${getCurrentTask.title}`).classList.add("blueBackground");
    }
}

function checkForSubtasks(getCurrentTask) {
    if (getCurrentTask.subtasks != undefined) {
        renderSubtasks(getCurrentTask);
    }
}