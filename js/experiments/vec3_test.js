import Mat44 from '../math/mat44.js';
import Vec3 from '../math/vec3.js';

let camera = new Vec3(0, 0, 10);
let up = new Vec3(0, 1, 0);
let target = new Vec3(0, 0, 0);


function createViewMatrix(_camera, _target, _up){
    let forward = _target.getSubtract(_camera); // Vec3
    forward.printProps();
    forward.normalize();
    let side = forward.cross(_up); // Vec3
    side.printProps();
    side.normalize();
    let up = side.cross(forward); // Vec3
    up.printProps();
    let viewMat = new Mat44();

    viewMat.setMat([
        side.x,             side.y,           side.z,               0,
        up.x,               up.y,             up.z,                 0,
        -forward.x,         -forward.y,       -forward.z,           0,
        // -side.dot(_camera), -up.dot(_camera), forward.dot(_camera), 1
        _camera.x, _camera.y, _camera. z, 1
    ]);

    return viewMat;
}

let viewMat = createViewMatrix(camera, target, up);

viewMat.printProps();
