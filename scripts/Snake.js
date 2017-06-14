// JavaScript Document
// Fade in on load
function LoadPage(){
	document.getElementById("body").style.opacity = 1;
}

function Unfocus(){
	document.getElementById("noUse").focus();
}

//Settings
var 
cellSize=20, //size of cells (pixels)
speed=5,    // speed of game (1 is super fast --- higher is slower)
operations=2, // types of questions
numberRange=50, // range of numbers to do math
difficulty="CUSTOM",  //number indicating current difficulty
growthInc=5,
coins=1,
gameColor = "rgb(50,50,50)",
backColor = "rgb(200,200,200)",
snakeColor = "rgb(200,200,200)",
magicBackColor = 0,		//0: not baught, 1: disabled, 2:enabled
discoMode = false,
missionControl = 0,
highScore;

var
canvas,  //The canvas
context, // 2d rendering context
keyState, //
ROWS,
COLS,

answerNum,
frames,
score,
playing,
shopOpen = false,
mControlOpen = false,
feeding = 0,
gotFood = 0,
movingDirection,
// Displayed multiple choice answers
choice1,
choice2,
choice3,
choice4,
score,
goMessage,

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
KEYDOWN=40,
KEYA=65,
KEYW=87,
KEYD=68,
KEYS=83,
KEYP=80,
KEYESC=27,
KEYSPACE=32;

function SpeedUp(){
	if(speed !== 1){
	speed--
	}
}


var windowSize = {
	width : window.innerWidth || document.documentElement.clientWidth,
	height : window.innerHeight || document.documentElement.clientHeight
};

function Main() { // starts game, main function to create the game canvas and all the other cool stuff that only needs to be done once
	LoadSettings();
	console.log('%c Please no hacking thankyou! ', 'background: rgb(50,0,20); color: rgb(100,0,100); font-size:40px; font-family: Comic Sans MS');
	document.getElementById("highScore").innerHTML = highScore;
	document.getElementById("body").style.backgroundColor = backColor;
	canvas = document.createElement("canvas");  //Create canvas
	canvas.width = Math.floor((windowSize.width - 50)/cellSize) * cellSize;
	canvas.height = Math.floor((windowSize.height - 100)/cellSize) * cellSize;
	context = canvas.getContext("2d");
	document.body.appendChild(canvas);
	context.lineWidth = 3;	
	context.fillStyle = "rgb(166,52,52)";
	context.fillRect(0, 0, canvas.width, canvas.height);
	keyState = {};
	document.addEventListener("keydown", function(evt){
		if(!shopOpen){
		keyState[evt.keyCode] = true; 
		} 
	});
	document.addEventListener("keyup", function(evt){
		delete keyState[evt.keyCode];
	});
	Init();
	Loop();
}

function Init(){
	document.getElementById("coins").innerHTML = coins;
	document.getElementById("pausedMsg").innerHTML = "Use Arrow Keys To Move Snake";
	document.getElementById("pausedMsg").style.fontFamily = "Quicksand Bold";
	document.getElementById("pausedMsg").style.fontSize = "5vw";
	playing = true;
	frames = 0;
	score = 1;
	coins++;
	GridInit();
	SnakeInit(PAUSE, 1, 1);
	GridSet(1, 1, SNAKE); 
	SetFood();
	GenerateAnswer();
}

function Loop(){
	Update();
	Draw();
	window.requestAnimationFrame(Loop, canvas);
}

function Update(){
	frames++;
	document.getElementById("coins").innerHTML = coins;
	if(snakeDirection == PAUSE) {
		if(playing){
			if(!shopOpen){
			document.getElementById("paused").style.opacity = 1;
			document.getElementById("paused").style.pointerEvents = "auto";
			}
			document.getElementById("question").innerHTML = "Move Snake To View Question"
		}else{ //if not playing but paused
			document.getElementById("question").innerHTML = question;
			document.getElementById("question").style.opacity = 1;
		} 
	}else{ 
		shopOpen = false;
		document.getElementById("question").innerHTML = question;
		document.getElementById("paused").style.opacity = 0;
		document.getElementById("shop").style.opacity = 0;
		document.getElementById("question").style.opacity = 1;
	}

	if(playing){
		if ((keyState[KEYLEFT] || keyState[KEYA]) && snake.length === 1) {
			snakeDirection = LEFT;
		}else if ((keyState[KEYLEFT] || keyState[KEYA]) && movingDirection !== RIGHT) {
			snakeDirection = LEFT;
		}
		if ((keyState[KEYUP] || keyState[KEYW]) && snake.length === 1) {
			snakeDirection = UP;
		}else if ((keyState[KEYUP] || keyState[KEYW]) && movingDirection !== DOWN) {
			snakeDirection = UP;
		}
		if ((keyState[KEYRIGHT] || keyState[KEYD]) && snake.length === 1) {
			snakeDirection = RIGHT;
		}else if ((keyState[KEYRIGHT] || keyState[KEYD]) && movingDirection !== LEFT) {
			snakeDirection = RIGHT;
		}
		if ((keyState[KEYDOWN] || keyState[KEYS]) && snake.length === 1) {
			snakeDirection = DOWN;
		}else if ((keyState[KEYDOWN] || keyState[KEYS]) && movingDirection !== UP) {
			snakeDirection = DOWN;
		}
		if (keyState[KEYP] || keyState[KEYESC] || keyState[KEYSPACE]) {
			if(snakeDirection !== PAUSE){
				snakeDirection = PAUSE;
				document.getElementById("pausedMsg").innerHTML = "Paused";
				document.getElementById("pausedMsg").style.fontFamily = "Quicksand Bold";
				document.getElementById("pausedMsg").style.fontSize = "5vw";
			}else if(snakeDirection == PAUSE){
				snakeDirection = movingDirection;
			}
		}
	}
	if(discoMode == 2){
		if(frames % 100 === 0){
			DiscoModeFree();
		}
	}


	if(frames % speed === 0){
		if(snakeDirection !== PAUSE){
			movingDirection = snakeDirection;
		}
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
				playing = false;
				goMessage = "you hit the wall";
				return GameOver();
				}
		// restart if you run into yourself
			if(GridGet(nx, ny) === SNAKE){
			playing = false;
			goMessage = "you ate yourself";
			return GameOver();
			}
		// takes the value of the new head position 
		switch(GridGet(nx, ny)){
			case ANS1:
				if(choice1 == answer){             	// If correct answer
					var snakeTail = {x:nx, y:ny};  	// snakeTail = the point of the answer cell
					gotFood = 1
					score++;			// Increase score
					coins++;
					if(magicSnakeColor == 2){RndSnakeColor()}
					ResetFoods();		// Reset food
					GenerateAnswer();	// Generate answers
					SetFood();			// Setfood
				} else {					// NOT CORRECT
					var snakeTail = {x:nx, y:ny};  	// snakeTail = the point of the answer cell
					playing = false;
					goMessage = "the correct answer was " + answer;
					return GameOver();
				}
				break;
			case ANS2:
				if(choice2 == answer){
					var snakeTail = {x:nx, y:ny};
					gotFood = 1
					score++;
					coins++;
					if(magicSnakeColor == 2){RndSnakeColor()}
					ResetFoods();
					GenerateAnswer();
					SetFood();
				}else{
					playing = false;
					goMessage = "the correct answer was " + answer;
					return GameOver();
				}
				break;
			case ANS3:
				if(choice3 == answer){
					var snakeTail = {x:nx, y:ny};
					gotFood = 1
					score++;
					coins++;
					if(magicSnakeColor == 2){RndSnakeColor()}
					ResetFoods();
					GenerateAnswer();
					SetFood();
				}else{
					playing = false;
					goMessage = "the correct answer was " + answer;
					return GameOver();
				}
				break;
			case ANS4:
				if(choice4 == answer){
					var snakeTail = {x:nx, y:ny};
					gotFood = 1
					score++;
					coins++;
					if(magicSnakeColor == 2){RndSnakeColor()}
					ResetFoods();
					GenerateAnswer();
					SetFood();
				}else{
					playing = false;
					goMessage = "the correct answer was " + answer;
					return GameOver();
				}
				break;
			default:   		//if not anything special
				if(gotFood===1){
					feeding++
					if(feeding < growthInc){
						var snakeTail = {x:nx, y:ny};
						score++
						coins++;
					} else {
						feeding = 0
						gotFood = 0
						var snakeTail = SnakeRemove();		 //take tail
						GridSet(snakeTail.x, snakeTail.y, EMPTY);	// set its position EMPTY
						snakeTail.x = nx;			// put tail at new head position
						snakeTail.y = ny;			//--------------------------------
					}
				} else{
				var snakeTail = SnakeRemove();		 //take tail
				GridSet(snakeTail.x, snakeTail.y, EMPTY);	// set its position EMPTY
				snakeTail.x = nx;			// put tail at new head position
				snakeTail.y = ny;			//--------------------------------
				}
				break;
			}
		document.getElementById("score").innerHTML = score;     //display score
		document.getElementById("coins").innerHTML = coins; // display total length
		localStorage.setItem("coins", coins);
		SnakeAdd(snakeTail.x, snakeTail.y);			//add new position to snake array
		GridSet(nx, ny, SNAKE);					//set new position to SNAKE
	}
}


function GameOver(){
	ResetFoods();
	if(score > highScore){
		highScore = score;
		document.getElementById("highScore").innerHTML = highScore;
		localStorage.setItem("highScore", highScore);
	}
	snakeDirection = PAUSE;
	gotFood=0;
	feeding=0;
	document.getElementById("gameOver").style.opacity = 1;
	document.getElementById("gameOver").style.pointerEvents = "auto";
	document.getElementById("goMessage").innerHTML = goMessage;
	document.getElementById("finalLength").innerHTML = snake.length;
}

function PlayAgain(){
	if(!playing){
	HideGO();
	Init();
	}
}

function OpenShop(){
	var shop = document.getElementById("shop");
	document.getElementById("paused").style.opacity = 0;
	document.getElementById("paused").style.pointerEvents = "none";
	HideGO();
		if(!shopOpen){
			shopOpen = true;
			shop.style.opacity = 1;
			shop.style.pointerEvents = "auto";
		}else{
			shopOpen = false;
			shop.style.opacity = 0;
			shop.style.pointerEvents = "none";
		}
}

function ChangeDiff(){
	window.location.href = 'index.html'
}


function HideGO(){
	document.getElementById("gameOver").style.opacity = 0;
	document.getElementById("gameOver").style.pointerEvents = "none";
}

var grid; //Array --> holds x and y values

function GridInit(){
	grid = [];  // define and clear grid 
	COLS = (canvas.width / cellSize); 
	ROWS = (canvas.height / cellSize);
	for (var x=0; x < COLS; x++) {
			grid.push([]);   // push an array into each collumn
			for (var y=0; y < ROWS; y++) {
				grid[x].push(EMPTY); // set value of each to EMPTY
			}
	}
	
}
function GridGet(x, y){
	return grid[x][y];  // simply return the value (SNAKE, EMPTY, ANS1 etc..)
}
function GridSet(x, y, val){
	grid[x][y] = val;   // Set the value of a given cell
}
function GridRemove(x, y){
	grid[x][y] = EMPTY; // remove any 'special' type of cell (reset given cell to EMPTY)
}

var snake;  
var snakeDirection;
var snakeLast;
function SnakeInit(d, x, y){
	snakeDirection = d;  // exactly what it looks like
	snake = [];  // clear snake array 
	SnakeAdd(x,y);  // add an element to the snake array at the given x and y
}

function SnakeAdd(x,y){
	snake.unshift({x:x, y:y});  //place element at start of snake array
	snakeLast = snake[0];  // set the variable to the last element of the array
}

function SnakeRemove(){
	return snake.pop();  // return the last element of the snake
}

function ResetFoods(){  // remove the 4 'food' items
	GridRemove(ans1Pos.x, ans1Pos.y);
	GridRemove(ans2Pos.x, ans2Pos.y);
	GridRemove(ans3Pos.x, ans3Pos.y);
	GridRemove(ans4Pos.x, ans4Pos.y);
}


var ans1Pos, ans2Pos, ans3Pos, ans4Pos;


function SetFood(){
	var emptyCells = [];  
	for(var x=0; x < COLS; x++){      	//--Scan all collums and all rows
		for(var y=0; y < ROWS; y++){	//^^^^^^^^^^
			if(GridGet(x, y) === EMPTY){ //if the cell is EMPTY
				emptyCells.push({x:x, y:y});  // add the x and y value of cell to empty cell array
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
						context.fillStyle = gameColor;
						break;
					case SNAKE:
						context.fillStyle = snakeColor;
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

function GenerateAnswer() { 										// generates the question and answer and displays on top of page
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

function RndSnakeColor(){
	if(MagicSnakeColor == 0){
		if(coins > 30){
			var r, g, b;
			r = Math.floor((Math.random()*255)+1);
			g = Math.floor((Math.random()*255)+1);
			b = Math.floor((Math.random()*255)+1);	
			snakeColor = "rgb(" + r + "," + g +"," + b + ")";
			coins -= 30;
		}else{
			alert("It looks like you don't have enough money :( Get coins by playing!");
			console.log("RndSnakeColor")
		}
	}else{
		var r, g, b;
		r = Math.floor((Math.random()*255)+1);
		g = Math.floor((Math.random()*255)+1);
		b = Math.floor((Math.random()*255)+1);	
		snakeColor = "rgb(" + r + "," + g +"," + b + ")";
	}
}

function RndBackColor(){
	if(coins > 30){
		var r, g, b;
		r = Math.floor((Math.random()*255)+1);
		g = Math.floor((Math.random()*255)+1);
		b = Math.floor((Math.random()*255)+1);	
		backColor = "rgb(" + r + "," + g +"," + b + ")";
		document.getElementById("body").style.backgroundColor = backColor;
		coins -= 30;
	}else{
		alert("It looks like you don't have enough money :( Get coins by playing!");
		console.log("RndBackColor has run")
	}
}

function RndGameColor(){
	if(coins >= 30){
		var r, g, b;
		r = Math.floor((Math.random()*255)+1);
		g = Math.floor((Math.random()*255)+1);
		b = Math.floor((Math.random()*255)+1);	
		gameColor = "rgb(" + r + "," + g +"," + b + ")";
		coins -= 30;
	}else{
		alert("It looks like you don't have enough money :( Get coins by playing!");
		console.log("RndGameColor has run")
	}
}

function MagicSnakeColor(){
	if(magicSnakeColor == 0){
		if(coins >= 200){
			coins -= 200;
			magicSnakeColor = 2;
			document.getElementById("magicSnakeLbl").innerHTML = "Click To Disable";
		}else{alert("It looks like you don't have enough money :( Get coins by playing!")}
	}else if(magicSnakeColor == 1){
		magicSnakeColor = 2;
		document.getElementById("magicSnakeLbl").innerHTML = "Click To Disable";
	}else if(magicSnakeColor == 2){
		magicSnakeColor = 1
		document.getElementById("magicSnakeLbl").innerHTML = "Click To Enable";
	}
	SaveColors();
	localStorage.setItem("magicSnakeColor", magicSnakeColor);
}

function DiscoModeFree(){
	var r, g, b;
		r = Math.floor((Math.random()*255)+1);
		g = Math.floor((Math.random()*255)+1);
		b = Math.floor((Math.random()*255)+1);	
		gameColor = "rgb(" + r + "," + g +"," + b + ")";

		r = Math.floor((Math.random()*255)+1);
		g = Math.floor((Math.random()*255)+1);
		b = Math.floor((Math.random()*255)+1);	
		snakeColor = "rgb(" + r + "," + g +"," + b + ")";

		r = Math.floor((Math.random()*255)+1);
		g = Math.floor((Math.random()*255)+1);
		b = Math.floor((Math.random()*255)+1);	
		backColor = "rgb(" + r + "," + g +"," + b + ")";
		document.getElementById("body").style.backgroundColor = backColor;
}

function DiscoMode(){
	if(discoMode == 0){
		if(coins >= 300){
			coins -= 300;
			discoMode = 2;
			document.getElementById("discoModeLbl").innerHTML = "Click To Disable";
		}else{alert("It looks like you don't have enough money :( Get coins by playing!")}
	}else if(discoMode == 1){
		discoMode = 2;
		document.getElementById("discoModeLbl").innerHTML = "Click To Disable";
	}else if(discoMode == 2){
		discoMode = 1
		document.getElementById("discoModeLbl").innerHTML = "Click To Enable";
	}
	SaveColors();
	localStorage.setItem("discoMode", discoMode);
}

function SaveColors(){
	var gameColors = {
		'snakeColor' : snakeColor,
		'backColor'  : backColor,
		'gameColor'  : gameColor
	}
	localStorage.setItem("gameColors", JSON.stringify(gameColors));
}

function MissionControl(){
	if(missionControl == 0){
		if(coins >= 500){
			coins -= 500;
			missionControl = 1;
			document.getElementById("missionControlLbl").innerHTML = "Click To Enter";
		}else{alert("It looks like you don't have enough money :( Get coins by playing!")}
	}else if(missionControl == 1){
		OpenMissionControl();
	}else{
		console.error("missionControl variable !== 1 || 0. currently == " + missionControl)
	}
	localStorage.setItem("missionControl", missionControl);
}

function OpenMissionControl(){
	var mControl = document.getElementById("missionControl");
	document.getElementById("paused").style.opacity = 0;
	document.getElementById("paused").style.pointerEvents = "none";
	document.getElementById("shop").style.opacity = 0;
	document.getElementById("shop").style.pointerEvents = "none";
	HideGO();
		if(!mControlOpen){
			mControlOpen = true;
			mControl.style.opacity = 1;
			mControl.style.pointerEvents = "auto";
		}else{
			mControlOpen = false;
			mControl.style.opacity = 0;
			mControl.style.pointerEvents = "none";
		}
}

function SaveCustom(){
	if(confirm("This will lose current game. Continue?")){
		var
		iptSpeed = document.getElementById("iptSpeed"),
		iptCellSize = document.getElementById("iptCellSize"),
		iptOperations = document.getElementById("iptOperations"),
		iptNumberRange = document.getElementById("iptNumberRange"),
		iptGrowthInc = document.getElementById("iptGrowthInc");

		localStorage.removeItem("saveSnake")
		var saveSnake = {
			'speed' : iptSpeed.value,
			'cellSize' : (60 - iptCellSize.value),
			'operations' : Number(iptOperations.value),
			'numberRange' : (510 - iptNumberRange.value),
			'difficulty' : "CUSTOM",
			'growthInc' : (101 - iptGrowthInc.value)
			}
		localStorage.setItem("saveSnake", JSON.stringify(saveSnake));
		location.reload()
	}
}

function LoadSettings(){
	if(localStorage.getItem("saveSnake") !== null){
		var settings = JSON.parse(localStorage.getItem("saveSnake"));
		if(typeof settings.speed !== "undefined") speed = settings.speed;
		if(typeof settings.cellSize !== "undefined") cellSize = settings.cellSize;
		if(typeof settings.operations !== "undefined") operations = settings.operations;
		if(typeof settings.numberRange !== "undefined") numberRange = settings.numberRange;
		if(typeof settings.difficulty !== "undefined") difficulty = settings.difficulty;
		if(typeof settings.growthInc !== "undefined") growthInc = settings.growthInc;
	}

	if(difficulty == 7) difficulty = "SNAKE MASTER"
	document.getElementById("difficulty").innerHTML = difficulty;

		var tLengthStore = localStorage.getItem("coins")
		if(tLengthStore !== null){
		coins = Number(tLengthStore)
		} else{
			coins = 0
		}

	if(localStorage.getItem("gameColors") !== null){
		var gameColors = JSON.parse(localStorage.getItem("gameColors"));
		if(typeof gameColors.snakeColor !== "undefined") snakeColor = gameColors.snakeColor;
		if(typeof gameColors.backColor !== "undefined") backColor = gameColors.backColor;
		if(typeof gameColors.gameColor !== "undefined") gameColor = gameColors.gameColor;
	}

	var sMSC = localStorage.getItem("magicSnakeColor");
	if(sMSC == 1){
		magicSnakeColor = 1;
		document.getElementById("magicSnakeLbl").innerHTML = "Click To Enable";
	}else if(sMSC == 2){
		magicSnakeColor = 2;
		document.getElementById("magicSnakeLbl").innerHTML = "Click To Disable";
	}else{
		magicSnakeColor = 0;
	}

	var sDM = localStorage.getItem("discoMode");
	if(sDM == 1){
		discoMode = 1;
		document.getElementById("discoModeLbl").innerHTML = "Click To Enable";
	}else if(sDM == 2){
		discoMode = 2;
		document.getElementById("discoModeLbl").innerHTML = "Click To Disable";
	}else{
		discoMode = 0;
	}

	if(Number(localStorage.getItem("highScore")) >= 1){
		highScore = Number(localStorage.getItem("highScore"));
	}else{
		highScore = 1;
	}


	if(localStorage.getItem("missionControl") == 1){
		missionControl = 1;
		document.getElementById("missionControlLbl").innerHTML = "Click To Enter"
	} else{
		missionControl = 0;
	}

	document.getElementById("iptSpeed").value = speed;
	document.getElementById("iptCellSize").value = 60 - cellSize;
	document.getElementById("iptOperations").value = operations;
	document.getElementById("iptNumberRange").value = 500 - numberRange;
	document.getElementById("iptGrowthInc").value = 101 - growthInc;

}

function ResetAll(){
	localStorage.removeItem("coins");
	localStorage.removeItem("gameColors");
	localStorage.removeItem("discoMode");
	localStorage.removeItem("magicSnakeColor");
	localStorage.removeItem("missionControl");
	window.location.href = 'index.html'
}
