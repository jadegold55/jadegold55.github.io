function updateClock() {
    const clock = document.getElementById('clock');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    let hours12;
    let ampm;

    if (hours >= 12) {
        hours12 = hours % 12 || 12;
        ampm = "pm"
    } else {
        hours12 = hours % 12 || 12;
        ampm = "am"
    }
    const minutes = String(now.getMinutes()).padStart(2, '0');
    clock.textContent = `${hours12}:${minutes} ${ampm}`;
}

setInterval(updateClock, 10000);
