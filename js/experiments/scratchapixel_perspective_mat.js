import Vec3 from '../math/vec3.js';
import Vec4 from '../math/vec4.js';
import Mat44 from '../math/mat44.js';

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


function lookAt(_camera, _target, _up) {
    let forward = _target.getSubtract(_camera);
    forward.normalize();
    let right = _up.cross(forward);
    right.normalize();
    let up = forward.cross(right);

    let camToWorld = new Mat44();
    camToWorld.setIdentity();

    camToWorld.M[0] = right.x;
    camToWorld.M[1] = right.y;
    camToWorld.M[2] = right.z;
    camToWorld.M[4] = up.x;
    camToWorld.M[5] = up.y;
    camToWorld.M[6] = up.z;
    camToWorld.M[8] = forward.x;
    camToWorld.M[9] = forward.y;
    camToWorld.M[10] = forward.z;

    camToWorld.M[12] = _camera.x;
    camToWorld.M[13] = _camera.y;
    camToWorld.M[14] = _camera.z;

    return camToWorld;
}



console.log("projectionMatrix");
let projMat = setProjectionMatrix(90, 1, 100);
projMat.printProps();

let cam = new Vec3(0, 0, 10);
let target = new Vec3(0,0,0);
let up = new Vec3(0, 1, 0)

console.log("viewMat");
let camToWorld = lookAt(cam, target, up);
camToWorld.printProps();


console.log("MVP");
let MVP = projMat.getMultiplyMat(camToWorld);
MVP.printProps();

let testP = new Vec4(2, 3, 4, 1);
let testQ = testP.getCopy();
testQ.multiply(2);

let transP = multPointMatrix(testP, MVP);
console.log("testP");
transP.printProps();

let transQ = multPointMatrix(testQ, MVP);
console.log("testQ");
transQ.printProps();


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
for(let i=0; i<points.length; i++){
    points[i].multiply(20);
}

for(let i=0; i<points.length; i++){
    let v = points[i].getCopy();
    let worldToCamPoint = multPointMatrix(v, camToWorld);
    let cameraToScreenPoint = multPointMatrix(v, projMat);
    cameraToScreenPoint.printProps();
    let NDC = cameraToScreenPoint.getNDC();
    NDC.printProps();
}
