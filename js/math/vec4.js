import * as Utils from './utils.js';
import { Vec3 } from './math.js';

export class Vec4 extends Vec3{

    /*
     * Length : float
     * LengthSquared : float
     *
     * IsUnit : bool
     * IsZero : bool
     *
     * Clean : void - sets near 0 elements to 0
     * Zero : void - sets all elements to 0
     * Normalize : void
     *
     * + -
     * * / -- scalar
     *
     * Dot : float
     *
     */


    constructor(_x, _y, _z, _w=1){
        super(_x, _y, _z);
        this.w = _w;
    }

    getType(){
        return "Vec4";
    }

    printProps(){
        console.group("Vec4:");
        console.log("x: " + this.x);
        console.log("y: " + this.y);
        console.log("z: " + this.z);
        console.log("w: " + this.w);
        console.groupEnd();
    }

    get lengthSquared(){
        return super.lengthSquared + this.w*this.w;
    }

    get length(){
        return (Math.sqrt(this.lengthSquared));
    }

    add(v){
        super.add(v);
        if(v.constructor.type == "Vec4") this.w += v.w;
    }

    subtract(v){
        super.subtract(v);
        /*if(v.constructor.type == "Vec4")*/ this.w -= v.w;
    }

    getSubtract(v){
        return new Vec4(this.x-v.x, this.y-v.y, this.z-v.z, this.w-v.w);
    }

    multiply(s){
        super.multiply(s);
        this.w *= s;
    }

    getMultiply(s){
        return new Vec4(this.x*s, this.y*s, this.z*s, this.w*s);
    }

    divide(s){
        super.divide(s);
        this.w /= s;
    }

    distanceToSquared(v){
        return super.distanceToSquared + this.w*v.w;
    }

    distanceTo(v){
        return Math.sqrt(this.distanceToSquared);
    }

    // isUnit()
    
    isZero(){
        let ret = Utils.isZero(this.x) && Utils.isZero(this.y) && Utils.isZero(this.z) && Utils.isZero(this.w);
        if(ret) this.zero();
        return ret;
    }

    zero(){
        super.zero();
        this.w = 0;
    }

    isEqual(v){
        return super.isEqual(v) && Utils.areEqual(this.w, v.w);
    }

    clean(){
        super.clean();
        this.w = this.w < Utils.smallNum ? 0 : this.w;
    }

    negate(){
        super.negate();
        this.w = -this.w;
    }

    toArray(){
        return [this.x, this.y, this.z, this.w];
    }

    normalize(){
        let lSq = this.lengthSquared;
        if(lSq < Utils.smallNum) this.zero();
        else {
            let l = Math.sqrt(lSq);
            this.x /= l;
            this.y /= l;
            this.z /= l;
            this.w /= l;
        }
    }

    getNormalize(){
        let lSq = this.lengthSquared;
        if(lSq < Utils.smallNum) {
            return new Vec4(0, 0, 0, 0);
        } else {
            let l = Math.sqrt(lSq);
            return new Vec4(this.x/l, this.y/l, this.z/l, this.w/l);
        }
    }

    getNDC(){
        return new Vec4(this.x/-this.z, this.y/-this.z, this.z/-this.z, this.w/-this.z);
    }
    getNDCw(){
        return new Vec4(this.x/this.w, this.y/this.w, this.z/this.w, this.w/this.w);
    }

    getCopy(){
        return new Vec4(this.x, this.y, this.z, this.w);
    }

    NDC(){
        this.x /= this.w;
        this.y /= this.w;
        this.z /= this.w;
        this.w = 1;
    }

    getVec3(){
        return new Vec3(this.x, this.y, this.z);
    }


/*
 *     dot(v){
 *         return this.x*v.x + this.y*v.y + this.z*v.z + this.w*v.w;
 *     }
 *
 *     cross(v){
 *         return new Vec3( this.y*v.z - this.z*v.y, this.z*v.x - this.x*v.z, this.x*v.y - this.y*v.x );
 *     }
 */

}
