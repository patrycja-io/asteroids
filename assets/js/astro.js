/* Conected element from html - canvas*/

const canvas = document.getElementById("astroCanvas");

// Context from the canvas

const context = canvas.getContext("2d");

// Game loop set  up
setInterval(update, 1000 / FPS);