import * as Utils from './utils.js';
import { Vec3, Vec4, Mat33 } from './math.js';

export class Mat44 extends Mat33{

    /*
     * mV[16]
     *
     * SET rows
     * SET columns
     * GET rows
     * GET columns
     *
     * Transpose
     * Translation
     * Rotation (Mat33)
     * Rotation (z, y, x)
     * Rotation (axis, angle)
     * RoatationX(angle)
     * RoatationY(angle)
     * RoatationZ(angle)
     * Scaling (vec3 scale)
     *
     * + - * /
     *
     * Transform : vec3
     *
     * [i, j] : mV[i + 4*j]
     *
     */

    /*
     * SHAPE: COLUMN MAJOR
     *
     * M = [ 0  4  8 12
     *       1  5  9 13
     *       2  6 10 14
     *       3  6 11 15 ]
     */



    M = [];

    constructor(){
        super();
        this.size = 16;
        this.numRows = 4;
        this.numCols = 4;
        this.type = "Mat44";
        this.zero();
    }

    setRows(row0, row1, row2, row3){
        this.M[0] = row0.x;
        this.M[4] = row0.y;
        this.M[8] = row0.z;

        this.M[1] = row1.x;
        this.M[5] = row1.y;
        this.M[9] = row1.z;

        this.M[2] = row2.x;
        this.M[6] = row2.y;
        this.M[10] = row2.z;

        this.M[3] = row3.x;
        this.M[7] = row3.y;
        this.M[11] = row3.z;

        if(row0.getType() == "Vec3") this.M[12] = 0;
        else this.M[12] = row0.w;
        if(row1.getType() == "Vec3") this.M[13] = 0;
        else this.M[13] = row1.w;
        if(row2.getType() == "Vec3") this.M[14] = 0;
        else this.M[14] = row2.w;
        if(row3.getType() == "Vec3") this.M[15] = 1;
        else this.M[15] = row3.w;
    }

    getRow(i){
        try{
            Utils.checkSize(i, 4);
            return new Vec4(this.M[i], this.M[i+4], this.M[i+8], this.M[i+12]);
        } catch(e){
            console.warn(e.message);
        }
    }

    setCols(col0, col1, col2, col3){
        this.M[0] = col0.x;
        this.M[1] = col0.y;
        this.M[2] = col0.z;
        this.M[3] = col0.w;

        this.M[4] = col1.x;
        this.M[5] = col1.y;
        this.M[6] = col1.z;
        this.M[7] = col1.w;

        this.M[8] = col2.x;
        this.M[9] = col2.y;
        this.M[10] = col2.z;
        this.M[11] = col2.w;

        this.M[12] = col3.x;
        this.M[13] = col3.y;
        this.M[14] = col3.z;
        this.M[15] = col3.w;
    }

    getCol(i){
        try{
            Utils.checkSize(i, 4);
            return new Vec4(this.M[4*i], this.M[4*i+1], this.M[4*i+2], this.M[4*i+3]);
        } catch(e){
            console.warn(e.message);
        }
    }

    setFromMat33(_M33){
        this.M[0] = _M33.M[0];
        this.M[1] = _M33.M[1];
        this.M[2] = _M33.M[2];
        this.M[3] = 0;

        this.M[4] = _M33.M[4];
        this.M[5] = _M33.M[5];
        this.M[6] = _M33.M[6];
        this.M[7] = 0;

        this.M[8] = _M33.M[7];
        this.M[9] = _M33.M[8];
        this.M[10] = _M33.M[9];
        this.M[11] = 0;

        this.M[12] = 0;
        this.M[13] = 0;
        this.M[14] = 0;
        this.M[15] = 1;
    }

    setIdentity(){
        this.M[0] = 1;
        this.M[1] = 0;
        this.M[2] = 0;
        this.M[3] = 0;
        this.M[4] = 0;
        this.M[5] = 1;
        this.M[6] = 0;
        this.M[7] = 0;
        this.M[8] = 0;
        this.M[9] = 0;
        this.M[10] = 1;
        this.M[11] = 0;
        this.M[12] = 0;
        this.M[13] = 0;
        this.M[14] = 0;
        this.M[15] = 1;
    }

    isIdentity(){
        return Utils.areEqual(this.M[0], 1) &&
            Utils.areEqual(this.M[5], 1) &&
            Utils.areEqual(this.M[10], 1) &&
            Utils.areEqual(this.M[15], 1) &&
            Utils.isZero(this.M[1]) &&
            Utils.isZero(this.M[2]) &&
            Utils.isZero(this.M[3]) &&
            Utils.isZero(this.M[4]) &&
            Utils.isZero(this.M[6]) &&
            Utils.isZero(this.M[7]) &&
            Utils.isZero(this.M[8]) &&
            Utils.isZero(this.M[9]) &&
            Utils.isZero(this.M[11]) &&
            Utils.isZero(this.M[12]) &&
            Utils.isZero(this.M[13]) &&
            Utils.isZero(this.M[14]);
    }

    multiplyMat(_M){
        let res = new Mat44();

        res.M[0] = this.M[0]*_M.M[0] + this.M[4]*_M.M[1] + this.M[8]*_M.M[2] + this.M[12]*_M.M[3];
        res.M[1] = this.M[1]*_M.M[0] + this.M[5]*_M.M[1] + this.M[9]*_M.M[2] + this.M[13]*_M.M[3];
        res.M[2] = this.M[2]*_M.M[0] + this.M[6]*_M.M[1] + this.M[10]*_M.M[2] + this.M[14]*_M.M[3];
        res.M[3] = this.M[3]*_M.M[0] + this.M[7]*_M.M[1] + this.M[11]*_M.M[2] + this.M[15]*_M.M[3];

        res.M[4] = this.M[0]*_M.M[4] + this.M[4]*_M.M[5] + this.M[8]*_M.M[6] + this.M[12]*_M.M[7];
        res.M[5] = this.M[1]*_M.M[4] + this.M[5]*_M.M[5] + this.M[9]*_M.M[6] + this.M[13]*_M.M[7];
        res.M[6] = this.M[2]*_M.M[4] + this.M[6]*_M.M[5] + this.M[10]*_M.M[6] + this.M[14]*_M.M[7];
        res.M[7] = this.M[3]*_M.M[4] + this.M[7]*_M.M[5] + this.M[11]*_M.M[6] + this.M[15]*_M.M[7];

        res.M[8] = this.M[0]*_M.M[8] + this.M[4]*_M.M[9] + this.M[8]*_M.M[10] + this.M[12]*_M.M[11];
        res.M[9] = this.M[1]*_M.M[8] + this.M[5]*_M.M[9] + this.M[9]*_M.M[10] + this.M[13]*_M.M[11];
        res.M[10] = this.M[2]*_M.M[8] + this.M[6]*_M.M[9] + this.M[10]*_M.M[10] + this.M[14]*_M.M[11];
        res.M[11] = this.M[3]*_M.M[8] + this.M[7]*_M.M[9] + this.M[11]*_M.M[10] + this.M[15]*_M.M[11];

        res.M[12] = this.M[0]*_M.M[12] + this.M[4]*_M.M[13] + this.M[8]*_M.M[14] + this.M[12]*_M.M[15];
        res.M[13] = this.M[1]*_M.M[12] + this.M[5]*_M.M[13] + this.M[9]*_M.M[14] + this.M[13]*_M.M[15];
        res.M[14] = this.M[2]*_M.M[12] + this.M[6]*_M.M[13] + this.M[10]*_M.M[14] + this.M[14]*_M.M[15];
        res.M[15] = this.M[3]*_M.M[12] + this.M[7]*_M.M[13] + this.M[11]*_M.M[14] + this.M[15]*_M.M[15];

        this.setMat(res.M);
    }

    getMultiplyMat(_M){
        let ret = new Mat44();

        ret.M[0]  = this.M[0]*_M.M[0] + this.M[4]*_M.M[1] + this.M[8]*_M.M[2] + this.M[12]*_M.M[3];
        ret.M[1]  = this.M[1]*_M.M[0] + this.M[5]*_M.M[1] + this.M[9]*_M.M[2] + this.M[13]*_M.M[3];
        ret.M[2]  = this.M[2]*_M.M[0] + this.M[6]*_M.M[1] + this.M[10]*_M.M[2] + this.M[14]*_M.M[3];
        ret.M[3]  = this.M[3]*_M.M[0] + this.M[7]*_M.M[1] + this.M[11]*_M.M[2] + this.M[15]*_M.M[3];

        ret.M[4]  = this.M[0]*_M.M[4] + this.M[4]*_M.M[5] + this.M[8]*_M.M[6] + this.M[12]*_M.M[7];
        ret.M[5]  = this.M[1]*_M.M[4] + this.M[5]*_M.M[5] + this.M[9]*_M.M[6] + this.M[13]*_M.M[7];
        ret.M[6]  = this.M[2]*_M.M[4] + this.M[6]*_M.M[5] + this.M[10]*_M.M[6] + this.M[14]*_M.M[7];
        ret.M[7]  = this.M[3]*_M.M[4] + this.M[7]*_M.M[5] + this.M[11]*_M.M[6] + this.M[15]*_M.M[7];

        ret.M[8]  = this.M[0]*_M.M[8] + this.M[4]*_M.M[9] + this.M[8]*_M.M[10] + this.M[12]*_M.M[11];
        ret.M[9]  = this.M[1]*_M.M[8] + this.M[5]*_M.M[9] + this.M[9]*_M.M[10] + this.M[13]*_M.M[11];
        ret.M[10] = this.M[2]*_M.M[8] + this.M[6]*_M.M[9] + this.M[10]*_M.M[10] + this.M[14]*_M.M[11];
        ret.M[11] = this.M[3]*_M.M[8] + this.M[7]*_M.M[9] + this.M[11]*_M.M[10] + this.M[15]*_M.M[11];

        ret.M[12] = this.M[0]*_M.M[12] + this.M[4]*_M.M[13] + this.M[8]*_M.M[14] + this.M[12]*_M.M[15];
        ret.M[13] = this.M[1]*_M.M[12] + this.M[5]*_M.M[13] + this.M[9]*_M.M[14] + this.M[13]*_M.M[15];
        ret.M[14] = this.M[2]*_M.M[12] + this.M[6]*_M.M[13] + this.M[10]*_M.M[14] + this.M[14]*_M.M[15];
        ret.M[15] = this.M[3]*_M.M[12] + this.M[7]*_M.M[13] + this.M[11]*_M.M[14] + this.M[15]*_M.M[15];

        return ret;
    }


    getMultiplyVec(v){
        let ret = new Vec4();
        ret.x = this.M[0]*v.x + this.M[4]*v.y + this.M[8]*v.z + this.M[12];
        ret.y = this.M[1]*v.x + this.M[5]*v.y + this.M[9]*v.z + this.M[13];
        ret.z = this.M[2]*v.x + this.M[6]*v.y + this.M[10]*v.z + this.M[14];
        ret.w = this.M[3]*v.x + this.M[7]*v.y + this.M[11]*v.z + this.M[15];
        return ret;
    }

    getMultiplyVecW(v){
        // COLUMN MAJOR - POST MULTIPLICATION
        //
        // [  0  4  8 12    [ x
        //    1  5  9 13  .   y
        //    2  6 10 14      z
        //    3  7 11 15 ]    w ]

        let ret = new Vec3();
        ret.x = this.M[0]*v.x + this.M[4]*v.y + this.M[8]*v.z + this.M[12];
        ret.y = this.M[1]*v.x + this.M[5]*v.y + this.M[9]*v.z + this.M[13];
        ret.z = this.M[2]*v.x + this.M[6]*v.y + this.M[10]*v.z + this.M[14];
        let w = this.M[3]*v.x + this.M[7]*v.y + this.M[11]*v.z + this.M[15];

        if(!Utils.areEqual(w, 1)){
            ret.x /= w;
            ret.y /= w;
            ret.z /= w;
        }

        return ret;
    }
    multiplyVec(v){
        // COLUMN MAJOR - POST MULTIPLICATION
        //
        // [  0  4  8 12    [ x
        //    1  5  9 13  .   y
        //    2  6 10 14      z
        //    3  7 11 15 ]    w ]

        let x = this.M[0]*v.x + this.M[4]*v.y + this.M[8]*v.z + this.M[12];
        let y = this.M[1]*v.x + this.M[5]*v.y + this.M[9]*v.z + this.M[13];
        let z = this.M[2]*v.x + this.M[6]*v.y + this.M[10]*v.z + this.M[14];
        let w = this.M[3]*v.x + this.M[7]*v.y + this.M[11]*v.z + this.M[15];

        if(!Utils.areEqual(w, 1)){
            x /= w;
            y /= w;
            z /= w;
        }

        v.x = x;
        v.y = y;
        v.z = z;
        v.w = w;
    }
    multiplyVecIO(_in, _out){
        // COLUMN MAJOR - POST MULTIPLICATION
        //
        // [  0  4  8 12    [ x
        //    1  5  9 13  .   y
        //    2  6 10 14      z
        //    3  7 11 15 ]    w ]

        let x = this.M[0]*_in.x + this.M[4]*_in.y + this.M[8]*_in.z + this.M[12];
        let y = this.M[1]*_in.x + this.M[5]*_in.y + this.M[9]*_in.z + this.M[13];
        let z = this.M[2]*_in.x + this.M[6]*_in.y + this.M[10]*_in.z + this.M[14];
        let w = this.M[3]*_in.x + this.M[7]*_in.y + this.M[11]*_in.z + this.M[15];

        if(!Utils.areEqual(w, 1)){
            x /= w;
            y /= w;
            z /= w;
        }

        _out.x = x;
        _out.y = y;
        _out.z = z;
        _out.w = w;
    }

    transformVec(v){
        let ret = new Vec3();
        ret.x = this.M[0]*v.x + this.M[4]*v.y + this.M[8]*v.z;
        ret.y = this.M[1]*v.x + this.M[5]*v.y + this.M[9]*v.z;
        ret.z = this.M[2]*v.x + this.M[6]*v.y + this.M[10]*v.z;
        return ret;
    }

    transformPoint(v){
        let ret = new Vec3();
        ret.x = this.M[0]*v.x + this.M[4]*v.y + this.M[8]*v.z + this.M[12];
        ret.y = this.M[1]*v.x + this.M[5]*v.y + this.M[9]*v.z + this.M[13];
        ret.z = this.M[2]*v.x + this.M[6]*v.y + this.M[10]*v.z + this.M[14];
        // ret.w = this.M[3]*v.x + this.M[7]*v.y + this.M[11]*v.z + this.M[15];
        return ret;
    }

    transpose(){
        let tmp = this.M[1];
        this.M[1] = this.M[4];
        this.M[4] = tmp;

        tmp = this.M[2];
        this.M[2] = this.M[8];
        this.M[8] = tmp;

        tmp = this.M[3];
        this.M[3] = this.M[12];
        this.M[12] = tmp;

        tmp = this.M[6];
        this.M[6] = this.M[9];
        this.M[9] = tmp;

        tmp = this.M[7];
        this.M[7] = this.M[13];
        this.M[13] = tmp;

        tmp = this.M[11];
        this.M[11] = this.M[14];
        this.M[14] = tmp;
    }

    getTranspose(){
        let ret = new Mat44();

        ret.M[0] = this.M[0];
        ret.M[1] = this.M[4];
        ret.M[2] = this.M[8];
        ret.M[3] = this.M[12];
        ret.M[4] = this.M[1];
        ret.M[5] = this.M[5];
        ret.M[6] = this.M[9];
        ret.M[7] = this.M[13];
        ret.M[8] = this.M[2];
        ret.M[9] = this.M[6];
        ret.M[10] = this.M[10];
        ret.M[11] = this.M[14];
        ret.M[12] = this.M[3];
        ret.M[13] = this.M[7];
        ret.M[14] = this.M[11];
        ret.M[15] = this.M[15];

        return ret;
    }

    getAffineInverse(){
        let ret = new Mat44();

        let cofactor0 = this.M[5]*this.M[10] - this.M[6]*this.M[9];
        let cofactor4 = this.M[2]*this.M[9] - this.M[1]*this.M[10];
        let cofactor8 = this.M[1]*this.M[6] - this.M[2]*this.M[5];
        let det = this.M[0]*cofactor0 + this.M[4]*cofactor4 + this.M[8]*cofactor8;

        // create adjunct matrix and multiply by 1/det to get upper 3x3
        let invDet = 1/det;
        ret.M[0] = invDet*cofactor0;
        ret.M[1] = invDet*cofactor4;
        ret.M[2] = invDet*cofactor8;

        ret.M[4] = invDet*(this.M[6]*this.M[8]  - this.M[4]*this.M[10]);
        ret.M[5] = invDet*(this.M[0]*this.M[10] - this.M[2]*this.M[8]);
        ret.M[6] = invDet*(this.M[2]*this.M[4]  - this.M[0]*this.M[6]);

        ret.M[8] = invDet*(this.M[4]*this.M[9]  - this.M[5]*this.M[8]);
        ret.M[9] = invDet*(this.M[1]*this.M[8]  - this.M[0]*this.M[9]);
        ret.M[10] = invDet*(this.M[0]*this.M[5] - this.M[1]*this.M[4]);

        // multiply -translation by inverted 3x3 to get its inverse
        ret.M[12] = -ret.M[0]*this.M[12] - ret.M[4]*this.M[13] - ret.M[8]*this.M[14];
        ret.M[13] = -ret.M[1]*this.M[12] - ret.M[5]*this.M[13] - ret.M[9]*this.M[14];
        ret.M[14] = -ret.M[2]*this.M[12] - ret.M[6]*this.M[13] - ret.M[10]*this.M[14];

        // bottom row [0, 0, 0, 1]
        ret.M[3] = 0;
        ret.M[7] = 0;
        ret.M[11] = 0;
        ret.M[15] = 1;

        return ret;
    }

    affineInverseMat44(_M){
        let ret = new Mat44();

        let cofactor0 = _M.M[5]*_M.M[10] - _M.M[6]*_M.M[9];
        let cofactor4 = _M.M[2]*_M.M[9] - _M.M[1]*_M.M[10];
        let cofactor8 = _M.M[1]*_M.M[6] - _M.M[2]*_M.M[5];
        let det = _M.M[0]*cofactor0 + _M.M[4]*cofactor4 + _M.M[8]*cofactor8;

        // create adjunct matrix and multiply by 1/det to get upper 3x3
        let invDet = 1/det;
        ret.M[0] = invDet*cofactor0;
        ret.M[1] = invDet*cofactor4;
        ret.M[2] = invDet*cofactor8;

        ret.M[4] = invDet*(_M.M[6]*_M.M[8]  - _M.M[4]*_M.M[10]);
        ret.M[5] = invDet*(_M.M[0]*_M.M[10] - _M.M[2]*_M.M[8]);
        ret.M[6] = invDet*(_M.M[2]*_M.M[4]  - _M.M[0]*_M.M[6]);

        ret.M[8] = invDet*(_M.M[4]*_M.M[9]  - _M.M[5]*_M.M[8]);
        ret.M[9] = invDet*(_M.M[1]*_M.M[8]  - _M.M[0]*_M.M[9]);
        ret.M[10] = invDet*(_M.M[0]*_M.M[5] - _M.M[1]*_M.M[4]);

        // multiply -translation by inverted 3x3 to get its inverse
        ret.M[12] = -ret.M[0]*_M.M[12] - ret.M[4]*_M.M[13] - ret.M[8]*_M.M[14];
        ret.M[13] = -ret.M[1]*_M.M[12] - ret.M[5]*_M.M[13] - ret.M[9]*_M.M[14];
        ret.M[14] = -ret.M[2]*_M.M[12] - ret.M[6]*_M.M[13] - ret.M[10]*_M.M[14];

        // bottom row [0, 0, 0, 1]
        ret.M[3] = 0;
        ret.M[7] = 0;
        ret.M[11] = 0;
        ret.M[15] = 1;

        return ret;
    }

    affineInverse(){
        let affInv = this.affineInverseMat44(this);
        for(let i=0; i<this.size; i++){
            affInv.M[i] = Utils.round(affInv.M[i]);
        }
        this.setMat(affInv.M);
    }

    getCopy(){
        let ret = new Mat44();
        ret.setMat(this.M);
        return ret;
    }

    copy(_toCopyM){
        // Copies _toCopyM into this.M
        this.setMat([..._toCopyM.M]);
    }

    rotateX(theta){
        this.M[0] = 1;
        this.M[5] = Math.cos(theta);
        this.M[6] = Math.sin(theta);
        this.M[9] = -Math.sin(theta);
        this.M[10] = Math.cos(theta);
        this.M[15] = 1;
    }


}
