import { randomVecRGB } from '../js/math/utils.js';
import { Vec3 } from '../js/math/math.js';

import GUI from '../js/gui/gui.js';

import Renderer from '../js/render/renderer.js';
import Scene from '../js/scene/scene.js';

import { Icosahedron, Octahedron, Tetrahedron, Cube } from '../js/mesh/platonicSolids.js';
import { Torus, KleinBottle, MobiusTube, SineSurface, EightSurface, HyperbolicOctahedron, CrossCap } from '../js/mesh/parametricSolid.js';
import { Teapot2 } from '../js/mesh/miscSolid.js';

let icosahedron = new Icosahedron();
let octahedron = new Octahedron();
let tetrahedron = new Tetrahedron();
let cube = new Cube();
let teapot2 = new Teapot2();
let torus = new Torus(16, 16, 0, Math.PI*2, 0, Math.PI*2, 2, 1);
let klein = new KleinBottle(16, 32, 0, Math.PI*2, 0, Math.PI*2);
let mobiusTube = new MobiusTube(16, 16, 0, Math.PI*2, 0, Math.PI*2, 1, 2);
let sineSurface = new SineSurface(32, 32, 0, Math.PI*2, 0, Math.PI*2, 1);
let eightSurface = new EightSurface(32, 32, 0, Math.PI*2, -Math.PI/2, Math.PI/2);
let hyperbolicOctahedron = new HyperbolicOctahedron(32, 32, -Math.PI/2, Math.PI/2, -Math.PI, Math.PI);
let crossCap = new CrossCap(16, 16, 0, Math.PI*2, 0, Math.PI/2);
torus.createVerts();
torus.createFaces();

klein.createVerts();
klein.createFaces();

mobiusTube.createVerts();
mobiusTube.createFaces();

sineSurface.createVerts();
sineSurface.createFaces();

eightSurface.createVerts();
eightSurface.createFaces();

hyperbolicOctahedron.createVerts();
hyperbolicOctahedron.createFaces();

crossCap.createVerts();
crossCap.createFaces();

teapot2.createFaces(); // This is a special case to re-format the indices taken from a .OBJ file


let meshes = {
    "Icosahedron": icosahedron,
    "Octahedron" : octahedron,
    "Tetrahedron": tetrahedron,
    "Cube": cube,
    "Torus": torus,
    "Sine Surface": sineSurface,
    "Cross Cap": crossCap,
    "Mobius Tube": mobiusTube,
    "Hyperbolic Octahedron": hyperbolicOctahedron,
    "Eight Surface": eightSurface,
    "Klein": klein,
    "Teapot": teapot2,
};

let gui = new GUI();
gui.menu();
gui.title("Simple Demo");
gui.title("Drawing Style");
gui.button("colour", "Colour", 0);
gui.button("normals", "Face Normals", 0);
gui.button("points", "Points", 0);
gui.button("wireframe", "Wireframe", 0);
gui.button("face", "Faces", 1);
gui.button("faceid", "Face ID", 0);
gui.title("Translation");
gui.slider("xTrans",-9,10, 0, 0.1);
gui.slider("yTrans",-9,10, 0, 0.1);
gui.slider("zTrans",-9,10, 0, 0.1);
gui.title("Rotation");
gui.slider("xRot",-Math.PI, Math.PI, 0, 0.1);
gui.slider("yRot",-Math.PI, Math.PI, 0, 0.1);
gui.slider("zRot",-Math.PI, Math.PI, 0, 0.1);
gui.title("Scale");
gui.slider("xScale",0.2, 4, 1.2, 0.2);
gui.slider("yScale",0.2, 4, 1.2, 0.2);
gui.slider("zScale",0.2, 4, 1.2, 0.2);
gui.button("reset", "Reset", 0);
gui.dropdown("mesh", Object.keys(meshes));//.map(m => m.charAt(0).toUpperCase()+m.slice(1)));
gui.button("resetColours", "Reset Colours", 0);

let camera = new Vec3(0,0,-15);
let light = new Vec3(-100,-100,100);
light.normalize();
let scene = new Scene(meshes, camera, light, gui.getIdList());

let renderer = new Renderer(scene);
renderer.setup();

// Setup meshes
for(let mesh in meshes){
    meshes[mesh].computeFaceNormals();
    meshes[mesh].colour = randomVecRGB();
    meshes[mesh].sortIndicesByCentroid();
}

function draw(){
    renderer.render();
    requestAnimationFrame(draw);
}
draw();
