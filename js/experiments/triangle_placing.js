let canvas = document.createElement("canvas");
width = 512;
height = 512;
canvas.width = width;
canvas.height = height;
let body = document.getElementsByTagName("body")[0];
body.appendChild(canvas);
let ctx = canvas.getContext("2d");

ctx.fillStyle = "lightgray";
ctx.fillRect(0,0,width, height);

class Tri {
    constructor (points, joiningEdge){
        this._points = points;
        this._joiningEdge = joiningEdge;
    }
    get points(){
        return this._points;
    }
    get sides(){
        return this._points.length;
    }
    get joiningEdge(){
        return this._joiningEdge;
    }

}

let eqTri = Math.sin(Math.PI/3);

let t1 = new Tri([[-0.5,-eqTri/2],[0,eqTri/2],[0.5,-eqTri/2]], [0,1])
let t2 = new Tri([[-0.5,-eqTri/2],[0,eqTri/2],[0.5,-eqTri/2]], [2,0])
let t3 = new Tri([[-0.5,-eqTri/2],[0,eqTri/2],[0.5,-eqTri/2]], [1,2])
let scale = 0.2;
let drawTriangle = function(t, origin, anchor, angle){
    for(let currentPoint=0; currentPoint<t.sides; currentPoint++){
        let nextPoint;
        if(currentPoint == t.sides-1){
            nextPoint = 0;
        } else {
            nextPoint = currentPoint+1;
        }
        let v = t.points[currentPoint];
        let pv = t.points[nextPoint];
        if(currentPoint == t.joiningEdge[0] && nextPoint == t.joiningEdge[1]){
            ctx.strokeStyle = "red";
        } else {
            ctx.strokeStyle = "black";
        }

        let tx = v[0] - anchor[0];
        let tpx = pv[0] - anchor[0];
        let ty = v[1] - anchor[1];
        let tpy = pv[1] - anchor[1];

        let x =  tx*Math.cos(angle) - ty*Math.sin(angle);
        let y =  tx*Math.sin(angle) + ty*Math.cos(angle);
        let px = tpx*Math.cos(angle)-tpy*Math.sin(angle);
        let py = tpx*Math.sin(angle)+tpy*Math.cos(angle);

        x += origin[0];
        px += origin[0];
        y += origin[1];
        py += origin[1];

        xRange = (x + 1)*0.5;
        yRange = 1-((y + 1)*0.5);
        xScreen = xRange * width;
        yScreen = yRange * height;

        pxRange = (px + 1)*0.5;
        pyRange = 1-(py + 1)*0.5;
        pxScreen = pxRange * width;
        pyScreen = pyRange * height;

        ctx.beginPath();
        ctx.moveTo(xScreen, yScreen);
        ctx.lineTo(pxScreen, pyScreen);
        ctx.stroke();
    }
}


let updateTriangles = function (triangles){
    let origin, anchor, angle;
    for(let i=0; i<triangles.length; i++){
        let tri = triangles[i];

        if(i == 0) {
            prevTri = tri;
        } else {
            prevTri = triangles[i-1];
        }
        // console.log("origin", origin, "joiningEdge", tri.joiningEdge);
        
        // console.log("pp", prevTri.points[prevTri.joiningEdge[0]][0]);

        if(i == 0) {
            origin = [0,0];
            angle = 0;
            anchor = [0,0]
        }
        else {
            origin = prevTri.points[prevTri.joiningEdge[0]];
            angle = Math.atan2(tri.points[tri.joiningEdge[0]][1] - prevTri.points[prevTri.joiningEdge[1]][1],
                               tri.points[tri.joiningEdge[0]][0] - prevTri.points[prevTri.joiningEdge[1]][0]);
            anchor = tri.points[tri.joiningEdge[0]];
        }


        drawTriangle(tri, origin, anchor, angle);
        // ctx.fillText(String(i), origin[0]+300, origin[1]+300);
    }
}

updateTriangles([t1,t2, t3]);
// drawTriangle(t1, [0,0], 0);
// drawTriangle(t2, t1.points[t1.joiningEdge[0]], 0);

ctx.beginPath();
ctx.fillStyle = "green";
ctx.arc(width/2, height/2, 3, 0, Math.PI*2);
ctx.fill();
