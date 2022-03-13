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

var snakelife = 3;

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

function drawScore(snake) {
    if (snake.color == snake1.color) {
        scoreCanvas = document.getElementById("score1Board");
    }
    let scoreCtx = scoreCanvas.getContext("2d");

    scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    scoreCtx.font = "30px Arial";
    scoreCtx.fillStyle = snake.color;
    scoreCtx.fillText(snake.score, 40, scoreCanvas.scrollHeight - 15);

    //level-up
    if (snake.score === 0){
        document.getElementById("lv").value = "1";
        MOVE_INTERVAL = 150;     
    } else if (snake.score === 5){
        document.getElementById("lv").value = "2";
        MOVE_INTERVAL = 130;     
    } else if (snake.score === 10){
        document.getElementById("lv").value = "3";
        MOVE_INTERVAL = 100;     
    } else if (snake.score === 15){
        document.getElementById("lv").value = "4";
        MOVE_INTERVAL = 80;     
    } else if (snake.score === 20){
        document.getElementById("lv").value = "5";
        MOVE_INTERVAL = 50;     
    }
}

//Life
function drawlife(img, snake) {
    var lifeSize = 30;
    var lifeX = 40;
    
    infoCanvas = document.getElementById("infoboard");
    let infoCtx = infoCanvas.getContext("2d");

    infoCtx.clearRect(0, 0, 50, 50);
    infoCtx.fillStyle = snake.color;
    for (var i = 0; i < snakelife; i++) {
        infoCtx.drawImage(img, lifeX * i + 10, 10, lifeSize, lifeSize);
    }
}

function draw() {
    setInterval(function () {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        let img = document.getElementById("apple");
        let heart_img = document.getElementById("heart")

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        drawCell(ctx, snake1.head.x, snake1.head.y, snake1.color);
        for (let i = 1; i < snake1.body.length; i++) {
            drawCell(ctx, snake1.body[i].x, snake1.body[i].y, snake1.color);
        }

        //level
        
        //fruit
        ctx.drawImage(img, apple1.position.x * CELL_SIZE, apple1.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        ctx.drawImage(img, apple.position.x * CELL_SIZE, apple.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

        //heart
        ctx.drawImage(heart_img, heart.position.x * CELL_SIZE, heart.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

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
        snakelife++;
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
        alert("Game over");
        snake1 = initSnake("purple");
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