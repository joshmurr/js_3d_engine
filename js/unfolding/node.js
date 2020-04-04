export class Node {
    _children;
    constructor(_id){
        this._id = _id;
        this._verts;
    }
    get id(){
        return this.id;
    }
    get children(){
        return this._children;
    }
}
