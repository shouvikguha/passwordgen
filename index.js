const gen_password_button = document.getElementById("generate-password-button")
const passwords_element = document.getElementById("passwords")

gen_password_button.addEventListener("click", function() {
    var icon = document.getElementById("lock-icon");
    icon.classList.toggle("locked");
    setTimeout(function() {
        if (icon.classList.contains("locked")) {
            icon.src = "lock.png";
        } else {
            icon.src = "unlock.png";
        }
    }, 500); 
    generatePasswords(); 
});


function generatePasswords(){
    for 
}
