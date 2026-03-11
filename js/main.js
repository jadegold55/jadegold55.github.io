document.addEventListener('DOMContentLoaded', () => {
    // Initialize taskbar clock
    updateClock();
});

const displayType = {
    jade: 'block',
    projects: 'block',
    terminal: 'flex'
}
const windowIds = {
    jade: 'jade-window',
    projects: 'projects-window',
    terminal: 'terminal-window'
}

function openApp(appname) {

    const windowId = windowIds[appname];
    document.getElementById('loading-bar-container').style.display = 'block';
    let loadingBarFill = document.getElementById('loading-bar-fill');
    loadingBarFill.style.width = '0%';
    let progress = 0;
    let interval = setInterval(() => {
        progress += Math.random() * (15 - 5) + 5;
        loadingBarFill.style.width = progress + '%';
        if (progress >= 100) {
            clearInterval(interval);
            document.getElementById('loading-bar-container').style.display = 'none';
            document.getElementById('desktop-icons').style.display = 'none';
            document.getElementById(windowId).style.display = displayType[appname];
        }
    }, 100);

}

function closeApp(appname) {
    const windowIds = {
        jade: 'jade-window',
        projects: 'projects-window',
        terminal: 'terminal-window'
    }
    const windowId = windowIds[appname];
    document.getElementById(windowId).style.display = 'none';
    document.getElementById('desktop-icons').style.display = 'flex';

}