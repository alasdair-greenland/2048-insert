const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

let ins = {};

function setupMoveOverlay() {
  let para = document.createElement("h1");
  para.id = "move-overlay";
  para.innerHTML = "NONE";
  para.style.position = "fixed";
  para.style.left = '5px';
  para.style.top = '5px';
  document.body.appendChild(para);
}
setupMoveOverlay();

document.addEventListener('keydown', e => {

  setTimeout(ins.findAndDisplay, 50);
  
});

ins.findAndDisplay = function() {

  let g = ins.createGame();
  g.tiles = ins.getTileArray();
  let disp = document.getElementById("move-overlay");
  disp.innerHTML = "LOADING...";

  if (g.isGameOver()) {
    return;
  }
  
  let res = ins.determineBestMove(g, 7, -1);

  switch (res.direction) {

    case UP: disp.innerHTML = "UP"; break;
    case DOWN: disp.innerHTML = "DOWN"; break;
    case LEFT: disp.innerHTML = "LEFT"; break;
    case RIGHT: disp.innerHTML = "RIGHT"; break;
    default: break;
      
  }
  
}

ins.dbmWithTimer = function(game, depth, dir) {
  let startTime = Date.now();
  let result = ins.determineBestMove(game, depth, dir);
  console.log("Time taken: " + (Date.now() - startTime) + "ms");
  return result;
}

ins.determineBestMove = function(game, depth, dir) {
    
  if (depth == 0 || game.isGameOver()) {
    return {
      score: game.score,
      direction: dir
    }
  }

  let scores = {};
  let validMoves = [];

  if (game.canMove(UP)) {
    validMoves.push(UP);
    let up = game.calcNextState(UP);
    scores[UP] = ins.determineBestMove(up, depth - 1, UP);
  }
  if (game.canMove(DOWN)) {
    validMoves.push(DOWN);
    let down = game.calcNextState(DOWN);
    scores[DOWN] = ins.determineBestMove(down, depth - 1, DOWN);
  }
  if (game.canMove(RIGHT)) {
    validMoves.push(RIGHT);
    let right = game.calcNextState(RIGHT);
    scores[RIGHT] = ins.determineBestMove(right, depth - 1, RIGHT);
  }
  if (game.canMove(LEFT)) {
    validMoves.push(LEFT);
    let left = game.calcNextState(LEFT);
    scores[LEFT] = ins.determineBestMove(left, depth - 1, LEFT);
  }

  let max = -1;
  let outdir = -1;
  for (let i = 0; i < validMoves.length; i++) {
    let d = validMoves[i];
    if (scores[d].score > max) {
      max = scores[d].score;
      outdir = d;
    }
  }

  return {
    score: max,
    direction: outdir
  };
  
}

ins.getTileArray = function() {
  let grid = document.getElementsByClassName("tile-container")[0];
  let tiles = [];
  for (let i = 0; i < 16; i++) tiles[i] = 0;
  let tileEles = grid.children;
  for (let i = 0; i < tileEles.length; i++) {
    let arr = tileEles[i].className.split(" ");
    let posString = arr[2];
    let x = Number(posString.split('-')[2]);
    let y = Number(posString.split('-')[3]);
    tiles[(y - 1) * 4 + x - 1] = Number(arr[1].split("-")[1]);
  }
  return tiles;
}

ins.createGame = function() {

  let game = {};

  game.tiles = [];
  game.score = 0;

  for (let i = 0; i < 16; i++) {
    game.tiles[i] = 0;
  }

  game.addRandomTile = function() {
    /*
     * adds a tile to a random position on the grid
     * 90% of the time, adds a 2 tile, 10% of the time, adds a 4
     * returns true if successful
     */
    let options = [];
    for (let i = 0; i < game.tiles.length; i++) {
      if (!(game.tiles[i])) {
        options.push(i);
      }
    }
    if (options.length == 0) return false;
    let r = Math.floor(Math.random() * options.length);
    let n = Math.random() < 0.9 ? 2 : 4;
    game.tiles[options[r]] = n;
    return true;
  }

  game.canMove = function(dir) {
    /*
     * checks if a move in a given direction is valid
     * returns true if that move is valid, false if it isn't
     */

    if (dir == UP) {
      for (let i = 4; i < game.tiles.length; i++) {
        // start at 4 because top row tiles can never move up
        let n = game.tiles[i];
        if (game.tiles[i] != 0 && (game.tiles[i - 4] == n || game.tiles[i - 4] == 0)) {
          return true;
        }
      }
      return false;
    }
    else if (dir == RIGHT) {
      for (let i = 0; i < game.tiles.length; i++) {
        if (i % 4 != 3) {
          let n = game.tiles[i];
          if (game.tiles[i] != 0 && (game.tiles[i + 1] == n || game.tiles[i + 1] == 0)) {
            return true;
          }
        }
      }
      return false;
    }
    else if (dir == DOWN) {
      for (let i = 0; i < game.tiles.length - 4; i++) {
        let n = game.tiles[i];
        if (game.tiles[i] != 0 && (game.tiles[i + 4] == n || game.tiles[i + 4] == 0)) {
          return true;
        }
      }
      return false;
    }
    else if (dir == LEFT) {
      for (let i = 0; i < game.tiles.length; i++) {
        if (i % 4 != 0) {
          let n = game.tiles[i];
          if (game.tiles[i] != 0 && (game.tiles[i - 1] == n || game.tiles[i - 1] == 0)) {
            return true;
          }
        }
      }
      return false;
    }
    
  }

  game.isGameOver = function() {
    // returns true if we can't move in any direction
    return !(game.canMove(UP) || game.canMove(RIGHT) || game.canMove(DOWN) || game.canMove(LEFT));
  }

  game.calcNextState = function(dir) {
    let g = ins.createGame();
    g.tiles = [];
    g.indexesMerged = [];
    if (!(game.canMove(dir))) {
      g.tiles = JSON.parse(JSON.stringify(game.tiles));
      g.score = game.score;
      return g;
    }
    
    if (dir == UP) {
      for (let i = 0; i < 4; i++) {
        g.tiles[i] = game.tiles[i];
      }
      for (let i = 4; i < game.tiles.length; i++) {
        if (game.tiles[i] == 0) {
          g.tiles[i] = 0;
          continue;
        }
        
        let j = i;
        while (j - 4 >= 0 && g.tiles[j - 4] == 0) {
          j -= 4;
        }
        if (j - 4 >= 0 && g.tiles[j - 4] == game.tiles[i] && !(g.indexesMerged.includes(j - 4))) {
          g.tiles[j - 4] = game.tiles[i] * 2;
          g.score += game.tiles[i] * 2;
          g.tiles[i] = 0;
          g.indexesMerged.push(j - 4);
        }
        else {
          g.tiles[i] = 0;
          g.tiles[j] = game.tiles[i];
        }
      }
    }
    else if (dir == RIGHT) {
      for (let i = 3; i < game.tiles.length; i += 4) {
        g.tiles[i] = game.tiles[i];
      }
      for (let i = game.tiles.length - 2; i >= 0; i--) {
        if (i % 4 == 3) {
          continue;
        }
        if (game.tiles[i] == 0) {
          g.tiles[i] = 0;
          continue;
        }
        
        let j = i;
        while ((j + 1) % 4 != 0 && g.tiles[j + 1] == 0) {
          j++;
        }
        if ((j + 1) % 4 != 0 && g.tiles[j + 1] == game.tiles[i] && !(g.indexesMerged.includes(j + 1))) {
          g.tiles[j + 1] = game.tiles[i] * 2;
          g.score += game.tiles[i] * 2;
          g.tiles[i] = 0;
          g.indexesMerged.push(j + 1);
        }
        else {
          g.tiles[i] = 0;
          g.tiles[j] = game.tiles[i];
        }
      }
    }
    else if (dir == DOWN) {
      for (let i = game.tiles.length - 4; i < game.tiles.length; i++) {
        g.tiles[i] = game.tiles[i];
      }
      for (let i = game.tiles.length - 5; i >= 0; i--) {
        if (game.tiles[i] == 0) {
          g.tiles[i] = 0;
          continue;
        }
        
        let j = i;
        while (j + 4 < game.tiles.length && g.tiles[j + 4] == 0) {
          j += 4;
        }
        if (j + 4 < game.tiles.length && g.tiles[j + 4] == game.tiles[i] && !(g.indexesMerged.includes(j + 4))) {
          g.tiles[j + 4] = game.tiles[i] * 2;
          g.score += game.tiles[i] * 2;
          g.tiles[i] = 0;
          g.indexesMerged.push(j + 4);
        }
        else {
          g.tiles[i] = 0;
          g.tiles[j] = game.tiles[i];
        }
      }
    }
    else if (dir == LEFT) {
      for (let i = 0; i < game.tiles.length; i += 4) {
        g.tiles[i] = game.tiles[i];
      }
      for (let i = game.tiles.length - 1; i >= 0; i--) {
        if (i % 4 == 0) {
          continue;
        }
        if (game.tiles[i] == 0) {
          g.tiles[i] = 0;
          continue;
        }
        
        let j = i;
        while ((j - 1) % 4 != 3 && g.tiles[j - 1] == 0) {
          j--;
        }
        if ((j - 1) % 4 != 3 && g.tiles[j - 1] == game.tiles[i] && !(g.indexesMerged.includes(j - 1))) {
          g.tiles[j - 1] = game.tiles[i] * 2;
          g.score += game.tiles[i] * 2;
          g.tiles[i] = 0;
          g.indexesMerged.push(j - 1);
        }
        else {
          g.tiles[i] = 0;
          g.tiles[j] = game.tiles[i];
        }
      }
    }

    g.addRandomTile();
    g.indexesMerged = [];
    return g;
  }

  return game;

  
}