import * as Utils from '../math/utils.js';
import Vec3 from '../math/vec3.js';
import Vec4 from '../math/vec4.js';
import Mat33 from '../math/mat33.js';
import Mat44 from '../math/mat44.js';
import Icosahedron from '../mesh/icosahedron.js';
import Teapot from '../mesh/teapot.js';

var width = 512;
var height = 512;
let theta = 0.27;

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

function createPerspectiveProjectionMatrix(_FOV, _aspect, _near, _far){
    let d = 1 / Math.tan((_FOV/2) * (Math.PI/180)); // Deg to Rad
    // let rangeInv = 1 / (_far - _near);
    let a = _aspect;
    // let r = _aspect * d;
    // let l = -r;
    // let t = d;
    // let b = -t;

    let projMat = new Mat44();
    projMat.M[0]  = d/a;
    projMat.M[1]  = 0;
    projMat.M[2]  = 0;
    projMat.M[3] = 0;
    projMat.M[4]  = 0;
    projMat.M[5]  = d;
    projMat.M[6]  = 0;
    projMat.M[7] = 0;
    projMat.M[8]  = 0;
    projMat.M[9]  = 0;
    projMat.M[10] = -_far / (_far - _near);
    projMat.M[11] = 2*_near*_far / (_far - _near);
    projMat.M[12]  = 0;
    projMat.M[13]  = 0;
    projMat.M[14] = -1;
    projMat.M[15] = 0;
    // OGL
    // projMat.M[0]  = (2*_near)/(r-l);
    // projMat.M[1]  = 0;
    // projMat.M[2]  = 0;
    // projMat.M[3] = 0;
    // projMat.M[4]  = 0;
    // projMat.M[5]  = (2*_near)/(t-b);
    // projMat.M[6]  = 0;
    // projMat.M[7] = 0;
    // projMat.M[8]  = (r+l)/(r-l);
    // projMat.M[9]  = (t+b)/(t-b);
    // projMat.M[10] = (_near + _far) * rangeInv;
    // projMat.M[11] = -1;
    // projMat.M[12]  = 0;
    // projMat.M[13]  = 0;
    // projMat.M[14] = _near*_far*rangeInv*2;
    // projMat.M[15] = 0;


    return projMat;
}

function createSimpleProjectionMatrix(_scaleFactor){
    let projMat = new Mat44();
    projMat.setIdentity();
    projMat.M[14] = _scaleFactor;
    projMat.M[15] = _scaleFactor;
    return projMat;
}

function createModelMat(_theta){
    let scaleMat = new Mat44();
    scaleMat.setMat([10,0,0,0, 0,10,0,0, 0,0,10,0, 0,0,0,1]);

    let rotXMat = new Mat44();
    rotXMat.setMat([1, 0, 0, 0, 0, Math.cos(theta), Math.sin(theta), 0, 0, -Math.sin(theta), Math.cos(theta), 0, 0, 0, 0, 1]);

    let rotYMat = new Mat44();
    rotYMat.setMat([Math.cos(theta), 0, -Math.sin(theta), 0, 0, 1, 0, 0, Math.sin(theta), 0, Math.cos(theta), 0, 0, 0, 0, 1]);

    let transMat = new Mat44();
    transMat.setMat([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,-100,1]);

    let modelMatrix = new Mat44();
    modelMatrix.setIdentity();

    modelMatrix.multiplyMat(transMat);
    modelMatrix.multiplyMat(rotXMat);
    // modelMatrix.multiplyMat(rotYMat);
    modelMatrix.multiplyMat(scaleMat);
    return modelMatrix;
}

let wTc = new Mat44();
wTc.setMat([1,0,0,0, 0,1,0,10, 0,0,1,20, 0,0,0,1]);

let model = new Icosahedron();

let modelMatrix = new Mat44();
modelMatrix = createModelMat(theta);
console.warn("Model Mat:");
modelMatrix.printProps();

let perspMatrix = createPerspectiveProjectionMatrix(90, width/height, 1, 100);
// let perspMatrix = createSimpleProjectionMatrix(0.5);
console.warn("Perspecitve Mat:");
perspMatrix.printProps();

let MVP = new Mat44();
MVP.setIdentity();

function draw(){
    ctx.fillStyle = "rgba(255,224,224,0.2)";
    ctx.fillRect(0, 0, width, height);

    modelMatrix = createModelMat(theta);
    // MVP.multiplyMat(modelMatrix);
    MVP.multiplyMat(perspMatrix);
    // MVP.multiplyMat(wTc);
    MVP.multiplyMat(modelMatrix);
    // MVP.affineInverse();
    // console.warn("MVP:");
    // MVP.printProps();

    let loopLen = model.verts.length;
    // let loopLen = 10;

    for(let i=0; i<loopLen; i++){
        // console.group("Before After");
        // console.log("Before");
        // console.log(model.verts[i].w);
        // model.verts[i].printProps();
        let p = model.verts[i].getCopy();
        // p.z -= 2;
        // p.x -= 2;
        // p.printProps();
        // p = wTc.getMultiplyVecW(p);
        p = MVP.getMultiplyVecW(p);
        // console.log("After");
        // p.printProps();
        // console.groupEnd();
        // p = perspMatrix.getMultiplyVec(p);
        // p = modelMatrix.getMultiplyVec(p);
        // let cameraToScreenPoint = MVP.getMultiplyVec(p);
        // cameraToScreenPoint = perspMatrix.getMultiplyVec(cameraToScreenPoint);
        // console.log(cameraToScreenPoint.w);
        // cameraToScreenPoint.printProps();
        // if(cameraToScreenPoint.x > -1 && cameraToScreenPoint.x < 1 &&
        // cameraToScreenPoint.y > -1 && cameraToScreenPoint.y < 1){
        let xNorm = ((p.x + 1)*0.5) * width;
        let yNorm = (1-(p.y + 1)*0.5) * height;
        // let xScreen = xNorm * width;
        // let yScreen = yNorm * height;
        // let xScreen = Math.min(width-1, ((cameraToScreenPoint.x+1) * 0.5 * width));
        // let yScreen = Math.min(height-1, ((1 - (cameraToScreenPoint.y + 1) * 0.5) * height));
        // console.log([xScreen, yScreen]);

        if(i < loopLen/2) ctx.fillStyle="red";
        else ctx.fillStyle="black";
        ctx.fillRect(xNorm, yNorm, 2, 2);
        // }
    }
    theta += 0.01;
    MVP.setIdentity();
    requestAnimationFrame(draw);
}

draw();
