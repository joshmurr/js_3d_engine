import ParametricMesh from './parametricMesh.js';

export class HyperbolicOctahedron extends ParametricMesh {
    constructor(_slices, _segments, _uMin, _uMax, _vMin, _vMax){
        super(_slices, _segments, _uMin, _uMax, _vMin, _vMax);
    }

    createX(u, v){
        return Math.pow((Math.cos(u) * Math.cos(v)),3);
    }
    createY(u, v){
        return Math.pow((Math.sin(u) * Math.cos(v)),3);
    }
    createZ(u, v){
        return Math.pow(Math.sin(v),3);
    }
}
