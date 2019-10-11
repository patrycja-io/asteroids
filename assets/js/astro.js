/* Conected element from html - canvas*/

const canvas = document.getElementById("astroCanvas");

// Context from the canvas

const context = canvas.getContext("2d");

// frames per seconds
const FPS = 30; 





// numbers of enemies at the beginning
const enemy_num = 5;

// size of enemies = asteroids in pixels

const enemy_size = 100;

// speed of enemies = asteroids pixels per seconds

const enemy_speed = 50; 

// vertices on each enemy

const enemy_vert = 10;




// ship size in pixels
const shipsize = 30;

//speed of the ship degrees per sec

const speed = 360; 

// ship trust - pixel per seconds

const ship_thrust = 5;



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

const enemy =[];
createAsteroidBelt();




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
 function newEnemy ( x, y) {
     const enemy = {
         x: x, 
         y: y,
         xv: Math.random() * enemy_speed / FPS * (Math.random() <0.5 ? 1: -1),
         yv: Math.random() * enemy_speed / FPS * (Math.random() <0.5 ? 1: -1),
         r: enemy_size / 2,
         a: Math.random() * Math.PI * 2, // in radians
         vert: Math.floor(Math.random() *(enemy_vert + 1) + enemy_vert / 2 )

     };
     return enemy;
 }


// Game loop set up
setInterval(update, 1000 / FPS);


// game function to draw the ship and move 
function update(){


    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height)

// trusting the ship
if(ship.thrusting){
  ship.thrust.x += ship_thrust * Math.cos(ship.a) / FPS;
  ship.thrust.y -= ship_thrust * Math.sin(ship.a) / FPS;
}
    

 // drawing the ship 
 context.strokeStyle = "white" ,
 context.lineWidth = shipsize / 20;

 // drawing triangle
 context.beginPath();
 context.moveTo(

    //nose of the ship
     ship.x + 4 / 3 * ship.r * Math.cos(ship.a),
     ship.y - 4 / 3 * ship.r * Math.sin(ship.a),
 );

 context.lineTo(

     //rear left of the ship
    ship.x - ship.r * (2 / 3 * Math.cos(ship.a) + Math.sin(ship.a)),
    ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - Math.cos(ship.a))
     
 );
 context.lineTo(

    // rear right of the ship
   ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - Math.sin(ship.a)),
   ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + Math.cos(ship.a))
     
 );

 // line closing the ship

 context.closePath();
 // draw the path
    context.stroke();

// rotating the ship

ship.a += ship.rot;


// move the ship

ship.x += ship.thrust.x;
ship.y += ship.thrust.y;



// dot centerizing ship

context.fillStyle ="indigo";
context.fillRect(ship.x -1 , ship.y -1, 2, 2);






// drawing the enemies

 context.strokeStyle = "#240090";  // color of the enemies
 context.lineWidth = shipsize /20;




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