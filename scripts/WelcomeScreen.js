// AUTHOR: CTURNER314
// DESCRIPTION: JAVASCRIPT DOCUMENT FOR THE WELCOME SCREEN OF JS SNAKE - MATHS


// VARIABLES THAT WILL BE SET
var
speed,
cellSize,
operations,
numberRange,
increaseFactor,
difficulty;

function DiffChoose(s, c, o, n, d){
	speed = s;
	cellSize = c;
	operations = o;
	numberRange = n;
	difficulty = d;
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
		'difficulty' : difficulty
		}
	localStorage.setItem("saveSnake", JSON.stringify(saveSnake));
}  


