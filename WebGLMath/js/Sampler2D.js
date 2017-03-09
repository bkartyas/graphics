var Sampler2D = function(textureUnit){
  this.texture2D = null;
  this.textureUnit = textureUnit;
};

Sampler2D.prototype.commit = function(gl, uniformLocation){
  this.texture2D.commit(gl, uniformLocation, this.textureUnit);
};

