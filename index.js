// Game Constants and Variables
let inputDir={x: 0,y: 0};
const foodSound= new Audio('food.mp3');
const gameOverSound= new Audio('gameOver.mp3');
const moveSound= new Audio('move.mp3');
const musicSound=new Audio('music.mp3');
let speed=4;
let score=0;
let lastPaintTime=0;
let snakeArr=[
    {x:13,y:15}
];
let food= {x:6, y:7};
let isPaused = false;
var hiscoreval = 0;

function newfoodpositon(){
    let a=2,b=16;
    food = {x: Math.round(a + (b-a)*Math.random()), y: Math.round(a + (b-a)*Math.random())};
    for (let i=0; i< snakeArr.length; i++){
        if (snakeArr[i].x === food.x && snakeArr[i].y === food.y){
            newfoodpositon();
            return;
        }
    }
    return;
}
function pauseGame(){
    clearInterval(interval);
    isPaused=true;
    paused.innerHTML= "Game Paused";
}

function resumeGame(){
    interval= setInterval(gameEngine,1000/speed);
    isPaused= false;
    paused.innerHTML="";
}

function gameEngine(){
    //Part 1: Updating the snake array & food
    if(isCollide(snakeArr)){
        gameOverSound.play();
        musicSound.pause();
        inputDir={x:0, y:0};
        alert("Game Over. Press any key to play again!");
        snakeArr=[{x:13, y:15}];
        musicSound.play();
        score = 0;
    }

    //If you have eaten the food, increment the score and regenerate the food
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y){
        foodSound.play();
        snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y:snakeArr[0].y + inputDir.y});
        newfoodpositon();
        score += 1;
        if (score >= hiscoreval){
            hiscoreval = score;
            localStorage.setItem("hiscore", hiscoreval);
            let hisc = localStorage.getItem("hiscore");
            if (hisc !=null){
                hiscoreBox.innerHTML = "HiScore: " + hisc;
            }
        }
        scoreBox.innerHTML = "Score: " + score;
    }

    // Moving the snake
    for(let i=snakeArr.length -2; i>=0; i--){
        snakeArr[i+1] = {...snakeArr[i]};
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    //Pert 2: Display the snake & food
    // Display the snake
    board.innerHTML="";
    snakeArr.forEach((e, index)=>{
        snakeElement=document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index===0){
            snakeElement.classList.add('head');
        }
        else{
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    })
    // Display the food
    foodElement=document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

function isCollide(snake){
    // If you bump into yourself
    for (let i=1; i< snakeArr.length; i++){
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            return true;
        }
    }
    // If you bump into the walls
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0){
        return true;
    }
}



// Main Logic Starts here
var hiscore = localStorage.getItem("hiscore");
if (hiscore == null){
    hiscoreval = 0;
    localStorage.setItem("hiscore", hiscoreval);

}
else{
    hiscoreval = localStorage.getItem("hiscore");
    hiscoreBox.innerHTML = "HiScore: "+ hiscore;
}

// window.requestAnimationFrame(main);
window.addEventListener('keydown', e =>{
    //Start the game
    musicSound.play();
    moveSound.play();
    switch(e.key){
        case "ArrowUp":
            inputDir.x=  0;
            inputDir.y= -1;
            break;

        case "ArrowDown":
            inputDir.x=  0;
            inputDir.y= 1;
            break;

        case "ArrowLeft":
            inputDir.x=  -1;
            inputDir.y= 0;
            break;

        case "ArrowRight":
            inputDir.x=  1;
            inputDir.y= 0;
            break;
        default:
            break;
    }   
});
window.addEventListener("keydown", e => {
    if (e.keyCode == 80){
        if(isPaused) resumeGame();
        else pauseGame();
    }
})
let interval= setInterval(gameEngine,1000/speed);
