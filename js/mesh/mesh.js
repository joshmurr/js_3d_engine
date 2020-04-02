import { areaForSorting, distance, midpoint, checkTriangle, heightOfTriangle } from '../math/utils.js';
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
    _dualGraph = [];
    _dualGraph_sorted = [];
    _spanningTree = [];
    _midpoints = [];

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
        let joiningEdges = [];
        for(let i=0; i<this._dualGraph.length; i++){
            // Distance between two centroids in dual graph
            let centroid_A = this._centroids[this._dualGraph[i][0]];
            let centroid_B = this._centroids[this._dualGraph[i][1]];

            let normal_A = this._norms[this._dualGraph[i][0]];
            let normal_B = this._norms[this._dualGraph[i][1]];
            let dp = normal_A.dot(normal_B);
            let angle = Math.acos(dp);
            console.log(this._dualGraph[i][0], this._dualGraph[i][1], dp, angle);

            /*
            let joiningEdge = [];
            for(let j=0; j<this._dualGraph[i].length; j++){
                let face_A = this._faces[this._dualGraph[i][0]];
                let face_B = this._faces[this._dualGraph[i][1]];

                for(let k=0; k<face_A.length; k++){
                    for(let l=0; l<face_A.length; l++){
                        if(face_A[k] == face_B[l]) {
                            // console.log(face_A[k], face_B[k]);
                            joiningEdge.push(face_A[k]);
                        }
                    }
                }
                let midP = midpoint(this._verts[joiningEdge[0]], this._verts[joiningEdge[1]]);
                // midP.divide(2);
                this._midpoints[i] = midP; // Store midpoint with same ID as dual graph pair.

                // Transform verts for more accurate calculations:
                
                let tMidP = this.modelMatrix.getMultiplyVec(midP);
                let tCentroid_A = this.modelMatrix.getMultiplyVec(centroid_A);
                let tCentroid_B = this.modelMatrix.getMultiplyVec(centroid_B);

                let triangle_side_A = tMidP.getSubtract(tCentroid_A);
                let triangle_side_B = tMidP.getSubtract(tCentroid_B);
                let triangle_side_C = tCentroid_A.getSubtract(tCentroid_B);
                triangle_side_A = triangle_side_A.lengthSquared;
                triangle_side_B = triangle_side_B.lengthSquared;
                triangle_side_C = triangle_side_C.lengthSquared;

                console.log(triangle_side_A, triangle_side_B, triangle_side_C);
                console.log(checkTriangle(triangle_side_A, triangle_side_B, triangle_side_C));

                let triangle_height = heightOfTriangle(triangle_side_A, triangle_side_C, triangle_side_B);
                console.log(triangle_height);

            } */

            // dualGraph_unordered.set(i, dist);
        }
        // ORDER FACES BY CENTROID.Z ------------
        // Rather than making a new map, the sorted faces are stored in an array
        // let sorted = [];
        // let sorted_vals = [];
        // function sort_faces_into_array(value, key, map){
            // sorted.push(key);
            // sorted_vals.push(value);
        // }
        // let dualGraph_ordered = new Map([...dualGraph_unordered.entries()].sort((a,b) => a[1] - b[1]));
        // dualGraph_ordered.forEach(sort_faces_into_array);
        // this.sorted_dualGraph = sorted;
        // dualGraph_ordered = null;
        // dualGraph_unordered = null;
        // sorted = [];
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

        // for(let i=0; i<this._dualGraph_sorted.length; i++){
        // Dual graph pair > dual graph ordered by distance between centroids,
        // and the area of the respective face.
        //
        // 0 > 2: 231 6: 1824
        // 5 > 2: 787 1: 7956
        // 8 > 2: ... 3: ..
        //

        // console.log(this._dualGraph_sorted[i]+" > ",
        // this._dualGraph[this._dualGraph_sorted[i]][0]+": "+Math.floor(face_areas[this._dualGraph[this._dualGraph_sorted[i]][0]]),
        // this._dualGraph[this._dualGraph_sorted[i]][1]+": "+Math.floor(face_areas[this._dualGraph[this._dualGraph_sorted[i]][1]]));
        // }

        // Create Spanning Tree ---------------------------
        let spanningTree = [];
        for(let i=0; i<this._dualGraph_sorted.length; i++){
            let currentPair = this._dualGraph[this._dualGraph_sorted[i]].slice();
            // currentPair[0] >= currentPair[1]

            // Check if currentPair[0] is already a child of another node
            let isChild = false;
            for(let i=0; i<spanningTree.length; i++){
                if(/*spanningTree[i][1]==currentPair[0] ||*/ spanningTree[i][1]==currentPair[1]) {
                    isChild = true;
                    break;
                }
            }
            if(isChild) continue;
            else spanningTree.push(currentPair);
        }
        this.completeSpanningTree(spanningTree);
        console.log(spanningTree);

        this.spanningTree = spanningTree;
        // Create Spanning Tree ---------------------------
    }

    completeSpanningTree(_spanningTree){
        for(let i=0; i<_spanningTree.length; i++){
            let currentNode = _spanningTree[i].slice();
            for(let j=0; j<_spanningTree.length; j++){
                let otherNode = _spanningTree[j].slice();
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

}
