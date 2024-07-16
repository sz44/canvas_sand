const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const size = 5;
const fps = 60;
const width = 800;
const height = 600;
canvas.width = width;
canvas.height = height;

const colors = ["#292929", "#e1bf92", "#e7c496", "#eccca2", "#f2d2a9", "#f6d7b0"];

const grid = Array(Math.floor(height / size)).fill(null)
  .map(() => Array(Math.floor(width / size)).fill(0));

let isMousePressed = false;
let mouseX = 0;
let mouseY = 0;

function createSand(x, y) {
  const gridX = Math.floor(x / size);
  const gridY = Math.floor(y / size);
  if (gridY >= 0 && gridY < grid.length && gridX >= 0 && gridX < grid[0].length) {
    // random 1-5
    let r = Math.floor(Math.random() * (colors.length - 1)) + 1;
    grid[gridY][gridX] = r;
  }
}

function canSlide(dir, y, x) {
  // left
  if (dir < 0) {
    if (y + 1 < grid.length && x - 1 >= 0 && grid[y+1][x-1] === 0) {
      return true;
    }
  } 
  // right
  if (dir >= 0) {
    if (y + 1 < grid.length && x + 1 >= 0 && grid[y+1][x+1] === 0) {
      return true;
    }
  } 

  return false;
}

function updateSand() {
  for (let y = grid.length - 1; y >= 0; y--) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] >= 1) {
        let dir = Math.sign(Math.random(1) - 0.5);
        if (y + 1 < grid.length && grid[y + 1][x] === 0) {
          grid[y + 1][x] = grid[y][x];
          grid[y][x] = 0;
        } else if(canSlide(dir, y, x)) {
          grid[y + 1][x + dir] = grid[y][x];
          grid[y][x] = 0;
        } else if(canSlide(-dir, y, x)) {
          grid[y + 1][x - dir] = grid[y][x];
          grid[y][x] = 0;
        }
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] !== 0) {
        ctx.fillStyle = colors[grid[y][x]];
        ctx.fillRect(x * size, y * size, size, size);
      }
    }
  }
}

const frameTime = 1000 / fps;
let lastRun = 0;

function gameLoop(time) {
  requestAnimationFrame(gameLoop);
  if (time - lastRun < frameTime) {
    return;
  }
  lastRun = time;
  if (isMousePressed) {
    createSand(mouseX, mouseY);
  }
  draw();
  updateSand();
}

canvas.addEventListener('mousedown', (event) => {
  isMousePressed = true;
  updateMousePosition(event);
});
document.addEventListener('mouseup', () => isMousePressed = false);
canvas.addEventListener('mousemove', updateMousePosition);

function updateMousePosition(event) {
  const rect = canvas.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
}

requestAnimationFrame(gameLoop);
