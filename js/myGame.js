// 
let canvas;
let ctx;

alert("Hello!");
alert("Isn't this fun?");
alert("Welcome to my mess.");

// Defines the characteristics of the grid
let TILESIZE = 64;
let WIDTH = TILESIZE * 64;
let HEIGHT = TILESIZE * 36;
let allSprites = [];
let walls = [];
let enemies = [];

// Declares necessary variables
let keysDown = {};
let keysUp = {};

// Defines the grid layout
let gamePlan = 
// /*
`
################################################################
######.................................####.................####
####.........................................................###
##.............................................................#
###............................................................#
##................................#####........................#
####......####..................########.......................#
###........##...................########.......................#
##...............................#######.......................#
##.................................###.........................#
#.............................................................##
#..............................................................#
#..............................................................#
#..............................................................#
#....................................##........................#
###...............##...............###.........................#
##..............####...........................................#
#................##............................................#
##.......................................##....................#
#........................................####.................##
#.#.........................................................####
###...........................................................##
##.........##.................................................##
#..........####...............................................##
#.........###..................................................#
#..........#####...........................###.................#
#..........................................####................#
#...........................................##.................#
#..............................................................#
#................................###...........................#
#.................................##..........................##
###...........####............................................##
####.............###..........................................##
###.............##..........................................####
#######........................###........................######
################################################################`;
    // */
/*
`
......................
..#####........#####..
..#...#........#...#..
..#...##########...#..
..#................#..
..#..###......###..#..
..#................#..
..#...####..####...#..
..#.......##.......#..
..#...####..####...#..
..#................#..
..#######....#######..
......................`;
*/

// Announces when the key is down
addEventListener("keydown", function (event) {
    keysDown[event.key] = true;
}, false);

// Revokes the "keydown" state
addEventListener("keyup", function (event) {
    delete keysDown[event.key];
}, false);

// Creates the grid and runs the gameloop
function init() {
    canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);
    gameLoop();
}

// Defines the generic "Sprite"
class Sprite {
    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        allSprites.push(this);
    }
    get type() {
        return "sprite";
    }
    create(x, y, w, h, color) {
        return new Sprite(x, y, w, h, color);
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    };
}

// Defines the generic "Player" of "Sprite" and defines the controls and movement
class Player extends Sprite {
    constructor(x, y, speed, w, h, color, hitpoints) {
        super(x, y, w, h, color);
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.w = w;
        this.h = h;
        this.color = color;
        this.hitpoints = hitpoints;
        // this.appearance = appearance;
    }
    collideWith(obj) {
        if (this.x + this.w > obj.x &&
            this.x < obj.x + obj.w &&
            this.y + this.h > obj.y &&
            this.y < obj.y + obj.h
        ) {
            return true;
        }
    }
    get type() {
        return "player";
    }
    input() {
        if ('w' in keysDown) {
            this.dy = 1
            this.dx = 0;
        } else if ('s' in keysDown) {
            this.dy = -1;
            this.dx = 0;
        } else if ('d' in keysDown) {
            this.dx = -1;
            this.dy = 0;
        } else if ('a' in keysDown) {
            this.dx = 1;
            this.dy = 0;
        } else {
            this.dx = 0;
            this.dy = 0;
        }
    }
    jump() {
        this.vy = -this.jumpPower;
        this.canJump = false;
    }
    update() {
        this.input();
        if (this.x + this.w > WIDTH) {
            this.x = WIDTH - this.w;
        }
        if (this.x <= 0) {
            this.x = 0;
        }
        if (this.y + this.h > HEIGHT) {
            this.y = HEIGHT - this.h;
        }
        if (this.y <= 0) {
            this.y = 0;
        }
        this.vx = this.speed * this.dx;
        this.vy = this.speed * this.dy;
        this.x -= this.vx;
        this.y -= this.vy;
    };
}

class Enemy extends Sprite {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = "blue";
        enemies.push(this);
    }
    create(x, y, w, h) {
        return new Enemy(x, y, w, h);
    }
    get type() {
        return "enemy";
    }
    update() {
        this.x += 1;
    }
}

// Defines the generic "Wall" of "Sprite"
class Wall extends Sprite {
    constructor(x, y, w, h, color) {
        super(x, y, w, h, color);
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
    }
    create(x, y, w, h, color) {
        return new Wall(x, y, w, h, color);
    }
    get type() {
        return "wall";
    }
}

let background = new Sprite(0, 0, WIDTH, HEIGHT, 'rgb(0, 0, 0)'/*./images/nightsky.jpg*/);

// Defines which characters are walls, and which are empty space
const levelChars = {
    ".": "empty",
    "#": Wall,
};

// Creates the grid
function makeGrid(plan, width) {
    let newGrid = [];
    let newRow = [];
    for (i of plan) {
        if (i != "\n") {
            newRow.push(i);
        }
        if (newRow.length % width == 0 && newRow.length != 0) {
            newGrid.push(newRow);
            newRow = [];
        }
    }
    return newGrid;
}

// Defines the characteristics of a wall
function readLevel(grid) {
    let startActors = [];
    for (y in grid) {
        for (x in grid[y]) {
            let ch = grid[y][x];
            if (ch != "\n") {
                let type = levelChars[ch];
                if (typeof type == "string") {
                    startActors.push(type);
                } else {
                    let t = new type;
                    startActors.push(t.create(x * TILESIZE, y * TILESIZE, TILESIZE, TILESIZE, 'grey'))
                }
            }
        }
    }
    return startActors;
}

// Calls readLevel on the grid
let currentLevel = readLevel(makeGrid(gamePlan, 64))
console.log("here's the current level " + currentLevel)

// Creates the player
let player1 = new Player(WIDTH / 4, HEIGHT / 4, 10, 0.5 * TILESIZE, 0.5 * TILESIZE, 'rgb(0, 125, 200)', 100);

// Checks for collision and resets the player's position
function update() {
    for (i of allSprites) {
        if (i.type == "wall") {
            if (player1.collideWith(i)) {
                if (player1.dx == -1) {
                    player1.x = i.x - player1.w;
                } else if (player1.dx == 1) {
                    player1.x = i.x + i.w;
                } else if (player1.dy == -1) {
                    player1.y = i.y - player1.h;
                } else if (player1.dy == 1) {
                    player1.y = i.y + i.h;
                }
            }
        }
    }
    for (e of enemies) {
        e.update();
    }
    player1.update();
}

// Draws the grid
function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    for (i of allSprites) {
        i.draw();
    }
}

// Repeats the update, draw functions
let gameLoop = function () {
    update();
    draw();
    for (e of enemies) {
        e.update();
    }
    window.requestAnimationFrame(gameLoop);
}