import { Vec4 } from '../math/vec4.js';
import Mesh from './mesh.js';

export class Tetrahedron extends Mesh{
    constructor(){
        super();
        this.faces = [
            [3,2,0],
            [1,0,2],
            [3,0,1],
            [1,2,3]
        ];
        this.verts = [
            new Vec4( 1,  1,  1, 1),
            new Vec4( 1, -1, -1, 1),
            new Vec4(-1,  1, -1, 1),
            new Vec4(-1, -1,  1, 1),
        ];
    }
}


