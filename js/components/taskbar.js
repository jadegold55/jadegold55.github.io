document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('btn-start');
    const startMenu = document.getElementById('start-menu');
    const bunny = document.getElementById('bunny-critter');

    if (!startButton || !startMenu) {
        return;
    }

    const closeStartMenu = () => {
        startMenu.classList.remove('is-open');
        startMenu.setAttribute('aria-hidden', 'true');
        startButton.classList.remove('is-active');
        startButton.setAttribute('aria-expanded', 'false');

        if (bunny) {
            bunny.style.display = '';
        }
    };

    const openStartMenu = () => {
        startMenu.classList.add('is-open');
        startMenu.setAttribute('aria-hidden', 'false');
        startButton.classList.add('is-active');
        startButton.setAttribute('aria-expanded', 'true');

        if (bunny) {
            bunny.style.display = 'none';
        }
    };

    const toggleStartMenu = () => {
        if (startMenu.classList.contains('is-open')) {
            closeStartMenu();
            return;
        }

        openStartMenu();
    };

    startButton.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleStartMenu();
    });

    startMenu.addEventListener('click', (event) => {
        const menuItem = event.target.closest('.start-menu-item');

        if (!menuItem) {
            event.stopPropagation();
            return;
        }

        const appName = menuItem.dataset.app;
        closeStartMenu();

        if (typeof window.openApp === 'function') {
            window.openApp(appName);
        }
    });

    document.addEventListener('click', (event) => {
        if (!startMenu.classList.contains('is-open')) {
            return;
        }

        if (event.target.closest('#start-menu') || event.target.closest('#btn-start')) {
            return;
        }

        closeStartMenu();
    });
});
