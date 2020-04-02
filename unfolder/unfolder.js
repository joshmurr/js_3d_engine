import { randomVecRGB } from '../js/math/utils.js';
import { Vec3 } from '../js/math/math.js';

import GUI from '../js/gui/gui.js';

import Renderer from '../js/render/renderer.js';
import Scene from '../js/scene/scene.js';

import { Icosahedron, Octahedron, Cube } from '../js/mesh/platonicSolids.js';
import { Torus } from '../js/mesh/parametricSolid.js';
import { IrregularOctahedron } from '../js/mesh/miscSolid.js';

let icosahedron = new Icosahedron();
let octahedron = new Octahedron();
let cube = new Cube();
let irregularOctahedron = new IrregularOctahedron();
let torus = new Torus(8,8, 0, Math.PI*2, 0, Math.PI*2, 1.2, 0.4);

torus.createVerts();
torus.createFaces();


let meshes = {
    "Irregular Octahedron": irregularOctahedron,
    // "Icosahedron": icosahedron,
    // "Octahedron": octahedron,
    "Cube": cube,
    // "Torus": torus,
};

let gui = new GUI();
gui.menu();
gui.title("Unfolder");
gui.title("Drawing Style");
gui.button("colour", "Colour", 0);
gui.button("normals", "Face Normals", 0);
gui.button("points", "Points", 0);
// gui.button("midpoints", "Line Midpoints", 1);
gui.button("wireframe", "Wireframe", 0);
gui.button("face", "Faces", 1);
gui.button("facenormallines", "Face Normal Lines", 0);
gui.button("numbers", "Face ID", 1);
gui.button("vertnumbers", "Vert ID", 0);
gui.button("dualgraph", "Dual Graph", 0);
gui.button("spanningtree", "Spanning Tree", 1);
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
// gui.button("recalcnorms", "Recalculate Normals", 0);
gui.button("reset", "Reset", 0);
gui.dropdown("mesh", Object.keys(meshes));//.map(m => m.charAt(0).toUpperCase()+m.slice(1)));
gui.button("resetColours", "Reset Colours", 0);

let camera = new Vec3(0,0,-15);
let light = new Vec3(-100,-100,100);
light.normalize();
let scene = new Scene(meshes, camera, light, gui.getIdList());
scene.backgroundColour = new Vec3(220, 240, 255);

let renderer = new Renderer(scene);
renderer.setup();

// Setup meshes
for(let mesh in meshes){
    meshes[mesh].computeFaceNormals();
    meshes[mesh].colour = randomVecRGB();
    meshes[mesh].sortIndicesByCentroid();
    meshes[mesh].createDualGraph();
    meshes[mesh].createSpanningTree();
}

// irregularOctahedron.sortDualGraphByAngleBetweenFaces();
// icosahedron.sortDualGraphByAngleBetweenFaces();

// octahedron.createSpanningTree();
// console.log(icosahedron.dualGraph);
// icosahedron.createSpanningTree();
// irregularOctahedron.createSpanningTree();
irregularOctahedron.flatten();
// cube.flatten();

function draw(){
    renderer.render();
    requestAnimationFrame(draw);
}
draw();
