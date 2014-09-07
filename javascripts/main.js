var canvas = document.createElement("canvas");
var ctx;

var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
console.log(screenWidth + ', ' + screenHeight);

var gameWidth = 1000;
var gameHeight = 3200;
var ratio = gameHeight/gameWidth;
var inverseRatio = gameWidth/gameHeight;
var sideScrollX = 0;
var sideScrollY = -gameHeight/8;

var fps = 25;
var lastTime;

var play = false;
var paused = false;

var waveCount;
var waveMoveCount = 0;

var mostPoints = 0;

//image variables
var backgroundImage;
var narwhalImage;
var narwhalSwimming = [];

var framecount = 0;

var narwhal;

function init() {
    ctx = canvas.getContext("2d");

    canvas.width = screenWidth;
    canvas.height = screenHeight;

    document.body.appendChild(canvas);

    lastTime = Date.now();

    loadImages();

    reset_game();

     narwhalSwimming[3].onload = function() {
         start_game_loop();
     };
}

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

function reset_game() {
    play = false;
    paused = false;

    narwhal = new narwhalChar();

    var sideScrollX = 0;
    var sideScrollY = -gameHeight/8;
}

function start_game_loop() {

    setInterval(function () {
        game_loop();
        //console.log(framecount++);
    }, fps);
}

function game_loop() {

    var currentTime = Date.now();

    var deltaTime = (currentTime - lastTime) / 1000;

    if (play && !paused) {
        update(deltaTime);
    }

    render(deltaTime);

    lastTime = currentTime;

    initialRender = false;
}

function render(delta) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();

    drawNarwhal();

    if(play == false || paused == true) {
        ctx.font = ("26px 'Squada One'");
        ctx.fillStyle = "rgb(63, 50, 50)";
        ctx.fillText("Tap to play!", canvas.width/2 - 70, canvas.height/2 - 25);
    }
}

function drawBackground() {
    var skyGradient = ctx.createLinearGradient(0, -sideScrollY - gameHeight/2 + narwhal.y , 0, gameHeight/2 + sideScrollY + narwhal.y);

    skyGradient.addColorStop(0.125,"#000015");
    skyGradient.addColorStop(1,"#4EC8FF");

    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, -sideScrollY - gameHeight/2 + narwhal.y, canvas.width, gameHeight/2 - sideScrollY + narwhal.y);

    var oceanGradient = ctx.createLinearGradient(0, -sideScrollY + narwhal.y, 0, -sideScrollY + gameHeight/2);

    oceanGradient.addColorStop(0,"#3D38FF");
    oceanGradient.addColorStop(1,"#000027");

    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, -sideScrollY + narwhal.y, canvas.width, -sideScrollY + (gameHeight/2));
}

function update(delta) {
    //console.log("Update the narwhal! It's y: "+ sideScrollY);
    updateNarwhal(delta);
}


canvas.addEventListener('keydown', this.keyPressed , false);
canvas.addEventListener('keyreleased', this.keyReleased , false);

canvas.addEventListener('mousedown', this.mousePressed, false);
canvas.addEventListener('mouseup', this.mouseReleased, false);


function keyPressed(e) {
    var key = e.keyCode;
    e.preventDefault();

    pressed = true;

    if(play == false || paused == true) {
        play = true;
        paused = false;
    }
}

function keyReleased(e) {
    var key = e.keyCode;
    e.preventDefault();

    pressed = false;
}


function mousePressed(e) {
    var key = e.keyCode;
    e.preventDefault();

    pressed = true;

    if(play == false || paused == true) {
        play = true;
        paused = false;
    }
}


function mouseReleased(e) {
    var key = e.keyCode;
    e.preventDefault();

    pressed = false;
}
