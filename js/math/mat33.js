import * as Utils from './utils.js';
import { Vec3 } from './math.js';

export class Mat33{

    /*
     * mV[9]
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
     * M = [ 0 3 6
     *       1 4 7
     *       2 5 8 ]
     *
     */

    M = []; // Matrix

    constructor(){
        this.size = 9;
        this.numRows = 3;
        this.numCols = 3;
        this.type = "Mat33";
        this.zero();
    }

    printProps(){
        console.group(String(this.type + ":"));
        for(let i=0; i<this.numRows; i++){
            let row = this.getRow(i);
            row = row.toArray();
            console.log(row.toString());
        }
        console.groupEnd();
    }

    get M(){
        return this.M;
    }

    setMat(_arr){
        try{
            Utils.checkLength(_arr.length, this.size); // Throws error if wrong length
            for(let i=0; i<this.size; i++){
                this.M[i] = _arr[i];
            }
        } catch(e){
            console.warn(e.message);
        }
    }

    setIJ(_i, _j, val){
        try{
            Utils.checkSize(_i, this.numRows);
            Utils.checkSize(_j, this.numCols);
            let set =_i+this.numCols*_j; 
            this.M[set] = val;
        } catch(e){
            console.warn(e.message);
        }
    }

    getIJ(_i, _j){
        try{
            Utils.checkSize(_i, this.numRows);
            Utils.checkSize(_j, this.numCols);
            return this.M[_i+this.numCols*_j];
        } catch(e){
            console.warn(e.message);
        }
    }

    setRows(row0, row1, row2){
        this.M[0] = row0.x;
        this.M[3] = row0.y;
        this.M[6] = row0.z;

        this.M[1] = row1.x;
        this.M[4] = row1.y;
        this.M[7] = row1.z;

        this.M[2] = row2.x;
        this.M[5] = row2.y;
        this.M[8] = row2.z;
    }

    getRow(i){
        try{
            Utils.checkSize(i, 3);
            return new Vec3(this.M[i], this.M[i+3], this.M[i+6]);
        } catch(e){
            console.warn(e.message);
        }
    }

    setCols(col0, col1, col2){
        this.M[0] = col0.x;
        this.M[1] = col0.y;
        this.M[2] = col0.z;

        this.M[3] = col1.x;
        this.M[4] = col1.y;
        this.M[5] = col1.z;

        this.M[6] = col2.x;
        this.M[7] = col2.y;
        this.M[8] = col2.z;
    }

    getCol(i){
        try{
            Utils.checkSize(i, 3);
            return new Vec3(this.M[3*i], this.M[3*i+1], this.M[3*i+2]);
        } catch(e){
            console.warn(e.message);
        }
    }

    clean(){
        for(let i=0; i<this.size; i++){
            if(Utils.isZero(this.M[i])) this.M[i] = 0;
        }
    }

    setIdentity(){
        this.M[0] = 1;
        this.M[1] = 0;
        this.M[2] = 0;
        this.M[3] = 0;
        this.M[4] = 1;
        this.M[5] = 0;
        this.M[6] = 0;
        this.M[7] = 0;
        this.M[8] = 1;
    }

    zero(){
        for(let i=0; i<this.size; i++){
            this.M[i] = 0;
        }
    }

    isIdentity(){
        return Utils.areEqual(this.M[0], 1) &&
            Utils.areEqual(this.M[4], 1) &&
            Utils.areEqual(this.M[8], 1) &&
            Utils.isZero(this.M[1]) &&
            Utils.isZero(this.M[2]) &&
            Utils.isZero(this.M[3]) &&
            Utils.isZero(this.M[5]) &&
            Utils.isZero(this.M[6]) &&
            Utils.isZero(this.M[7]);
    }

    isZero(){
        for(let i=0; i<this.size; i++){
            if(!Utils.isZero(this.M[i])) return false;
        }
        return true;
    }

    isEqual(_M){
        try{ 
            Utils.checkLength(_M.M.length, this.M.length);
            for(let i=0; i<this.size; i++){
                if(!Utils.areEqual(this.M[i], _M.M[i])) return false;
            }
            return true;
        } catch(e) {
            console.warn(e.message);
        }
        
    }

    add(_M){
        for(let i=0; i<this.size; i++){
            this.M[i] += _M.M[i];
        }
    }

    getAdd(_M){ 
        // Using this.getCopy to allow for class inheritance
        let ret = this.getCopy();
        for(let i=0; i<this.size; i++){
            ret.M[i] = this.M[i] + _M.M[i];
        }
        return ret;
    }

    subtract(_M){
        for(let i=0; i<this.size; i++){
            this.M[i] -= _M.M[i];
        }
    }

    getSubtract(_M){
        // Using this.getCopy to allow for class inheritance
        let ret = this.getCopy();
        for(let i=0; i<this.size; i++){
            ret.M[i] = this.M[i] - _M.M[i];
        }
        return ret;
    }


    multiplyMat(_M){
        let res = new Mat33();
        res.M[0] = this.M[0]*_M.M[0] + this.M[3]*_M.M[1] + this.M[6]*_M.M[2];
        res.M[1] = this.M[1]*_M.M[0] + this.M[4]*_M.M[1] + this.M[7]*_M.M[2];
        res.M[2] = this.M[2]*_M.M[0] + this.M[5]*_M.M[1] + this.M[8]*_M.M[2];
        res.M[3] = this.M[0]*_M.M[3] + this.M[3]*_M.M[4] + this.M[6]*_M.M[5];
        res.M[4] = this.M[1]*_M.M[3] + this.M[4]*_M.M[4] + this.M[7]*_M.M[5];
        res.M[5] = this.M[2]*_M.M[3] + this.M[5]*_M.M[4] + this.M[8]*_M.M[5];
        res.M[6] = this.M[0]*_M.M[6] + this.M[3]*_M.M[7] + this.M[6]*_M.M[8];
        res.M[7] = this.M[1]*_M.M[6] + this.M[4]*_M.M[7] + this.M[7]*_M.M[8];
        res.M[8] = this.M[2]*_M.M[6] + this.M[5]*_M.M[7] + this.M[8]*_M.M[8];

        for(let i=0; i<this.size; i++){
            this.M[i] = res[i];
        }
    }


    getMultiplyMat(_M){
        let ret = new Mat33();
        ret.M[0] = this.M[0]*_M.M[0] + this.M[3]*_M.M[1] + this.M[6]*_M.M[2];
        ret.M[1] = this.M[1]*_M.M[0] + this.M[4]*_M.M[1] + this.M[7]*_M.M[2];
        ret.M[2] = this.M[2]*_M.M[0] + this.M[5]*_M.M[1] + this.M[8]*_M.M[2];
        ret.M[3] = this.M[0]*_M.M[3] + this.M[3]*_M.M[4] + this.M[6]*_M.M[5];
        ret.M[4] = this.M[1]*_M.M[3] + this.M[4]*_M.M[4] + this.M[7]*_M.M[5];
        ret.M[5] = this.M[2]*_M.M[3] + this.M[5]*_M.M[4] + this.M[8]*_M.M[5];
        ret.M[6] = this.M[0]*_M.M[6] + this.M[3]*_M.M[7] + this.M[6]*_M.M[8];
        ret.M[7] = this.M[1]*_M.M[6] + this.M[4]*_M.M[7] + this.M[7]*_M.M[8];
        ret.M[8] = this.M[2]*_M.M[6] + this.M[5]*_M.M[7] + this.M[8]*_M.M[8];

        return ret;
    }

    getMultiplyVec(v){
        let ret = new Vec3();
        ret.x = this.M[0]*v.x + this.M[3]*v.y + this.M[6]*v.z;
        ret.y = this.M[1]*v.x + this.M[4]*v.y + this.M[7]*v.z;
        ret.z = this.M[2]*v.x + this.M[5]*v.y + this.M[8]*v.z;
        return ret;
    }

    scale(s){
        for(let i=0; i<this.size; i++){
            this.M[i] *= s;
        }
    }

    getScale(s){
        let ret = new Mat33();
        // Doing this in a for-loop is probably slower 
        // than accessing each array elem individually.
        // I might test that one day...
        for(let i=0; i<this.size; i++){
            ret.M[i] = this.M[i] * s;
        }
        return ret;
    }

    transpose(){
        let tmp = this.M[1];
        this.M[1] = this.M[3];
        this.M[3] = tmp;

        tmp = this.M[2];
        this.M[2] = this.M[6];
        this.M[6] = tmp;

        tmp = this.M[5];
        this.M[5] = this.M[7];
        this.M[7] = tmp;
    }

    getTranspose(){
        let ret = new Mat33();
        ret.M[0] = this.M[0];
        ret.M[1] = this.M[3];
        ret.M[2] = this.M[6];
        ret.M[3] = this.M[1];
        ret.M[4] = this.M[4];
        ret.M[5] = this.M[7];
        ret.M[6] = this.M[2];
        ret.M[7] = this.M[5];
        ret.M[8] = this.M[8];
        return ret;
    }

    getDeterminant(){
        return this.M[0]*(this.M[4]*this.M[8] - this.M[5]*this.M[7]) +
            this.M[3]*(this.M[2]*this.M[7] - this.M[1]*this.M[8]) +
            this.M[6]*(this.M[1]*this.M[5] - this.M[2]*this.M[4]);
    }

    getTrace(){
        // Sum of main diagonal
        return this.M[0] + this.M[4] + this.M[8];
    }

    setRotationFromMat33(_M){
        this.M[0] = _M.M[0];
        this.M[1] = _M.M[1];
        this.M[2] = _M.M[2];
        this.M[3] = 0;
        this.M[4] = _M.M[3];
        this.M[5] = _M.M[4];
        this.M[6] = _M.M[5];
        this.M[7] = 0;
        this.M[8] = _M.M[6];
        this.M[9] = _M.M[7];
        this.M[10] = _M.M[8];
        this.M[11] = 0;
        this.M[12] = 0;
        this.M[13] = 0;
        this.M[14] = 0;
        this.M[15] = 1;
    }

    getAdjoint(){
        let ret = new Mat33();
        ret.M[0] = this.M[4]*this.M[8] - this.M[5]*this.M[7];
        ret.M[1] = this.M[2]*this.M[7] - this.M[1]*this.M[8];
        ret.M[2] = this.M[1]*this.M[5] - this.M[2]*this.M[4];

        ret.M[3] = this.M[5]*this.M[6] - this.M[3]*this.M[8];
        ret.M[4] = this.M[0]*this.M[8] - this.M[2]*this.M[6];
        ret.M[5] = this.M[2]*this.M[3] - this.M[0]*this.M[5];

        ret.M[6] = this.M[3]*this.M[7] - this.M[4]*this.M[6];
        ret.M[7] = this.M[1]*this.M[6] - this.M[0]*this.M[7];
        ret.M[8] = this.M[0]*this.M[4] - this.M[1]*this.M[3];
        return ret;
    }

    getInverse(_M){
        let ret = new Mat33();

        let cofactor0 = _M.M[4]*_M.M[8] - _M.M[5]*_M.M[7];
        let cofactor3 = _M.M[2]*_M.M[7] - _M.M[1]*_M.M[8];
        let cofactor6 = _M.M[1]*_M.M[5] - _M.M[2]*_M.M[4];
        let det = _M.M[0]*cofactor0 + _M.M[3]*cofactor3 + _M.M[6]*cofactor6;

        if(Utils.isZero(det)){
            throw new Utils.userException("Singular Matrix: Non-Invertible!");
        }

        let invDet = 1/det;
        ret.M[0] = invDet*cofactor0;
        ret.M[1] = invDet*cofactor3;
        ret.M[2] = invDet*cofactor6;

        ret.M[3] = invDet*(_M.M[5]*_M.M[6] - _M.M[3]*_M.M[8]);
        ret.M[4] = invDet*(_M.M[0]*_M.M[8] - _M.M[2]*_M.M[6]);
        ret.M[5] = invDet*(_M.M[2]*_M.M[3] - _M.M[0]*_M.M[5]);

        ret.M[6] = invDet*(_M.M[3]*_M.M[7] - _M.M[4]*_M.M[6]);
        ret.M[7] = invDet*(_M.M[1]*_M.M[6] - _M.M[0]*_M.M[7]);
        ret.M[8] = invDet*(_M.M[0]*_M.M[4] - _M.M[1]*_M.M[3]);

        return ret;
    }

    inverse(){
        let inv = this.getInverse(this); 
        this.setMat(inv.M);
    }

    getCopy(){
        let ret = new Mat33();
        ret.setMat(this.M);
        return ret;
    }

    negate(){
        for(let i=0; i<this.size; i++){
            this.M[i] = -this.M[i];
        }
    }

}
