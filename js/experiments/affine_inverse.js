import Mat44 from '../mat44.js';

let m = new Mat44();

m.setMat([3,0,0,0,2,3,0,0,0,2,5,0,0,2,3,1]);

let mat44_m2_inv = new Mat44();
mat44_m2_inv.M[0]  = 1/3;
mat44_m2_inv.M[4]  = -2/9;
mat44_m2_inv.M[5]  = 1/3;
mat44_m2_inv.M[8]  = 4/45;
mat44_m2_inv.M[9]  = -2/15;
mat44_m2_inv.M[10] = 1/5;
mat44_m2_inv.M[12] = 8/45;
mat44_m2_inv.M[13] = -4/15;
mat44_m2_inv.M[14] = -3/5;
mat44_m2_inv.M[15] = 1;

let affInv = m.getAffineInverse(m);

affInv.printProps();
mat44_m2_inv.printProps();
console.log(affInv.isEqual(mat44_m2_inv));
