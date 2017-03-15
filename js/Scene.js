var Scene = function(gl) {
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);
  this.quadGeometry = new QuadGeometry(gl);

  this.timeAtLastFrame = new Date().getTime();
  this.accdt = 0;
  this.nextAsteroid = 0;

  this.camera = new OrthoCamera();

  this.asteroidMaterial = new Material(gl, this.solidProgram);
  this.bulletMaterial = new Material(gl, this.solidProgram);

  this.asteroidMaterial.colorTexture.set(new Texture2D(gl, "media/asteroid.png"));
  this.bulletMaterial.colorTexture.set(new Texture2D(gl, "media/bullet.png"));

  this.boomTexture = new Texture2D(gl, "media/boom.png");
  this.rocketTexture = new Texture2D(gl, "media/rocket.png");
  this.backgroundTexture = new Texture2D(gl, "media/background.jpg");



  this.bulletMaterial.offsetMatrix.set(1/2, 0.0, 0.0, 1/2,
                                         0.0, 1/2, 0.0, 1/2,
                                         0.0, 0.0, 0.0, 0.0,
                                         0.0, 0.0, 0.0, 1.0);

  this.bullet = new GameObject2D(new Mesh(this.quadGeometry, this.bulletMaterial));
  this.bullet.scale = new Vec3(1/10, 1/5, 0);

  this.objects = [];
};

Scene.prototype.update = function(gl, keysPressed) {
  var timeAtThisFrame = new Date().getTime();
  var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;
  this.accdt += dt;

  if(this.accdt > this.nextAsteroid){
    this.accdt = 0;
    this.nextAsteroid = Math.random() * 3 + 2;
    this.objects.push(new Asteroid(new Mesh(this.quadGeometry, this.asteroidMaterial), new Vec3(Math.random() * 2 - 1, 1.2, 0)));
  }

  // clear the screen
  gl.clearColor(164/255, 66/255, 220/255, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  /*var a = 1/6 * Math.floor(dt*speed);
  var b = 1/6 * Math.floor(dt*speed/6);*/



  for(let i = 0; i < this.objects.length; i++){
    this.objects[i].object.updateModelTransformation();
    var dead = this.objects[i].move(dt);
    if(dead){
      this.objects.splice(i, 1);
    }
    this.objects[i].object.draw(this.camera);
  }

};

