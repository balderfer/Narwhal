const narwhalAccel = 700.0;
const maxVelX = 200.0;
const maxVelY = 200.0;
const animationDuration = 30.0;

var swimAnimation = 0;

var pressed = false;

var narwhalChar = function () {
    //for player size.
    this.scale = 1;
    this.width = 180;
    this.height = 60;

    this.up = false;
    this.down = false;

    this.xVelo = narwhalAccel;
    this.yVelo = 0.0;

    this.rotation = 0.0;

    this.x = (canvas.width / 2) - this.width/2 - (canvas.width / 6);
    this.y = canvas.height/2 - this.height/2;

    this.underwater = false;

    this.alive = true;
}

function drawNarwhal() {
    ctx.translate(narwhal.x, narwhal.y);
    ctx.rotate(narwhal.rotation*Math.PI/180);
    //ctx.drawImage(narwhalSwimming[swimAnimation], (-narwhal.width/2), (-narwhal.height/2), narwhal.width, narwhal.height);
    if(narwhal.underwater) {//pressed && narwhal.yVelo > 0 &&
        ctx.globalAlpha = .8;
        ctx.drawImage(narwhalSpriteSheet, (parseInt(swimAnimation%3))*180 + 1, 0, 180, 60, (-narwhal.width/2), (-narwhal.height/2), narwhal.width, narwhal.height);
        ctx.globalAlpha = 1.0;
    }
    /*else if(narwhal.underwater) {
        ctx.globalAlpha = .8;
        ctx.drawImage(narwhalSpriteSheet, 181, 0, 180, 60, (-narwhal.width/2), (-narwhal.height/2), narwhal.width, narwhal.height);
        ctx.globalAlpha = 1.0;
    }*/
    else {
        if(swimAnimation%5 > 2)
            ctx.drawImage(narwhalSpriteSheet, (parseInt(swimAnimation%5) - 2)*180 + 1, 60, 180, 60, (-narwhal.width/2), (-narwhal.height/2), narwhal.width, narwhal.height);
        else
            ctx.drawImage(narwhalSpriteSheet, (parseInt(swimAnimation%5))*180 + 1, 120, 180, 60, (-narwhal.width/2), (-narwhal.height/2), narwhal.width, narwhal.height);
    }
    ctx.rotate(-narwhal.rotation*Math.PI/180);
    ctx.translate(-narwhal.x, -narwhal.y);
}

function hitBird() {
    if(narwhal.yVelo < 0) {
        narwhal.yVelo -= narwhalAccel/10;
    }
    else if(narwhal.yVelo > 0) {
        narwhal.yVelo += narwhalAccel/10;
    }
}

function updateNarwhal(delta) {
    //above water velo
    if(!narwhal.underwater) {
        if (narwhal.yVelo > 0)
            narwhal.yVelo -= (narwhalAccel/6) * delta;
        narwhal.yVelo += (narwhalAccel/2) * delta;
    }
    else {//underwater velocity
        /*if(pressed) {
            narwhal.yVelo += (narwhalAccel/6) * delta;
            if(narwhal.yVelo < 0) {
                narwhal.yVelo += (narwhalAccel/5) * delta;
            }
        }
        else if(narwhal.yVelo > 0) {
            narwhal.yVelo -= (narwhalAccel/5) * delta;
        }*/
    }

    //Is it underwater?
    if(!narwhal.underwater && sideScrollY > 0) {
        narwhal.underwater = true;
    }
    if(narwhal.underwater && sideScrollY < 0) {
        narwhal.underwater = false;
    }

    //update narwhal rotation
    narwhal.rotation = (narwhal.yVelo / 300) * 30;

    if(narwhal.rotation > 80)
        narwhal.rotation = 80;
    if(narwhal.rotation < -80)
        narwhal.rotation = -80;

    //update narwhal position
    sideScrollX += narwhal.xVelo * delta;
    sideScrollY += narwhal.yVelo * delta;

    //UPDATE CLOUDS LOL y here?!
    cloudX1 += narwhal.xVelo * delta;
    cloudX2 += narwhal.xVelo * delta;
    if(cloudX1 > screenWidth) {
        cloudY1 = -1500 + Math.random()*screenHeight/8;
        cloudX1 = -screenWidth;
    } else if(cloudX2 > screenWidth) {
        cloudY2 = -1500 + Math.random()*screenHeight/8;
        cloudX2 = -screenWidth;
    }

    if(narwhal.underwater) {
        if(pressed) {
            swimAnimation += animationDuration*delta;
            if(narwhal.yVelo > 0)
                narwhal.yVelo += (narwhalAccel/6) * delta;
            else if(narwhal.yVelo > 0)
                narwhal.yVelo -= (narwhalAccel/6) * delta;
            }
        else {
            //if(swimAnimation > 0)
            //    swimAnimation -= (animationDuration/4)*delta;
            sideScrollY -= (narwhalAccel/2) * delta;
        }
    }
    else
        swimAnimation += 12*delta;
}
