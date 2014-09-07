var birds = [];
var maxBirdSpeed = 80.0;
var numberOfBirds = 30;

var bird = function (living, ypos) {
    this.width = 75;
    this.height = 75;

    this.animation = 0;
    this.deadAnimation = 0;

    this.speed = maxBirdSpeed * Math.random();

    this.x = screenWidth + sideScrollX;
    this.y = ypos;

    this.alive = living;
    this.recentlyDead = false;
}

function drawBirds() {
    //draw birds
    for(i = 0; i < numberOfBirds; i++) {
        if (birds[i].alive) {
            ctx.drawImage(birdSpriteSheet, (parseInt(birds[i].animation%3))*birds[i].width, 0, birds[i].width, birds[i].height, birds[i].x - sideScrollX, birds[i].y - sideScrollY , birds[i].width, birds[i].height);
        }
        else if(birds[i].recentlyDead) {
            ctx.drawImage(birdSpriteSheet, (parseInt(birds[i].deadAnimation%3)+2)*birds[i].width, 0, birds[i].width, birds[i].height, birds[i].x - sideScrollX, birds[i].y - sideScrollY , birds[i].width, birds[i].height);
        }
    }
}

//half the time returns the val as negative
function getNeg (toNegate) {
    if(Math.random() * 100 > 50)
        return -toNegate;
    else
        return toNegate;
}

var updateBirds = function(delta) {
    //update birds
    for(i = 0; i < numberOfBirds; i++) {
        if(birds[i].alive == true) {
            birds[i].x -= birds[i].speed*delta;

            birds[i].animation += 3*delta;
            if(birds[i].x - sideScrollX < -birds[i].width)
                birds[i].alive = false;
        }
        else if(birds[i].recentlyDead) {
            birds[i].deadAnimation += 6*delta;
            if(birds[i].deadAnimation > 3)
                birds[i].recentlyDead = false;
        }
    }
}
