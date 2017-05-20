// JavaScript Document


//Settings
var 
cellSize=20, //size of cells (pixels)
speed=5,    // speed of game (1 is super fast --- higher is slower)
operations=2, // types of questions
numberRange=50; // range of numbers to do math
increaseFactor=1; //number of cells to increase by each time

var
canvas,  //The canvas
context, // 2d rendering context
keyState, //

ROWS,
COLS,

answerNum,
frames,
score,
// Displayed multiple choice answers
choice1,
choice2,
choice3,
choice4,
score,

// Cell types
EMPTY=0,
ANS1=1,
ANS2=2,
ANS3=3,
ANS4=4,
SNAKE=5,

// Directions
LEFT=0, 
UP=1, 
RIGHT=2, 
DOWN=3, 
PAUSE=4,

//Key codes
KEYLEFT=37, 
KEYUP=38,
KEYRIGHT=39,
KEYDOWN=40;


var windowSize = {
	width : window.innerWidth || document.documentElement.clientWidth,
	height : window.innerHeight || document.documentElement.clientHeight
};

function Main() { // starts game, main function to create the game canvas and all the other cool stuff that only needs to be done once
	LoadSettings();
	canvas = document.createElement("canvas");  //Create canvas
	canvas.width = Math.floor((windowSize.width - 50)/cellSize) * cellSize;
	canvas.height = Math.floor((windowSize.height - 100)/cellSize) * cellSize;
	context = canvas.getContext("2d");
	document.body.appendChild(canvas);	
	context.fillStyle = "rgb(166,52,52)";
	context.fillRect(0, 0, canvas.width, canvas.height);
	keyState = {};
	document.addEventListener("keydown", function(evt){
		keyState[evt.keyCode] = true;
	});
	document.addEventListener("keyup", function(evt){
		delete keyState[evt.keyCode];
	});
	frames=0;
	Init();
}

function Init(){
	frames = 0;
	score = 1;
	GridInit();
	SnakeInit(PAUSE, 1, 1);
	GridSet(1, 1, SNAKE); 
	SetFood();
	GenerateAnswer();
	Loop();
}

function Loop(){
	Update();
	Draw();
	window.requestAnimationFrame(Loop, canvas);
}

function Update(){
	frames++;
	
	//if (snakeDirection == PAUSE) document.getElementById("question").innerHTML = "Use Arrow Keys To Move Snake";
	
	if (keyState[KEYLEFT] && snakeDirection !== RIGHT) {
		snakeDirection = LEFT;
	}
	if (keyState[KEYUP] && snakeDirection !== DOWN) {
		snakeDirection = UP;
	}
	if (keyState[KEYRIGHT] && snakeDirection !== LEFT) {
		snakeDirection = RIGHT;
	}
	if (keyState[KEYDOWN] && snakeDirection !== UP) {
		snakeDirection = DOWN;
	}
	
	if(frames % speed === 0){
		// Get new x and new y
		var nx = snakeLast.x;
		var ny = snakeLast.y;
		
		// change the new head position based on direction 
		switch(snakeDirection){
			case LEFT:
				nx--;
				break;
			case UP:
				ny--;
				break;
			case RIGHT:
				nx++;
				break;
			case DOWN:
				ny++;
				break;
			case PAUSE:	
				return;
		}
		
		// restart if you run into the wall
		if(	0 > nx || nx > COLS-1 || 0 > ny || ny > ROWS-1){
			alert("You hit the wall. Replay?");
			location.reload();
			//return Init();
			}
		// restart if you run into yourself
		if(GridGet(nx, ny) === SNAKE){
			alert("You ate yourself. Sad snake :(")
			location.reload();
		}
		// takes the value of the new head position 
		switch(GridGet(nx, ny)){
			case ANS1:
				if(choice1 == answer){             	// If correct answer
					var snakeTail = {x:nx, y:ny};  	// snakeTail = the point of the answer cell
					score++;			// Increase score
					ResetFoods();			// Reset food
					GenerateAnswer();		// Generate answers
					SetFood();			// Setfood
				} else {				// NOT CORRECT
					alert("Oh, no. That's the wrong answer." + question + " = " + answer + ". Replay?")
					location.reload();		// RELOAD PAGE (DEAD SNAKE DAMN)
					//return Init();
				}
				break;
			case ANS2:
				if(choice2 == answer){
					var snakeTail = {x:nx, y:ny};
					score++;
					ResetFoods();
					GenerateAnswer();
					SetFood();
				}else{
					alert("Snake doesn't feel well. It could have grown big and strong if you went to " + answer + ", Replay?")
					location.reload();
					//return Init();
				}
				break;
			case ANS3:
				if(choice3 == answer){
					var snakeTail = {x:nx, y:ny};
					score++;
					ResetFoods();
					GenerateAnswer();
					SetFood();
				}else{
					alert("Bad luck, that's the wrong answer. Replay?")
					location.reload();
					//return Init();
				}
				break;
			case ANS4:
				if(choice4 == answer){
					var snakeTail = {x:nx, y:ny};
					score++;
					ResetFoods();
					GenerateAnswer();
					SetFood();
				}else{
					alert("You ate the wrong food. The right answer was " + answer + ", Replay?")
					location.reload();
					//return Init();
				}
				break;
			default:   		//if not anything special
				var snakeTail = SnakeRemove();		 //take tail
				GridSet(snakeTail.x, snakeTail.y, EMPTY);	// set its position EMPTY
				snakeTail.x = nx;			// put tail at new head position
				snakeTail.y = ny;			//--------------------------------
				break;
		}
		document.getElementById("score").innerHTML = score;     //display score
		SnakeAdd(snakeTail.x, snakeTail.y);			//add new position to snake array
		GridSet(nx, ny, SNAKE);					//set new position to SNAKE
	}
}

var grid = []; //Array --> holds x and y values

function GridInit(){
	grid = [];
	COLS = (canvas.width / cellSize);
	ROWS = (canvas.height / cellSize);
	for (var x=0; x < COLS; x++) {
			grid.push([]);
			for (var y=0; y < ROWS; y++) {
				grid[x].push(EMPTY);
			}
	}
	
}
function GridGet(x, y){
	return grid[x][y];
}
function GridSet(x, y, val){
	grid[x][y] = val;
}
function GridRemove(x, y){
	grid[x][y] = EMPTY;
}

var snake = [];
var snakeDirection;
var snakeLast;
function SnakeInit(d, x, y){
	snakeDirection = d;
	snake = [];
	SnakeAdd(x,y);
}

function SnakeAdd(x,y){
	snake.unshift({x:x, y:y});
	snakeLast = snake[0];
}

function SnakeRemove(){
	return snake.pop();  // return the last element of the snake
}

function ResetFoods(){
	GridRemove(ans1Pos.x, ans1Pos.y);
	GridRemove(ans2Pos.x, ans2Pos.y);
	GridRemove(ans3Pos.x, ans3Pos.y);
	GridRemove(ans4Pos.x, ans4Pos.y);
}


var ans1Pos, ans2Pos, ans3Pos, ans4Pos;


function SetFood(){
	var emptyCells = [];
	for(var x=0; x < COLS; x++){
		for(var y=0; y < ROWS; y++){
			if(GridGet(x, y) === EMPTY){
				emptyCells.push({x:x, y:y});
			}
		}
	}
	var numbers = [];
	while(numbers.length < 4){
		var randNum = Math.floor(Math.random() * (emptyCells.length - 1) + 1);
		if(numbers.indexOf(randNum) === -1) { 
		numbers.push(randNum);	
		}
		
	}
	// get random cells
	ans1Pos = emptyCells[(numbers[0])];
	ans2Pos = emptyCells[(numbers[1])];
	ans3Pos = emptyCells[(numbers[2])];
	ans4Pos = emptyCells[(numbers[3])];
	
	// Set random empty cells to the food
	GridSet(ans1Pos.x, ans1Pos.y, ANS1);
	GridSet(ans2Pos.x, ans2Pos.y, ANS2);
	GridSet(ans3Pos.x, ans3Pos.y, ANS3);
	GridSet(ans4Pos.x, ans4Pos.y, ANS4);
}


function Draw(){
	for(var x=0; x < COLS; x++){
		for(var y=0; y < ROWS; y++){
			switch(GridGet(x, y)){
					case EMPTY:
						context.fillStyle = "rgb(50,50,50)";
						break;
					case SNAKE:
						context.fillStyle = "rgb(200,200,200)";
						break;
					case ANS1:
						context.fillStyle = "red";
						break;
					case ANS2:
						context.fillStyle = "blue";
						break;
					case ANS3:
						context.fillStyle = "rgb(255,0,221)";
						break;
					case ANS4:
						context.fillStyle = "aqua";
						break;
			}
			context.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
		}
	}
}

var n1, n2, answer, question, answerNum;

function GenerateAnswer() { 											// generates the question and answer and displays on top of page
	n1 = Math.floor((Math.random() * numberRange) + 1);
	n2 = Math.floor((Math.random() * numberRange) + 1);
	
	switch(operations) {
		case 1 :
			question =  "   " + n1 + " &times " + n2;
			answer = n1 * n2;
			break;
		case 2 : 
			question = "   " + n1 + "+" + n2;
			answer = n1 + n2;
			break;
		case 3 : 
			question = "   " + n1 + " &minus; " + n2;
			answer = n1 - n2; 
			break;
		case 4 :
			var chosenOpNum = Math.floor((Math.random() * 3) + 1);
			switch(chosenOpNum) {
				case 1:
					question = "   " + n1 + " + " + n2;
					answer = n1 + n2;
					break;
				case 2:
					question = "   " + n1 + " &minus; " + n2;
					answer = n1 - n2;
					break;
				case 3:
					question = "   " + n1 + " &times " + n2;
					answer = n1 * n2;
					break;
			}
			break;
		default :
			question = "unavailable";
			answer = "n/A";
			break;
		}	
	var
	decoy1 = answer + Math.floor((Math.random() * numberRange) + 2),
	decoy2 = answer - Math.floor((Math.random() * numberRange) + 2),
	decoy3 = answer * Math.floor((Math.random() * 5) + 2);
	answerNum = Math.floor((Math.random() * 4) + 1); 
	 switch(answerNum) {
		case 1: 
			var answers = [answer, decoy1, decoy3, decoy2];
			break;
		case 2:
			var answers = [decoy2, answer, decoy1, decoy3];
			break;
		case 3:
			var answers = [decoy1, decoy3, answer, decoy2];
			break;
		case 4:
			var answers = [decoy3, decoy2, decoy1, answer];
			break;
	} 
	document.getElementById("question").innerHTML = question;
	document.getElementById("a1").innerHTML = answers[0];
	document.getElementById("a2").innerHTML = answers[1];
	document.getElementById("a3").innerHTML = answers[2];
	document.getElementById("a4").innerHTML = answers[3];
	
	choice1 = document.getElementById("a1").innerHTML;
	choice2 = document.getElementById("a2").innerHTML;
	choice3 = document.getElementById("a3").innerHTML;
	choice4 = document.getElementById("a4").innerHTML; 
} 																// END FUNCTION GENERATE ANSWER 

function LoadSettings(){
	if(localStorage.getItem("saveSnake") !== null){
		var settings = JSON.parse(localStorage.getItem("saveSnake"));
		if (typeof settings.speed !== "undefined") speed = settings.speed;
		if(typeof settings.cellSize !== "undefined") cellSize = settings.cellSize;
		if(typeof settings.operations !== "undefined") operations = settings.operations;
		if(typeof settings.numberRange !== "undefined") numberRange = settings.numberRange;
		if(typeof settings.increaseFactor !== "undefined") increaseFactor = settings.increaseFactor;
	}
}
