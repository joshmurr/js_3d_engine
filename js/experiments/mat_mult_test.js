import Vec4 from '../math/vec4.js';
import Mat44 from '../math/mat44.js';

let TWO_PI = Math.PI*2;
let PI_OVER_TWO = Math.PI/2;

let SINE_PI = 0;
let COS_PI_OVER_TWO = 0;

let scale = new Mat44();
scale.setMat([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1.5, 1, 1.5, 1]);

let rotx = new Mat44();
rotx.setMat([1, 0, 0, 0, 0, Math.cos(Math.PI), SINE_PI, 0, 0, SINE_PI, Math.cos(Math.PI), 0, 0, 0, 0, 1]);
console.log(rotx.M);

let roty = new Mat44();
roty.setMat([COS_PI_OVER_TWO, 0, -Math.sin(PI_OVER_TWO), 0, 0, 1, 0, 0, Math.sin(PI_OVER_TWO), 0, COS_PI_OVER_TWO, 0, 0, 0, 0, 1]);
roty.printProps();

let fin = new Mat44();
fin.setIdentity();

// Correct Order
fin.multiplyMat(scale);
fin.multiplyMat(rotx);
fin.multiplyMat(roty);
fin.printProps();

let nif = fin.getMultiplyMat(roty);
nif = nif.getMultiplyMat(rotx);
nif = nif.getMultiplyMat(scale);
nif.printProps();

let p = new Vec4(0, 1, 0, 1);

let P = fin.getMultiplyVec(p);
P.printProps();
