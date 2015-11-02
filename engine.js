var cWidth = 800;
var cHeight = 600;

var left = false;
var right = false;
var up = false;
var down = false;

var g = 9.81; // Gravitational constant
var pxpM = 10; // Pixels per meter
var calcRate = 60;

var c = document.getElementById("canvas");
ctx = c.getContext("2d");

c.width = cWidth;
c.height = cHeight;

var monitor = document.getElementById("monitor"); // Temporary

var rects = {
	0: {
		x: 550,
		y: 150,

		width: 50,
		height: 50,

		xVel: -5,
		yVel: -10,

		xAcc: 0,
		yAcc: 1,

		topCollide: false,
		bottomCollide: false,
		leftCollide: false,
		rightCollide: false,

		dynamic: true
	},

	1: {
		x: 100,
		y: 400,

		width: 600,
		height: 50,

		xVel: 0,
		yVel: 0,

		xAcc: 0,
		yAcc: 0,

		topCollide: false,
		bottomCollide: false,
		leftCollide: false,
		rightCollide: false,

		dynamic: false
	}
}


// SNIPPETS //

// Size of object (similar to the length of an array)
// Usage: Object.size(arr);	This will return the length of arr
Object.size = function(obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};


// DRAW FUNCTIONS //



function background(){
	ctx.fillStyle = "#eeeeee";
	ctx.fillRect(0,0,cWidth,cHeight);
}

function drawRects(){
	ctx.fillStyle = "#333333"; // Color comes later or maybe never?
	for (var i = 0; i < Object.size(rects); i++) {
		var r = rects[i];
		ctx.fillRect(r.x, r.y, r.width, r.height);
	};
}



// CALC FUNCTIONS //



function calcCollisions(rect1,rect2){
	if(	(	
			(rect1.dynamic && !rect2.dynamic) // One is dynamic two is static
	 	||	(!rect1.dynamic && rect2.dynamic) // One is static two is dynamic
	 	)

	&&	(	
	 		(rect1.x + rect1.width > rect2.x && rect1.x + rect1.width < rect2.x + rect2.width)
	 	|| 	(rect1.x > rect2.x && rect1.x  < rect2.x + rect2.width)
		)

	&&	(rect1.y + rect1.height >= rect2.y && rect1.y + rect1.height < rect2.y + rect2.height)
	 	){
		// rect1 is on top of rect2
		rect1.topCollide = true;
	}else{
		// No collision in this direction
		rect1.topCollide = false;
	}
}

function calcRects(){
	for (var i = 0; i < Object.size(rects); i++) {
		var rect1 = rects[i];
		for (var j = 0; j < Object.size(rects); j++) {
			if(i == j) continue; // A rect can't collide with itself
			var rect2 = rects[j];

			// x axis movement

			rect1.x += rect1.xVel * pxpM / calcRate;
			rect1.xVel += rect1.xAcc * pxpM / calcRate;

			// y axis movement

			// Collides from top
			if(rect1.topCollide && rect1.yVel > 0){
				// Collides from the top - no y axis movement
				// Movement is also downwards
				rect1.y = rect2.y - rect1.height;
				rect1.yVel = 0;
			}else{
				rect1.y += rect1.yVel * pxpM / calcRate;
				rect1.yVel += rect1.yAcc * pxpM / calcRate;
			}

			// Finally calc collisions
			calcCollisions(rect1,rect2);
		};
	};
}

function manageConsole(){
	// Temporary
	var topCollideSpan = document.getElementById("topCollide");
	var bottomCollideSpan = document.getElementById("bottomCollide");
	var leftCollideSpan = document.getElementById("leftCollide");
	var rightCollideSpan = document.getElementById("rightCollide");

	topCollideSpan.innerHTML = rects[0].topCollide
	bottomCollideSpan.innerHTML = rects[0].bottomCollide
	leftCollideSpan.innerHTML = rects[0].leftCollide
	rightCollideSpan.innerHTML = rects[0].rightCollide
}



// LOOPS AND FUNCTIONS CONTAINING FUNCTIONS //



// Draw loop
function draw(){
	requestAnimationFrame(draw);

	background();
	drawRects();
}

function calc(){
	calcRects();

	manageConsole();
}

// Calculation tick
window.setInterval(function(){
	calc();
},1000/calcRects);

window.onload = function(){
	draw();
}