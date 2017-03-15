var GameObject2D = function(mesh) {
  this.mesh = mesh;

  this.position = new Vec3(0, 0, 0);
  this.orientation = 0;
  this.scale = new Vec3(1, 1, 1);

  this.modelMatrix = new Mat4();
  this.updateModelTransformation();
};

GameObject2D.prototype.updateModelTransformation = function(){
  this.modelMatrix.set().
    scale(this.scale).
    rotate(this.orientation).
    translate(this.position);

};

GameObject2D.prototype.draw = function(camera){
  Material.shared.modelViewProjMatrix.set().
    mul(this.modelMatrix).
    mul(camera.viewProjMatrix);

  this.mesh.draw();
};

GameObject2D.prototype.move = function(camera){};






var Asteroid = function(mesh, position) {
  this.object = new GameObject2D(mesh);

  this.object.mesh.material.offsetMatrix.set(1/2, 0.0, 0.0, 1/2,
                                      		 0.0, 1/2, 0.0, 1/2,
                                         	 0.0, 0.0, 0.0, 0.0,
                                         	 0.0, 0.0, 0.0, 1.0);

  this.object.position = position;
  this.object.scale = new Vec3((1/10)/1.5, (1/5)/1.5, 1);
};

Asteroid.prototype.move = function(dt){
  this.object.position.y -= dt/10;

  if(this.object.position.y < -1.2){ return true; }
  return false;
};