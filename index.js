const genpasswordButton = document.getElementById("generate-password-button");
const passwordsElement = document.getElementById("passwords");
const passwordsArr = [];
const passwordLength = document.querySelector(".password-length");
const helpText = document.querySelector(".help-text");
let isAlertShown = false; // flag to track if the notif has been shown

passwordLength.addEventListener("input", function () {
    const passwordLengthValue = passwordLength.value;
    if (passwordLengthValue < 8 || passwordLengthValue > 20) {
        helpText.style.display = "block";
    }
    else {
        helpText.style.display = "none";
    }
});


genpasswordButton.addEventListener("click", function () {
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

function createPasswords(passwordLengthValue) {

    const upperCaseLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    const lowerCaseLetters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    const specialChars = ["@", "!", "#", "$", "%", "^", "&", "*", "(", ")", "=", "+", ":", ";", "~", "`", "[", "]", "?", ".", "-", "<", ">"];
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    const allLetters = upperCaseLetters.concat(lowerCaseLetters);
    const specialcharsSubDashPeriod = specialChars.filter(char => char !== "." && char !== "-");

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
    const maxSpecialChars = Math.floor(passwordLengthValue * 0.18);
    const maxNumbers = Math.floor(passwordLengthValue * 0.2);
    let specialCharCount = 0;
    let numberCount = 0;
    password.push(getRandomElement(upperCaseLetters));
    password.push(getRandomElement(lowerCaseLetters));

    for (let i = 2; i < passwordLengthValue; i++) {
        let char;
        if (specialCharCount < maxSpecialChars) {
            char = getRandomElement(specialChars);
            specialCharCount++;
        }
        else if (numberCount < maxNumbers) {
            char = getRandomElement(numbers);
            numberCount++;
        }
        else {
            char = getRandomElement(allLetters);
        }
        password.push(char);
    }

    shuffleArray(password);

    if (password[0] === "." || password[0] === "-") {
        for (let i = 1; i < passwordLengthValue; i++) {
            if (specialcharsSubDashPeriod.includes(password[i])) {
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
    if (shouldGenerate) {
        passwordsArr.length = 0;
        passwordsElement.innerHTML = "";
        const passwordLengthValue = parseInt(passwordLength.value);

        if (passwordLengthValue >= 8 && passwordLengthValue <= 20) {
            for (let i = 0; i < 4; i++) {
                const newPassword = createPasswords(passwordLengthValue);
                if (newPassword.length === passwordLengthValue) {
                    passwordsArr.push(newPassword);
                    const listItem = document.createElement("li");
                    listItem.textContent = newPassword;
                    listItem.addEventListener('click', function () {
                        navigator.clipboard.writeText(newPassword)
                            .then(() => {
                                if (!isAlertShown) { // limit to one alert
                                    alert("Password copied to clipboard!");
                                    isAlertShown = true;
                                }
                            })
                            .catch(err => console.error("Failed to copy password: ", err));
                    });
                    passwordsElement.appendChild(listItem);
                }
                else {
                    console.error("Password generated doesn't match intended length", newPassword);
                }
            }
        }
    }
    else {
        passwordsElement.innerHTML = "";
        isAlertShown = false;
    }
}
