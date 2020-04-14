# JS 3D Engine

---

This was created as an Easter project while studying for a MSc in Creative Computing at the Creative Computing Institute in London. It just so happened to be the _Corona Virus lockdown_ so I had a fair amount of time on my hands.

---

I made [a tool to generate and animate parametric solids and surfaces](https://js-geom.now.sh/) ([repo here](https://github.com/joshmurr/geometry_js)) but the rendering method was quite basic and it reached it's limits with wireframe models. So in making a slightly more sophisticaed renderer I ended up with this small Javascript framework. I tried my best to create something which is relatively general purpose which I could use for future experiments. The first of which was making a tool to unfold the 3D solids - [I got into more detail about that project here](https://github.com/joshmurr/js_3d_engine/tree/master/unfolder). Here I will go through some of the features of the core renderer and how it works.

## Vectors and Matrices

The bulk of the maths is handled by the Vec4 and Mat44 classes. I started by writing Vec3 and Mat33 classes which in many cases would be useful, but I found it easier to create all vectors as Vec4's, initialised with `w=1` so that I didn't have to expand Vec3's later down the pipeline to render them to the screen. The latter is more desireable as things got a bit messy at times as I had to write functions like `normalizeAsVec3()` which normalizes the vector while ignoring the `w` component (which is useful when generating solids of 'unit' size).

The matrices are stored in __column major__ format like GLSL. This caused a headache for me at times as different libraries and languages store matrices differently, and the notation can vary too - so it's worth being clear. A matrix is created and stored like so:

```
M = [ 0  4   8  12     ===  M = [ 0, 1, 2, 3, ... , 15 ]  
      1  5   9  13     
      2  6  10  14
      3  6  11  15 ]
```

So for instance, the Perspective Projection Matrix is based on the OpenGL one, which appears like so (in most books/online):

```
projMat = [ 2n/r-l   0     r+l/r-l     0
               0   2n/t-b  t+b/t-b     0
               0     0    -f+n/f-n -2nf/f-n
               0     0       -1        0     ]
```

And the implementation is like so:

```
projMat.M[0]  = 2n/(r-l);
projMat.M[1]  = 0;
projMat.M[2]  = 0;
projMat.M[3]  = 0;
projMat.M[4]  = 0;
projMat.M[5]  = 2n/(t-b);
projMat.M[6]  = 0;
projMat.M[7]  = 0;
projMat.M[8]  = (r+l)/(r-l);
projMat.M[9]  = (t+b)/(t-b);
projMat.M[10] = -fn/(f-n);
projMat.M[11] = -1;
projMat.M[12] = 0;
projMat.M[13] = 0;
projMat.M[14] = -2nf/f-n);
projMat.M[15] = 0;

```

Rotation is kept quite simple. So far it isn't something I've had to deal with much as I'm just rendering meshes in the centre of the screen. The most useful I found to be `setAxisAngle()` (in Mat44.js) based on [this implementation](https://sites.google.com/site/glennmurray/Home/rotation-matrices-and-formulas/rotation-about-an-arbitrary-axis-in-3-dimensions) of the [Rodrigues' Rotation Formula](https://en.wikipedia.org/wiki/Rodrigues%27_rotation_formula).

Already the maths needs an overhaul and I have lot of redundant or helper functions which can be stripped out... but it works for now.

## Meshes

A mesh at it's core is a collection of vertices and faces - the faces being a collection ID's which reference the respective vertex in the the vertex array. The platonic solids have predefined vertices and faces while the parametric meshes are generated on creation. The `parametricMesh` class is a slightly modified mesh class which takes extra parameters such as the lower and upper bounds of the U and V coordinates (normally 0 to TWO_PI), and sometimes extra parameters such as the diameter and thickness of the torus. Each parametric mesh then holds it's relevant formula for generating `x`, `y` and `z` coordinates based on `u` and `v`.

The `mesh` class then does much more like computing face centroids, face normals, the model matrix and other things relevant to the unfolding algorithm which will be explained more [here](https://github.com/joshmurr/js_3d_engine/tree/master/unfolder).

The __model matrix__ takes input from the GUI and combines scale, rotation and translation into a single model matrix relevant to that mesh.

The __centroids__ are sorted every frame (whenever the getter for `sorted_indices` is called) and are used to sort the faces from back to front so they get drawn to the canvas in the right order. This is not perfect but for most solids it works well enough. You notice problems in the Teapot or Klein Bottle which have junctions between faces and some weird overlapping occurs.

The __face normals__ are calculated only once and are later transformed based on the _transpose_ of the _affine inverse_ of the MVP matrix. I'm not sure whether it is more computationally taxing to re-calculate normals every frame, or do the relatively complex inverse of the MVP matrix, but the latter seemed better as it is not relative to the number of faces, and it works well.

## Scene

The scene is a simple little class which packages up the camera and mesh, and handles background colour.

## Render

The `render` class does a lot. It initialises by creating a Projection and a View matrix based on the screen aspect ratio and the camera defined at the start (these are better described and explained in the resources below. It took me a long time to actually get this working and I'm still not convinced it's quite right). These matrices get multiplied by the model matrix and finally manipulate the mesh vertices creating a homogenous coordinate which gets converted to a screen coordinate which the canvas uses to draw things on the screen! Simple! Of course it was not that simple when building from the ground up. The aforementioned column-major VS row-major notation AND/OR storage methods made reading many different books and online resources doubly confusing, and also makes you doubt your own implementation when things don't work. [This](https://www.scratchapixel.com/lessons/mathematics-physics-for-computer-graphics/geometry/row-major-vs-column-major-vector) article on [Scratchapixel](https://www.scratchapixel.com/) was great at simplifying that. 

The render loop has different style layers (faces, wireframe, points, etc.) which can be turned on or off in the GUI. Each style is evaluated in sequence to maintain the correct back to front drawing wherever possible. All vertices are transformed by the MVP matrix intially and stored in and array `_transformed_normals`. The first grouping of style are those which are drawn based on the face index: faces, wireframe, the face IDs and the face normal lines. Each of these styles drawn based on the face (grouping of 3 or 4 vertices) which is referenced from the `sorted_indices` array. The next group of style are based on other arrays (points, dual graph, spanning tree) and so are rendered in individual loops of their own.

The face colours are based on the simple _diffuse_ colour method of finding the dot product of the face normal and a light in the scene (defined at the start), and multiplying this by the meshes' colour, or 255 to get the 'normal' colour. This colour information is stored in a one-dimensional array like so:

```
this._faceColourArray[sorted_indices[i]*3] = Math.floor(diffuse*mesh.colour.x);
this._faceColourArray[1+sorted_indices[i]*3] = Math.floor(diffuse*mesh.colour.y);
this._faceColourArray[2+sorted_indices[i]*3] = Math.floor(diffuse*mesh.colour.z);
```

This is to allow the colour information to be accessed by different styles later, and to try to sacrifice as little efficiency as possible. I'm just basing this on intuition really, but it seems to be a 1D array is going to be the fastest way to randomly access simple integer data. The arrays are initialised in size based on the largest mesh in the scene (the scene is passe all meshes which appear in the drop down menu).

## GUI

The GUI was a little impromptu attempt to dynamically create GUI elements like buttons and sliders and actually turned out to be really useful. A GUI element is defined in the main javascript file like so:

```
gui.button("shownet", "Show Net", 1);
gui.title("Translation", true);
gui.slider("xTrans",-9,10, 0, 0.1);
```

The GUI class then creates relevant DOM elements, applies styles and stores all the GUI element ID's in an array which is what gets passed around to the renderer or to the scene which allows the mesh to access the GUI element __values__ when creating the model matrix, or for the renderer to find out which buttons are turned on or off. The styles are in `styles.css` and are simply toggled on or off depending on their state.


## Tests

Building this whole thing from the ground up, including the vector and matrix classes, means that when something isn't quite right there are many things which could be the problem. I tried using Javascript testing frameworks like Jest and Tape, but both turned out to be a pain in the arse thanks to my lack of knowledge about Node and NPM packages (I think). So I gave up on those and wrote my own very simple tests just to double check calculations. These were useful and necessary, but despite all this, when a projection matrix is not behaving how you expect you start to doubt every line of code you wrote.

The tester I created was as simple as possible - this is essentially it:

```
assert(message, actual, expected){
    if(actual === expected) {
        this.createLogEntry(message, actual, expected, "PASS");
    } else {
        this.createLogEntry(message, actual, expected, "FAIL");
    }
}
```

Then the log is simply an object of test entries containing a message of what the test is, and `PASS` or `FAIL`.

---

## Resources

I've scoured the internet and have read a lot for this project. Here are a few of the resources I found particularly helpful.

### Graphics

[Essential Math for Games Programmers](http://www.essentialmath.com/book.htm) and [accompanying code](https://github.com/jvanverth/essentialmath).

[Scratchapixel 2.0](https://www.scratchapixel.com/)

[3D Games Engine Programming: Understanding the View Matrix](https://www.3dgep.com/understanding-the-view-matrix/)

[The Little Grasshopper: 3D Wireframes in SVG](https://prideout.net/blog/svg_wireframes/) and [accompanying code](https://github.com/prideout/svg3d).

[Coding Labs: World, View and Projection Matrices](http://www.codinglabs.net/article_world_view_projection_matrix.aspx)

[WebGL Model View Projection](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_model_view_projection)

[Stackoverflow: Trying to understand the math behind the perspective matrix in WebGL](https://stackoverflow.com/questions/28286057/trying-to-understand-the-math-behind-the-perspective-matrix-in-webgl/28301213#28301213)

[Jordan Santell: Model View Projection](https://jsantell.com/model-view-projection/)

[Jordan Santell: 3D Projectoio](https://jsantell.com/3d-projection/)

[OpenGL-Tutorial: Matrices](http://www.opengl-tutorial.org/beginners-tutorials/tutorial-3-matrices/#the-projection-matrix)

[Stackoverflow: Getting local 2D coordinates of vertices of a planar polygon in 3D space](https://stackoverflow.com/questions/26369618/getting-local-2d-coordinates-of-vertices-of-a-planar-polygon-in-3d-space#26370192)

[Stackoverflow: How do axis-angle rotation vectors work and how do they compare to rotation matrices?](https://stackoverflow.com/questions/32485772/how-do-axis-angle-rotation-vectors-work-and-how-do-they-compare-to-rotation-matr)

[Stackoverflow: Projecting 3D points to 2D plane](https://stackoverflow.com/questions/23472048/projecting-3d-points-to-2d-plane)

[Find the angle between two planes using their normal vectors](https://math.stackexchange.com/questions/1528909/find-the-angle-between-two-planes-using-their-normal-vectors)

[*Rotation About an Arbitrary Axis in 3 Dimensions*](https://sites.google.com/site/glennmurray/Home/rotation-matrices-and-formulas/rotation-about-an-arbitrary-axis-in-3-dimensions)

[Creating an icosphere mesh in code](http://blog.andreaskahler.com/2009/06/creating-icosphere-mesh-in-code.html)


### Unfolding Algorithm

[Houdini Gubbins: Unfolding Meshes](https://houdinigubbins.wordpress.com/2017/05/12/unfolding-geometry/)

[Sergen Eren: Unfolding a Mesh](https://sergeneren.com/2018/09/27/unfolding-a-mesh/)

[Sergen Eren: Spanning Trees](https://sergeneren.com/2018/09/24/spanning-trees/)

[Krushkal's Algorithm](https://algorithms.tutorialhorizon.com/kruskals-algorithm-minimum-spanning-tree-mst-complete-java-implementation/)

[Find Cycle in Undirected Graph](https://algorithms.tutorialhorizon.com/graph-find-cycle-in-undirected-graph-using-disjoint-set-union-find/)

[Creating Optimized Cut-Out Sheets for Paper Models from Meshes](https://geom.ivd.kit.edu/downloads/proj-paper-models_cut_out_sheets.pdf)

[Imaging maths - Unfolding polyhedra](https://plus.maths.org/content/os/issue27/features/mathart/index)

[Nets of Polyhedra](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.28.2631&rep=rep1&type=pdf)


### Tools 

[Matrix Calculator](https://matrixcalc.org/en)

[Vector Calculator](https://www.symbolab.com/solver/vector-calculator)

[Rotate a point about an arbitrary axis](http://twist-and-shout.appspot.com/#0.70710678_0_0.70710678_1_0_0_0_-1.5_0_38.5)

### Maths

[Dot Product](https://brilliant.org/wiki/dot-product-definition/)

[Dot Products and Projections](https://sites.science.oregonstate.edu/math/home/programs/undergrad/CalculusQuestStudyGuides/vcalc/dotprod/dotprod.html)
