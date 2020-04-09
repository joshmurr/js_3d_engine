import Vec3 from '../math/vec3.js';
import Vec4 from '../math/vec4.js';
import Mat44 from '../math/mat44.js';

// let first = new Vec4(1,2,3,1);
//
let mat = new Mat44();
mat.setMat([1,0,0,0, 0,1,0,0, 0,0,1,0, 3,2.4,1.8,1]);
//
// let second = mat.getMultiplyVec(first);
//
// let ref = new Vec4(1,2,3,1);
//
// second.printProps();
//
// mat.multiplyVec(ref);
// ref.printProps();
//
let in_ = new Vec4(1,2,3,1);
let out_ = new Vec4();

mat.multiplyVecIO(in_, out_);


in_.printProps();
out_.printProps();
