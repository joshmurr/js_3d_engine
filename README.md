# JS 3D Engine

A full 3D engine in vanilla JS.

Like most things in life, once you know how to use the Model-View-Projection pipeline to render to the screen, it's not that hard; but there are a lot of details when it comes to linear algebra which I didn't know before which caused me trouble. Namely row-major vs column-major notation AND/OR storage in memory, and how this affects how your perform your computations&emdash;also something to take note of when reading information in books and online as it will vary from source to source. [This](https://www.scratchapixel.com/lessons/mathematics-physics-for-computer-graphics/geometry/row-major-vs-column-major-vector) article on [Scratchapixel](https://www.scratchapixel.com/) was great and simplifying that. In fact everything on [Scratchapixel](https://www.scratchapixel.com/) is fantastic.

Also building this whole thing from the ground up, including the vector and matrix classes, means that when something isn't quite right there are many things which could be the problem. I tried using Javascript testing frameworks like Jest and Tape, but both turned out to be a pain in the arse thanks to my lack of knowledge about Node and NPM packages (I think). So I gave up on those and wrote my own very simple tests just to double check calculations. These were useful and necessary, but despite all this, when a projection matrix is not behaving how you expect you start to doubt every line of code you wrote.

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

### Unfolding Algorithm

[Houdini Gubbins: Unfolding Meshes](https://houdinigubbins.wordpress.com/2017/05/12/unfolding-geometry/)

[Sergen Eren: Unfolding a Mesh](https://sergeneren.com/2018/09/27/unfolding-a-mesh/)

[Sergen Eren: Spanning Trees](https://sergeneren.com/2018/09/24/spanning-trees/)

[Krushkal's Algorithm](https://algorithms.tutorialhorizon.com/kruskals-algorithm-minimum-spanning-tree-mst-complete-java-implementation/)

[Find Cycle in Undirected Graph](https://algorithms.tutorialhorizon.com/graph-find-cycle-in-undirected-graph-using-disjoint-set-union-find/)

### Tools 

[Matrix Calculator](https://matrixcalc.org/en)

[Vector Calculator](https://www.symbolab.com/solver/vector-calculator)
