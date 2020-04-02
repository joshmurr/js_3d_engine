import { Vec3 } from "./math.js";
// ERRORS -----------------------------------
var userException = function(message){
    this.message = message;
    this.name = "UserException";
}

var THROW_ERROR = function(){
    throw new userException("RANDOM ERROR");
}
// ------------------------------------------

// GLOBAL VARIABLES -------------------------
var smallNum = 0.000000001;
// ------------------------------------------

// CHECKER FUNCTIONS ------------------------
var isZero = function(x){
    return x < smallNum;
}

var areEqual = function(a, b, epsilon=smallNum){
    return (Math.abs(a-b) <= (epsilon*(Math.abs(a)+Math.abs(b)+1)));
}

var checkLength = function(k, l){
    if(k !== l) 
        throw new userException("Trying to copy Matrix of wrong length!");
}

var checkSize = function(_i, s){
    if(_i >= s) 
        throw new userException(`Matrix is of ${s}x${s} shape! Range is [0, ${s-1}].`);
}

var round = function(val, epsilon=smallNum){
    let integerPart = Math.floor(val);
    let fract = val - integerPart;
    if(1-val <= epsilon) return Math.round(val);
    else return val;
}
// ------------------------------------------
// HELPER FUNCTIONS -------------------------
var randomRGB = function(){
    return "rgb("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+")";
}
var randomVecRGB = function(){
    return new Vec3(Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255));
}
var areaForSorting = function(_points){
    // Herons Formula:
    // https://en.wikipedia.org/wiki/Heron%27s_formula
    // Although the exact area is not important to we can leave out any square-rooting.
    let numPoints = _points.length;
    if(numPoints == 4){
        let p0 = _points[0];
        let p1 = _points[1];
        let p2 = _points[2];
        let p3 = _points[3];

        let a = p1.getSubtract(p0);
        let b = p2.getSubtract(p1);
        let c = p0.getSubtract(p2);
        a = a.lengthSquared;
        b = b.lengthSquared;
        c = c.lengthSquared;
        // let area1 = 0.25 * Math.sqrt((a + b + c) * (-a + b + c) * (a - b + c) * (a + b - c));
        let area1 = ((a + b + c) * (-a + b + c) * (a - b + c) * (a + b - c));
        let d = p3.getSubtract(p2);
        let e = p0.getSubtract(p3);
        // let area2 = 0.25 * Math.sqrt((d + e + c) * (-d + e + c) * (d - e + c) * (d + e - c));
        let area2 = ((d + e + c) * (-d + e + c) * (d - e + c) * (d + e - c));
        return area1+area2;
    } else {
        let p0 = _points[0];
        let p1 = _points[1];
        let p2 = _points[2];
        let a = p1.getSubtract(p0);
        let b = p2.getSubtract(p1);
        let c = p0.getSubtract(p2);
        a = a.lengthSquared;
        b = b.lengthSquared;
        c = c.lengthSquared;
        // return 0.25 * Math.sqrt((a + b + c) * (-a + b + c) * (a - b + c) * (a + b - c));
        return ((a + b + c) * (-a + b + c) * (a - b + c) * (a + b - c));
    }
}

var checkTriangle = function(a, b, c){
    return (a+b>c && a+c>b && b+c>a);
}

var heightOfTriangle = function(a, b, c){
    console.log(a, b, c);
    return /*0.5 * Math.sqrt*/((a + b + c) * (-a + b + c) * (a - b + c) * (a + b - c)) / b;
}
var distance = function(p0, p1){
    let d = p0.getSubtract(p1);
    return d.lengthSquared;
}
var midpoint = function(p0, p1){
    return new Vec3((p0.x+p1.x)/2, (p0.y+p1.y)/2, (p0.z+p1.z)/2, (p0.w+p1.w)/2);
}
// ------------------------------------------

export { userException, smallNum, isZero, areEqual, checkLength, checkSize, round, randomVecRGB, areaForSorting, distance, midpoint, heightOfTriangle, checkTriangle };
