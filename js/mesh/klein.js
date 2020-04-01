import ParametricMesh from './parametricMesh.js';

export class KleinBottle extends ParametricMesh {
    constructor(_slices, _segments, _uMin, _uMax, _vMin, _vMax){
        super(_slices, _segments, _uMin, _uMax, _vMin, _vMax);
    }

    createX(u, v){
        if(u < Math.PI){
            return 3 * Math.cos(u) * (1+Math.sin(u)) + (2*(1-Math.cos(u)/2)) * Math.cos(u) * Math.cos(v);
        } else {
            return 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(v + Math.PI);
        }
    }
    createY(u, v){
        return -2 * (1 - Math.cos(u) / 2) * Math.sin(v);
    }
    createZ(u, v){
        if(u < Math.PI){
            return -8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
        } else {
            return -8 * Math.sin(u);
        }
    }
}
