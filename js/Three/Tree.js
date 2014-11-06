/**
 *  based on http://inear.se/three_tree/
 * 
 */
var leafTexture = THREE.ImageUtils.loadTexture( "leaf.png" );
var leafGeometry = new THREE.Plane( 20, 20,1, 1 );
var leafMaterial = new THREE.MeshBasicMaterial( { opacity:0.95, map: leafTexture, blending: THREE.NormalBlending, depthTest: true, transparent : true} );

var TO_RADIANS = Math.PI / 180;
var numSide = 10;
var numBlock = 10;

var MAX_LEVEL = 3;


Tree = function ( materials, level, radius, maxScale, dir) {
	THREE.Mesh.call( this, new THREE.Geometry(), materials );

	this.dir = dir;
	
	this.level = level;
	this.doubleSided = false;

	this.maxScale = maxScale;
	this.radius = radius;

	if( this.radius < 0.5 ) this.radius = .5
	
	build( this )
	
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

		branchPoint = new THREE.Object3D();
		
		height = 30*scope.maxScale;
		
		radiusStep = scope.radius / (numBlock+1);
		//reset
		basePoint = new THREE.Vector3(0,0,0);
		
		//for each step
		while (currBlock < numBlock)
		{
			//last point
			basePoint.x = branchPoint.position.x;
			basePoint.y = branchPoint.position.y;
			basePoint.z = branchPoint.position.z;
			
			branchPoint.translateZ(height);
			
			branchPoint.rotation.y += 3*(scope.level) * TO_RADIANS;
			
			var diffVector = new THREE.Vector3();
			diffVector.sub( branchPoint.position, basePoint)

			var transformPoint = new THREE.Vector3()
			transformPoint.add(diffVector, new THREE.Vector3(10, 0, 0));

			R = new THREE.Vector3()
			R.cross(transformPoint, diffVector);

			S = new THREE.Vector3()
			S.cross(R, diffVector);

			R.normalize();
			S.normalize();

			drawBlock( currBlock == 0  );

			branchPoint.updateMatrix();

			if(level < MAX_LEVEL && currBlock==4 || (level==0 && currBlock==3)){
				var k=0;
				numBranch = Math.random()*3+2;
				for(; k<numBranch; k++){
					dir = (scope.dir==null)?(k>1):!(scope.dir);
					newBranch = new Tree(scope.materials, scope.level+1, scope.radius*0.95, scope.maxScale*0.9,dir);
					newBranch.position = branchPoint.position.clone();
					newBranch.rotation = branchPoint.rotation.clone();
					angle = Math.random()*250*TO_RADIANS;
					
					if(newBranch.dir)
						newBranch.rotation.z += angle;
					else
						newBranch.rotation.z -= angle;
					scope.addChild(newBranch);
				}

			}
				
			if( currBlock >= 6 && level >1) {
				for( i=0; i<2; i++ ) {
					var leaf = new THREE.Mesh( leafGeometry, leafMaterial );
					leaf.doubleSided = true
					leaf.position = branchPoint.position.clone();
					leaf.position.x += Math.random()*10
					leaf.position.y += Math.random()*10
					leaf.position.z += Math.random()*10
					leaf.rotation = branchPoint.rotation.clone();
					leaf.rotation.x = 90 * TO_RADIANS;
					leaf.rotation.y = Math.random()*90 * TO_RADIANS
					leaf.rotation.z = Math.random()*90 * TO_RADIANS;
					scope.addChild( leaf );
					
				}
				
			}
			
			currBlock++;
			scope.radius = scope.radius-radiusStep;

			function drawBlock( bottom ) {
				
				var angle;
				var currSide;
				var newVertex;
				var p1,p2,p3,p4;
				
				var vertices = scope.geometry.vertices
				var faces = scope.geometry.faces
				var faceVertexUvs = scope.geometry.faceVertexUvs
				
				angle = Math.PI * 2 / numSide;

				var radius = scope.radius;

				
				currSide = 0;
				while (currSide < numSide)
				{
					
					x = basePoint.x + radius * Math.cos(currSide * angle) * R.x + radius * Math.sin(currSide * angle) * S.x;
					y = basePoint.y + radius * Math.cos(currSide * angle) * R.y + radius * Math.sin(currSide * angle) * S.y;
					z = basePoint.z + radius * Math.cos(currSide * angle) * R.z + radius * Math.sin(currSide * angle) * S.z;
					
					newVertex = new THREE.Vertex( new THREE.Vector3(x,y,z));
					vertices.push(newVertex);

					currSide++;
				}
				
				if ( bottom ) 
					return;

				currSide = 0;
				while (currSide < numSide)
				{
					
					if ( currSide < (numSide - 1)) {
						p1 = vertices.length - numSide + currSide + 1;
						p4 = vertices.length - numSide + currSide ;
						p2 = vertices.length - numSide * 2 + currSide + 1;
						p3 = vertices.length - numSide * 2 + currSide;
					}
					else {
						p1 = vertices.length - numSide;
						p4 = vertices.length - numSide + currSide;
						p2 = vertices.length - numSide * 2;
						p3 = vertices.length - numSide * 2 + currSide;
					}	
					faces.push( new THREE.Face4( p1, p2, p3, p4  ) );
					
					var startX = 1/numSide*(currSide+1);
					var endX = startX - 1/numSide;
					
					var startY = currBlock/numBlock*3;
					var endY = startY + 1/numBlock*3
					
					faceVertexUvs[ 0 ].push([
						new THREE.UV( startX, endY),
						new THREE.UV( startX,startY ),
						new THREE.UV( endX ,startY ),
						new THREE.UV( endX, endY )
					])
					
					currSide++;
				}
			}
		}
	}
	
};


Tree.prototype = new THREE.Mesh();
Tree.prototype.constructor = Tree;
Tree.prototype.supr = THREE.Mesh.prototype;
