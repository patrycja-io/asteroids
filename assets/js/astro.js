/* Conected element from html - canvas*/

const canvas = document.getElementById("astroCanvas");

// Context from the canvas

const context = canvas.getContext("2d");

// frames per seconds
const FPS = 30; 

// ship size in pixels
const shipsize = 30;



const ship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    r: shipsize / 2,
    //  direction of the ship conversion to radiance
    a: 90 / 180 * Math.PI 
    // rotation
    rot: 0
}

// keys set up
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);




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
}