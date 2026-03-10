function openTerminal() {
    document.getElementById("landing-window").style.display = "none";
    document.getElementById("terminal-window").style.display = "flex";

}

function closeTerminal() {
    document.getElementById("terminal-window").style.display = "none";
    document.getElementById("landing-window").style.display = "block";
}