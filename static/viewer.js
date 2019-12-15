// Two different data types here: strings and numbers
// Differentiate between strings and variables

// Key words: function and var

function setup() {
    var canvas = createCanvas(800, 200)
    // jumbo-canvas is a string
    canvas.parent('viewer-canvas')
    // background(255, 0, 200)
}

var tronX = 50
var speed = 5

function draw() {
    x = 1000 * Math.random()
    y = 1000 * Math.random()

    ellipse(x, y, x + 2, y + 2)
}