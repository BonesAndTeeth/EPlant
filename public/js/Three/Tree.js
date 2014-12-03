/**
 *  based on http://inear.se/three_tree/
 * 
 */

//leaf texture from image
var leafTexture = THREE.ImageUtils.loadTexture( "images/leaf1.png" );
var leafGeometry = new THREE.PlaneBufferGeometry( 25, 25,1, 1 );
var leafMaterial = new THREE.MeshBasicMaterial( { opacity:0.95, 
																									map: leafTexture, 
																									blending: THREE.NormalBlending, 
																									depthTest: true, 
																									transparent : true, 
																									/*color:0x00ee00*/
																								} );

//convert degree to radian
var TO_RADIANS = Math.PI / 180;

//number of sides in tree branches
var numSide = 10;


/*
number of blocks
each branch is made up of blocks stacked 
on top of one another
*/
var numBlock =10;

//maximum brach level of tree
var MAX_LEVEL = 2;

//maximum number of branches
var MAX_BRANCH = 160;

//number of branches already generated
var totalnumBranch = 0;

var NUM_LEAF = 50;
//constructor
//materials: branch texture
//level: current level of branch
//radius: base radius


Tree = function ( material, level, radius, maxScale) {
	THREE.Mesh.call(this, new THREE.Geometry(), material);
	this.level = level;
	this.doubleSided = false;
	this.maxScale = maxScale;
	this.radius = radius;
	
	//generate geometry
	build(this);

	this.geometry.computeFaceNormals();
	this.geometry.computeVertexNormals();
	this.geometry.__dirtyVertices = true;
	this.geometry.__dirtyNormals = true;
	

	
	function build( scope ) {
		var currBlock = 0;
		var R;
		var S;
		var branchPoint;
		var height;
		var radiusStep;
		var basePoint = new THREE.Vector3(0,0,0);
		var branchPoint = new THREE.Object3D();
		
		//height of each block
		height = 40*scope.maxScale;
		
		radiusStep = scope.radius / (numBlock+1);

		if(scope.level>0)
			branchPoint.rotation.y -= 7 * TO_RADIANS;
		
		if (scope.level==0)
			numBlock = 7;
		
		while (currBlock < numBlock)
		{
			basePoint.x = branchPoint.position.x;
			basePoint.y = branchPoint.position.y;
			basePoint.z = branchPoint.position.z;
			branchPoint.translateZ(height);

			
			//curvature
			branchPoint.rotation.x += 3*(scope.level) * TO_RADIANS;
			branchPoint.rotation.y -= 5*(scope.level) * TO_RADIANS;
			branchPoint.rotation.z += 5*(scope.level) * TO_RADIANS;


			//compute local coordinate system for the branch
			var diffVector = new THREE.Vector3();
			diffVector.subVectors( branchPoint.position, basePoint)
			var transformPoint = new THREE.Vector3()
			transformPoint.addVectors(diffVector, new THREE.Vector3(1, 0, 0));
			R = new THREE.Vector3()
			R.crossVectors(transformPoint, diffVector);
			S = new THREE.Vector3()
			S.crossVectors(R, diffVector);
			R.normalize();
			S.normalize();

			//generate vertices and faces for current block
			drawBlock( currBlock == 0 ,currBlock==numBlock-1 );


			if(scope.level>0&&currBlock>5) {
				for( i=0; i<NUM_LEAF; i++ ) {
					leaf = new THREE.Mesh( leafGeometry, leafMaterial );
					leaf.doubleSided = true
					leaf.position.set(branchPoint.position.x, branchPoint.position.y, branchPoint.position.z);
					leaf.position.x += Math.min(Math.random()*5*i,70);
					leaf.position.y += Math.min(Math.random()*5*i,100);
					leaf.position.z -=  Math.min(Math.random()*20);
					leaf.rotation = branchPoint.rotation.clone();
					leaf.rotation.z = 90 * TO_RADIANS;
					leaf.rotation.y = Math.random()*180 * TO_RADIANS
					leaf.rotation.x = Math.random()*180 * TO_RADIANS;
					scope.add( leaf );

					leaf.toRed = new TWEEN.Tween(leaf.material.color)
						.to({r:0.9, g:0.57, b:0}, 3000)
						.easing(TWEEN.Easing.Sinusoidal.EaseInOut)
					leaf.toGreen = new TWEEN.Tween(leaf.material.color)
						.to({r:0, g:0.9, b:0}, 3000)
						.easing(TWEEN.Easing.Sinusoidal.EaseInOut)

					var curr = leaf.rotation;
        	var bppos = branchPoint.position
        	leaf.move= new TWEEN.Tween(leaf.rotation)
        		.to({x:curr.x+60*TO_RADIANS,y:curr.y+30*Math.random()*TO_RADIANS,z:curr.z+30*Math.random()*TO_RADIANS}, Math.random()*200+100)
        		.easing(TWEEN.Easing.Sinusoidal.EaseInOut)
        	leaf.move2= new TWEEN.Tween(leaf.rotation)
        		.to({x:curr.x+Math.random()*50*TO_RADIANS,y:curr.y, z:curr.z}, Math.random()*300+100)
        		.easing(TWEEN.Easing.Sinusoidal.EaseInOut)

					leaf.move.chain(leaf.move2);
					leaf.move2.chain(leaf.move);
					
				}
				
			}

			//recursively create child branches on current branch 
			if(scope.level < MAX_LEVEL && currBlock==level*2+2 && totalnumBranch<MAX_BRANCH){
				var k=0;

				//random number of branches
				numBranch = (scope.level*Math.random())*2+2;
				if (scope.level==0)
					numBranch = 4;
				for(; k<numBranch; k++){
					newBranch = new Tree(scope.material, scope.level+1, scope.radius*0.95, scope.maxScale*Math.pow(0.85, scope.level+1));
					scope.add(newBranch);
					totalnumBranch++;
					newBranch.position.set(branchPoint.position.x, branchPoint.position.y, branchPoint.position.z);

					//distribute new branches evenly around parent branch
					tmp = new THREE.Vector3()
					tmp.subVectors(branchPoint.position, basePoint)
					tmp.normalize();
					newBranch.rotateOnAxis (tmp, k*(360/(numBranch+1))*TO_RADIANS);

				}

			}
				
			currBlock++;
			scope.radius = scope.radius-radiusStep;

			function drawBlock( bottom ,top) {
				
				var angle;
				var currSide;
				var newVertex;
				var p1,p2,p3,p4;
				
				angle = Math.PI * 2 / numSide;

				var radius = scope.radius;

				//compute vertex coordinates on each cross section of the current block				
				currSide = 0;

				var temp = new THREE.Vector3(0,1,0);
        temp.normalize();
				while (currSide < numSide)
				{
					
					x = basePoint.x + radius * Math.cos(currSide * angle) * R.x + radius * Math.sin(currSide * angle) * S.x;
					y = basePoint.y + radius * Math.cos(currSide * angle) * R.y + radius * Math.sin(currSide * angle) * S.y;
					z = basePoint.z + radius * Math.cos(currSide * angle) * R.z + radius * Math.sin(currSide * angle) * S.z;
					
					var newVertex = new THREE.Vector3(x,y,z);
        	if(scope.level>=MAX_LEVEL-0){
        		var vangle = 0.12*currBlock
        		newVertex.applyAxisAngle (temp, vangle);
        	}
					scope.geometry.vertices.push(newVertex);
					currSide++;
				}
				if ( bottom ) 
					return;

				//link vertices to form faces in the two cross sections below
				currSide = 0;
				var numV = scope.geometry.vertices.length;
				while (currSide < numSide)
				{
					
					if ( currSide < (numSide - 1)) {
						p1 = numV - numSide + currSide + 1;
						p4 = numV - numSide + currSide ;
						p2 = numV - numSide * 2 + currSide + 1;
						p3 = numV - numSide * 2 + currSide;
					}
					else {
						p1 = numV - numSide;
						p4 = numV - numSide + currSide;
						p2 = numV - numSide * 2;
						p3 = numV - numSide * 2 + currSide;
					}	

					scope.geometry.uvsNeedUpdate = true;
					scope.geometry.faces.push( new THREE.Face3( p4, p1, p2  ) );
					var uvc =0.1;
					
					scope.geometry.faceVertexUvs[ 0 ].push([
							new THREE.Vector2(0,uvc),
							new THREE.Vector2(uvc,uvc),
							new THREE.Vector2(uvc,0)
						]);
					scope.geometry.faces.push( new THREE.Face3( p2, p3, p4  ) );
					
					scope.geometry.faceVertexUvs[ 0 ].push([
							new THREE.Vector2(uvc,0),
							new THREE.Vector2(0,0),
							new THREE.Vector2(0,uvc)
						]);

					//close the top
					if(top){
						var p0 = numV - numSide;
						for(var v=1; v<numSide-1; v++){
							scope.geometry.faces.push( new THREE.Face3(p0,p0+v,p0+v+1) );
						}

					}
					currSide++;
				}
			}
		}
	}
	
};

//inherits from mesh object
Tree.prototype = new THREE.Mesh();
Tree.prototype.constructor = Tree;
Tree.prototype.supr = THREE.Mesh.prototype;
