let name = null

enterRoom()


// ENTER THE ROOM

function enterRoom() {
    name = prompt("What's your name?")
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", {name: name})
    promise.then(setInterval(logMaintenance, 5000))
    promise.then(setInterval(getMessages, 1000))
    promise.catch(enterError)
}

function logMaintenance() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", {name: name})
}

function enterError(error) {
    if (error.response.status === 400) {
        alert("Name already exists")
    } else {
        alert("ERROR")
    }
    console.log(error.response)
    enterRoom()
}


// RENDER MESSAGES

function getMessages() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages")
    promise.then(renderMessages)
    promise.catch(errorMessages)
}

function renderMessages(data) {
    let array = []
    array = data.data
    let main = document.querySelector("main")
    main.innerHTML = ""
    for (let i = 0; i < array.length; i++) {

        if (array[i].type === "status") {
            main.innerHTML += `
            <div class="comment status">
                <div>
                    <time>${array[i].time}</time>
                    <strong>${array[i].from}</strong> 
                    <span>${array[i].text}</span>
                </div>
            </div>
            `
        } else if (array[i].type === "message") {
            main.innerHTML += `
            <div class="comment">
                <div>
                    <time>${array[i].time}</time>
                    <strong>${array[i].from}</strong> 
                    <span>to</span> 
                    <strong>${array[i].to}</strong><span>:</span>
                    <p>${array[i].text}</p>
                </div>
            </div>
            `
        } else if (array[i].type === "private_message") {
            main.innerHTML += `
            <div class="comment private">
                <div>
                    <time>${array[i].time}</time>
                    <strong>${array[i].from}</strong> 
                    <span>privately to</span> 
                    <strong>${array[i].to}</strong><span>:</span>
                    <p>${array[i].text}</p>
                </div>
            </div>
            `
        } else {
            alert("Error to render specific message")
        }

    }
}

function errorMessages(error) {
    alert("Error to render the messages")
    console.log(error.response)
}

function sendMessage() {
    let text = document.querySelector("footer input").value
    let type = document.querySelector(".visibility.selected").childNodes[3].innerHTML
    let to = document.querySelector(".contact.selected").childNodes[3].innerHTML
    if (to === "All") {
        to = "Todos"
    }
    
    if (type === "Public" && text !== "") {
        type = "message"
        let list = {
            from: name,
            to: to, 
            text: text, 
            type: type
        }
        const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", list)
        promise.catch(sendError)
    } else if (type === "Private" && text !== "") {
        type = "private_message"
        let list = {
            from: name,
            to: to, 
            text: text, 
            type: type
        }
        const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", list)
        promise.catch(sendError)
    }
    document.querySelector("footer input").value = ""
}

function sendError() {
    alert("Failed to send the message")
}


// HTML CSS

function showSidebar() {
    document.querySelector("aside").classList.toggle("hidden")
}

function selectContact(element) {
    let selectedContact = document.querySelector(".contacts .selected")
    let selectedVisibility = document.querySelector(".visibility.selected")
    if (selectedContact !== null && element.parentNode.classList.contains("contacts")) {
        selectedContact.classList.remove("selected")
    } else if (selectedVisibility !== null && element.parentNode.classList.contains("contacts") === false) {
        selectedVisibility.classList.remove("selected")
    }
    element.classList.toggle("selected")
}
