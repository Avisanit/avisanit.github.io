const volueEff = document.getElementById('vol2');

volueEff.onchange = function() {
    const gameClick = JSON.parse(localStorage.getItem ('gameClick'));
    gameClick.volume = this.value / 100;
    localStorage.setItem('gameClick', JSON.stringify(gameClick));
    document.getElementById(gameClick.name).volume = gameClick.volume;
    document.getElementById(gameClick.name).play();
}

volueEff.oninput = function() {
    const gameClick = JSON.parse(localStorage.getItem ('gameClick'));
    gameClick.volume = this.value / 100;
    localStorage.setItem('gameClick', JSON.stringify(gameClick));
    document.getElementById(gameClick.name).volume = gameClick.volume;
    document.getElementById(gameClick.name).play();
}

const playerTheme = document.querySelectorAll('.btn-theme');

for (const themeButt of playerTheme) {
    themeButt.addEventListener('click', (e) => {
        if (e.target.id === 'theme1') {
            localStorage.setItem('theme', 'light.css');
            document.getElementById('theme01').classList.add('choice');
            document.getElementById('theme02').classList.remove('choice');
            document.getElementById('theme').href = '../assets/css/light.css';
        }
        else {
            localStorage.setItem('theme', 'black.css');
            document.getElementById('theme01').classList.remove('choice');
            document.getElementById('theme02').classList.add('choice');
            document.getElementById('theme').href = '../assets/css/black.css';
        }
    });
}

const playerBackSound = document.querySelectorAll('.btn-sound');

for (const backButt of playerBackSound) {
    backButt.addEventListener('click', (e) => {
        const backSound = JSON.parse(localStorage.getItem('backSound'));
        if (e.target.id === 'sound1') {
            backSound.name = 'back1';
            localStorage.setItem('backSound', JSON.stringify(backSound));
            document.getElementById('sound01').classList.add('choice');
            document.getElementById('sound02').classList.remove('choice');
        }
        else {
            backSound.name = 'back2';
            localStorage.setItem('backSound', JSON.stringify(backSound));
            document.getElementById('sound01').classList.remove('choice');
            document.getElementById('sound02').classList.add('choice');
        }
    });
}

const playerClickSound = document.querySelectorAll('.btn-click');

for (const clickButt of playerClickSound) {
    clickButt.addEventListener('click', (e) => {
        const gameClick = JSON.parse(localStorage.getItem ('gameClick'));
        if (e.target.id === 'click1') {
            gameClick.name = 'knife1';
            localStorage.setItem('gameClick', JSON.stringify(gameClick));
            document.getElementById('click01').classList.add('choice');
            document.getElementById('click02').classList.remove('choice');
        }
        else {
            gameClick.name = 'knife2';
            localStorage.setItem('gameClick', JSON.stringify(gameClick));
            document.getElementById('click01').classList.remove('choice');
            document.getElementById('click02').classList.add('choice');
        }
    });
}

window.onload = function () {
    const theme = localStorage.getItem('theme').toString();
    if (theme === 'light.css') {
        const elem = document.getElementById('theme01');
        elem.classList.add('choice');
        document.getElementById('theme').href = '../assets/css/light.css';
    }
    else {
        const elem = document.getElementById('theme02');
        elem.classList.add('choice');
        document.getElementById('theme').href = '../assets/css/black.css';
    }

    const gameClick = JSON.parse(localStorage.getItem('gameClick'));
    if (gameClick.name === 'knife1') {
        const audioClick = document.getElementById('click01');
        audioClick.classList.add('choice');
    }
    else {
        const audioClick = document.getElementById('click02');
        audioClick.classList.add('choice');
    }
    volueEff.value = gameClick.volume * 100;

    const linkBack = document.getElementById('back');
    if (localStorage.getItem('prev').toString() !== 'index.html') {
        linkBack.href = localStorage.getItem('prev').toString();
    }
}

