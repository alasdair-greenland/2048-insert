//for now this is just a test

alert('loaded 2048 insert!!');

let ins = {};

ins.hello = function() {
  alert('hello, world!!!!');
}

ins.getTileArray = function() {
  let grid = document.getElementsByClassName("tileContainer")[0];
  let tiles = [];
  for (let i = 0; i < 16; i++) tiles[i] = 0;
  let tileEles = grid.children;
  for (let i = 0; i < tileEles.length; i++) {
    let str = tileEles[i].className.split(" ");
    let posString = str[2];
    let x = posString.split('-')[2];
    let y = posString.split('-')[3];
    tiles[(y - 1) * 4 + x - 1] = str[1].split("-")[1];
  }
  return tiles;
}