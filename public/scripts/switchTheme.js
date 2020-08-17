function loadTheme() {
    const checkBox = document.getElementById("customSwitch1");

    if (localStorage.getItem('mode') === 'dark') {
        document.querySelector('body').classList.add('dark');
        checkBox.checked = true;
    }
}

function switchTheme2() {
    const checkBox = document.getElementById("customSwitch1");

    if (checkBox.checked == true){
        localStorage.setItem('mode','dark');
        document.querySelector('body').classList.add('dark');
    } else {
        localStorage.setItem('mode','light');
        document.querySelector('body').classList.remove('dark');
    }
}