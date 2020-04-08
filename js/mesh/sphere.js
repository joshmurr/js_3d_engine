import ParametricMesh from './parametricMesh.js';

export class Sphere extends ParametricMesh {
    constructor(_slices, _segments, _uMin, _uMax, _vMin, _vMax){
        super(_slices, _segments, _uMin, _uMax, _vMin, _vMax);
    }

    createX(u, v){
        return Math.sin(u) * Math.cos(v);
    }
    createY(u, v){
        return Math.sin(u) * Math.sin(v);
    }
    createZ(u, v){
        return Math.cos(u);
    }
}
