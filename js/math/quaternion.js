// import * as Utils from './utils.js';
// import { Vec3, Vec4, Mat33 } from './math.js';

export class Quat {
    _x;
    _y;
    _z;
    _w;

    constructor(axis, angle){
        this._angle = angle/2;
        let scaleFactor = Math.sin(this._angle)/axis.length;

        this._w = Math.cos(this._angle);
        this._x = scaleFactor * axis.x;
        this._y = scaleFactor * axis.y;
        this._z = scaleFactor * axis.z;
    }

    get x(){
        return this._x;
    }
    get y(){
        return this._y;
    }
    get z(){
        return this._z;
    }
    get w(){
        return this._w;
    }

}
