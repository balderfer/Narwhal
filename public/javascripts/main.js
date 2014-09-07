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

var waveAnimation = 0;
var waveSpriteSheet;

var mostPoints = 0;

//image variables
var backgroundImage;
var narwhalSpriteSheet;

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

     narwhalSpriteSheet.onload = function() {
         start_game_loop();
     };
}

function loadImages() {
    waveSpriteSheet = new Image();
    waveSpriteSheet.src = '../images/waves.png';
    narwhalSpriteSheet = new Image();
    narwhalSpriteSheet.src = '../images/narwhal.png';
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

    if (play && !paused && deltaTime < 0.1) {
        update(deltaTime);


    }

    render(deltaTime);

    lastTime = currentTime;

    initialRender = false;
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();

    drawNarwhal();

    if(play == false || paused == true) {
        ctx.font = ("26px 'Squada One'");
        ctx.fillStyle = "rgb(63, 50, 50)";
        ctx.fillText("Tap to play!", screenWidth/2 - 70, screenHeight/2 - 25);
    }
}

function drawBackground() {
    var spaceGradient = ctx.createLinearGradient(0, -sideScrollY - gameHeight/2 + narwhal.y , 0, gameHeight/2 + sideScrollY + narwhal.y);

    spaceGradient.addColorStop(0.125,"#000030");
    spaceGradient.addColorStop(1,"#7ec0ee");

    ctx.fillStyle = spaceGradient;
    ctx.fillRect(0, -sideScrollY - gameHeight*2 + narwhal.y, screenWidth, gameHeight*2 - gameHeight/2 - sideScrollY + narwhal.y);

    var skyGradient = ctx.createLinearGradient(0, -sideScrollY - gameHeight/2 + narwhal.y , 0, gameHeight/2 + sideScrollY + narwhal.y);

    skyGradient.addColorStop(0.125,"#7ec0ee");
    skyGradient.addColorStop(1,"#ecf0f1");

    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, -sideScrollY - gameHeight/2 + narwhal.y, screenWidth, gameHeight/2 - sideScrollY + narwhal.y);

    var oceanGradient = ctx.createLinearGradient(0, -sideScrollY + narwhal.y, 0, -sideScrollY + gameHeight/2);

    oceanGradient.addColorStop(0,"#2a7eb4");
    oceanGradient.addColorStop(1,"#000037");

    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, -sideScrollY + narwhal.y, screenWidth, -sideScrollY + (gameHeight/2));

    var currentWaveAnimation = parseInt(waveAnimation);

    //drawing waves
    for(var i = 0; i < gameWidth/30;i++){
        ctx.drawImage(waveSpriteSheet,((5-(currentWaveAnimation)%6))*15, 0, 15, 15, i*30, -sideScrollY + (narwhal.y) - 29 , 30, 30);
    }
    for(var i = 0; i < gameWidth/45;i++){
        ctx.globalAlpha = 0.6;
        ctx.drawImage(waveSpriteSheet,((5-(currentWaveAnimation+2)%6))*15, 0, 15, 15, i*45, -sideScrollY + (narwhal.y) - 44 , 45, 45);
        ctx.globalAlpha = 1.0;
    }
}

function update(delta) {
    //console.log("Update the narwhal! It's y: "+ sideScrollY);
    updateNarwhal(delta);

    //updating waves
    waveAnimation += 6*delta;
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
