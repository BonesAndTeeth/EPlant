/**
*  based on http://inear.se/three_tree/
* 
*/
angular.module("plantApp")
.controller("canvasCtrl",function($scope, answerservice, settreeservice){
	$scope.WebGLNotDetected = false;
	$scope.sad = 0;
    //Show error message if the user's browser does not support webGL
    if ( ! Detector.webgl ) {
    	$scope.WebGLNotDetected = true;
    }
    var container, camera, scene, renderer;
    var tree, _tree, water, sunshine, fertilizer, pesticide;
    var treeTexture, branchMaterial;
    var branchTexImgs = ["images/treebark1.jpg","images/treebark2.jpg","images/treebark3.jpg"];
    var leafTexImgs =[  "images/leaf1.png","images/leaf2.png","images/leaf3.png",
    "images/leaf4.png","images/leaf5.png","images/leaf6.png"
    ];
    var cloudTexImgs=["images/cloud0.png","images/cloud1.png","images/cloud2.png"];
    var cloudGeometry = new THREE.PlaneBufferGeometry( 250, 200,1, 1 );
    var cloudMaterial = new THREE.MeshBasicMaterial({
    	opacity:0.8,
    	blending: THREE.NormalBlending, 
    	depthTest: true, 
    	transparent : true
    });
    var clouds=[]

    var watermat = new THREE.PointCloudMaterial({
    	color: 0xdd0000,
    	size: 15,
    	map: THREE.ImageUtils.loadTexture(
    		"images/rain.png"
    		),
    	blending: THREE.NormalBlending,
    	transparent: true
    });
    var sunmat = new THREE.PointCloudMaterial({
    	color: 0xffcc00,
    	size: 30,
    	map: THREE.ImageUtils.loadTexture(
    		"images/sun.png"
    		),
    	blending: THREE.AdditiveBlending,
    	transparent: true
    });
    var fertmat = new THREE.PointCloudMaterial({
    	color: 0x00ac00,
    	size: 20,
    	map: THREE.ImageUtils.loadTexture(
    		"images/star.png"
    		),
    	blending: THREE.NormalBlending,
    	transparent: true
    });
    var pestmat = new THREE.PointCloudMaterial({
    	color: 0x00aa00,
    	size: 30,
    	map: THREE.ImageUtils.loadTexture(
    		"images/pest.png"
    		),
    	blending: THREE.NormalBlending,
    	transparent: true
    });


    /* animates leaves on receival of correct answer */
    $scope.$on('rightanswerevent',function(){
    	if($scope.sad>0){
    		$scope.twup.start();
    		$scope.sad -= 1;
    	}
    	else{
    		$scope.animateleaf();
    	}

    });

    $scope.$on('wronganswerevent',function(){
    	if($scope.sad<4){
    		$scope.twdown.start();
    		$scope.sad +=1;
    	}
    });

    $scope.$on('btexevent',function(e,tid){
    	$scope.setbarktexture(tid);
    });

    $scope.$on('ltexevent',function(e,tid){
    	$scope.setleaftexture(tid);
    });
    $scope.$on('cloudevent',function(e,action){
    	if(action){
    		$scope.addclouds();
    	}
    	else{
    		$scope.removeclouds();
    	}
    });
    $scope.$on('colorevent',function(e,colorval){
    	$scope.renderer.setClearColor(colorval);
    });

    $scope.$on('keypress',function(e,code){
    	if(code==37){
    		$scope.tree.rotation.z-=0.1;
    	}
    	if(code==39){
    		$scope.tree.rotation.z+=0.1;
    	}
    	if(code==40){
    		$scope.camera.position.z-=1;
    		$scope.treecontainer.position.z+=2;
    	}
    	if(code==38){
    		$scope.camera.position.z+=1;
    		$scope.treecontainer.position.z-=2;
    		$scope.tree.testf();
    	}
    });

    $scope.$on('actionevent',function(e,aid){
    	switch(aid){
    		case 0:
    		$scope.water();
    		break;
    		case 1:
    		$scope.sunshine();
    		break;
    		case 2:
    		$scope.fertilizer();
    		break;
    		case 3:
    		$scope.pesticide();
    		break;
    	}
    })

    init();
    drawTree();
    animate();

    //initialization
    function init() {

    	container = document.getElementById( 'container' );
        /*container = document.createElement( 'div' );
        container.id="container";
        document.body.appendChild( container );*/ 

        //create scene
        $scope.scene = scene = new THREE.Scene();

        //set up camera and viewing matrix
        $scope.camera = camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.position.z = 800;
        camera.position.y = 400;
        camera.position.x = 90;
        camera.aspect = window.innerWidth / window.innerHeight;
        //camera.updateProjectionMatrix();
        var cameraTarget = new THREE.Object3D();
        cameraTarget.position.y = 400;
        camera.target = cameraTarget;
        scene.add(camera);

        //add light source (white light)
        var light = new THREE.DirectionalLight( 0xffffff );
        light.position.x = 0;
        light.position.y = 300;
        light.position.z = 50000;
        light.position.normalize();
        scene.add( light );

        //create texture from image 
        var treeTexture = THREE.ImageUtils.loadTexture( branchTexImgs[0] );
        treeTexture.wrapS = treeTexture.wrapT = THREE.RepeatWrapping
        treeTexture.repeat.set( 2, 2 );
        branchMaterial = new THREE.MeshPhongMaterial( { map:treeTexture, shininess: 5, ambient:0xffffff, side:THREE.DoubleSide, color:0xcccccc} );
        branchMaterial.shading = THREE.SmoothShading;
        
        //create tree object and add object to the scene
        var _tree = new THREE.Object3D();
        $scope.treecontainer = _tree;
        tree = new Tree(branchMaterial, 0 , 25, 1);

        //invisible at first
        $scope.tree = tree;

        _tree.position.set(150,130,130);
        tree.rotation.x = -90 * Math.PI / 180;
        tree.rotation.z = -90 * Math.PI / 180;
        
        _tree.add(tree);
        //console.log(tree.tree);

        scene.add(_tree);

        //set up renderer
        $scope.renderer=renderer = new THREE.WebGLRenderer( { antialias: true} );
        renderer.setSize( window.innerWidth-17, window.innerHeight-70 );
        renderer.setClearColor(0x33ccff)

        container.innerHTML = "";
        container.appendChild( renderer.domElement );

        //rescale and position object on resize
        window.addEventListener( 'resize', resizeHandler, false );

    }

    $scope.addclouds = function(){
    	if(clouds.length>=24)
    		return;
    	for(var numc=0; numc<6; numc++){
    		cloudcontainer = new THREE.Object3D()
    		cloud = new THREE.Mesh(cloudGeometry,cloudMaterial.clone());
    		cloudcontainer.add(cloud);
    		clouds.push(cloudcontainer)
    		tid = numc%3;
    		cloud.material.map = THREE.ImageUtils.loadTexture( cloudTexImgs[tid] );
    		cloudcontainer.position.set(-300+190*numc,550+Math.random()*190-90,50+Math.random()*30-40);
    		scene.add(cloudcontainer);

    		var dx=0;
    		var dy=0;
    		while(Math.abs(dx)<50 || Math.abs(dy<50) ){
    			dx = Math.random()*200-100;
    			dy = Math.random()*200-100;
    		}

    		orig = cloudcontainer.position.clone();
    		cloudcontainer.t1=new TWEEN.Tween(cloudcontainer.position)
    		.to({x:orig.x+dx,y:orig.y+dy}, Math.sqrt(Math.abs(dx*dy))*200)
    		.easing(TWEEN.Easing.Sinusoidal.EaseInOut)
    		cloudcontainer.t2=new TWEEN.Tween(cloudcontainer.position)
    		.to({x:orig.x,y:orig.y}, Math.sqrt(Math.abs(dx*dy))*200)
    		.easing(TWEEN.Easing.Sinusoidal.EaseInOut)
    		cloudcontainer.t1.chain(cloudcontainer.t2);
    		cloudcontainer.t2.chain(cloudcontainer.t1);
    		cloudcontainer.t1.start();

    	}
    }

    $scope.removeclouds = function(){
    	if(clouds.length == 0)
    		return;
    	for(var c = 0; c<6; c++){
    		scene.remove(clouds.pop());
    	}
    }

    $scope.setbarktexture = function(id){
    	tree.material.map = THREE.ImageUtils.loadTexture( branchTexImgs[id] );
    }

    $scope.setleaftexture = function(id){
    	console.log(id);
    	setleaftex(tree,id);
    }

    function setleaftex(tree_,id){
    	for(var i=0; i<tree_.children.length;i++){
    		c = tree_.children[i];
    		if(c instanceof Tree){
    			setleaftex(c,id);
    		}
    		else{
    			c.material.map = THREE.ImageUtils.loadTexture( leafTexImgs[id] );
    		}
    	}
    }

    function startanimateleaf(tree){
    	for(var i=0; i<tree.children.length; i++){
    		child = tree.children[i];
    		if(!(child instanceof Tree)){
    			anim = child.move;
    			if(anim instanceof TWEEN.Tween)
    				anim.start();
    		}
    		else
    			startanimateleaf(child);
    	}
    }

    function stopanimateleaf(tree){
    	for(var i=0; i<tree.children.length; i++){
    		child = tree.children[i];
    		if(!(child instanceof Tree)){
    			child.move.stop();
    			child.move2.stop();
    		}
    		else
    			stopanimateleaf(child);
    	}
    }

    $scope.animateleaf=function(){
    	startanimateleaf($scope.tree);
    	setTimeout(function(){stopanimateleaf($scope.tree)},3000);
    }

    //scale the tree up to actual size of object
    function drawTree() {
    	new TWEEN.Tween( tree.scale )
    	.delay(1000)
    	.to({x: 1, y: 1, z: 1}, 2000)
    	.easing(TWEEN.Easing.Sinusoidal.EaseInOut)
    	.start();

    	$scope.twdown = new TWEEN.Tween()
    	.to({},500)
    	.easing(TWEEN.Easing.Sinusoidal.EaseInOut)
    	.onUpdate(function(){bend(tree,false,1)});

    	$scope.twup = new TWEEN.Tween()
    	.to({},500)
    	.easing(TWEEN.Easing.Sinusoidal.EaseInOut)
    	.onUpdate(function(){bend(tree,false,-1)});

    	$scope.twwater = new TWEEN.Tween()
    	.to({},9000)
    	.easing(TWEEN.Easing.Sinusoidal.EaseInOut)
    	.onUpdate(function(){water.update()});

    	$scope.twsun = new TWEEN.Tween()
    	.to({},5000)
    	.easing(TWEEN.Easing.Sinusoidal.EaseInOut)
    	.onUpdate(function(){sunshine.update()});

    	$scope.twfert = new TWEEN.Tween()
    	.to({},5000)
    	.easing(TWEEN.Easing.Sinusoidal.EaseInOut)
    	.onUpdate(function(){fertilizer.update()});

    	$scope.twpest = new TWEEN.Tween()
    	.to({},5000)
    	.easing(TWEEN.Easing.Sinusoidal.EaseInOut)
    	.onUpdate(function(){pesticide.update()});


    }

    /*********************************************************************************************************/
    /************************************************ ACTIONS ************************************************/
    /*********************************************************************************************************/

    $scope.water = function(){
    	var ctr = new THREE.Vector3(140, 900, 70);
    	water = new Action(0,500,watermat,ctr,300);
    	water.init();
    	scene.add(water.system);
    	$scope.twwater.start();
    	if($scope.sad<4){
    		setTimeout(function(){$scope.twdown.start();},2800);
    		setTimeout(function(){$scope.twup.start();$scope.scene.remove(water.system)},6000);
    	}
    }

    $scope.sunshine = function(){
    	var ctr = new THREE.Vector3(140, 500, 320);
    	sunshine = new Action(1,500,sunmat,ctr,300);
    	sunshine.init();
    	scene.add(sunshine.system);
    	$scope.twsun.start();
    	setTimeout(function(){scene.remove(sunshine.system);},4000);
    }

    $scope.fertilizer = function(){
    	var ctr = new THREE.Vector3(140, 150, 300);
    	fertilizer = new Action(2,300,fertmat,ctr,100);
    	fertilizer.init();
    	scene.add(fertilizer.system);
    	$scope.twfert.start();
    	setTimeout(function(){scene.remove(fertilizer.system);},5000);
    }

    $scope.pesticide = function(){
    	var ctr = new THREE.Vector3(130, 450, 320);
    	pesticide = new Action(1,500,pestmat,ctr,150);
    	pesticide.init();
    	scene.add(pesticide.system);
    	$scope.twpest.start();
    	setTimeout(function(){scene.remove(pesticide.system);},3000);
    }

    /*********************************************************************************************************/
    /************************************************ ACTIONS ************************************************/
    /*********************************************************************************************************/


    //main display function
    function animate() {
    	requestAnimationFrame( animate );
    	TWEEN.update();
    	renderer.render(scene, camera);
    }

    
    // dir +1 down, -1 up
    function bend(t, flag, dir){
    	var temp = new THREE.Vector3(0,1,0);
    	temp.normalize();
    	if(!(t instanceof Tree)){
    		t.position.add(new THREE.Vector3(0,dir*0.5,dir*(-0.5)));
    		return;
    	}
    	t.geometry.verticesNeedUpdate = true;
    	if(t.level >= 2){
    		for (var i=0; i<t.geometry.vertices.length; i++){
    			vert = t.geometry.vertices[i]; 
    			angle =dir*0.0001*i 
    			vert.applyAxisAngle (temp, angle);
    		}
    	}
    	for(var c=0; c<t.children.length; c++){
    		child = t.children[c];
    		bend(child,flag,dir);
    	}
    }

    function resizeHandler(){
    	camera.aspect = window.innerWidth / window.innerHeight;
    	camera.updateProjectionMatrix();
    	renderer.setSize( window.innerWidth, window.innerHeight );
    }


});
