var Scene = function(gl) {
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);
  this.quadGeometry = new QuadGeometry(gl);

  this.timeAtLastFrame = new Date().getTime();
  
  this.material = new Material(gl, this.solidProgram);

  this.material.colorTexture.set(new Texture2D(gl, "media/boom.png"));
  this.material.MVP.set(1/10, 0.0, 0.0, 1/2,
                        0.0, 1/6, 0.0, 1/2,
                        0.0, 0.0, 1.0, 0.0,
                        0.0, 0.0, 0.0, 1.0); 

};

Scene.prototype.update = function(gl, keysPressed) {
  var timeAtThisFrame = new Date().getTime();
  var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  var speed = 20;
  //this.timeAtLastFrame = timeAtThisFrame;

  // clear the screen
  gl.clearColor(164/255, 66/255, 220/255, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var a = 1/6 * Math.floor(dt*speed);
  var b = 1/6 * Math.floor(dt*speed/6);

  this.material.offsetMatrix.set(1/12, 0.0, 0.0, a+1/12,
                                 0.0, 1/12, 0.0, b+1/12,
                                 0.0, 0.0, 1.0, 0.0,
                                 0.0, 0.0, 0.0, 1.0); 

  //this.solidProgram.commit();
  //this.texture.commit(gl, gl.getUniformLocation(this.solidProgram.glProgram, "colorTexture"), 0);
  
  this.material.commit();
  this.quadGeometry.draw();



  //this.material.colorTexture.set(new Texture2D(gl, "media/boom.png"));
  /*this.material.MVP.set(1/6, 0.0, 0.0, -1/2,
                        0.0, 1/6, 0.0, -1/2,
                        0.0, 0.0, 1.0, 0.0,
                        0.0, 0.0, 0.0, 1.0); 
  this.material.offsetMatrix.set(1/12, 0.0, 0.0, a+1/12,
                                 0.0, 1/12, 0.0, b+1/12,
                                 0.0, 0.0, 1.0, 0.0,
                                 0.0, 0.0, 0.0, 1.0); 

  //this.solidProgram.commit();
  //this.texture.commit(gl, gl.getUniformLocation(this.solidProgram.glProgram, "colorTexture"), 0);
  
  this.material.commit();
  this.quadGeometry.draw();
  /*this.material.colorTexture.set(new Texture2D(gl, "media/asteroid.png"));
  this.material.MVP.set(1/4, 0.0, 0.0, 0.0,
                        0.0, 1/4, 0.0, 0.0,
                        0.0, 0.0, 1.0, 0.0,
                        0.0, 0.0, 0.0, 1.0); 
  this.material.offsetMatrix.set(1, 0.0, 0.0, 0,
                                 0.0, 1, 0.0, 0,
                                 0.0, 0.0, 1.0, 0.0,
                                 0.0, 0.0, 0.0, 1.0); 
  this.material.commit();
  this.quadGeometry.draw();*/
};


