import * as Utils from './utils.js';

export class Vec3{

    /*
     * Length : float
     * LengthSquared : float
     * Distance : float
     * DistanceSquared : float
     * Cross : vec3
     *
     * IsUnit : bool
     * IsZero : bool
     *
     * Clean : void - sets near 0 elements to 0
     * Zero : void - sets all elements to 0
     * Normalize : void
     *
     * + -
     * * / (scalar)
     *
     * Dot : float
     *
     */


    constructor(_x, _y, _z){
        this.x = _x;
        this.y = _y;
        this.z = _z;
    }

    getType(){
        return "Vec3";
    }


    printProps(){
        console.group("Vec3:");
        console.log("x: " + this.x);
        console.log("y: " + this.y);
        console.log("z: " + this.z);
        console.groupEnd();
    }

    get lengthSquared(){
        return this.x*this.x + this.y*this.y + this.z*this.z;
    }

    get length(){
        return Math.sqrt(this.lengthSquared);
    }

    add(v){
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
    }

    getAdd(v){
        return new Vec3(this.x+v.x, this.y+v.y, this.z+v.z);
    }

    subtract(v){
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
    }

    getSubtract(v){
        return new Vec3(this.x-v.x, this.y-v.y, this.z-v.z);
    }

    multiply(s){
        this.x *= s;
        this.y *= s;
        this.z *= s;
    }

    getMultiply(s){
        return new Vec3(this.x*s, this.y*s, this.z*s);
    }

    divide(s){
        this.x /= s;
        this.y /= s;
        this.z /= s;
    }

    distanceToSquared(v){
        let x = this.x - v.x;
        let y = this.y - v.y;
        let z = this.z - v.z;

        return x*x + y*y + z*z;
    }

    distanceTo(v){
        return Math.sqrt(this.distanceToSquared(v));
    }

    isUnit(){
        // Checks against small num for lack of precision in normalisation
        return (1 - this.lengthSquared <= Utils.smallNum);
    }

    isZero(){
        // If basically 0, set x,y,z to 0
        let ret = Utils.isZero(this.x) && Utils.isZero(this.y) && Utils.isZero(this.z);
        if(ret) this.zero();
        return ret;
    }

    isEqual(v){
        return Utils.areEqual(this.x, v.x) && 
               Utils.areEqual(this.y, v.y) && 
               Utils.areEqual(this.z, v.z);
    }

    clean(){
        // Sets values to 0 if nearly 0
        this.x = this.x < Utils.smallNum ? 0 : this.x;
        this.y = this.y < Utils.smallNum ? 0 : this.y;
        this.z = this.z < Utils.smallNum ? 0 : this.z;
    }

    zero(){
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }

    negate(){
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
    }

    toArray(){
        return [this.x, this.y, this.z];
    }

    normalize(){
        let lSq = this.lengthSquared;
        if(lSq < Utils.smallNum) this.zero();
        else {
            let l = Math.sqrt(lSq);
            this.x /= l;
            this.y /= l;
            this.z /= l;
        }
    }

    getNormalize(){
        let lSq = this.lengthSquared;
        if(lSq < Utils.smallNum) {
            return new Vec3(0, 0, 0);
        } else {
            let l = Math.sqrt(lSq);
            return new Vec3(this.x/l, this.y/l, this.z/l);
        }
    }


    dot(v){
        // Returns float
        return this.x*v.x + this.y*v.y + this.z*v.z;
    }

    cross(v){
        return new Vec3( this.y*v.z - this.z*v.y, this.z*v.x - this.x*v.z, this.x*v.y - this.y*v.x );
    }

    getCopy(){
        return new Vec3(this.x, this.y, this.z);
    }
}
