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
  this.rocketMaterial = new Material(gl, this.solidProgram);
  this.bulletMaterial = new Material(gl, this.solidProgram);
  this.backgroundMaterial = new Material(gl, this.solidProgram);

  this.asteroidMaterial.colorTexture.set(new Texture2D(gl, "media/asteroid.png"));
  this.rocketMaterial.colorTexture.set(new Texture2D(gl, "media/rocket.png"));
  this.bulletMaterial.colorTexture.set(new Texture2D(gl, "media/bullet.png"));
  this.backgroundMaterial.colorTexture.set(new Texture2D(gl, "media/background.png"));

  //this.boomTexture = new Texture2D(gl, "media/boom.png");
  this.background = new GameObject2D(new Mesh(this.quadGeometry, this.backgroundMaterial), new Vec3(0, 0, 0));
  this.rocket = new Rocket(new Mesh(this.quadGeometry, this.rocketMaterial), new Vec3(0, -0.85, 0));

  this.objects = [ this.rocket ];

  this.background.mesh.material.offsetMatrix.set(1/2, 0.0, 0.0, 1/2,
                                                 0.0, 1/4, 0.0, 1/2,
                                                 0.0, 0.0, 0.0, 0.0,
                                                 0.0, 0.0, 0.0, 1.0);

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

  if(!!this.rocket){
    if(keysPressed["SPACE"]){
      if(this.rocket.shot(dt)){
        this.objects.push(new Bullet(new Mesh(this.quadGeometry, this.bulletMaterial), new Vec3(this.rocket.object.position.x, -0.6, 0)));
      }
    }

    if(keysPressed["A"]){
      this.rocket.moveLeft(dt);
    }

    if(keysPressed["D"]){
      this.rocket.moveRight(dt);
    }
  }

  // clear the screen
  gl.clearColor(164/255, 66/255, 220/255, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  this.background.draw(this.camera);
  /*var a = 1/6 * Math.floor(dt*speed);
  var b = 1/6 * Math.floor(dt*speed/6);*/

  this.rocket.object.updateModelTransformation();
  this.rocket.object.collisions(this.objects);
  this.rocket.object.draw(this.camera);
  var dead = this.rocket.object.dead;
  if(dead){ this.rocket = null; }

  for(let i = 1; i < this.objects.length; i++){
    this.objects[i].object.updateModelTransformation();
    this.objects[i].object.draw(this.camera);

    this.objects[i].object.collisions(this.objects);
  }

  for(let i = 1; i < this.objects.length; i++){
    this.objects[i].move(dt);
  }

  for(let i = 1; i < this.objects.length; i++){
    var dead = this.objects[i].object.dead;

    if(dead){ this.objects.splice(i, 1); }
  }

};

