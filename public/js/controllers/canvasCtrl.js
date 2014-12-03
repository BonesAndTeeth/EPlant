/**
 *  based on http://inear.se/three_tree/
 * 
 */
angular.module("plantApp")
.controller("canvasCtrl",function($scope, answerservice, settreeservice){
	$scope.WebGLNotDetected = false;
    $scope.sad = false;
    //Show error message if the user's browser does not support webGL
	if ( ! Detector.webgl ) {
		$scope.WebGLNotDetected = true;
	}
	var container, camera, scene, renderer;
    var tree, _tree;
    var treeTexture, branchMaterial;
    var branchTexImgs = ["images/treebark1.jpg","images/treebark2.jpg","images/treebark3.jpg"];
    var leafTexImgs =[  "images/leaf1.png","images/leaf2.png","images/leaf3.png",
                        "images/leaf4.png","images/leaf5.png","images/leaf6.png"
                    ];

    /* animates leaves on receival of correct answer */
    $scope.$on('rightanswerevent',function(){
        if($scope.sad){
            $scope.twup.start();
        }
        else{
            $scope.animateleaf();
        }
        $scope.sad = false;
    });

    $scope.$on('wronganswerevent',function(){
        if(!$scope.sad){
            $scope.twdown.start();
        }
        $scope.sad = true;
    });

    $scope.$on('btexevent',function(e,tid){
        $scope.setbarktexture(tid);
    });

    $scope.$on('ltexevent',function(e,tid){
        $scope.setleaftexture(tid);
    });

	//try{
		init();
        drawTree();
        animate();
	//} catch(err) {}

      //initialization
      function init() {

        container = document.getElementById( 'container' );
        /*container = document.createElement( 'div' );
        container.id="container";
        document.body.appendChild( container );*/ 

        //create scene
        scene = new THREE.Scene();

        //set up camera and viewing matrix
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.position.z = 800;
        camera.position.y = 400;
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
        tree = new Tree(branchMaterial, 0 , 25, 1);

        //invisible at first
        $scope.tree = tree;

        _tree.position.set(120,130,350);
        tree.rotation.x = -90 * Math.PI / 180;
        tree.rotation.z = -90 * Math.PI / 180;
        
        _tree.add(tree);
        //console.log(tree.tree);

        scene.add(_tree);

        //set up renderer
        renderer = new THREE.WebGLRenderer( { antialias: true} );
        renderer.setSize( window.innerWidth-17, window.innerHeight-70 );
        renderer.setClearColor(0xccffff)

        container.innerHTML = "";
        container.appendChild( renderer.domElement );

        //rescale and position object on resize
        window.addEventListener( 'resize', resizeHandler, false );
          
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
        //tree.material.map = THREE.ImageUtils.loadTexture( "images/treebark2.jpg" );
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

        var start ={x:0}
        var flag = true;
        $scope.twdown = new TWEEN.Tween(start)
        .delay(600)
        .to({x:0},1500)
        .easing(TWEEN.Easing.Sinusoidal.EaseInOut)
        .onUpdate(function(){bend(tree,flag,1);flag=false;});

        var flag1 = true;
        $scope.twup = new TWEEN.Tween(start)
        .delay(600)
        .to({x:0},1500)
        .easing(TWEEN.Easing.Sinusoidal.EaseInOut)
        .onUpdate(function(){bend(tree,flag1,-1),flag1=false;});

        //twdown.chain(twup);
        //twdown.start();
      
      }

      //main display function
      function animate() {
        requestAnimationFrame( animate );
        //tree.rotation.z +=0.01
        TWEEN.update();
        renderer.render(scene, camera);
      }

      
      // dir +1 down, -1 up
      function bend(t, flag, dir){
        var temp = new THREE.Vector3(0,1,0);
        temp.normalize();
        if(!(t instanceof Tree)){
            t.position.add(new THREE.Vector3(0,dir*0.5,dir*(-0.5)));
            /*if(flag){
                if(dir<0)
                    t.toGreen.start();
                else
                    t.toRed.start();
            }*/
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
