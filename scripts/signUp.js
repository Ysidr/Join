let NameOfAddedUser = "";

async function addAccountData() {
    let nameOfNewUser = document.getElementById("nameInput").value;
    let mailOfNewUser = document.getElementById("mailInput").value;
    let passwordOfNewUser = document.getElementById("passwordInput").value;
    let data = {
        "name": nameOfNewUser,
        "mail": mailOfNewUser,
        "password": passwordOfNewUser
    };
    checkForMailAdress(data, nameOfNewUser);
}
async function checkForMailAdress(data, nameOfNewUser) {
    let response = await fetch(BASE_URL +"User"+ ".json");
    responseToJson = await response.json();
    NameOfAddedUser = nameOfNewUser;
    console.log(responseToJson.NameOfAddedUser);
    
    if (responseToJson.nameOfNewUser == undefined) {
        postAccoundData(data, nameOfNewUser)
    }
}

async function postAccoundData(data, nameOfNewUser) {
    let response = await fetch(BASE_URL +"User/" + nameOfNewUser + ".json",
        {
            method: "put",
            header: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
    return responseToJson = await response.json();
}

