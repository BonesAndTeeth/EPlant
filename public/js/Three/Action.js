function Point(px,py,pz){
	this.pos = new THREE.Vector3(px,py,pz);
	this.velocity = new THREE.Vector3(0,0,0);
	this.acc = new THREE.Vector3(0,0,0);
}
Point.prototype.setv = function(vx,vy,vz){
	this.velocity = new THREE.Vector3(vx,vy,vz);
}
Point.prototype.seta = function(ax, ay, az){
	this.acc = new THREE.Vector3(ax, ay, az);
}
Point.prototype.accelerate = function(){
	this.velocity.x += this.acc.x;
	this.velocity.y += this.acc.y;
	this.velocity.z += this.acc.z;
}
Point.prototype.move = function(){
	this.pos.x += this.velocity.x;
	this.pos.y += this.velocity.y;
	this.pos.z += this.velocity.z;
}


function Action(type, nump, mat, ctr, r){
	this.ctr = ctr;
	this.r = r;
	this.nump = nump;
	this.atype = type;
	this.mat = mat
	this.points = [];
	this.system = new THREE.PointCloud(new THREE.Geometry(),mat)
}
Action.prototype.init = function(){
	this.system.geometry.verticesNeedUpdate = true;
	if(this.atype==0){
		for(var i=0; i<this.nump; i++){
			var r = this.r;
			px = this.ctr.x +Math.random()*r*4-2*r;
			pz = this.ctr.z +Math.random()*r*2-r;
			py = this.ctr.y +Math.random()*r/2-r/4+i;
			p = new Point(px,py,pz);
			p.setv(0,-Math.random(),0);
			p.seta(0,-0.01,0);
			this.points.push(p);
			this.system.geometry.vertices.push(p.pos);
		}
	}


	if(this.atype==1){
		for(var i=0; i<this.nump; i++){
			var r = this.r;
			px = this.ctr.x +Math.random()*r-r/2+Math.cos(2*Math.PI*(i/this.nump))*r;
			pz = this.ctr.z -(Math.random()*r-r/2)-i*2;
			py = this.ctr.y +Math.random()*r-r/2+Math.sin(2*Math.PI*(i/this.nump))*r;
			p = new Point(px,py,pz);
			p.setv(0,0,(Math.random()*5+2)*0.1);
			p.seta(0,0,p.velocity.z/5);
			this.points.push(p);
			this.system.geometry.vertices.push(p.pos);
		}
	}

	if(this.atype==2){
		for(var i=0; i<this.nump; i++){
			dx = Math.random()*this.r*2-this.r;
			dz = Math.random()*this.r-this.r/2;
			p = new Point(this.ctr.x+dx,this.ctr.y,this.ctr.z+dz);
			p.setv(Math.cos(2*Math.PI*(i/this.nump))*Math.random()/2,1.9,Math.sin(2*Math.PI*(i/this.nump))*Math.random()/2);
			p.seta(0,-0.02, 0);
			this.points.push(p);
			this.system.geometry.vertices.push(p.pos);
		}
	}


	this.system.sortParticles = true;
}

Action.prototype.update = function(){
	this.system.geometry.__dirtyVertices = true;
	for(var i=0; i<this.nump; i++){
		p = this.points[i];
		p.move();
		p.accelerate();
		if(this.atype==1){
			p.seta(p.acc.x, p.acc.y, p.acc.z-p.velocity.z/4);
		}
		if(this.atype==2){
			this.system.material.color.r = Math.random();
			this.system.material.color.g = Math.random();
			this.system.material.color.b = Math.random();
		}
		v = this.system.geometry.vertices[i]
		v.set(p.pos.x, p.pos.y, p.pos.z);
	}
}