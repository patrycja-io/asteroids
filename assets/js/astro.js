
//game settings
const FPS = 30; // frames per seconds
const friction = 0.7; // 0= no friction , 1= a lot of friction
const gameLives = 3;// number of given lives
const laserDistance = 0.6; // max distance laser can travel as fraction of screen width
const laserDuration = 0.1; // duration of the lasers' explosion in seconds
const laserMax = 10; // maximum number of lasers on screen at once
const laserSpeed= 500; // speed of lasers in pixels per second
const pointsForLargeAsteroids = 20; // points scored for a large asteroid
const pointsForMediumAsteroids = 50; // points scored for a medium asteroid
const pointForSmallAsteroids = 100; // points scored for a medium asteroid
const saveScore = "highscore"; // save key for local storage of high score
const enemyNum = 3;// numbers of enemies at the beginning
const enemySize = 100;// size of enemies = asteroids in pixels
const enemySpeed = 50; // speed of enemies = asteroids pixels per seconds
const enemyVert = 10; // vertices on each enemy
const enemyJag = 0.4;//jaggedness of asteroids (0=none 1=lots)
const showBunding = false; // show or hide collision bounding
const shipSize = 30;// ship size in pixels
const shipSpeed = 360; //speed of the ship degrees per sec
const shipThrust = 5; // ship trust - pixel per seconds
const shipExplode = 0.3; // explosion in seconds 
const shipBlinkDuration = 0.1; //duration in seconds of one blink
const explodeDuration = 0.3; // duration of the ship explosion
const shipInvisible = 3; //ship invisibility in sec
const timeText = 2.5 ;// fading time in seconds
const textSize = 50; //text font height in pixels

// html- canvas
let canvas = document.getElementById("astroCanvas");
let context = canvas.getContext("2d");
let level, lives, enemies, score, scoreHigh, ship, text, textAlpha; // set up the game parameters
newGame();

// Game loop set up
setInterval(update, 1000 / FPS);

/** 
* function drawing the ship, and thrusting direction after being navigated
*/
function newShip () {
    return{
    x: canvas.width / 2,
    y: canvas.height / 2,
    r: shipSize / 2,
    a: 90 / 180 * Math.PI, 
    blinkNum: Math.ceil(shipInvisible / shipBlinkDuration),
    blinkTime: Math.ceil(shipBlinkDuration * FPS),
    canShoot: true,
    dead: false,
    explodeTime: 0,
    lasers: [],
    rot: 0,
    thrusting: false, 
    thrust: {
        x:0,
        y:0
    }
  }
}

 /** 
 * function releasing asteroids 
*/
function createAsteroidBelt() {
  enemies = [];
  let x, y;
  for (let i = 0; i < enemyNum; i++) { 
    do {
      x = Math.floor(Math.random() * canvas.width);
      y = Math.floor(Math.random() * canvas.height);   
    } while (distBetweenPoints(ship.x, ship.y, x, y) < enemySize * 2 + ship.r)
      enemies.push(newEnemy(x, y, Math.ceil(enemySize / 2)));
  }
}

 /** 
 * function making enemies dead after shooting , counting points, and splitting them on half after being shooted. As well satrting new leverl when ll of them ahs been destroyed
*/
function destroyAsteroid(index) {
    let x = enemies[index].x;
    let y = enemies[index].y;
    let r = enemies[index].r;

   
    if (r == Math.ceil(enemySize / 2)) { 
        enemies.push(newEnemy(x, y, Math.ceil(enemySize / 4)));
        enemies.push(newEnemy(x, y, Math.ceil(enemySize / 4)));
        score += pointsForLargeAsteroids;
    } else if (r == Math.ceil(enemySize / 4)) { 
        enemies.push(newEnemy(x, y, Math.ceil(enemySize / 8)));
        enemies.push(newEnemy(x, y, Math.ceil(enemySize / 8)));
        score += pointsForMediumAsteroids;
    } else {
        score += pointForSmallAsteroids;

    } if (score > scoreHigh) { 
       scoreHigh = score;
       localStorage.setItem(saveScore, scoreHigh);
    } 
     enemies.splice(index, 1); 
   
      if (enemies.length == 0) { 
                level++;
                newLevel();
    }
}

function distBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow ( y2 - y1, 2 ));
}

function explodeShip() {
    ship.explodeTime = Math.ceil(shipExplode * FPS);
}

 /** 
 * function drawing the ship
*/
function drawShip(x, y, a, colour = "magenta") {
    context.strokeStyle = colour;
    context.lineWidth = shipSize / 20;
    context.beginPath();
    context.moveTo( // nose of the ship
        x + 4 / 3 * ship.r * Math.cos(a),
        y - 4 / 3 * ship.r * Math.sin(a)
    );
    context.lineTo( // rear left
        x - ship.r * (2 / 3 * Math.cos(a) + Math.sin(a)),
        y + ship.r * (2 / 3 * Math.sin(a) - Math.cos(a))
    );
    context.lineTo( // rear right
        x - ship.r * (2 / 3 * Math.cos(a) - Math.sin(a)),
        y + ship.r * (2 / 3 * Math.sin(a) + Math.cos(a))
    );
    context.closePath();
    context.stroke();
}
function explodeShip() {
    ship.explodeTime = Math.ceil(shipExplode * FPS);
}
function gameOver() {
    ship.dead = true;
    text = "Game Over";
    textAlpha = 2.0;
    document.location.reload(true);  
   
}

 /** added event listener to keydown and keyup
 * 
*/
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp); 

 /** function saying what will happen when you will press assigned key keyboards
*/

function keyDown (event) {  
    if (ship.dead) {
        return;
    }switch(event.keyCode) {
      case 32:
        shootLaser();
        break;
      case 37: 
        ship.rot = shipSpeed / 180 * Math.PI /FPS;
        break;
      case 38:  
        ship.thrusting = true;
        break;
      case 39: 
        ship.rot = - shipSpeed / 180 * Math.PI / FPS;
        break;
    }
}

 /** function saying what will happened if key will be realeased
*/

function keyUp (event) {
    if (ship.dead) {
        return;
    }switch(event.keyCode) {
       case 32: 
          ship.canShoot = true;
          break;
       case 37: 
          ship.rot = 0;
          break;
       case 38: 
          ship.thrusting = false;
          break;
       case 39:  
          ship.rot = 0;
          break;
    }
}
 /** function building asteroids
 * 
*/
 function newEnemy ( x, y, r) {
    let lvlMult = 1 + 0.1 * level;
     let enemy = {
        x: x, 
        y: y,
        xv: Math.random() * enemySpeed * lvlMult / FPS * (Math.random() <0.5 ? 1: -1),
        yv: Math.random() * enemySpeed * lvlMult / FPS * (Math.random() <0.5 ? 1: -1),
        a: Math.random() * Math.PI * 2, // in radians
        r: r,
        offs: [],
        vert: Math.floor(Math.random() * (enemyVert + 1) + enemyVert / 2 ),    
     };
     for (let i = 0; i < enemy.vert; i++) {
         enemy.offs.push(Math.random() * enemyJag * 2 + 1 - enemyJag);
     }
     return enemy;
 }

  /** 
* function  starting new game
*/

function newGame() {
    level = 0;
    lives = gameLives;
    score = 0;
    ship = newShip();

    let scoreStr = localStorage.getItem(saveScore);// get the high score from local storage
    if (scoreStr == null) {
        scoreHigh = 0;
    } else {
        scoreHigh = parseInt(scoreStr);
    }

newLevel();
}

 /** function making lasers for shooting in asteroids
 * 
*/
 function shootLaser(){
     if(ship.canShoot && ship.lasers.length <laserMax){
         ship.lasers.push({ // from the nose of the ship
            x: ship.x + 4 / 3 * ship.r * Math.cos(ship.a),
            y: ship.y - 4 / 3 * ship.r * Math.sin(ship.a),
            xv: laserSpeed * Math.cos(ship.a) / FPS,
            yv: -laserSpeed * Math.sin(ship.a) / FPS,
            dist: 0,
            explodeTime:0
        });
     }
     ship.canShoot = false; //prevent further shooting
 }

 function newLevel() {
    text = "Level " + (level + 1);
    textAlpha = 1.0;
    createAsteroidBelt();
}

function update() {
    let blinkOn = ship.blinkNum % 2 == 0;
    let exploding = ship.explodeTime > 0;
 // game function to draw the space, the ship and move    
        context.fillStyle = "black";
        context.fillRect(0, 0, canvas.width, canvas.height);
// draw the asteroids 
    let x, y, r, a, vert, offs;
    for  (let i = 0; i < enemies.length; i++) {
        context.strokeStyle = "purple" ;   // Drawing the ship 
        context.lineWidth = shipSize / 20; 
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
        context.closePath(); //line closing the ship
        context.stroke(); // draw the path

/** functions showing what happens when asteroids=enemy will hit the ship and vice versa
 * showing collision circle
*/

   if (showBunding) {
        context.strokeStyle = "lime";
        context.beginPath();
        context.arc(x, y, r, 0, Math.PI * 2, false);
        context.stroke();
   }
}
// trusting the ship
if (ship.thrusting && !ship.dead) {
       ship.thrust.x += shipThrust * Math.cos(ship.a) / FPS;
       ship.thrust.y -= shipThrust * Math.sin(ship.a) / FPS;
    
    if (!exploding && blinkOn) { // drawing thruster
    context.fillStyle = "red";
    context.strokeStyle = "yellow";
    context.lineWidth = shipSize / 10;
    context.beginPath();
    context.moveTo( // rear left
        ship.x - ship.r * (2 / 3 * Math.cos(ship.a) + 0.5 * Math.sin(ship.a)),
        ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - 0.5 * Math.cos(ship.a))
    );
    context.lineTo( // rear centre (behind the ship)
        ship.x - ship.r * 5 / 3 * Math.cos(ship.a),
        ship.y + ship.r * 5 / 3 * Math.sin(ship.a)
    );
    context.lineTo( // rear right
        ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - 0.5 * Math.sin(ship.a)),
        ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + 0.5 * Math.cos(ship.a))
    );
    context.closePath();
    context.fill();
    context.stroke();
    } 
  } else {
    ship.thrust.x -= friction * ship.thrust.x / FPS; //slow the ship down when not thrusting
    ship.thrust.y -= friction * ship.thrust.y / FPS;
}

// draw the triangle ship
if (!exploding) {
    if (blinkOn && !ship.dead) {
        drawShip(ship.x, ship.y, ship.a);
   }if (ship.blinkNum > 0) {// handle blinking
       ship.blinkTime--;// reduce the blink time
    if (ship.blinkTime == 0) {// reduce the blink num
            ship.blinkTime = Math.ceil(shipBlinkDuration * FPS);
            ship.blinkNum--;
        }
    }
} else {// draw the explosion (concentric circles of different colours)
    context.fillStyle = "darkred";
    context.beginPath();
    context.arc(ship.x, ship.y, ship.r * 1.7, 0, Math.PI * 2, false);
    context.fill();
    context.fillStyle = "red";
    context.beginPath();
    context.arc(ship.x, ship.y, ship.r * 1.4, 0, Math.PI * 2, false);
    context.fill();
    context.fillStyle = "orange";
    context.beginPath();
    context.arc(ship.x, ship.y, ship.r * 1.1, 0, Math.PI * 2, false);
    context.fill();
    context.fillStyle = "yellow";
    context.beginPath();
    context.arc(ship.x, ship.y, ship.r * 0.8, 0, Math.PI * 2, false);
    context.fill();
    context.fillStyle = "white";
    context.beginPath();
    context.arc(ship.x, ship.y, ship.r * 0.5, 0, Math.PI * 2, false);
    context.fill();
}

// draw the game text
if (textAlpha >= 0) {
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "rgba(255, 255, 255, " + textAlpha + ")";
    context.font = "large-caps " + textSize + "px Lato";
    context.fillText(text, canvas.width / 2, canvas.height * 0.75);
    textAlpha -= (1.0 / timeText / FPS);
} else if (ship.dead) {
    // after "game over" fades, start a new game
    
}

// draw the lives
let lifeColour;
for (let i = 0; i < lives; i++) {
    lifeColour = exploding && i == lives - 1 ? "red" : "white";
    drawShip(shipSize + i * shipSize * 1.2, shipSize, 0.5 * Math.PI, lifeColour);
}

// draw the score
context.textAlign = "right";
context.textBaseline = "middle";
context.fillStyle = "white";
context.font = textSize + "px Lato";
context.fillText(score, canvas.width - shipSize / 2, shipSize);

// draw the high score
context.textAlign = "center";
context.textBaseline = "middle";
context.fillStyle = "white";
context.font = (textSize * 0.75) + "px Lato";
context.fillText("BEST " + scoreHigh, canvas.width / 2, shipSize);



// draw the lasers
for (let i = 0; i < ship.lasers.length; i++) {
    if (ship.lasers[i].explodeTime == 0) {
        context.fillStyle = "salmon";
        context.beginPath();
        context.arc(ship.lasers[i].x, ship.lasers[i].y, shipSize / 15, 0, Math.PI * 2, true);
        context.fill();
    } else {
        // draw the eplosion
        context.fillStyle = "orangered";
        context.beginPath();
        context.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.75, 0, Math.PI * 2, true);
        context.fill();
        context.fillStyle = "salmon";
        context.beginPath();
        context.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.5, 0, Math.PI * 2, true);
        context.fill();
        context.fillStyle = "pink";
        context.beginPath();
        context.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.25, 0, Math.PI * 2, true );
        context.fill();
    }
}

// detect laser hits on asteroids
let ax, ay, ar, lx, ly;
for (let i = enemies.length - 1; i >= 0; i--) {  // grab the asteroid properties
    ax = enemies[i].x;
    ay = enemies[i].y;
    ar = enemies[i].r;  
for (let j = ship.lasers.length - 1; j >= 0; j--) {// loop over the lasers
        // grab the laser properties
        lx = ship.lasers[j].x;
        ly = ship.lasers[j].y;
if (ship.lasers[j].explodeTime == 0 && distBetweenPoints(ax, ay, lx, ly) < ar) {// detect hits       
    destroyAsteroid(i);// destroy the asteroid and activate the laser explosion
    ship.lasers[j].explodeTime = Math.ceil(laserExplodeDuration * FPS);
    break;
        }
    }
}
// check for asteroid collisions (when not exploding)
if (!exploding) {
    // only check when not blinking
    if (ship.blinkNum == 0 && !ship.dead) {
        for (let i = 0; i < enemies.length; i++) {
            if (distBetweenPoints(ship.x, ship.y, enemies[i].x, enemies[i].y) < ship.r + enemies[i].r) {
                explodeShip();
                destroyAsteroid(i);
                break;
            }
        }
    }
// rotate the ship
    ship.a += ship.rot;
// move the ship
    ship.x += ship.thrust.x;
    ship.y += ship.thrust.y;
 } else {
    ship.explodeTime--;// reduce the explode time
if (ship.explodeTime == 0) {// reset the ship after the explosion has finished
    lives--;
    if (lives == 0) {
        gameOver();
    } else {
    ship = newShip();
    }
  }
}

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

// move the lasers
for (let i = ship.lasers.length - 1; i >= 0; i--) {             
     if (ship.lasers[i].dist > laserDistance * canvas.width) {  // check distance travelled
         ship.lasers.splice(i, 1);
         continue;
         }
     if (ship.lasers[i].explodeTime > 0) {// handle the explosion
         ship.lasers[i].explodeTime--;
     if (ship.lasers[i].explodeTime == 0) { // destroy the laser after the duration is up
         ship.lasers.splice(i, 1);
         continue;
         }
    } else {
         ship.lasers[i].x += ship.lasers[i].xv; // move the laser
         ship.lasers[i].y += ship.lasers[i].yv;
         ship.lasers[i].dist += Math.sqrt(Math.pow(ship.lasers[i].xv, 2) + Math.pow(ship.lasers[i].yv, 2));// calculate the distance travelled
    }
// edges of the screen with lasers function
      if (ship.lasers[i].x < 0) {
          ship.lasers[i].x = canvas.width;
    } else if (ship.lasers[i].x > canvas.width) {
          ship.lasers[i].x = 0;
    } if (ship.lasers[i].y < 0) {
          ship.lasers[i].y = canvas.height;
    } else if (ship.lasers[i].y > canvas.height) {
          ship.lasers[i].y = 0;
   }
} 

   // move the asteroids
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].x += enemies[i].xv;
        enemies[i].y += enemies[i].yv;
        // handle asteroid edge of screen
          if (enemies[i].x < 0 - enemies[i].r) {
            enemies[i].x = canvas.width + enemies[i].r;
        } else if (enemies[i].x > canvas.width + enemies[i].r) {
            enemies[i].x = 0 - enemies[i].r
        } if (enemies[i].y < 0 - enemies[i].r) {
            enemies[i].y = canvas.height + enemies[i].r;
        } else if (enemies[i].y > canvas.height + enemies[i].r) {
            enemies[i].y = 0 - enemies[i].r
        }
     } 
 }
 function showGame() {
    document.getElementById("show").style.display = "block";
  }