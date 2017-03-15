var GameObject2D = function(mesh) {
  this.mesh = mesh;

  this.position = new Vec3(0, 0, 0);
  this.orientation = 0;
  this.scale = new Vec3(1, 1, 1);

  this.modelMatrix = new Mat4();
  this.updateModelTransformation();

  this.dead = false;
};

GameObject2D.prototype.updateModelTransformation = function(){
  this.modelMatrix.set().
    scale(this.scale).
    rotate(this.orientation).
    translate(this.position);

};

GameObject2D.prototype.collisions = function(objects){
  for(var i = 0; i < objects.length; i++){
  	var otherPos = objects[i].object.position;
  	var distance = Math.sqrt((this.position.x - otherPos.x)*(this.position.x - otherPos.x) + (this.position.y - otherPos.y) * (this.position.y - otherPos.y));
  	if(distance !== 0 && distance < 0.12){
  		objects[i].collide(this);
  	}
  }

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
  this.jump;
  this.life = 1;
};

Asteroid.prototype.move = function(dt){
  if(!!this.jump){
  	this.object.position.x += this.jump.x;
  	this.object.position.y += this.jump.y;
  	this.jump = null;
  } else {
  	this.object.position.y -= dt/10;
  }

  if(this.object.position.y < -1.2){ return true; }
  return false;
};

Asteroid.prototype.collide = function(other){
	if(!!this.life){
		this.jump = new Vec3((this.object.position.x - other.position.x)/5,
							 (this.object.position.y - other.position.y)/5,
							 0);
		this.life--;
	} else {
  		this.object.dead = true;
  	}
};


var Rocket = function(mesh, position) {
  this.object = new GameObject2D(mesh);

  this.object.mesh.material.offsetMatrix.set(1/2, 0.0, 0.0, 1/2,
	                                         0.0, 1/2, 0.0, 1/2,
	                                         0.0, 0.0, 0.0, 0.0,
	                                         0.0, 0.0, 0.0, 1.0);

  this.object.position = position;
  this.object.orientation = 3.141592;
  this.object.scale = new Vec3(1/10, 1/5, 0);

  this.cooldown = 1;
};

Rocket.prototype.shot = function(dt){
	this.cooldown += dt;
	if(this.cooldown > 1){
		this.cooldown = 0;
		return true;
	}
};

Rocket.prototype.moveLeft = function(dt){
	if(this.object.position.x < -0.9){
		this.object.position.x = -0.9;
	} else {
		this.object.position.x -= dt/7;
	}
};

Rocket.prototype.moveRight = function(dt){
	if(this.object.position.x > 0.9){
		this.object.position.x = 0.9;
	} else {
		this.object.position.x += dt/7;
	}
};

Rocket.prototype.collide = function(other){
	this.object.dead = true;
};

var Bullet = function(mesh, position) {
  this.object = new GameObject2D(mesh);

  this.object.mesh.material.offsetMatrix.set(1/2, 0.0, 0.0, 1/2,
	                                         0.0, 1/2, 0.0, 1/2,
	                                         0.0, 0.0, 0.0, 0.0,
	                                         0.0, 0.0, 0.0, 1.0);

  this.object.position = position;
  this.object.orientation = -1.57;
  this.object.scale = new Vec3(1/8, 1/16, 0);
};

Bullet.prototype.move = function(dt){
	this.object.position.y += dt/5;

	if(this.object.position.y > 1.2){ return true; }
};

Bullet.prototype.move = function(dt){
	this.object.position.y += dt/5;

	if(this.object.position.y > 1.2){ return true; }
};


Bullet.prototype.collide = function(other){
	this.object.dead = true;
};