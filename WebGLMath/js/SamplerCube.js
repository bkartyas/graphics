var SamplerCube = function(textureUnit){
  this.textureCube = null;
  this.textureUnit = textureUnit;
};

SamplerCube.prototype.commit = function(gl, uniformLocation){
  this.textureCube.commit(gl, uniformLocation, this.textureUnit);
};
