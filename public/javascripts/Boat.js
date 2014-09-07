var boats = [];
var numberOfBoats = 3;

var boat = function (living) {
    this.width = 210;
    this.height = 180;

    this.explodeWidth = 180;
    this.explodeHeight = 180;

    this.animation = 0;
    this.deadAnimation = 0;

    this.x = screenWidth + sideScrollX;
    this.y = screenHeight/2;

    this.alive = living;
    this.recentlyDead = false;
}

function drawBoats() {
    //draw boats
    for(i = 0; i < numberOfBoats; i++) {
        if (boats[i].alive) {
            ctx.drawImage(boatImage, boats[i].x - sideScrollX, boats[i].y - sideScrollY);
        }
        else if(boats[i].recentlyDead) {
            if(boats[i].deadAnimation > 3)
                ctx.drawImage(explodeSpriteSheet, (parseInt(boats[i].deadAnimation%3)+2)*boats[i].explodeWidth, 0, boats[i].explodeWidth, boats[i].explodeHeight, boats[i].x - sideScrollX, boats[i].y - sideScrollY , boats[i].explodeWidth, boats[i].explodeHeight);
            else
                ctx.drawImage(explodeSpriteSheet, (parseInt(boats[i].deadAnimation%3)-1)*boats[i].explodeWidth, boats[i].explodeHeight, boats[i].explodeWidth, boats[i].explodeHeight, boats[i].x - sideScrollX, boats[i].y - sideScrollY , boats[i].explodeWidth, boats[i].explodeHeight);
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

var updateBoats = function(delta) {
    //update boats
    for(i = 0; i < numberOfBoats; i++) {
        if(boats[i].alive == true) {
            boats[i].animation += 3*delta;
            if(boats[i].x - sideScrollX < -boats[i].width)
                boats[i].alive = false;
        }
        else if(boats[i].recentlyDead) {
            boats[i].deadAnimation += 3*delta;
            if(boats[i].deadAnimation > 6)
                boats[i].recentlyDead = false;
        }
    }
}
