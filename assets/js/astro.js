/* Conected element from html - canvas*/

const canvas = document.getElementById("astroCanvas");

// Context from the canvas

const context = canvas.getContext("2d");

// frames per seconds
const FPS = 30; 


// Game loop set up
setInterval(update, 1000 / FPS);

// game function to draw the ship and move 
