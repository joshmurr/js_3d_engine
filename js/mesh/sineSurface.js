import ParametricMesh from './parametricMesh.js';

export class SineSurface extends ParametricMesh {
    constructor(_slices, _segments, _uMin, _uMax, _vMin, _vMax, _a){
        super(_slices, _segments, _uMin, _uMax, _vMin, _vMax);
        this._a = _a;
    }

    createX(u, v){
        return this._a * Math.sin(u);
    }
    createY(u, v){
        return this._a * Math.sin(v);
    }
    createZ(u, v){
        return this._a * Math.sin(u+v);
    }
}
