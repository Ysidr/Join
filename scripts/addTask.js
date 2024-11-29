
function createTask() {
    getNewTaskInfo()
    uploadData(newTaskData);
}

function getNewTaskInfo() {
    let newTitle = document.getElementById("titleInput").value;
    let newDescription = document.getElementById("descriptionInput").value;
    let newDate = document.getElementById("dateIput").value;
    getPriority();
    getCategory();
    getAddedContacts();
    gatherTaskData(newTitle, newDescription, newDate, newAssigned, newPrio, newCategory);
    return newTaskData;
}

function getAddedContacts() {
    if (document.getElementById("contactSelector").value != basicText) {
        let newAssigned = document.getElementById("contactSelector").value;
    }else{
        let newAssigned = "";
    }
    return newAssigned
}

function getPriority() {
    if (document.getElementById("high").checked) {
        let newPrio = "high";
    } else if (document.getElementById("meium").checked) {
        let newPrio = "medium";
    } else {
        let newPrio = "low";
    }
    return newPrio;
}

function getCategory() {
    if (document.getElementById("categorytSelector").value = technicalTask) {
        let newCategory = "technical";
        return newCategory;
    } else if (document.getElementById("categorytSelector").value = userStory) {
        let newCategory = "user";
        return newCategory;
    } else {
        selectCategoryErr();
    }
    
}

function gatherTaskData(newTitle, newDescription, newDate, newAssigned, newPrio, newCategory) {
    let newTaskData = {
        "title": newTitle,
        "description": newDescription,
        "date": newDate,
        "assigned": newAssigned,
        "priority": newPrio,
        "category": newCategory,
    };
    return newTaskData;
}