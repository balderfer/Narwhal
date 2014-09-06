var canvas;
var ctx;

var originalWidth = window.innerWidth;
if (originalWidth < 800) {
    originalWidth = 800;
}
var originalHeight = window.innerHeight;
console.log(originalWidth + ', ' + originalHeight);

var gameWidth = originalWidth;
var gameHeight = 3200;
var ratio = gameHeight/gameWidth;
var inverseRatio = gameWidth/gameHeight;
var scale = 1.2;//fb default: 1.08571428571
var zoomOut = 1;
var sideScrollX;
var sideScrollY = 100;
var initialRender = true;

var narwhalAccel = 100;
var narwhalVel = 50;

var pressed = false;
var underwater = false;

var fps = 25;
var lastTime;

var play = true;
var paused = false;

var waveCount;
var waveMoveCount = 0;

var mostPoints = 0;
var dogeUnlocked = false;
var cursorX = 0;

//image variables
var backgroundImage;
var narwhalImage;
var narwhalSwimming = [];

var nsc = 0;
var nscOther = true;

//java script b weird
var i = 0;
var k = 0;

var framecount = 0;

function loadImages() {
    backgroundImage = new Image();
    backgroundImage.src = '../images/background.png';
    narwhalImage = new Image();
    narwhalImage.src = '../images/narwhal.png';
    narwhalSwimming[0] = new Image();
    narwhalSwimming[0].src = '../images/narwhal1.png';
    narwhalSwimming[1] = new Image();
    narwhalSwimming[1].src = '../images/narwhal2.png';
    narwhalSwimming[2] = new Image();
    narwhalSwimming[2].src = '../images/narwhal3.png';
    narwhalSwimming[3] = new Image();
    narwhalSwimming[3].src = '../images/narwhal4.png';
    waveImage = new Image();
    waveImage.src = '../images/wave.png';
}

function init() {
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");

    canvas.width = originalWidth;
    canvas.height = originalHeight;

    document.body.appendChild(canvas);

    lastTime = Date.now();

    loadImages();


    start_game_loop();
    // narwhalSpriteSheet.onload = function() {
    // };
}

function start_game_loop() {

    setInterval(function () {
        game_loop();
        console.log(framecount++);
    }, fps);
}

function game_loop() {

    var currentTime = Date.now();

    var deltaTime = (currentTime - lastTime) / 1000;

    render(deltaTime);

    if (play && !paused) {
        update(deltaTime);
    }


    lastTime = currentTime;

    initialRender = false;
}

function render(delta) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();


}

function update(delta) {
    updateNarwhal(delta);
}


window.addEventListener('keypress', this.keyPressed , false);



function keyPressed(e) {
    var key = e.keyCode;
    e.preventDefault();

    if (underwater) {
        console.log("Space pressed...");
        narwhalAccel = 100;
       
        pressed = true;
        window.removeEventListener('keypress', this.keyPressed , false);
        window.addEventListener('keyup', this.keyReleased , false);
    }
}

function keyReleased(e) {
    var key = e.keyCode;
    e.preventDefault();

    console.log("Space released");
    if (underwater)
        narwhalAccel = -200;
    else
        narwhalAccel = narwhalAccel;
    pressed = false;
    window.removeEventListener('keyup', this.keyReleased , false);
    window.addEventListener('keypress', this.keyPressed , false);
}

function drawBackground() {
    var skyGradient = ctx.createLinearGradient(0, 0, 0, (canvas.height / 2));

    skyGradient.addColorStop(0.125,"#000015");
    skyGradient.addColorStop(1,"#3EC2FF");

    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, (canvas.height / 2));

    var oceanGradient = ctx.createLinearGradient(0, (canvas.height / 2), 0, canvas.height);

    oceanGradient.addColorStop(0,"#3D38FF");
    oceanGradient.addColorStop(1,"#000027");

    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, (canvas.height / 2), canvas.width, (canvas.height / 2));


    waveCount = Math.round(canvas.width / 40) + 5;
    
    ctx.drawImage(waveImage, (0 - waveMoveCount), ((canvas.height / 2) - 20), 1520, 20);
    waveMoveCount += 5;
    if (waveMoveCount > 35)
        waveMoveCount = 0;
}

function updateNarwhal(delta) {
    if (initialRender) {
        ctx.drawImage(narwhalImage, ((canvas.width / 4) - 95), (sideScrollY - 25), 190, 50);
    }
    else {
        narwhalVel = narwhalVel + (narwhalAccel * delta);
        // if (narwhalVel > 150) {
        //     narwhalVel = 150;
        // }
        sideScrollY = sideScrollY + (narwhalVel * delta);

        if (sideScrollY >= (canvas.height / 2)) {
            if (!pressed)
                narwhalAccel = -200;
            if (!underwater)
                narwhalVel *= 0.75;
            underwater = true;
        }
        else {
            underwater = false;
            narwhalAccel = 200;
        }

        var x = (canvas.width / 4);
        var y = sideScrollY;
        var rx = (canvas.width / 2);
        var ry = (canvas.height / 2);
        var rad = (narwhalVel / 300) * 30;
        ctx.translate(x, y);
        ctx.rotate(rad*Math.PI/180);
        if (underwater) {
            ctx.drawImage(narwhalSwimming[nsc], -95, -25, 190, 50);
            if (nscOther) {
                nsc++;
                if (nsc > 3) {
                    nsc = 0;
                }
                nscOther = false;
            }
            else {
                nscOther = true;
            }
        }
        else {
            ctx.drawImage(narwhalImage, -95, -25, 190, 50);
        }
        ctx.rotate(-rad*Math.PI/180);
        ctx.translate(-x, -y);
    }
}

