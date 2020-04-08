import { randomVecRGB } from  '../math/utils.js'
import { Vec3, Vec4, Mat33, Mat44 } from  '../math/math.js'

export default class Renderer{
    ctx = null;
    w = 0;
    h = 0;
    guiValues = {};
    guiValuesRESET = {};
    _projectionMat = null;
    _viewMat = null;
    _MVP = null;
    _faceColourArray = null;
    _wireframePoints = null;
    _transformedVerts = [];
    _minX = 0;
    _minY = 0;
    constructor(scene, _width, _height){
        this.scene = scene;
        this.findGUIElements(scene.idList);
        this.createCanvas(_width, _height);
    }


    createPerspectiveProjectionMatrix(_FOV, _aspect, _near, _far){
        /*
         *  https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix
         *
         *  projMat = [ d/a 0    0      0
         *               0  d    0      0
         *               0  0   f/f-n  -1
         *               0  0 -nf/f-n   0 ]
         *
         */

        let scale = 1 / Math.tan((_FOV/2) * (Math.PI/180));

        let projMat = new Mat44();
        projMat.M[0]  = scale;
        projMat.M[1]  = 0;
        projMat.M[2]  = 0;
        projMat.M[3] = 0;
        projMat.M[4]  = 0;
        projMat.M[5]  = scale;
        projMat.M[6]  = 0;
        projMat.M[7] = 0;
        projMat.M[8]  = 0;
        projMat.M[9]  = 0;
        projMat.M[10] = _far / (_far - _near);
        projMat.M[11] = _near*_far / (_far - _near);
        projMat.M[12]  = 0;
        projMat.M[13]  = 0;
        projMat.M[14] = -1;
        projMat.M[15] = 0;

        return projMat;
    }

    createOpenGLPerspectiveProjectionMatrix(_FOV, _aspect, _near, _far){
        /*
         *  https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix
         *
         *  projMat = [ 2n/r-l   0     r+l/r-l     0
         *                 0   2n/t-b  t+b/t-b     0
         *                 0     0    -f+n/f-n -2nf/f-n
         *                 0     0       -1        0     ]
         *
         */

        let scale = _near * Math.tan((_FOV/2) * (Math.PI/180));
        let right = _aspect * scale;
        let left  = -right;
        let top_  = scale; // 'top' is a keyword apparently
        let bottom = -top_;

        let projMat = new Mat44();
        projMat.M[0]  = 2*_near/(right-left);
        projMat.M[1]  = 0;
        projMat.M[2]  = 0;
        projMat.M[3] = 0;
        projMat.M[4]  = 0;
        projMat.M[5]  = 2*_near/(top_-bottom);
        projMat.M[6]  = 0;
        projMat.M[7] = 0;
        projMat.M[8]  = (right+left)/(right-left);
        projMat.M[9]  = (top_+bottom)/(top_-bottom);
        projMat.M[10] = -(_far+_near) / (_far - _near);
        projMat.M[11] = -2*_near*_far / (_far - _near);
        projMat.M[12]  = 0;
        projMat.M[13]  = 0;
        projMat.M[14] = -1;
        projMat.M[15] = 0;

        return projMat;
    }

    createOpenGLOrthographicProjectionMatrix(_near, _far){
        /*
         * https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix/orthographic-projection-matrix
         *
         *  projMat = [ 2/r-l   0      0    -(r+l/r-l)
         *                0   2/t-b    0    -(t+b/t-b)
         *                0     0   -2/f-n   -f+n/f-n
         *                0     0      0         1       ]
         *
         */

        // b t l r near far all computed differently to Perspective Matrix...

        // let scale = _near * Math.tan((_FOV/2) * (Math.PI/180));
        // let right = _aspect * scale;
        // let left  = -right;
        // let top_  = scale; // 'top' is a keyword apparently
        // let bottom = -top_;

        let projMat = new Mat44();
        projMat.M[0]  = 2/(right-left);
        projMat.M[1]  = 0;
        projMat.M[2]  = 0;
        projMat.M[3] = 0;
        projMat.M[4]  = 0;
        projMat.M[5]  = 2/(top_-bottom);
        projMat.M[6]  = 0;
        projMat.M[7] = 0;
        projMat.M[8]  = 0;
        projMat.M[9]  = 0;
        projMat.M[10] = -2 / (_far - _near);
        projMat.M[11] = 0;
        projMat.M[12]  = -(right+left)/(right-left);
        projMat.M[13]  = -(top_+bottom)/(top_-bottom);
        projMat.M[14] = -(_far+_near)/(_far-_near);
        projMat.M[15] = 1;

        return projMat;
    }

    createViewMatrix(_camera, _target=new Vec3(0,0,0), _up=new Vec3(0,1,0)){
        /*
         * OpenGl Style (-dir):
         * viewMat = [   ^  ^    ^   ^
         *             side up -dir pos ]
         *
         */

        let forward = _target.getSubtract(_camera); // Vec3
        forward.normalize();
        let side = forward.cross(_up); // Vec3
        side.normalize();
        let up = side.cross(forward); // Vec3
        up.normalize();
        let viewMat = new Mat44();
        viewMat.setMat([
            side.x,     up.x,       forward.x, 0,
            side.y,     up.y,       forward.y, 0,
            side.z,     up.z,       forward.z, 0,
            -side.dot(_camera), -up.dot(_camera), forward.dot(_camera), 1
        ]);

        return viewMat;
    }

    simpleRender(){
        // Renders without calculating view or perspective matrices.
        // Assumes Mesh is at origin.
        // Calculates perspective based on -z value.
        for(let i=0; i<this.scene.meshes.verts.length; i++){
            let v = this.scene.meshes.verts[i].getCopy();;
            v.z -= 2;

            v = v.getNDC();
            v.multiply(100);

            let xNorm = (v.x + (this.width/2)) / this.width;
            let yNorm = (v.y + (this.height/2)) / this.height;
            let xScreen = xNorm * this.width;
            let yScreen = yNorm * this.height;
            // console.log([xScreen, yScreen]);

            this.ctx.fillStyle="black";
            this.ctx.fillRect(xScreen, yScreen, 2, 2);
        }

    }

    createSimpleProjectionMatrix(_scaleFactor){
        let projMat = new Mat44();
        projMat.setIdentity();
        projMat.M[14] = _scaleFactor;
        projMat.M[15] = _scaleFactor;
        return projMat;
    }

    setup(){
        this._projectionMat = this.createOpenGLPerspectiveProjectionMatrix(90, this.width/this.height, 0.1, 100);
        // let projectionMat = this.createOpenGLOrthographicProjectionMatrix(90, this.width/this.height, 0.1, 100);
        this._viewMat = this.createViewMatrix(this.scene.camera);

        // ModelViewProjection
        this._MVP = new Mat44();
        this._MVP.setIdentity();

        // ViewProjection (for drawing centroid numbers)
        this._VP = new Mat44();

        let maxArraySize = this.scene.biggestMeshSize*3;
        // faceColourArray = // [ R G B
        //                        R G B
        //                        R G B
        //                        ...   ]
        this._faceColourArray = new Array(maxArraySize);
        // wireframePoints = [ [X, Y], [X, Y], [X, Y],
        //                     [X, Y], [X, Y], [X, Y],
        //                     [X, Y], [X, Y], [X, Y],
        //                     ...                     ]
        this._wireframePoints =  new Array(maxArraySize); // Number of indices * 3 for P0 P1 P2
    }

    initMVP(){

    }

    lookAtNextFace(){
        let mesh = this.scene.meshes[this.guiValues["mesh"]];
        let centroid = mesh.centroids


    }



    render(){
        // console.log(this.scene.meshes[this.guiValues["mesh"]]);
        let mesh = this.scene.meshes[this.guiValues["mesh"]];
        // I don't know why I need to update these every frame, but it doesn't work if I dont...
        this._MVP.multiplyMat(this._projectionMat);
        this._MVP.multiplyMat(this._viewMat);
        this._VP.copy(this._MVP); // ViewProjection
        this._MVP.multiplyMat(mesh.getModelMatrix(this.guiValues));

        // Background ----------------------------------
        this.ctx.fillStyle = this.scene.backgroundColour;
        this.ctx.fillRect(0, 0, this.width, this.height);
        // ---------------------------------------------

        let xScreen, yScreen;
        let xRange, yRange, zRange;
        let dir;

        // RENDER: --------------------------------------------------------
        // Transform verts ----------------------------
        this._transformedVerts = []; // Clear to remove excess points from a larger shape
        for(let i=0; i<mesh.verts.length; i++){
            let v = this._MVP.getMultiplyVec(mesh.verts[i]);
            this._transformedVerts[i] = v;
        }
        // --------------------------------------------

        let sorted_indices = mesh.sorted_indices; // !!! It's important to call mesh.sorted_indices onces per frame !!!
        for(let i=0; i<sorted_indices.length; i++){
            // Get face from sorted list
            let face = mesh.faces[sorted_indices[i]];
            let faceSize = face.length;

            let transformedNormal;


            // Update Normals and calculate colours ---------------------------------------
            if(mesh.NORMS_ARE_CALCULATED /*&& (this.guiValues["normals"]%2!==0 || this.guiValues["colour"]%2!==0)*/){
                // let faceButton = document.getElementById("face");
                // faceButton.value = 1;
                // faceButton.classList.toggle("selected", true);
                let norm = mesh.norms[sorted_indices[i]];
                let normalTransformMatrix = this._MVP.getAffineInverse();
                normalTransformMatrix.transpose();
                transformedNormal = normalTransformMatrix.getMultiplyVec(norm);
                dir = transformedNormal.dot(new Vec4(0,0,-1000)); // Dot with vec way behind mesh
                let diffuse = Math.max(0, Math.abs(transformedNormal.dot(this.scene.light)));

                if(mesh.colour && this.guiValues["colour"]%2!==0){
                    // If mesh has a colour and colours are turned on and normals are on
                    this._faceColourArray[sorted_indices[i]*3] = Math.floor(diffuse*mesh.colour.x);
                    this._faceColourArray[1+sorted_indices[i]*3] = Math.floor(diffuse*mesh.colour.y);
                    this._faceColourArray[2+sorted_indices[i]*3] = Math.floor(diffuse*mesh.colour.z);
                } else {
                    // If mesh has a colour but colours are turned off
                    this._faceColourArray[sorted_indices[i]*3] = Math.floor(transformedNormal.x*255);
                    this._faceColourArray[1+sorted_indices[i]*3] = Math.floor(transformedNormal.y*255);
                    this._faceColourArray[2+sorted_indices[i]*3] = Math.floor(transformedNormal.z*255);
                }

            } else {
                // Mesh has no colour and normals are not calculated
                this._faceColourArray[sorted_indices[i]*3] = Math.floor(xRange*255);
                this._faceColourArray[1+sorted_indices[i]*3] = Math.floor(yRange*255);
                this._faceColourArray[2+sorted_indices[i]*3] = Math.floor(zRange*255);
            }
            // ----------------------------------------------------------------------------

            for(let j=0; j<face.length; j++){
                // Get vert and apply MVP transformation
                let v = this._transformedVerts[face[j]];
                v.NDC();

                xRange = (v.x + 1) * 0.5;
                yRange = 1-(v.y + 1) * 0.5;
                zRange  = (v.z + 1)*0.5;
                // Store screen coords in an array ----------------------------------------
                // This might not be the best way to do this, but I found it to be a way to
                // give the seperate rendering styles access to the same coordinates without
                // re-calculating them. Storing it the 'old fashioned way':
                //      **  ([rowIndex * numberOfColumns + columnIndex])  **
                // means writing directly over the same memory every frame so it should be
                // quicker. I'm assuming Javascript works like this any way.
                xScreen = xRange * this.width;
                yScreen = yRange * this.height;
                this._wireframePoints[j+sorted_indices[i]*3] = [xScreen, yScreen];

            }
            // Face -------------------------*---
            if(this.guiValues["face"]%2!==0){
                this.ctx.beginPath();

                let alpha = 0.6;
                if(this.guiValues["colour"]%2!==0 || this.guiValues["normals"]%2!==0) alpha = 1.0;
                this.ctx.fillStyle="rgba("+
                    this._faceColourArray[sorted_indices[i]*3]+","+    // R
                    this._faceColourArray[1+sorted_indices[i]*3]+","+  // G
                    this._faceColourArray[2+sorted_indices[i]*3]+","+   // B
                    alpha+")";                                         // A

                for(let j=0; j<face.length; j++){
                    this.ctx.lineTo(this._wireframePoints[j+sorted_indices[i]*3][0], this._wireframePoints[j+sorted_indices[i]*3][1]);
                }
                this.ctx.closePath();
                this.ctx.fill();
            }
            // Face -------------------------*---

            // Wireframe --------------------**--
            if(this.guiValues["wireframe"]%2!==0){
                this.ctx.lineCap = "round";
                this.ctx.lineWidth = 2;
                if(dir > 0.5){
                    this.ctx.strokeStyle = "rgba(0,128,255,0.5)";
                } else {
                    this.ctx.strokeStyle = "rgb(0,255,128)";
                }
                for(let j=0; j<face.length; j++){
                    if(j == face.length-1){
                        this.ctx.beginPath();
                        this.ctx.moveTo(this._wireframePoints[sorted_indices[i]*3][0], this._wireframePoints[sorted_indices[i]*3][1]);
                        this.ctx.lineTo(this._wireframePoints[j+sorted_indices[i]*3][0], this._wireframePoints[j+sorted_indices[i]*3][1]);
                        this.ctx.stroke();
                    } else {
                        this.ctx.beginPath();
                        this.ctx.moveTo(this._wireframePoints[j+sorted_indices[i]*3][0], this._wireframePoints[j+sorted_indices[i]*3][1]);
                        this.ctx.lineTo(this._wireframePoints[j+1+sorted_indices[i]*3][0], this._wireframePoints[j+1+sorted_indices[i]*3][1]);
                        this.ctx.stroke();
                    }
                }
            }
            // Wireframe --------------------**--


            // Calculate centroid position for all the following calculations:
            let centroid = this._VP.getMultiplyVec(mesh.centroids[sorted_indices[i]]);
            centroid.NDC();
            xRange = (centroid.x + 1)*0.5;
            yRange = 1-(centroid.y + 1)*0.5;
            zRange = (centroid.z + 1)*0.5;
            xScreen = xRange * this.width;
            yScreen = yRange * this.height;

            // Centroid Numbers -------------**--
            if(this.guiValues["faceid"]%2!==0){
                // Only multiply by the ViewProjection matrix as the centroid already to the model
                // matrix manipulation applied.
                this.ctx.fillStyle="rgb("+Math.floor(xRange*128)+127+","+Math.floor(yRange*128)+127+","+Math.floor(zRange*128)+127+")";
                this.ctx.font = String(Math.floor(zRange * 5) + "px Roboto Mono");
                this.ctx.fillText(sorted_indices[i], xScreen, yScreen);
            }
            // Centroid Numbers -------------**--

            // Face Normal Lines ------------**--
            if(this.guiValues["facenormallines"] && this.guiValues["facenormallines"]%2!==0){
                // Only multiply by the ViewProjection matrix as the centroid already to the model
                // matrix manipulation applied.
                let normCoord = transformedNormal.getMultiply(0.1);
                normCoord.add(centroid);
                let normScreenX = this.width * (normCoord.x+1)*0.5;
                let normScreenY = this.height * (1-(normCoord.y + 1)*0.5);

                this.ctx.strokeStyle="pink";

                this.ctx.beginPath();
                this.ctx.moveTo(xScreen, yScreen);
                this.ctx.lineTo(normScreenX, normScreenY);
                this.ctx.stroke();
            }
            // Face Normal Lines ------------**--
        }
        // VERT-BY-VERT RENDERING ------------------------------------*---
        // Points -----------------------*---
        let meshCentroid = this._VP.getMultiplyVec(mesh.meshCentroid);
        meshCentroid.NDC();
        if(this.guiValues["points"]%2!==0){
            for(let i=0; i<this._transformedVerts.length; i++){
                // Get centroid
                let p = this._transformedVerts[i];
                // let z = p.w;
                p.NDC();
                xRange = (p.x + 1)*0.5;
                yRange = 1-(p.y + 1)*0.5;
                zRange  = (p.z + 1)*0.5;
                xScreen = xRange * this.width;
                yScreen = yRange * this.height;
                if(p.z < meshCentroid.z) this.ctx.fillStyle = "rgba(255,0,64,0.8)";
                else this.ctx.fillStyle = "rgba(255,64,0,0.5)";
                this.ctx.beginPath();
                this.ctx.arc(xScreen, yScreen, 2*zRange, 0, Math.PI*2);
                this.ctx.closePath();
                this.ctx.fill();
            }
        }
        // Points -----------------------*---
        // Vert Numbers -----------------*---
        if(this.guiValues["vertnumbers"] && this.guiValues["vertnumbers"]%2!==0){
            for(let i=0; i<this._transformedVerts.length; i++){
                // Get centroid
                let p = this._transformedVerts[i];
                // let z = p.w;
                p.NDC();
                xRange = (p.x + 1)*0.5;
                yRange = 1-(p.y + 1)*0.5;
                zRange  = (p.z + 1)*0.5;
                xScreen = xRange * this.width;
                yScreen = yRange * this.height;
                if(p.z > meshCentroid.z) this.ctx.fillStyle = "rgba(255,0,0,0.4)";
                else this.ctx.fillStyle = "rgba(255,0,0,1)";
                // this.ctx.fillStyle="rgb("+Math.floor(xRange*128)+127+","+Math.floor(yRange*128)+127+","+Math.floor(zRange*128)+127+")";
                this.ctx.font = String(Math.floor(zRange * 5) + "px Roboto Mono");
                this.ctx.fillText(i, xScreen, yScreen);
            }
        }
        // Vert Numbers -----------------*---

        // Dual Graph -------------------**--
        if(this.guiValues["dualgraph"]%2!==0){
            for(let i=0; i<mesh.dualGraph.length; i++){
                let A = this._VP.getMultiplyVec(mesh.centroids[mesh.dualGraph[i][0]]);
                let B = this._VP.getMultiplyVec(mesh.centroids[mesh.dualGraph[i][1]]);
                A.NDC();
                B.NDC();
                xRange = (A.x + 1)*0.5;
                yRange = 1-(A.y + 1)*0.5;
                zRange = (A.z + 1)*0.5;
                xScreen = xRange * this.width;
                yScreen = yRange * this.height;
                let bxRange = (B.x + 1)*0.5;
                let byRange = 1-(B.y + 1)*0.5;
                let bzRange = (B.z + 1)*0.5;
                let bxScreen = bxRange * this.width;
                let byScreen = byRange * this.height;
                this.ctx.beginPath();
                this.ctx.strokeStyle="rgb(0,255,0)";
                this.ctx.moveTo(xScreen, yScreen);
                this.ctx.lineTo(bxScreen, byScreen);
                this.ctx.stroke();
            }
        }
        // Dual Graph -------------------**--

        // Spanning Tree ----------------**--
        if(this.guiValues["spanningtree"]%2!==0){
            for(let i=0; i<mesh.spanningTree.length; i++){
                let branch = mesh.spanningTree[i];
                this.ctx.beginPath();
                this.ctx.strokeStyle="rgb("+Math.floor((i/mesh.spanningTree.length)*255)+",0,"+Math.floor((1-(i/mesh.spanningTree.length))*255)+")";
                for(let j=0; j<branch.length; j++){
                    let centroid = this._VP.getMultiplyVec(mesh.centroids[branch[j]]);
                    centroid.NDC();
                    xRange = (centroid.x + 1)*0.5;
                    yRange = 1-(centroid.y + 1)*0.5;
                    zRange = (centroid.z + 1)*0.5;
                    xScreen = xRange * this.width;
                    yScreen = yRange * this.height;
                    this.ctx.lineWidth = 2;
                    this.ctx.lineTo(xScreen, yScreen);
                }
                this.ctx.stroke();
            }
        }
        // Spanning Tree ----------------**--

        if(this.guiValues["shownet"]%2!==0){
            let minX = (mesh.min2dCoords[0]);
            let minY = (mesh.min2dCoords[1]);
            let maxX = (mesh.max2dCoords[0]);
            let maxY = (mesh.max2dCoords[1]);
            let diffX = maxX - minX;
            let diffY = maxY - minY;

            let ratio = (diffX/diffY);
            let scale = (diffX/this.width)*(this.width/0.05);

            let xOffset = 250;
            let yOffset = 50;

            let alpha = 0.5;

            this.ctx.fillStyle = "rgba(255,255,255,0.5)";
            this.ctx.fillRect(xOffset, yOffset, (diffX/ratio)*scale, (diffY/ratio)*scale);
            for(let i=0; i<mesh._transformed_flat_faces.length; i++){
                let face = mesh._transformed_flat_faces[i];
                if(face === undefined) {
                    // console.error("Face missing at i=" + i);
                    continue;
                }
                this.ctx.beginPath();
                this.ctx.lineWidth = 1;
                let xSum = 0;
                let ySum = 0;
                for(let k=0; k<face.length; k++){
                    let screen = face[k];

                    let x = screen[0];
                    let y = screen[1];

                    xRange = (x + Math.abs(minX))/ratio;
                    yRange = (y + Math.abs(minY))/ratio;
                    xScreen = xRange * scale;
                    yScreen = yRange * scale;


                    xScreen += xOffset;
                    yScreen += yOffset;
                    xSum += xScreen;
                    ySum += yScreen;
                    // xScreen += Math.abs(mesh.min2dCoords[0]);
                    // yScreen += Math.abs(mesh.min2dCoords[1]);
                    this.ctx.lineTo(xScreen, yScreen);
                }
                this.ctx.strokeStyle = "rgb(0,"+Math.floor((i/mesh._transformed_flat_faces.length)*255)+",0)";
                this.ctx.closePath();
                this.ctx.stroke();
                // this.ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
                if(this.guiValues["colour"]%2!==0 || this.guiValues["normals"]%2!==0) alpha = 1.0;
                this.ctx.fillStyle="rgba("+
                    this._faceColourArray[i]+","+    // R
                    this._faceColourArray[1+i*3]+","+  // G
                    this._faceColourArray[2+i*3]+","+   // B
                    alpha+")";                                         // A
                this.ctx.fill();
                this.ctx.fillStyle = "rgb(0,"+Math.floor((i/mesh._transformed_flat_faces.length)*255)+",0)";
                this.ctx.fillText(i, (xSum/face.length), (ySum/face.length));
            }
        }


        // END OF MAIN RENDER LOOP ----------------------------------*****-
        if(this.guiValues["reset"]){
            for(let guiElem in this.guiValues){
                if(guiElem !== "mesh"){ // Don't reset the mesh
                    let ele = document.getElementById(guiElem);
                    ele.value = this.guiValuesRESET[guiElem];
                }
            }
        }
        this._MVP.setIdentity();
        this.updateGUIValues();
        // ----------------------------------------------------------*****-
    }

    createCanvas(_width=window.innerWidth, _height=window.innerHeight){
        if(document.getElementsByName("canvas").length == 1){
            console.log("Canvas found");
        } else {
            let canvas = document.createElement("canvas");
            this.width = _width;
            this.height = _height;
            canvas.width = this.width;
            canvas.height = this.height;
            let body = document.getElementsByTagName("body")[0];
            body.appendChild(canvas);

            this.ctx = canvas.getContext("2d");
            this.ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
            this.ctx.fillRect(100, 100, 200, 200);
            this.ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
            this.ctx.fillRect(150, 150, 200, 200);
            this.ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
            this.ctx.fillRect(200, 50, 200, 200);

            this.ctx.fillStyle = "rgba(255, 0, 255, 0.5)";
            this.ctx.fillRect(this.width-5, this.height-5, 5, 5);
            this.ctx.fillStyle = "rgba(255, 0, 255, 0.5)";
            this.ctx.fillRect(0, 0, 5, 5);
        }
    }

    updateCanvas(_width=window.innerWidth, _height=window.innerHeight){
        let canvas = document.querySelector("canvas");
        this.width = _width;
        this.height = _height;
        canvas.width = this.width;
        canvas.height = this.height;
        // this.ctx = canvas.getContext("2d");
        this.setup();
    }

    findGUIElements(_idList){
        for(let i=0; i<_idList.length; i++){
            let ele = document.getElementById(_idList[i]);
            if(ele.type == "submit") { // button
                this.guiValues[_idList[i]] = parseInt(ele.value);
                this.guiValuesRESET[_idList[i]] = parseInt(ele.value);
            }
            if(ele.type == "range") { // slider
                this.guiValues[_idList[i]] = parseFloat(ele.value);
                this.guiValuesRESET[_idList[i]] = parseFloat(ele.value);
            }
            if(ele.type == "select-one"){ // dropdown
                this.guiValues[_idList[i]] = ele.options[ele.selectedIndex].value;
                this.guiValuesRESET[_idList[i]] = ele.options[ele.selectedIndex].value;
            }
        }
        // console.log(this.guiValues);
    }

    updateGUIValues(){
        for(let guiElem in this.guiValues){
            if(this.guiValues.hasOwnProperty(guiElem)){
                let ele = document.getElementById(guiElem);
                if(ele.type == "submit") {
                    this.guiValues[guiElem] = parseInt(ele.value);
                    if(ele.id == "resetColours" && this.guiValues[guiElem]%2!==0){
                        for(let mesh in this.scene.meshes){
                            if(this.scene.meshes.hasOwnProperty(mesh)){
                                this.scene.meshes[mesh].colour = randomVecRGB();
                                ele.classList.toggle("selected", false);
                                ele.value = 0;
                            }
                        }
                    }
                }
                if(ele.type == "range") this.guiValues[guiElem] = parseFloat(ele.value);
                if(ele.type == "select-one"){
                    this.guiValues[guiElem] = ele.options[ele.selectedIndex].value;
                }
            }
        }
    }
}
