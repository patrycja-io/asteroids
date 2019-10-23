

// frames per seconds
const FPS = 30; 

// 0= no friction , 1= a lot of friction
const friction = 0.7;

//LASER

const l_distance = 0.6; // max distance laser can travel as fraction of screen width

const l_duration = 0.1; // duration of the lasers' explosion in seconds

const laser_max = 10; // maximum number of lasers on screen at once

const laser_speed= 500; // speed of lasers in pixels per second



// numbers of enemies at the beginning
const enemy_num = 5;

// size of enemies = asteroids in pixels

const enemy_size = 100;

// speed of enemies = asteroids pixels per seconds

const enemy_speed = 50; 

// vertices on each enemy

const enemy_vert = 10;

//jaggedness of asteroids (0=none 1=lots)

const enemy_jag = 0.4;


const show_bounding = true; // show or hide collision bounding





// ship size in pixels
const shipsize = 30;

//speed of the ship degrees per sec

const ship_speed = 360; 

// ship trust - pixel per seconds

const ship_thrust = 5;

// explosion in seconds 
const ship_explode = 0.3;



/* Conected element from html - canvas*/

let canvas = document.getElementById("astroCanvas");

// Context from the canvas

let context = canvas.getContext("2d");




// SHIP

  // set up the spaceship object
  let ship = newShip();

function newShip () {
    return{
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
        y:0
    }

}
}




// ASTEROIDS

let enemies = [];
createAsteroidBelt();

// Game loop set up
setInterval(update, 1000 / FPS);



function createAsteroidBelt() {
  enemies = [];
  let x, y;
  for (let i = 0; i < enemy_num; i++) { // astreoids location
     
    do {
      x = Math.floor(Math.random() * canvas.width);
      y = Math.floor(Math.random() * canvas.height);
     
    } while (distBetweenPoints(ship.x, ship.y, x, y) < enemy_size * 2 + ship.r)
      enemies.push(newEnemy(x, y));
  }
}

function destroyAsteroid(index) {
    var x = enemies[index].x;
    var y = enemies[index].y;
    var r = enemies[index].r;

    // split the asteroid in two if necessary
    if (r == Math.ceil(enemy_size / 2)) { // large asteroid
        enemies.push(newEnemy(x, y, Math.ceil(enemy_size / 4)));
        enemies.push(newEnemy(x, y, Math.ceil(enemy_size / 4)));


    } else if (r == Math.ceil(enemy_size / 4)) { // medium asteroid
        enemies.push(newEnemy(x, y, Math.ceil(enemy_size / 8)));
        enemies.push(newEnemy(x, y, Math.ceil(enemy_size / 8)));
    }

    // destroy the asteroid
    enemies.splice(index, 1);
}

function explodeShip() {
    ship.explodeTime = Math.ceil(ship_explode * FPS);
}


function distBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2)+ Math.pow ( y2 - y1, 2 ));
}


// keys set up

document.addEventListener("keydown", keyDown); // pressed key
document.addEventListener("keyup", keyUp); //released key


function keyDown (/** @type {KeyboardEvent} */ event) {

    switch(event.keyCode) {

        //arrow left
        case 37: 
            ship.rot = ship_speed / 180 * Math.PI /FPS;
        break;

        //arrow up
        case 38:
            ship.thrusting = true;
        break;

        //arrow right
        case 39:
            ship.rot = - ship_speed / 180 * Math.PI / FPS;
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


// function - taking all parameters of asteroids together

 function newEnemy ( x, y, r) {
     let enemy = {
        x: x, 
        y: y,
        xv: Math.random() * enemy_speed / FPS * (Math.random() <0.5 ? 1: -1),
        yv: Math.random() * enemy_speed / FPS * (Math.random() <0.5 ? 1: -1)
       
        a: Math.random() * Math.PI * 2, // in radians
        offs: [],
        r: r,
        vert: Math.floor(Math.random() * (enemy_vert + 1) + enemy_vert / 2 ),    
     };

     //vertex offset 

     for (let i = 0; i < enemy.vert; i++){
         enemy.offs.push(Math.random() * enemy_jag * 2 + 1 - enemy_jag)
     }

     return enemy;
 }





// game function to draw the space, the ship and move 

function update() {

    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height)

// trusting the ship

if (ship.thrusting) {
  ship.thrust.x += ship_thrust * Math.cos(ship.a) / FPS;
  ship.thrust.y -= ship_thrust * Math.sin(ship.a) / FPS;
}else {
    ship.thrust.x -= friction * ship.thrust.x / FPS;
    ship.thrust.y -= friction * ship.thrust.y / FPS;
}
    





 // Drawing the ship 
 context.strokeStyle = "white" ;
 context.lineWidth = shipsize / 20;

 // drawing triangle
 context.beginPath();
 context.moveTo(

 //nose of the ship
     ship.x + 4 / 3 * ship.r * Math.cos(ship.a),
     ship.y - 4 / 3 * ship.r * Math.sin(ship.a)
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

if (show_bounding) {
    context.strokeStyle = "lime";
    context.beginPath();
    context.arc(ship.x, ship.y, ship.r, 0, Math.Pi * 2, false);
    context.stroke();
}


// drawing the enemies

context.strokeStyle = "#240090";  // color of the enemies
context.lineWidth = shipsize / 20;
let x, y, r, a, vert, offs;
for  (let i = 0; i < enemies.length; i++) {

   //enemies properites

   x = enemies[i].x;
   y = enemies[i].y;
   r = enemies[i].r;
   a = enemies[i].a;
   vert = enemies[i].vert;
   offs = enemies[i].offs;

   // draw a path

   context.beginPath();
   context.moveTo (
       x + r * offs [0] * Math.cos(a),
       y + r * offs [0] * Math.sin(a)
   );


 // draw the enemies = asteroids = polygons

 for ( let j = 1; j < vert; j++) {
     context.lineTo(
         x + r * offs [j] * Math.cos(a + j * Math.PI * 2 / vert),
         y + r * offs [j] * Math.sin(a + j * Math.PI * 2 / vert)
     );
 }
context.closePath();
context.stroke();

// draw the lasers
for (let i = 0; i < ship.lasers.length; i++) {
    if (ship.lasers[i].explodeTime == 0) {
        ctx.fillStyle = "salmon";
        ctx.beginPath();
        ctx.arc(ship.lasers[i].x, ship.lasers[i].y, shipsize / 15, 0, Math.PI * 2, false);
        ctx.fill();
    } else {
        // draw the eplosion
        ctx.fillStyle = "orangered";
        ctx.beginPath();
        ctx.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.75, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "salmon";
        ctx.beginPath();
        ctx.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.5, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "pink";
        ctx.beginPath();
        ctx.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.25, 0, Math.PI * 2, false);
        ctx.fill();
    }
}

// move the lasers
for (let i = ship.lasers.length - 1; i >= 0; i--) {
                
    // check distance travelled
    if (ship.lasers[i].dist > l_distance* canvas.width) {
        ship.lasers.splice(i, 1);
        continue;
    }

    // handle the explosion
    if (ship.lasers[i].explodeTime > 0) {
        ship.lasers[i].explodeTime--;

        // destroy the laser after the duration is up
        if (ship.lasers[i].explodeTime == 0) {
            ship.lasers.splice(i, 1);
            continue;
        }
    } else {
        // move the laser
        ship.lasers[i].x += ship.lasers[i].xv;
        ship.lasers[i].y += ship.lasers[i].yv;

        // calculate the distance travelled
        ship.lasers[i].dist += Math.sqrt(Math.pow(ship.lasers[i].xv, 2) + Math.pow(ship.lasers[i].yv, 2));
    }



// move the asteroids

enemies[i].x += enemies[i].xv;
enemies[i].y += enemies[i].yv;

//backstop on the borders

if (enemies[i].x < 0 - enemies[i].r){
    enemies[i].x = canvas.width = enemies[i].r;
} else if (enemies[i].x > canvas.width + enemies[i].r) {
    enemies[i].x = 0 - enemies[i].r
}

if (enemies[i].y < 0 - enemies [i].r){
    enemies[i].y = canvas.height = enemies[i].r;
} else if (enemies[i].y > canvas.height + enemies[i].r) {
    enemies[i].y = 0 - enemies[i].r
}




// rotating the ship
ship.a += ship.rot;


// move the ship
ship.x += ship.thrust.x;
ship.y += ship.thrust.y;

// dot centerizing ship

context.fillStyle ="indigo";
context.fillRect(ship.x -1 , ship.y -1, 2, 2);

// handle edge of screen
if (ship.x < 0 - ship.r) {
    ship.x = canvas.width + ship.r;
} else if (ship.x > canvas.width + ship.r) {
    ship.x = 0 - ship.r;
}
if (ship.y < 0 - ship.r) {
    ship.y = canvas.height + ship.r;
} else if (ship.y > canvas.height + ship.r) {
    ship.y = 0 - ship.r;
}









}





// "if loop to move ship back on the other side of the screen

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
}