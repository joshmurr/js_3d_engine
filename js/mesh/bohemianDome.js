import ParametricMesh from './parametricMesh.js';

export class BohemianDome extends ParametricMesh {
    constructor(_slices, _segments, _uMin, _uMax, _vMin, _vMax, _a, _b, _c){
        super(_slices, _segments, _uMin, _uMax, _vMin, _vMax);
        this._a = _a;
        this._b = _b;
        this._c = _c;
    }

    createX(u, v){
        return this._a*Math.cos(u);
    }
    createY(u, v){
        return this._b*Math.cos(v)+this._a*Math.sin(u);
    }
    createZ(u, v){
        return this._c*Math.sin(v);
    }
}
