let name = null
let visibility = ""
let people = ""
let oldMessage = ""
let newMessage = ""

// ENTER THE ROOM

function getName() {
    name = document.querySelector(".log__window input").value

    document.querySelector(".log__window").innerHTML = `
    <img src="images/bate-papo-uol.jfif" alt="logo UOL">
    <div>
        <img src="images/Eclipse.gif" alt="loading gif">
        <p class="loading__text">Loading...</p>
    </div>
    `
    enterRoom()
}

function enterRoom() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", {name: name})

    promise.then(callFunctions)
    promise.catch(enterError)
}

function callFunctions() {
    getParticipants()
    getMessages()
    setInterval(getMessages, 3000)
    setInterval(logMaintenance, 5000)
    setInterval(getParticipants, 10000)
}

function logMaintenance() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", {name: name})
}

function enterError(error) {
    document.querySelector(".log__window").innerHTML = `
    <img src="images/bate-papo-uol.jfif" alt="logo UOL">
    <div>
        <input type="text" placeholder="Write your name" class="log__input" data-identifier="enter-name">
        <button onclick="getName()" data-identifier="start">Enter</button>
    </div>
    <p class="log__error"></p>
    `
    
    let text = document.querySelector(".log__error")
    document.querySelector(".log__input").value = ""

    if (error.response.status === 400) {
        text.innerHTML = "Name already exists"
    } else {
        alert("ERROR")
    }

    inputLog = document.querySelector(".log__input")
    inputLog.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            document.querySelector("button").click()
        }
    })
}

function getParticipants() {
    document.querySelector(".log__window").classList.add("hidden")
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants")
    promise.then(showParticipants)
    promise.catch(participantsError)
}

function showParticipants(data) {
    let participants = data.data
    let html = document.querySelector(".contacts")

    if (people === name) {
        html.innerHTML = `
        <div class="contact" onclick="selectContact(this)" data-identifier="participant">
            <ion-icon name="people"></ion-icon>
            <p>All</p>
            <ion-icon name="checkmark-outline" class="check"></ion-icon>
        </div>
        <div class="contact selected" onclick="selectContact(this)" data-identifier="participant">
            <ion-icon name="person-circle"></ion-icon>
            <p>${name}</p>
            <ion-icon name="checkmark-outline" class="check"></ion-icon>
        </div>
        `
    } else if (people === "All") {
        html.innerHTML = `
        <div class="contact selected" onclick="selectContact(this)" data-identifier="participant">
            <ion-icon name="people"></ion-icon>
            <p>All</p>
            <ion-icon name="checkmark-outline" class="check"></ion-icon>
        </div>
        <div class="contact" onclick="selectContact(this)" data-identifier="participant">
            <ion-icon name="person-circle"></ion-icon>
            <p>${name}</p>
            <ion-icon name="checkmark-outline" class="check"></ion-icon>
        </div>
        `
    } else {
        html.innerHTML = `
        <div class="contact" onclick="selectContact(this)" data-identifier="participant">
            <ion-icon name="people"></ion-icon>
            <p>All</p>
            <ion-icon name="checkmark-outline" class="check"></ion-icon>
        </div>
        <div class="contact" onclick="selectContact(this)" data-identifier="participant">
            <ion-icon name="person-circle"></ion-icon>
            <p>${name}</p>
            <ion-icon name="checkmark-outline" class="check"></ion-icon>
        </div>
        `
    }

    for (let i = 0; i < participants.length; i++) {

        if (participants[i].name !== name) {

            if (people === participants[i].name) {
                html.innerHTML += `
                <div class="contact selected" onclick="selectContact(this)" data-identifier="participant">
                    <ion-icon name="person-circle"></ion-icon>
                    <p>${participants[i].name}</p>
                    <ion-icon name="checkmark-outline" class="check"></ion-icon>
                </div>
                `
            } else {
                html.innerHTML += `
                <div class="contact" onclick="selectContact(this)" data-identifier="participant">
                    <ion-icon name="person-circle"></ion-icon>
                    <p>${participants[i].name}</p>
                    <ion-icon name="checkmark-outline" class="check"></ion-icon>
                </div>
                `
            }

        }

    }

    if (document.querySelector(".contact.selected") === null) {
        document.querySelector(".contact:first-child").classList.add("selected")
        people = "All"
        document.querySelector(".visibility.selected").classList.remove("selected")
        document.querySelector(".visibility").classList.add("selected")
    } 
    visibility = document.querySelector(".visibility.selected").childNodes[3].innerHTML
    document.querySelector("footer p").innerHTML = `Sending to ${people} (${visibility})`

}

function participantsError(error) {
    alert("Failed to load participants")
    console.log(error.response)
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
            <div class="comment status" data-identifier="message">
                <div>
                    <time>${array[i].time}</time>
                    <strong>${array[i].from}</strong> 
                    <span>${array[i].text}</span>
                </div>
            </div>
            `
        } else if (array[i].type === "message") {
            main.innerHTML += `
            <div class="comment" data-identifier="message">
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
            if (name === array[i].to || name === array[i].from) {
                main.innerHTML += `
                <div class="comment private" data-identifier="message">
                    <div>
                        <time>${array[i].time}</time>
                        <strong>${array[i].from}</strong> 
                        <span>privately to</span> 
                        <strong>${array[i].to}</strong><span>:</span>
                        <p>${array[i].text}</p>
                    </div>
                </div>
                `
            }
        } else {
            alert("Error to render specific message")
        }

    }
    newMessage = document.querySelector(".comment:last-child")
    if (newMessage.innerHTML !== oldMessage.innerHTML) {
        newMessage.scrollIntoView()
        oldMessage = newMessage
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

    visibility = document.querySelector(".visibility.selected").childNodes[3].innerHTML
    people = document.querySelector(".contacts .selected").childNodes[3].innerHTML
    document.querySelector("footer p").innerHTML = `Sending to ${people} (${visibility})`
}

let inputLog = document.querySelector(".log__input")
inputLog.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    document.querySelector("button").click()
  }
})

let inputFooter = document.querySelector(".footer__input");
inputFooter.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    document.querySelector("footer ion-icon").click()
  }
})
