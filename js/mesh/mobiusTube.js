import ParametricMesh from './parametricMesh.js';

export class MobiusTube extends ParametricMesh {
    constructor(_slices, _segments, _uMin, _uMax, _vMin, _vMax, _R, _n){
        // c - Radius from centre of hole to centre of torus
        // a - Radius of tube
        super(_slices, _segments, _uMin, _uMax, _vMin, _vMax);
        this._R = _R;
        this._n = _n;
    }

    createX(u, v){
        return (1*this._R + 0.125*Math.sin(u/2)*Math.pow(Math.abs(Math.sin(v)), 2/this._n)*Math.sign(Math.sin(v)) + 0.5*Math.cos(u/2)*Math.pow(Math.abs(Math.cos(v)), 2/this._n)*Math.sign(Math.cos(v)))*Math.cos(u);
    }
    createY(u, v){
        return (1.0*this._R + 0.125*Math.sin(u/2)*Math.pow(Math.abs(Math.sin(v)), 2/this._n)*Math.sign(Math.sin(v)) + 0.5*Math.cos(u/2)*Math.pow(Math.abs(Math.cos(v)), 2/this._n)*Math.sign(Math.cos(v)))*Math.sin(u);
    }
    createZ(u, v){
        return -0.5*Math.sin(u/2)*Math.pow(Math.abs(Math.cos(v)), 2/this._n)*Math.sign(Math.cos(v)) + 0.125*Math.cos(u/2)*Math.pow(Math.abs(Math.sin(v)), 2/this._n)*Math.sign(Math.sin(v));
    }
}
