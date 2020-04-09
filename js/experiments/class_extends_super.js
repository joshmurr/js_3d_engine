class Vec2 {
    constructor(_x, _y){
        this.x = _x;
        this.y = _y;
    }

    get sum(){
        return this.x+this.y;
    }

    printWords(){
        console.log("words");
    }
}

class Vec3 extends Vec2{
    constructor(_x, _y, _z){
        super(_x, _y);
        this.z = _z;
    }

    get sum(){
        return super.sum + this.z;
    }
}

let v2 = new Vec2(2, 3);
console.log(v2.sum);

let v3 = new Vec3(2, 3, 4);
console.log(v3.sum);

v3.printWords();
