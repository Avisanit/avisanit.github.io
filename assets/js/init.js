window.onload = function () {
    const fileName = location.href.split("/").slice(-1)[0];

    if (fileName !== 'settings.html') {
        localStorage.setItem('prev', fileName);
    }

    let theme;

    if (localStorage.getItem('theme') === null) {
        theme = 'light.css';
        localStorage.setItem('theme', theme);
    }
    else {
        theme = localStorage.getItem('theme').toString();
        const currSetTheme = document.getElementById('theme');
        if (fileName === 'index.html') {
            if (theme === 'light.css') {
                currSetTheme.href = 'assets/css/light.css';
            }
            else {
                currSetTheme.href = 'assets/css/black.css';
            }
        }
        else {
            if (theme === 'light.css') {
                currSetTheme.href = '../assets/css/light.css';
            }
            else {
                currSetTheme.href = '../assets/css/black.css';
            }
        }
    }

    let gameClick;

    if (localStorage.getItem('gameClick') === null) {
        gameClick = {
            name: 'knife1',
            volume: 0.5,
        };
        localStorage.setItem('gameClick', JSON.stringify(gameClick));
    }
    else {
        gameClick = JSON.parse(localStorage.getItem ('gameClick'));
        const audioClick = document.getElementById(gameClick.name);
        audioClick.volume = gameClick.volume;
    }

    let currUser;

    if (localStorage.getItem('currUser') === null) {
        currUser = ' ';
        localStorage.setItem('currUser', ' ');
    }
    else {
        currUser = localStorage.getItem('currUser');
    }
};






