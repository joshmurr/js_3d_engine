import { areaForSorting, distance, midpoint, checkTriangle, heightOfTriangle } from '../math/utils.js';
import { Vec3, Vec4, Mat44 } from '../math/math.js';
import { Quat } from '../math/quaternion.js';

export default class Mesh{
    _verts = [];
    _faces = [];
    _indices = [];
    _indices_sorted = [];
    _norms = [];
    _centroids = [];
    NORMS_ARE_CALCULATED = false;
    _colour = null;
    _dualGraph = [];
    _dualGraph_sorted = [];
    _spanningTree = [];
    _angles_sorted = [];
    _midpoints = [];
    _rotated_verts = [];
    _flat_faces = [];
    _flat_norms = [];
    _faces_2d = [];

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
    set rotated_verts(v){
        for(let i=0; i<v.length; i++){
            this.rotated_verts[i] = v[i];
        }
    }
    get rotated_verts(){
        return this._rotated_verts;
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

    set midpoints(m){
        for(let i=0; i<m.length; i++){
            this._midpoints[i] = m[i];
        }
    }
    get midpoints(){
        return this._midpoints;
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

    set sorted_dualGraph(_sorted_array){
        for(let i=0; i<_sorted_array.length; i++){
            this._dualGraph_sorted[i] = _sorted_array[i];
        }
    }

    get sorted_dualGraph(){
        return this._dualGraph_sorted;
    }
    set sorted_angles(_sorted_array){
        for(let i=0; i<_sorted_array.length; i++){
            this._angles_sorted[i] = _sorted_array[i];
        }
    }

    get sorted_angles(){
        return this._angles_sorted;
    }

    set spanningTree(_array){
        for(let i=0; i<_array.length; i++){
            // for(let j=0; j<_array[i].length; j++){
            this._spanningTree[i] = _array[i];
        }
        // console.log("Spanning tree", this._spanningTree);
    }

    get spanningTree(){
        return this._spanningTree;
    }

    set norms(_norms){
        for(let i=0; i<_norms.length; i++){
            this._norms[i] = _norms[i];
        }
    }

    get norms(){
        return this._norms;
    }

    get dualGraph(){
        return this._dualGraph;
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

    sortDualGraphByDistanceBetweenCentroids(){
        let dualGraph_unordered = new Map();
        for(let i=0; i<this._dualGraph.length; i++){
            // Distance between two centroids in dual graph
            let dist = distance(this._centroids[this._dualGraph[i][0]], this._centroids[this._dualGraph[i][1]]);
            // sortedDualGraph[i] = dist;
            dualGraph_unordered.set(i, dist);
        }
        // ORDER FACES BY CENTROID.Z ------------
        // Rather than making a new map, the sorted faces are stored in an array
        let sorted = [];
        let sorted_vals = [];
        function sort_faces_into_array(value, key, map){
            sorted.push(key);
            sorted_vals.push(value);
        }
        let dualGraph_ordered = new Map([...dualGraph_unordered.entries()].sort((a,b) => a[1] - b[1]));
        dualGraph_ordered.forEach(sort_faces_into_array);
        this.sorted_dualGraph = sorted;
        dualGraph_ordered = null;
        dualGraph_unordered = null;
        sorted = [];
    }

    sortDualGraphByAngleBetweenFaces(){
        let dualGraph_unordered = new Map();
        for(let i=0; i<this._dualGraph.length; i++){
            // Distance between two centroids in dual graph
            let centroid_A = this._centroids[this._dualGraph[i][0]];
            let centroid_B = this._centroids[this._dualGraph[i][1]];

            // Angle between two faces
            // https://stackoverflow.com/questions/5355290/find-angle-between-faces-from-face-normals
            let normal_A = this._norms[this._dualGraph[i][0]];
            let normal_B = this._norms[this._dualGraph[i][1]];
            let dp = normal_A.dot(normal_B);
            let angle = Math.acos(dp); // Pi minus angle to get interior
            // console.log(this._dualGraph[i][0], this._dualGraph[i][1], dp, angle);

            dualGraph_unordered.set(i, angle);
        }
        let sorted = [];
        let sorted_vals = [];
        function sort_faces_into_array(value, key, map){
            sorted.push(key);
            sorted_vals.push(value);
        }
        // Swapping a and b gives different results..
        let dualGraph_ordered = new Map([...dualGraph_unordered.entries()].sort((a,b) => a[1] - b[1]));
        dualGraph_ordered.forEach(sort_faces_into_array);
        this.sorted_dualGraph = sorted;
        this.sorted_angles = sorted_vals;
        dualGraph_ordered = null;
        dualGraph_unordered = null;
        sorted = [];
    }


    computeFaceNormals(){
        let norms = [];
        for(let i=0; i<this.faces.length; i++){
            let p0 = this.verts[this.faces[i][0]];
            let p1 = this.verts[this.faces[i][1]];
            let p2 = this.verts[this.faces[i][2]];

            let p0subp1 = p1.getSubtract(p0);
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

    createDualGraph(){
        this._dualGraph = [];
        // For each face in the sorted array...
        let otherStart = 1;
        for(let i=0; i<this._indices_sorted.length; i++){
            let currentFace = this._faces[this._indices_sorted[i]];

            // Look at every other face...
            for(let j=otherStart; j<this._indices_sorted.length; j++){
                let otherFace = this._faces[this._indices_sorted[j]];

                if(i !== j) { // Don't check face with itself
                    // For each vert in that face...
                    let sum = 0;
                    for(let k=0; k<currentFace.length; k++){
                        let currentVert = currentFace[k];
                        // Look at every vertex in the other face...
                        for(let l=0; l<otherFace.length; l++){
                            let otherVert = otherFace[l];
                            if(currentVert == otherVert) sum++;
                        }
                    }
                    // If two or more verts are shared then the faces are adjacent
                    if(sum > 1) this._dualGraph.push([this._indices_sorted[i], this._indices_sorted[j]]);
                }
            }
            otherStart++;
        }
    }


    createSpanningTree(){
        this._spanningTree = [];

        // this.sortDualGraphByDistanceBetweenCentroids();
        this.sortDualGraphByAngleBetweenFaces();

        let face_areas = [];
        // The largest face will be the root of the Spanning Tree.
        // Calculate Face Areas ----------------------------
        for(let i=0; i<this._indices_sorted.length; i++){
            // unreached[i] = this._indices_sorted[i]; // Populate unreached array
            let face = this._faces[this._indices_sorted[i]];
            let points = [];
            for(let j=0; j<face.length; j++){
                points.push(this._verts[face[j]]);
            }
            face_areas[this._indices_sorted[i]] = areaForSorting(points);
        }

        // Order each pair in dual graph by largest face area
        for(let i=0; i<this._dualGraph_sorted.length; i++){
            let temp_A = this._dualGraph[i][0];
            let temp_B = this._dualGraph[i][1];
            let area_A = face_areas[temp_A];
            let area_B = face_areas[temp_B];

            if(area_A > area_B) continue;
            else {
                // Swap 'em:
                this._dualGraph[i][0] = temp_B;
                this._dualGraph[i][1] = temp_A;
            }
        }
        // Calculate Face Areas ----------------------------
        // Find the largest face ---------------------------
        let largestArea = 0;
        let largestFace = 0;
        for(let i=0; i<face_areas.length; i++){
            if(face_areas[i] > largestArea){
                largestArea = face_areas[i];
                largestFace = i;
            }
        }
        // console.log(largestFace);
        // Find the largest face ---------------------------
        // Create Spanning Tree ---------------------------
        // https://algorithms.tutorialhorizon.com/kruskals-algorithm-minimum-spanning-tree-mst-complete-java-implementation/
        //
        // Sort the edges in ascending order of weights.
        // Pick the edge with the least weight. Check if including this edge in spanning tree will form a cycle is Yes then ignore it if No then add it to spanning tree.
        // Repeat the step 2 till spanning tree has V-1 (V – no of vertices in Graph).
        // Spanning tree with least weight will be formed, called Minimum Spanning Tree
        //

        // console.log(this._dualGraph_sorted[i]+" > ",
        // this._dualGraph[this._dualGraph_sorted[i]][0]+": "+Math.floor(face_areas[this._dualGraph[this._dualGraph_sorted[i]][0]]),
        // this._dualGraph[this._dualGraph_sorted[i]][1]+": "+Math.floor(face_areas[this._dualGraph[this._dualGraph_sorted[i]][1]]));
        // }

        // Create Spanning Tree ---------------------------
        let spanningTree = [];
        // let angleTree = [];
        // console.log(this._angles_sorted);
        // console.log(this._dualGraph);
        for(let i=0; i<this._dualGraph_sorted.length; i++){
            let currentPair = this._dualGraph[this._dualGraph_sorted[i]].slice();
            // let currentAngle = this._angles_sorted[this._dualGraph_sorted[i]];

            // Check if currentPair[0] is already a child of another node
            let isChild = false;
            for(let i=0; i<spanningTree.length; i++){
                if(/*spanningTree[i][1]==currentPair[0] ||*/ spanningTree[i][1]==currentPair[1]) {
                    isChild = true;
                    break;
                }
            }
            if(isChild) continue;
            else spanningTree.push(currentPair);// angleTree.push(currentAngle);
        }
        // let spanningTreeCopy = spanningTree.slice();
        // console.log("Copy", spanningTreeCopy);
        this.completeSpanningTree(spanningTree);

        this.spanningTree = spanningTree;
        // Create Spanning Tree ---------------------------
    }

    // Recursive function to concatenate tree branches...
    completeSpanningTree(_spanningTree){
        for(let i=0; i<_spanningTree.length; i++){
            let currentNode = _spanningTree[i].slice();
            // let currentAngle = _angleTree[i];
            for(let j=0; j<_spanningTree.length; j++){
                let otherNode = _spanningTree[j].slice();
                // let otherAngle = _angleTree[j].slice();
                // If the first element of current node is the same as the last on otherNode:
                // [2, 1] + [3, 2] -> [3, 2, 1]
                if(currentNode[0] == otherNode[otherNode.length-1]){
                    _spanningTree[j].splice(otherNode.length-1,1,...currentNode);
                    _spanningTree.splice(i, 1);
                    this.completeSpanningTree(_spanningTree);
                }
            }
        }
    }

    flatten(){
        let xz_normal = new Vec4(0, 1, 0, 1);
        let moveToGroundMatrix = new Mat44();
        let rotateToGroundMatrix = new Mat44();
        for(let i=0; i<this._indices_sorted.length; i++){
            let index = this._indices_sorted[i];
            let face = this._faces[index];
            let normal = this._norms[index];
            let centroid = this._centroids[index];

            // Check angle with ground plane
            let dp = normal.dot(xz_normal);
            let angle = Math.acos(dp); // Pi minus angle to get interior

            let centroidToGround = new Vec3(0, -centroid.y, 0);
            let axis = new Vec3(centroid.x, 0, centroid.z);
            axis.normalize();
            moveToGroundMatrix.setTranslation(centroidToGround);
            rotateToGroundMatrix.setAxisAngle(centroidToGround, axis, angle);

            let faceCOPY = [];
            for(let j=0; j<face.length; j++){
                let v = moveToGroundMatrix.getMultiplyVec(this._verts[face[j]]);
                let n = moveToGroundMatrix.getMultiplyVec(normal);
                v = rotateToGroundMatrix.getMultiplyVec(v);
                n = rotateToGroundMatrix.getMultiplyVec(n);


                // v.add(normal);
                faceCOPY.push(v);
            }
            this._flat_faces.push(faceCOPY);
            // this._flat_norms.push(copy);
        }
        // console.log(this._flat_faces);
        // this._flat_faces is now a copy of faces with their own points at the same face ID
    }

    create2dCoordsFromFaces(){
        // console.warn("TEST");
        // let p = new Vec3(1, 7, -3);
        // let O = new Vec3(-1,3,1);
        // O.normalize();
        // let n = O.getCopy();
        // let e1 = new Vec3(1/(Math.SQRT2), 0, 1/Math.SQRT2);
        // let e2 = new Vec3(-3/Math.sqrt(22), -2/Math.sqrt(22), 3/Math.sqrt(22));
        // let pO = p.getSubtract(O);
        // let t1 = e1.dot(pO);
        // let t2 = e2.dot(pO);
        // console.log("O", O, "e1", e1, "e2", e2);
        // console.log(n.dot(e1), n.dot(e2), e1.dot(e2));
        // console.log("t1", t1, "t2", t2);
        // console.warn("END TEST");
        /*
            let p0 = this.verts[this.faces[i][0]];
            let p1 = this.verts[this.faces[i][1]];
            let p2 = this.verts[this.faces[i][2]];

            let p0subp1 = p1.getSubtract(p0);
            let p2subp0 = p2.getSubtract(p0);

            let norm = p0subp1.cross(p2subp0);
            norm.normalize();
            norms.push(norm);
        */

        for(let i=0; i<this._indices_sorted.length; i++){
            let index = this._indices_sorted[i];
            let face = this._faces[index];

            let p0 = this._verts[face[0]].getVec3();
            let p1 = this._verts[face[1]].getVec3();
            let p2 = this._verts[face[face.length-1]].getVec3();

            let O = p0.getCopy();

            let d = p2.getSubtract(p0);
            d.normalize();
            let v = p1.getSubtract(p0);
            let t = v.dot(d);
            let b = d.getMultiply(-t);
            let p = p1.getSubtract(b);

            let e1 = d;
            let e2 = p1.getAdd(p);
            e2.normalize();

            let n = e1.cross(e2);

            // console.log(face);
            // let normal = this._norms[index];
            // let centroid = this._centroids[index];

            // let O = this._verts[face[0]].getVec3();   // Origin = first point on face
            // let p1 = this._verts[face[1]].getVec3();
            // let e1 = this._verts[face[face.length-1]].getVec3();
            // // let e1 = p2.getSubtract(O);//.getCopy();
            // // e1.normalize();
            // // let v1 = p1.getSubtract(O); // Hypotenuse
            // // v1.normalize();
            // // v1.printProps();
//
            // let len_v1 = p1.length;
            // let cosTheta = p1.dot(e1) / (e1.length * len_v1)
            // let scale = len_v1 * cosTheta;
            // // console.log(scale);
            // let b = O.getMultiply(scale);
            // let _p1 = p1.getSubtract(b);
            // let e2 = _p1.getSubtract(O);
            // let len_c = c.length;
            // c.normalize();

            // b.printProps();
            // let B = O.getCopy();
            // B.add(b);

            // let e2 = O.getM(c);
            // let e2 = O.getCopy();
            // e2.add(c);

            // console.log("O", O, "p1", p1, "p2", p2, "e1", e1);
            // O.normalize();
            // let n = O.getCopy();
            // n.normalize();
            // Axis along base of polygon
            // let e1 = this._verts[face[face.length-1]].getVec3().getSubtract(O);//.getCopy();

            // let v1 = p1.getSubtract(O); // Hypotenuse


            // let p1 = this._verts[face[1]].getCopy();
            // let len_p1 = p1.length;
            // let cosTheta = O.dot(p1) / (O.length * len_p1)
            // let scale = len_p1 * cosTheta;
            // let b = e1.getMultiply(scale);
            
            // let c = p1.getSubtract(B);
            // c.normalize();
            // let e2 = O.getMultiply(

            // console.log(p1, b);
            // let e2 = c.getSubtract(b);
            // console.log(_e2);
            // let e2 = _e2.getSubtract(O);
            // e2.normalize();
            // console.log("e1", e1, "e2", e2,  "b", b, "cosTheta", cosTheta);

            // let n = e2.cross(e1);


            // e1.normalize();
            // let e2 = n.cross(e1);//this._verts[face[face.length-1]].getCopy();
            // e2.normalize();
            // let e1 = e2.cross(n);
            let face2d = [];
            // console.log("O", O, "n", n, "e1", e1, "e2", e2);
            console.log(n.dot(e1), n.dot(e2), e1.dot(e2)); // ( 0, 0, 0 )
            for(let vert in face){
                let p_minus_O = this._verts[vert].getVec3().getSubtract(O);
                let t1 = e1.dot(p_minus_O);
                let t2 = e2.dot(p_minus_O);
                face2d.push([t1,t2]);
            }
            this._faces_2d.push(face2d);

        }
        console.log(this._faces_2d);
    }

    
}
