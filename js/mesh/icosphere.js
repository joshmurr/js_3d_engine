import { Icosahedron } from "./platonicSolids.js";

export class Icosphere extends Icosahedron{
    constructor(iterations){
        super();
        // this._radius = this.verts[0].length;
        this._radius = (1 + Math.sqrt(5)) / 2;
        // this._iterations = iterations;
        this._vertIndex = {};
        this._vertIdCounter = 0;
        for(let i=0; i<this.verts.length; i++) this.addToVertIndex(this.verts[i]);
        for(let i=0; i<iterations; i++) this.refineSurface();
    }

    getMiddlePoint(v1, v2){
        let ret = v1.getAdd(v2);
        ret.multiply(0.5);
        ret.normalize();
        ret.multiply(this._radius);
        ret.w = 1;
        this.addToVertIndex(ret);
        return ret;
    }

    addToVertIndex(v){
        let k = String(v.x).substring(0,5)+String(v.y).substring(0,5)+String(v.z).substring(0,5);
        if(this._vertIndex[k]) return;
        else this._vertIndex[k] = [this._vertIdCounter++, v];
    }


    getId(v){
        let k = String(v.x).substring(0,5)+String(v.y).substring(0,5)+String(v.z).substring(0,5);
        return this._vertIndex[k][0];
    }

    refineSurface(){
        let newVerts = [];
        let newFaces = [];

        // for(let i=0; i<this._iterations; i++){
        for(let j=0; j<this.faces.length; j++){
            let f1 = this.faces[j][0];
            let f2 = this.faces[j][1];
            let f3 = this.faces[j][2];

            let v1 = this.verts[f1];
            let v2 = this.verts[f2];
            let v3 = this.verts[f3];

            let a = this.getMiddlePoint(v1, v2);
            let b = this.getMiddlePoint(v2, v3);
            let c = this.getMiddlePoint(v3, v1);

            let aID = this.getId(a);
            let bID = this.getId(b);
            let cID = this.getId(c);
            //             i   1   2  3  4  5
            newVerts.push(a, b, c);
            newFaces.push([  f1, aID, cID]);
            newFaces.push([  f2, bID, aID]);
            newFaces.push([  f3, cID, bID]);
            newFaces.push([ aID, bID, cID]);
        }

        // Replace original verts and faces
        for(let key in this._vertIndex){
            if(this._vertIndex.hasOwnProperty(key)){
                this.verts[this._vertIndex[key][0]] = this._vertIndex[key][1];
            }
        }
        this.faces = newFaces;
    }
}
