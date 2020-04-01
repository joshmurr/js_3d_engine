export default class Scene {
    constructor(_meshes, _camera, _light, _idList){
        this.meshes = _meshes;
        this.camera = _camera;
        this.light = _light;
        this.idList = _idList;
        // console.log(this.idList);
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
