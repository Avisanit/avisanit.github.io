const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let eyes = [];
let theta;
const mouse = {
    x: undefined,
    y: undefined
};

const theme = localStorage.getItem('theme').toString();

window.addEventListener("mousemove", function (e) {
    mouse.x = e.clientX - canvas.getBoundingClientRect().left;
    mouse.y = e.clientY - canvas.getBoundingClientRect().top;
});

class Eye {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    draw() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        theta = Math.atan2(dy, dx);

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        if (theme === 'light.css') {
            ctx.fillStyle = "rgb(205, 92, 92)";
        }
        else {
            ctx.fillStyle = "rgb(255,0,0)";
        }
        ctx.fill();
        ctx.closePath();

        let iris_x = this.x + Math.cos(theta) * this.radius / 10;
        let iris_y = this.y + Math.sin(theta) * this.radius / 10;
        let irisRadius = this.radius / 1.2;
        ctx.beginPath();
        ctx.arc(iris_x, iris_y, irisRadius, 0, Math.PI * 2, true);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();

        let pupilRadius = this.radius / 2.5;
        let pupil_x = this.x + Math.cos(theta) * this.radius / 1.9;
        let pupil_y = this.y + Math.sin(theta) * this.radius / 1.9;
        ctx.beginPath();
        ctx.arc(pupil_x, pupil_y, pupilRadius, 0, Math.PI * 2, true);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(pupil_x - pupilRadius / 3, pupil_y - pupilRadius / 3, pupilRadius / 2, 0, Math.PI * 2, true);
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fill();
        ctx.closePath();
    }
}
function init() {
    eyes = [];
    let overlapping = false;
    let numberOfEyes = Math.random()*40+50;
    let protection = 10000;
    let counter = 0;
    while (eyes.length < numberOfEyes && counter < protection) {
        let eye = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.floor(Math.random() * 140) + 10
        };
        overlapping = false;
        for (let i = 0; i < eyes.length; i++) {
            let previousEye = eyes[i];
            let dx = eye.x - previousEye.x;
            let dy = eye.y - previousEye.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < (eye.radius + previousEye.radius)) {
                overlapping = true;
                break;
            }
        }
        if (!overlapping) {
            eyes.push(new Eye(eye.x, eye.y, eye.radius));
        }
        counter++;
    }
}

function animate() {
    requestAnimationFrame(animate);
    if (theme === 'light.css') {
        ctx.fillStyle = "rgb(250, 128, 114)";
    }
    else {
        ctx.fillStyle = "rgb(0,0,0)";
    }

    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < eyes.length; i++) {
        eyes[i].draw();
    }
}

init();
animate();

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
})