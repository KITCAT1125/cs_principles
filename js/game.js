let canvas;
let ctx;

let TILESIZE = 64;
let WIDTH = TILESIZE * 22;
let HEIGHT = TILESIZE * 13;
let allSprites = [];
let walls = [];

let keysDown = {};
let keysUp = {};

let gamePlan = `
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

addEventListener("keydown", function(event){
    keysDown[event.key] = true;
}, false);

addEventListener("keyup", function(event){
    delete keysDown[event.key];
}, false);

function init(){
    canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);
    gameLoop();
}

class Sprite{
    constructor(x, y, w, h, color){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        allSprites.push(this);
    }
    get type(){
        return "sprite";
    }
    create(x, y, w, h, color){
        return new Sprite(x, y, w, h, color);
    }
    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    };
}

class Player extends Sprite{
    constructor(x, y, speed, w, h, color, hitpoints){
        super(x, y, w, h, color);
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.w = w;
        this.h = h;
        this.color = color;
        this.hitpoints = hitpoints;
    }
    collideWith(obj){
        if (this.x + this.w > obj.x &&
            this.x < obj.x + obj.w &&
            this.y + this.h > obj.y &&
            this.y < obj.y + obj.h
        ){
            return true;
        }
    }
    get type(){
        return "player";
    }
    input(){
        if ('s' in keysDown){
            this.dy = -1;
            this.dx = 0;
        }
        else if ('d' in keysDown){
            this.dx = -1;
            this.dy = 0;
        }
        else if ('w' in keysDown){
            this.dy = 1
            this.dx = 0;
        }
        else if ('a' in keysDown){
            this.dx = 1;
            this.dy = 0;
        }
        else{
            this.dx = 0;
        this.dy = 0;
        }
    }
    update(){
        this.input();
        if (this.x + this.w > WIDTH){
            this.x = WIDTH - this.w;
        }
        if (this.x <= 0){
            this.x = 0;
        }
        if (this.y + this.h > HEIGHT){
            this.y = HEIGHT - this.h;
        }
        if (this.y <= 0){
            this.y = 0;
        }
        this.vx = this.speed*this.dx;
        this.vy = this.speed*this.dy;
        this.x -= this.vx;
        this.y -= this.vy;

    };
}

class Wall extends Sprite{
    constructor(x, y, w, h, color){
        super(x, y, w, h, color);
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
    }
    create(x, y, w, h, color){
        return new Wall(x, y, w, h, color);
    }
    get type(){
        return "wall";
    }
}

const levelChars = {
    ".": "empty",
    "#": Wall,
};

function makeGrid(plan, width){
    let newGrid = [];
    let newRow = [];
    for (i of plan){
        if (i != "\n"){
            newRow.push(i);
        }
        if (newRow.length % width == 0 && newRow.length != 0){
            newGrid.push(newRow);
            newRow = [];
        }
    }
    return newGrid;
}

function readLevel(grid){
    let startActors = [];
    for (y in grid){
        for (x in grid[y]){
            let ch = grid[y][x];
            if (ch != "\n"){
                let type = levelChars[ch];
                if (typeof type == "string"){
                    startActors.push(type);
                } else{
                    let t = new type;
                    startActors.push(t.create(x * TILESIZE, y * TILESIZE, TILESIZE, TILESIZE, 'cyan'))
                }
            }
        }
    }
    return startActors;
}

let currentLevel = readLevel(makeGrid(gamePlan, 22))

let player1 = new Player(WIDTH / 1, HEIGHT / 1, 10, 0.5 * TILESIZE, 0.5 * TILESIZE, 'rgb(0, 125, 200)', 100);

function update(){
    for (i of allSprites){
        if (i.type == "wall"){
            if (player1.collideWith(i)){
                if (player1.dx == -1){
                    player1.x = i.x - player1.w;
                }
                else if (player1.dx == 1){
                    player1.x = i.x + i.w;
                }
                else if (player1.dy == -1){
                    player1.y = i.y - player1.h;
                }
                else if (player1.dy == 1){
                    player1.y = i.y + i.h;
                }
            }
        }
    }
    player1.update();
}

function draw(){
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    for (i of allSprites){
        i.draw();
    }
}

let gameLoop = function(){
    update();
    draw();
    window.requestAnimationFrame(gameLoop);
}