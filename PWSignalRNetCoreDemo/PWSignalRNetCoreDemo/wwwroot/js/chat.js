const chatConnection = new signalR.HubConnectionBuilder()
    .withUrl("/chatHub")
    .build();

var nickName = '';
var users = [];

//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;

chatConnection.on("ReceiveMessage", function (user, message) {
    var html;

    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    if (user == nickName) {
        html = `<div class="row msg_container base_sent">
        <div class="col-md-10 col-xs-10">
            <div class="messages msg_sent">
                <p>${msg}</p>
                <time>${parseUser(user)}</time>
            </div>
            </div>
            <div class="col-md-2 col-xs-2 avatar">
                <img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" class=" img-responsive ">
            </div>
        </div>`;
    } else {
        html = `
        <div class="row msg_container base_receive">
            <div class="col-md-2 col-xs-2 avatar">
                <img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" class=" img-responsive ">
            </div>
            <div class="col-md-10 col-xs-10">
                <div class="messages msg_receive">
                    <p>${msg}</p>
                    <time>${parseUser(user)}</time>
                </div>
            </div>
        </div>`;
    }

    document.getElementById("messagesList").insertAdjacentHTML('beforeend', html);
});

chatConnection.start().then(function (userList) {
    document.getElementById("sendButton").disabled = false;

    nickName = prompt("Please enter your name");

    chatConnection.invoke("UpdateUsers", nickName).catch(function (err) {
        return console.error(err.toString());
    });
}).catch(function (err) {
    return console.error(err.toString());
});

chatConnection.on("UpdateUsers", function (user) {
    users.push(user);

    updateUserList();
});

chatConnection.on("ReceiveConnectedUsers", function (currentUsers) {
    users = currentUsers;
    updateUserList();
});

const parseUser = (user) => {
    return user == nickName ? user + " (you)" : user || 'unnamed';
}

const appendUserHtml = (user) => {
    const html = `
    <tr>
        <td>${parseUser(user)}</td>
    </tr>`;

    document.getElementById("userList").insertAdjacentHTML('beforeend', html);
}

const updateUserList = () => {
    document.getElementById("userList").innerHTML = "";

    for (let index = 0; index < users.length; index++) {
        appendUserHtml(users[index]);
    }
}

document.getElementById('sendButton').addEventListener("click", function () {
    handleSendEvent();
});

document.getElementById('messageInput').addEventListener('keypress', function (event) {
    var key = event.which || event.keyCode;
    if (key === 13) { // 13 is enter
        handleSendEvent();
    }
});

const handleSendEvent = () => {
    var message = document.getElementById("messageInput").value;

    chatConnection.invoke("SendMessage", nickName, message).catch(function (err) {
        return console.error(err.toString());
    });
    
    document.getElementById("messageInput").value = '';
}