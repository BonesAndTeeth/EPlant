angular.module("plantApp")
.controller("canvasCtrl",function($scope){
	$scope.test = "haha";
	$scope.WebGLNotDetected = false;

    //Show error message if the user's browser does not support webGL
	if ( ! Detector.webgl ) {
		$scope.WebGLNotDetected = true;
	}

	var container, camera, scene, renderer;
    var tree, treeContainer;
    var treeTexture, branchMaterial;

	try{
		init();
        drawTree();
        animate();
		var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
		document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
	} catch(err) {}

      //initialization
      function init() {

        container = document.getElementById( 'container' );

        //set up camera and viewing matrix
        camera =  new THREE.Camera( 70, 1, 0.1, 8000);
        camera.position.z = -600;
        camera.position.y = 400;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        var cameraTarget = new THREE.Object3D();
        cameraTarget.position.y = 400;
        camera.target = cameraTarget;
        
        //create scene
        scene = new THREE.Scene();

        //add light source (white light)
        var light = new THREE.DirectionalLight( 0xffffff );
        light.position.x = 1;
        light.position.y = 1;
        light.position.z = -2;
        light.position.normalize();
        scene.addLight( light );
      
        //create texture from image 
        var treeTexture = THREE.ImageUtils.loadTexture( "images/treebark.jpg" );
        treeTexture.minFilter = THREE.LinearFilter;
        treeTexture.magFilter = THREE.LinearFilter;
        treeTexture.wrapS = treeTexture.wrapT = THREE.RepeatWrapping
        branchMaterial = new THREE.MeshPhongMaterial( { map:treeTexture, shininess: 2, ambient:0x998822} );
        branchMaterial.shading = THREE.SmoothShading;
        
        //create tree object and add object to the scene
        tree = new Tree(branchMaterial, 0 , 35, 1, null);
        tree.position = new THREE.Vector3(0,50,0)
        tree.rotation.x = -90 * Math.PI / 180;
        tree.rotation.z = -90 * Math.PI / 180;
        //invisible at first
        tree.scale = new THREE.Vector3(0,0.1,0)
        treeContainer = new THREE.Object3D();
        treeContainer.useQuaternion = true;
        treeContainer.addChild( tree );
        scene.addObject(treeContainer);
        
        //set up renderer
        renderer = new THREE.WebGLRenderer( { clearColor:0xaaccff, clearAlpha: 1, antialias: true, sortObjects :false} );
        renderer.setSize( window.innerWidth-17, window.innerHeight-90 );

        container.innerHTML = "";
        container.appendChild( renderer.domElement );

        //rescale and position object on resize
        window.addEventListener( 'resize', resizeHandler, false );
          
      }

      //scale the tree up to actual size of object
      function drawTree() {
        new TWEEN.Tween( tree.scale )
        .delay(1000)
        .to({x: 1, y: 1, z: 1}, 2000)
        .easing(TWEEN.Easing.Sinusoidal.EaseInOut)
        .start();
      
      }

      //main display function
      function animate() {
        requestAnimationFrame( animate );
        TWEEN.update();
        renderer.render(scene, camera);
      }
      
      
      function resizeHandler(){
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
      }
      
    try{
    	var pageTracker = _gat._getTracker("UA-181266-1");
    	pageTracker._trackPageview();
    } catch(err) {}
});
