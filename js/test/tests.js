import * as Utils from '../math/utils.js';
import { SimpleTest } from './simpleTest.js';
import Vec3 from '../math/vec3.js';
import Vec4 from '../math/vec4.js';
import Mat33 from '../math/mat33.js';
import Mat44 from '../math/mat44.js';
import Renderer from '../render/renderer.js';

// Vec3 -----------------------------------------------------------------
let v = new Vec3(1, -2, 3);
let v_norm = new Vec3(1/Math.sqrt(14), -Math.sqrt(2/7), 3/Math.sqrt(14));
let w = new Vec3(0, 3, -1);
let w_dot = -9;
let w_cross = new Vec3(-7, 1, 3);
let z = new Vec3(10, 10, 10);
z.zero();

let id0 = new Vec3(1, 0, 0);
let id1 = new Vec3(0, 1, 0);
let id2 = new Vec3(0, 0, 1);
// ----------------------------------------------------------------------

// Vec4 -----------------------------------------------------------------
let v4 = new Vec4(1, -2, 3, 5);
let v4_norm = new Vec4(1/Math.sqrt(39), -2/Math.sqrt(39), Math.sqrt(3/13), 5/Math.sqrt(39));
// let w4 = new Vec4(0, 3, -1, 2);
// let w4_dot = -9;
// let w_cross = new Vec3(-7, 1, 3);
let z4 = new Vec4(10, 10, 10, 10);
z4.zero();

let mat44_id0 = new Vec4(1, 0, 0, 0);
let mat44_id1 = new Vec4(0, 1, 0, 0);
let mat44_id2 = new Vec4(0, 0, 1, 0);
let mat44_id3 = new Vec4(0, 0, 0, 1);
// ----------------------------------------------------------------------

// Mat33 ----------------------------------------------------------------
let m1 = new Mat33();
m1.zero();
m1.M[0] = 1; m1.M[4] = 3; m1.M[6] = 2; m1.M[8] = 5;
let m2 = new Mat33();
m2.zero();
m2.M[1] = 1; m2.M[2] = 2; m2.M[3] = 3; m2.M[5] = 4; m2.M[6] = 2;
let m2_inv = new Mat33();
m2_inv.M[2] = 0.5; m2_inv.M[3] = 1; m2_inv.M[4] = -0.5; m2_inv.M[5] = 0.75; m2_inv.M[7] = 0.25; m2_inv.M[8] = -3/8;
let m1_copy = m1.getCopy();
// ----------------------------------------------------------------------

// Mat44 ----------------------------------------------------------------
let mat44_m1 = new Mat44();
mat44_m1.M[1]  = 1;
mat44_m1.M[2]  = 2;
mat44_m1.M[3]  = 1;
mat44_m1.M[4]  = 3;
mat44_m1.M[6]  = 6;
mat44_m1.M[7]  = 2;
mat44_m1.M[8]  = 1;
mat44_m1.M[9]  = 4;
mat44_m1.M[10] = 2;
mat44_m1.M[11] = 1;
mat44_m1.M[12] = 3;
mat44_m1.M[14] = 7;
let mat44_m2 = new Mat44();
mat44_m2.M[0]  = 3;
mat44_m2.M[4]  = 2;
mat44_m2.M[5]  = 3;
mat44_m2.M[9]  = 2;
mat44_m2.M[10] = 5;
mat44_m2.M[13] = 2;
mat44_m2.M[14] = 3;
mat44_m2.M[15] = 1;
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
let mat44_m1_copy = mat44_m1.getCopy();
// ----------------------------------------------------------------------

var tester = new SimpleTest();

function test_vec3(){
    tester.test = "vec3";
    tester.assert(
        "Check lengthSquared is correct.",
        v.lengthSquared,
        14
    );
    tester.assert(
        "Check vector is equal to itself.",
        v.isEqual(new Vec3(1, -2, 3)),
        true
    );

    let norm_test = v.getNormalize();
    tester.assert(
        "Normalisation",
        norm_test.isEqual(v_norm),
        true
    );

    tester.assert(
        "Dot Product",
        Utils.areEqual(v.dot(w), w_dot),
        true
    );

    let cross_test = v.cross(w);
    tester.assert(
        "Cross Product",
        cross_test.isEqual(w_cross),
        true
    );

    tester.assert(
        "Zero function working, and isZero",
        z.isZero(),
        true
    );
}

// Vec4 -----------------------------------------------------------------
function test_vec4(){
    tester.test = "vec4";
    tester.assert(
        "Check lengthSquared is correct.",
        v4.lengthSquared,
        39
    );
    tester.assert(
        "Check vector is equal to itself.",
        v4.isEqual(new Vec4(1, -2, 3, 5)),
        true
    );

    let norm_test = v4.getNormalize();
    tester.assert(
        "Normalisation",
        norm_test.isEqual(v4_norm),
        true
    );

    /*
     *     tester.assert(
     *         "Dot Product",
     *         Utils.areEqual(v.dot(w), w_dot),
     *         true
     *     );
     *
     *     let cross_test = v.cross(w);
     *     tester.assert(
     *         "Cross Product",
     *         cross_test.isEqual(w_cross),
     *         true
     *     );
     */

    tester.assert(
        "Zero function working, and isZero",
        z4.isZero(),
        true
    );

    let addTo = new Vec4(-2, 3, 1, -4);
    v4.add(addTo);
    let addToResult = new Vec4(-1, 1, 4, 1);
    tester.assert(
        "Addition working.",
        v4.isEqual(addToResult),
        true
    );
}
// ----------------------------------------------------------------------

// Mat33 ----------------------------------------------------------------
function test_mat33(){
    tester.test = "mat33";
    tester.assert(
        "Check equals to.",
        m1.isEqual(m2),
        false
    );
    tester.assert(
        "Check equals to.",
        m1.isEqual(m1),
        true
    );
    tester.assert(
        "Test getCopy and isEqual.",
        m1_copy.isEqual(m1),
        true
    );

    // Change m1
    m1_copy.M[0] = 666;
    tester.assert(
        "Change copy, check if still isEqual.",
        m1_copy.isEqual(m1),
        false
    );

    // Set to Identity matrix
    m1_copy.setIdentity();
    tester.assert(
        "Check setIdentity and isIdentity.",
        m1_copy.isIdentity(),
        true
    );

    let col0 = m1_copy.getCol(0);
    let col1 = m1_copy.getCol(1);
    let col2 = m1_copy.getCol(2);
    tester.assert(
        "Check col0.",
        col0.isEqual(id0),
        true
    );
    tester.assert(
        "Check col1.",
        col1.isEqual(id1),
        true
    );
    tester.assert(
        "Check col2.",
        col2.isEqual(id2),
        true
    );
    let row0 = m1_copy.getRow(0);
    let row1 = m1_copy.getRow(1);
    let row2 = m1_copy.getRow(2);
    tester.assert(
        "Check row0.",
        row0.isEqual(id0),
        true
    );
    tester.assert(
        "Check row1.",
        row1.isEqual(id1),
        true
    );
    tester.assert(
        "Check row2.",
        row2.isEqual(id2),
        true
    );

    let inv = m1.getInverse(m2);
    tester.assert(
        "Test getInverse.",
        inv.isEqual(m2_inv),
        true
    );
    m2.inverse();
    tester.assert(
        "Test inverse.",
        m2.isEqual(m2_inv),
        true
    );
    inv.inverse();
    tester.assert(
        "Test inverse of inverse (original) via the determinant.",
        inv.getDeterminant(),
        8
    );

    m2.setMat(inv.M);
    tester.assert(
        "Test setMat via the determinant.",
        m2.getDeterminant(),
        8
    );

    // Get (i,j)
    tester.assert(
        "Test getIJ.",
        m2.getIJ(0,0),
        0
    );
    tester.assert(
        "Test getIJ.",
        m2.getIJ(1,0),
        1
    );
    tester.assert(
        "Test getIJ.",
        m2.getIJ(2,1),
        4
    );
    tester.assert(
        "Test getIJ.",
        m2.getIJ(3,1),
        undefined
    );

    // Set rows
    let setRows = new Mat33();
    setRows.setRows(id0, id1, id2);
    tester.assert(
        "Check set rows, via isIdentity.",
        setRows.isIdentity(),
        true
    );

    let add = m1.getAdd(m2);
    let addResult = new Mat33();
    addResult.setMat([1, 1, 2, 3, 3, 4, 4, 0, 5]);
    tester.assert(
        "Add.",
        add.isEqual(addResult),
        true
    );


}
// ----------------------------------------------------------------------

// Mat44 ----------------------------------------------------------------
function test_mat44(){
    tester.test = "mat44";
    tester.assert(
        "Check equals to.",
        mat44_m1.isEqual(mat44_m2),
        false
    );
    tester.assert(
        "Check equals to.",
        mat44_m1.isEqual(mat44_m1),
        true
    );
    tester.assert(
        "Test getCopy and isEqual.",
        mat44_m1_copy.isEqual(mat44_m1),
        true
    );

    // Change m1
    mat44_m1_copy.M[0] = 666;
    tester.assert(
        "Change copy, check if still isEqual.",
        mat44_m1_copy.isEqual(mat44_m1),
        false
    );

    // Set to Identity matrix
    mat44_m1_copy.setIdentity();
    tester.assert(
        "Check setIdentity and isIdentity.",
        mat44_m1_copy.isIdentity(),
        true
    );

    let col0 = mat44_m1_copy.getCol(0);
    let col1 = mat44_m1_copy.getCol(1);
    let col2 = mat44_m1_copy.getCol(2);
    let col3 = mat44_m1_copy.getCol(3);
    tester.assert(
        "Check col0.",
        col0.isEqual(mat44_id0),
        true
    );
    tester.assert(
        "Check col1.",
        col1.isEqual(mat44_id1),
        true
    );
    tester.assert(
        "Check col2.",
        col2.isEqual(mat44_id2),
        true
    );
    tester.assert(
        "Check col3.",
        col3.isEqual(mat44_id3),
        true
    );
    let row0 = mat44_m1_copy.getRow(0);
    let row1 = mat44_m1_copy.getRow(1);
    let row2 = mat44_m1_copy.getRow(2);
    let row3 = mat44_m1_copy.getRow(3);
    tester.assert(
        "Check row0.",
        row0.isEqual(mat44_id0),
        true
    );
    tester.assert(
        "Check row1.",
        row1.isEqual(mat44_id1),
        true
    );
    tester.assert(
        "Check row2.",
        row2.isEqual(mat44_id2),
        true
    );
    tester.assert(
        "Check row3.",
        row3.isEqual(mat44_id3),
        true
    );

    let inv = mat44_m1.getAffineInverse(mat44_m2);
    tester.assert(
        "Test getInverse.",
        inv.isEqual(mat44_m2_inv),
        true
    );
    let mat44_m2_copy = mat44_m2.getCopy();
    mat44_m2.affineInverse();
    tester.assert(
        "Test inverse.",
        mat44_m2.isEqual(mat44_m2_inv),
        true
    );
    mat44_m2.affineInverse();
    tester.assert(
        "Test inverse of inverse (original).",
        mat44_m2.isEqual(mat44_m2_copy),
        true
    );

    mat44_m2_copy.setMat(mat44_m1.M);
    tester.assert(
        "Test setMat.",
        mat44_m2_copy.isEqual(mat44_m1),
        true
    );

    // Get (i,j)
    tester.assert(
        "Test getIJ(0,0).",
        mat44_m2.getIJ(0,0),
        3
    );
    tester.assert(
        "Test getIJ(1,0).",
        mat44_m2.getIJ(1,0),
        0
    );
    tester.assert(
        "Test getIJ(2,2).",
        mat44_m2.getIJ(2,2),
        5
    );
    tester.assert(
        "Test getIJ(3,0).",
        mat44_m2.getIJ(3,0),
        0
    );
    tester.assert(
        "Test getIJ(3,4).",
        mat44_m2.getIJ(3,4),
        undefined
    );

    // Set rows
    let setRows = new Mat44();
    setRows.setRows(mat44_id0, mat44_id1, mat44_id2, mat44_id3);
    tester.assert(
        "Check set rows, via isIdentity.",
        setRows.isIdentity(),
        true
    );

    let add = mat44_m1.getAdd(mat44_m2);
    let addResult = new Mat44();
    addResult.setMat([3, 1, 2, 1, 5, 3, 6, 2, 1, 6, 7, 1, 3, 2, 10, 1]);
    tester.assert(
        "Add.",
        add.isEqual(addResult),
        true
    );


}
// ----------------------------------------------------------------------
tester.test = "renderer";
// Renderer ----------------------------------------------------------------
function test_renderer(){
    tester.test = "renderer";

    let renderer = new Renderer();

    let expectedViewMat = new Mat44();
    expectedViewMat.M[0]  = Number("9.92277877e-01");   // M[0]
    expectedViewMat.M[4]  = Number("-5.51265487e-02");  // M[4]
    expectedViewMat.M[8]  = Number("-1.11111111e-01");  // M[8]
    expectedViewMat.M[12] = Number("0.00000000e+00");   // M[12]
    expectedViewMat.M[1]  = Number("-0.00000000e+00");  // M[1]
    expectedViewMat.M[5]  = Number("8.95806416e-01");   // M[5]
    expectedViewMat.M[9]  = Number("-4.44444444e-01");  // M[9]
    expectedViewMat.M[13] = Number("0.00000000e+00");   // M[13]
    expectedViewMat.M[2]  = Number("1.24034735e-01");   // M[2]
    expectedViewMat.M[6]  = Number("4.41012390e-01");   // M[6]
    expectedViewMat.M[10] = Number("8.88888889e-01");   // M[10]
    expectedViewMat.M[14] = Number("0.00000000e+00");   // M[14]
    expectedViewMat.M[3]  = Number("-0.00000000e+00");  // M[3]
    expectedViewMat.M[7]  = Number("-0.00000000e+00");  // M[7]
    expectedViewMat.M[11] = Number("-1.35000000e+02");  // M[11]
    expectedViewMat.M[15] = Number("1.00000000e+00");   // M[15]


    let camera = new Vec3(-15, -60, 120);
    let target = new Vec3(0, 0, 0);
    let up = new Vec3(0, 1, 0);

    let viewMat = renderer.createViewMatrix(camera, target, up);

    tester.assert(
        "createViewMatrix.",
        viewMat.isEqual(expectedViewMat),
        true
    );
    
    let expectedProjectionMat = new Mat44();
    expectedProjectionMat.M[0]  = 7.59575411; 
    expectedProjectionMat.M[4]  = 0; 
    expectedProjectionMat.M[8]  = 0; 
    expectedProjectionMat.M[12] = 0; 
    expectedProjectionMat.M[1]  = 0; 
    expectedProjectionMat.M[5]  = 7.59575411; 
    expectedProjectionMat.M[9]  = 0; 
    expectedProjectionMat.M[13] = 0; 
    expectedProjectionMat.M[2]  = 0; 
    expectedProjectionMat.M[6]  = 0; 
    expectedProjectionMat.M[10] = -1.10526316; 
    expectedProjectionMat.M[14] = -1; 
    expectedProjectionMat.M[3]  = 0; 
    expectedProjectionMat.M[7]  = 0; 
    expectedProjectionMat.M[11] = -21.05263158;
    expectedProjectionMat.M[15] = 0;

    let projectionMatrix = renderer.createPerspectiveProjectionMatrix(15, 1, 10, 200);
    expectedProjectionMat.printProps();
    projectionMatrix.printProps();

    tester.assert(
        "createPerspectiveProjectionMatrix.",
        projectionMatrix.isEqual(expectedProjectionMat),
        true
    );


    }
// ----------------------------------------------------------------------
// Utils ----------------------------------------------------------------
function test_utils(){
    tester.test = "utils";
    tester.assert(
        "Utils.areEqual works",
        Utils.areEqual(1, 1),
        true
    );
    tester.assert(
        "Utils.areEqual works",
        Utils.areEqual(1, -1),
        false
    );
    tester.assert(
        "Utils.areEqual works",
        Utils.areEqual(1, 0),
        false
    );
    tester.assert(
        "Utils.areEqual works",
        Utils.areEqual(-2, -2),
        true
    );
}
// ----------------------------------------------------------------------

// test_vec4();
// test_mat33();
// test_mat44();
test_renderer();
console.log(tester.log);
