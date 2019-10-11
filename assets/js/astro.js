/* Conected element from html - canvas*/

const canvas = document.getElementById("astroCanvas");

// Context from the canvas

const context = canvas.getContext("2d");

// frames per seconds
const FPS = 30; 

// ship size in pixels
const shipsize = 30;

//speed of the ship degrees per sec

const speed = 360; 



// SHIP


const ship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    r: shipsize / 2,
    //  direction of the ship conversion to radiance
    a: 90 / 180 * Math.PI,
    // rotation
    rot: 0,
    // thrusting of the ship parameter
    thrusting: false,
    thrust: {
        x:0,
        y:0,
    }

}


// ASTEROIDS




// keys set up
document.addEventListener("keydown", keyDown); // pressed key
document.addEventListener("keyup", keyUp); //released key

function keyDown (/** @type {KeyboardEvent} */ event) {
    switch(event.keyCode) {

        //arrow left
        case 37: 
        ship.rot = speed / 180 * Math.PI /FPS;
        break;

        //arrow up
        case 38:
            ship.thrusting = true;
        break;

        //arrow right
        case 39:
            ship.rot = - speed / 180 * Math.PI /FPS;
        break;

    }
}

function keyUp (/** @type {KeyboardEvent} */ event) {
    switch(event.keyCode) {

        //arrow left - stop 
        case 37: 
        ship.rot = 0;
        break;

        //arrow up - stop
        case 38:
        ship.thrusting = false;
        break;

        //arrow right - stop
        case 39:
            ship.rot = 0;
        break;

    }
}

// Game loop set up
setInterval(update, 1000 / FPS);


// game function to draw the ship and move 
function update(){


    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height)

 // drawing the ship 

 context.strokeStyle = "white" ,
 context.lineWidth = shipsize / 20;


 // drawing triangle

 context.beginPath();
 context.moveTo(

    //nose of the ship
     ship.x + ship.r * Math.cos(ship.a),
     ship.y - ship.r * Math.sin(ship.a),
 );

 context.lineTo(

     //rear left of the ship
    ship.x - ship.r * (Math.cos(ship.a) + Math.sin(ship.a)),
    ship.y + ship.r * (Math.sin(ship.a) - Math.cos(ship.a))
     
 );
 context.lineTo(

    // rear right of the ship
   ship.x - ship.r * (Math.cos(ship.a) - Math.sin(ship.a)),
   ship.y + ship.r * (Math.sin(ship.a) + Math.cos(ship.a))
     
 );

 // line closing the ship

 context.closePath();
 // draw the path
    context.stroke();


// if loop to make ship to go back on the other side of the screen

 if (ship.x < 0 - ship.r) {
     ship.x = canvas.width + ship.r;
} else if ( ship.x > canvas.width + ship.r){
    ship.x = 0 - ship.r;
}

if (ship.y < 0 - ship.r) {
    ship.y = canvas.height + ship.r;
} else if ( ship.y > canvas.height + ship.r){
   ship.y = 0 - ship.r;
}









}