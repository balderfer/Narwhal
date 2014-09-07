const narwhalAccel = 500.0;
const maxVelX = 200.0;
const maxVelY = 200.0;

var swimAnimation = 0;

var pressed = false;

var narwhalChar = function () {
    //for player size.
    this.scale = 1;
    this.width = 180;
    this.height = 60;

    this.xVelo = narwhalAccel;
    this.yVelo = 0.0;

    this.rotation = 0.0;

    this.x = (canvas.width / 4) - this.width/2;
    this.y = canvas.height/2 - this.height/2;

    this.underwater = false;
}

function drawNarwhal() {
    ctx.translate(narwhal.x, narwhal.y);
    ctx.rotate(narwhal.rotation*Math.PI/180);
    //ctx.drawImage(narwhalSwimming[swimAnimation], (-narwhal.width/2), (-narwhal.height/2), narwhal.width, narwhal.height);
    if(pressed && narwhal.yVelo > 0 && narwhal.underwater) {
        ctx.globalAlpha = .8;
        ctx.drawImage(narwhalSpriteSheet, (parseInt(swimAnimation%3))*60 + 1, 0, 60, 20, (-narwhal.width/2), (-narwhal.height/2), narwhal.width, narwhal.height);
        ctx.globalAlpha = 1.0;
    }
    else if(narwhal.underwater) {
        ctx.globalAlpha = .8;
        ctx.drawImage(narwhalSpriteSheet, 61, 0, 60, 20, (-narwhal.width/2), (-narwhal.height/2), narwhal.width, narwhal.height);
        ctx.globalAlpha = 1.0;
    }
    else {
        if(swimAnimation%5 > 2)
            ctx.drawImage(narwhalSpriteSheet, (parseInt(swimAnimation%5) - 2)*60 + 1, 20, 60, 20, (-narwhal.width/2), (-narwhal.height/2), narwhal.width, narwhal.height);
        else
            ctx.drawImage(narwhalSpriteSheet, (parseInt(swimAnimation%5))*60 + 1, 40, 60, 20, (-narwhal.width/2), (-narwhal.height/2), narwhal.width, narwhal.height);
    }
    ctx.rotate(-narwhal.rotation*Math.PI/180);
    ctx.translate(-narwhal.x, -narwhal.y);
}

function updateNarwhal(delta) {
    //above water velo
    if(!narwhal.underwater) {
        if (narwhal.yVelo < 0)
            narwhal.yVelo += (narwhalAccel/4) * delta;
        narwhal.yVelo += (narwhalAccel/2) * delta;
    }
    else {//underwater velocity
        narwhal.yVelo -= (narwhalAccel/2) * delta;
        if(pressed) {
            narwhal.yVelo += (narwhalAccel/6) * delta;
            if(narwhal.yVelo < 0) {
                narwhal.yVelo += (narwhalAccel/6) * delta;
            }
        }
        else if(narwhal.yVelo > 0) {
            narwhal.yVelo -= (narwhalAccel/4) * delta;
        }
    }

    //Is it underwater?
    if(!narwhal.underwater && sideScrollY > 0) {
        narwhal.underwater = true;
        narwhal.potentialAccel = narwhal.yVelo/50;
    }
    if(narwhal.underwater && sideScrollY < 0) {
        narwhal.underwater = false;
    }

    //update narwhal rotation
    narwhal.rotation = (narwhal.yVelo / 300) * 30;


    //update narwhal position
    sideScrollX += narwhal.xVelo * delta;
    sideScrollY += narwhal.yVelo * delta;

    if(narwhal.underwater)
        swimAnimation += 6*delta;
    else
        swimAnimation += 12*delta;

    /*if(narwhal.underwater) {
        //update animation
        if (swimAnimationOther) {
            swimAnimation++;
            if (swimAnimation > 3) {
                swimAnimation = 0;
            }
            swimAnimationOther = false;
        }
        else {
            swimAnimationOther = true;
        }
    }*/
}
