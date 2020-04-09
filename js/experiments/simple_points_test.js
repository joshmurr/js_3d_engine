var width = 512;
var height = 512;

var canvas = document.createElement("canvas");
// this.width = window.innerWidth;
// this.height = window.innerHeight;
canvas.width = width;
canvas.height = height;

var body = document.getElementsByTagName("body")[0];
body.appendChild(canvas);

var ctx = canvas.getContext("2d");
ctx.fillStyle = "rgba(255,0,0,0.2)";
ctx.fillRect(0, 0, width, height);

var points = [
    [ 1, -1, -5],
    [ 1, -1, -3],
    [ 1,  1, -5],
    [ 1,  1, -3],
    [-1, -1, -5],
    [-1, -1, -3],
    [-1,  1, -5],
    [-1,  1, -3]
];

console.log(points);

for(let i=0; i<points.length; i++){
    let xProj = points[i][0] / -points[i][2];
    let yProj = points[i][1] / -points[i][2];
    let xRemap  = (1 + xProj) / 2;
    let yRemap  = (1 + yProj) / 2;
    let xScreen = xRemap * width;
    let yScreen = yRemap * height;

    console.log([xScreen, yScreen]);

    ctx.fillStyle="black";
    ctx.fillRect(xScreen, yScreen, 2, 2);
}

    
