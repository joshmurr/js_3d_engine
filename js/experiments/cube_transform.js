import Vec4 from '../math/vec4.js';
import Mat44 from '../math/mat44.js';

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
    new Vec4(-0.5,  0.5, -0.5, 1),
    new Vec4( 0.5,  0.5, -0.5, 1),
    new Vec4( 0.5,  0.5,  0.5, 1),
    new Vec4(-0.5,  0.5,  0.5, 1),
    new Vec4(-0.5, -0.5, -0.5, 1),
    new Vec4( 0.5, -0.5, -0.5, 1),
    new Vec4( 0.5, -0.5,  0.5, 1),
    new Vec4(-0.5, -0.5,  0.5, 1)
];

var points2 = [
    new Vec4( 1, -1, -5, 1),
    new Vec4( 1, -1, -3, 1),
    new Vec4( 1,  1, -5, 1),
    new Vec4( 1,  1, -3, 1),
    new Vec4(-1, -1, -5, 1),
    new Vec4(-1, -1, -3, 1),
    new Vec4(-1,  1, -5, 1),
    new Vec4(-1,  1, -3, 1)
];


// worldToCameraPoint.printProps();

// cameraToScreenPoint.printProps();

let theta = 0;
function draw(){
    let rotate = new Mat44();
    // STORED AS COLUMN MAJOR
    // transform.M[ 0] =  0.718762;
    // transform.M[ 4] =  0.615033;
    // transform.M[ 8] = -0.324214;
    // transform.M[12] =  0;
    // transform.M[ 1] = -0.393732;
    // transform.M[ 5] =  0.744416;
    // transform.M[ 9] =  0.539277;
    // transform.M[13] =  0;
    // transform.M[ 2] =  0.573024;
    // transform.M[ 6] = -0.259959;
    // transform.M[10] =  0.777216;
    // transform.M[14] =  0;
    // transform.M[ 3] =  0.526967;
    // transform.M[ 7] =  1.254234;
    // transform.M[11] = -2.532150;
    // transform.M[15] =  1;

    rotate.M[0] = 1;
    rotate.M[5] = Math.cos(theta);
    rotate.M[6] = Math.sin(theta);
    rotate.M[9] = -Math.sin(theta);
    rotate.M[10] = Math.cos(theta);
    rotate.M[15] = 1;

    let translate = new Mat44();
    translate.setMat([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);

    let transform = new Mat44();
    transform.setIdentity();


    let localToWorld = transform.getCopy();

    // let transformInverse = identity.getAffineInverse();

    for(let i=0; i<points2.length; i++){
        // points[i].z -= 2;
        // points[i].printProps();
        let p = transform.getMultiplyVecW(points2[i]);
        // let localToWorldPoint = localToWorld.getMultiplyVec(points2[i]);
        // localToWorldPoint.printProps();
        // let worldToCameraPoint = cameraToWorld.getMultiplyVec(localToWorldPoint);
        let cameraToScreenPoint = p.getCopy();
        // cameraToScreenPoint.multiply(100);
        // cameraToScreenPoint.printProps();

        let xNorm = (cameraToScreenPoint.x + (width/2)) / width;
        let yNorm = (cameraToScreenPoint.y + (height/2)) / height;
        let xScreen = xNorm * width;
        let yScreen = yNorm * height;
        // console.log([xScreen, yScreen]);

        ctx.fillStyle="black";
        ctx.fillRect(xScreen, yScreen, 2, 2);
    }
    theta += 0.01;
    // requestAnimationFrame(draw);
}

draw();
/*

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

    */
