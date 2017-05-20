// AUTHOR: CTURNER314
// DESCRIPTION: JAVASCRIPT DOCUMENT FOR THE WELCOME SCREEN OF JS SNAKE - MATHS


// VARIABLES THAT WILL BE SET
var
speed,
cellSize,
operations,
numberRange,
increaseFactor;

function DiffChoose(s, c, o, n){
	speed = s;
	cellSize = c;
	operations = o;
	numberRange = n;
	SaveSettings();
	window.location.href = 'JS Snake.html'
}

function SaveSettings(){
	localStorage.removeItem("saveSnake")
	var saveSnake = {
		'speed' : speed,
		'cellSize' : cellSize,
		'operations' : operations,
		'numberRange' : numberRange,
		'increaseFactor' : increaseFactor
	}
	localStorage.setItem("saveSnake", JSON.stringify(saveSnake));
}  


