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

	if(this.atype==0){
		this.system.geometry.verticesNeedUpdate = true;
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
	this.system.sortParticles = true;
}

Action.prototype.update = function(){
	this.system.geometry.__dirtyVertices = true;
	for(var i=0; i<this.nump; i++){
		p = this.points[i];
		p.move();
		p.accelerate();
		v = this.system.geometry.vertices[i]
		v.set(p.pos.x, p.pos.y, p.pos.z);
	}
}