import Vec3 from '../math/vec3.js';
import Vec4 from '../math/vec4.js';
import Mat44 from '../math/mat44.js';
import Icosahedron from '../mesh/icosahedron.js';


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

function setProjectionMatrix(angleOfView, near, far) {
    // set the basic projection matrix
    let scale = 1 / Math.tan(angleOfView * 0.5 * Math.PI / 180);
    let M = new Mat44();
    M.M[0] = scale; // scale the x coordinates of the projected point
    M.M[5] = scale; // scale the y coordinates of the projected point
    M.M[10] = -far / (far - near); // used to remap z to [0,1]
    M.M[14] = -far * near / (far - near); // used to remap z [0,1]
    M.M[11] = -1; // set w = -z
    M.M[15] = 0;

    return M;
}

function multPointMatrix(vin, M) {
    //out = in * M;
    let out = new Vec4(0,0,0,0);
    out.x   = vin.x * M.M[0] + vin.y * M.M[4] + vin.z * M.M[8] + M.M[12];
    out.y   = vin.x * M.M[1] + vin.y * M.M[5] + vin.z * M.M[9] + M.M[13];
    out.z   = vin.x * M.M[2] + vin.y * M.M[6] + vin.z * M.M[10] + M.M[14];
    let w = vin.x * M.M[3] + vin.y * M.M[7] + vin.z * M.M[11] + M.M[15];

    // normalize if w is different than 1 (convert from homogeneous to Cartesian coordinates)
    if (w != 1) {
        out.x /= w;
        out.y /= w;
        out.z /= w;
    }
    return out;
}

let icosahedron = new Icosahedron();

let worldToCamera = new Mat44();
worldToCamera.setIdentity();
worldToCamera.setIJ(1,3,-10);
worldToCamera.setIJ(2,3,-20);
let Mproj = setProjectionMatrix(90, 0.1, 100);
Mproj.printProps();

for(let i=0; i<icosahedron.verts.length; i++){
    icosahedron.verts[i].multiply(100);
}

console.log(icosahedron.verts[2]);


for(let i=0; i<icosahedron.verts.length; i++){
    let v = icosahedron.verts[i];
    // let camPoint = multPointMatrix(v, worldToCamera);
    let projPoint = multPointMatrix(v, Mproj);
    projPoint.printProps();
    let xNorm = (projPoint.x + (width/2)) / width;
    let yNorm = (projPoint.y + (height/2)) / height;
    let xScreen = xNorm * width;
    let yScreen = yNorm * height;
    // console.log([xScreen, yScreen]);

    ctx.fillStyle="black";
    ctx.fillRect(xScreen, yScreen, 2, 2);
}


