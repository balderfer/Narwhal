var canvas = document.createElement("canvas");
var ctx;

var screenWidth = window.innerWidth;
if(screenWidth > 1000)
    screenWidth = 1000;
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
var boatImage;
var seaweedImage;
var fishToRightImage;
var backgroundImage;
var birdSpriteSheet;
var explodeSpriteSheet;
var narwhalSpriteSheet;

var framecount = 0;

var narwhal;
var bubbleCounter = 0.0;
var birdCounter = 0.0;
var boatCounter = 0.0;

var stuckNarwhal;
var deadNarwhal;

var cloudX1 = 0;
var cloudX2 = screenWidth;
var cloudY1 = -1500 + Math.random()*screenWidth/8;
var cloudY2 = -1500 + Math.random()*screenWidth/8;

var cloudImage1;
var cloudImage2;

var score = 0;

function init() {
    ctx = canvas.getContext("2d");

    canvas.width = screenWidth;
    canvas.height = screenHeight;

    document.body.appendChild(canvas);

    lastTime = Date.now();

    loadImages();

    for(var i = 0; i < numberOfBubbles; i++) {
        bubbles[i] = new bubble(false,0,0);
    }

    for(var i = 0; i < numberOfBirds; i++) {
        birds[i] = new bird(false,0);
    }

    for(var i = 0; i < numberOfBoats; i++) {
        boats[i] = new boat(false);
    }

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
    cloudImage1 = new Image();
    cloudImage1.src = '../images/clouds1.png';
    cloudImage2 = new Image();
    cloudImage2.src = '../images/clouds2.png';
    birdSpriteSheet = new Image();
    birdSpriteSheet.src = '../images/seagull.png';
    boatImage = new Image();
    boatImage.src = '../images/boat.png';
    explodeSpriteSheet = new Image();
    explodeSpriteSheet.src = '../images/explosion.png';
    seaweedImage = new Image();
    seaweedImage.src = '../images/seaweed.png';
    fishToRightImage = new Image();
    fishToRightImage.src = '../images/fishToRight.png';
}

function reset_game() {
    play = false;
    paused = false;

    score = 0;
    deadNarwhal = -1;

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

    drawBubbles();

    drawBirds();

    if(narwhal.alive)
        drawNarwhal();

    drawClouds();

    if(play == false || paused == true) {
        ctx.font = ("26px 'Squada One'");
        ctx.fillStyle = "rgb(63, 50, 50)";
        ctx.fillText("Tap to play!", screenWidth/2 - 70, screenHeight/2 - 25);
    }
}

function drawClouds() {
    ctx.drawImage(cloudImage1, -cloudX1, -sideScrollY + (narwhal.y) + cloudY1, screenWidth, 180);
    ctx.drawImage(cloudImage2, -cloudX2, -sideScrollY + (narwhal.y) + cloudY2, screenWidth, 180);
}

function drawBackground() {
    var spaceGradient = ctx.createLinearGradient(0, -sideScrollY*2 - gameHeight*2 + narwhal.y, screenWidth, -sideScrollY - gameHeight/2 + narwhal.y);

    spaceGradient.addColorStop(0.125,"#000030");
    spaceGradient.addColorStop(1,"#7ec0ee");

    ctx.fillStyle = spaceGradient;
    ctx.fillRect(0, -sideScrollY - gameHeight*2 + narwhal.y, screenWidth, -sideScrollY - gameHeight/2 + narwhal.y);

    var skyGradient = ctx.createLinearGradient(0, -sideScrollY - gameHeight/2 + narwhal.y , 0, gameHeight/2 + sideScrollY + narwhal.y);

    skyGradient.addColorStop(0,"#7ec0ee");
    skyGradient.addColorStop(1,"#ecf0f1");

    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, -sideScrollY - gameHeight/2 + narwhal.y, screenWidth, gameHeight/2 - sideScrollY + narwhal.y);

    var oceanGradient = ctx.createLinearGradient(0, -sideScrollY + narwhal.y, 0, -sideScrollY + gameHeight/2 + narwhal.y);

    oceanGradient.addColorStop(0,"#2a7eb4");
    oceanGradient.addColorStop(1,"#000037");

    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, -sideScrollY + narwhal.y, screenWidth, -sideScrollY + gameHeight);

    //THE FISH
    ctx.drawImage(fishToRightImage, -cloudX1, -sideScrollY + (narwhal.y) + gameHeight/2 - 300, screenWidth, 100);
    ctx.drawImage(fishToRightImage, -cloudX2, -sideScrollY + (narwhal.y) + gameHeight/2 - 300, screenWidth, 100);
    //THE FLOOR!!!!
    ctx.drawImage(seaweedImage, -cloudX1, -sideScrollY + (narwhal.y) + gameHeight/2 - 140, screenWidth, 140);
    ctx.drawImage(seaweedImage, -cloudX2, -sideScrollY + (narwhal.y) + gameHeight/2 - 140, screenWidth, 140);

    var currentWaveAnimation = parseInt(waveAnimation);
    for(var i = 0; i < (gameWidth/45) + 1;i++){
        ctx.globalAlpha = 0.6;
        ctx.drawImage(waveSpriteSheet,((5-(currentWaveAnimation+2)%6))*60, 0, 60, 60,-sideScrollX%45 + i*45, -sideScrollY + (narwhal.y) - 44 , 45, 45);
        ctx.globalAlpha = 1.0;
    }

    drawBoats();

    //drawing waves
    for(var i = 0; i < (gameWidth/30) + 1;i++){
        ctx.drawImage(waveSpriteSheet,((5-(currentWaveAnimation)%6))*60, 0, 60, 60,-sideScrollX%30 + i*30, -sideScrollY + (narwhal.y) - 29 , 30, 30);
    }
}

function update(delta) {
    if(deadNarwhal != -1) {
        if(!boats[deadNarwhal].recentlyDead)
            reset_game();
    }

    //console.log("Update the narwhal! It's y: "+ sideScrollY);
    updateNarwhal(delta);

    updateBubbles(delta);

    updateBirds(delta);

    updateBoats(delta);

    //updating waves
    waveAnimation += 6*delta;

    //creating bubbles for narwhal
    if(narwhal.underwater) {
        bubbleCounter += 0.1*delta;
        if(bubbleCounter > 0.01) {
            bubbleCounter = 0.0;
            if(Math.random()*10 > 4) {
                for(var k = 0; k < numberOfBubbles; k++) {
                    if(bubbles[k].alive == false) {
                        bubbles[k] = new bubble(true, narwhal.x + sideScrollX, narwhal.y + sideScrollY);
                        break;
                    }
                }
            }
        }
    }

    //creating new birds
    birdCounter += 3*delta;
    if(birdCounter > 0.3) {
        birdCounter = 0;
        if(Math.random()*10 > 4) {
            //console.log("New bird yo");
            for(var k = 0; k < numberOfBirds; k++) {
                if(birds[k].alive == false && birds[k].recentlyDead == false) {
                    birds[k] = new bird(true, -gameHeight + gameHeight*Math.random());
                    break;
                }
            }
        }
    }

    //creating new boats
    boatCounter += 0.5*delta;
    if(boatCounter > 5) {
        boatCounter = 0;
        if(Math.random()*10 > 4) {
            //console.log("New boat yo");
            for(var k = 0; k < numberOfBoats; k++) {
                if(boats[k].alive == false && boats[k].recentlyDead == false) {
                    boats[k] = new boat(true);
                    break;
                }
            }
        }
    }

    checkCollisions();
}

function checkCollisions() {
    //narwhal bird collision
    for(var i = 0; i < numberOfBirds; i++) {
        if(birds[i].alive) {
            //xbounds
            if(narwhal.x + narwhal.width * (3.0/2.0) > birds[i].x - sideScrollX && narwhal.x - narwhal.width * (3.0/2.0) < birds[i].x - sideScrollX) {
                //rough y bounds
                if(narwhal.y + narwhal.height/2 > birds[i].y - sideScrollY && narwhal.y - narwhal.height/2 < birds[i].y - sideScrollY) {
                    //console.log("Collision fired");
                    //fire collision
                    birds[i].alive = false;
                    birds[i].recentlyDead = true;
                    hitBird();
                    score += 100;
                }
            }
        }
    }

    //narwhal BOAT collision
    for(var i = 0; i < numberOfBoats; i++) {
        if(boats[i].alive) {
            //xbounds
            if(narwhal.x + narwhal.width * (3.0/2.0) > boats[i].x - sideScrollX && narwhal.x - narwhal.width * (3.0/2.0) < boats[i].x - sideScrollX) {
                //rough y bounds
                if(narwhal.y + narwhal.height * (3.0/2.0) > boats[i].y - sideScrollY && narwhal.y - narwhal.height * (3.0/2.0) < boats[i].y - sideScrollY) {
                    //console.log("Collision fired");
                    //fire collision
                    boats[i].alive = false;
                    boats[i].recentlyDead = true;
                    hitBird();
                    score += 500;

                    if(narwhal.yVelo < 0) {
                        narwhal.alive = false;
                        for(var k = 0; k < numberOfBoats; k++) {
                            if(!boats[k].alive && !boats[k].recentlyDead) {
                                boats[k].recentlyDead = true;
                                boats[k].x = narwhal.x;
                                boats[k].y = narwhal.y;
                                deadNarwhal = k;
                            }
                        }
                    }
                }
            }
        }
    }
}

window.addEventListener('keydown', this.keyPressed , false);
window.addEventListener('keyup', this.keyReleased , false);

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
