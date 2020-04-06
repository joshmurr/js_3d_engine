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
    _net = [];

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
        for(let i=0; i<this._dualGraph_sorted.length; i++){
            let currentPair = this._dualGraph[this._dualGraph_sorted[i]].slice();

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

        this.spanningTree = spanningTree.sort();
        // Create Spanning Tree ---------------------------
    }

    // Recursive function to concatenate tree branches...
    completeSpanningTree(_spanningTree){
        for(let i=0; i<_spanningTree.length; i++){
            let currentNode = _spanningTree[i].slice();
            // let currentAngle = _angleTree[i];
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
        // this._flat_faces is now a copy of faces with their own points at the same face ID
    }

    create2dCoordsFromFaces(){
        for(let i=0; i<this._indices_sorted.length; i++){
            let index = this._indices_sorted[i];
            let face = this._faces[index];

            let p0 = this._verts[face[0]].getCopy();
            let p1 = this._verts[face[1]].getCopy();
            let p2 = this._verts[face[face.length-1]].getCopy();

            let loc0 = p0.getCopy();
            let locX = p1.getSubtract(loc0);

            let tmp = p2.getSubtract(loc0);
            let n = locX.cross(tmp);
            let locY = n.cross(locX);

            locX.normalize();
            locY.normalize();
            let face2d = [];
            for(let i=0; i<face.length; i++){
                let p_minus_O = this._verts[face[i]].getCopy();
                p_minus_O.getSubtract(loc0);
                let t1 = locX.dot(p_minus_O);
                let t2 = locY.dot(p_minus_O);
                face2d.push([t1,t2]);
            }
            this._faces_2d[index] = face2d;
        }
    }

    layoutNet(){
        // console.log(this._dualGraph);
        // console.log(this._dualGraph_sorted);
        // console.warn(this._spanningTree);

        let sortedTree = this._spanningTree.slice();
        let root = null;
        console.warn("sortedTree", sortedTree);

        for(let i=0; i<sortedTree.length; i++){
            let branch = sortedTree[i];
            let netBranch = [];
            if(root === null) root = branch[i]; // Set root to first arbitrary face in Spanning Tree.
            let flat_tree = [];

            for(let k=0; k<branch.length; k++){
                let face = branch[k];
                let previousFace;

                if(k == 0 && face == root) {
                    // netBranch[0] = this._faces_2d[face].slice();
                    netBranch.push(this._faces_2d[face]);
                    // root = null;
                    // console.log("netBranch", netBranch);
                    continue;
                } else if (k == 0 && face !== root) {
                    // New branch and not root
                    
                    let matches = [];
                    let match = null;
                    for(let l=0; l<this._dualGraph.length; l++){
                        if(this._dualGraph[l][0] == face) matches.push(this._dualGraph[l][1]);
                        else if(this._dualGraph[l][1] == face) matches.push(this._dualGraph[l][0]);
                    }
                    // console.log("HERE", face, matches);

                    if(matches.includes(root)) previousFace = root;
                    if(matches.includes(sortedTree[i-1][0])) previousFace = sortedTree[i-1][0];
                    else {
                        // Revers back through the tree, it's like there will be a match at the end of the braches
                        for(let l=0; l<sortedTree.length; l++){
                            let searchBranch = sortedTree[l];
                            for(let m=searchBranch.length-1; m>-1; m--){
                                let searchFace = searchBranch[m];
                                if(matches.includes(searchFace) && match === null) {
                                    match = searchFace;
                                    console.log(face, "matched with", match);
                                }
                            }
                        }
                        previousFace = match;
                        if(face == 9) console.log("9 prev face:", previousFace);
                    }
                } else {
                    previousFace = branch[k-1];// || root;
                }
                // console.log("branch", branch, "face", face, "previousFace", previousFace);
                // console.log("root", root, "face", face, "previousFace", previousFace);

                let faceJoiningEdge = [];
                let prevJoiningEdge = [];
                for(let l=0; l<this._faces[face].length; l++){
                    let currentVert = this._faces[face][l];
                    // Look at every vertex in the other face...
                    for(let m=0; m<this._faces[previousFace].length; m++){
                        let otherVert = this._faces[previousFace][m];
                        if(currentVert == otherVert) {
                            faceJoiningEdge.push(l);
                            prevJoiningEdge.push(m);
                        }
                    }
                }

                // let faceMutualVertex = 0;
                // let prevMutualVertex = prevJoiningEdge.indexOf(faceJoiningEdge[faceMutualVertex]);
                // if(prevMutualVertex == -1) {
                    // prevMutualVertex = prevJoiningEdge.indexOf(faceJoiningEdge[faceMutualVertex = 1]);
                // }

                let oneeighty = false;

                let face2d = this._faces_2d[face].slice();
                let prev_face2d = netBranch[k-1] || this._faces_2d[root];

                let origin = prev_face2d[prevJoiningEdge[0]];
                let anchor = face2d[faceJoiningEdge[0]];

                let dx = face2d[faceJoiningEdge[0]][0] - face2d[faceJoiningEdge[1]][0];
                let dy = face2d[faceJoiningEdge[0]][1] - face2d[faceJoiningEdge[1]][1];

                let dxP = prev_face2d[prevJoiningEdge[0]][0] - prev_face2d[prevJoiningEdge[1]][0];
                let dyP = prev_face2d[prevJoiningEdge[0]][1] - prev_face2d[prevJoiningEdge[1]][1];

                let angle1 = Math.atan2(dy, dx);
                let angle2 = Math.atan2(dyP, dxP);

                let angle = ( angle2 - angle1);
                let degrees = (angle/Math.PI)*180;

                if(((angle1 < -1.57 && angle1 > -1.58) && (angle2 > 1.57 && angle2 < 1.58)) ||
                   ((angle2 < -1.57 && angle2 > -1.58) && (angle1 > 1.57 && angle1 < 1.58)) ||
                   ((angle1 > 3.141 && angle1 < 3.142) && (angle2 > -0.001 && angle2 < 0.001)) ||
                   ((angle2 > 3.141 && angle2 < 3.142) && (angle1 > -0.001 && angle1 < 0.001)) ||
                    (angle < 0.001 && angle > -0.001 && angle !== 0) ){
                    // 180!
                        // angle = Math.PI;
                    oneeighty = true;
                }

                let transformed_face_2d = [];
                for(let l=0; l<face2d.length; l++){
                    let vert = face2d[l];

                    let tx = face2d[l][0] - anchor[0];
                    let ty = face2d[l][1] - anchor[1];
                    let x = 0; let y = 0;
                    if(oneeighty) {
                        angle = Math.PI/2;
                        let ttx =  tx*Math.cos(angle) - ty*Math.sin(angle);
                        let tty =  tx*Math.sin(angle) + ty*Math.cos(angle);
                        x =  ttx*Math.cos(angle) - tty*Math.sin(angle);
                        y =  ttx*Math.sin(angle) + tty*Math.cos(angle);
                    } else {
                        x =  tx*Math.cos(angle) - ty*Math.sin(angle);
                        y =  tx*Math.sin(angle) + ty*Math.cos(angle);
                    }
                    x += origin[0];
                    y += origin[1];

                    transformed_face_2d.push([x,y]);
                }

                netBranch.push(transformed_face_2d);

            }
            this._net.push(netBranch);
        }
        // console.log("net", this._net);
    }
}
