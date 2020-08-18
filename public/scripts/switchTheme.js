/**
 * Loads theme when the page loads
 */
function loadTheme() {
    const checkBox = document.getElementById("customSwitch1");

    if (localStorage.getItem('mode') === 'dark') {
        document.querySelector('body').classList.add('dark');
        document.getElementById("switchLabel").innerHTML = "Dark Theme";
        checkBox.checked = true;
    }
}

/**
 * Switch between themes
 */
function switchTheme2() {
    const checkBox = document.getElementById("customSwitch1");

    if (checkBox.checked == true){
        localStorage.setItem('mode','dark');
        document.querySelector('body').classList.add('dark');
        document.getElementById("switchLabel").innerHTML = "Dark Theme";
    } else {
        localStorage.setItem('mode','light');
        document.querySelector('body').classList.remove('dark');
        document.getElementById("switchLabel").innerHTML = "Switch Theme";
    }
}