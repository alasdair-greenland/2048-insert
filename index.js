//for now this is just a test

let ins = {};

ins.hello = function() {
  alert('hello, world!!!!');
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