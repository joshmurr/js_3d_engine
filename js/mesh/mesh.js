import { Vec3, Vec4, Mat44 } from '../math/math.js';
// import Vec4 from '../math/vec4.js';
// import Mat44 from '../math/mat44.js';

export default class Mesh{
    _verts = [];
    _faces = [];
    _indices = [];
    _indices_sorted = [];
    _norms = [];
    _centroids = [];
    NORMS_ARE_CALCULATED = false;
    _colour = null;

    constructor(){
        this.modelMatrix = new Mat44();
        this.modelMatrix.setIdentity();
    }

    get colour(){
        return this._colour;
    }

    set colour(v){
        this._colour = new Vec3(v.x,v.y,v.z);
    }

    set verts(v){
        for(let i=0; i<v.length; i++){
            this._verts[i] = v[i];
        }
    }
    get verts(){
        return this._verts;
    }

    set faces(f){
        for(let i=0; i<f.length; i++){
            this._faces[i] = f[i];
        }
    }
    get faces(){
        return this._faces;
    }

    set centroids(c){
        for(let i=0; i<c.length; i++){
            this._centroids[i] = c[i];
        }
    }
    get centroids(){
        return this._centroids;
    }

    get meshCentroid(){
        let sum = new Vec4(0,0,0,0);
        for(let i=0; i<this._centroids.length; i++){
            sum.add(this._centroids[i]);
        }
        sum.divide(this._centroids.length);
        return sum;
    }


    set sorted_indices(_sorted_array){
        for(let i=0; i<_sorted_array.length; i++){
            this._indices_sorted[i] = _sorted_array[i];
        }
    }

    get sorted_indices(){
        this.sortIndicesByCentroid();
        return this._indices_sorted;
    }

    set norms(_norms){
        for(let i=0; i<_norms.length; i++){
            this._norms[i] = _norms[i];
        }
    }

    get norms(){
        return this._norms;
    }

    sortIndicesByCentroid(){
        // Store the <centroid.z, face> map for later sorting
        let faces_unordered = new Map();
        for(let i=0; i<this.faces.length; i++){
            let face = this.faces[i];

            // COMPUTE CENTROID --------
            let sum = new Vec4(0,0,0,0);
            for(let j=0; j<face.length; j++){
                let p = this.modelMatrix.getMultiplyVec(this.verts[face[j]]);
                sum.add(p);
            }
            sum.divide(face.length);
            // Store centroid
            this._centroids[i] = sum;
            // Store INDEX in map
            faces_unordered.set(i, sum.z);
        }
        // ORDER FACES BY CENTROID.Z ------------
        // Rather than making a new map, the sorted faces are stored in an array
        let sorted = [];
        function sort_faces_into_array(value, key, map){
            sorted.push(key);
        }
        // An arrow function to sort the map by value (centroid.z)
        // Arrow functions are difficult to read
        // https://stackoverflow.com/questions/37982476/how-to-sort-a-map-by-value-in-javascript
        let faces_ordered = new Map([...faces_unordered.entries()].sort((a,b) => a[1] - b[1]));
        // sort_faces_into_array is a callback function which takes (value, key, map).
        // I presume this is an automatic feature of a Map.
        faces_ordered.forEach(sort_faces_into_array);
        // Faces are now sorted back to front!
        this.sorted_indices = sorted;
        // Try and free some memory:
        faces_ordered = null;
        faces_unordered = null;
        sorted = [];
    }


    computeFaceNormals(){
        let norms = [];
        for(let i=0; i<this.faces.length; i++){
            let p0 = this.verts[this.faces[i][0]];
            let p1 = this.verts[this.faces[i][1]];
            let p2 = this.verts[this.faces[i][2]];
            
            let p0subp1 = p0.getSubtract(p1);
            let p2subp0 = p2.getSubtract(p0);

            let norm = p0subp1.cross(p2subp0);
            norm.normalize();
            norms.push(norm);
        }
        this.NORMS_ARE_CALCULATED = true;
        this.norms = norms;
    }

    getModelMatrix(_guiValues){
        // NB: in Mat44.setMat([0,...,15]) values are entered in COLUMN MAJOR order.
        let scaleMat = new Mat44();
        scaleMat.setMat([_guiValues["xScale"],0,0,0, 0,_guiValues["yScale"],0,0, 0,0,_guiValues["zScale"],0, 0,0,0,1]);

        let rotXMat = new Mat44();
        rotXMat.setMat([1, 0, 0, 0, 0, Math.cos(_guiValues["xRot"]), Math.sin(_guiValues["xRot"]), 0, 0, -Math.sin(_guiValues["xRot"]), Math.cos(_guiValues["xRot"]), 0, 0, 0, 0, 1]);

        let rotYMat = new Mat44();
        rotYMat.setMat([Math.cos(_guiValues["yRot"]), 0, -Math.sin(_guiValues["yRot"]), 0, 0, 1, 0, 0, Math.sin(_guiValues["yRot"]), 0, Math.cos(_guiValues["yRot"]), 0, 0, 0, 0, 1]);

        let rotZMat = new Mat44();
        rotZMat.setMat([Math.cos(_guiValues["zRot"]),-Math.sin(_guiValues["zRot"]),0,0, Math.sin(_guiValues["zRot"]),Math.cos(_guiValues["zRot"]),0,0, 0,0,1,0, 0,0,0,1]);

        let transMat = new Mat44();
        transMat.setMat([1,0,0,0, 0,1,0,0, 0,0,1,0, _guiValues["xTrans"],_guiValues["yTrans"],_guiValues["zTrans"],1]);

        this.modelMatrix.setIdentity();
        this.modelMatrix.multiplyMat(transMat);
        this.modelMatrix.multiplyMat(rotXMat);
        this.modelMatrix.multiplyMat(rotYMat);
        this.modelMatrix.multiplyMat(rotZMat);
        this.modelMatrix.multiplyMat(scaleMat);

        return this.modelMatrix;
    }
}
