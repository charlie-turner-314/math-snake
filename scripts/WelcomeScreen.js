// AUTHOR: CTURNER314
// DESCRIPTION: JAVASCRIPT DOCUMENT FOR THE WELCOME SCREEN OF JS SNAKE - MATHS


// VARIABLES THAT WILL BE SET
var
speed,
cellSize,
operations,
numberRange,
increaseFactor,
difficulty,
growthInc;

function LoadPage(){
	document.getElementById("body").style.opacity = 1;
}

function DiffChoose(s, c, o, n, d, g){
	speed = s;
	cellSize = c;
	operations = o;
	numberRange = n;
	difficulty = d;
	growthInc = g;
	SaveSettings();
	window.location.href = 'app.html'
}

function SaveSettings(){
	localStorage.removeItem("saveSnake")
	var saveSnake = {
		'speed' : speed,
		'cellSize' : cellSize,
		'operations' : operations,
		'numberRange' : numberRange,
		'increaseFactor' : increaseFactor,
		'difficulty' : difficulty,
		'growthInc' : growthInc
		}
	localStorage.setItem("saveSnake", JSON.stringify(saveSnake));
}  


