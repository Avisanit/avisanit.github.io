const maxTime = 90; //in REAL second
let start_timestamp = null;
let time = 0;
let timeResult = {
    min: 0,
    sec: 0,
};
let resultPoint;

let soundCut = null;
let audioCut = null;

let canvas = null;
let ctx = null;
let canvasWidth = 700;
let canvasHeight = 400;

let bounds = null;
let hasLoaded = false;

let start = {
    x: 0,
    y: 0,
};
let mouse = {
    x: 0,
    y: 0,
};

let isDrawing = false;
let divisionLine;

let lvl = 2;
let lvlObj = [];
let moves = 0;

const objPartsNum = [9, 4, 3];
const objMoves = [4, 3, 2];
const objs = [
    [
        {
            x: 170,
            y: 20,
        },
        {
            x: 170,
            y: 380,
        },
        {
            x: 530,
            y: 380,
        },
        {
            x: 530,
            y: 20,
        },
    ],
    [
        {
            x: 170,
            y: 380,
        },
        {
            x: 290,
            y: 380,
        },
        {
            x: 290,
            y: 260,
        },
        {
            x: 530,
            y: 260,
        },
        {
            x: 530,
            y: 20,
        },
        {
            x: 410,
            y: 20,
        },
        {
            x: 410,
            y: 140,
        },
        {
            x: 290,
            y: 140,
        },
        {
            x: 290,
            y: 20,
        },
        {
            x: 170,
            y: 20,
        },
    ],
    [
        {
            x: 170,
            y: 40,
        },
        {
            x: 350,
            y: 380,
        },
        {
            x: 530,
            y: 40,
        },
    ],
];

lvlObj.push(objs[lvl]);
const mainSquare = squareCount(objs[lvl]);
let allPoints = [];
function draw() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0, canvasWidth, canvasHeight);
    ctx.lineCap = 'round';
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;

    for (const obj of lvlObj) {
        ctx.beginPath();
        ctx.lineWidth = 4;
        for (let i = 0; i < obj.length - 1; i++) {
            ctx.moveTo(obj[i].x, obj[i].y);
            ctx.lineTo(obj[i + 1].x, obj[i + 1].y);
        }
        ctx.moveTo(obj[obj.length - 1].x, obj[obj.length - 1].y);
        ctx.lineTo(obj[0].x, obj[0].y);
        ctx.stroke();

        if (moves === objMoves[lvl]) {
            const cent = centerFragment(obj);
            const ss = ((squareCount(obj) / mainSquare) * 100).toFixed(1);
            allPoints.push(ss);
            if (ss > 1) {
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.font = "18px Verdana";
                ctx.textAlign = "center";
                ctx.direction = "rtl";
                ctx.strokeText(`${ss}%`, cent.x, cent.y);
                ctx.stroke();
            }
        }
    }

    if (moves === objMoves[lvl]) {
        const accuracy = document.getElementById('accuracy');
        const accuracyPoints = countPoints(allPoints);
        accuracy.textContent = `ТОЧНОСТЬ:    ${accuracyPoints}`;
        const timeSolve = document.getElementById('timeSolve');
        timeResult.min = Math.round((time / 1000) / 60);
        timeResult.sec = Math.round(time/1000 - timeResult.min * 60);
        timeSolve.textContent = `ВРЕМЯ:    ${timeResult.min}:${timeResult.sec}`;
        const points = document.getElementById('points');
        resultPoint = countResultPoints(accuracyPoints);
        points.textContent = `БАЛЛЫ:    ${resultPoint}`;
        document.getElementById('results').style.display = 'flex';
        document.getElementById('lvl-b').style.opacity = '0.8';
    }

    if (isDrawing) {
        ctx.strokeStyle = "darkred";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(start.x,start.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
    }
}

function onmousedown(e) {
    if (hasLoaded && e.button === 0) {
        if (!isDrawing) {
            start.x = e.clientX - bounds.left;
            start.y = e.clientY - bounds.top;

            isDrawing = true;
        }

        draw();
    }
}

function intersects(line1, line2) {
    if (Math.max(line1.start.x, line1.end.x) < Math.min(line2.start.x, line2.end.x) ||
        Math.max(line2.start.x, line2.end.x) < Math.min(line1.start.x, line1.end.x) ||
        Math.max(line1.start.y, line1.end.y) < Math.min(line2.start.y, line2.end.y) ||
        Math.max(line2.start.y, line2.end.y) < Math.min(line1.start.y, line1.end.y)) {
        return {
            flag: false,
            x: line1.start.x,
            y: line1.start.y,
        };
    }

    let a1 = line1.start.y - line1.end.y;
    let b1 = line1.end.x - line1.start.x;
    let c1 = line1.start.x * line1.end.y - line1.end.x * line1.start.y;
    let a2 = line2.start.y - line2.end.y;
    let b2 = line2.end.x - line2.start.x;
    let c2 = line2.start.x * line2.end.y - line2.end.x * line2.start.y;

    let det = a1 * b2 - a2 * b1;
    if (det === 0) {
        return {
            flag: false,
            x: line1.start.x,
            y: line1.start.y,
        };
    }
    let x = Math.round((b1 * c2 - b2 * c1) / det);
    let y = Math.round((a2 * c1 - a1 * c2) / det);

    let xs = [line1.start.x, line1.end.x, line2.start.x, line2.end.x];
    let ys = [line1.start.y, line1.end.y, line2.start.y, line2.end.y];
    xs.sort(function(a,b) { return  a-b });
    ys.sort(function(a,b) { return  a-b });

    if (x >= xs[2] + 1 || x <= xs[1] - 1) {
        return {
            flag: false,
            x: line1.start.x,
            y: line1.start.y,
        };
    }

    if (y > ys[2] + 1 || y < ys[1] - 1) {
        return {
            flag: false,
            x: line1.start.x,
            y: line1.start.y,
        };
    }

    return {
        flag: true,
        x,
        y,
    };
}

function intersectObj (obj) {
    let count = 0;

    for (let i = 0; i < obj.length; i++) {
        const line = {
            start: {
                x: obj[i].x,
                y: obj[i].y,
            },
            end: {
                x: obj[(i + 1) % obj.length].x,
                y: obj[(i + 1) % obj.length].y,
            }
        };
        const dot = intersects(line, divisionLine);
        if (dot.flag) {
            count++;
        }
    }

    return (count > 1) && (count % 2 === 0);
}

function intersectLine (obj, id) {
    const line = {
        start: {
            x: obj[id].x,
            y: obj[id].y,
        },
        end: {
            x: obj[(id + 1) % obj.length].x,
            y: obj[(id + 1) % obj.length].y,
        }
    };
    return  intersects(line, divisionLine);
}

function insertInterDots(obj) {
    let newDots = [];
    let dotFlag = 0;

    for (let i = 0; i < obj.length; i++) {
        newDots.push(obj[i]);
        const dot = intersectLine(obj, i);
        if (dot.flag) {
            dotFlag++;
            const dot1 = {
                flag: dotFlag,
                x: dot.x,
                y: dot.y,
            };
            newDots.push(dot1);
            dotFlag++;
            const dot2 = {
                flag: dotFlag,
                x: dot.x,
                y: dot.y,
            };
            newDots.push(dot2);
        }
    }

    return newDots;
}

function lineMidpoint(dot1, dot2) {
    return {
        x: (dot1.x + dot2.x) / 2,
        y: (dot1.y + dot2.y) / 2,
    };
}

//Функция возвращает true, если точка принадлежит многоугольнику, иначе — false.
function inPoly(obj, dot) {
    let xs = [];
    let ys = [];
    for (const objDot of obj) {
        xs.push(objDot.x);
        ys.push(objDot.y);
    }
    let j = obj.length - 1;
    let c = 0;
    for (let i = 0; i < obj.length; i++) {
        if ((((ys[i] <= dot.y) && (dot.y < ys[j])) || ((ys[j] <= dot.y) && (dot.y < ys[i]))) &&
            (dot.x > (xs[j] - xs[i]) * (dot.y - ys[i]) / (ys[j] - ys[i]) + xs[i])) {
            c = !c
        }
        j = i;
    }
    return c;
}

function bypassType(obj) {
    let dot1, dot4;
    for (const dot of obj) {
        if (dot.flag === 1) {
            dot1 = dot;
        }
        if (dot.flag === 4) {
            dot4 = dot;
            break;
        }
    }
    console.log(obj);
    const midDot = lineMidpoint(dot1, dot4);
    console.log(midDot);

    return inPoly(obj, midDot);
}

function splitScheme1 (obj) {
    let result = [];
    let newObj = [];
    let innerFlag = 2;
    let inNewObj = false;
    let ids = [];

    for (let i = 0; i < obj.length; i++) {
        if (obj[i].flag === innerFlag && innerFlag % 2 === 0) {
            newObj.push({
                x: obj[i].x,
                y: obj[i].y,
            });
            inNewObj = true;
            innerFlag++;
            ids.push(i);
            continue;
        }
        if (obj[i].flag === innerFlag && (innerFlag + 1) % 4 === 0) {
            newObj.push({
                x: obj[i].x,
                y: obj[i].y,
            });
            result.push(newObj);
            newObj = [];
            inNewObj = false;
            innerFlag += 3;
            ids.push(i);
            continue;
        }
        if (inNewObj) {
            newObj.push(obj[i]);
            ids.push(i);
        }
    }

    let cnt = 0;
    for (const id of ids) {
        obj.splice(id - cnt, 1);
        cnt++;
    }

    for (let i = 0; i < obj.length; i++) {
        newObj.push({
            x: obj[i].x,
            y: obj[i].y,
        });
    }

    result.push(newObj);

    return result;
}

function shiftObj(obj, shift) {
    const fl = obj.slice(shift);
    const fl1 = obj.slice(0, shift);
    return fl.concat(fl1);
}

//линия 1-4 вне фигуры
function splitScheme2 (obj) {
    let result = [];
    let newObj = [];
    let innerFlag = 4;
    let inNewObj = false;
    let ids = [];

    for (let i = 0; i < obj.length; i++) {
        if (obj[i].flag === 1) {
            obj = shiftObj(obj, i + 1);
            break;
        }
    }

    for (let i = 0; i < obj.length; i++) {
        if (obj[i].flag === innerFlag && innerFlag % 4 === 0) {
            newObj.push({
                x: obj[i].x,
                y: obj[i].y,
            });
            inNewObj = true;
            innerFlag++;
            ids.push(i);
            continue;
        }
        if (obj[i].flag === innerFlag && (innerFlag - 1) % 4 === 0) {
            newObj.push({
                x: obj[i].x,
                y: obj[i].y,
            });
            result.push(newObj);
            newObj = [];
            inNewObj = false;
            innerFlag += 3;
            ids.push(i);
            continue;
        }
        if (inNewObj) {
            newObj.push(obj[i]);
            ids.push(i);
            if (i === obj.length - 1) {
                result.push(newObj);
                newObj = [];
            }
        }
    }

    let cnt = 0;
    for (const id of ids) {
        obj.splice(id - cnt, 1);
        cnt++;
    }

    for (let i = 0; i < obj.length; i++) {
        newObj.push({
            x: obj[i].x,
            y: obj[i].y,
        });
    }

    result.push(newObj);

    return result;
}

function onmouseup(e) {
    audioCut.play();
    if (hasLoaded && e.button === 0) {
        if (isDrawing) {
            divisionLine = {
                start: {
                    x: start.x,
                    y: start.y,
                },
                end: {
                    x: mouse.x,
                    y: mouse.y,
                },
            };

            isDrawing = false;

            if (intersectObj(objs[lvl])) {
                moves++;
                if (moves === objMoves[lvl]) {
                    time += (Date.now() - start_timestamp);
                    start_timestamp = null;
                }
                redrowMoves();

                let newObjStat = [];

                for (let obj of lvlObj) {

                    if (!intersectObj(obj)) {
                        console.log('not ', obj);
                        newObjStat.push(obj);
                        continue;
                    }

                    obj = insertInterDots(obj);

                    if (bypassType(obj)) {
                        newObjStat.push(...splitScheme1(obj));
                    }
                    else {
                        newObjStat.push(...splitScheme2(obj));
                    }
                }
                console.log(newObjStat);
                lvlObj = newObjStat;
            }
        }

        draw();
    }
}

function onmousemove(e) {
    if (hasLoaded) {
        mouse.x = e.clientX - bounds.left;
        mouse.y = e.clientY - bounds.top;

        if (isDrawing) {
            draw();
        }
    }
}

function timerOnPlay() {
    if (start_timestamp === null) {
        document.getElementById('saver').style.display = 'none';
        start_timestamp = new Date();
    }
}

function timerOnPause() {
    if (start_timestamp !== null) {
        document.getElementById('saver').style.display = 'flex';
        time += (Date.now() - start_timestamp);
        start_timestamp = null;
    }
}

function drawMoves() {
    const moveParent = document.getElementById('moveId');
    const pen = document.createElement('img');
    const xPicture = document.createElement('img');
    const movePicture = document.createElement('img');
    if (localStorage.getItem('theme').toString() === 'light.css') {
        pen.src = '../assets/img/pen1.png';
        xPicture.src = '../assets/img/x1.png';
        movePicture.src = `../assets/img/${objMoves[lvl]}1.png`;
    }
    else {
        pen.src = '../assets/img/pen2.png';
        xPicture.src = '../assets/img/x2.png';
        movePicture.src = `../assets/img/${objMoves[lvl]}2.png`;
    }
    moveParent.appendChild(pen);
    moveParent.appendChild(xPicture);
    moveParent.appendChild(movePicture);
}

function redrowMoves() {
    const moveParent = document.getElementById('moveId');
    moveParent.removeChild(moveParent.lastChild);
    const movePicture = document.createElement('img');
    if (localStorage.getItem('theme').toString() === 'light.css') {
        movePicture.src = `../assets/img/${(objMoves[lvl]-moves)}1.png`;
    }
    else {
        movePicture.src = `../assets/img/${(objMoves[lvl]-moves)}2.png`;
    }
    document.getElementById('moveId').appendChild(movePicture);
}

function setTheme() {
    if (localStorage.getItem('theme').toString() === 'black.css') {
        document.getElementById('theme').href = '../assets/css/black.css';
        document.getElementById('path1').src = '../assets/img/main2.png';
        document.getElementById('path2').src = '../assets/img/reload2.png';
        document.getElementById('level1').src = '../assets/img/heart2.png';
        document.getElementById('level2').src = '../assets/img/heart2.png';
        document.getElementById('level3').src = '../assets/img/heart2.png';
        document.getElementById('timerPlay1').src = '../assets/img/playGame2.png';
        document.getElementById('timerPause1').src = '../assets/img/pauseGame2.png';
    }
}

window.onload = function() {
    canvas = document.getElementById("canvas1");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.onmousedown = onmousedown;
    canvas.onmouseup = onmouseup;
    canvas.onmousemove = onmousemove;

    bounds = canvas.getBoundingClientRect();
    ctx = canvas.getContext("2d");
    hasLoaded = true;

    soundCut = JSON.parse(localStorage.getItem('gameClick'));
    audioCut = document.getElementById(soundCut.name);
    audioCut.volume = soundCut.volume;

    const fileName = location.href.split("/").slice(-1)[0];
    if (fileName !== 'settings.html') {
        localStorage.setItem('prev', fileName);
    }

    document.getElementById('parts').textContent = objPartsNum[lvl].toString();
    document.getElementById('timerPlay').addEventListener('click', timerOnPlay);
    document.getElementById('timerPause').addEventListener('click', timerOnPause);
    setTheme();
    drawMoves();
    drawPaths();

    draw();
}

function squareCount(obj) {
    let xs = [];
    let ys = [];

    for (const dot of obj) {
        xs.push(Number(dot.x));
        ys.push(Number(dot.y));
    }
    let n = obj.length;

    let square = 0;

    for (let i = 0; i < n - 1; i++){
        square += xs[i] * ys[i + 1] - ys[i] * xs[i + 1];
    }

    square += xs[n - 1] * ys[0] - ys[n - 1] * xs[0];
    square /= 2;
    square = Math.abs(square);
    return square;
}

function centerFragment(obj) {
    let xs = 0;
    let ys = 0;

    for (const dot of obj) {
        xs += dot.x;
        ys += dot.y;
    }
    let n = obj.length;

    return {
        x: xs / n,
        y: ys / n,
    };
}

function countPoints(arr) {
    if (arr.length !== objPartsNum[lvl]) {
        return 0;
    }

    const ideal = (100 / objPartsNum[lvl]).toFixed(1);
    const maxDiff = Math.abs(Math.max(...arr)- ideal);
    const minDiff = Math.abs(Math.min(...arr) - ideal);

    if (maxDiff < 1 && minDiff < 1) {
        return 5;
    }
    if (maxDiff < 2 && minDiff < 2) {
        return 4;
    }
    if (maxDiff < 3 && minDiff < 3) {
        return 3;
    }
    if (maxDiff < 4 && minDiff < 4) {
        return 2;
    }
    if (maxDiff < 5 && minDiff < 5) {
        return 1;
    }
    return 0;
}

function countResultPoints(acr) {
    const userTime = timeResult.min * 60 + timeResult.sec;
    if (userTime > maxTime || acr === 0) {
        return 0;
    }
    return (maxTime-userTime) * acr;
}

function saveInfo() {
    if (resultPoint > 0) {
        localStorage.setItem('lvl3', resultPoint);
    }
}

function drawPaths() {
    document.getElementById('path01').addEventListener('click', (e) => {
        saveInfo();
        window.location.href = '../index.html';
    });
    document.getElementById('path02').addEventListener('click', (e) => {
        window.location.reload();
    });
    document.getElementById('path03').addEventListener('click', (e) => {
        saveInfo();
        const objText = {
            user: localStorage.getItem('currUser'),
            level1: localStorage.getItem('lvl1'),
            level2: localStorage.getItem('lvl2'),
            level3: localStorage.getItem('lvl3'),
        }
        let text = JSON.stringify(objText);
        let filename = "USERSTAT.txt";

        download(filename, text);
    });
}

function download(file, text) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8, ' + encodeURIComponent(text));
    element.setAttribute('download', file);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}