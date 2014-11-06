angular.module("plantApp")
.controller("canvasCtrl",function($scope){
	$scope.test = "haha";
	$scope.WebGLNotDetected = false;

	if ( ! Detector.webgl ) {
		$scope.WebGLNotDetected = true;
	}

	var container, stats;
	var camera, scene, renderer,particles;
	var tree, treeContainer
	var treeRotGoal = Math.random()*360;;
	var planetMesh;
	var branchTexture, branchMaterial;
	var tweenScale,tweenRot, tweenScaleBack,tweenRotBack, sphereTween
	var skyMesh;

	var normalizedTween = 0;
	var startQ,endQ;

	try{
		init();
		animate();
		var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
		document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
	} catch(err) {}

	function init() {
		container = document.getElementById( 'container' );

		camera =  new THREE.Camera( 70, 1, 0.1, 8000);
		camera.position.z = -600;
		camera.position.y = 400;

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

        //fix camera direction
        var cameraTarget = new THREE.Object3D();
        cameraTarget.position.y = 400;
        camera.target = cameraTarget;
        
        scene = new THREE.Scene();
        scene.fog = new THREE.Fog( 0xaaccff, 0.1, 4500 );

        var light2 = new THREE.DirectionalLight( 0xffffff );
        light2.position.x = 1;
        light2.position.y = 1;
        light2.position.z = -2;
        light2.position.normalize();
        scene.addLight( light2 );

        var branchTexture = THREE.ImageUtils.loadTexture( "images/treebark.jpg" );
        branchTexture.minFilter = THREE.LinearFilter;
        branchTexture.magFilter = THREE.LinearFilter;
        branchTexture.wrapS = branchTexture.wrapT = THREE.RepeatWrapping
        branchMaterial = new THREE.MeshPhongMaterial( { map:branchTexture, shininess: 2, ambient:0x998822} );
        branchMaterial.shading = THREE.SmoothShading;
        
        //create tree, will timeout some milliseconds
        
        //tree = new Tree(branchMaterial, 0 , 55, 0, 1);
        tree = new Tree(branchMaterial, 0 , 55, 1);
        tree.position = new THREE.Vector3(0,50,0)

        tree.rotation.x = -90 * Math.PI / 180;
        tree.rotation.z = -90 * Math.PI / 180;
        tree.scale = new THREE.Vector3(0,0,0)
        
        //tree container
        treeContainer = new THREE.Object3D();
        treeContainer.useQuaternion = true;
        treeContainer.addChild( tree );
        
        //planetMesh.addChild( treeContainer );
        //scene.addObject(planetMesh);
        
        renderer = new THREE.WebGLRenderer( { clearColor:0xaaccff, clearAlpha: 1, antialias: true, sortObjects :false} );
        renderer.setSize( window.innerWidth-17, window.innerHeight-100 );

        container.innerHTML = "";
        container.appendChild( renderer.domElement );
        
        /*stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        container.appendChild( stats.domElement );*/

        //scene.addObject(planetMesh);
        scene.addObject(treeContainer);
        
        initAnimations()
        //renderer.render(scene,camera);
        
        //init events
        //document.addEventListener( 'mousedown', onDocumentMouseDown, false );
        //document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        //window.addEventListener( 'resize', onWindowResize, false );

    }

    function initAnimations() {
        //scale
        tweenScale = new TWEEN.Tween( tree.scale )
        .delay(2000)
        .to({x: 0.95, y: 0.95, z: 0.95}, 2000)
        .easing(TWEEN.Easing.Sinusoidal.EaseInOut)
        .onUpdate( scaleTweenUpdate )
        
        tweenScaleBack = new TWEEN.Tween(tree.scale , false)
        .to({  x: 0.05, y: 0.05, z: 0.05  }, 2000)
        .easing(TWEEN.Easing.Sinusoidal.EaseInOut)
        .onComplete( scaleDownComplete )
        .onUpdate( scaleTweenUpdate )
        
        //rotation
        tweenRot = new TWEEN.Tween(tree.rotation)
        .delay(2000)
        .to({ z: (treeRotGoal+360)* Math.PI / 180}, 2000)
        .easing(TWEEN.Easing.Quartic.EaseOut)

        tweenRotBack = new TWEEN.Tween(tree.rotation, false)
        .to({ z: treeRotGoal  * Math.PI / 180 }, 2000)
        .easing(TWEEN.Easing.Quartic.EaseIn);
        
        nextTree( true );
    }

    function nextTree( bInit ) {

        //prevent user from animate to early
        document.removeEventListener( 'mousedown', onDocumentMouseDown, false );

        if( bInit ) {
        	tweenRot.start();
        	tweenScale.start();
        }
        else {

            //prepare planet rotation
            startQ = new THREE.Quaternion().copy(planetMesh.quaternion)
            endQ = new THREE.Quaternion().setFromEuler( new THREE.Vector3(Math.random()*1500,Math.random()*1500,Math.random()*1500))

            normalizedTween = 0;
            sphereTween = new TWEEN.Tween(this)
            .to({ normalizedTween: 1 }, 5000)
            .delay(1000)
            .easing(TWEEN.Easing.Sinusoidal.EaseInOut)
            .onUpdate( rotatePlanetUpdate )
            .onComplete( onNextTreeComplete )
            sphereTween.start();  

            //animate camera
            var cameraTween = new TWEEN.Tween(camera.position)
            .to({ z: -2000 }, 2500)
            .delay(500)
            .easing(TWEEN.Easing.Sinusoidal.EaseInOut)
            cameraTween.start();  

            var cameraTweenBack = new TWEEN.Tween(camera.position)
            .to({ z: -600 }, 2500)
            .easing(TWEEN.Easing.Sinusoidal.EaseInOut)

            cameraTween.chain(cameraTweenBack);

            //stich tweens together
            tweenScaleBack.chain(tweenScale);
            tweenRotBack.chain(tweenRot);

            //all set,  start tween
            tweenScaleBack.start();
            tweenRotBack.start();

        }
    }

    //animation complete
    function onNextTreeComplete() {

    	tweenRot.to({ z: (treeRotGoal+360)* Math.PI / 180}, 2000)
    	tweenRotBack.to({ z: (treeRotGoal)* Math.PI / 180}, 2000)

    	treeRotGoal = Math.random()*360;

    	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    }

    //animation half way
    function scaleDownComplete() {
        //change rotation (position) to new spot
        treeContainer.quaternion = new THREE.Quaternion().copy(endQ).inverse();
    }

    //update upon planet rotation tween
    function rotatePlanetUpdate( event) {
    	var resultQ =  new THREE.Quaternion();
    	THREE.Quaternion.slerp( startQ,endQ, resultQ, normalizedTween)
    	planetMesh.quaternion = resultQ;
    	skyMesh.quaternion = resultQ;

    }

    //scale tween update
    function scaleTweenUpdate( event ) {
    	updateScaleRecursive( tree );
    }

    //recursivly update all branch childs
    function updateScaleRecursive( child  ) {
    	for ( var c = 0; c < child.children.length; c++ ) {
    		updateScaleRecursive( child.children[ c ] );
    		child.children[ c ].scale = child.scale;  
    	}
    }

    //game loop
    function animate() {
    	requestAnimationFrame( animate );
    	TWEEN.update();
    	renderer.render(scene, camera);
        //stats.update();
    }

    /***************
    * Event handlers
    ****************/

    function onDocumentMouseMove( event ) {
    	event.preventDefault();
        //mouse2D.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        //mouse2D.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    }

    function onDocumentMouseDown( event ) {
    	event.preventDefault();

        //show tree grow animation
        nextTree(false);
    }

    function onWindowResize(){
    	camera.aspect = window.innerWidth / window.innerHeight;
    	camera.updateProjectionMatrix();

    	renderer.setSize( window.innerWidth, window.innerHeight );
    }
    try{
    	var pageTracker = _gat._getTracker("UA-181266-1");
    	pageTracker._trackPageview();
    } catch(err) {}
});
