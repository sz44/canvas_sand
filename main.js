const CELL_SIZE = 15;
const ROWS = 32;
const COLS = 42;

const INIT_VEL = 1;

const canvas = document.querySelector("canvas");
canvas.height = CELL_SIZE * ROWS;
canvas.width = CELL_SIZE * COLS;
const ctx = canvas.getContext("2d");

let Grid = makeGrid();
let velGrid = makeGrid();
let empty = "#292929";
let filled = "#214f6c";

let mouse = {x: 0, y: 0}

let mouseDown = false;

canvas.addEventListener("mousemove", (e) => {
  let [x, y] = [e.offsetX, e.offsetY];
  mouse.x = x;
  mouse.y = y;
});

canvas.addEventListener("mousedown", (e) => {
  let [x, y] = [e.offsetX, e.offsetY];
  mouse.x = x;
  mouse.y = y;
  mouseDown = true;
});

window.addEventListener("mouseup", (e) => {
  mouseDown = false;
});

const Game = {
  update() {
    // if above last Row and nothing below or the one below has vel > 0 -> move down
    let nextGrid = makeGrid();
    let nextVelGrid = makeGrid();
    for (let y = ROWS - 1; y >= 0; y--) {
      for (let x = COLS - 1; x >= 0; x--) {
        if (Grid[y][x] === 1) {
          if (y < ROWS - 1 && (Grid[y + 1][x] === 0 || velGrid[y + 1][x] === 1)) {
              nextGrid[y + 1][x] = 1;
              // decide if to set vel to zero
               
              if (y + 1 === ROWS - 1 || (nextGrid[y+2][x] === 1 && nextVelGrid[y+2][x] === 0)) {
                nextVelGrid[y + 1][x] = 0;
              } else {
                nextVelGrid[y + 1][x] = 1;
              }
          } else {
              nextGrid[y][x] = 1;
              nextVelGrid[y][x] = 0;
          }
        }
      }
    }
    // for (let y = 0; y < ROWS; y++) {
    //   for (let x = 0; x < COLS; x++) {
    //     if (Grid[y][x] === 1) {
    //       if (y < ROWS - 1 && (Grid[y + 1][x] === 0 || velGrid[y + 1][x] === 1)) {
    //           // console.log("y < ROWS - 1: ", y, x)
    //           nextGrid[y + 1][x] = 1;
    //           if (y + 1 === ROWS - 1 || (Grid[y+1][x] === 1 && velGrid[y+1][x] === 0)) {
    //             nextVelGrid[y + 1][x] = 0;
    //           } else {
    //             nextVelGrid[y + 1][x] = 1;
    //           }
    //           // velGrid[y + 1][x] = 1;
    //       } else {
    //           // when to stop?
    //           // if at last row y == ROWS - 1
    //           // if there is sq below and its stopped. y + 1 grid === 1 and velGrid === 0
    //           // console.log("last row: ", y, x)
    //           // console.log(Grid);
    //           // console.log(velGrid);
    //           nextGrid[y][x] = 1;
    //           nextVelGrid[y][x] = 0;
    //           // velGrid[y][x] = 0;
    //       }
    //     }
    //   }
    // }
    Grid = nextGrid;
    velGrid = nextVelGrid;
  },
  // let dir = Math.round(Math.random(1) * 2) - 1
  // let dir = -1;
  // if (dir === -1 && x > 0 && Grid[y][x-1] === 0) {
  //   nextGrid[y][x-1] = 1;
  // }
  // if (dir === 1 && x < COLS - 1 && Grid[y][x + 1] === 0) {
  //   nextGrid[y][x+1] = 1;
  // }
  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let y in Grid) {
      for (let x in Grid[0]) {
        if (Grid[y][x] === 0) {
          ctx.fillStyle = empty;
        } else {
          ctx.fillStyle = filled;
        }
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

let speed = 200;
let lastRun = 0;
function loop() {
  if (mouseDown && mouse.y >= 0 && mouse.y < canvas.height) {
    let row = Math.floor(mouse.y / CELL_SIZE);
    let col = Math.floor(mouse.x / CELL_SIZE);
    Grid[row][col] = 1;
    velGrid[row][col] = 1;
  }
  Game.draw();
  if (Date.now() - lastRun > speed) {
    Game.update()
    lastRun = Date.now();
  }
  requestAnimationFrame(loop);
}
loop()

function makeGrid() {
  let grid = [];
  for (let i = 0; i < ROWS; i++) {
    let row = [];
    for (let j = 0; j < COLS; j++) {
      row.push(0);
    }
    grid.push(row);
  }
  return grid;
}

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vel = 1;
    this.color = "#ff0000";
  }
  update() {
    this.y += this.vel;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, CELL_SIZE, CELL_SIZE);
  }
}