const gen_password_button = document.getElementById("generate-password-button");
const passwords_element = document.getElementById("passwords");
const passwords_arr = [];
const password_length = document.querySelector(".password-length");
const help_text = document.querySelector(".help-text");

password_length.addEventListener("input", function () {
    const passwordLength = password_length.value;
    if (passwordLength < 8 || passwordLength > 20){
        help_text.style.display = "block";
    }
    else {
        help_text.style.display = "none";
    }
});


gen_password_button.addEventListener("click", function () {
    var icon = document.getElementById("lock-icon");
    icon.classList.toggle("locked");
    setTimeout(function () {
        if (icon.classList.contains("locked")) {
            icon.src = "./assets/lock.png";
            generatePasswords(true);
        } else {
            icon.src = "./assets/unlock.png";
            generatePasswords(false);
        }
    }, 500);
});

function createPasswords(passwordLength) {

    const upper_case_letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    const lower_case_letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    const special_chars = ["@", "!", "#", "$", "%", "^", "&", "*", "(", ")", "=", "+", ":", ";", "~", "`", "[", "]", "?", ".", "-"];
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    const all_letters = upper_case_letters.concat(lower_case_letters);
    const special_chars_sub_dash_period = special_chars.filter(char => char !== "." && char !== "-");

    // dash, period, shouldn"t be first; https://www.ibm.com/docs/en/baw/20.x?topic=security-characters-that-are-valid-user-ids-passwords
    // logic inspired by https://rublon.com/blog/nist-password-guidelines/

    function getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    const password = [];
    const maxSpecialChars = Math.floor(passwordLength * 0.18);
    const maxNumbers = Math.floor(passwordLength * 0.2);
    let specialCharCount = 0;
    let numberCount = 0;
    password.push(getRandomElement(upper_case_letters));
    password.push(getRandomElement(lower_case_letters));

    for (let i = 2; i < passwordLength; i++) {
        let char;
        if (specialCharCount < maxSpecialChars) {
            char = getRandomElement(special_chars);
            specialCharCount++;
        } 
        else if (numberCount < maxNumbers){
            char = getRandomElement(numbers);
            numberCount++;
        } 
        else{
            char = getRandomElement(all_letters);
        }
        password.push(char);
    }

    shuffleArray(password);

    if (password[0] === "." || password[0] === "-") {
        for (let i = 1; i < passwordLength; i++) {
            if (special_chars_sub_dash_period.includes(password[i])) {
                let temp = password[i];
                password[i] = password[0];
                password[0] = temp;
                break;
            }
        }
    }

    return password.join("");
}

function generatePasswords(shouldGenerate) {
    if (shouldGenerate){
        passwords_arr.length = 0;
        passwords_element.innerHTML = "";
        const passwordLength = parseInt(password_length.value);

        if (passwordLength >= 8 && passwordLength <= 20) {
            for (let i = 0; i < 4; i++) {
                const newPassword = createPasswords(passwordLength);
                if (newPassword.length === passwordLength) {
                    passwords_arr.push(newPassword);
                    passwords_element.innerHTML += `<li>${newPassword}</li>`;
                } 
                else{
                    console.error("Generated password does not match desired length", newPassword);
                }
            }
        }
    } 
    else {
        passwords_element.innerHTML = "";
    }
}