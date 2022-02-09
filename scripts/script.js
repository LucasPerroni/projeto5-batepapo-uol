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
