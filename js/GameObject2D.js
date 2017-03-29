var GameObject2D = function(mesh) {
  this.mesh = mesh;

  this.position = new Vec3(0, -2.5, 0);
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
  for(var i = 0; i < this.mesh.meshes.length; i++){
    this.mesh.meshes[i].material.viewPos.set(camera.position);
  }

  Material.shared.modelViewProjMatrix.set().
    mul(this.modelMatrix).
    mul(camera.viewProjMatrix);

  this.mesh.draw();
};

GameObject2D.prototype.move = function(camera){};
