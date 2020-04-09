import Vec3 from '../math/vec3.js';
import Vec4 from '../math/vec4.js';
import Mat33 from '../math/mat33.js';
import Mat44 from '../math/mat44.js';

var width = 512;
var height = 512;

var canvas = document.createElement("canvas");
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

function createViewMatrix(_camera, _target, _up){
    let forward = _target.getSubtract(_camera); // Vec3
    forward.normalize();
    let side = _up.cross(forward); // Vec3
    side.normalize();
    let up = forward.cross(side); // Vec3
    let viewMat = new Mat44();

    viewMat.setMat([
        side.x,             side.y,           side.z,               0,
        up.x,               up.y,             up.z,                 0,
        forward.x,         forward.y,       forward.z,           0,
        -side.dot(_camera), -up.dot(_camera), -forward.dot(_camera), 1
    ]);

    return viewMat;
}
function createPerspectiveProjectionMatrix(_FOV, _aspect, _near, _far){
    let d = 1 / Math.tan((_FOV/2) * (Math.PI/180));
    let rangeInv = 1 / (_near - _far);
    let a = _aspect;


    let projMat = new Mat44();
    projMat.M[0]  = d;//\/a;
    projMat.M[1]  = 0;
    projMat.M[2]  = 0;
    projMat.M[3] = 0;
    projMat.M[4]  = 0;
    projMat.M[5]  = d;
    projMat.M[6]  = 0;
    projMat.M[7] = 0;
    projMat.M[8]  = 0;
    projMat.M[9]  = 0;
    projMat.M[10] = (_near+_far) * rangeInv;
    projMat.M[11] = -1;
    projMat.M[12]  = 0;
    projMat.M[13]  = 0;
    projMat.M[14] = _near*_far*rangeInv*2;
    projMat.M[15] = 0;

    return projMat;
}
// Manip Points
for(let i=0; i<points.length; i++){
    // Scale
    let tmp = points[i].getCopy();
    tmp.multiply(20);
    points[i] = tmp;
}


let perspMatrix = createPerspectiveProjectionMatrix(90, 1, 1, 100);
console.log("PerspMat:");
perspMatrix.printProps();

let camera = new Vec3(0, 0, 10);
let up = new Vec3(0, 1, 0);
let target = new Vec3(0, 0, 0);

let viewMat = createViewMatrix(camera, target, up);
console.log("ViewMat:");
viewMat.printProps();

let MVP = new Mat44();
MVP.setIdentity();
MVP.multiplyMat(perspMatrix);
MVP.multiplyMat(viewMat);
console.log("MVP:");
MVP.printProps();

let testP = new Vec4(2, 3, 4, 1);
testP.multiply(20);

let transP = MVP.getMultiplyVec(testP);
console.log("testP");
transP.printProps();


function draw(){
    ctx.fillStyle = "rgba(255,224,224,0.1)";
    ctx.fillRect(0, 0, width, height);

    for(let i=0; i<points.length; i++){
        let p = points[i].getCopy();

        // let worldToCamPoint = viewMat.getMultiplyVec(p);

        // let cameraToScreenPoint = perspMatrix.getMultiplyVec(worldToCamPoint);
        let cameraToScreenPoint = MVP.getMultiplyVec(p);

        if(cameraToScreenPoint.x > -1 && cameraToScreenPoint.x < 1 &&
            cameraToScreenPoint.y > -1 && cameraToScreenPoint.y < 1){
            let xNorm = (cameraToScreenPoint.x + (width/2)) / width;
            let yNorm = (cameraToScreenPoint.y + (height/2)) / height;
            let xScreen = xNorm * width;
            let yScreen = yNorm * height;
            console.log([xScreen, yScreen]);

            ctx.fillStyle="black";
            ctx.fillRect(xScreen, yScreen, 2, 2);
        }
    }
    theta += 0.01;
    // requestAnimationFrame(draw);
}

draw();
