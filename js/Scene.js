var Scene = function(gl) {
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);
  this.quadGeometry = new QuadGeometry(gl);

  this.timeAtLastFrame = new Date().getTime();

  this.texture = new Texture2D(gl, "media/boom.png");
  this.offset = new Vec2(+1/12,+1/12);
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
  
  this.solidProgram.commit();
  this.texture.commit(gl, gl.getUniformLocation(this.solidProgram.glProgram, "colorTexture"), 0);
  
  console.log();
  this.offset.x = 1/6 * Math.floor(dt*speed) + 1/12;
  this.offset.y = 1/6 * Math.floor(dt*speed/6) + 1/12;
  gl.uniform2fv(gl.getUniformLocation(this.solidProgram.glProgram, "offset"), new Float32Array([this.offset.x, this.offset.y]) );
  
  /*gl.uniformMatrix4fv(
	gl.getUniformLocation(this.solidProgram.glProgram, "modelMatrix"),
	  false,
	  new Float32Array([
		1/2, 0, 0, 0,
		0, 1/2, 0, 0,
		0, 0, 1, 0,
		1/12, 1/12, 0, 1,]) );*/

  this.quadGeometry.draw();
};


