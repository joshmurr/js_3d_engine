import { Vec4 } from '../math/math.js';
import Mesh from './mesh.js';

export class Icosahedron extends Mesh{
    constructor(){
        super();
        this._radius = (1 + Math.sqrt(5)) / 2;
        this.faces = [
            [0, 11, 5],
            [0, 5, 1],
            [0, 1, 7],
            [0, 7, 10],
            [0, 10, 11],
            [1, 5, 9],
            [5, 11, 4],
            [11, 10, 2],
            [10, 7, 6],
            [7, 1, 8],
            [3, 9, 4],
            [3, 4, 2],
            [3, 2, 6],
            [3, 6, 8],
            [3, 8, 9],
            [4, 9, 5],
            [2, 4, 11],
            [6, 2, 10],
            [8, 6, 7],
            [9, 8, 1],
            //
            // [0, 1, 2],
            // [0, 2, 3],
            // [0, 3, 4],
            // [0, 4, 5],
            // [0, 5, 1],
            // [11, 7, 6],
            // [11, 8, 7],
            // [11, 9, 8],
            // [11, 10, 9],
            // [11, 6, 10],
            // [1, 6, 2],
            // [2, 7, 3],
            // [3, 8, 4],
            // [4, 9, 5],
            // [5, 10, 1],
            // [6, 7, 2],
            // [7, 8, 3],
            // [8, 9, 4],
            // [9, 10, 5],
            // [10, 6, 1]
        ];
        this.verts = [
            new Vec4(-1,  this._radius,  0, 1),
            new Vec4( 1,  this._radius,  0, 1),
            new Vec4(-1, -this._radius,  0, 1),
            new Vec4( 1, -this._radius,  0, 1),
            new Vec4( 0, -1,  this._radius, 1),
            new Vec4( 0,  1,  this._radius, 1),
            new Vec4( 0, -1, -this._radius, 1),
            new Vec4( 0,  1, -this._radius, 1),
            new Vec4( this._radius,  0, -1, 1),
            new Vec4( this._radius,  0,  1, 1),
            new Vec4(-this._radius,  0, -1, 1),
            new Vec4(-this._radius,  0,  1, 1)
           // new Vec4(0.000, 0.000, 1.000, 1),
           // new Vec4(0.894, 0.000, 0.447, 1),
           // new Vec4(0.276, 0.851, 0.447, 1),
           // new Vec4(-0.724, 0.526, 0.447, 1),
           // new Vec4(-0.724, -0.526, 0.447, 1),
           // new Vec4(0.276, -0.851, 0.447, 1),
           // new Vec4(0.724, 0.526, -0.447, 1),
           // new Vec4(-0.276, 0.851, -0.447, 1),
           // new Vec4(-0.894, 0.000, -0.447, 1),
           // new Vec4(-0.276, -0.851, -0.447, 1),
           // new Vec4(0.724, -0.526, -0.447, 1),
           // new Vec4(0.000, 0.000, -1.000, 1)
        ];
        for(let i=0; i<this.verts.length; i++) this.verts[i].normalize();
    }
}


