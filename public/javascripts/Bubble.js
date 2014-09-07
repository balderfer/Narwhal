var bubbles = [];
var maxBubbleSpeed = 80.0;
var bubbleUpSpeed = 30;
var numberOfBubbles = 150;

var bubble = function (living, xpos, ypos) {
    this.radius = 3.0 * Math.random() + 1;

    this.x = xpos;
    this.y = ypos;

    this.alive = living;
}

function drawBubbles() {
    //draw bubbles
    for(i = 0; i < numberOfBubbles; i++) {
        if (bubbles[i].alive) {
            ellipser(bubbles[i].x + (-bubbles[i].radius/2) - sideScrollX,bubbles[i].y + (-bubbles[i].radius/2) - sideScrollY, bubbles[i].radius, bubbles[i].radius);
        }
    }
}

function ellipser(cx, cy, rx, ry){
    ctx.strokeStyle="rgb(211, 211, 211)";
    ctx.save(); // save state
    ctx.beginPath();

    ctx.translate(cx-rx, cy-ry);
    ctx.scale(rx, ry);
    ctx.fillStyle="rgb(211, 211, 211)";
    ctx.arc(1, 1, 1, 0, 2 * Math.PI, false);

    ctx.restore(); // restore to original state
    ctx.stroke();
}

//half the time returns the val as negative
function returnNeg (toNegate) {
    if(Math.random() * 100 > 50)
        return -toNegate;
    else
        return toNegate;
}

var updateBubbles = function(delta) {
    //update bubbles
    for(i = 0; i < numberOfBubbles; i++) {
        if(bubbles[i].alive == true) {
            bubbles[i].x += returnNeg(maxBubbleSpeed)*delta;
            bubbles[i].y -= bubbleUpSpeed*delta;

            if(bubbles[i].y < 0)
                bubbles[i].alive = false;
        }
    }
}
