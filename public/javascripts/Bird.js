var birds = [];
var maxBirdSpeed = 80.0;
var numberOfBirds = 30;

var bird = function (living, ypos) {
    this.width = 75;
    this.height = 75;

    this.animation = 0;
    this.deadAnimation = 0;

    this.speed = maxBirdSpeed * Math.random();

    this.x = gameWidth + sideScrollX;
    this.y = ypos;

    this.alive = living;
    this.recentlyDead = false;
}

function drawBirds() {
    //draw birds
    for(i = 0; i < numberOfBirds; i++) {
        if (birds[i].alive) {
            ctx.drawImage(birdSpriteSheet, (parseInt(birds[i].animation%3))*75, 0, 75, 75, birds[i].x - sideScrollX, birds[i].y - sideScrollY , 75, 75);
        }
        else if(birds[i].recentlyDead) {
            ctx.drawImage(birdSpriteSheet, (parseInt(birds[i].deadAnimation%3)+2)*75, 0, 75, 75, birds[i].x - sideScrollX, birds[i].y - sideScrollY , 75, 75);
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
            if(birds[i].x - sideScrollX < 0)
                birds[i].alive = false;
        }
        else if(birds[i].recentlyDead) {
            birds[i].deadAnimation += 3*delta;
            if(birds[i].deadAnimation > 3)
                birds[i].recentlyDead = false;
        }
    }
}
