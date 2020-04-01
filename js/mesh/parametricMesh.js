import { Vec3, Vec4, Mat44 } from '../math/math.js';
// import Vec4 from '../math/vec4.js';
// import Mat44 from '../math/mat44.js';
import Mesh from './mesh.js';

export default class ParametricMesh extends Mesh{
    constructor(_slices, _segments, _uMin, _uMax, _vMin, _vMax) {
        super();
        this._slices = _slices;
        this._segments = _segments;
        this._uMin = _uMin;
        this._uMax = _uMax;
        this._vMin = _vMin;
        this._vMax = _vMax;
    }

    createVerts(){
        let x, y, z;

        for (var i = 0; i < this._slices+1; i++) {
            let u = (i * (this._uMax-this._uMin) / this._slices) + this._uMin; // theta

            for (var j = 0; j < this._segments; j++) {
                let v = (j * (this._vMax-this._vMin) / this._slices) + this._vMin; // theta
                x = this.createX(u, v);
                y = this.createY(u, v);
                z = this.createZ(u, v);

                let p = new Vec4(x, y, z, 1);
                this._verts.push(p);
            }
        }
    }

    createFaces(){
        // MAKE INDICES
        let v = 0;
        for (var i = 0; i < this._slices; i++) {
            for (var j = 0; j < this._segments; j++) {
                let next = (j+1) % this._segments;
                this._faces.push([v+j, v+j+this._segments, v+next+this._segments, v+next]);
            }
            v = v + this._segments;
        }
    }
}
