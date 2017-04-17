var Scene = function(gl) {
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.vsBackground = new Shader(gl, gl.VERTEX_SHADER, "cube_vs.essl");
  this.fsBackground = new Shader(gl, gl.FRAGMENT_SHADER, "cube_fs.essl");
  this.skyCubeTexture = new TextureCube(gl, [
                                  "media/envmap/posx512.jpg",
                                  "media/envmap/negx512.jpg",
                                  "media/envmap/posy512.jpg",
                                  "media/envmap/negy512.jpg",
                                  "media/envmap/posz512.jpg",
                                  "media/envmap/negz512.jpg",]);
  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);
  this.backgroundProgram = new Program(gl, this.vsBackground, this.fsBackground);
  this.quadGeometry = new QuadGeometry(gl);

  this.timeAtLastFrame = new Date().getTime();
  this.accdt = 0;
  this.speed = 2;
  this.time = 0;
  this.r = 3;

  this.camera = new PerspectiveCamera();
  this.camera.setAspectRatio(16/9);

  this.backgroundMaterial = new Material(gl, this.backgroundProgram);
  this.materials = [];
  this.materials.push(new Material(gl, this.solidProgram));
  this.materials.push(new Material(gl, this.solidProgram));

  this.backgroundMaterial.envmapTexture.set(this.skyCubeTexture);

  this.backgroundMesh = new Mesh(this.quadGeometry, this.backgroundMaterial);
  this.mesh = new MultiMesh(gl, "media/slowpoke/Slowpoke.json", this.materials);

  this.slowpoke = new GameObject2D(this.mesh);
  this.background = new GameObject2D(this.backgroundMesh);

  this.slowpoke.position = new Vec3(0, -2.5, -20);;
  this.slowpoke.updateModelTransformation();
};

Scene.prototype.update = function(gl, keysPressed) {
  var timeAtThisFrame = new Date().getTime();
  var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;
  this.time += dt;

  var camera = this.camera;

  // clear the screen
  gl.clearColor(164/255, 66/255, 220/255, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  camera.move(dt, keysPressed);

  canvas.onmousedown = function(event) {
    camera.mouseDown();
  };
  canvas.onmousemove = function(event) {
    camera.mouseMove(event);
  };
  canvas.onmouseup = function(event) {
    camera.mouseUp();
  };

  this.backgroundMaterial.eye.set(this.camera.position);
  this.backgroundMaterial.ball1.set(new Vec3(0 + this.r * Math.cos(this.time), 2,                                10));
  this.backgroundMaterial.ball2.set(new Vec3(0,                                2 + this.r * Math.sin(this.time), 10));
  this.backgroundMaterial.ball3.set(new Vec3(0 + this.r * Math.sin(this.time), 2 + this.r * Math.cos(this.time), 10));
  this.backgroundMaterial.ball4.set(new Vec3(0 + this.r * Math.cos(this.time), 2,                                10 + this.r * Math.sin(this.time)));
  this.background.draw(this.camera);
};
