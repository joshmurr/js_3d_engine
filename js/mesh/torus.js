import ParametricMesh from './parametricMesh.js';

export class Torus extends ParametricMesh {
    constructor(_slices, _segments, _uMin, _uMax, _vMin, _vMax, _c, _a){
        // c - Radius from centre of hole to centre of torus
        // a - Radius of tube
        super(_slices, _segments, _uMin, _uMax, _vMin, _vMax);
        this._c = _c;
        this._a = _a;
    }

    createX(u, v){
        return (this._c + this._a * Math.cos(v))*Math.cos(u);
    }
    createY(u, v){
        return (this._c + this._a * Math.cos(v))*Math.sin(u);
    }
    createZ(u, v){
        return this._a * Math.sin(v);
    }
}
