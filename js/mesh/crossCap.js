import ParametricMesh from './parametricMesh.js';

export class CrossCap extends ParametricMesh {
    constructor(_slices, _segments, _uMin, _uMax, _vMin, _vMax){
        super(_slices, _segments, _uMin, _uMax, _vMin, _vMax);
    }

    createX(u, v){
        return 0.5*Math.cos(u)*Math.sin(2*v);
    }
    createY(u, v){
        return 0.5*Math.sin(u)*Math.sin(2*v);
    }
    createZ(u, v){
        return 0.5*(Math.pow(Math.cos(v),2) - Math.pow(Math.cos(u),2)*Math.pow(Math.sin(v),2));
    }
}
