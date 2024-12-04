let currentlyRenderingTasks = "";

async function initBoards() {
    await getToDoTasks();
    //await getInProgressTasks();
    //await getAwaitFeedbackTasks();
    //await getDoneTasks();
}

async function getToDoTasks() {
    let response = await fetch(BASE_URL + `Tasks.json`);
    responseToJson = await response.json();
    for (let indexTaskFields = 0; indexTaskFields < Object.keys(responseToJson).length; indexTaskFields++) {
        currentlyRenderingTasks = Object.keys(responseToJson)[indexTaskFields]
        document.getElementById(Object.keys(responseToJson)[indexTaskFields]+"Tasks").innerHTML = "";


        for (let indexTaskCount = 1; indexTaskCount < Object.values(responseToJson)[indexTaskFields].length; indexTaskCount++) {
            renderTasksinBoard(Object.values(Object.values(responseToJson)[indexTaskFields])[indexTaskCount ]);
            checkforSubtasks(Object.values(Object.values(responseToJson)[indexTaskFields])[indexTaskCount ]);
        }

    }


}

function checkforSubtasks(responseToJson) {
    if (responseToJson.subtasks != undefined) {
        renderSubtasks(responseToJson);
    }
}