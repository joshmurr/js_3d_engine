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
// ------------------------------------------

export { userException, smallNum, isZero, areEqual, checkLength, checkSize, round, randomVecRGB };
