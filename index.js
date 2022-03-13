const CELL_SIZE = 20;
const CANVAS_SIZE = 600;

const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
}
var MOVE_INTERVAL;//ntar diubah jadi var bukan const

// var snakelife = 3;

function initPosition() {
    return {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT),
    }
}

function initHeadAndBody() {
    let head = initPosition();
    let body = [{ x: head.x, y: head.y }];
    return {
        head: head,
        body: body,
    }
}

function initDirection() {
    return Math.floor(Math.random() * 4);
}

function initSnake(color) {
    return {
        color: color,
        ...initHeadAndBody(),
        direction: initDirection(),
        score: 0,
        life: 3,
    }
}

let snake1 = initSnake("green");

let apple = {
    color: "red",
    position: initPosition(),
}

let apple1 = {
    color: "yellow",
    position: initPosition(),
}

let heart = {
    color: "pink",
    position: initPosition(),
}

function drawCell(context, x, y, color) {
    context.beginPath();
    context.fillStyle = color;

    context.arc(x * CELL_SIZE + 10, y * CELL_SIZE + 10, CELL_SIZE / 2, 0, 2 * Math.PI);
    context.fill();
}

function drawLevel(snake){
    var speed;
    var speedX = 100;

    MOVE_INTERVAL = 150;

    infoCanvas = document.getElementById("infoboard");
    let infoCtx = infoCanvas.getContext("2d");   
    
    speedCanvas = document.getElementById("score1Board");
    let speedCtx = speedCanvas.getContext("2d"); 

    //level-up
    if (snake.score < 5){
        lv = "1";
        speed = MOVE_INTERVAL;
        document.getElementById("speed").value = MOVE_INTERVAL; 
    } 
    else if (snake.score < 10){
        lv = "2";
        speed = MOVE_INTERVAL - 20;     
        document.getElementById("speed").value = MOVE_INTERVAL; 

        drawObstacle(speedX ,300 ,400 ,20 );
    } 
    else if (snake.score < 15){
        lv = "3";
        speed = MOVE_INTERVAL - 30;     
        document.getElementById("speed").value = MOVE_INTERVAL; 

        drawObstacle(speedX ,50 ,400 ,20);
        drawObstacle(speedX ,100 ,400 ,20);
    } 
    else if (snake.score < 20){
        lv = "4";
        speed = MOVE_INTERVAL - 40;    
        document.getElementById("speed").value = MOVE_INTERVAL; 

        drawObstacle(speedX ,50 ,400 ,20);
        drawObstacle(speedX ,100 ,400 ,20);
        drawObstacle(speedX ,150 ,400 ,20);
    } 
    else if (snake.score === 20){
        lv = "5";
        speed = MOVE_INTERVAL - 50;     
        document.getElementById("speed").value = MOVE_INTERVAL; 
    }

    //Level-Show
    infoCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    infoCtx.fillStyle = "black";
    infoCtx.font = "bold 20px Arial";
    infoCtx.fillText("Level " + lv, 520, 30, infoCanvas.scrollHeight + 30);
    
    //Speed Show;
    speedCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    speedCtx.fillText("Score " + speed, 10, speedCanvas.scrollHeight + 20);
}

function drawObstacle(x, y, w, h){
    let snakeCanvas = document.getElementById("snakeBoard");
    let ctx = snakeCanvas.getContext("2d");

    ctx.fillStyle = "black";
    ctx.fillRect(x,y,w,h);
}

function drawScore(snake) {

    if (snake.color == snake1.color) {
        scoreCanvas = document.getElementById("score1Board");
    }
    let scoreCtx = scoreCanvas.getContext("2d");

    scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    scoreCtx.font = "bold 20px Arial";
    scoreCtx.fillStyle = "#414BB2";
    scoreCtx.fillText("Score " + snake.score, 10, scoreCanvas.scrollHeight - 20);
}

//Life
function drawlife(img, snake) {
    var lifeSize = 20;
    var lifeX = 25;
    
    infoCanvas = document.getElementById("infoboard");
    let infoCtx = infoCanvas.getContext("2d");

    infoCtx.clearRect(0, 0, 50, 50);
    infoCtx.fillStyle = "red";
    infoCtx.fillText("HP", 10, 30)
    for (var i = 0; i < snake.life; i++) {
        infoCtx.drawImage(img, lifeX * i + 45, 13, lifeSize, lifeSize);
    }
}

//nabrak

function draw() {
    setInterval(function () {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        let img = document.getElementById("apple");
        let heart_img = document.getElementById("heart")

        var prima = true;

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        drawCell(ctx, snake1.head.x, snake1.head.y, snake1.color);
        for (let i = 1; i < snake1.body.length; i++) {
            drawCell(ctx, snake1.body[i].x, snake1.body[i].y, snake1.color);
        }

        //level
        drawLevel(snake1);

        //fruit
        ctx.drawImage(img, apple1.position.x * CELL_SIZE, apple1.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        ctx.drawImage(img, apple.position.x * CELL_SIZE, apple.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

        //heart
        if (snake1.score > 1) {
            for (let i = 2; i < snake1.score; i++) {
              if (snake1.score % i == 0) {
                prima = false;
                break;
              }
            }
            if (prima) {
              ctx.drawImage(heart_img, heart.position.x * CELL_SIZE, heart.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
          }
        //Score
        drawScore(snake1);

        //life
        drawlife(heart_img, snake1);
    }, REDRAW_INTERVAL);
}

function teleport(snake) {
    if (snake.head.x < 0) {
        snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.x >= WIDTH) {
        snake.head.x = 0;
    }
    if (snake.head.y < 0) {
        snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.y >= HEIGHT) {
        snake.head.y = 0;
    }
}

function eat(snake, apple, apple1, heart) {
    if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
        apple.position = initPosition();
        snake.score++;
        snake.body.push({ x: snake.head.x, y: snake.head.y });
    }

    if (snake.head.x == apple1.position.x && snake.head.y == apple1.position.y) {
        apple1.position = initPosition();
        snake.score++;
        snake.body.push({ x: snake.head.x, y: snake.head.y });
    }

    if (snake.head.x == heart.position.x && snake.head.y == heart.position.y) {
        heart.position = initPosition();
        snake.life++;
    }
}

function moveLeft(snake) {
    snake.head.x--;
    teleport(snake);
    eat(snake, apple, apple1, heart);
}

function moveRight(snake) {
    snake.head.x++;
    teleport(snake);
    eat(snake, apple, apple1, heart);
}

function moveDown(snake) {
    snake.head.y++;
    teleport(snake);
    eat(snake, apple, apple1, heart);
}

function moveUp(snake) {
    snake.head.y--;
    teleport(snake);
    eat(snake, apple, apple1, heart);
}

function checkCollision(snakes) {
    let isCollide = false;
    //this
    for (let i = 0; i < snakes.length; i++) {
        for (let j = 0; j < snakes.length; j++) {
            for (let k = 1; k < snakes[j].body.length; k++) {
                if (snakes[i].head.x == snakes[j].body[k].x && snakes[i].head.y == snakes[j].body[k].y) {
                    isCollide = true;
                }
            }
        }
    }

    

    if (isCollide) {
        snake1.life--;
        alert("Game over");
        
        // life
        if(snake1.life > 0){
            snake1 = { 
                ...snake1,
                ...initHeadAndBody(),
                direction: initDirection(),
            }
        } else if(snake1.life === 0){
            snake1 = initSnake("green");
        }

    }

    return isCollide;
}

function move(snake) {
    switch (snake.direction) {
        case DIRECTION.LEFT:
            moveLeft(snake);
            break;
        case DIRECTION.RIGHT:
            moveRight(snake);
            break;
        case DIRECTION.DOWN:
            moveDown(snake);
            break;
        case DIRECTION.UP:
            moveUp(snake);
            break;
    }
    moveBody(snake);
    if (!checkCollision([snake1])) {
        setTimeout(function () {
            move(snake);
        }, MOVE_INTERVAL);
    } else {
        initGame();
    }
}

function moveBody(snake) {
    snake.body.unshift({ x: snake.head.x, y: snake.head.y });
    snake.body.pop();
}

function turn(snake, direction) {
    const oppositeDirections = {
        [DIRECTION.LEFT]: DIRECTION.RIGHT,
        [DIRECTION.RIGHT]: DIRECTION.LEFT,
        [DIRECTION.DOWN]: DIRECTION.UP,
        [DIRECTION.UP]: DIRECTION.DOWN,
    }

    if (direction !== oppositeDirections[snake.direction]) {
        snake.direction = direction;
    }
}

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        turn(snake1, DIRECTION.LEFT);
    } else if (event.key === "ArrowRight") {
        turn(snake1, DIRECTION.RIGHT);
    } else if (event.key === "ArrowUp") {
        turn(snake1, DIRECTION.UP);
    } else if (event.key === "ArrowDown") {
        turn(snake1, DIRECTION.DOWN);
    }
})

function initGame() {
    move(snake1);
}

initGame();