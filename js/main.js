const displayType = {
    jade: 'block',
    projects: 'block',
    terminal: 'flex'
};

const windowIds = {
    jade: 'jade-window',
    projects: 'projects-window',
    terminal: 'terminal-window'
};

const terminalResponses = {
    '/about': {
        text: "I'm Jade, an aspiring software engineer focused on building thoughtful, real-world software. My background is in computational mathematics, but most of my engineering experience comes from shipping projects outside the classroom."
    },
    '/interests': {
        text: 'I spend a lot of time around code, guitar, poetry, games, volunteering, teaching, and learning new systems. I am especially interested in AI and agentic tools right now.'
    },
    '/projects': {
        text: 'Opening the projects folder now. Current highlights: Creativity Spotlight, Delannoy Constructions, and Prompt Refiner.',
        action: () => openApp('projects')
    },
    '/skills': {
        text: 'Skills: Java, Python, Spring, React, Flask, PostgreSQL, SQLite, Docker, GitHub Actions, AWS EC2, and building product ideas end to end.'
    },
    '/help': {
        text: 'Available commands:\n/about\n/interests\n/projects\n/skills\n/help\n/clear'
    }
};

let nextWindowZIndex = 20;

document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    initializeWindowManager();
    initializeTerminal();
});

function isManagedWindow(windowElement) {
    return windowElement && windowElement.id !== 'loading-bar-container';
}

function initializeWindowManager() {
    const windows = document.querySelectorAll('.window');

    windows.forEach((windowElement) => {
        if (!isManagedWindow(windowElement)) {
            return;
        }

        enhanceWindow(windowElement);

        if (windowElement.style.display && windowElement.style.display !== 'none') {
            prepareWindow(windowElement);
        }
    });

    window.addEventListener('resize', () => {
        document.querySelectorAll('.window').forEach((windowElement) => {
            if (isManagedWindow(windowElement) && windowElement.style.display !== 'none') {
                constrainWindow(windowElement);
            }
        });
    });
}

function enhanceWindow(windowElement) {
    if (!isManagedWindow(windowElement) || windowElement.dataset.enhanced === 'true') {
        return;
    }

    const titlebar = windowElement.querySelector('.window-titlebar');
    if (titlebar) {
        titlebar.addEventListener('pointerdown', (event) => {
            if (event.button !== 0 || event.target.closest('.window-controls')) {
                return;
            }

            startDrag(event, windowElement);
        });
    }

    windowElement.addEventListener('pointerdown', () => activateWindow(windowElement));

    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'window-resize-handle';
    resizeHandle.setAttribute('aria-hidden', 'true');
    resizeHandle.addEventListener('pointerdown', (event) => {
        if (event.button !== 0) {
            return;
        }

        startResize(event, windowElement);
    });

    windowElement.appendChild(resizeHandle);
    windowElement.dataset.enhanced = 'true';
}

function prepareWindow(windowElement) {
    if (!isManagedWindow(windowElement)) {
        return;
    }

    enhanceWindow(windowElement);

    if (windowElement.dataset.positioned === 'true') {
        activateWindow(windowElement);
        constrainWindow(windowElement);
        return;
    }

    const rect = windowElement.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(windowElement);
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);

    windowElement.style.left = `${Math.round(rect.left)}px`;
    windowElement.style.top = `${Math.round(rect.top)}px`;
    windowElement.style.width = `${width}px`;
    windowElement.style.height = `${height}px`;
    windowElement.style.transform = 'none';
    windowElement.dataset.minWidth = String(Math.max(220, Math.round(width * 0.6)));
    windowElement.dataset.minHeight = String(Math.max(120, Math.round(height * 0.6)));
    windowElement.dataset.positioned = 'true';

    if (computedStyle.display === 'flex') {
        windowElement.dataset.displayMode = 'flex';
    }

    activateWindow(windowElement);
    constrainWindow(windowElement);
}

function activateWindow(windowElement) {
    nextWindowZIndex += 1;
    windowElement.style.zIndex = String(nextWindowZIndex);
}

function getTaskbarHeight() {
    const taskbar = document.getElementById('taskbar');
    return taskbar ? taskbar.offsetHeight : 0;
}

function constrainWindow(windowElement) {
    const rect = windowElement.getBoundingClientRect();
    const maxLeft = Math.max(0, window.innerWidth - 120);
    const maxTop = Math.max(0, window.innerHeight - getTaskbarHeight() - 40);
    const width = Math.min(rect.width, window.innerWidth - 16);
    const height = Math.min(rect.height, window.innerHeight - getTaskbarHeight() - 16);
    const nextLeft = clamp(parseFloat(windowElement.style.left) || rect.left, 0, maxLeft);
    const nextTop = clamp(parseFloat(windowElement.style.top) || rect.top, 0, maxTop);

    windowElement.style.left = `${Math.round(nextLeft)}px`;
    windowElement.style.top = `${Math.round(nextTop)}px`;
    windowElement.style.width = `${Math.round(width)}px`;
    windowElement.style.height = `${Math.round(height)}px`;
}

function startDrag(event, windowElement) {
    event.preventDefault();
    prepareWindow(windowElement);
    activateWindow(windowElement);

    const rect = windowElement.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    const handleMove = (moveEvent) => {
        const maxLeft = Math.max(0, window.innerWidth - 120);
        const maxTop = Math.max(0, window.innerHeight - getTaskbarHeight() - 40);
        const nextLeft = clamp(moveEvent.clientX - offsetX, 0, maxLeft);
        const nextTop = clamp(moveEvent.clientY - offsetY, 0, maxTop);

        windowElement.style.left = `${Math.round(nextLeft)}px`;
        windowElement.style.top = `${Math.round(nextTop)}px`;
    };

    const handleUp = () => {
        document.removeEventListener('pointermove', handleMove);
        document.removeEventListener('pointerup', handleUp);
    };

    document.addEventListener('pointermove', handleMove);
    document.addEventListener('pointerup', handleUp);
}

function startResize(event, windowElement) {
    event.preventDefault();
    event.stopPropagation();
    prepareWindow(windowElement);
    activateWindow(windowElement);

    const startRect = windowElement.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    const minWidth = Number(windowElement.dataset.minWidth) || 220;
    const minHeight = Number(windowElement.dataset.minHeight) || 120;

    const handleMove = (moveEvent) => {
        const nextWidth = clamp(
            startRect.width + (moveEvent.clientX - startX),
            minWidth,
            window.innerWidth - startRect.left - 8
        );
        const nextHeight = clamp(
            startRect.height + (moveEvent.clientY - startY),
            minHeight,
            window.innerHeight - getTaskbarHeight() - startRect.top - 8
        );

        windowElement.style.width = `${Math.round(nextWidth)}px`;
        windowElement.style.height = `${Math.round(nextHeight)}px`;
    };

    const handleUp = () => {
        document.removeEventListener('pointermove', handleMove);
        document.removeEventListener('pointerup', handleUp);
    };

    document.addEventListener('pointermove', handleMove);
    document.addEventListener('pointerup', handleUp);
}

function showWindow(windowElement, displayMode = 'block') {
    if (!windowElement) {
        return;
    }

    if (!isManagedWindow(windowElement)) {
        windowElement.style.display = displayMode;
        return;
    }

    windowElement.dataset.displayMode = displayMode;
    windowElement.style.display = displayMode;
    prepareWindow(windowElement);

    if (windowElement.id === 'terminal-window') {
        focusTerminalInput();
    }
}

function hideWindow(windowElement) {
    if (!windowElement) {
        return;
    }

    windowElement.style.display = 'none';
}

function openApp(appname) {
    const windowElement = document.getElementById(windowIds[appname]);

    if (!windowElement) {
        return;
    }

    if (windowElement.style.display && windowElement.style.display !== 'none') {
        showWindow(windowElement, displayType[appname]);
        return;
    }

    const loadingWindow = document.getElementById('loading-bar-container');
    const loadingBarFill = document.getElementById('loading-bar-fill');
    let progress = 0;

    loadingWindow.style.display = 'block';
    loadingBarFill.style.width = '0%';

    const interval = window.setInterval(() => {
        progress = Math.min(100, progress + Math.random() * 10 + 8);
        loadingBarFill.style.width = `${progress}%`;

        if (progress >= 100) {
            window.clearInterval(interval);
            loadingWindow.style.display = 'none';
            showWindow(windowElement, displayType[appname]);
        }
    }, 90);
}

function closeApp(appname) {
    hideWindow(document.getElementById(windowIds[appname]));
}

function openProject(name) {
    showWindow(document.getElementById(`project-${name}`), 'block');
}

function closeProject(name) {
    hideWindow(document.getElementById(`project-${name}`));
}

function initializeTerminal() {
    const input = document.getElementById('terminal-input');

    if (!input) {
        return;
    }

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendCommand();
        }
    });

    input.addEventListener('input', autoResizeTerminalInput);
    autoResizeTerminalInput();
}

function sendCommand() {
    const input = document.getElementById('terminal-input');
    const rawCommand = input.value.trim();

    if (!rawCommand) {
        return;
    }

    appendMessage({
        type: 'user',
        sender: 'you',
        avatar: ':)',
        text: rawCommand
    });

    input.value = '';
    autoResizeTerminalInput();

    const command = rawCommand.toLowerCase();

    if (command === '/clear') {
        resetTerminal();
        return;
    }

    const response = terminalResponses[command];

    if (!response) {
        appendMessage({
            type: 'me',
            sender: 'jade g (software engineer)',
            avatar: ':)',
            text: 'I do not know that command yet. Try /help to see the available commands.'
        });
        return;
    }

    appendMessage({
        type: 'me',
        sender: 'jade g (software engineer)',
        avatar: ':)',
        text: response.text
    });

    if (typeof response.action === 'function') {
        response.action();
    }
}

function resetTerminal() {
    const messages = document.getElementById('messages');

    if (!messages) {
        return;
    }

    messages.innerHTML = '';
    appendMessage({
        type: 'me',
        sender: 'jade g (software engineer)',
        avatar: ':)',
        text: "hey! i'm jade — type a command to learn more about me ♡\n\ncommands:\n/about\n/interests\n/projects\n/skills\n/help\n/clear"
    });
}

function appendMessage({ type, sender, avatar, text }) {
    const messages = document.getElementById('messages');

    if (!messages) {
        return;
    }

    const message = document.createElement('div');
    message.className = `msg ${type}`;

    const avatarElement = document.createElement('div');
    avatarElement.className = 'msg-avatar';
    avatarElement.textContent = avatar;

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';

    const senderElement = document.createElement('span');
    senderElement.className = 'sender';
    senderElement.textContent = sender;

    bubble.appendChild(senderElement);
    bubble.appendChild(document.createTextNode(text));
    message.appendChild(avatarElement);
    message.appendChild(bubble);
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

function autoResizeTerminalInput() {
    const input = document.getElementById('terminal-input');

    if (!input) {
        return;
    }

    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 92)}px`;
}

function focusTerminalInput() {
    const input = document.getElementById('terminal-input');

    if (input) {
        window.setTimeout(() => input.focus(), 0);
    }
}

function updateClock() {
    const clock = document.getElementById('clock');

    if (!clock) {
        return;
    }

    const now = new Date();
    const hour = now.getHours();
    const hours12 = hour % 12 || 12;
    const ampm = hour >= 12 ? 'pm' : 'am';
    const minutes = String(now.getMinutes()).padStart(2, '0');

    clock.textContent = `${hours12}:${minutes} ${ampm}`;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), Math.max(min, max));
}

window.setInterval(updateClock, 10000);