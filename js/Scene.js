var Scene = function(gl) {
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.skyCubeTexture = new TextureCube(gl, [
                                  "media/envmap/posx512.jpg",
                                  "media/envmap/negx512.jpg",
                                  "media/envmap/posy512.jpg",
                                  "media/envmap/negy512.jpg",
                                  "media/envmap/posz512.jpg",
                                  "media/envmap/negz512.jpg",]);
  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);
  this.quadGeometry = new QuadGeometry(gl);

  this.timeAtLastFrame = new Date().getTime();
  this.accdt = 0;
  this.speed = 2;
  this.r = 15;

  this.camera = new PerspectiveCamera();
  this.camera.setAspectRatio(16/9);

  this.materials = [];
  this.materials.push(new Material(gl, this.solidProgram));
  this.materials.push(new Material(gl, this.solidProgram));

  this.materials[0].colorTexture.set(new Texture2D(gl, "media/slowpoke/YadonDh.png"));
  this.materials[1].colorTexture.set(new Texture2D(gl, "media/slowpoke/YadonEyeDh.png"));
  this.materials[0].envmapTexture.set(this.skyCubeTexture);
  this.materials[1].envmapTexture.set(this.skyCubeTexture);
  this.materials[0].lightColor.set(new Vec3(0.0,1.0,1.0));
  this.materials[1].lightColor.set(new Vec3(0.0,1.0,1.0));

  this.mesh = new MultiMesh(gl, "media/slowpoke/Slowpoke.json", this.materials);

  this.slowpoke = new GameObject2D(this.mesh);
};

Scene.prototype.update = function(gl, keysPressed) {
  var timeAtThisFrame = new Date().getTime();
  var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;

  var camera = this.camera;

  // clear the screen
  gl.clearColor(164/255, 66/255, 220/255, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  this.accdt += dt;
  this.materials[0].lightPos.set(new Vec3(Math.sin(this.accdt*this.speed)*this.r,0.0,Math.cos(this.accdt*this.speed)*this.r));
  this.materials[1].lightPos.set(new Vec3(Math.sin(this.accdt*this.speed)*this.r,0.0,Math.cos(this.accdt*this.speed)*this.r));
  //camera.position = new Vec3(Math.sin(this.accdt*this.speed)*this.r,0.0,-20+Math.cos(this.accdt*this.speed)*this.r);
  //this.materials[1].lightPos.set(new Vec3(Math.sin(this.accdt*this.speed)*this.r,0.0,-20.0+Math.cos(this.accdt*this.speed)*this.r));

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
  this.slowpoke.draw(this.camera);
};
