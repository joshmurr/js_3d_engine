import { Vec4 } from '../math/math.js';
import Mesh from './mesh.js';

export class Octahedron extends Mesh{
    constructor(){
        super();
        let f = Math.SQRT2 / 2;
        this.faces = [
            [0, 2, 1], 
            [0, 3, 2], 
            [0, 4, 3], 
            [0, 1, 4], 
            [5, 1, 2], 
            [5, 2, 3], 
            [5, 3, 4], 
            [5, 4, 1]
        ];
        this.verts = [			
            new Vec4( 0, -1,  0, 1), 			
            new Vec4(-f,  0,  f, 1), 			
            new Vec4( f,  0,  f, 1), 			
            new Vec4( f,  0, -f, 1), 			
            new Vec4(-f,  0, -f, 1), 			
            new Vec4( 0,  1,  0, 1) ];
    }
}


