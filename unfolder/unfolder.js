import { randomVecRGB } from '../js/math/utils.js';
import { Vec3 } from '../js/math/math.js';

import GUI from '../js/gui/gui.js';

import Renderer from '../js/render/renderer.js';
import Scene from '../js/scene/scene.js';

import { Icosahedron, Octahedron, Cube } from '../js/mesh/platonicSolids.js';
import { Sphere, Torus, KleinBottle } from '../js/mesh/parametricSolid.js';
import { IrregularOctahedron, IrregularIcosahedron, Icosphere } from '../js/mesh/miscSolid.js';

let icosahedron = new Icosahedron();
let icosphere = new Icosphere(1);
let octahedron = new Octahedron();
let cube = new Cube();
let irregularOctahedron = new IrregularOctahedron();
let irregularIcosahedron = new IrregularIcosahedron();
let sphere = new Sphere(8, 8, 0, Math.PI, 0, Math.PI*2);
let torus = new Torus(8,8, 0, Math.PI*2, 0, Math.PI*2, 1.2, 0.4);
let klein = new KleinBottle(4,4, 0, Math.PI*2, 0, Math.PI*2);

torus.createVerts();
torus.createFaces();
klein.createVerts();
klein.createFaces();
sphere.createVerts();
sphere.createFaces();


let meshes = {
    "Irregular Icosahedron": irregularIcosahedron,
    "Icosahedron": icosahedron,
    "Icosphere": icosphere,
    "Octahedron": octahedron,
    "Cube": cube,
    "Irregular Octahedron": irregularOctahedron,
    "Sphere": sphere,
    "Torus": torus,
};

let gui = new GUI();

gui.mobile("Sorry, best on desktop.");

gui.menu();
gui.title("Unfolder");
gui.about("about", "About", 0, ["This is my attempt at some kind of unfolding algorithm, and for the most part it's working reasonably well.", "Turn the Spanning Tree on in the GUI to see how the algorithm creates the unfolding pattern based on the angles between faces. This approach seems to work well with convex shapes, but leads to problems with concave - I left the Torus in there to demonstrate where it struggles.", "There is a lot of room for improvement and something I'll be working on over time.","This was made using my JavaScript canvas-based 3D renderer.", "For a write up of the project and more information, see the links below:"]);
gui.title("Drawing Style", true);
gui.button("colour", "Colour", 0);
gui.button("normals", "Face Normals", 0);
gui.button("points", "Points", 0);
gui.button("wireframe", "Wireframe", 0);
gui.button("face", "Faces", 1);
gui.button("facenormallines", "Face Normal Lines", 0);
gui.button("faceid", "Face ID", 0);
gui.button("vertnumbers", "Vert ID", 0);
gui.button("dualgraph", "Dual Graph", 0);
gui.button("spanningtree", "Spanning Tree", 0);
gui.button("shownet", "Show Net", 1);
gui.title("Translation", true);
gui.slider("xTrans",-9,3, 0, 0.1);
gui.slider("yTrans",-9,3, 0, 0.1);
gui.slider("zTrans",-9,3, 0, 0.1);
gui.title("Rotation", true);
gui.slider("xRot",-Math.PI, Math.PI, 0, 0.1);
gui.slider("yRot",-Math.PI, Math.PI, 0, 0.1);
gui.slider("zRot",-Math.PI, Math.PI, 0, 0.1);
gui.title("Scale", true);
gui.slider("xScale",0.5, 4, 1, 0.5);
gui.slider("yScale",0.5, 4, 1, 0.5);
gui.slider("zScale",0.5, 4, 1, 0.5);
// gui.button("recalcnorms", "Recalculate Normals", 0);
gui.button("reset", "Reset", 0);
gui.button("resetColours", "Reset Colours", 0);
gui.dropdown("mesh", Object.keys(meshes));//.map(m => m.charAt(0).toUpperCase()+m.slice(1)));

let camera = new Vec3(0,0,-5);
let light = new Vec3(100,100,-100);
light.normalize();
let scene = new Scene(meshes, camera, light, gui.getIdList());
scene.backgroundColour = new Vec3(220, 240, 255);

let renderer = new Renderer(scene);
renderer.setup();

if(window.attachEvent){
    window.attachEvent("onresize", function() {
        renderer.updateCanvas()
    }, false);
} else if(window.addEventListener){
    window.addEventListener("resize", function() {
        renderer.updateCanvas()
    }, false);
}

// Setup meshes
for(let mesh in meshes){
    meshes[mesh].computeFaceNormals();
    meshes[mesh].colour = randomVecRGB();
    meshes[mesh].sortIndicesByCentroid();
    meshes[mesh].createDualGraph();
    meshes[mesh].createSpanningTree();
}

irregularIcosahedron.create2dCoordsFromFaces();
irregularIcosahedron.layoutNet();
icosahedron.create2dCoordsFromFaces();
icosahedron.layoutNet();
icosphere.create2dCoordsFromFaces();
icosphere.layoutNet();
octahedron.create2dCoordsFromFaces();
octahedron.layoutNet();
cube.create2dCoordsFromFaces();
cube.layoutNet();
irregularOctahedron.create2dCoordsFromFaces();
irregularOctahedron.layoutNet();
sphere.create2dCoordsFromFaces();
sphere.layoutNet();
torus.create2dCoordsFromFaces();
torus.layoutNet();

function draw(){
    renderer.render();
    requestAnimationFrame(draw);
}
draw();
