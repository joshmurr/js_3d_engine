import { Vec3 } from "../math/math.js";

export default class Scene {
    constructor(_meshes, _camera, _light, _idList){
        this.meshes = _meshes;
        this.camera = _camera;
        this.light = _light;
        this.idList = _idList;
        this.backgroundAlpha = 0.8;
        this.backgroundColour = new Vec3(255,240,240);
        // console.log(this.idList);
    }


    set backgroundAlpha(a){
        this._backgroundAlpha = Math.min(Math.abs(a), 1);
    }

    set backgroundColour(v){
        this._backgroundColour = "rgba("+v.x+","+v.y+","+v.z+","+this._backgroundAlpha+")";
    }

    get backgroundColour(){
        return this._backgroundColour;
    }

    get biggestMeshSize(){
        let ret = 0;
        for(let mesh in this.meshes){
            if(this.meshes.hasOwnProperty(mesh)){
                ret = Math.max(ret, this.meshes[mesh].faces.length);
            }
        }
        return ret;
    }
}
